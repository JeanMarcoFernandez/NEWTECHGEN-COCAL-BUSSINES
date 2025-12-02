// models/calendarioEmpresaModel.js
import { supabase } from '../db.js';

export async function crearCalendarioEmpresaModel({
  id_proyecto,
  id_empresa,
  nombre,
  descripcion,
  zona_horaria,
  creado_por,
}) {
  const payload = {
    id_proyecto,
    id_empresa,
    nombre,
    descripcion,
    zona_horaria,
    creado_por,
  };

  const { data, error } = await supabase
    .from('calendario_empresa')
    .insert([payload])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function obtenerCalendarioEmpresaPorId(id) {
  const { data, error } = await supabase
    .from('calendario_empresa')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data || null;
}

export async function obtenerCalendariosEmpresaPorProyecto({
  id_proyecto,
  id_empresa,
}) {
  const { data, error } = await supabase
    .from('calendario_empresa')
    .select('*')
    .eq('id_proyecto', id_proyecto)
    .eq('id_empresa', id_empresa)
    .order('id', { ascending: true });

  if (error) throw error;
  return data || [];
}
