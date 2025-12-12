import { supabase } from '../db.js'

export async function dbListarTodosUsuarios() {
  const { data, error } = await supabase
    .from('usuario')
    .select(`
      id,
      id_empresa,
      id_departamento,
      correo,
      nombre,
      apellido,
      cargo,
      rol,
      estado,
      telefono,
      fecha_ingreso
    `)
    .order('id', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}
