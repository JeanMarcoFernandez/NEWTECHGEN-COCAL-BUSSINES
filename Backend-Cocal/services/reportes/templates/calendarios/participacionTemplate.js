// services/reportes/templates/calendarios/participacionTemplate.js
import { baseTemplate } from '../baseTemplate.js';

export function renderParticipacion({ scopeLabel, desde, hasta, kpis, items }) {
  const contenidoHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">Rango</div><div class="value">${fmt(desde)} → ${fmt(hasta)}</div></div>
      <div class="kpi"><div class="label">Eventos evaluados</div><div class="value">${kpis.totalEventos}</div></div>
      <div class="kpi"><div class="label">Participaciones</div><div class="value">${kpis.totalParticipaciones}</div></div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 140px;">Inicio</th>
          <th>Evento</th>
          <th style="width: 120px;">Pendiente</th>
          <th style="width: 120px;">Aceptado</th>
          <th style="width: 120px;">Rechazado</th>
        </tr>
      </thead>
      <tbody>
        ${
          items.length
            ? items.map(it => `
              <tr>
                <td>${fmt(it.fecha_inicio)}</td>
                <td>
                  <div><b>${esc(it.titulo)}</b></div>
                  <div class="muted">${esc(it.tipo)} · ${esc(it.estado)}</div>
                </td>
                <td>${it.pendiente ?? 0}</td>
                <td>${it.aceptado ?? 0}</td>
                <td>${it.rechazado ?? 0}</td>
              </tr>
            `).join('')
            : `<tr><td colspan="5" class="muted">No hay datos de participación en el rango.</td></tr>`
        }
      </tbody>
    </table>
  `;

  return baseTemplate({
    titulo: `Participación (${scopeLabel})`,
    subtitulo: `Resumen de estados de participación por evento`,
    contenidoHTML,
  });
}

function fmt(v) {
  if (!v) return '—';
  const s = String(v).replace('T', ' ');
  return s.length >= 16 ? s.slice(0, 16) : s;
}
function esc(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
