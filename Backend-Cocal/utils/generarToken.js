import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Genera un JWT con duración configurable desde .env
 * @param {Object} payload - Datos a incluir en el token (id, rol, correo, etc.)
 * @param {String} expiraEn - (opcional) Duración personalizada (ej: '15m', '1h', '10s')
 */
export function generarToken(payload, expiraEn = process.env.TOKEN_EXPIRE || '30m') {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiraEn });
    console.log(`🧩 Token generado con duración: ${expiraEn}`);
    return token;
  } catch (error) {
    console.error('❌ Error al generar token:', error);
    throw new Error('No se pudo generar el token JWT');
  }
}
