import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Genera un token JWT para un usuario.
 * @param {Object} payload - Datos del usuario (id, rol, etc.)
 * @param {string} [expiraEn='24h'] - Tiempo de expiración (por defecto 24 horas)
 * @returns {string} Token JWT firmado
 */
export function generarToken(payload, expiraEn = '24h') {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiraEn });
    return token;
  } catch (error) {
    console.error('Error al generar token:', error);
    throw new Error('No se pudo generar el token JWT');
  }
}
