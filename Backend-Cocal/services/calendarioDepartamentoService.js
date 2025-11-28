// services/calendarioDepartamentoService.js
import {
  crearCalendarioDepartamentoModel,
  obtenerCalendariosDepartamentoPorProyecto,
  obtenerCalendariosPorDepartamento,
  obtenerCalendarioGrupoPorId,
  actualizarCalendarioGrupoModel,
  eliminarCalendarioGrupoModel,
} from '../models/calendarioDepartamentoModel.js';

import {
  crearEventoDepartamentoModel,
  obtenerEventosDepartamentoPorCalendario,
  obtenerEventoDepartamentoPorId,
  actualizarEventoDepartamentoModel,
  eliminarEventoDepartamentoModel,
} from '../models/eventoDepartamentoModel.js';

import {
  agregarParticipanteEventoDepartamentoModel,
  agregarParticipantesEventoDepartamentoLoteModel,
  actualizarEstadoParticipacionDepartamentoModel,
} from '../models/participacionEventoDepartamentoModel.js';

import { validarFechas, validarVisibilidad } from './calendarioCommon.js';
import { verificarUsuarioExiste } from './usuarioService.js';

// Crear calendario de departamento
export async function crearCalendarioDepartamentoService({
  id_proyecto,
  id_departamento,
  nombre,
  descripcion,
  zona_horaria,
  creado_por,
}) {
  return await crearCalendarioDepartamentoModel({
    id_proyecto,
    id_departamento,
    nombre,
    descripcion,
    zona_horaria,
    creado_por,
  });
}

// Listar calendarios por proyecto
export async function listarCalendariosDepartamentoPorProyectoService(id_proyecto) {
  return await obtenerCalendariosDepartamentoPorProyecto(id_proyecto);
}

// Listar calendarios por departamento
export async function listarCalendariosPorDepartamentoService(id_departamento) {
  return await obtenerCalendariosPorDepartamento(id_departamento);
}

// Actualizar calendario departamento
export async function actualizarCalendarioDepartamentoService(id_calendario, datos) {
  return await actualizarCalendarioGrupoModel(id_calendario, datos);
}

// Eliminar calendario departamento
export async function eliminarCalendarioDepartamentoService(id_calendario) {
  await eliminarCalendarioGrupoModel(id_calendario);
}

// Helper: asegurar que el calendario existe
async function asegurarCalendarioDepartamentoExiste(id_calendario) {
  const cal = await obtenerCalendarioGrupoPorId(id_calendario);
  if (!cal) throw new Error('Calendario de departamento no encontrado');
  return cal;
}

// Crear evento en calendario de departamento
export async function crearEventoDepartamentoService(id_calendario_grupo, datosEvento) {
  await asegurarCalendarioDepartamentoExiste(id_calendario_grupo);

  const {
    titulo,
    descripcion,
    tipo,
    fecha_inicio,
    fecha_fin,
    responsable,
    estado,
    visibilidad,
  } = datosEvento;

  if (!titulo) throw new Error('El título del evento es obligatorio');

  if (fecha_inicio || fecha_fin) {
    validarFechas(fecha_inicio, fecha_fin);
  }

  if (visibilidad) {
    validarVisibilidad(visibilidad);
  }

  if (responsable) {
    await verificarUsuarioExiste(responsable);
  }

  const evento = await crearEventoDepartamentoModel({
    id_calendario_grupo,
    titulo,
    descripcion,
    tipo,
    fecha_inicio,
    fecha_fin,
    responsable,
    estado,
    visibilidad,
  });

  return evento;
}

// Listar eventos de un calendario de departamento
export async function listarEventosCalendarioDepartamentoService(id_calendario_grupo) {
  await asegurarCalendarioDepartamentoExiste(id_calendario_grupo);
  return await obtenerEventosDepartamentoPorCalendario(id_calendario_grupo);
}

// Helper: asegurar evento existe
async function asegurarEventoDepartamentoExiste(id_evento) {
  const ev = await obtenerEventoDepartamentoPorId(id_evento);
  if (!ev) throw new Error('Evento de departamento no encontrado');
  return ev;
}

// Actualizar evento de departamento
export async function actualizarEventoDepartamentoService(id_evento, datos) {
  const eventoActual = await asegurarEventoDepartamentoExiste(id_evento);

  if (datos.fecha_inicio || datos.fecha_fin) {
    const nuevaIni = datos.fecha_inicio || eventoActual.fecha_inicio;
    const nuevaFin = datos.fecha_fin || eventoActual.fecha_fin;
    validarFechas(nuevaIni, nuevaFin);
  }

  if (datos.visibilidad) {
    validarVisibilidad(datos.visibilidad);
  }

  if (datos.responsable) {
    await verificarUsuarioExiste(datos.responsable);
  }

  const actualizado = await actualizarEventoDepartamentoModel(id_evento, datos);
  return actualizado;
}

// Eliminar evento de departamento
export async function eliminarEventoDepartamentoService(id_evento) {
  await asegurarEventoDepartamentoExiste(id_evento);
  await eliminarEventoDepartamentoModel(id_evento);
}

// Agregar participantes al evento de departamento
// 🔁 corregimos función de arriba
export async function agregarParticipantesEventoDepartamentoService(id_evento, body) {
  await asegurarEventoDepartamentoExiste(id_evento);

  const { participantes, id_usuario: participanteSingle, estado } = body;

  if (Array.isArray(participantes)) {
    // [{ id_usuario, estado? }, ...]
    return await agregarParticipantesEventoDepartamentoLoteModel(id_evento, participantes);
  }

  // Solo uno
  return await agregarParticipanteEventoDepartamentoModel({
    id_evento_departamento: id_evento,
    id_usuario: participanteSingle,
    estado,
  });
}

// Actualizar estado participación en evento de departamento
export async function actualizarEstadoParticipacionDepartamentoService(
  id_evento,
  usuarioObjetivo,
  estado,
) {
  await asegurarEventoDepartamentoExiste(id_evento);
  const updated = await actualizarEstadoParticipacionDepartamentoModel(
    id_evento,
    usuarioObjetivo,
    estado,
  );
  return updated;
}
