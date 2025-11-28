
// models/eventoDepartamentoModel.js
import { supabase } from '../db.js';

// Crear evento de departamento
export async function crearEventoDepartamentoModel({
  id_calendario_grupo,
  titulo,
  descripcion,
  tipo,
  fecha_inicio,
  fecha_fin,
  responsable,
  estado,
  visibilidad,
}) {
  const payload = {
    id_calendario_grupo,
    titulo,
  };

  if (descripcion !== undefined) payload.descripcion = descripcion;
  if (tipo !== undefined) payload.tipo = tipo;
  if (fecha_inicio !== undefined) payload.fecha_inicio = fecha_inicio;
  if (fecha_fin !== undefined) payload.fecha_fin = fecha_fin;
  if (responsable !== undefined) payload.responsable = responsable;
  if (estado !== undefined) payload.estado = estado;
  if (visibilidad !== undefined) payload.visibilidad = visibilidad;

  const { data, error } = await supabase
    .from('evento_departamento')
    .insert([payload])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// Listar eventos por calendario_de_departamento
export async function obtenerEventosDepartamentoPorCalendario(id_calendario_grupo) {
  const { data, error } = await supabase
    .from('evento_departamento')
    .select('*')
    .eq('id_calendario_grupo', id_calendario_grupo)
    .order('fecha_inicio', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Obtener un evento_departamento por id
export async function obtenerEventoDepartamentoPorId(id) {
  const { data, error } = await supabase
    .from('evento_departamento')
    .select('*')
    .eq('id', id)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

// Actualizar evento_departamento (patch)
export async function actualizarEventoDepartamentoModel(id_evento, datos) {
  const updateData = {};

  if (datos.titulo !== undefined) updateData.titulo = datos.titulo;
  if (datos.descripcion !== undefined) updateData.descripcion = datos.descripcion;
  if (datos.tipo !== undefined) updateData.tipo = datos.tipo;
  if (datos.fecha_inicio !== undefined) updateData.fecha_inicio = datos.fecha_inicio;
  if (datos.fecha_fin !== undefined) updateData.fecha_fin = datos.fecha_fin;
  if (datos.responsable !== undefined) updateData.responsable = datos.responsable;
  if (datos.estado !== undefined) updateData.estado = datos.estado;
  if (datos.visibilidad !== undefined) updateData.visibilidad = datos.visibilidad;

  if (Object.keys(updateData).length === 0) {
    return await obtenerEventoDepartamentoPorId(id_evento);
  }

  const { data, error } = await supabase
    .from('evento_departamento')
    .update(updateData)
    .eq('id', id_evento)
    .select('*')
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

// Eliminar evento_departamento
export async function eliminarEventoDepartamentoModel(id_evento) {
  const { error } = await supabase
    .from('evento_departamento')
    .delete()
    .eq('id', id_evento);

  if (error) throw error;
}
