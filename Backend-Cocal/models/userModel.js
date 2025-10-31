import { supabase } from '../db.js';


export async function obtenerTodosLosUsuarios() {
  const { data, error } = await supabase
    .from('usuario')
    .select('id, correo, nombre, apellido, rol, estado, creado_en');
  if (error) throw new Error(error.message);
  return data;
}


export async function obtenerUsuarioPorId(id) {
  const { data, error } = await supabase
    .from('usuario')
    .select('id, correo, nombre, apellido, rol, estado, creado_en')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function actualizarUsuarioPorId(id, datos) {
  const { data, error } = await supabase
    .from('usuario')
    .update(datos)
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  return data;
}


export async function eliminarUsuarioPorId(id) {
  const { error } = await supabase.from('usuario').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { message: 'Usuario eliminado correctamente' };
}
