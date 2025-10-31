import { supabase } from '../db.js';


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
