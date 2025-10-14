import { q } from '../db.js';

export async function list(req,res,next){
  try { res.json(await q('SELECT * FROM departamento ORDER BY id DESC')); } catch(e){ next(e); }
}
export async function listByEmpresa(req,res,next){
  try { res.json(await q('SELECT * FROM departamento WHERE id_empresa=$1 ORDER BY id DESC', [req.params.idEmpresa])); } catch(e){ next(e); }
}
export async function create(req,res,next){
  try {
    const { id_empresa, nombre, descripcion, area, visibilidad } = req.body;
    const rows = await q(
      `INSERT INTO departamento (id_empresa,nombre,descripcion,area,visibilidad)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [id_empresa,nombre,descripcion,area,visibilidad]
    );
    res.status(201).json(rows[0]);
  } catch(e){ next(e); }
}
export async function update(req,res,next){
  try {
    const { id } = req.params;
    const { nombre, descripcion, area, visibilidad } = req.body;
    const rows = await q(
      `UPDATE departamento SET nombre=$1, descripcion=$2, area=$3, visibilidad=$4
       WHERE id=$5 RETURNING *`,
      [nombre,descripcion,area,visibilidad,id]
    );
    res.json(rows[0]);
  } catch(e){ next(e); }
}
export async function remove(req,res,next){
  try { await q('DELETE FROM departamento WHERE id=$1',[req.params.id]); res.json({ ok:true }); }
  catch(e){ next(e); }
}
