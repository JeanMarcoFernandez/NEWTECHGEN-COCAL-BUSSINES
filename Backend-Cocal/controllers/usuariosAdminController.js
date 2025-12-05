
import bcrypt from 'bcrypt';
import { supabase } from '../db.js';

export async function crearUsuarioPorAdmin(req, res) {
  try {
    const {
      correo,
      contrasena,
      nombre,
      apellido,
      cargo,
      rol,
      telefono,
      id_departamento,      
    } = req.body;

    const adminId = req.user.id;
    const adminRol = req.user.rol;
    const adminEmpresaId = req.user.id_empresa;

    if (adminRol !== 'ADMIN') {
      return res.status(403).json({ mensaje: 'No tiene permisos para crear usuarios.' });
    }

    if (!adminEmpresaId) {
      return res.status(400).json({
        mensaje: 'El administrador no tiene una empresa asociada en el token (id_empresa).',
      });
    }

    // 1) Verificar que no exista ya un usuario con ese correo
    const { data: existente } = await supabase
      .from('usuario')
      .select('id')
      .eq('correo', correo)
      .single();

    if (existente) {
      return res.status(400).json({ mensaje: 'Ya existe un usuario con ese correo.' });
    }

    // 2) (Opcional pero MUY recomendado): validar el departamento
    let deptoIdFinal = null;

    if (id_departamento) {
      const { data: depto, error: deptoError } = await supabase
        .from('departamento')
        .select('id, id_empresa')
        .eq('id', id_departamento)
        .single();

      if (deptoError || !depto) {
        return res.status(400).json({
          mensaje: 'El departamento especificado no existe.',
        });
      }

      if (depto.id_empresa !== adminEmpresaId) {
        return res.status(403).json({
          mensaje: 'No puede asignar usuarios a un departamento de otra empresa.',
        });
      }

      deptoIdFinal = depto.id;
    }

    // 3) Cifrar contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);

    // 4) Insertar usuario
    const { error } = await supabase.from('usuario').insert([
      {
        id_empresa: adminEmpresaId,
        id_departamento: deptoIdFinal, // 👈 aquí se guarda el depto
        correo,
        contrasena: hash,
        nombre,
        apellido,
        cargo,
        rol: rol || 'EMPLEADO',
        telefono,
        primer_login: true,
        creado_por: adminId,
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
// controllers/usuariosAdminController.js (mismo archivo)

export async function moverUsuarioADepartamento(req, res) {
  try {
    const { idUsuario } = req.params;
    const { id_departamento } = req.body;

    const adminRol = req.user.rol;
    const adminEmpresaId = req.user.id_empresa;

    if (adminRol !== 'ADMIN') {
      return res.status(403).json({
        mensaje: 'No tiene permisos para mover usuarios de departamento.',
      });
    }

    if (!id_departamento) {
      return res.status(400).json({
        mensaje: 'id_departamento es obligatorio.',
      });
    }

    // 1) Traer usuario
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuario')
      .select('id, id_empresa, id_departamento, nombre, apellido')
      .eq('id', idUsuario)
      .single();

    if (usuarioError || !usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // 2) Verificar empresa del usuario vs admin
    if (usuario.id_empresa !== adminEmpresaId) {
      return res.status(403).json({
        mensaje: 'No puede mover usuarios que pertenecen a otra empresa.',
      });
    }

    // 3) Validar departamento
    const { data: depto, error: deptoError } = await supabase
      .from('departamento')
      .select('id, id_empresa, nombre')
      .eq('id', id_departamento)
      .single();

    if (deptoError || !depto) {
      return res.status(400).json({
        mensaje: 'El departamento especificado no existe.',
      });
    }

    if (depto.id_empresa !== adminEmpresaId) {
      return res.status(403).json({
        mensaje: 'El departamento no pertenece a la misma empresa.',
      });
    }

    // 4) Actualizar usuario
    const { data: actualizado, error: updateError } = await supabase
      .from('usuario')
      .update({
        id_departamento: depto.id,
        actualizado_en: new Date().toISOString(),
      })
      .eq('id', idUsuario)
      .select('id, nombre, apellido, id_departamento')
      .single();

    if (updateError) throw updateError;

    return res.status(200).json({
      mensaje: `Usuario movido al departamento ${depto.nombre}.`,
      usuario: actualizado,
    });
  } catch (err) {
    console.error('Error moverUsuarioADepartamento:', err);
    return res.status(500).json({
      mensaje: 'Error al mover usuario de departamento.',
      error: err.message,
    });
  }
}
// controllers/usuariosAdminController.js

export async function quitarUsuarioDeDepartamento(req, res) {
  try {
    const { idUsuario } = req.params;

    const adminRol = req.user.rol;
    const adminEmpresaId = req.user.id_empresa;

    if (adminRol !== 'ADMIN') {
      return res.status(403).json({
        mensaje: 'No tiene permisos para modificar el departamento de usuarios.',
      });
    }

    // 1) Traer usuario
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuario')
      .select('id, id_empresa, id_departamento, nombre, apellido')
      .eq('id', idUsuario)
      .single();

    if (usuarioError || !usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // 2) Validar empresa
    if (usuario.id_empresa !== adminEmpresaId) {
      return res.status(403).json({
        mensaje: 'No puede modificar usuarios de otra empresa.',
      });
    }

    // 3) Si ya no tiene departamento
    if (!usuario.id_departamento) {
      return res.status(200).json({
        mensaje: 'El usuario ya no tiene un departamento asignado.',
      });
    }

    // 4) Poner id_departamento en NULL
    const { data: actualizado, error: updateError } = await supabase
      .from('usuario')
      .update({
        id_departamento: null,
        actualizado_en: new Date().toISOString(),
      })
      .eq('id', idUsuario)
      .select('id, nombre, apellido, id_departamento')
      .single();

    if (updateError) throw updateError;

    return res.status(200).json({
      mensaje: 'Departamento eliminado del usuario.',
      usuario: actualizado,
    });
  } catch (err) {
    console.error('Error quitarUsuarioDeDepartamento:', err);
    return res.status(500).json({
      mensaje: 'Error al quitar el departamento del usuario.',
      error: err.message,
    });
  }
}
