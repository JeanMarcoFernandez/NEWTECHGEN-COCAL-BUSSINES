import { supabase } from "../db.js";

// Asignar un departamento a un proyecto
export const agregarDepartamentoAProyecto = async (id_proyecto, id_departamento) => {
  const { error } = await supabase
    .from("proyecto")
    .update({ id_departamento })
    .eq("id", id_proyecto);

  if (error) throw error;
};

// Obtener departamentos de un proyecto
export const getDepartamentosPorProyecto = async (id_proyecto) => {
  const { data, error } = await supabase
    .from("proyecto")
    .select(`
      id,
      nombre,
      descripcion,
      departamento:departamento(id,nombre,area)
    `)
    .eq("id", id_proyecto);

  if (error) throw error;
  return data;
};

// Agregar miembro a proyecto
export const agregarMiembroAProyecto = async (id_proyecto, id_usuario, rol = "EMPLEADO") => {
  const { data, error } = await supabase
    .from("miembro_proyecto")
    .insert([{ id_proyecto, id_usuario, rol }])
    .select("*");

  if (error) throw error;
  return data[0];
};
