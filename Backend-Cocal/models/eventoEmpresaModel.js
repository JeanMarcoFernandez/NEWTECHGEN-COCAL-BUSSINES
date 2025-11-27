// models/eventoEmpresaModel.js
import { supabase } from '../db.js';

export async function crearEventoEmpresaModel({
  id_calendario_empresa,
  titulo,
  descripcion,
  tipo,
  fecha_inicio,
  fecha_fin,
  responsable,
  visibilidad,
  estado = 'PROGRAMADO',
}) {
  const payload = {
    id_calendario_empresa,
    titulo,
    descripcion,
    tipo,
    fecha_inicio,
    fecha_fin,
    responsable,
    visibilidad,
    estado,
  };

  const { data, error } = await supabase
    .from('evento_empresa')
    .insert([payload])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function obtenerEventosEmpresaPorCalendario(id_calendario_empresa) {
  const { data, error } = await supabase
    .from('evento_empresa')
    .select('*')
    .eq('id_calendario_empresa', id_calendario_empresa)
    .order('fecha_inicio', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function obtenerEventoEmpresaPorId(id_evento_empresa) {
  const { data, error } = await supabase
    .from('evento_empresa')
    .select('*')
    .eq('id', id_evento_empresa)
    .single();

  if (error) throw error;
  return data || null;
}

export async function actualizarEventoEmpresaModelBase(id_evento_empresa, campos) {
  const updateData = {};

  for (const [key, value] of Object.entries(campos)) {
    if (value !== undefined) {
      updateData[key] = value;
    }
  }

  if (Object.keys(updateData).length === 0) {
    const actual = await obtenerEventoEmpresaPorId(id_evento_empresa);
    return actual;
  }

  const { data, error } = await supabase
    .from('evento_empresa')
    .update(updateData)
    .eq('id', id_evento_empresa)
    .select('*')
    .single();

  if (error) throw error;
  return data || null;
}

export async function eliminarEventoEmpresaModel(id_evento_empresa) {
  const { error } = await supabase
    .from('evento_empresa')
    .delete()
    .eq('id', id_evento_empresa);

  if (error) throw error;
}
