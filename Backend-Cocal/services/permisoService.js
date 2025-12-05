// services/permisoService.js
import {
  crearPermisosEquipoDB,
  actualizarPermisoEquipoDB,
  listarPermisosEquipoDB,
  crearPermisoUsuarioDB,
  listarPermisosUsuarioDB,
  revocarPermisosUsuarioPorOrigenDB,
  registrarAuditoriaPermisoDB,
  listarAuditoriaPermisoDB,
  crearDelegacionPermisoDB,
  listarDelegacionesActivasParaSustitutoDB,
  registrarLogSeguridadDB
} from '../models/permisoModel.js';

import { supabase } from '../db.js';

// Orden de severidad: más restrictivo primero
const NIVEL_RANK = {
  NINGUNO: 0,
  LECTURA: 1,
  EDICION: 2,
  ADMIN: 3
};

// Precedencia de especificidad: usuario > proyecto > departamento > empresa
const SCOPE_RANK = {
  USUARIO: 0,
  PROYECTO: 1,
  DEPARTAMENTO: 2,
  EMPRESA: 3
};

// ================== CONFIGURAR PERMISOS DE EQUIPO ==================

export async function configurarPermisosEquipoService({ reglas }, usuarioContexto) {
  const { rol, id_empresa } = usuarioContexto;

  if (rol !== 'ADMIN' && rol !== 'SUPERVISOR') {
    throw { status: 403, message: 'Solo Director/ADMIN/SUPERVISOR puede configurar permisos.' };
  }

  // Cada regla: { id_departamento?, id_proyecto?, rol_objetivo, permiso, nivel }
  const payload = reglas.map(r => ({
    id_empresa,
    id_departamento: r.id_departamento ?? null,
    id_proyecto: r.id_proyecto ?? null,
    rol_objetivo: r.rol_objetivo ?? 'EMPLEADO',
    permiso: r.permiso,
    nivel: r.nivel,
    creado_por: usuarioContexto.id
  }));

  const creados = await crearPermisosEquipoDB(payload);

  // Auditoria (a nivel empresa, sin usuario objetivo concreto)
  for (const p of creados) {
    await registrarAuditoriaPermisoDB({
      id_empresa,
      id_usuario_objetivo: null,
      permiso: p.permiso,
      nivel_anterior: null,
      nivel_nuevo: p.nivel,
      accion: 'CREAR',
      realizado_por: usuarioContexto.id,
      detalle: `Permiso equipo creado: scope empresa=${p.id_empresa}, dept=${p.id_departamento}, proyecto=${p.id_proyecto}, rol=${p.rol_objetivo}`
    });
  }

  return creados;
}

export async function modificarPermisoEquipoService(id_permiso, campos, usuarioContexto) {
  const { id_empresa } = usuarioContexto;

  const actualizado = await actualizarPermisoEquipoDB(id_permiso, campos);

  await registrarAuditoriaPermisoDB({
    id_empresa,
    id_usuario_objetivo: null,
    permiso: actualizado.permiso,
    nivel_anterior: null, // para simplificar
    nivel_nuevo: actualizado.nivel,
    accion: 'ACTUALIZAR',
    realizado_por: usuarioContexto.id,
    detalle: `Permiso equipo actualizado (id=${id_permiso})`
  });

  return actualizado;
}

// ================== PERMISOS PERSONALIZADOS DEPARTAMENTO/USUARIO ==================

export async function crearPermisoPersonalizadoDeptService({
  id_departamento,
  rol_objetivo,
  permiso,
  nivel
}, usuarioContexto) {
  const { id_empresa, rol } = usuarioContexto;

  if (rol !== 'SUPERVISOR' && rol !== 'ADMIN') {
    throw { status: 403, message: 'Solo Gerente/Director puede crear permisos personalizados de departamento.' };
  }

  const reglas = [{
    id_departamento,
    rol_objetivo,
    permiso,
    nivel
  }];

  const creados = await configurarPermisosEquipoService({ reglas }, usuarioContexto);
  return creados[0];
}

// Cuando se remueve usuario de un equipo, revocar permisos por origen
export async function revocarPermisosPorSalidaEquipoService(id_usuario, usuarioContexto) {
  const revocados = await revocarPermisosUsuarioPorOrigenDB(id_usuario, 'EQUIPO');

  for (const r of revocados) {
    await registrarAuditoriaPermisoDB({
      id_empresa: usuarioContexto.id_empresa,
      id_usuario_objetivo: id_usuario,
      permiso: r.permiso,
      nivel_anterior: r.nivel,
      nivel_nuevo: 'NINGUNO',
      accion: 'REVOCAR',
      realizado_por: usuarioContexto.id,
      detalle: `Revocados permisos por salida de equipo`
    });
  }

  return revocados.length;
}

// ================== DELEGACION TEMPORAL ==================

export async function delegarPermisosTemporalService({
  id_sustituto,
  fecha_inicio,
  fecha_fin
}, usuarioContexto) {
  const { id: id_gerente } = usuarioContexto;

  const delegacion = await crearDelegacionPermisoDB({
    id_gerente,
    id_sustituto,
    fecha_inicio,
    fecha_fin
  });

  await registrarAuditoriaPermisoDB({
    id_empresa: usuarioContexto.id_empresa,
    id_usuario_objetivo: id_sustituto,
    permiso: null,
    nivel_anterior: null,
    nivel_nuevo: null,
    accion: 'DELEGAR',
    realizado_por: id_gerente,
    detalle: `Delegación temporal de permisos de ${id_gerente} a ${id_sustituto}`
  });

  return delegacion;
}

// ================== CÁLCULO DE PERMISO EFECTIVO ==================

function elegirMasEspecifico(candidatos) {
  if (candidatos.length === 0) return null;

  // Ordenamos por scopeRank y, en empate, por nivel más restrictivo (rank menor)
  return candidatos.sort((a, b) => {
    if (a.scopeRank !== b.scopeRank) {
      return a.scopeRank - b.scopeRank;
    }
    return NIVEL_RANK[a.nivel] - NIVEL_RANK[b.nivel];
  })[0];
}

export async function calcularPermisoEfectivoService({
  id_usuario,
  id_empresa,
  rol_usuario,
  permiso,
  id_departamento = null,
  id_proyecto = null
}) {
  const candidatos = [];

  // 1) Permisos directos del usuario
  const permisosUsuario = await listarPermisosUsuarioDB(id_usuario);
  for (const p of permisosUsuario.filter(p => p.permiso === permiso)) {
    candidatos.push({
      scope: 'USUARIO',
      scopeRank: SCOPE_RANK.USUARIO,
      nivel: p.nivel
    });
  }

  // 2) Permisos de equipo (proyecto > departamento > empresa)
  const permisosEquipo = await listarPermisosEquipoDB({
    id_empresa,
    permiso
  });

  for (const p of permisosEquipo) {
    // Rol objetivo debe coincidir (o null = todos)
    if (p.rol_objetivo && p.rol_objetivo !== rol_usuario) continue;

    if (id_proyecto && p.id_proyecto === id_proyecto) {
      candidatos.push({
        scope: 'PROYECTO',
        scopeRank: SCOPE_RANK.PROYECTO,
        nivel: p.nivel
      });
    } else if (id_departamento && p.id_departamento === id_departamento) {
      candidatos.push({
        scope: 'DEPARTAMENTO',
        scopeRank: SCOPE_RANK.DEPARTAMENTO,
        nivel: p.nivel
      });
    } else if (!p.id_departamento && !p.id_proyecto) {
      // empresa
      candidatos.push({
        scope: 'EMPRESA',
        scopeRank: SCOPE_RANK.EMPRESA,
        nivel: p.nivel
      });
    }
  }

  // 3) Delegación: si el usuario es sustituto de algún gerente activo,
  // opcionalmente podrías sumar permisos equivalentes del gerente.
  const ahoraISO = new Date().toISOString();
  const delegaciones = await listarDelegacionesActivasParaSustitutoDB(id_usuario, ahoraISO);

  for (const d of delegaciones) {
    // Recuperar permisos directos del gerente y tratarlos como USUARIO-level para el sustituto
    const permisosGerente = await listarPermisosUsuarioDB(d.id_gerente);
    for (const p of permisosGerente.filter(p => p.permiso === permiso)) {
      candidatos.push({
        scope: 'USUARIO',   // se heredan
        scopeRank: SCOPE_RANK.USUARIO,
        nivel: p.nivel
      });
    }
  }

  const mejor = elegirMasEspecifico(candidatos);
  return mejor?.nivel || 'NINGUNO';
}

// ================== AUDITORIA / REPORTES ==================

export async function auditarPermisosService(filtros, usuarioContexto) {
  return listarAuditoriaPermisoDB({
    ...filtros,
    id_empresa: usuarioContexto.id_empresa
  });
}

// ================== LOG DE ACCESO NO AUTORIZADO ==================

export async function registrarAccesoNoAutorizadoService({
  id_usuario,
  accion,
  recurso,
  detalle,
  req
}) {
  const ip = req.ip || null;
  const user_agent = req.headers['user-agent'] || null;

  await registrarLogSeguridadDB({
    id_usuario,
    accion,
    recurso,
    resultado: 'DENEGADO',
    detalle,
    ip,
    user_agent
  });
}
