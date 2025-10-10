import supabase from "../config/supabaseClient.js";

export async function ensureGroup(nombre) {
  const { data, error } = await supabase
    .from("grupos")
    .select("id, nombre")
    .eq("nombre", nombre)
    .maybeSingle();

  if (error) throw error;
  if (data) return data;

  const insert = await supabase
    .from("grupos")
    .insert([{ nombre }])
    .select("id, nombre")
    .single();

  if (insert.error) throw insert.error;
  return insert.data;
}

export async function getGroupMessages(nombre, limit = 50) {
  const { data: G } = await supabase.from("grupos").select("id").eq("nombre", nombre).maybeSingle();
  if (!G) return [];

  const { data, error } = await supabase
    .from("mensajes")
    .select("id, remitente_id, grupo_id, contenido, timestamp")
    .eq("grupo_id", G.id)
    .order("timestamp", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data;
}
