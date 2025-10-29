import { supabase } from '../db.js';

export async function listarAuditoriaLogin(req, res) {
  try {
    const { limit = 50 } = req.query;
    const { data, error } = await supabase
      .from('auditoria_login')
      .select('*')
      .order('creado_en', { ascending: false })
      .limit(Number(limit));

    if (error) throw error;
    res.json({ total: data?.length || 0, data });
  } catch (err) {
    res.status(500).json({ message: 'Error al listar auditoría', error: err.message });
  }
}
