// services/reportes/templates/recursos/reservasPorRecursoTemplate.js
import { baseTemplate } from '../baseTemplate.js';

export function renderReservasPorRecurso({ recurso, desde, hasta, kpis, reservas }) {
  const contenidoHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">Recurso</div><div class="value">${esc(recurso?.nombre ?? '—')}</div></div>
      <div class="kpi"><div class="label">Tipo</div><div class="value">${esc(recurso?.tipo ?? '—')}</div></div>
      <div class="kpi"><div class="label">Rango</div><div class="value">${fmt(desde)} → ${fmt(hasta)}</div></div>
      <div class="kpi"><div class="label">Total reservas</div><div class="value">${kpis.total}</div></div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width:140px;">Inicio</th>
          <th style="width:140px;">Fin</th>
          <th style="width:140px;">Estado</th>
          <th>Solicitante</th>
          <th>Aprobador</th>
          <th>Motivo</th>
        </tr>
      </thead>
      <tbody>
        ${
          reservas.length
            ? reservas.map(r => `
              <tr>
                <td>${fmt(r.fecha_inicio)}</td>
                <td>${fmt(r.fecha_fin)}</td>
                <td><span class="badge">${esc(r.estado)}</span></td>
                <td>${esc(r.solicitante_nombre ?? r.id_solicitante ?? '—')}</td>
                <td>${esc(r.aprobador_nombre ?? r.id_aprobador ?? '—')}</td>
                <td>${r.motivo ? esc(r.motivo) : '<span class="muted">—</span>'}</td>
              </tr>
            `).join('')
            : `<tr><td colspan="6" class="muted">No hay reservas en el rango.</td></tr>`
        }
      </tbody>
    </table>
  `;

  return baseTemplate({
    titulo: 'Reservas por recurso',
    subtitulo: 'Detalle de reservas en rango de fechas',
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
