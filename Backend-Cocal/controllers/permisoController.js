// controllers/permisoController.js
import {
  configurarPermisosEquipoService,
  crearPermisoPersonalizadoDeptService,
  modificarPermisoEquipoService,
  revocarPermisosPorSalidaEquipoService,
  delegarPermisosTemporalService,
  auditarPermisosService
} from '../services/permisoService.js';

export async function configurarPermisosEquipoController(req, res) {
  try {
    const usuario = req.user;
    const { reglas } = req.body;

    const resultado = await configurarPermisosEquipoService({ reglas }, usuario);
    return res.status(201).json(resultado);
  } catch (err) {
    console.error('Error configurarPermisosEquipoController:', err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || 'Error al configurar permisos de equipo.' });
  }
}

export async function crearPermisoPersonalizadoDeptController(req, res) {
  try {
    const usuario = req.user;
    const { id_departamento, rol_objetivo, permiso, nivel } = req.body;

    const resultado = await crearPermisoPersonalizadoDeptService(
      { id_departamento, rol_objetivo, permiso, nivel },
      usuario
    );

    return res.status(201).json(resultado);
  } catch (err) {
    console.error('Error crearPermisoPersonalizadoDeptController:', err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || 'Error al crear permiso personalizado.' });
  }
}

export async function modificarPermisoEquipoController(req, res) {
  try {
    const usuario = req.user;
    const id = Number(req.params.id);

    const actualizado = await modificarPermisoEquipoService(id, req.body, usuario);
    return res.json(actualizado);
  } catch (err) {
    console.error('Error modificarPermisoEquipoController:', err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || 'Error al modificar permiso de equipo.' });
  }
}

export async function revocarPermisosPorSalidaEquipoController(req, res) {
  try {
    const usuario = req.user;
    const { id_usuario } = req.body;

    const cantidad = await revocarPermisosPorSalidaEquipoService(id_usuario, usuario);
    return res.json({ revocados: cantidad });
  } catch (err) {
    console.error('Error revocarPermisosPorSalidaEquipoController:', err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || 'Error al revocar permisos de usuario.' });
  }
}

export async function delegarPermisosTemporalController(req, res) {
  try {
    const usuario = req.user;
    const { id_sustituto, fecha_inicio, fecha_fin } = req.body;

    const delegacion = await delegarPermisosTemporalService(
      { id_sustituto, fecha_inicio, fecha_fin },
      usuario
    );

    return res.status(201).json(delegacion);
  } catch (err) {
    console.error('Error delegarPermisosTemporalController:', err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || 'Error al delegar permisos.' });
  }
}

export async function auditarPermisosController(req, res) {
  try {
    const usuario = req.user;
    const filtros = {
      id_usuario_objetivo: req.query.id_usuario_objetivo
        ? Number(req.query.id_usuario_objetivo)
        : undefined,
      permiso: req.query.permiso
    };

    const registros = await auditarPermisosService(filtros, usuario);
    return res.json(registros);
  } catch (err) {
    console.error('Error auditarPermisosController:', err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || 'Error al obtener auditoría de permisos.' });
  }
}
