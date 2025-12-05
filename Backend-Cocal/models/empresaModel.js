// models/empresaModel.js
import { supabase } from '../db.js';

// Crear empresa
export async function crearEmpresa({ nombre, nit, rubro, direccion, telefono, sitio_web }) {
  const { data, error } = await supabase
    .from('empresa')
    .insert([
      {
        nombre,
        nit,
        rubro,
        direccion,
        telefono,
        sitio_web,
      },
    ])
    .select('*')
    .single();

  if (error) {
    console.error('Error crearEmpresa:', error);
    throw error;
  }

  return data;
}

// Listar todas las empresas
export async function obtenerEmpresas() {
  const { data, error } = await supabase
    .from('empresa')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error obtenerEmpresas:', error);
    throw error;
  }

  return data || [];
}

// Obtener empresa por id
export async function obtenerEmpresaPorId(id) {
  const { data, error } = await supabase
    .from('empresa')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error obtenerEmpresaPorId:', error);
    throw error;
  }

  return data;
}

// Actualizar empresa
export async function actualizarEmpresa(id, datos) {
  const { nombre, nit, rubro, direccion, telefono, sitio_web } = datos;

  const updateData = {};
  if (nombre !== undefined) updateData.nombre = nombre;
  if (nit !== undefined) updateData.nit = nit;
  if (rubro !== undefined) updateData.rubro = rubro;
  if (direccion !== undefined) updateData.direccion = direccion;
  if (telefono !== undefined) updateData.telefono = telefono;
  if (sitio_web !== undefined) updateData.sitio_web = sitio_web;

  if (Object.keys(updateData).length === 0) {
    return await obtenerEmpresaPorId(id);
  }

  const { data, error } = await supabase
    .from('empresa')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error actualizarEmpresa:', error);
    throw error;
  }

  return data;
}

// Eliminar empresa
export async function eliminarEmpresa(id) {
  const { error } = await supabase
    .from('empresa')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error eliminarEmpresa:', error);
    throw error;
  }
}
export async function obtenerEntornoEmpresa(id_empresa) {
  // 1) Empresa
  const { data: empresa, error: empresaError } = await supabase
    .from('empresa')
    .select('id, nombre, nit, rubro, direccion, telefono, sitio_web')
    .eq('id', id_empresa)
    .single();

  if (empresaError || !empresa) {
    console.error('Error obtener empresa en obtenerEntornoEmpresa:', empresaError);
    throw new Error('Empresa no encontrada');
  }

  // 2) Departamentos de la empresa
  const { data: departamentos, error: deptError } = await supabase
    .from('departamento')
    .select('id, nombre, descripcion, area, visibilidad, creado_en')
    .eq('id_empresa', id_empresa)
    .order('id', { ascending: true });

  if (deptError) {
    console.error('Error obtener departamentos en obtenerEntornoEmpresa:', deptError);
    throw deptError;
  }

  // 3) Usuarios de la empresa
  const { data: usuarios, error: userError } = await supabase
    .from('usuario')
    .select(
      'id, nombre, apellido, correo, cargo, rol, estado, telefono, fecha_ingreso, id_departamento'
    )
    .eq('id_empresa', id_empresa)
    .order('id', { ascending: true });

  if (userError) {
    console.error('Error obtener usuarios en obtenerEntornoEmpresa:', userError);
    throw userError;
  }

  // 4) Armar estructura: departamentos con sus usuarios + usuarios sin departamento
  const mapaDeptos = new Map();
  (departamentos || []).forEach((d) => {
    mapaDeptos.set(d.id, {
      ...d,
      usuarios: [],
    });
  });

  const usuariosSinDepartamento = [];

  (usuarios || []).forEach((u) => {
    if (u.id_departamento && mapaDeptos.has(u.id_departamento)) {
      mapaDeptos.get(u.id_departamento).usuarios.push(u);
    } else {
      usuariosSinDepartamento.push(u);
    }
  });

  return {
    empresa,
    departamentos: Array.from(mapaDeptos.values()),
    usuarios_sin_departamento: usuariosSinDepartamento,
  };
}