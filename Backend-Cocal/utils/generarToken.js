import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Genera un JWT con un tiempo de expiración controlado.
 * @param {Object} payload - Datos a incluir en el token (id, rol, correo, etc.)
 * @param {String} expiraEn - Duración de validez (ej: '15m', '1h', '24h')
 */
export function generarToken(payload, expiraEn = '10s') {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiraEn });
  } catch (error) {
    console.error('Error al generar token:', error);
    throw new Error('No se pudo generar el token JWT');
  }
}
