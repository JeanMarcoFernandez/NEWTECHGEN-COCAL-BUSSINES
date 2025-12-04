// services/calendarioUsuarioService.js
import {
  crearCalendarioUsuarioModel,
  obtenerCalendariosDeUsuario,
  obtenerCalendarioPorId,
  actualizarCalendarioModelBase,
  eliminarCalendarioModel,
} from '../models/calendarioModel.js';

import {
  crearEventoModel,
  obtenerEventosPorCalendario,
  obtenerEventoPorId,
  actualizarEventoModelBase,
  eliminarEventoModel,
} from '../models/eventoModel.js';

import {
  agregarParticipanteEventoModel,
  agregarParticipantesEventoLoteModel,
  actualizarEstadoParticipacionModel,
} from '../models/participacionEventoModel.js';

import { validarFechas, validarVisibilidad } from './calendarioCommon.js';
import { verificarUsuarioExiste } from './usuarioService.js';



export async function crearCalendarioUsuarioService(id_usuario, { nombre, zona_horaria }) {
  return await crearCalendarioUsuarioModel({ id_usuario, nombre, zona_horaria });
}

export async function listarCalendariosUsuarioService(id_usuario) {
  return await obtenerCalendariosDeUsuario(id_usuario);
}

// 🔹 NUEVO: actualizar calendario (PATCH parcial)
export async function actualizarCalendarioUsuarioService(id_usuario, id_calendario, datosParche) {
  const cal = await asegurarCalendarioPerteneceAUsuario(id_calendario, id_usuario);

  const { nombre, zona_horaria } = datosParche;

  const updateData = {};
  if (nombre !== undefined) updateData.nombre = nombre;
  if (zona_horaria !== undefined) updateData.zona_horaria = zona_horaria;

  // Si no hay nada que actualizar, devolvemos el calendario original
  if (Object.keys(updateData).length === 0) {
    return cal;
  }

  const actualizado = await actualizarCalendarioModelBase(id_calendario, updateData);
  return actualizado;
}

// 🔹 NUEVO: eliminar calendario
export async function eliminarCalendarioUsuarioService(id_usuario, id_calendario) {
  await asegurarCalendarioPerteneceAUsuario(id_calendario, id_usuario);
  await eliminarCalendarioModel(id_calendario);
}


async function asegurarCalendarioPerteneceAUsuario(id_calendario, id_usuario) {
  const cal = await obtenerCalendarioPorId(id_calendario);
  if (!cal) throw new Error('Calendario no encontrado');
  if (cal.id_usuario !== id_usuario) {
    throw new Error('No tienes permiso sobre este calendario');
  }
  return cal;
}

async function asegurarEventoPerteneceACalendarioUsuario(id_evento, id_usuario) {
  const evento = await obtenerEventoPorId(id_evento);
  if (!evento) throw new Error('Evento no encontrado');

  const cal = await obtenerCalendarioPorId(evento.id_calendario);
  if (!cal) throw new Error('Calendario no encontrado');
  if (cal.id_usuario !== id_usuario) {
    throw new Error('No tienes permiso sobre este evento');
  }

  return { evento, calendario: cal };
}


export async function crearEventoUsuarioService(id_usuario, id_calendario, datosEvento) {
  await asegurarCalendarioPerteneceAUsuario(id_calendario, id_usuario);

  const { titulo, descripcion, tipo, fecha_inicio, fecha_fin, responsable, visibilidad } =
    datosEvento;

  validarFechas(fecha_inicio, fecha_fin);
  if (visibilidad) validarVisibilidad(visibilidad);
  if (responsable) await verificarUsuarioExiste(responsable);

  const evento = await crearEventoModel({
    id_calendario,
    titulo,
    descripcion,
    tipo,
    fecha_inicio,
    fecha_fin,
    responsable,
    visibilidad,
  });

  return evento;
}

export async function listarEventosCalendarioUsuarioService(id_usuario, id_calendario) {
  await asegurarCalendarioPerteneceAUsuario(id_calendario, id_usuario);
  return await obtenerEventosPorCalendario(id_calendario);
}

export async function actualizarEventoUsuarioService({ id_usuario, id_evento, datosParche }) {
  const { evento } = await asegurarEventoPerteneceACalendarioUsuario(id_evento, id_usuario);

  const {
    titulo,
    descripcion,
    tipo,
    fecha_inicio,
    fecha_fin,
    responsable,
    estado,
    visibilidad,
  } = datosParche;

  const updateData = {};
  if (titulo !== undefined) updateData.titulo = titulo;
  if (descripcion !== undefined) updateData.descripcion = descripcion;
  if (tipo !== undefined) updateData.tipo = tipo;
  if (fecha_inicio !== undefined) updateData.fecha_inicio = fecha_inicio;
  if (fecha_fin !== undefined) updateData.fecha_fin = fecha_fin;
  if (responsable !== undefined) updateData.responsable = responsable;
  if (estado !== undefined) updateData.estado = estado;
  if (visibilidad !== undefined) updateData.visibilidad = visibilidad;

  if (Object.keys(updateData).length === 0) {
    return evento;
  }

  const fechaInicioFinal = updateData.fecha_inicio ?? evento.fecha_inicio;
  const fechaFinFinal = updateData.fecha_fin ?? evento.fecha_fin;
  if (fechaInicioFinal && fechaFinFinal) {
    validarFechas(fechaInicioFinal, fechaFinFinal);
  }

  if (updateData.visibilidad) {
    validarVisibilidad(updateData.visibilidad);
  }

  if (updateData.responsable) {
    await verificarUsuarioExiste(updateData.responsable);
  }

  const actualizado = await actualizarEventoModelBase(id_evento, updateData);
  return actualizado;
}

export async function eliminarEventoUsuarioService(id_usuario, id_evento) {
  await asegurarEventoPerteneceACalendarioUsuario(id_evento, id_usuario);
  await eliminarEventoModel(id_evento);
}

export async function agregarParticipantesEventoUsuarioService(id_usuario, id_evento, body) {
  await asegurarEventoPerteneceACalendarioUsuario(id_evento, id_usuario);

  const { participantes, id_usuario: participanteSingle, estado } = body;

  if (Array.isArray(participantes)) {
    return await agregarParticipantesEventoLoteModel(id_evento, participantes);
  }

  return await agregarParticipanteEventoModel({
    id_evento,
    id_usuario: participanteSingle,
    estado,
  });
}

export async function actualizarEstadoParticipacionUsuarioService(
  id_usuario,
  id_evento,
  usuarioObjetivo,
  estado,
) {
  await asegurarEventoPerteneceACalendarioUsuario(id_evento, id_usuario);
  const updated = await actualizarEstadoParticipacionModel(id_evento, usuarioObjetivo, estado);
  return updated;
}
