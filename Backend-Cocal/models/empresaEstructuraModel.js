import { supabase } from '../db.js'

export async function dbEstructuraEmpresaUsuarios(idEmpresa) {
  // 1) Empresa
  const { data: empresa, error: errEmp } = await supabase
    .from('empresa')
    .select('id, nombre, nit, rubro, direccion, telefono, sitio_web')
    .eq('id', idEmpresa)
    .single()

  if (errEmp) throw new Error(errEmp.message)
  if (!empresa) return null

  // 2) Departamentos de la empresa
  const { data: departamentos, error: errDep } = await supabase
    .from('departamento')
    .select('id, id_empresa, nombre, descripcion, area, visibilidad, creado_en')
    .eq('id_empresa', idEmpresa)
    .order('nombre', { ascending: true })

  if (errDep) throw new Error(errDep.message)

  // 3) Usuarios de la empresa
  const { data: usuarios, error: errUsu } = await supabase
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
    .order('nombre', { ascending: true })

  if (errUsu) throw new Error(errUsu.message)

  // 4) Agrupar usuarios por departamento
  const depMap = new Map(departamentos.map(d => [d.id, { ...d, usuarios: [] }]))
  const sinDepartamento = []

  for (const u of usuarios) {
    if (u.id_departamento && depMap.has(u.id_departamento)) {
      depMap.get(u.id_departamento).usuarios.push(u)
    } else {
      sinDepartamento.push(u)
    }
  }

  return {
    empresa,
    departamentos: Array.from(depMap.values()),
    sin_departamento: sinDepartamento,
  }
}
