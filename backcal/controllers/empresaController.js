import { supabase } from '../db.js';


export async function list(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('empresa')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('❌ Error al listar empresas:', e.message);
    next(e);
  }
}


export async function create(req, res, next) {
  try {
    const { nombre, nit, rubro, direccion, telefono, sitio_web } = req.body;

    const { data, error } = await supabase
      .from('empresa')
      .insert([{ nombre, nit, rubro, direccion, telefono, sitio_web }])
      .select('*')
      .single(); 

    if (error) throw error;

    res.status(201).json(data);
  } catch (e) {
    console.error('❌ Error al crear empresa:', e.message);
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre, nit, rubro, direccion, telefono, sitio_web } = req.body;

    const { data, error } = await supabase
      .from('empresa')
      .update({ nombre, nit, rubro, direccion, telefono, sitio_web })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    res.json(data);
  } catch (e) {
    console.error('❌ Error al actualizar empresa:', e.message);
    next(e);
  }
}


export async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('empresa').delete().eq('id', id);
    if (error) throw error;

    res.json({ ok: true });
  } catch (e) {
    console.error('❌ Error al eliminar empresa:', e.message);
    next(e);
  }
}
