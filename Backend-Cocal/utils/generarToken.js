import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export function generarToken(payload, expiraEn = '24h') {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiraEn });
    return token;
  } catch (error) {
    console.error('Error al generar token:', error);
    throw new Error('No se pudo generar el token JWT');
  }
}
