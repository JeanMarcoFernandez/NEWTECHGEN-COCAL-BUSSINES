// services/usuarioService.js
import { supabase } from '../db.js';

export async function obtenerUsuarioPorId(id) {
  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('id', id)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

export async function verificarUsuarioExiste(id_usuario) {
  if (!id_usuario) return; // opcional
  const usuario = await obtenerUsuarioPorId(id_usuario);
  if (!usuario) {
    throw new Error('Usuario responsable no encontrado');
  }
}
