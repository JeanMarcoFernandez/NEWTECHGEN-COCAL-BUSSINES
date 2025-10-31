import { supabase } from '../db.js';

export async function getUsuarioPorCorreo(correo) {
  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('correo', correo)
    .single();
  return { data, error };
}

export async function incrementarIntentoFallido(usuarioId, nuevosIntentos, bloqueoUntil) {
  // bloqueoUntil = Date object or null
  const payload = { intentos_fallidos: nuevosIntentos };
  if (bloqueoUntil) payload.bloqueado_hasta = bloqueoUntil.toISOString();
  const { data, error } = await supabase
    .from('usuario')
    .update(payload)
    .eq('id', usuarioId);
  return { data, error };
}

export async function resetearIntentos(usuarioId) {
  const { data, error } = await supabase
    .from('usuario')
    .update({ intentos_fallidos: 0, bloqueado_hasta: null })
    .eq('id', usuarioId);
  return { data, error };
}
