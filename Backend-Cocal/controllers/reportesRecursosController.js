// controllers/reportesRecursosController.js
import {
  getRecursoPorId,
  getReservasPorRecurso,
  getReservasPendientes,
  getKpisOcupacionBase,
} from '../models/reportesRecursosModel.js';

import { generarPDFBufferDesdeHTML, enviarPDF } from '../services/pdfService.js';

import { renderReservasPorRecurso } from '../services/reportes/templates/recursos/reservasPorRecursoTemplate.js';
import { renderPendientes } from '../services/reportes/templates/recursos/pendientesAprobacionTemplate.js';
import { renderKpisOcupacion } from '../services/reportes/templates/recursos/kpisOcupacionTemplate.js';

function validarRango(desde, hasta) {
  if (!desde || !hasta) return 'Parámetros requeridos: desde, hasta';
  if (new Date(desde).toString() === 'Invalid Date') return 'Fecha inválida en "desde"';
  if (new Date(hasta).toString() === 'Invalid Date') return 'Fecha inválida en "hasta"';
  return null;
}

export async function pdfReservasPorRecurso(req, res) {
  try {
    const { id_recurso, desde, hasta } = req.query;
    const err = validarRango(desde, hasta);
    if (err) return res.status(400).json({ message: err });
    if (!id_recurso) return res.status(400).json({ message: 'Parámetro requerido: id_recurso' });

    const recurso = await getRecursoPorId({ id_recurso });
    if (!recurso) return res.status(404).json({ message: 'Recurso no encontrado.' });

    const reservas = await getReservasPorRecurso({ id_recurso, desde, hasta });

    const html = renderReservasPorRecurso({
      recurso,
      desde,
      hasta,
      kpis: { total: reservas.length },
      reservas,
    });

    const pdf = await generarPDFBufferDesdeHTML(html);
    enviarPDF(res, pdf, `reservas_recurso_${id_recurso}.pdf`);
  } catch (e) {
    console.error('pdfReservasPorRecurso:', e.message);
    res.status(500).json({ message: 'Error generando PDF de reservas por recurso.' });
  }
}

export async function pdfPendientesAprobacion(req, res) {
  try {
    const { desde, hasta } = req.query;
    const err = validarRango(desde, hasta);
    if (err) return res.status(400).json({ message: err });

    const items = await getReservasPendientes({ desde, hasta });

    const html = renderPendientes({
      desde,
      hasta,
      kpis: { total: items.length },
      items,
    });

    const pdf = await generarPDFBufferDesdeHTML(html);
    enviarPDF(res, pdf, `pendientes_aprobacion.pdf`);
  } catch (e) {
    console.error('pdfPendientesAprobacion:', e.message);
    res.status(500).json({ message: 'Error generando PDF de pendientes de aprobación.' });
  }
}

function horasEntre(inicio, fin) {
  const a = new Date(inicio);
  const b = new Date(fin);
  const ms = b - a;
  if (Number.isNaN(ms) || ms <= 0) return 0;
  return ms / 1000 / 60 / 60;
}

function keyPeriodo(dateStr, granularidad) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';

  if (granularidad === 'semana') {
    // ISO-ish week key (simple)
    const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
    return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  }

  // día
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function pdfKpisOcupacion(req, res) {
  try {
    const { desde, hasta, granularidad = 'dia' } = req.query;
    const err = validarRango(desde, hasta);
    if (err) return res.status(400).json({ message: err });

    const rows = await getKpisOcupacionBase({ desde, hasta });

    const totalReservas = rows.length;
    const canceladas = rows.filter(r => String(r.estado || '').toUpperCase() === 'CANCELADA').length;
    const noAsistio = rows.filter(r => String(r.estado || '').toUpperCase() === 'NO_ASISTIO').length;

    // series por periodo
    const mapSeries = new Map(); // periodo -> {horas, reservas}
    for (const r of rows) {
      const periodo = keyPeriodo(r.fecha_inicio, granularidad);
      const horas = horasEntre(r.fecha_inicio, r.fecha_fin);
      if (!mapSeries.has(periodo)) mapSeries.set(periodo, { periodo, horas: 0, reservas: 0 });
      const obj = mapSeries.get(periodo);
      obj.horas += horas;
      obj.reservas += 1;
    }
    const series = Array.from(mapSeries.values()).sort((a, b) => a.periodo.localeCompare(b.periodo));

    // top recursos
    const mapTop = new Map(); // id_recurso -> {id_recurso, horas, reservas}
    for (const r of rows) {
      const horas = horasEntre(r.fecha_inicio, r.fecha_fin);
      if (!mapTop.has(r.id_recurso)) mapTop.set(r.id_recurso, { id_recurso: r.id_recurso, horas: 0, reservas: 0 });
      const obj = mapTop.get(r.id_recurso);
      obj.horas += horas;
      obj.reservas += 1;
    }
    let topRecursos = Array.from(mapTop.values())
      .sort((a, b) => b.horas - a.horas)
      .slice(0, 10);

    // (opcional) traer nombres para top recursos:
    // para no spamear queries, lo dejamos con id. Si quieres, te lo optimizo luego con IN()
    // topRecursos = await attachNombresRecursos(topRecursos)

    const html = renderKpisOcupacion({
      desde,
      hasta,
      granularidad,
      kpis: { totalReservas, canceladas, noAsistio },
      series,
      topRecursos,
    });

    const pdf = await generarPDFBufferDesdeHTML(html);
    enviarPDF(res, pdf, `kpis_ocupacion_${granularidad}.pdf`);
  } catch (e) {
    console.error('pdfKpisOcupacion:', e.message);
    res.status(500).json({ message: 'Error generando PDF de KPIs de ocupación.' });
  }
}
