import { ensureUser } from "../controllers/userController.js";
import { ensureGroup } from "../controllers/groupController.js";
import supabase from "../config/supabaseClient.js";

export function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Cliente conectado:", socket.id);

    socket.on("join", async (nombre, ack) => {
      try {
        const user = await ensureUser(nombre);
        socket.data.nombre = user.nombre;
        socket.join(`user:${user.nombre}`);
        if (ack) ack({ ok: true, user });
      } catch (e) {
        if (ack) ack({ ok: false, error: e.message });
      }
    });

    socket.on("join_group", async (grupoNombre, ack) => {
      try {
        const group = await ensureGroup(grupoNombre);
        socket.join(`group:${group.id}`);
        if (ack) ack({ ok: true, group });
      } catch (e) {
        if (ack) ack({ ok: false, error: e.message });
      }
    });

    socket.on("private_message", async ({ to, contenido }, ack) => {
      try {
        const fromNombre = socket.data.nombre;
        const { data: from } = await supabase.from("usuarios").select("id").eq("nombre", fromNombre).single();
        const { data: toUser } = await supabase.from("usuarios").select("id, nombre").eq("nombre", to).maybeSingle();

        const ins = await supabase
          .from("mensajes")
          .insert([{ remitente_id: from.id, destinatario_id: toUser.id, contenido }])
          .select("id, timestamp")
          .single();

        const payload = { from: fromNombre, to: toUser.nombre, contenido, id: ins.data.id, timestamp: ins.data.timestamp };
        io.to(`user:${toUser.nombre}`).emit("private_message", payload);
        io.to(`user:${fromNombre}`).emit("private_message", payload);
        if (ack) ack({ ok: true, message: payload });
      } catch (e) {
        if (ack) ack({ ok: false, error: e.message });
      }
    });

    socket.on("group_message", async ({ grupo, contenido }, ack) => {
      try {
        const fromNombre = socket.data.nombre;
        const { data: from } = await supabase.from("usuarios").select("id").eq("nombre", fromNombre).single();
        const group = await ensureGroup(grupo);

        const ins = await supabase
          .from("mensajes")
          .insert([{ remitente_id: from.id, grupo_id: group.id, contenido }])
          .select("id, timestamp")
          .single();

        const payload = { from: fromNombre, grupo, contenido, id: ins.data.id, timestamp: ins.data.timestamp };
        io.to(`group:${group.id}`).emit("group_message", payload);
        if (ack) ack({ ok: true, message: payload });
      } catch (e) {
        if (ack) ack({ ok: false, error: e.message });
      }
    });

    socket.on("disconnect", () => console.log("🔴 Desconectado:", socket.id));
  });
}
