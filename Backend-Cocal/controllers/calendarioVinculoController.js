// controllers/calendarioVinculoController.js
import {
  crearCalendarioVinculoService,
  listarVinculosProyectoService,
  listarVinculosDesdeService,
  listarVinculosHaciaService,
  eliminarVinculoPorIdService,
  eliminarVinculoUnicoService,
} from '../services/calendarioVinculoService.js';

// POST /api/calendarios/vinculos
export async function crearCalendarioVinculoController(req, res) {
  try {
    const { id_proyecto, origen_tipo, origen_id, destino_tipo, destino_id, permiso } = req.body;

    const vinculo = await crearCalendarioVinculoService({
      id_proyecto,
      origen_tipo,
      origen_id,
      destino_tipo,
      destino_id,
      permiso,
    });

    return res.status(201).json(vinculo);
  } catch (err) {
    console.error('Error al crear vínculo de calendario:', err.message);
    return res.status(400).json({ message: err.message });
  }
}

// GET /api/calendarios/vinculos/proyecto/:idProyecto
export async function listarVinculosPorProyectoController(req, res) {
  try {
    const { idProyecto } = req.params;
    const data = await listarVinculosProyectoService(Number(idProyecto));
    return res.json(data);
  } catch (err) {
    console.error('Error al listar vínculos de proyecto:', err.message);
    return res.status(400).json({ message: err.message });
  }
}

// GET /api/calendarios/vinculos/origen
export async function listarVinculosDesdeController(req, res) {
  try {
    const { id_proyecto, origen_tipo, origen_id } = req.query;

    const data = await listarVinculosDesdeService({
      id_proyecto: Number(id_proyecto),
      origen_tipo,
      origen_id: Number(origen_id),
    });

    return res.json(data);
  } catch (err) {
    console.error('Error al listar vínculos desde origen:', err.message);
    return res.status(400).json({ message: err.message });
  }
}

// GET /api/calendarios/vinculos/destino
export async function listarVinculosHaciaController(req, res) {
  try {
    const { id_proyecto, destino_tipo, destino_id } = req.query;

    const data = await listarVinculosHaciaService({
      id_proyecto: Number(id_proyecto),
      destino_tipo,
      destino_id: Number(destino_id),
    });

    return res.json(data);
  } catch (err) {
    console.error('Error al listar vínculos hacia destino:', err.message);
    return res.status(400).json({ message: err.message });
  }
}

// DELETE /api/calendarios/vinculos/:id
export async function eliminarVinculoPorIdController(req, res) {
  try {
    const { id } = req.params;
    await eliminarVinculoPorIdService(Number(id));
    return res.status(204).send();
  } catch (err) {
    console.error('Error al eliminar vínculo por id:', err.message);
    return res.status(400).json({ message: err.message });
  }
}

// DELETE /api/calendarios/vinculos
// body: { id_proyecto, origen_tipo, origen_id, destino_tipo, destino_id }
export async function eliminarVinculoUnicoController(req, res) {
  try {
    await eliminarVinculoUnicoService(req.body);
    return res.status(204).send();
  } catch (err) {
    console.error('Error al eliminar vínculo único:', err.message);
    return res.status(400).json({ message: err.message });
  }
}
