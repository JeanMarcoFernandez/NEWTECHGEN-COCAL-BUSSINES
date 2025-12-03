// controllers/reservaRecursoController.js
import {
  crearReservaRecursoService,
  cancelarReservaRecursoService,
  aprobarReservaRecursoService,
  checkinReservaRecursoService,
  checkoutReservaRecursoService,
  historialReservasService,
  liberarReservasNoUsadasService
} from '../services/reservaRecursoService.js';

export async function crearReservaRecursoController(req, res) {
  try {
    const usuario = req.user;
    const resultado = await crearReservaRecursoService(req.body, usuario);
    return res.status(201).json(resultado);
  } catch (err) {
    console.error('Error crearReservaRecursoController:', err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || 'Error al crear reserva de recurso.' });
  }
}

export async function cancelarReservaRecursoController(req, res) {
  try {
    const usuario = req.user;
    const id = Number(req.params.id);
    const actualizada = await cancelarReservaRecursoService(id, usuario);
    return res.json(actualizada);
  } catch (err) {
    console.error('Error cancelarReservaRecursoController:', err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || 'Error al cancelar reserva.' });
  }
}

export async function aprobarReservaRecursoController(req, res) {
  try {
    const usuario = req.user;
    const id = Number(req.params.id);
    const { aprobar, comentario } = req.body;

    const actualizada = await aprobarReservaRecursoService(
      id,
      usuario,
      { aprobar, comentario }
    );

    return res.json(actualizada);
  } catch (err) {
    console.error('Error aprobarReservaRecursoController:', err);
    return res
      .status(err.status || 500)
      .json({
        message: err.message || 'Error al aprobar/rechazar la reserva.'
      });
  }
}

export async function checkinReservaRecursoController(req, res) {
  try {
    const usuario = req.user;
    const id = Number(req.params.id);

    const actualizada = await checkinReservaRecursoService(id, usuario);
    return res.json(actualizada);
  } catch (err) {
    console.error('Error checkinReservaRecursoController:', err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || 'Error al hacer check-in.' });
  }
}

export async function checkoutReservaRecursoController(req, res) {
  try {
    const usuario = req.user;
    const id = Number(req.params.id);

    const actualizada = await checkoutReservaRecursoService(id, usuario);
    return res.json(actualizada);
  } catch (err) {
    console.error('Error checkoutReservaRecursoController:', err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || 'Error al hacer check-out.' });
  }
}

export async function historialReservasController(req, res) {
  try {
    const usuario = req.user;
    const filtros = {
      id_recurso: req.query.id_recurso
        ? Number(req.query.id_recurso)
        : undefined,
      id_solicitante: req.query.id_solicitante
        ? Number(req.query.id_solicitante)
        : undefined,
      id_aprobador: req.query.id_aprobador
        ? Number(req.query.id_aprobador)
        : undefined,
      estado: req.query.estado,
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta
    };

    const reservas = await historialReservasService(filtros, usuario);
    return res.json(reservas);
  } catch (err) {
    console.error('Error historialReservasController:', err);
    return res
      .status(err.status || 500)
      .json({
        message: err.message || 'Error al obtener historial de reservas.'
      });
  }
}

// Endpoint opcional para disparar liberación automática (para un cron externo)
export async function liberarReservasNoUsadasController(req, res) {
  try {
    const minutos = req.query.minutos
      ? Number(req.query.minutos)
      : 15;

    const liberadas = await liberarReservasNoUsadasService(minutos);
    return res.json({
      cantidad: liberadas.length,
      reservas: liberadas
    });
  } catch (err) {
    console.error('Error liberarReservasNoUsadasController:', err);
    return res
      .status(err.status || 500)
      .json({
        message: err.message || 'Error al liberar reservas no usadas.'
      });
  }
}
