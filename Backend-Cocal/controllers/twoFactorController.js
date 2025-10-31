import { supabase } from "../db.js";
import { sendEmail } from "../services/emailService.js";
import { generarToken } from "../utils/generarToken.js";

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


export async function enviarCodigo2FA(usuario_id, correo, nombre) {
  try {
    const codigo = generarCodigo();
    const expiracion = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min

    await supabase
      .from("codigo_2fa")
      .insert([{ usuario_id, codigo, expiracion, usado: false }]);

    await sendEmail({
      to: correo,
      subject: " Código de Verificación - COCAL",
      html: `
        <h2>Hola ${nombre}</h2>
        <p>Tu código de verificación en dos pasos es:</p>
        <h1 style="color:#1e88e5;">${codigo}</h1>
        <p>Este código expira en 5 minutos. Si no solicitaste este acceso, ignora este mensaje.</p>
      `
    });

    console.log(`Código 2FA enviado a ${correo}`);
    return true;
  } catch (error) {
    console.error("Error al enviar código 2FA:", error.message);
    throw error;
  }
}


export async function verificarCodigo2FA(req, res) {
  try {
    const { correo, codigo } = req.body;

    
    const { data: user } = await supabase
      .from("usuario")
      .select("*")
      .eq("correo", correo)
      .single();

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    
    const { data: registro } = await supabase
      .from("codigo_2fa")
      .select("*")
      .eq("usuario_id", user.id)
      .eq("codigo", codigo)
      .eq("usado", false)
      .maybeSingle();

    if (!registro)
      return res.status(400).json({ message: "Código inválido o ya usado." });

    if (new Date() > new Date(registro.expiracion))
      return res.status(400).json({ message: "El código ha expirado." });

    // Marcar el código como usado
    await supabase
      .from("codigo_2fa")
      .update({ usado: true })
      .eq("id", registro.id);

    
    const token = generarToken({
  id: user.id,
  rol: user.rol,
  correo: user.correo,
  ultimaActividad: Date.now()
});


    
    await supabase
      .from("usuario")
      .update({ ultima_sesion: new Date() })
      .eq("id", user.id);

    
    res.status(200).json({
      message: "Verificación 2FA exitosa. Inicio de sesión autorizado.",
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
      expira_en: "30 minutos"
    });
  } catch (error) {
    console.error("Error en verificarCodigo2FA:", error.message);
    res.status(500).json({
      message: "Error al verificar el código 2FA.",
      error: error.message,
    });
  }
}
