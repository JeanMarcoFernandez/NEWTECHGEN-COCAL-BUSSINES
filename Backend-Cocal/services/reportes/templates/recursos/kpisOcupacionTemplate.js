// services/reportes/templates/recursos/kpisOcupacionTemplate.js
import { baseTemplate } from '../baseTemplate.js';

export function renderKpisOcupacion({ desde, hasta, granularidad, kpis, series, topRecursos }) {
  const contenidoHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">Rango</div><div class="value">${fmt(desde)} → ${fmt(hasta)}</div></div>
      <div class="kpi"><div class="label">Granularidad</div><div class="value">${esc(granularidad)}</div></div>
      <div class="kpi"><div class="label">Reservas</div><div class="value">${kpis.totalReservas}</div></div>
      <div class="kpi"><div class="label">Cancelaciones</div><div class="value">${kpis.canceladas}</div></div>
      <div class="kpi"><div class="label">No asistió</div><div class="value">${kpis.noAsistio}</div></div>
    </div>

    <h3 style="margin: 14px 0 8px;">Uso por ${esc(granularidad)}</h3>
    <table>
      <thead>
        <tr>
          <th style="width: 200px;">Periodo</th>
          <th style="width: 200px;">Horas reservadas</th>
          <th>Reservas</th>
        </tr>
      </thead>
      <tbody>
        ${
          series.length
            ? series.map(s => `
              <tr>
                <td>${esc(s.periodo)}</td>
                <td>${Number(s.horas || 0).toFixed(2)}</td>
                <td>${s.reservas ?? 0}</td>
              </tr>
            `).join('')
            : `<tr><td colspan="3" class="muted">No hay datos.</td></tr>`
        }
      </tbody>
    </table>

    <h3 style="margin: 14px 0 8px;">Top recursos más usados</h3>
    <table>
      <thead>
        <tr>
          <th>Recurso</th>
          <th style="width: 200px;">Horas</th>
          <th style="width: 140px;">Reservas</th>
        </tr>
      </thead>
      <tbody>
        ${
          topRecursos.length
            ? topRecursos.map(r => `
              <tr>
                <td>${esc(r.nombre ?? `#${r.id_recurso}`)}</td>
                <td>${Number(r.horas || 0).toFixed(2)}</td>
                <td>${r.reservas ?? 0}</td>
              </tr>
            `).join('')
            : `<tr><td colspan="3" class="muted">No hay datos.</td></tr>`
        }
      </tbody>
    </table>
  `;

  return baseTemplate({
    titulo: 'KPIs de ocupación y uso',
    subtitulo: 'Resumen operativo de reservas',
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
