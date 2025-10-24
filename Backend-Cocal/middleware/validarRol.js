// middleware/validarRol.js
export function validarRol(...rolesPermitidos) {
  return (req, res, next) => {
    const { rol } = req.user;
    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({
        message: `Acceso denegado 🚫 — Rol requerido: ${rolesPermitidos.join(', ')}`,
      });
    }
    next();
  };
}
