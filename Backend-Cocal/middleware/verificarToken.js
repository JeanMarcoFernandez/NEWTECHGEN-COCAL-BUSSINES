import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token no proporcionado.' });
    }

    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const ahora = Date.now();
    const ultimaActividad = decoded.ultimaActividad || ahora;
    const tiempoInactivo = (ahora - ultimaActividad) / 1000 / 60; 

    const LIMITE_INACTIVIDAD = 1; 

    
    if (tiempoInactivo > LIMITE_INACTIVIDAD) {
      return res.status(440).json({
        message: '⚠️ Sesión expirada por inactividad. Vuelve a iniciar sesión.',
      });
    }

    
    decoded.ultimaActividad = ahora;

    
    req.user = decoded;

    next();
  } catch (err) {
    console.error(' Error en verificarToken:', err.message);

    // Si el token expiró por tiempo (exp)
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'El token ha expirado. Inicia sesión nuevamente.' });
    }

    return res.status(401).json({ message: 'Token inválido o ausente.' });
  }
}
