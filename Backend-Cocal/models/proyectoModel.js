// models/proyectoModel.js
import { supabase } from '../db.js';

// 🔹 Proyecto atado directamente a un departamento
export async function crearProyectoDepartamento({
  id_departamento,
  nombre,
  descripcion,
  visibilidad,
  responsable,
  fecha_inicio,
  fecha_fin,
}) {
  // Sacamos empresa del departamento
  const { data: deptData, error: deptError } = await supabase
    .from('departamento')
    .select('id_empresa')
    .eq('id', id_departamento)
    .single();

  if (deptError) {
    console.error('Error obtener departamento en crearProyectoDepartamento:', deptError);
    throw deptError;
  }
  if (!deptData) {
    throw new Error('Departamento no encontrado');
  }

  const id_empresa = deptData.id_empresa;

  const payload = {
    id_departamento,
    id_empresa,
    nombre,
    nivel: 'DEPARTAMENTO',
  };

  if (descripcion !== undefined) payload.descripcion = descripcion;
  if (visibilidad !== undefined) payload.visibilidad = visibilidad;
  if (responsable !== undefined) payload.responsable = responsable;
  if (fecha_inicio !== undefined) payload.fecha_inicio = fecha_inicio;
  if (fecha_fin !== undefined) payload.fecha_fin = fecha_fin;

  const { data, error } = await supabase
    .from('proyecto')
    .insert([payload])
    .select('*')
    .single();

  if (error) {
    console.error('Error crearProyectoDepartamento:', error);
    throw error;
  }

  return data;
}

// 🔹 Proyecto corporativo de empresa (con varios departamentos implicados)
export async function crearProyectoEmpresa({
  id_empresa,
  nombre,
  descripcion,
  visibilidad,
  responsable,
  fecha_inicio,
  fecha_fin,
  departamentos_involucrados = [],
}) {
  // Verificar que la empresa exista
  const { data: empresaData, error: empresaError } = await supabase
    .from('empresa')
    .select('id')
    .eq('id', id_empresa)
    .single();

  if (empresaError) {
    console.error('Error verificar empresa en crearProyectoEmpresa:', empresaError);
    throw empresaError;
  }
  if (!empresaData) {
    throw new Error('Empresa no encontrada');
  }

  const payload = {
    id_empresa,
    nombre,
    nivel: 'EMPRESA',
  };

  if (descripcion !== undefined) payload.descripcion = descripcion;
  if (visibilidad !== undefined) payload.visibilidad = visibilidad;
  if (responsable !== undefined) payload.responsable = responsable;
  if (fecha_inicio !== undefined) payload.fecha_inicio = fecha_inicio;
  if (fecha_fin !== undefined) payload.fecha_fin = fecha_fin;

  const { data: proyectoData, error: proyectoError } = await supabase
    .from('proyecto')
    .insert([payload])
    .select('*')
    .single();

  if (proyectoError) {
    console.error('Error crearProyectoEmpresa:', proyectoError);
    throw proyectoError;
  }

  const proyecto = proyectoData;

  // Insertar departamentos implicados (si mandas array)
  if (Array.isArray(departamentos_involucrados) && departamentos_involucrados.length > 0) {
    const rows = departamentos_involucrados.map((idDepto) => ({
      id_proyecto: proyecto.id,
      id_departamento: idDepto,
    }));

    const { error: deptosError } = await supabase
      .from('proyecto_departamento')
      .upsert(rows, {
        onConflict: 'id_proyecto,id_departamento',
        ignoreDuplicates: true,
      });

    if (deptosError) {
      console.error('Error insertar departamentos implicados:', deptosError);
      throw deptosError;
    }
  }

  return proyecto;
}

// 🔹 Obtener proyecto por id (solo tabla proyecto)
export async function obtenerProyectoPorId(id) {
  const { data, error } = await supabase
    .from('proyecto')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error obtenerProyectoPorId:', error);
    throw error;
  }

  return data;
}

// 🔹 Actualizar proyecto
export async function actualizarProyecto(id, datos) {
  const { nombre, descripcion, visibilidad, fecha_inicio, fecha_fin, responsable } = datos;

  const updateData = {};
  if (nombre !== undefined) updateData.nombre = nombre;
  if (descripcion !== undefined) updateData.descripcion = descripcion;
  if (visibilidad !== undefined) updateData.visibilidad = visibilidad;
  if (fecha_inicio !== undefined) updateData.fecha_inicio = fecha_inicio;
  if (fecha_fin !== undefined) updateData.fecha_fin = fecha_fin;
  if (responsable !== undefined) updateData.responsable = responsable;

  if (Object.keys(updateData).length === 0) {
    return await obtenerProyectoPorId(id);
  }

  const { data, error } = await supabase
    .from('proyecto')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error actualizarProyecto:', error);
    throw error;
  }

  return data;
}

// 🔹 Eliminar proyecto
export async function eliminarProyecto(id) {
  const { error } = await supabase
    .from('proyecto')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error eliminarProyecto:', error);
    throw error;
  }
}

// 🔹 Proyectos que ve un departamento X
// (los propios + los corporativos en los que está implicado)
export async function obtenerProyectosPorDepartamento(id_departamento) {
  // 1) Proyectos de nivel DEPARTAMENTO
  const { data: propios, error: propiosError } = await supabase
    .from('proyecto')
    .select('*')
    .eq('nivel', 'DEPARTAMENTO')
    .eq('id_departamento', id_departamento);

  if (propiosError) {
    console.error('Error obtener proyectos propios por departamento:', propiosError);
    throw propiosError;
  }

  // 2) IDs de proyectos corporativos donde participa ese departamento
  const { data: rels, error: relsError } = await supabase
    .from('proyecto_departamento')
    .select('id_proyecto')
    .eq('id_departamento', id_departamento);

  if (relsError) {
    console.error('Error obtener relaciones proyecto_departamento:', relsError);
    throw relsError;
  }

  let corporativos = [];
  if (rels && rels.length > 0) {
    const ids = rels.map((r) => r.id_proyecto);

    const { data, error } = await supabase
      .from('proyecto')
      .select('*')
      .in('id', ids);

    if (error) {
      console.error('Error obtener proyectos corporativos:', error);
      throw error;
    }
    corporativos = data || [];
  }

  // 3) Unimos y quitamos duplicados por id
  const mapa = new Map();
  [...(propios || []), ...corporativos].forEach((p) => {
    mapa.set(p.id, p);
  });

  return Array.from(mapa.values());
}

// 🔹 Proyectos por empresa (todos los proyectos asociados a esa empresa)
export async function obtenerProyectosPorEmpresa(id_empresa) {
  const { data, error } = await supabase
    .from('proyecto')
    .select('*')
    .eq('id_empresa', id_empresa)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error obtenerProyectosPorEmpresa:', error);
    throw error;
  }

  return data || [];
}

// 🔹 Departamentos implicados en un proyecto (empresa)
export async function obtenerDepartamentosDeProyecto(id_proyecto) {
  const { data: rels, error: relsError } = await supabase
    .from('proyecto_departamento')
    .select('id_departamento')
    .eq('id_proyecto', id_proyecto);

  if (relsError) {
    console.error('Error obtener rels proyecto_departamento:', relsError);
    throw relsError;
  }

  if (!rels || rels.length === 0) return [];

  const ids = rels.map((r) => r.id_departamento);

  const { data, error } = await supabase
    .from('departamento')
    .select('*')
    .in('id', ids)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error obtenerDepartamentosDeProyecto:', error);
    throw error;
  }

  return data || [];
}
