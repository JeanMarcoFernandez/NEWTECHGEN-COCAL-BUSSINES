// models/recursoModel.js
import { supabase } from '../db.js';

// Crear recurso
export async function crearRecursoDB(payload) {
  const { data, error } = await supabase
    .from('recurso')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// Listar recursos con filtros básicos (empresa, departamento, tipo, visibilidad)
// Listar recursos con filtros básicos (empresa, departamento, tipo, visibilidad)
export async function listarRecursosDB(filtros = {}) {
  let query = supabase.from('recurso').select('*');

  if (filtros.id_empresa) {
    query = query.eq('id_empresa', filtros.id_empresa);
  }

  if (filtros.id_departamento !== null && !isNaN(filtros.id_departamento)) {
    query = query.eq('id_departamento', Number(filtros.id_departamento));
  }

  if (filtros.tipo) {
    query = query.eq('tipo', filtros.tipo);
  }

  if (filtros.visibilidad) {
    query = query.eq('visibilidad', filtros.visibilidad);
  }

  if (typeof filtros.en_mantenimiento === 'boolean') {
    query = query.eq('en_mantenimiento', filtros.en_mantenimiento);
  }

  const { data, error } = await query.order('id', { ascending: true });

  if (error) throw error;
  return data;
}


// Obtener recurso por ID
export async function obtenerRecursoPorIdDB(id) {
  const { data, error } = await supabase
    .from('recurso')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Actualizar recurso
export async function actualizarRecursoDB(id, campos) {
  const { data, error } = await supabase
    .from('recurso')
    .update(campos)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}
