import { supabase } from '../db.js';
import bcrypt from 'bcrypt';

export async function list(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('id, correo, nombre, apellido, rol, estado, id_empresa')
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('❌ Error al listar usuarios:', e.message);
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const {
      id_empresa,
      correo,
      contrasena,
      nombre,
      apellido,
      cargo,
      rol = 'EMPLEADO',
      telefono,
    } = req.body;

    
    const hash = await bcrypt.hash(
      contrasena,
      Number(process.env.BCRYPT_ROUNDS || 10)
    );

    
    const { data, error } = await supabase
      .from('usuario')
      .insert([
        {
          id_empresa,
          correo,
          contrasena: hash,
          nombre,
          apellido,
          cargo,
          rol,
          telefono,
        },
      ])
      .select('id, correo, nombre, apellido, rol, id_empresa')
      .single(); // 🔹 retorna solo un objeto (no array)

    if (error) throw error;

    res.status(201).json(data);
  } catch (e) {
    console.error('❌ Error al crear usuario:', e.message);
    next(e);
  }
}
