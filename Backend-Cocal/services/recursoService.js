// services/recursoService.js
import {
  crearRecursoDB,
  listarRecursosDB,
  obtenerRecursoPorIdDB,
  actualizarRecursoDB
} from '../models/recursoModel.js';

import { buscarReservasSolapadasDB } from '../models/reservaRecursoModel.js';

// Crear recurso (ADMIN / SUPERVISOR)
export async function crearRecursoService(payload, usuarioContexto) {
  const { id_empresa } = usuarioContexto;

  // Forzamos empresa desde el token para que no se meta de otra empresa
  const nuevoRecurso = await crearRecursoDB({
    ...payload,
    id_empresa
  });

  return nuevoRecurso;
}

// Listar recursos (con filtros)
export async function listarRecursosService(filtros, usuarioContexto) {
  const { id_empresa } = usuarioContexto;

  const recursos = await listarRecursosDB({
    ...filtros,
    id_empresa
  });

  return recursos;
}

// Obtener recurso por ID (validando empresa)
export async function obtenerRecursoService(id, usuarioContexto) {
  const { id_empresa } = usuarioContexto;
  const recurso = await obtenerRecursoPorIdDB(id);

  if (!recurso || recurso.id_empresa !== id_empresa) {
    throw { status: 404, message: 'Recurso no encontrado en tu empresa.' };
  }

  return recurso;
}

// Marcar / desmarcar mantenimiento
export async function cambiarEstadoMantenimientoService(id, en_mantenimiento, usuarioContexto) {
  const recurso = await obtenerRecursoService(id, usuarioContexto);

  const actualizado = await actualizarRecursoDB(recurso.id, {
    en_mantenimiento
  });

  return actualizado;
}

// Consultar disponibilidad de un recurso en un rango
export async function verificarDisponibilidadRecursoService({
  id_recurso,
  fecha_inicio,
  fecha_fin
}) {
  const solapadas = await buscarReservasSolapadasDB({
    id_recurso,
    fecha_inicio,
    fecha_fin
  });

  const disponible = solapadas.length === 0;

  return {
    disponible,
    reservas_conflictivas: solapadas
  };
}

// Buscar recursos disponibles (y sugerir alternativos)
export async function buscarRecursosDisponiblesService({
  fecha_inicio,
  fecha_fin,
  tipo,
  capacidad_minima,
  id_departamento
}, usuarioContexto) {
  const { id_empresa } = usuarioContexto;

  // 1) Listamos todos los recursos candidatos
  const recursos = await listarRecursosDB({
    id_empresa,
    id_departamento,
    tipo,
    en_mantenimiento: false
  });

  // 2) Filtramos por capacidad (si aplica)
  const filtradosPorCapacidad = recursos.filter(r => {
    if (!capacidad_minima) return true;
    if (r.capacidad == null) return true; // si no hay capacidad definida, no filtramos tan agresivo
    return r.capacidad >= capacidad_minima;
  });

  // 3) Para cada recurso, verificamos solapamiento
  const disponibles = [];
  const ocupados = [];

  for (const recurso of filtradosPorCapacidad) {
    const solapadas = await buscarReservasSolapadasDB({
      id_recurso: recurso.id,
      fecha_inicio,
      fecha_fin
    });

    if (solapadas.length === 0) {
      disponibles.push(recurso);
    } else {
      ocupados.push({
        recurso,
        reservas_conflictivas: solapadas
      });
    }
  }

  return {
    disponibles,
    ocupados
  };
}
