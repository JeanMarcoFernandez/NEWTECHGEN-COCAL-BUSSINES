import supabase from "../config/supabaseClient.js";

export async function getPrivateMessages(u1, u2, limit = 50) {
  const { data: A } = await supabase.from("usuarios").select("id").eq("nombre", u1).single();
  const { data: B } = await supabase.from("usuarios").select("id").eq("nombre", u2).single();
  if (!A || !B) return [];

  const { data, error } = await supabase
    .from("mensajes")
    .select("id, remitente_id, destinatario_id, contenido, timestamp")
    .or(`and(remitente_id.eq.${A.id},destinatario_id.eq.${B.id}),and(remitente_id.eq.${B.id},destinatario_id.eq.${A.id})`)
    .order("timestamp", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data;
}
