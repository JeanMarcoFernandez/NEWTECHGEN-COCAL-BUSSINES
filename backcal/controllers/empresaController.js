import { q } from '../db.js';

export async function list(req,res,next){
  try { res.json(await q('SELECT * FROM empresa ORDER BY id DESC')); } catch(e){ next(e); }
}
export async function create(req,res,next){
  try {
    const { nombre, nit, rubro, direccion, telefono, sitio_web } = req.body;
    const rows = await q(
      `INSERT INTO empresa (nombre,nit,rubro,direccion,telefono,sitio_web)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [nombre,nit,rubro,direccion,telefono,sitio_web]
    );
    res.status(201).json(rows[0]);
  } catch(e){ next(e); }
}
export async function update(req,res,next){
  try {
    const { id } = req.params;
    const { nombre, nit, rubro, direccion, telefono, sitio_web } = req.body;
    const rows = await q(
      `UPDATE empresa SET nombre=$1,nit=$2,rubro=$3,direccion=$4,telefono=$5,sitio_web=$6
       WHERE id=$7 RETURNING *`,
      [nombre,nit,rubro,direccion,telefono,sitio_web,id]
    );
    res.json(rows[0]);
  } catch(e){ next(e); }
}
export async function remove(req,res,next){
  try { await q('DELETE FROM empresa WHERE id=$1', [req.params.id]); res.json({ ok:true }); }
  catch(e){ next(e); }
}
