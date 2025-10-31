import axios from 'axios';
import { supabase } from '../db.js';
import { sendEmail } from './emailService.js';

export async function verificarCambioIP(user, nuevaIp, userAgent = 'unknown') {
  try {
    
    let ipReal = nuevaIp;
    if (['::1', '127.0.0.1', '0.0.0.0'].includes(ipReal)) {
      const resp = await axios.get('https://api.ipify.org?format=json');
      ipReal = resp.data.ip;
    }

    
    let ubicacion = 'Desconocida';
    try {
      const geo = await axios.get(`https://ipapi.co/${ipReal}/json/`);
      ubicacion = `${geo.data.city || 'Ciudad desconocida'}, ${geo.data.country_name || 'País desconocido'}`;
    } catch {
      ubicacion = 'Ubicación no disponible';
    }

    
    if (!user.ultima_ip) {
      await supabase.from('usuario').update({
        ultima_ip: ipReal,
        ultima_sesion: new Date(),
        user_agent: userAgent,
        ubicacion_ultima_ip: ubicacion,
      }).eq('id', user.id);
      return;
    }

    
    const cambios = [];
    if (user.user_agent && user.user_agent !== userAgent) cambios.push('Dispositivo o navegador diferente');
    if (user.ubicacion_ultima_ip && user.ubicacion_ultima_ip !== ubicacion) cambios.push('Ubicación diferente');
    if (user.ultima_ip !== ipReal) cambios.push('Dirección IP diferente');

    
    if (cambios.length > 0) {
      await sendEmail({
        to: user.correo,
        subject: '⚠️ Actividad sospechosa detectada en tu cuenta',
        html: `
          <h2>Hola, ${user.nombre}</h2>
          <p>Se detectó un inicio de sesión con información diferente a la habitual:</p>
          <ul>
            <li><b>IP anterior:</b> ${user.ultima_ip}</li>
            <li><b>IP actual:</b> ${ipReal}</li>
            <li><b>Ubicación anterior:</b> ${user.ubicacion_ultima_ip || 'Desconocida'}</li>
            <li><b>Ubicación actual:</b> ${ubicacion}</li>
            <li><b>Navegador anterior:</b> ${user.user_agent || 'No registrado'}</li>
            <li><b>Navegador actual:</b> ${userAgent}</li>
          </ul>
          <p><b>Detalles del cambio detectado:</b> ${cambios.join(', ')}</p>
          <p>Si fuiste tú, puedes ignorar este mensaje.<br>
          Si no reconoces esta actividad, 
          <a href="http://localhost:5173/restablecer">restablece tu contraseña</a> inmediatamente.</p>
          <p><small>Fecha del evento: ${new Date().toLocaleString()}</small></p>
        `,
      });
    }

    
    await supabase.from('usuario').update({
      ultima_ip: ipReal,
      ultima_sesion: new Date(),
      user_agent: userAgent,
      ubicacion_ultima_ip: ubicacion,
    }).eq('id', user.id);

  } catch (err) {
    console.error('❌ Error en verificarCambioIP:', err.message);
  }
}
