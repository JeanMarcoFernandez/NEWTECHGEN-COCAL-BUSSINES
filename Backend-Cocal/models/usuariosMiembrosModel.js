import { supabase } from "../db.js";

export const getUsuariosPorDepartamento = async (id_departamento) => {
  const { data, error } = await supabase
    .from("usuario")
    .select(`
      id,
      nombre,
      apellido,
      correo,
      cargo,
      rol,
      estado,
      empresa:empresa(id,nombre),
      departamento:departamento(id,nombre)
    `)
    .eq("departamento.id", id_departamento);

  if (error) throw error;
  return data;
};

export const getUsuariosConDepartamento = async () => {
  const { data, error } = await supabase
    .from("usuario")
    .select(`
      id,
      nombre,
      apellido,
      correo,
      cargo,
      rol,
      estado,
      empresa:empresa(id,nombre),
      departamento:departamento(id,nombre)
    `);

  if (error) throw error;
  return data;
};
