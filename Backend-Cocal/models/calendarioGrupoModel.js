// models/calendarioGrupoModel.js
import { supabase } from '../db.js';

export async function obtenerCalendarioGrupoPorId(id) {
  const { data, error } = await supabase
    .from('calendario_grupo')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}
