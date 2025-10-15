import { supabase } from '../db.js';


export async function list(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('departamento')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('❌ Error al listar departamentos:', e.message);
    next(e);
  }
}


export async function listByEmpresa(req, res, next) {
  try {
    const idEmpresa = req.params.idEmpresa;

    const { data, error } = await supabase
      .from('departamento')
      .select('*')
      .eq('id_empresa', idEmpresa)
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('❌ Error al listar departamentos por empresa:', e.message);
    next(e);
  }
}


export async function create(req, res, next) {
  try {
    const { id_empresa, nombre, descripcion, area, visibilidad } = req.body;

    const { data, error } = await supabase
      .from('departamento')
      .insert([{ id_empresa, nombre, descripcion, area, visibilidad }])
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    console.error('❌ Error al crear departamento:', e.message);
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre, descripcion, area, visibilidad } = req.body;

    const { data, error } = await supabase
      .from('departamento')
      .update({ nombre, descripcion, area, visibilidad })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('❌ Error al actualizar departamento:', e.message);
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('departamento').delete().eq('id', id);
    if (error) throw error;

    res.json({ ok: true });
  } catch (e) {
    console.error('❌ Error al eliminar departamento:', e.message);
    next(e);
  }
}
