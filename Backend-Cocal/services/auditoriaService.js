import { supabase } from '../db.js';

/**
 * @param {Object} options - Datos del evento
 * @param {number|null} options.usuario_id - ID del usuario (si existe)
 * @param {string|null} options.correo - Correo ingresado
 * @param {boolean} options.exito - true si el login fue exitoso
 * @param {string} options.motivo - Motivo o resultado ('OK', 'BLOQUEADO', etc.)
 * @param {string|null} options.ip - Dirección IP del cliente
 * @param {string|null} options.user_agent - User-Agent del navegador
 */
export async function registrarAuditoria({
  usuario_id = null,
  correo = null,
  exito = false,
  motivo = 'DESCONOCIDO',
  ip = null,
  user_agent = null
}) {
  try {
    await supabase.from('auditoria_login').insert([{
      usuario_id,
      correo,
      exito,
      motivo,
      ip,
      user_agent
    }]);
  } catch (err) {
    console.error('❌ Error al registrar auditoría:', err.message);
  }
}
