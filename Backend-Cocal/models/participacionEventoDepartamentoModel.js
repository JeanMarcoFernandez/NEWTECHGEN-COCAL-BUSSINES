// models/participacionEventoDepartamentoModel.js
import { supabase } from '../db.js';

// Agregar un participante a un evento_departamento
export async function agregarParticipanteEventoDepartamentoModel({
  id_evento_departamento,
  id_usuario,
  estado,
}) {
  const payload = {
    id_evento_departamento,
    id_usuario,
  };

  if (estado !== undefined) payload.estado = estado;

  const { data, error } = await supabase
    .from('participacion_evento_departamento')
    .insert([payload])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// Agregar participantes en lote
export async function agregarParticipantesEventoDepartamentoLoteModel(
  id_evento_departamento,
  participantes,
) {
  const rows = participantes.map((p) => ({
    id_evento_departamento,
    id_usuario: p.id_usuario,
    estado: p.estado || 'PENDIENTE',
  }));

  const { data, error } = await supabase
    .from('participacion_evento_departamento')
    .insert(rows)
    .select('*');

  if (error) throw error;
  return data || [];
}

// Actualizar estado de participación
export async function actualizarEstadoParticipacionDepartamentoModel(
  id_evento_departamento,
  id_usuario,
  estado,
) {
  const { data, error } = await supabase
    .from('participacion_evento_departamento')
    .update({ estado })
    .eq('id_evento_departamento', id_evento_departamento)
    .eq('id_usuario', id_usuario)
    .select('*')
    .limit(1);

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('Participación no encontrada');
  }
  return data[0];
}
