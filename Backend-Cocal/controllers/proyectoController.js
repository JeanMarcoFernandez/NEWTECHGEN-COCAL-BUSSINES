// controllers/proyectoController.js
import {
  crearProyectoDepartamento,
  crearProyectoEmpresa,
  obtenerProyectoPorId,
  actualizarProyecto,
  eliminarProyecto,
  obtenerProyectosPorEmpresa,
  obtenerProyectosPorDepartamento,
  obtenerDepartamentosDeProyecto,
} from '../models/proyectoModel.js';

// POST /api/proyectos/departamento
export async function crearProyectoDepartamentoController(req, res) {
  try {
    const {
      id_departamento,
      nombre,
      descripcion,
      visibilidad,
      responsable,
      fecha_inicio,
      fecha_fin,
    } = req.body;

    if (!id_departamento || !nombre) {
      return res.status(400).json({
        message: 'id_departamento y nombre son obligatorios para crear un proyecto de departamento.',
      });
    }

    const nuevoProyecto = await crearProyectoDepartamento({
      id_departamento,
      nombre,
      descripcion,
      visibilidad,
      responsable,
      fecha_inicio,
      fecha_fin,
    });

    return res.status(201).json(nuevoProyecto);
  } catch (error) {
    console.error('Error en crearProyectoDepartamentoController:', error.message);
    return res.status(500).json({ message: 'Error al crear el proyecto de departamento.' });
  }
}

// POST /api/proyectos/empresa
export async function crearProyectoEmpresaController(req, res) {
  try {
    const {
      id_empresa,
      nombre,
      descripcion,
      visibilidad,
      responsable,
      fecha_inicio,
      fecha_fin,
      departamentos_implicados,
    } = req.body;

    if (!id_empresa || !nombre) {
      return res.status(400).json({
        message: 'id_empresa y nombre son obligatorios para crear un proyecto de empresa.',
      });
    }

    const nuevoProyecto = await crearProyectoEmpresa({
      id_empresa,
      nombre,
      descripcion,
      visibilidad,
      responsable,
      fecha_inicio,
      fecha_fin,
      departamentos_implicados: departamentos_implicados || [],
    });

    return res.status(201).json(nuevoProyecto);
  } catch (error) {
    console.error('Error en crearProyectoEmpresaController:', error.message);
    return res.status(500).json({ message: 'Error al crear el proyecto de empresa.' });
  }
}

// GET /api/proyectos/empresa/:idEmpresa
export async function listarProyectosPorEmpresaController(req, res) {
  try {
    const { idEmpresa } = req.params;
    const proyectos = await obtenerProyectosPorEmpresa(idEmpresa);

    return res.status(200).json(proyectos);
  } catch (error) {
    console.error('Error en listarProyectosPorEmpresaController:', error.message);
    return res.status(500).json({ message: 'Error al listar proyectos por empresa.' });
  }
}

// GET /api/proyectos/departamento/:idDepartamento
export async function listarProyectosPorDepartamentoController(req, res) {
  try {
    const { idDepartamento } = req.params;
    const proyectos = await obtenerProyectosPorDepartamento(idDepartamento);

    return res.status(200).json(proyectos);
  } catch (error) {
    console.error('Error en listarProyectosPorDepartamentoController:', error.message);
    return res.status(500).json({ message: 'Error al listar proyectos por departamento.' });
  }
}

// GET /api/proyectos/:id
export async function obtenerProyectoController(req, res) {
  try {
    const { id } = req.params;
    const proyecto = await obtenerProyectoPorId(id);

    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    return res.status(200).json(proyecto);
  } catch (error) {
    console.error('Error en obtenerProyectoController:', error.message);
    return res.status(500).json({ message: 'Error al obtener el proyecto.' });
  }
}

// PUT /api/proyectos/:id
export async function actualizarProyectoController(req, res) {
  try {
    const { id } = req.params;
    const datos = req.body;

    const proyectoActualizado = await actualizarProyecto(id, datos);

    if (!proyectoActualizado) {
      return res
        .status(404)
        .json({ message: 'Proyecto no encontrado para actualizar.' });
    }

    return res.status(200).json(proyectoActualizado);
  } catch (error) {
    console.error('Error en actualizarProyectoController:', error.message);
    return res.status(500).json({ message: 'Error al actualizar el proyecto.' });
  }
}

// DELETE /api/proyectos/:id
export async function eliminarProyectoController(req, res) {
  try {
    const { id } = req.params;

    const proyecto = await obtenerProyectoPorId(id);
    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    await eliminarProyecto(id);
    return res.status(204).send();
  } catch (error) {
    console.error('Error en eliminarProyectoController:', error.message);
    return res.status(500).json({ message: 'Error al eliminar el proyecto.' });
  }
}

// GET /api/proyectos/:id/departamentos
export async function listarDepartamentosDeProyectoController(req, res) {
  try {
    const { id } = req.params;
    const departamentos = await obtenerDepartamentosDeProyecto(id);

    return res.status(200).json(departamentos);
  } catch (error) {
    console.error('Error en listarDepartamentosDeProyectoController:', error.message);
    return res.status(500).json({
      message: 'Error al obtener los departamentos implicados en el proyecto.',
    });
  }
}
