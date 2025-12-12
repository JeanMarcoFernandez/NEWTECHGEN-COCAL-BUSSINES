// services/reportes/templates/baseTemplate.js
export function baseTemplate({ titulo, subtitulo = '', contenidoHTML }) {
  const hoy = new Date().toISOString().slice(0, 19).replace('T', ' ');

  return `
  <!doctype html>
  <html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(titulo)}</title>
    <style>
      body { font-family: Arial, sans-serif; font-size: 12px; color: #111; }
      .header { display:flex; justify-content:space-between; align-items:flex-end; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 12px;}
      .title { font-size: 18px; font-weight: 700; }
      .subtitle { font-size: 12px; color: #444; margin-top: 4px; }
      .meta { font-size: 10px; color: #555; text-align:right; }
      .kpis { display:flex; gap:10px; margin: 10px 0 14px; flex-wrap:wrap; }
      .kpi { border: 1px solid #ddd; border-radius: 8px; padding: 8px 10px; min-width: 160px; }
      .kpi .label { font-size: 10px; color:#666; }
      .kpi .value { font-size: 16px; font-weight:700; margin-top: 2px; }
      table { width:100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 7px 8px; vertical-align: top; }
      th { background:#f3f3f3; text-align:left; }
      .muted { color:#666; }
      .badge { display:inline-block; padding:2px 8px; border:1px solid #aaa; border-radius: 999px; font-size: 10px; }
      .footer { margin-top: 14px; border-top: 1px solid #ddd; padding-top: 8px; font-size: 10px; color:#666; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="title">${escapeHtml(titulo)}</div>
        ${subtitulo ? `<div class="subtitle">${escapeHtml(subtitulo)}</div>` : ''}
      </div>
      <div class="meta">
        Generado: ${escapeHtml(hoy)}
      </div>
    </div>

    ${contenidoHTML}

    <div class="footer">
      CoCal Business · Reporte PDF (Puppeteer)
    </div>
  </body>
  </html>
  `;
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
