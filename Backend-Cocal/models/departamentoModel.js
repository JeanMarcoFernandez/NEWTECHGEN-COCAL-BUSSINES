// models/departamentoModel.js
import { supabase } from '../db.js';

// Crear departamento
export async function crearDepartamento({ id_empresa, nombre, descripcion, area, visibilidad }) {
  const payload = { id_empresa, nombre };

  if (descripcion !== undefined) payload.descripcion = descripcion;
  if (area !== undefined) payload.area = area;
  if (visibilidad !== undefined) payload.visibilidad = visibilidad; // si no, usa default de la BD

  const { data, error } = await supabase
    .from('departamento')
    .insert([payload])
    .select('*')
    .single();

  if (error) {
    console.error('Error crearDepartamento:', error);
    throw error;
  }

  return data;
}

// Listar departamentos por empresa
export async function obtenerDepartamentosPorEmpresa(id_empresa) {
  const { data, error } = await supabase
    .from('departamento')
    .select('*')
    .eq('id_empresa', id_empresa)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error obtenerDepartamentosPorEmpresa:', error);
    throw error;
  }

  return data || [];
}

// Obtener departamento por id
export async function obtenerDepartamentoPorId(id) {
  const { data, error } = await supabase
    .from('departamento')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    // Si no encuentra fila, Supabase suele mandar PGRST116
    if (error.code === 'PGRST116') return null;
    console.error('Error obtenerDepartamentoPorId:', error);
    throw error;
  }

  return data;
}

// Actualizar departamento
export async function actualizarDepartamento(id, datos) {
  const { nombre, descripcion, area, visibilidad } = datos;

  const updateData = {};
  if (nombre !== undefined) updateData.nombre = nombre;
  if (descripcion !== undefined) updateData.descripcion = descripcion;
  if (area !== undefined) updateData.area = area;
  if (visibilidad !== undefined) updateData.visibilidad = visibilidad;

  if (Object.keys(updateData).length === 0) {
    return await obtenerDepartamentoPorId(id);
  }

  const { data, error } = await supabase
    .from('departamento')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error actualizarDepartamento:', error);
    throw error;
  }

  return data;
}

// Eliminar departamento
export async function eliminarDepartamento(id) {
  const { error } = await supabase
    .from('departamento')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error eliminarDepartamento:', error);
    throw error;
  }
}
