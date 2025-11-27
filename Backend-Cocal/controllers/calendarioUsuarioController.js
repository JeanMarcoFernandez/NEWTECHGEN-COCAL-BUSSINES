// controllers/calendarioUsuarioController.js
import {
  crearCalendarioUsuarioService,
  listarCalendariosUsuarioService,
  crearEventoUsuarioService,
  listarEventosCalendarioUsuarioService,
  actualizarEventoUsuarioService,
  eliminarEventoUsuarioService,
  agregarParticipantesEventoUsuarioService,
  actualizarEstadoParticipacionUsuarioService,
  actualizarCalendarioUsuarioService,
  eliminarCalendarioUsuarioService,
} from '../services/calendarioUsuarioService.js';



// POST /api/calendarios/usuario
export async function crearCalendarioUsuarioController(req, res) {
  try {
    const id_usuario = req.user.id; // viene del JWT
    const { nombre, zona_horaria } = req.body;

    const calendario = await crearCalendarioUsuarioService(id_usuario, { nombre, zona_horaria });
    return res.status(201).json(calendario);
  } catch (err) {
    console.error('Error al crear calendario de usuario:', err.message);
    return res.status(400).json({ message: err.message });
  }
}


export async function listarCalendariosUsuarioController(req, res) {
  try {
    const id_usuario = req.user.id;
    const calendarios = await listarCalendariosUsuarioService(id_usuario);
    return res.json(calendarios);
  } catch (err) {
    console.error('Error al listar calendarios de usuario:', err.message);
    return res.status(500).json({ message: 'Error al listar calendarios de usuario' });
  }
}


export async function actualizarCalendarioUsuarioController(req, res) {
  try {
    const id_usuario = req.user.id;
    const { idCalendario } = req.params;

    // Body puede traer 1, 2 o todos los campos
    const { nombre, zona_horaria } = req.body;

    const actualizado = await actualizarCalendarioUsuarioService(
      id_usuario,
      Number(idCalendario),
      { nombre, zona_horaria },
    );

    return res.status(200).json({
      message: 'Calendario actualizado correctamente',
      data: actualizado,
    });
  } catch (err) {
    console.error('Error al actualizar calendario de usuario:', err.message);

    if (err.message === 'Calendario no encontrado') {
      return res.status(404).json({ message: err.message });
    }

    if (err.message === 'No tienes permiso sobre este calendario') {
      return res.status(403).json({ message: err.message });
    }

    return res.status(500).json({ message: 'Error al actualizar el calendario' });
  }
}


export async function eliminarCalendarioUsuarioController(req, res) {
  try {
    const id_usuario = req.user.id;
    const { idCalendario } = req.params;

    await eliminarCalendarioUsuarioService(id_usuario, Number(idCalendario));
    return res.status(204).send();
  } catch (err) {
    console.error('Error al eliminar calendario de usuario:', err.message);

    if (err.message === 'Calendario no encontrado') {
      return res.status(404).json({ message: err.message });
    }

    if (err.message === 'No tienes permiso sobre este calendario') {
      return res.status(403).json({ message: err.message });
    }

    return res.status(500).json({ message: 'Error al eliminar el calendario' });
  }
}


export async function crearEventoUsuarioController(req, res) {
  try {
    const id_usuario = req.user.id;
    const { idCalendario } = req.params;

    const evento = await crearEventoUsuarioService(id_usuario, Number(idCalendario), req.body);
    return res.status(201).json(evento);
  } catch (err) {
    console.error('Error al crear evento de usuario:', err.message);
    return res.status(400).json({ message: err.message });
  }
}

export async function listarEventosCalendarioUsuarioController(req, res) {
  try {
    const id_usuario = req.user.id;
    const { idCalendario } = req.params;

    const eventos = await listarEventosCalendarioUsuarioService(
      id_usuario,
      Number(idCalendario),
    );
    return res.json(eventos);
  } catch (err) {
    console.error('Error al listar eventos del calendario usuario:', err.message);
    return res.status(400).json({ message: err.message });
  }
}

export async function actualizarEventoUsuarioController(req, res) {
  try {
    const { idEvento } = req.params;
    const id_usuario = req.user.id; // dueño del calendario

    const {
      titulo,
      descripcion,
      tipo,
      fecha_inicio,
      fecha_fin,
      responsable,
      estado,
      visibilidad,
    } = req.body;

    const eventoActualizado = await actualizarEventoUsuarioService({
      id_evento: Number(idEvento),
      id_usuario,
      datosParche: {
        titulo,
        descripcion,
        tipo,
        fecha_inicio,
        fecha_fin,
        responsable,
        estado,
        visibilidad,
      },
    });

    return res.status(200).json({
      message: 'Evento actualizado correctamente',
      data: eventoActualizado,
    });
  } catch (error) {
    console.error('Error en actualizarEventoUsuarioController:', error.message);

    if (error.message === 'Evento no encontrado o no pertenece al usuario') {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === 'Rango de fechas inválido') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Error al actualizar el evento' });
  }
}

export async function eliminarEventoUsuarioController(req, res) {
  try {
    const id_usuario = req.user.id;
    const { idEvento } = req.params;

    await eliminarEventoUsuarioService(id_usuario, Number(idEvento));
    return res.status(204).send();
  } catch (err) {
    console.error('Error al eliminar evento usuario:', err.message);
    return res.status(400).json({ message: err.message });
  }
}

export async function agregarParticipantesEventoUsuarioController(req, res) {
  try {
    const id_usuario = req.user.id;
    const { idEvento } = req.params;

    const resultado = await agregarParticipantesEventoUsuarioService(
      id_usuario,
      Number(idEvento),
      req.body,
    );
    return res.status(201).json(resultado);
  } catch (err) {
    console.error('Error al agregar participantes (usuario):', err.message);
    return res.status(400).json({ message: err.message });
  }
}

export async function actualizarEstadoParticipacionUsuarioController(req, res) {
  try {
    const id_usuario = req.user.id;
    const { idEvento, usuarioId } = req.params;
    const { estado } = req.body;

    const actualizado = await actualizarEstadoParticipacionUsuarioService(
      id_usuario,
      Number(idEvento),
      Number(usuarioId),
      estado,
    );

    return res.json(actualizado);
  } catch (err) {
    console.error('Error al actualizar estado participación (usuario):', err.message);
    return res.status(400).json({ message: err.message });
  }
}
