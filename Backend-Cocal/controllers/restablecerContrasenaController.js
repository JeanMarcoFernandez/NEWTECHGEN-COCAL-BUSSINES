import { supabase } from "../db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendEmail } from "../services/emailService.js";


export async function solicitarRestablecimiento(req, res) {
  try {
    const { correo } = req.body;

   
    const { data: user } = await supabase
      .from("usuario")
      .select("*")
      .eq("correo", correo)
      .single();

    if (!user)
      return res.status(404).json({ message: "El correo no está registrado." });

    
    const token = crypto.randomBytes(32).toString("hex");
    const expiracion = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    
    await supabase.from("recuperacion_contrasena").insert([
      {
        usuario_id: user.id,
        token,
        expiracion,
        usado: false,
      },
    ]);

    
    const enlace = `http://localhost:5173/restablish/${token}`;
    await sendEmail({
      to: correo,
      subject: "🔑 Restablecer contraseña - COCAL",
      html: `
        <h2>Hola ${user.nombre}</h2>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente botón para establecer una nueva:</p>
        <a href="${enlace}" 
           style="display:inline-block;background-color:#2563eb;color:#fff;
                  padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">
           Restablecer contraseña
        </a>
        <p style="margin-top:15px;">Este enlace expira en <b>30 minutos</b>.</p>
        <p>Si no solicitaste este cambio, ignora este mensaje.</p>
      `,
    });

    console.log(`Correo de restablecimiento enviado a ${correo}`);
    res.json({ message: "Correo de restablecimiento enviado correctamente." });
  } catch (error) {
    console.error("❌ Error en solicitarRestablecimiento:", error.message);
    res
      .status(500)
      .json({ message: "Error al solicitar restablecimiento.", error: error.message });
  }
}


export async function restablecerContrasena(req, res) {
  try {
    const { token } = req.params;
    const { nuevaContrasena } = req.body;

    const { data: registro } = await supabase
      .from("recuperacion_contrasena")
      .select("*")
      .eq("token", token)
      .eq("usado", false)
      .maybeSingle();

    if (!registro)
      return res.status(400).json({ message: "Token inválido o ya usado." });

    
    if (new Date() > new Date(registro.expiracion))
      return res.status(400).json({ message: "El enlace ha expirado." });

    
    const hash = await bcrypt.hash(nuevaContrasena, 10);

    
    await supabase.from("usuario").update({ contrasena: hash }).eq("id", registro.usuario_id);
    await supabase.from("recuperacion_contrasena").update({ usado: true }).eq("id", registro.id);

    console.log(`🔄 Contraseña restablecida para usuario_id: ${registro.usuario_id}`);
    res.json({ message: "Contraseña restablecida correctamente." });
  } catch (error) {
    console.error("❌ Error en restablecerContrasena:", error.message);
    res
      .status(500)
      .json({ message: "Error al restablecer contraseña.", error: error.message });
  }
}
