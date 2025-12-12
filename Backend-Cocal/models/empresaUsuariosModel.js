import { supabase } from '../db.js'

export async function dbGetUsuarioEmpresa(idEmpresa, idUsuario) {
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
      fecha_ingreso,
      creado_en,
      actualizado_en
    `)
    .eq('id_empresa', idEmpresa)
    .eq('id', idUsuario)
    .maybeSingle() 

  if (error) throw new Error(error.message)
  return data
}

export async function dbPatchUsuarioEmpresa(idEmpresa, idUsuario, patch) {
  const { data, error } = await supabase
    .from('usuario')
    .update({ ...patch, actualizado_en: new Date().toISOString() })
    .eq('id_empresa', idEmpresa)
    .eq('id', idUsuario)
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
      fecha_ingreso,
      creado_en,
      actualizado_en
    `)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function dbDeleteUsuarioEmpresa(idEmpresa, idUsuario) {
  const { error } = await supabase
    .from('usuario')
    .delete()
    .eq('id_empresa', idEmpresa)
    .eq('id', idUsuario)

  if (error) throw new Error(error.message)
}
