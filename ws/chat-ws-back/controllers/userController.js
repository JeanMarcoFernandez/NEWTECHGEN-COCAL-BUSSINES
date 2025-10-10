import supabase from "../config/supabaseClient.js";

export async function ensureUser(nombre) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nombre")
    .eq("nombre", nombre)
    .maybeSingle();

  if (error) throw error;
  if (data) return data;

  const insert = await supabase
    .from("usuarios")
    .insert([{ nombre }])
    .select("id, nombre")
    .single();

  if (insert.error) throw insert.error;
  return insert.data;
}

export async function getUsers() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nombre, creado_en")
    .order("creado_en", { ascending: false });
  if (error) throw error;
  return data;
}
