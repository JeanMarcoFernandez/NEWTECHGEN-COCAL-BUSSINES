import { dbEstructuraEmpresaUsuarios } from '../models/empresaEstructuraModel.js'

export async function obtenerEstructuraEmpresa(req, res) {
  try {
    const idEmpresa = Number(req.params.idEmpresa)
    if (!Number.isInteger(idEmpresa) || idEmpresa <= 0) {
      return res.status(400).json({ message: 'idEmpresa inválido' })
    }

    // Regla: si no es ADMIN, solo puede ver SU empresa
    if (req.user?.rol !== 'ADMIN') {
      const idEmpresaToken = Number(req.user?.id_empresa)
      if (!idEmpresaToken || idEmpresaToken !== idEmpresa) {
        return res.status(403).json({
          message: 'Acceso denegado: no perteneces a esa empresa.',
        })
      }
    }

    const data = await dbEstructuraEmpresaUsuarios(idEmpresa)

    if (!data) {
      return res.status(404).json({ message: 'Empresa no encontrada' })
    }

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({
      message: 'Error al obtener estructura de empresa',
      error: err.message,
    })
  }
}
