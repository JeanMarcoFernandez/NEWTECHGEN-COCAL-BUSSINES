import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../db.js';
import dotenv from 'dotenv';
import { registrarAuditoria } from '../services/auditoriaService.js';

const MAX_INTENTOS = parseInt(process.env.MAX_INTENTOS || '5', 10);
const BLOQUEO_MINUTOS = parseInt(process.env.BLOQUEO_MINUTOS || '15', 10);

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

    // Cifrar contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Registrar usuario normal (sin primer_login ni creado_por)
    const { error } = await supabase.from('usuario').insert([
      {
        correo,
        contrasena: hash,
        nombre,
        apellido,
        rol: rol || 'CLIENTE',
        primer_login: false, 
        creado_por: null
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

    // Verificar contraseña
    const esValido = await bcrypt.compare(contrasena, user.contrasena);
    if (!esValido) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

  
    if (user.primer_login && user.creado_por !== null) {
      return res.status(200).json({
        message: 'Debe cambiar su contraseña antes de continuar.',
        requerirCambio: true
      });
    }

    
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

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
