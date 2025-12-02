// models/calendarioVinculoModel.js
import { supabase } from '../db.js';

export async function crearCalendarioVinculoModel({
  id_proyecto,
  origen_tipo,
  origen_id,
  destino_tipo,
  destino_id,
  permiso = 'LECTURA',
}) {
  const { data, error } = await supabase
    .from('calendario_vinculo')
    .insert([
      {
        id_proyecto,
        origen_tipo,
        origen_id,
        destino_tipo,
        destino_id,
        permiso,
      },
    ])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function listarVinculosPorProyectoModel(id_proyecto) {
  const { data, error } = await supabase
    .from('calendario_vinculo')
    .select('*')
    .eq('id_proyecto', id_proyecto)
    .order('id', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function listarVinculosPorOrigenModel({
  id_proyecto,
  origen_tipo,
  origen_id,
}) {
  const query = supabase
    .from('calendario_vinculo')
    .select('*')
    .eq('id_proyecto', id_proyecto)
    .eq('origen_tipo', origen_tipo)
    .eq('origen_id', origen_id);

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function listarVinculosPorDestinoModel({
  id_proyecto,
  destino_tipo,
  destino_id,
}) {
  const { data, error } = await supabase
    .from('calendario_vinculo')
    .select('*')
    .eq('id_proyecto', id_proyecto)
    .eq('destino_tipo', destino_tipo)
    .eq('destino_id', destino_id);

  if (error) throw error;
  return data || [];
}

export async function eliminarVinculoPorIdModel(id) {
  const { error } = await supabase
    .from('calendario_vinculo')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function eliminarVinculoUnicoModel({
  id_proyecto,
  origen_tipo,
  origen_id,
  destino_tipo,
  destino_id,
}) {
  const { error } = await supabase
    .from('calendario_vinculo')
    .delete()
    .eq('id_proyecto', id_proyecto)
    .eq('origen_tipo', origen_tipo)
    .eq('origen_id', origen_id)
    .eq('destino_tipo', destino_tipo)
    .eq('destino_id', destino_id);

  if (error) throw error;
}

