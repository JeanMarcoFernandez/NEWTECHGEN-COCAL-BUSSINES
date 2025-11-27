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
