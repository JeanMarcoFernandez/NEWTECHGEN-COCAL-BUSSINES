// services/calendarioEmpresaService.js
import { obtenerProyectoPorId } from '../models/proyectoModel.js';
import {
  crearCalendarioEmpresaModel,
  obtenerCalendarioEmpresaPorId,
  obtenerCalendariosEmpresaPorProyecto,
} from '../models/calendarioEmpresaModel.js';

import {
  crearEventoEmpresaModel,
  obtenerEventosEmpresaPorCalendario,
  obtenerEventoEmpresaPorId,
  actualizarEventoEmpresaModelBase,
  eliminarEventoEmpresaModel,
} from '../models/eventoEmpresaModel.js';

import { validarFechas, validarVisibilidad } from './calendarioCommon.js';
import { verificarUsuarioExiste } from './usuarioService.js';

// 🔐 helper: asegurar que el proyecto es de esa empresa y de nivel EMPRESA
async function asegurarProyectoEmpresa(id_proyecto, id_empresa) {
  const proyecto = await obtenerProyectoPorId(id_proyecto);
  if (!proyecto) {
    throw new Error('Proyecto no encontrado');
  }

  if (proyecto.nivel !== 'EMPRESA') {
    throw new Error('El proyecto no es de nivel EMPRESA');
  }

  if (proyecto.id_empresa !== id_empresa) {
    throw new Error('El proyecto no pertenece a tu empresa');
  }

  return proyecto;
}

// 🔐 helper: asegurar que el calendario_empresa pertenece a esa empresa
async function asegurarCalendarioEmpresaDeEmpresa(id_calendario_empresa, id_empresa) {
  const cal = await obtenerCalendarioEmpresaPorId(id_calendario_empresa);
  if (!cal) throw new Error('Calendario de empresa no encontrado');

  if (cal.id_empresa !== id_empresa) {
    throw new Error('No tienes permiso sobre este calendario de empresa');
  }

  return cal;
}

// =========================
// CALENDARIO EMPRESA
// =========================

export async function crearCalendarioEmpresaService(
  id_usuario,
  id_empresa,
  { id_proyecto, nombre, descripcion, zona_horaria },
) {
  await asegurarProyectoEmpresa(id_proyecto, id_empresa);

  const calendario = await crearCalendarioEmpresaModel({
    id_proyecto,
    id_empresa,
    nombre,
    descripcion,
    zona_horaria,
    creado_por: id_usuario,
  });

  return calendario;
}

export async function listarCalendariosEmpresaProyectoService(id_empresa, id_proyecto) {
  await asegurarProyectoEmpresa(id_proyecto, id_empresa);
  return await obtenerCalendariosEmpresaPorProyecto({ id_proyecto, id_empresa });
}

// =========================
// EVENTOS EMPRESA
// =========================

export async function crearEventoEmpresaService(
  id_empresa,
  id_calendario_empresa,
  datosEvento,
) {
  // Ver que el calendario sea de esa empresa
  await asegurarCalendarioEmpresaDeEmpresa(id_calendario_empresa, id_empresa);

  const {
    titulo,
    descripcion,
    tipo,
    fecha_inicio,
    fecha_fin,
    responsable,
    visibilidad,
    estado,
  } = datosEvento;

  validarFechas(fecha_inicio, fecha_fin);
  validarVisibilidad(visibilidad);
  if (responsable) {
    await verificarUsuarioExiste(responsable);
  }

  const evento = await crearEventoEmpresaModel({
    id_calendario_empresa,
    titulo,
    descripcion,
    tipo,
    fecha_inicio,
    fecha_fin,
    responsable,
    visibilidad,
    estado,
  });

  return evento;
}

export async function listarEventosCalendarioEmpresaService(
  id_empresa,
  id_calendario_empresa,
) {
  await asegurarCalendarioEmpresaDeEmpresa(id_calendario_empresa, id_empresa);
  return await obtenerEventosEmpresaPorCalendario(id_calendario_empresa);
}

export async function actualizarEventoEmpresaService({
  id_empresa,
  id_evento,
  datosParche,
}) {
  const evento = await obtenerEventoEmpresaPorId(id_evento);
  if (!evento) {
    throw new Error('Evento de empresa no encontrado');
  }

  // Ver que el calendario del evento sea de la empresa del admin
  await asegurarCalendarioEmpresaDeEmpresa(evento.id_calendario_empresa, id_empresa);

  // Validar fechas si se cambian
  if (datosParche.fecha_inicio || datosParche.fecha_fin) {
    const nuevaIni = datosParche.fecha_inicio || evento.fecha_inicio;
    const nuevaFin = datosParche.fecha_fin || evento.fecha_fin;
    validarFechas(nuevaIni, nuevaFin);
  }

  // Validar visibilidad si viene
  if (datosParche.visibilidad) {
    validarVisibilidad(datosParche.visibilidad);
  }

  // Validar responsable si viene
  if (datosParche.responsable) {
    await verificarUsuarioExiste(datosParche.responsable);
  }

  const actualizado = await actualizarEventoEmpresaModelBase(id_evento, datosParche);
  return actualizado;
}

export async function eliminarEventoEmpresaService({ id_empresa, id_evento }) {
  const evento = await obtenerEventoEmpresaPorId(id_evento);
  if (!evento) {
    throw new Error('Evento de empresa no encontrado');
  }

  await asegurarCalendarioEmpresaDeEmpresa(evento.id_calendario_empresa, id_empresa);
  await eliminarEventoEmpresaModel(id_evento);
}
