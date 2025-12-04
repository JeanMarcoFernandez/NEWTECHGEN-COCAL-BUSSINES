// controllers/recursoController.js
import {
  crearRecursoService,
  listarRecursosService,
  obtenerRecursoService,
  cambiarEstadoMantenimientoService,
  buscarRecursosDisponiblesService
} from '../services/recursoService.js';

export async function crearRecursoController(req, res) {
  try {
    const usuario = req.user; // viene de verificarToken
    const nuevo = await crearRecursoService(req.body, usuario);
    return res.status(201).json(nuevo);
  } catch (err) {
    console.error('Error crearRecursoController:', err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || 'Error al crear recurso.' });
  }
}

export async function listarRecursosController(req, res) {
  try {
    const usuario = req.user;
    const filtros = {
      tipo: req.query.tipo,
      id_departamento: req.query.id_departamento
        ? Number(req.query.id_departamento)
        : undefined,
      visibilidad: req.query.visibilidad,
      en_mantenimiento:
        typeof req.query.en_mantenimiento !== 'undefined'
          ? req.query.en_mantenimiento === 'true'
          : undefined
    };

    const recursos = await listarRecursosService(filtros, usuario);
    return res.json(recursos);
  } catch (err) {
    console.error('Error listarRecursosController:', err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || 'Error al listar recursos.' });
  }
}

export async function obtenerRecursoController(req, res) {
  try {
    const usuario = req.user;
    const id = Number(req.params.id);

    const recurso = await obtenerRecursoService(id, usuario);
    return res.json(recurso);
  } catch (err) {
    console.error('Error obtenerRecursoController:', err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || 'Error al obtener recurso.' });
  }
}

export async function cambiarEstadoMantenimientoController(req, res) {
  try {
    const usuario = req.user;
    const id = Number(req.params.id);
    const { en_mantenimiento } = req.body;

    const actualizado = await cambiarEstadoMantenimientoService(
      id,
      Boolean(en_mantenimiento),
      usuario
    );

    return res.json(actualizado);
  } catch (err) {
    console.error('Error cambiarEstadoMantenimientoController:', err);
    return res
      .status(err.status || 500)
      .json({
        message: err.message || 'Error al cambiar estado de mantenimiento.'
      });
  }
}
// GET /api/recursos/disponibles
export async function recursosDisponiblesController(req, res) {
  try {
    const usuario = req.user;

    const {
      fecha_inicio,
      fecha_fin,
      tipo,
      capacidad_minima,
      id_departamento
    } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res
        .status(400)
        .json({ message: 'fecha_inicio y fecha_fin son obligatorios.' });
    }

    // CORRECCIÓN DEFINITIVA ÉPICA 🔥
    const capacidadMin = isNaN(parseInt(capacidad_minima))
      ? null
      : parseInt(capacidad_minima);

    const departamentoMin = isNaN(parseInt(id_departamento))
      ? null
      : parseInt(id_departamento);

    const resultado = await buscarRecursosDisponiblesService(
      {
        fecha_inicio,
        fecha_fin,
        tipo,
        capacidad_minima: capacidadMin,
        id_departamento: departamentoMin
      },
      usuario
    );

    return res.json(resultado);

  } catch (err) {
    console.error('Error recursosDisponiblesController:', err);
    return res
      .status(err.status || 500)
      .json({
        message: err.message || 'Error al consultar recursos disponibles.'
      });
  }
}
