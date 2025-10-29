import { supabase } from '../db.js';

export async function desbloquearUsuario(req, res) {
  try {
    const { id } = req.params;

    const { data: usuario, error: e1 } = await supabase
      .from('usuario')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (e1 || !usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const { error: e2 } = await supabase
      .from('usuario')
      .update({ bloqueado_hasta: null, intentos_fallidos: 0 })
      .eq('id', id);

    if (e2) throw e2;

    res.json({ message: 'Usuario desbloqueado correctamente.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al desbloquear usuario', error: err.message });
  }
}
