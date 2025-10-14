import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { q } from '../db.js';
import dotenv from 'dotenv';
dotenv.config();

export async function login(req, res, next) {
  try {
    const { correo, contrasena } = req.body;
    const [u] = await q('SELECT * FROM usuario WHERE correo=$1', [correo]);
    if (!u) return res.status(401).json({ ok:false, message:'Credenciales inválidas' });

    const ok = await bcrypt.compare(contrasena, u.contrasena);
    if (!ok) return res.status(401).json({ ok:false, message:'Credenciales inválidas' });

    const token = jwt.sign({ id:u.id, rol:u.rol, id_empresa:u.id_empresa }, process.env.JWT_SECRET, { expiresIn:'24h' });
    res.json({ ok:true, token, user:{ id:u.id, nombre:u.nombre, apellido:u.apellido, rol:u.rol }});
  } catch (e) { next(e); }
}

export async function me(req, res) {
  // en front usaremos el token; si quieres validar aquí, añade un middleware verifyToken
  res.json({ ok:true, message:'endpoint me listo (agrega verifyToken si deseas)' });
}

// semilla de admin (DEV)
export async function seedAdmin(req, res, next) {
  try {
    const { correo='admin@cocal.dev', pass='admin123', id_empresa=1 } = req.body || {};
    const hash = await bcrypt.hash(pass, Number(process.env.BCRYPT_ROUNDS || 10));
    const rows = await q(`
      INSERT INTO usuario (id_empresa, correo, contrasena, nombre, apellido, cargo, rol)
      VALUES ($1,$2,$3,'Admin','Global','CTO','ADMIN')
      ON CONFLICT (correo) DO NOTHING
      RETURNING id, correo`, [id_empresa, correo, hash]);
    res.json({ ok:true, created: rows[0] || null });
  } catch (e) { next(e); }
}
