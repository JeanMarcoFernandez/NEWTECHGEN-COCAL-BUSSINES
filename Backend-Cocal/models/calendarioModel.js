// models/calendarioModel.js
import { supabase } from '../db.js';

// Crear calendario personal de usuario
export async function crearCalendarioUsuarioModel({ id_usuario, nombre, zona_horaria }) {
  const payload = {
    id_usuario,
    nombre,
    zona_horaria,
  };

  const { data, error } = await supabase
    .from('calendario')
    .insert([payload])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// Listar calendarios personales por usuario
export async function obtenerCalendariosDeUsuario(id_usuario) {
  const { data, error } = await supabase
    .from('calendario')
    .select('*')
    .eq('id_usuario', id_usuario)
    .order('id', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Obtener un calendario por id
export async function obtenerCalendarioPorId(id) {
  const { data, error } = await supabase
    .from('calendario')
    .select('*')
    .eq('id', id)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}
