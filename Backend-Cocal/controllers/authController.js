import bcrypt from 'bcrypt';
import { supabase } from '../db.js';
import dotenv from 'dotenv';
import { registrarAuditoria } from '../services/auditoriaService.js';
import { generarToken } from '../utils/generarToken.js'; // 🔹 nuevo import

dotenv.config();

export async function registrarUsuario(req, res) {
  try {
    const { correo, contrasena, nombre, apellido, rol } = req.body;

    const { data: existente } = await supabase
      .from('usuario')
      .select('id')
      .eq('correo', correo)
      .single();

    if (existente) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    const { error } = await supabase.from('usuario').insert([
      {
        correo,
        contrasena: hash,
        nombre,
        apellido,
        rol: rol || 'CLIENTE',
        primer_login: false,
        creado_por: null,
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
  }
}

export async function loginUsuario(req, res) {
  try {
    const { correo, contrasena } = req.body;

    const { data: user, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('correo', correo)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    const esValido = await bcrypt.compare(contrasena, user.contrasena);
    if (!esValido) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    if (user.primer_login && user.creado_por !== null) {
      return res.status(200).json({
        message: 'Debe cambiar su contraseña antes de continuar.',
        requerirCambio: true,
      });
    }

    // 🔹 Generar token desde util
    const token = generarToken({ id: user.id, rol: user.rol });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rol,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
}
