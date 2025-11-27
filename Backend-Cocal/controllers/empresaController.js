// controllers/empresaController.js
import {
  crearEmpresa,
  obtenerEmpresas,
  obtenerEmpresaPorId,
  actualizarEmpresa,
  eliminarEmpresa,
} from '../models/empresaModel.js';

// POST /api/empresas
export async function crearEmpresaController(req, res) {
  try {
    const { nombre, nit, rubro, direccion, telefono, sitio_web } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre de la empresa es obligatorio.' });
    }

    const nuevaEmpresa = await crearEmpresa({
      nombre,
      nit,
      rubro,
      direccion,
      telefono,
      sitio_web,
    });

    return res.status(201).json(nuevaEmpresa);
  } catch (error) {
    console.error('Error en crearEmpresaController:', error.message);
    return res.status(500).json({ message: 'Error al crear la empresa.' });
  }
}

// GET /api/empresas
export async function listarEmpresasController(req, res) {
  try {
    const empresas = await obtenerEmpresas();
    return res.status(200).json(empresas);
  } catch (error) {
    console.error('Error en listarEmpresasController:', error.message);
    return res.status(500).json({ message: 'Error al obtener las empresas.' });
  }
}

// GET /api/empresas/:id
export async function obtenerEmpresaController(req, res) {
  try {
    const { id } = req.params;
    const empresa = await obtenerEmpresaPorId(id);

    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada.' });
    }

    return res.status(200).json(empresa);
  } catch (error) {
    console.error('Error en obtenerEmpresaController:', error.message);
    return res.status(500).json({ message: 'Error al obtener la empresa.' });
  }
}

// PUT /api/empresas/:id
export async function actualizarEmpresaController(req, res) {
  try {
    const { id } = req.params;
    const datos = req.body;

    const empresaActualizada = await actualizarEmpresa(id, datos);

    if (!empresaActualizada) {
      return res.status(404).json({ message: 'Empresa no encontrada para actualizar.' });
    }

    return res.status(200).json(empresaActualizada);
  } catch (error) {
    console.error('Error en actualizarEmpresaController:', error.message);
    return res.status(500).json({ message: 'Error al actualizar la empresa.' });
  }
}

// DELETE /api/empresas/:id
export async function eliminarEmpresaController(req, res) {
  try {
    const { id } = req.params;

    const empresa = await obtenerEmpresaPorId(id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada.' });
    }

    await eliminarEmpresa(id);
    return res.status(204).send();
  } catch (error) {
    console.error('Error en eliminarEmpresaController:', error.message);
    return res.status(500).json({ message: 'Error al eliminar la empresa.' });
  }
}
