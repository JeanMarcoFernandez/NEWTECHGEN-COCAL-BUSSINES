// middleware/validarPermisoGranular.js
import { tienePermisoGranular } from '../models/permisoModel.js';

/**
 * Middleware de permisos granulares (HU-010)
 *
 * @param {string} clavePermiso  Ej: 'GESTION_CALENDARIO_EMPRESA', 'GESTION_EVENTOS_DEPARTAMENTO'
 * @param {string} ambito        Ej: 'EMPRESA', 'DEPARTAMENTO', 'USUARIO', 'PROYECTO'
 */
export function validarPermisoGranular(clavePermiso, ambito) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          message: 'Usuario no autenticado o token sin payload válido.',
        });
      }

      const idUsuario = req.user.id;

      const contexto = {
        idEmpresa:
          req.user.id_empresa ||
          req.body.id_empresa ||
          req.params.idEmpresa ||
          null,
        idDepartamento:
          req.body.id_departamento ||
          req.params.idDepartamento ||
          null,
        idProyecto:
          req.body.id_proyecto ||
          req.params.idProyecto ||
          req.params.idProyecto ||
          null,
      };

      const permitido = await tienePermisoGranular(
        idUsuario,
        clavePermiso,
        ambito,
        contexto,
      );

      if (!permitido) {
        // Aquí podrías llamar a registrarLogSeguridadDB(...) si quieres HU-010.8
        return res.status(403).json({
          message: `Acceso denegado: falta permiso ${clavePermiso} en ámbito ${ambito}`,
        });
      }

      return next();
    } catch (error) {
      console.error('Error en validarPermisoGranular:', error.message);
      return res.status(500).json({
        message: 'Error interno al validar permisos granulares.',
      });
    }
  };
}
