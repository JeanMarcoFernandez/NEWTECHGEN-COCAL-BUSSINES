// middleware/validarPermisoGranular.js
import {
  tienePermisoGranular,
  registrarLogSeguridadDB,
} from '../models/permisoModel.js';

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
          null,
      };

      const permitido = await tienePermisoGranular(
        idUsuario,
        clavePermiso,
        ambito,
        contexto,
      );

      if (!permitido) {
        // 🔐 HU-010.8: registrar acceso NO autorizado en log_seguridad
        try {
          await registrarLogSeguridadDB({
            id_usuario: idUsuario,
            permiso: clavePermiso,
            ambito, // opcional, si tu tabla lo tiene
            ruta: req.originalUrl,
            metodo: req.method,
            ip: req.ip,
            user_agent: req.headers['user-agent'],
            motivo: 'ACCESO_NO_AUTORIZADO',
          });
        } catch (e) {
          console.error('Error registrando log de seguridad:', e.message);
        }

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
