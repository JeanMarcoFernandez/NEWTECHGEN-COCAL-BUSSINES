import {
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuarioPorId,
  eliminarUsuarioPorId
} from '../models/userModel.js';

export async function listarUsuarios(req, res) {
  try {
    const { data, error } = await obtenerTodosLosUsuarios();
    if (error) throw error;

    res.status(200).json({
      mensaje: 'Lista de usuarios obtenida correctamente',
      usuarios: data,
    });
  } catch (err) {
    res.status(500).json({
      mensaje: 'Error al listar usuarios ',
      error: err.message,
    });
  }
}


export async function obtenerUsuario(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await obtenerUsuarioPorId(id);
    if (error) throw error;

    if (!data) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado ' });
    }

    res.status(200).json({
      mensaje: 'Usuario obtenido correctamente',
      usuario: data,
    });
  } catch (err) {
    res.status(500).json({
      mensaje: 'Error al obtener el usuario ',
      error: err.message,
    });
  }
}


export async function actualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const { nombre, apellido, rol, estado } = req.body;

  
    if (!nombre && !apellido && !rol && !estado) {
      return res.status(400).json({
        mensaje: 'Debe proporcionar al menos un campo para actualizar ',
      });
    }

    const { error } = await actualizarUsuarioPorId(id, {
      nombre,
      apellido,
      rol,
      estado,
    });

    if (error) throw error;

    res.status(200).json({
      mensaje: 'Usuario actualizado correctamente ',
    });
  } catch (err) {
    res.status(500).json({
      mensaje: 'Error al actualizar el usuario ',
      error: err.message,
    });
  }
}


export async function eliminarUsuario(req, res) {
  try {
    const { id } = req.params;
    const { error } = await eliminarUsuarioPorId(id);
    if (error) throw error;

    res.status(200).json({
      mensaje: 'Usuario eliminado correctamente ',
    });
  } catch (err) {
    res.status(500).json({
      mensaje: 'Error al eliminar el usuario ',
      error: err.message,
    });
  }
}
