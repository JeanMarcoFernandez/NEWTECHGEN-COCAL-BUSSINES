// models/participacionEventoModel.js
import { supabase } from '../db.js';

// Agregar un solo participante a un evento
export async function agregarParticipanteEventoModel({ id_evento, id_usuario, estado = 'PENDIENTE' }) {
  const payload = { id_evento, id_usuario, estado };

  const { data, error } = await supabase
    .from('participacion_evento')
    .insert([payload])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// Agregar varios participantes de golpe
export async function agregarParticipantesEventoLoteModel(id_evento, idsUsuarios) {
  if (!Array.isArray(idsUsuarios) || idsUsuarios.length === 0) return [];

  const rows = idsUsuarios.map((id_usuario) => ({
    id_evento,
    id_usuario,
    estado: 'PENDIENTE',
  }));

  const { data, error } = await supabase
    .from('participacion_evento')
    .insert(rows)
    .select('*');

  if (error) throw error;
  return data || [];
}

// Actualizar estado de participación
export async function actualizarEstadoParticipacionModel(id_evento, id_usuario, estado) {
  const { data, error } = await supabase
    .from('participacion_evento')
    .update({ estado })
    .eq('id_evento', id_evento)
    .eq('id_usuario', id_usuario)
    .select('*')
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}
