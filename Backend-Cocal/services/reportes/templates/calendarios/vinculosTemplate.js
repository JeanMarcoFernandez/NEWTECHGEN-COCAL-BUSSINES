// services/reportes/templates/calendarios/vinculosTemplate.js
import { baseTemplate } from '../baseTemplate.js';

export function renderVinculos({ id_proyecto, kpis, vinculos }) {
  const contenidoHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">Proyecto</div><div class="value">#${id_proyecto}</div></div>
      <div class="kpi"><div class="label">Vínculos</div><div class="value">${kpis.total}</div></div>
      <div class="kpi"><div class="label">LECTURA</div><div class="value">${kpis.lectura}</div></div>
      <div class="kpi"><div class="label">EDICION</div><div class="value">${kpis.edicion}</div></div>
      <div class="kpi"><div class="label">ADMIN</div><div class="value">${kpis.admin}</div></div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Origen</th>
          <th>Destino</th>
          <th style="width: 120px;">Permiso</th>
          <th style="width: 160px;">Creado en</th>
        </tr>
      </thead>
      <tbody>
        ${
          vinculos.length
            ? vinculos.map(v => `
              <tr>
                <td>${esc(v.origen_tipo)} #${esc(v.origen_id)}</td>
                <td>${esc(v.destino_tipo)} #${esc(v.destino_id)}</td>
                <td><span class="badge">${esc(v.permiso ?? 'LECTURA')}</span></td>
                <td>${fmt(v.creado_en)}</td>
              </tr>
            `).join('')
            : `<tr><td colspan="4" class="muted">No hay vínculos para este proyecto.</td></tr>`
        }
      </tbody>
    </table>
  `;

  return baseTemplate({
    titulo: 'Vínculos de calendarios',
    subtitulo: 'Control de compartición entre calendarios',
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
