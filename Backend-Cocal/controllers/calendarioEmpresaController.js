// controllers/calendarioEmpresaController.js
import {
  crearCalendarioEmpresaService,
  listarCalendariosEmpresaProyectoService,
  crearEventoEmpresaService,
  listarEventosCalendarioEmpresaService,
  actualizarEventoEmpresaService,
  eliminarEventoEmpresaService,
} from '../services/calendarioEmpresaService.js';

// POST /api/calendarios/empresa/proyecto/:idProyecto
export async function crearCalendarioEmpresaController(req, res) {
  try {
    const id_usuario = req.user.id;
    const id_empresa = req.user.id_empresa;
    const { idProyecto } = req.params;
    const { nombre, descripcion, zona_horaria } = req.body;

    const calendario = await crearCalendarioEmpresaService(
      id_usuario,
      id_empresa,
      {
        id_proyecto: Number(idProyecto),
        nombre,
        descripcion,
        zona_horaria,
      },
    );

    return res.status(201).json(calendario);
  } catch (error) {
    console.error('Error al crear calendario de empresa:', error.message);
    return res.status(400).json({ message: error.message });
  }
}

// GET /api/calendarios/empresa/proyecto/:idProyecto
export async function listarCalendariosEmpresaProyectoController(req, res) {
  try {
    const id_empresa = req.user.id_empresa;
    const { idProyecto } = req.params;

    const calendarios = await listarCalendariosEmpresaProyectoService(
      id_empresa,
      Number(idProyecto),
    );

    return res.json(calendarios);
  } catch (error) {
    console.error('Error al listar calendarios de empresa:', error.message);
    return res.status(400).json({ message: error.message });
  }
}

// POST /api/calendarios/empresa/:idCalendario/eventos
export async function crearEventoEmpresaController(req, res) {
  try {
    const id_empresa = req.user.id_empresa;
    const { idCalendario } = req.params;

    const evento = await crearEventoEmpresaService(
      id_empresa,
      Number(idCalendario),
      req.body,
    );

    return res.status(201).json(evento);
  } catch (error) {
    console.error('Error al crear evento de empresa:', error.message);
    return res.status(400).json({ message: error.message });
  }
}

// GET /api/calendarios/empresa/:idCalendario/eventos
export async function listarEventosCalendarioEmpresaController(req, res) {
  try {
    const id_empresa = req.user.id_empresa;
    const { idCalendario } = req.params;

    const eventos = await listarEventosCalendarioEmpresaService(
      id_empresa,
      Number(idCalendario),
    );

    return res.json(eventos);
  } catch (error) {
    console.error('Error al listar eventos de empresa:', error.message);
    return res.status(400).json({ message: error.message });
  }
}

// PATCH /api/calendarios/empresa/eventos/:idEvento
export async function actualizarEventoEmpresaController(req, res) {
  try {
    const id_empresa = req.user.id_empresa;
    const { idEvento } = req.params;

    const eventoActualizado = await actualizarEventoEmpresaService({
      id_empresa,
      id_evento: Number(idEvento),
      datosParche: req.body,
    });

    return res.status(200).json({
      message: 'Evento de empresa actualizado correctamente',
      data: eventoActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar evento de empresa:', error.message);

    if (error.message === 'Evento de empresa no encontrado') {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === 'Rango de fechas inválido') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Error al actualizar el evento de empresa' });
  }
}

// DELETE /api/calendarios/empresa/eventos/:idEvento
export async function eliminarEventoEmpresaController(req, res) {
  try {
    const id_empresa = req.user.id_empresa;
    const { idEvento } = req.params;

    await eliminarEventoEmpresaService({
      id_empresa,
      id_evento: Number(idEvento),
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar evento de empresa:', error.message);
    return res.status(400).json({ message: error.message });
  }
}
