import {
  dbGetUsuarioEmpresa,
  dbPatchUsuarioEmpresa,
  dbDeleteUsuarioEmpresa,
} from '../models/empresaUsuariosModel.js'

function assertMismaEmpresa(req, idEmpresa) {
  if (req.user?.rol !== 'ADMIN') {
    const idEmpresaToken = Number(req.user?.id_empresa)
    if (!idEmpresaToken || idEmpresaToken !== idEmpresa) {
      return { ok: false, status: 403, message: 'Acceso denegado: no perteneces a esa empresa.' }
    }
  }
  // Si es ADMIN, igual recomendamos que sea admin de SU empresa (según tu modelo)
  const idEmpresaToken = Number(req.user?.id_empresa)
  if (req.user?.rol === 'ADMIN' && idEmpresaToken && idEmpresaToken !== idEmpresa) {
    return { ok: false, status: 403, message: 'ADMIN solo puede operar dentro de su empresa.' }
  }
  return { ok: true }
}

export async function obtenerUsuarioEmpresa(req, res) {
  try {
    const idEmpresa = Number(req.params.idEmpresa)
    const idUsuario = Number(req.params.idUsuario)

    const check = assertMismaEmpresa(req, idEmpresa)
    if (!check.ok) return res.status(check.status).json({ message: check.message })

    const user = await dbGetUsuarioEmpresa(idEmpresa, idUsuario)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado en esta empresa' })

    return res.status(200).json(user)
  } catch (err) {
    return res.status(500).json({ message: 'Error al obtener usuario', error: err.message })
  }
}

export async function patchUsuarioEmpresa(req, res) {
  try {
    const idEmpresa = Number(req.params.idEmpresa)
    const idUsuario = Number(req.params.idUsuario)

    // Solo ADMIN edita (como pediste)
    if (req.user?.rol !== 'ADMIN') {
      return res.status(403).json({ message: 'Acceso denegado: requiere rol ADMIN' })
    }

    const check = assertMismaEmpresa(req, idEmpresa)
    if (!check.ok) return res.status(check.status).json({ message: check.message })

    // Cargar objetivo para validar empresa y reglas
    const objetivo = await dbGetUsuarioEmpresa(idEmpresa, idUsuario)
    if (!objetivo) return res.status(404).json({ message: 'Usuario no encontrado en esta empresa' })

    // (Opcional recomendado) no editar a un ADMIN “core” si quieres endurecer
    // Aquí solo evitamos cambios peligrosos si quieres:
    // if (objetivo.rol === 'ADMIN' && req.body.rol && req.body.rol !== 'ADMIN') ...

    // PATCH: permitimos actualizar campos enviados (sin password)
    const allowed = [
      'id_departamento',
      'correo',
      'nombre',
      'apellido',
      'cargo',
      'rol',
      'estado',
      'telefono',
      'fecha_ingreso',
    ]

    const patch = {}
    for (const k of allowed) {
      if (req.body[k] !== undefined) patch[k] = req.body[k]
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ message: 'No se enviaron campos para actualizar' })
    }

    // Seguridad: no permitir cambiar empresa por PATCH (ni existe en allowed)
    const actualizado = await dbPatchUsuarioEmpresa(idEmpresa, idUsuario, patch)
    return res.status(200).json(actualizado)
  } catch (err) {
    return res.status(500).json({ message: 'Error al editar usuario', error: err.message })
  }
}

export async function eliminarUsuarioEmpresa(req, res) {
  try {
    const idEmpresa = Number(req.params.idEmpresa)
    const idUsuario = Number(req.params.idUsuario)

    // Solo ADMIN elimina
    if (req.user?.rol !== 'ADMIN') {
      return res.status(403).json({ message: 'Acceso denegado: requiere rol ADMIN' })
    }

    const check = assertMismaEmpresa(req, idEmpresa)
    if (!check.ok) return res.status(check.status).json({ message: check.message })

    // No borrarte a ti mismo (recomendado)
    if (Number(req.user?.id) === idUsuario) {
      return res.status(400).json({ message: 'No puedes eliminar tu propio usuario' })
    }

    // Traer objetivo para validar pertenencia y rol
    const objetivo = await dbGetUsuarioEmpresa(idEmpresa, idUsuario)
    if (!objetivo) return res.status(404).json({ message: 'Usuario no encontrado en esta empresa' })

    // Regla “menos ADMIN ADMIN”: NO se puede borrar a un ADMIN
    if (objetivo.rol === 'ADMIN') {
      return res.status(403).json({ message: 'No puedes eliminar a un usuario con rol ADMIN' })
    }

    await dbDeleteUsuarioEmpresa(idEmpresa, idUsuario)
    return res.status(200).json({ message: 'Usuario eliminado correctamente' })
  } catch (err) {
    return res.status(500).json({ message: 'Error al eliminar usuario', error: err.message })
  }
}
