import { supabase } from '../db.js';

export async function listarUsuarios(req, res) {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('id, correo, nombre, apellido, rol, estado, creado_en');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al listar usuarios', error: err.message });
  }
}


export async function obtenerUsuario(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('usuario')
      .select('id, correo, nombre, apellido, rol, estado, creado_en')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener el usuario', error: err.message });
  }
}


export async function actualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const { nombre, apellido, rol, estado } = req.body;

    const { error } = await supabase
      .from('usuario')
      .update({ nombre, apellido, rol, estado })
      .eq('id', id);

    if (error) throw error;
    res.json({ mensaje: 'Usuario actualizado correctamente ✅' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar el usuario', error: err.message });
  }
}


export async function eliminarUsuario(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('usuario').delete().eq('id', id);

    if (error) throw error;
    res.json({ mensaje: 'Usuario eliminado correctamente 🗑️' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: err.message });
  }
}
