import { supabase } from "../db.js";

export const actualizarRango = async (id_usuario, id_proyecto, rol) => {
  const { error } = await supabase
    .from("miembro_proyecto")
    .update({ rol })
    .eq("id_usuario", id_usuario)
    .eq("id_proyecto", id_proyecto);
  if (error) throw error;
};

export const restituirMiembroModel = async (id_usuario, id_proyecto) => {
  const { error } = await supabase
    .from("miembro_proyecto")
    .update({ activo: true, rol: "EMPLEADO" })
    .eq("id_usuario", id_usuario)
    .eq("id_proyecto", id_proyecto);
  if (error) throw error;
};

export const getMiembrosPorProyecto = async (id_proyecto) => {
  const { data, error } = await supabase
    .from("miembro_proyecto")
    .select(`
      id,
      rol,
      activo,
      usuario:usuario(id,nombre,apellido,correo),
      proyecto:proyecto(id,nombre)
    `)
    .eq("id_proyecto", id_proyecto);

  if (error) throw error;
  return data;
};
