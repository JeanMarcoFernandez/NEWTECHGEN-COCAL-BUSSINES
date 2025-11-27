// models/eventoModel.js
import { supabase } from '../db.js';

// Crear evento en un calendario
export async function crearEventoModel({
  id_calendario,
  titulo,
  descripcion,
  tipo,
  fecha_inicio,
  fecha_fin,
  responsable,
  visibilidad,
}) {
  const payload = {
    id_calendario,
    titulo,
    descripcion,
    tipo,
    fecha_inicio,
    fecha_fin,
    responsable,
    visibilidad,
  };

  const { data, error } = await supabase
    .from('evento')
    .insert([payload])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// Listar eventos por calendario
export async function obtenerEventosPorCalendario(id_calendario) {
  const { data, error } = await supabase
    .from('evento')
    .select('*')
    .eq('id_calendario', id_calendario)
    .order('fecha_inicio', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Obtener evento por id
export async function obtenerEventoPorId(id) {
  const { data, error } = await supabase
    .from('evento')
    .select('*')
    .eq('id', id)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

// Actualizar evento (base)
export async function actualizarEventoModelBase(id, datos) {
  const { titulo, descripcion, tipo, fecha_inicio, fecha_fin, responsable, estado, visibilidad } =
    datos;

  const updateData = {};
  if (titulo !== undefined) updateData.titulo = titulo;
  if (descripcion !== undefined) updateData.descripcion = descripcion;
  if (tipo !== undefined) updateData.tipo = tipo;
  if (fecha_inicio !== undefined) updateData.fecha_inicio = fecha_inicio;
  if (fecha_fin !== undefined) updateData.fecha_fin = fecha_fin;
  if (responsable !== undefined) updateData.responsable = responsable;
  if (estado !== undefined) updateData.estado = estado;
  if (visibilidad !== undefined) updateData.visibilidad = visibilidad;

  if (Object.keys(updateData).length === 0) {
    return await obtenerEventoPorId(id);
  }

  const { data, error } = await supabase
    .from('evento')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

// Eliminar evento
export async function eliminarEventoModel(id) {
  const { error } = await supabase
    .from('evento')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
