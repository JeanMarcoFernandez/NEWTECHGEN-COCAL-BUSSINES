// controllers/departamentoController.js
import {
  crearDepartamento,
  obtenerDepartamentosPorEmpresa,
  obtenerDepartamentoPorId,
  actualizarDepartamento,
  eliminarDepartamento,
} from '../models/departamentoModel.js';

// POST /api/departamentos
export async function crearDepartamentoController(req, res) {
  try {
    const { id_empresa, nombre, descripcion, area, visibilidad } = req.body;

    if (!id_empresa || !nombre) {
      return res.status(400).json({
        message: 'id_empresa y nombre son obligatorios para crear un departamento.',
      });
    }

    const nuevoDepartamento = await crearDepartamento({
      id_empresa,
      nombre,
      descripcion,
      area,
      visibilidad,
    });

    return res.status(201).json(nuevoDepartamento);
  } catch (error) {
    console.error('Error en crearDepartamentoController:', error.message);
    return res.status(500).json({ message: 'Error al crear el departamento.' });
  }
}

// GET /api/departamentos/empresa/:idEmpresa
export async function listarDepartamentosPorEmpresaController(req, res) {
  try {
    const { idEmpresa } = req.params;
    const departamentos = await obtenerDepartamentosPorEmpresa(idEmpresa);

    return res.status(200).json(departamentos);
  } catch (error) {
    console.error('Error en listarDepartamentosPorEmpresaController:', error.message);
    return res.status(500).json({ message: 'Error al listar los departamentos.' });
  }
}

// GET /api/departamentos/:id
export async function obtenerDepartamentoController(req, res) {
  try {
    const { id } = req.params;
    const departamento = await obtenerDepartamentoPorId(id);

    if (!departamento) {
      return res.status(404).json({ message: 'Departamento no encontrado.' });
    }

    return res.status(200).json(departamento);
  } catch (error) {
    console.error('Error en obtenerDepartamentoController:', error.message);
    return res.status(500).json({ message: 'Error al obtener el departamento.' });
  }
}

// PUT /api/departamentos/:id
export async function actualizarDepartamentoController(req, res) {
  try {
    const { id } = req.params;
    const datos = req.body;

    const departamentoActualizado = await actualizarDepartamento(id, datos);

    if (!departamentoActualizado) {
      return res.status(404).json({ message: 'Departamento no encontrado para actualizar.' });
    }

    return res.status(200).json(departamentoActualizado);
  } catch (error) {
    console.error('Error en actualizarDepartamentoController:', error.message);
    return res.status(500).json({ message: 'Error al actualizar el departamento.' });
  }
}

// DELETE /api/departamentos/:id
export async function eliminarDepartamentoController(req, res) {
  try {
    const { id } = req.params;

    const departamento = await obtenerDepartamentoPorId(id);
    if (!departamento) {
      return res.status(404).json({ message: 'Departamento no encontrado.' });
    }

    await eliminarDepartamento(id);
    return res.status(204).send();
  } catch (error) {
    console.error('Error en eliminarDepartamentoController:', error.message);
    return res.status(500).json({ message: 'Error al eliminar el departamento.' });
  }
}
