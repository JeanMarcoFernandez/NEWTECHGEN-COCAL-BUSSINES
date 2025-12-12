// services/reportes/templates/recursos/pendientesAprobacionTemplate.js
import { baseTemplate } from '../baseTemplate.js';

export function renderPendientes({ desde, hasta, kpis, items }) {
  const contenidoHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">Rango</div><div class="value">${fmt(desde)} → ${fmt(hasta)}</div></div>
      <div class="kpi"><div class="label">Pendientes</div><div class="value">${kpis.total}</div></div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width:140px;">Inicio</th>
          <th style="width:140px;">Fin</th>
          <th>Recurso</th>
          <th>Solicitante</th>
          <th>Motivo</th>
        </tr>
      </thead>
      <tbody>
        ${
          items.length
            ? items.map(r => `
              <tr>
                <td>${fmt(r.fecha_inicio)}</td>
                <td>${fmt(r.fecha_fin)}</td>
                <td>${esc(r.recurso_nombre ?? `#${r.id_recurso}`)}</td>
                <td>${esc(r.solicitante_nombre ?? r.id_solicitante ?? '—')}</td>
                <td>${r.motivo ? esc(r.motivo) : '<span class="muted">—</span>'}</td>
              </tr>
            `).join('')
            : `<tr><td colspan="5" class="muted">No hay pendientes en el rango.</td></tr>`
        }
      </tbody>
    </table>
  `;

  return baseTemplate({
    titulo: 'Reservas pendientes de aprobación',
    subtitulo: 'Lista de solicitudes pendientes',
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
