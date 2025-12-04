// services/calendarioVinculoService.js
import {
  crearCalendarioVinculoModel,
  listarVinculosPorProyectoModel,
  listarVinculosPorOrigenModel,
  listarVinculosPorDestinoModel,
  eliminarVinculoPorIdModel,
  eliminarVinculoUnicoModel,
} from '../models/calendarioVinculoModel.js';

import { obtenerCalendarioPorId } from '../models/calendarioModel.js';
import { obtenerCalendarioEmpresaPorId } from '../models/calendarioEmpresaModel.js';
import { obtenerCalendarioGrupoPorId } from '../models/calendarioGrupoModel.js'; // calendario_grupo

function validarTipoCalendario(tipo) {
  const validos = ['USUARIO', 'DEPARTAMENTO', 'EMPRESA'];
  if (!validos.includes(tipo)) {
    throw new Error(`tipo_calendario inválido: ${tipo}`);
  }
}

async function verificarCalendarioExiste(tipo, id_calendario) {
  if (tipo === 'USUARIO') {
    const cal = await obtenerCalendarioPorId(id_calendario);
    if (!cal) throw new Error('Calendario de usuario no encontrado');
    return;
  }

  if (tipo === 'DEPARTAMENTO') {
    const cal = await obtenerCalendarioGrupoPorId(id_calendario);
    if (!cal) throw new Error('Calendario de departamento (grupo) no encontrado');
    return;
  }

  if (tipo === 'EMPRESA') {
    const cal = await obtenerCalendarioEmpresaPorId(id_calendario);
    if (!cal) throw new Error('Calendario de empresa no encontrado');
    return;
  }
}

// Crear vínculo genérico (sirve para usuario → empresa, depto → empresa, etc.)
export async function crearCalendarioVinculoService({
  id_proyecto,
  origen_tipo,
  origen_id,
  destino_tipo,
  destino_id,
  permiso = 'LECTURA',
}) {
  validarTipoCalendario(origen_tipo);
  validarTipoCalendario(destino_tipo);

  if (origen_tipo === destino_tipo && origen_id === destino_id) {
    throw new Error('No puedes vincular un calendario consigo mismo');
  }

  await verificarCalendarioExiste(origen_tipo, origen_id);
  await verificarCalendarioExiste(destino_tipo, destino_id);

  const vinculo = await crearCalendarioVinculoModel({
    id_proyecto,
    origen_tipo,
    origen_id,
    destino_tipo,
    destino_id,
    permiso,
  });

  return vinculo;
}

export async function listarVinculosProyectoService(id_proyecto) {
  return await listarVinculosPorProyectoModel(id_proyecto);
}

export async function listarVinculosDesdeService({
  id_proyecto,
  origen_tipo,
  origen_id,
}) {
  validarTipoCalendario(origen_tipo);
  return await listarVinculosPorOrigenModel({ id_proyecto, origen_tipo, origen_id });
}

export async function listarVinculosHaciaService({
  id_proyecto,
  destino_tipo,
  destino_id,
}) {
  validarTipoCalendario(destino_tipo);
  return await listarVinculosPorDestinoModel({ id_proyecto, destino_tipo, destino_id });
}

export async function eliminarVinculoPorIdService(id) {
  await eliminarVinculoPorIdModel(id);
}

export async function eliminarVinculoUnicoService(filtro) {
  const {
    id_proyecto,
    origen_tipo,
    origen_id,
    destino_tipo,
    destino_id,
  } = filtro;

  validarTipoCalendario(origen_tipo);
  validarTipoCalendario(destino_tipo);

  await eliminarVinculoUnicoModel({
    id_proyecto,
    origen_tipo,
    origen_id,
    destino_tipo,
    destino_id,
  });
}
