// services/reportes/templates/calendarios/agendaTemplate.js
import { baseTemplate } from '../baseTemplate.js';

export function renderAgenda({ scopeLabel, desde, hasta, kpis, eventos }) {
  const contenidoHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">Rango</div><div class="value">${fmt(desde)} → ${fmt(hasta)}</div></div>
      <div class="kpi"><div class="label">Total eventos</div><div class="value">${kpis.total}</div></div>
      <div class="kpi"><div class="label">Programados</div><div class="value">${kpis.programados}</div></div>
      <div class="kpi"><div class="label">Cancelados</div><div class="value">${kpis.cancelados}</div></div>
      <div class="kpi"><div class="label">Finalizados</div><div class="value">${kpis.finalizados}</div></div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 140px;">Inicio</th>
          <th style="width: 140px;">Fin</th>
          <th>Título</th>
          <th style="width: 120px;">Tipo</th>
          <th style="width: 120px;">Estado</th>
          <th style="width: 140px;">Responsable</th>
        </tr>
      </thead>
      <tbody>
        ${
          eventos.length
            ? eventos.map(e => `
              <tr>
                <td>${fmt(e.fecha_inicio)}</td>
                <td>${fmt(e.fecha_fin)}</td>
                <td>
                  <div><b>${esc(e.titulo)}</b></div>
                  ${e.descripcion ? `<div class="muted">${esc(e.descripcion)}</div>` : `<div class="muted">—</div>`}
                </td>
                <td><span class="badge">${esc(e.tipo)}</span></td>
                <td><span class="badge">${esc(e.estado)}</span></td>
                <td>${esc(e.responsable_nombre ?? e.responsable ?? '—')}</td>
              </tr>
            `).join('')
            : `<tr><td colspan="6" class="muted">No hay eventos en el rango.</td></tr>`
        }
      </tbody>
    </table>
  `;

  return baseTemplate({
    titulo: `Agenda (${scopeLabel})`,
    subtitulo: `Eventos en rango de fechas`,
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
