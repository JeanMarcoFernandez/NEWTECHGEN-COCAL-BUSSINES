import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../db.js';
import dotenv from 'dotenv';
dotenv.config();

export async function registrarUsuario(req, res) {
  try {
    const { correo, contrasena, nombre, apellido, rol } = req.body;

    const { data: existente } = await supabase
      .from('usuario')
      .select('*')
      .eq('correo', correo)
      .single();

    if (existente) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    const { error } = await supabase.from('usuario').insert([
      { correo, contrasena: hash, nombre, apellido, rol: rol || 'EMPLEADO' },
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

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: { id: user.id, nombre: user.nombre, rol: user.rol },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
}
