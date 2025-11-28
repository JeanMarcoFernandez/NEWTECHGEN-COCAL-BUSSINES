// controllers/calendarioDepartamentoController.js
import {
  crearCalendarioDepartamentoService,
  listarCalendariosDepartamentoPorProyectoService,
  listarCalendariosPorDepartamentoService,
  actualizarCalendarioDepartamentoService,
  eliminarCalendarioDepartamentoService,
  crearEventoDepartamentoService,
  listarEventosCalendarioDepartamentoService,
  actualizarEventoDepartamentoService,
  eliminarEventoDepartamentoService,
  agregarParticipantesEventoDepartamentoService,
  actualizarEstadoParticipacionDepartamentoService,
} from '../services/calendarioDepartamentoService.js';

// POST /api/calendarios/departamento
export async function crearCalendarioDepartamentoController(req, res) {
  try {
    const { id_proyecto, id_departamento, nombre, descripcion, zona_horaria } = req.body;
    const creado_por = req.user.id;

    const calendario = await crearCalendarioDepartamentoService({
      id_proyecto,
      id_departamento,
      nombre,
      descripcion,
      zona_horaria,
      creado_por,
    });

    return res.status(201).json(calendario);
  } catch (err) {
    console.error('Error al crear calendario de departamento:', err.message);
    return res.status(400).json({ message: err.message });
  }
}

// GET /api/calendarios/departamento/proyecto/:idProyecto
export async function listarCalendariosPorProyectoController(req, res) {
  try {
    const { idProyecto } = req.params;
    const calendarios = await listarCalendariosDepartamentoPorProyectoService(
      Number(idProyecto),
    );
    return res.json(calendarios);
  } catch (err) {
    console.error('Error al listar calendarios de proyecto (departamentos):', err.message);
    return res.status(500).json({ message: 'Error al listar calendarios de departamento' });
  }
}

// GET /api/calendarios/departamento/departamento/:idDepartamento
export async function listarCalendariosPorDepartamentoController(req, res) {
  try {
    const { idDepartamento } = req.params;
    const calendarios = await listarCalendariosPorDepartamentoService(Number(idDepartamento));
    return res.json(calendarios);
  } catch (err) {
    console.error('Error al listar calendarios por departamento:', err.message);
    return res.status(500).json({ message: 'Error al listar calendarios de departamento' });
  }
}

// PATCH /api/calendarios/departamento/:idCalendario
export async function actualizarCalendarioDepartamentoController(req, res) {
  try {
    const { idCalendario } = req.params;
    const { nombre, descripcion, zona_horaria } = req.body;

    const actualizado = await actualizarCalendarioDepartamentoService(Number(idCalendario), {
      nombre,
      descripcion,
      zona_horaria,
    });

    return res.json({
      message: 'Calendario de departamento actualizado correctamente',
      data: actualizado,
    });
  } catch (err) {
    console.error('Error al actualizar calendario de departamento:', err.message);
    return res.status(400).json({ message: err.message });
  }
}

// DELETE /api/calendarios/departamento/:idCalendario
export async function eliminarCalendarioDepartamentoController(req, res) {
  try {
    const { idCalendario } = req.params;
    await eliminarCalendarioDepartamentoService(Number(idCalendario));
    return res.status(204).send();
  } catch (err) {
    console.error('Error al eliminar calendario de departamento:', err.message);
    return res.status(400).json({ message: err.message });
  }
}

// POST /api/calendarios/departamento/:idCalendario/eventos
export async function crearEventoDepartamentoController(req, res) {
  try {
    const { idCalendario } = req.params;
    const evento = await crearEventoDepartamentoService(Number(idCalendario), req.body);
    return res.status(201).json(evento);
  } catch (err) {
    console.error('Error al crear evento de departamento:', err.message);
    return res.status(400).json({ message: err.message });
  }
}

// GET /api/calendarios/departamento/:idCalendario/eventos
export async function listarEventosCalendarioDepartamentoController(req, res) {
  try {
    const { idCalendario } = req.params;
    const eventos = await listarEventosCalendarioDepartamentoService(Number(idCalendario));
    return res.json(eventos);
  } catch (err) {
    console.error('Error al listar eventos de calendario departamento:', err.message);
    return res.status(400).json({ message: err.message });
  }
}

// PATCH /api/calendarios/departamento/eventos/:idEvento
export async function actualizarEventoDepartamentoController(req, res) {
  try {
    const { idEvento } = req.params;

    const eventoActualizado = await actualizarEventoDepartamentoService(
      Number(idEvento),
      req.body,
    );

    return res.status(200).json({
      message: 'Evento de departamento actualizado correctamente',
      data: eventoActualizado,
    });
  } catch (error) {
    console.error('Error en actualizarEventoDepartamentoController:', error.message);

    if (error.message === 'Evento de departamento no encontrado') {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === 'Rango de fechas inválido') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Error al actualizar el evento de departamento' });
  }
}

// DELETE /api/calendarios/departamento/eventos/:idEvento
export async function eliminarEventoDepartamentoController(req, res) {
  try {
    const { idEvento } = req.params;
    await eliminarEventoDepartamentoService(Number(idEvento));
    return res.status(204).send();
  } catch (err) {
    console.error('Error al eliminar evento de departamento:', err.message);
    return res.status(400).json({ message: err.message });
  }
}

// POST /api/calendarios/departamento/eventos/:idEvento/participantes
export async function agregarParticipantesEventoDepartamentoController(req, res) {
  try {
    const { idEvento } = req.params;

    const resultado = await agregarParticipantesEventoDepartamentoService(
      Number(idEvento),
      req.body,
    );
    return res.status(201).json(resultado);
  } catch (err) {
    console.error('Error al agregar participantes (departamento):', err.message);
    return res.status(400).json({ message: err.message });
  }
}

// PATCH /api/calendarios/departamento/eventos/:idEvento/participantes/:usuarioId
export async function actualizarEstadoParticipacionDepartamentoController(req, res) {
  try {
    const { idEvento, usuarioId } = req.params;
    const { estado } = req.body;

    const actualizado = await actualizarEstadoParticipacionDepartamentoService(
      Number(idEvento),
      Number(usuarioId),
      estado,
    );

    return res.json(actualizado);
  } catch (err) {
    console.error('Error al actualizar estado participación (departamento):', err.message);
    return res.status(400).json({ message: err.message });
  }
}
