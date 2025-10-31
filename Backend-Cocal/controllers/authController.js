import bcrypt from 'bcrypt';
import { supabase } from '../db.js';
import dotenv from 'dotenv';
import { registrarAuditoria } from '../services/auditoriaService.js';
import { generarToken } from '../utils/generarToken.js';
import { getClientIp, getUserAgent } from '../utils/requestInfo.js';
import {
  incrementarIntentoFallido,
  resetearIntentos,
  getUsuarioPorCorreo,
} from '../services/authAttemptsService.js';
import { enviarCodigo2FA } from './twoFactorController.js';
import { verificarCambioIP } from '../services/ipCheckService.js';

dotenv.config();

const MAX_INTENTOS = parseInt(process.env.MAX_INTENTOS || '5', 10);
const BLOQUEO_MINUTOS = parseInt(process.env.BLOQUEO_MINUTOS || '15', 10);

export async function registrarUsuario(req, res) {
  try {
    const { correo, contrasena, nombre, apellido, cargo, rol, telefono } = req.body;

    const { data: existente } = await supabase
      .from('usuario')
      .select('id')
      .eq('correo', correo)
      .single();

    if (existente) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    const { error } = await supabase.from('usuario').insert([{
      correo,
      contrasena: hash,
      nombre,
      apellido,
      cargo,
      rol: rol || 'EMPLEADO',
      telefono,
      primer_login: false,
      creado_por: null,
    }]);

    if (error) throw error;
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
  }
}

export async function loginUsuario(req, res) {
  const ip = getClientIp(req);
  const userAgent = getUserAgent(req);

  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena)
      return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });

    const { data: user, error } = await getUsuarioPorCorreo(correo);
    if (error || !user) {
      await registrarAuditoria({
        correo,
        exito: false,
        motivo: 'USUARIO_NO_EXISTE',
        ip,
        user_agent: userAgent,
      });
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    if (user.bloqueado_hasta && new Date(user.bloqueado_hasta) > new Date()) {
      await registrarAuditoria({
        usuario_id: user.id,
        correo,
        exito: false,
        motivo: 'USUARIO_BLOQUEADO',
        ip,
        user_agent: userAgent,
      });
      return res.status(403).json({
        message: `Cuenta bloqueada hasta ${new Date(user.bloqueado_hasta).toLocaleString()}.`,
      });
    }

    const esValido = await bcrypt.compare(contrasena, user.contrasena);
    if (!esValido) {
      const nuevosIntentos = (user.intentos_fallidos || 0) + 1;
      let bloqueo = null;
      if (nuevosIntentos >= MAX_INTENTOS)
        bloqueo = new Date(Date.now() + BLOQUEO_MINUTOS * 60000);

      await incrementarIntentoFallido(user.id, nuevosIntentos, bloqueo);
      await registrarAuditoria({
        usuario_id: user.id,
        correo,
        exito: false,
        motivo: bloqueo ? 'CUENTA_BLOQUEADA' : 'CONTRASENA_INCORRECTA',
        ip,
        user_agent: userAgent,
      });

      return res.status(401).json({
        message: bloqueo
          ? `Demasiados intentos fallidos. Cuenta bloqueada por ${BLOQUEO_MINUTOS} minutos.`
          : 'Contraseña incorrecta.',
        intentos_restantes: bloqueo ? 0 : MAX_INTENTOS - nuevosIntentos,
      });
    }

    await resetearIntentos(user.id);

    await verificarCambioIP(user, ip);

    await registrarAuditoria({
      usuario_id: user.id,
      correo,
      exito: true,
      motivo: 'LOGIN_EXITOSO - ENVIAR_2FA',
      ip,
      user_agent: userAgent,
    });

    if (user.primer_login && user.creado_por !== null) {
      return res.status(200).json({
        message: 'Debe cambiar su contraseña antes de continuar.',
        requerirCambio: true,
      });
    }

    // 🔐 Enviar código 2FA automáticamente (reutilizando tu controlador)
    await enviarCodigo2FA(user.id, user.correo, user.nombre);

    return res.status(200).json({
      message: 'Inicio de sesión correcto. Código 2FA enviado al correo.',
      requiere2FA: true,
      correo: user.correo,
      usuario_id: user.id,
      nombre: user.nombre,
    });

  } catch (err) {
    console.error('Error en loginUsuario:', err.message);
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
}
