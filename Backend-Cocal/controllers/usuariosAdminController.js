// controllers/usuariosAdminController.js
import bcrypt from 'bcrypt';
import { supabase } from '../config/supabaseClient.js';


export async function crearUsuarioPorAdmin(req, res) {
  try {
    const { correo, nombre, apellido, cargo, contrasena, rol, id_empresa } = req.body;
    const adminId = req.usuario.id; 
    const adminRol = req.usuario.rol;

    if (adminRol !== 'ADMIN') {
      return res.status(403).json({ mensaje: 'No tiene permisos para crear usuarios.' });
    }

    const { data: existente } = await supabase
      .from('usuario')
      .select('id')
      .eq('correo', correo)
      .single();

    if (existente) {
      return res.status(400).json({ mensaje: 'Ya existe un usuario con ese correo.' });
    }

    // Cifrar contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);

    const { error } = await supabase.from('usuario').insert([
      {
        correo,
        nombre,
        apellido,
        cargo,
        id_empresa,
        rol: rol || 'EMPLEADO',
        contrasena: hash,
        creado_por: adminId,
        primer_login: true,
      },
    ]);

    if (error) throw error;

    res.status(201).json({
      mensaje: 'Usuario creado correctamente. Debe cambiar su contraseña en su primer inicio de sesión.',
    });
  } catch (err) {
    res.status(500).json({
      mensaje: 'Error al crear usuario por administrador',
      error: err.message,
    });
  }
}
