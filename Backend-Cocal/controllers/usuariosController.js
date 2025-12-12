import { dbListarTodosUsuarios } from '../models/usuariosModel.js'

export async function listarUsuarios(req, res) {
  try {
    const usuarios = await dbListarTodosUsuarios()
    return res.status(200).json(usuarios)
  } catch (err) {
    return res.status(500).json({
      message: 'Error al listar usuarios',
      error: err.message,
    })
  }
}
