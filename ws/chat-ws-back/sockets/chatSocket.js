import { ensureUser } from "../controllers/userController.js";
import { ensureGroup } from "../controllers/groupController.js";
import supabase from "../config/supabaseClient.js";

export function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Cliente conectado:", socket.id);

    // === UNIRSE AL CHAT (usuario individual) ===
    socket.on("join", async (nombre, ack) => {
      try {
        const user = await ensureUser(nombre);
        socket.data.nombre = user.nombre;
        socket.join(`user:${user.nombre}`);

        // ✅ Cargar historial de mensajes privados del usuario
        const { data: mensajes } = await supabase
          .from("mensajes")
          .select("id, contenido, timestamp, remitente_id(nombre), destinatario_id(nombre)")
          .or(`remitente_id.nombre.eq.${user.nombre},destinatario_id.nombre.eq.${user.nombre}`)
          .order("timestamp", { ascending: true });

        // Enviar historial solo al usuario que acaba de entrar
        socket.emit("chat_history", mensajes || []);

        if (ack) ack({ ok: true, user });
      } catch (e) {
        if (ack) ack({ ok: false, error: e.message });
      }
    });

    // === UNIRSE A GRUPO ===
    socket.on("join_group", async (grupoNombre, ack) => {
      try {
        const group = await ensureGroup(grupoNombre);
        socket.join(`group:${group.id}`);

        // ✅ Cargar historial del grupo
        const { data: mensajes } = await supabase
          .from("mensajes")
          .select("id, contenido, timestamp, remitente_id(nombre)")
          .eq("grupo_id", group.id)
          .order("timestamp", { ascending: true });

        socket.emit("group_history", { grupo: grupoNombre, mensajes: mensajes || [] });

        if (ack) ack({ ok: true, group });
      } catch (e) {
        if (ack) ack({ ok: false, error: e.message });
      }
    });

    // === MENSAJE PRIVADO ===
    socket.on("private_message", async ({ to, contenido }, ack) => {
      try {
        const fromNombre = socket.data.nombre;
        const { data: from } = await supabase
          .from("usuarios")
          .select("id")
          .eq("nombre", fromNombre)
          .single();

        const { data: toUser } = await supabase
          .from("usuarios")
          .select("id, nombre")
          .eq("nombre", to)
          .maybeSingle();

        if (!toUser) throw new Error("El destinatario no existe.");

        const { data: ins } = await supabase
          .from("mensajes")
          .insert([{ remitente_id: from.id, destinatario_id: toUser.id, contenido }])
          .select("id, timestamp")
          .single();

        const payload = {
          id: ins.id,
          from: fromNombre,
          to: toUser.nombre,
          contenido,
          timestamp: ins.timestamp,
        };

        // Broadcast a ambos usuarios
        io.to(`user:${toUser.nombre}`).emit("private_message", payload);
        io.to(`user:${fromNombre}`).emit("private_message", payload);

        if (ack) ack({ ok: true, message: payload });
      } catch (e) {
        if (ack) ack({ ok: false, error: e.message });
      }
    });

    // === MENSAJE DE GRUPO ===
    socket.on("group_message", async ({ grupo, contenido }, ack) => {
      try {
        const fromNombre = socket.data.nombre;
        const { data: from } = await supabase
          .from("usuarios")
          .select("id")
          .eq("nombre", fromNombre)
          .single();

        const group = await ensureGroup(grupo);

        const { data: ins } = await supabase
          .from("mensajes")
          .insert([{ remitente_id: from.id, grupo_id: group.id, contenido }])
          .select("id, timestamp")
          .single();

        const payload = {
          id: ins.id,
          from: fromNombre,
          grupo,
          contenido,
          timestamp: ins.timestamp,
        };

        // Broadcast a todos los sockets del grupo
        io.to(`group:${group.id}`).emit("group_message", payload);

        if (ack) ack({ ok: true, message: payload });
      } catch (e) {
        if (ack) ack({ ok: false, error: e.message });
      }
    });

    // === DESCONECTAR ===
    socket.on("disconnect", () => {
      console.log("🔴 Cliente desconectado:", socket.id);
    });
  });
}
