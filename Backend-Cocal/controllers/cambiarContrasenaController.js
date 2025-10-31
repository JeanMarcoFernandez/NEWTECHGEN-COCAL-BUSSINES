import bcrypt from 'bcrypt';
import { supabase } from '../db.js';


export async function cambiarContrasenaPrimerLogin(req, res) {
  try {
    const { correo, nuevaContrasena } = req.body;

    const { data: usuario, error: errorUsuario } = await supabase
      .from('usuario')
      .select('*')
      .eq('correo', correo)
      .single();

    if (errorUsuario || !usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    
    if (!usuario.primer_login) {
      return res.status(400).json({ message: 'Este usuario ya actualizó su contraseña.' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(nuevaContrasena, salt);

    
    const { error: updateError } = await supabase
      .from('usuario')
      .update({
        contrasena: hash,
        primer_login: false,
        ultimo_cambio_contrasena: new Date().toISOString(),
      })
      .eq('id', usuario.id);

    if (updateError) throw updateError;

    res.status(200).json({ message: 'Contraseña actualizada correctamente. Ya puede iniciar sesión normalmente.' });
  } catch (err) {
    res.status(500).json({
      message: 'Error al cambiar la contraseña.',
      error: err.message,
    });
  }
}
