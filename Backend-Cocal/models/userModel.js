import { supabase } from '../db.js';


export async function obtenerTodosLosUsuarios() {
  return await supabase
    .from('usuario')
    .select('id, correo, nombre, apellido, rol, estado, creado_en');
}

export async function obtenerUsuarioPorId(id) {
  return await supabase
    .from('usuario')
    .select('id, correo, nombre, apellido, rol, estado, creado_en')
    .eq('id', id)
    .single();
}


export async function actualizarUsuarioPorId(id, datos) {
  return await supabase.from('usuario').update(datos).eq('id', id);
}


export async function eliminarUsuarioPorId(id) {
  return await supabase.from('usuario').delete().eq('id', id);
}
