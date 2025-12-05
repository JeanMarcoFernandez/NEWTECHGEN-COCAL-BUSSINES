// models/permisoModel.js
import { supabase } from '../db.js';

// ==== PERMISOS EQUIPO ====
export async function crearPermisosEquipoDB(reglas) {
  const { data, error } = await supabase
    .from('permiso_equipo')
    .insert(reglas)
    .select('*');

  if (error) throw error;
  return data;
}

export async function actualizarPermisoEquipoDB(id, campos) {
  const { data, error } = await supabase
    .from('permiso_equipo')
    .update(campos)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function listarPermisosEquipoDB(filtros = {}) {
  let q = supabase.from('permiso_equipo').select('*');

  if (filtros.id_empresa) q = q.eq('id_empresa', filtros.id_empresa);
  if (filtros.id_departamento) q = q.eq('id_departamento', filtros.id_departamento);
  if (filtros.id_proyecto) q = q.eq('id_proyecto', filtros.id_proyecto);
  if (filtros.rol_objetivo) q = q.eq('rol_objetivo', filtros.rol_objetivo);
  if (filtros.permiso) q = q.eq('permiso', filtros.permiso);

  const { data, error } = await q;
  if (error) throw error;
  return data;
}

// ==== PERMISOS USUARIO ====
export async function crearPermisoUsuarioDB(payload) {
  const { data, error } = await supabase
    .from('permiso_usuario')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function listarPermisosUsuarioDB(id_usuario) {
  const { data, error } = await supabase
    .from('permiso_usuario')
    .select('*')
    .eq('id_usuario', id_usuario);

  if (error) throw error;
  return data;
}

export async function revocarPermisosUsuarioPorOrigenDB(id_usuario, origen) {
  const { data, error } = await supabase
    .from('permiso_usuario')
    .delete()
    .eq('id_usuario', id_usuario)
    .eq('origen', origen)
    .select('*');

  if (error) throw error;
  return data;
}

// ==== AUDITORIA ====
export async function registrarAuditoriaPermisoDB(payload) {
  const { data, error } = await supabase
    .from('auditoria_permiso')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function listarAuditoriaPermisoDB(filtros = {}) {
  let q = supabase.from('auditoria_permiso').select('*');

  if (filtros.id_empresa) q = q.eq('id_empresa', filtros.id_empresa);
  if (filtros.id_usuario_objetivo) q = q.eq('id_usuario_objetivo', filtros.id_usuario_objetivo);
  if (filtros.permiso) q = q.eq('permiso', filtros.permiso);

  const { data, error } = await q.order('creado_en', { ascending: false });
  if (error) throw error;
  return data;
}

// ==== DELEGACION ====
export async function crearDelegacionPermisoDB(payload) {
  const { data, error } = await supabase
    .from('delegacion_permiso')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function listarDelegacionesActivasParaSustitutoDB(id_sustituto, ahoraISO) {
  const { data, error } = await supabase
    .from('delegacion_permiso')
    .select('*')
    .eq('id_sustituto', id_sustituto)
    .eq('activo', true)
    .lte('fecha_inicio', ahoraISO)
    .gte('fecha_fin', ahoraISO);

  if (error) throw error;
  return data;
}

// ==== LOG SEGURIDAD ====
export async function registrarLogSeguridadDB(payload) {
  const { error } = await supabase
    .from('log_seguridad')
    .insert(payload);

  if (error) throw error;
}

// 👇👇👇 Añadir al final de models/permisoModel.js

// Helper interno: obtener rol e info básica del usuario
async function obtenerUsuarioBasicoDB(id_usuario) {
  const { data, error } = await supabase
    .from('usuario')
    .select('id, rol, id_empresa')
    .eq('id', id_usuario)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Verifica si un usuario tiene un permiso granular
 * combinando:
 *  - permisos directos (permiso_usuario)
 *  - delegaciones activas (delegacion_permiso)
 *  - permisos por equipo (permiso_equipo) según rol / empresa / depto / proyecto
 *
 * @param {number} idUsuario
 * @param {string} clavePermiso   Ej: 'GESTION_CALENDARIO_EMPRESA'
 * @param {string} ambito         Ej: 'EMPRESA', 'DEPARTAMENTO', 'PROYECTO'
 * @param {object} contexto       { idEmpresa?, idDepartamento?, idProyecto? }
 * @returns {Promise<boolean>}
 */
export async function tienePermisoGranular(
  idUsuario,
  clavePermiso,
  ambito = null,
  contexto = {},
) {
  // 0) Usuario base (rol, empresa) para herencia por equipo
  const usuario = await obtenerUsuarioBasicoDB(idUsuario);
  const rolUsuario = usuario.rol;
  const idEmpresaUsuario = usuario.id_empresa || contexto.idEmpresa || null;

  // Normalizamos contexto
  const ctx = {
    idEmpresa: contexto.idEmpresa || idEmpresaUsuario,
    idDepartamento: contexto.idDepartamento || null,
    idProyecto: contexto.idProyecto || null,
  };

  // 1) Permiso directo a nivel usuario (permiso_usuario)
  {
    const { data, error } = await supabase
      .from('permiso_usuario')
      .select('id, permiso')
      .eq('id_usuario', idUsuario)
      .eq('permiso', clavePermiso)
      .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      // 🎯 El usuario tiene el permiso explícitamente
      return true;
    }
  }

  // 2) Delegaciones activas (cuando el gerente está ausente)
  {
    const ahoraISO = new Date().toISOString();
    const delegaciones = await listarDelegacionesActivasParaSustitutoDB(
      idUsuario,
      ahoraISO,
    );

    const tienePorDelegacion = delegaciones.some(
      (d) =>
        d.permiso === clavePermiso ||
        d.permiso === '*', // por si defines un comodín global
    );

    if (tienePorDelegacion) {
      return true;
    }
  }

  {
    const filtros = {
      rol_objetivo: rolUsuario,
      permiso: clavePermiso,
    };

    if (ambito === 'EMPRESA' && ctx.idEmpresa) {
      filtros.id_empresa = ctx.idEmpresa;
    }

    if (ambito === 'DEPARTAMENTO' && ctx.idDepartamento) {
      filtros.id_departamento = ctx.idDepartamento;
    }

    if (ambito === 'PROYECTO' && ctx.idProyecto) {
      filtros.id_proyecto = ctx.idProyecto;
    }

    const reglas = await listarPermisosEquipoDB(filtros);

    if (reglas && reglas.length > 0) {
      return true;
    }
  }

 
  return false;
}
