import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { supabase } from '../db.js';
import dotenv from 'dotenv';
dotenv.config();


export async function login(req, res, next) {
  try {
    const { correo, contrasena } = req.body;

    
    const { data: usuarios, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('correo', correo)
      .limit(1);

    if (error) throw error;
    const u = usuarios[0];

    if (!u)
      return res
        .status(401)
        .json({ ok: false, message: 'Credenciales inválidas' });

    
    const ok = await bcrypt.compare(contrasena, u.contrasena);
    if (!ok)
      return res
        .status(401)
        .json({ ok: false, message: 'Credenciales inválidas' });

    
    const token = jwt.sign(
      { id: u.id, rol: u.rol, id_empresa: u.id_empresa },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      ok: true,
      token,
      user: {
        id: u.id,
        nombre: u.nombre,
        apellido: u.apellido,
        rol: u.rol,
      },
    });
  } catch (e) {
    console.error('❌ Error en login:', e.message);
    next(e);
  }
}


export async function me(req, res) {
  res.json({
    ok: true,
    message: 'endpoint me listo (agrega verifyToken si deseas)',
  });
}

export async function seedAdmin(req, res, next) {
  try {
    const { correo = 'admin@cocal.dev', pass = 'admin123', id_empresa = 1 } =
      req.body || {};

    const hash = await bcrypt.hash(
      pass,
      Number(process.env.BCRYPT_ROUNDS || 10)
    );

    const { data, error } = await supabase
      .from('usuario')
      .insert([
        {
          id_empresa,
          correo,
          contrasena: hash,
          nombre: 'Admin',
          apellido: 'Global',
          cargo: 'CTO',
          rol: 'ADMIN',
        },
      ])
      .select('id, correo')
      .single();

    if (error && error.code !== '23505') throw error; 

    res.json({ ok: true, created: data || null });
  } catch (e) {
    console.error('❌ Error al crear admin:', e.message);
    next(e);
  }
}
