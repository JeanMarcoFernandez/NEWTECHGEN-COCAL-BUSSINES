import axios from 'axios';
import { supabase } from '../db.js';
import { sendEmail } from './emailService.js';

/**
 * 🧠 Función: verificarCambioIP
 * Detecta si la IP cambió y guarda también información de ubicación y navegador.
 */
export async function verificarCambioIP(user, nuevaIp, userAgent = 'unknown') {
  try {
    // Si estamos en local (::1 o 127.0.0.1), tratamos de conseguir la IP pública real
    let ipReal = nuevaIp;
    if (ipReal === '::1' || ipReal === '127.0.0.1' || ipReal === '0.0.0.0') {
      const resp = await axios.get('https://api.ipify.org?format=json');
      ipReal = resp.data.ip;
    }

    // Consultar info geográfica de la IP (país, ciudad, etc.)
    let ubicacion = 'Desconocida';
    try {
      const geo = await axios.get(`https://ipapi.co/${ipReal}/json/`);
      ubicacion = `${geo.data.city || 'Ciudad desconocida'}, ${geo.data.country_name || 'País desconocido'}`;
    } catch {
      ubicacion = 'Ubicación no disponible';
    }

    // Si es primera vez, simplemente guardamos IP + sesión + userAgent
    if (!user.ultima_ip) {
      await supabase
        .from('usuario')
        .update({
          ultima_ip: ipReal,
          ultima_sesion: new Date(),
          user_agent: userAgent,
          ubicacion_ultima_ip: ubicacion,
        })
        .eq('id', user.id);
      return;
    }

    // Si cambió la IP → enviar alerta
    if (user.ultima_ip !== ipReal) {
      await sendEmail({
        to: user.correo,
        subject: '⚠️ Actividad sospechosa detectada en tu cuenta',
        html: `
          <h2>Hola, ${user.nombre}</h2>
          <p>Se detectó un inicio de sesión desde una ubicación o dispositivo diferente:</p>
          <ul>
            <li><b>IP anterior:</b> ${user.ultima_ip}</li>
            <li><b>IP actual:</b> ${ipReal}</li>
            <li><b>Ubicación estimada:</b> ${ubicacion}</li>
            <li><b>Navegador:</b> ${userAgent}</li>
          </ul>
          <p>Si fuiste tú, puedes ignorar este mensaje.<br>
          Si no reconoces esta actividad, 
          <a href="http://localhost:5173/restablecer">restablece tu contraseña</a> inmediatamente.</p>
          <p><small>Fecha del evento: ${new Date().toLocaleString()}</small></p>
        `,
      });

      await supabase
        .from('usuario')
        .update({
          ultima_ip: ipReal,
          ultima_sesion: new Date(),
          user_agent: userAgent,
          ubicacion_ultima_ip: ubicacion,
        })
        .eq('id', user.id);
    } else {
      // Actualizar solo la fecha de última sesión
      await supabase
        .from('usuario')
        .update({
          ultima_sesion: new Date(),
          user_agent: userAgent,
          ubicacion_ultima_ip: ubicacion,
        })
        .eq('id', user.id);
    }
  } catch (err) {
    console.error('❌ Error en verificarCambioIP:', err.message);
  }
}
