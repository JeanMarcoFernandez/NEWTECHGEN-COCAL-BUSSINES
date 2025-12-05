// controllers/usuariosAdminController.js
import bcrypt from 'bcrypt';
import { supabase } from '../db.js';

export async function crearUsuarioPorAdmin(req, res) {
  try {
    const { correo, contrasena, nombre, apellido, cargo, rol, telefono } = req.body;
    const adminId = req.user.id;
    const adminRol = req.user.rol;
    const adminEmpresaId = req.user.id_empresa; // 👈 empresa del admin

    if (adminRol !== 'ADMIN') {
      return res.status(403).json({ mensaje: 'No tiene permisos para crear usuarios.' });
    }

    if (!adminEmpresaId) {
      return res.status(400).json({
        mensaje: 'El administrador no tiene una empresa asociada en el token (id_empresa).',
      });
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
        id_empresa: adminEmpresaId, // 👈 siempre la misma empresa del admin
        correo,
        contrasena: hash,
        nombre,
        apellido,
        cargo,
        rol: rol || 'EMPLEADO',
        telefono,
        primer_login: true,   // 🔹 Forzar cambio de contraseña al primer inicio
        creado_por: adminId,  // 🔹 Indica quién lo creó
      },
    ]);

    if (error) throw error;

    res.status(201).json({
      mensaje:
        'Usuario creado correctamente. Debe cambiar su contraseña en su primer inicio de sesión.',
    });
  } catch (err) {
    console.error('Error crearUsuarioPorAdmin:', err);
    res.status(500).json({
      mensaje: 'Error al crear usuario por administrador',
      error: err.message,
    });
  }
}
