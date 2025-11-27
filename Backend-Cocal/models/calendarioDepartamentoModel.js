// models/calendarioDepartamentoModel.js
import { supabase } from '../db.js';

// Crear calendario de departamento (calendario_grupo)
export async function crearCalendarioDepartamentoModel({
  id_proyecto,
  id_departamento,
  nombre,
  descripcion,
  zona_horaria,
  creado_por,
}) {
  const payload = {
    id_proyecto,
    id_departamento,
    nombre,
    creado_por,
  };

  if (descripcion !== undefined) payload.descripcion = descripcion;
  if (zona_horaria !== undefined) payload.zona_horaria = zona_horaria;

  const { data, error } = await supabase
    .from('calendario_grupo')
    .insert([payload])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// Listar calendarios de departamento por proyecto
export async function obtenerCalendariosDepartamentoPorProyecto(id_proyecto) {
  const { data, error } = await supabase
    .from('calendario_grupo')
    .select('*')
    .eq('id_proyecto', id_proyecto)
    .order('id', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Listar calendarios de un departamento (en todos los proyectos)
export async function obtenerCalendariosPorDepartamento(id_departamento) {
  const { data, error } = await supabase
    .from('calendario_grupo')
    .select('*')
    .eq('id_departamento', id_departamento)
    .order('id', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Obtener un calendario_grupo por id
export async function obtenerCalendarioGrupoPorId(id) {
  const { data, error } = await supabase
    .from('calendario_grupo')
    .select('*')
    .eq('id', id)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

// Actualizar calendario_grupo (patch)
export async function actualizarCalendarioGrupoModel(id, datos) {
  const { nombre, descripcion, zona_horaria } = datos;

  const updateData = {};
  if (nombre !== undefined) updateData.nombre = nombre;
  if (descripcion !== undefined) updateData.descripcion = descripcion;
  if (zona_horaria !== undefined) updateData.zona_horaria = zona_horaria;

  if (Object.keys(updateData).length === 0) {
    return await obtenerCalendarioGrupoPorId(id);
  }

  const { data, error } = await supabase
    .from('calendario_grupo')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

// Eliminar calendario_grupo
export async function eliminarCalendarioGrupoModel(id) {
  const { error } = await supabase
    .from('calendario_grupo')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
