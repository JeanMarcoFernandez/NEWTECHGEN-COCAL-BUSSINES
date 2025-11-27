import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export async function refreshToken(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token no proporcionado.' });
    }

    const oldToken = authHeader.split(' ')[1];
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET, { ignoreExpiration: true });

    
    const expTimestamp = decoded.exp * 1000;
    const now = Date.now();

    if (now - expTimestamp > 5 * 60 * 1000) { 
      return res.status(401).json({ message: 'El token expiró definitivamente. Inicia sesión nuevamente.' });
    }

    
    const newToken = jwt.sign(
      {
        id: decoded.id,
        rol: decoded.rol,
        correo: decoded.correo,
        ultimaActividad: Date.now(),
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' } 
    );

    return res.status(200).json({
      message: 'Token renovado exitosamente.',
      token: newToken,
      expira_en: '30 minutos',
    });
  } catch (error) {
    console.error('Error al refrescar token:', error.message);
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}
