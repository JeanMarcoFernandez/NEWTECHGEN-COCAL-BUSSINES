import { q } from '../db.js';
import bcrypt from 'bcrypt';

export async function list(req,res,next){
  try { res.json(await q('SELECT id, correo, nombre, apellido, rol, estado, id_empresa FROM usuario ORDER BY id DESC')); }
  catch(e){ next(e); }
}

export async function create(req,res,next){
  try {
    const { id_empresa, correo, contrasena, nombre, apellido, cargo, rol='EMPLEADO', telefono } = req.body;
    const hash = await bcrypt.hash(contrasena, Number(process.env.BCRYPT_ROUNDS || 10));
    const rows = await q(
      `INSERT INTO usuario (id_empresa,correo,contrasena,nombre,apellido,cargo,rol,telefono)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, correo, nombre, apellido, rol, id_empresa`,
      [id_empresa,correo,hash,nombre,apellido,cargo,rol,telefono]
    );
    res.status(201).json(rows[0]);
  } catch(e){ next(e); }
}
