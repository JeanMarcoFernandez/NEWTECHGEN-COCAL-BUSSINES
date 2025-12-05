// services/reservaRecursoService.js
import {
  buscarReservasSolapadasDB,
  crearReservaRecursoDB,
  obtenerReservaPorIdDB,
  actualizarReservaRecursoDB,
  listarHistorialReservasDB,
  listarReservasParaLiberarDB
} from '../models/reservaRecursoModel.js';

import { obtenerRecursoPorIdDB,
        listarRecursosDB 
 } from '../models/recursoModel.js';

// Crear reserva (Empleado)
export async function crearReservaRecursoService(payload, usuarioContexto) {
  const { id: id_usuario, id_empresa } = usuarioContexto;
  const {
    id_recurso,
    fecha_inicio,
    fecha_fin,
    motivo
  } = payload;

  // 1) Validar recurso
  const recurso = await obtenerRecursoPorIdDB(id_recurso);
  if (!recurso || recurso.id_empresa !== id_empresa) {
    throw { status: 404, message: 'Recurso no encontrado en tu empresa.' };
  }
  if (recurso.en_mantenimiento) {
    throw { status: 400, message: 'El recurso está en mantenimiento.' };
  }

  // 2) Validar duración contra tiempo_max_reserva (HU-4.7)
  const inicio = new Date(fecha_inicio);
  const finSolicitado = new Date(fecha_fin);

  const maxMillis = recurso.tiempo_max_reserva * 60 * 1000;
  const diffMillis = finSolicitado.getTime() - inicio.getTime();

  let finAjustado = finSolicitado;
  let fueAjustadoPorMaximo = false;

  if (diffMillis > maxMillis) {
    finAjustado = new Date(inicio.getTime() + maxMillis);
    fueAjustadoPorMaximo = true;
  }

  // 3) Verificar conflictos
  const solapadas = await buscarReservasSolapadasDB({
    id_recurso: recurso.id,
    fecha_inicio: inicio.toISOString(),
    fecha_fin: finAjustado.toISOString()
  });

   if (solapadas.length > 0) {
    // HU-4.3: sugerir recursos alternativos en el MISMO flujo
    // 1) Buscamos recursos candidatos en la misma empresa, mismo tipo, no en mantenimiento
    const candidatos = await listarRecursosDB({
      id_empresa,
      tipo: recurso.tipo,
      en_mantenimiento: false
    });

    const recursosAlternativos = [];

    // 2) Para cada candidato, verificamos si está libre en el mismo rango
    for (const rec of candidatos) {
      // Saltamos el mismo recurso original
      if (rec.id === recurso.id) continue;

      const solapadasAlt = await buscarReservasSolapadasDB({
        id_recurso: rec.id,
        fecha_inicio: inicio.toISOString(),
        fecha_fin: finAjustado.toISOString()
      });

      if (solapadasAlt.length === 0) {
        recursosAlternativos.push(rec);
      }
    }

    throw {
      status: 409,
      message: 'El recurso no está disponible en ese rango de fechas.',
      detalles: {
        reservas_conflictivas: solapadas,
        recursos_alternativos: recursosAlternativos
      }
    };
  }

  // 4) Crear reserva en estado PENDIENTE_APROBACION
  const nuevaReserva = await crearReservaRecursoDB({
    id_recurso: recurso.id,
    id_solicitante: id_usuario,
    fecha_inicio: inicio.toISOString(),
    fecha_fin: finAjustado.toISOString(),
    motivo,
    estado: 'PENDIENTE_APROBACION'
  });

  return { reserva: nuevaReserva, fueAjustadoPorMaximo };
}

// Cancelar reserva (solicitante o rol elevado)
export async function cancelarReservaRecursoService(id, usuarioContexto) {
  const { id: id_usuario, rol } = usuarioContexto;

  const reserva = await obtenerReservaPorIdDB(id);
  if (!reserva) {
    throw { status: 404, message: 'Reserva no encontrada.' };
  }

  const esSolicitante = reserva.id_solicitante === id_usuario;
  const esRolElevado = ['ADMIN', 'SUPERVISOR', 'RRHH'].includes(rol);

  if (!esSolicitante && !esRolElevado) {
    throw { status: 403, message: 'No tienes permisos para cancelar esta reserva.' };
  }

  if (['CANCELADA', 'FINALIZADA', 'EXPIRADA'].includes(reserva.estado)) {
    throw { status: 400, message: 'La reserva ya no puede cancelarse.' };
  }

  const actualizada = await actualizarReservaRecursoDB(id, {
    estado: 'CANCELADA'
  });

  return actualizada;
}

// Aprobar reserva (Gerente / Director / ADMIN / SUPERVISOR)
export async function aprobarReservaRecursoService(id, usuarioContexto, { aprobar, comentario }) {
  const { id: id_aprobador, rol } = usuarioContexto;

  if (!['ADMIN', 'SUPERVISOR', 'RRHH'].includes(rol)) {
    throw { status: 403, message: 'No tienes permisos para aprobar/rechazar reservas.' };
  }

  const reserva = await obtenerReservaPorIdDB(id);
  if (!reserva) {
    throw { status: 404, message: 'Reserva no encontrada.' };
  }

  if (reserva.estado !== 'PENDIENTE_APROBACION') {
    throw { status: 400, message: 'La reserva no se encuentra pendiente de aprobación.' };
  }

  const nuevoEstado = aprobar ? 'APROBADA' : 'RECHAZADA';

  const actualizada = await actualizarReservaRecursoDB(id, {
    estado: nuevoEstado,
    id_aprobador,
    motivo: comentario ?? reserva.motivo
  });

  return actualizada;
}

// Check-in (cuando el usuario llega y empieza a usar el recurso)
export async function checkinReservaRecursoService(id, usuarioContexto) {
  const { id: id_usuario } = usuarioContexto;

  const reserva = await obtenerReservaPorIdDB(id);
  if (!reserva) {
    throw { status: 404, message: 'Reserva no encontrada.' };
  }

  if (reserva.id_solicitante !== id_usuario) {
    throw { status: 403, message: 'Solo el solicitante puede hacer check-in.' };
  }

  if (reserva.estado !== 'APROBADA') {
    throw { status: 400, message: 'Solo reservas aprobadas pueden hacer check-in.' };
  }

  const ahora = new Date().toISOString();

  const actualizada = await actualizarReservaRecursoDB(id, {
    estado: 'EN_USO',
    checkin_en: ahora
  });

  return actualizada;
}

// Check-out (cuando se deja de usar el recurso)
export async function checkoutReservaRecursoService(id, usuarioContexto) {
  const { id: id_usuario } = usuarioContexto;

  const reserva = await obtenerReservaPorIdDB(id);
  if (!reserva) {
    throw { status: 404, message: 'Reserva no encontrada.' };
  }

  if (reserva.id_solicitante !== id_usuario) {
    throw { status: 403, message: 'Solo el solicitante puede hacer check-out.' };
  }

  if (reserva.estado !== 'EN_USO') {
    throw { status: 400, message: 'Solo reservas en uso pueden hacer check-out.' };
  }

  const ahora = new Date().toISOString();

  const actualizada = await actualizarReservaRecursoDB(id, {
    estado: 'FINALIZADA',
    checkout_en: ahora
  });

  return actualizada;
}

// Historial de reservas (para HU-4.5, Director / Gerente)
export async function historialReservasService(filtros, usuarioContexto) {
  const { id_empresa } = usuarioContexto;

  // Por simplicidad, se asume que el filtro principal es por id_recurso
  // y que validamos que el recurso pertenece a la empresa
  if (filtros.id_recurso) {
    const recurso = await obtenerRecursoPorIdDB(filtros.id_recurso);
    if (!recurso || recurso.id_empresa !== id_empresa) {
      throw { status: 404, message: 'Recurso no encontrado en tu empresa.' };
    }
  }

  const reservas = await listarHistorialReservasDB(filtros);
  return reservas;
}

// Liberar reservas no usadas después de 15 minutos (HU-4.8)
// Esta función luego se puede llamar desde un cron o endpoint protegido.
export async function liberarReservasNoUsadasService(minutosTolerancia = 15) {
  const candidatas = await listarReservasParaLiberarDB(minutosTolerancia);

  const resultados = [];

  for (const reserva of candidatas) {
    const actualizada = await actualizarReservaRecursoDB(reserva.id, {
      estado: 'EXPIRADA'
    });
    resultados.push(actualizada);
  }

  return resultados;
}
