// models/calendarioModel.js
import { supabase } from '../db.js';

// Crear calendario de usuario
export async function crearCalendarioUsuarioModel({ id_usuario, nombre, zona_horaria }) {
  const payload = { id_usuario };

  if (nombre !== undefined) payload.nombre = nombre;
  if (zona_horaria !== undefined) payload.zona_horaria = zona_horaria;

  const { data, error } = await supabase
    .from('calendario')
    .insert([payload])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// Listar calendarios de un usuario
export async function obtenerCalendariosDeUsuario(id_usuario) {
  const { data, error } = await supabase
    .from('calendario')
    .select('*')
    .eq('id_usuario', id_usuario)
    .order('id', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Obtener calendario por id
export async function obtenerCalendarioPorId(id) {
  const { data, error } = await supabase
    .from('calendario')
    .select('*')
    .eq('id', id)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

//NUEVO: actualizar calendario (PATCH base)
export async function actualizarCalendarioModelBase(id, updateData) {
  const { data, error } = await supabase
    .from('calendario')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

//NUEVO: eliminar calendario
export async function eliminarCalendarioModel(id) {
  const { error } = await supabase
    .from('calendario')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
