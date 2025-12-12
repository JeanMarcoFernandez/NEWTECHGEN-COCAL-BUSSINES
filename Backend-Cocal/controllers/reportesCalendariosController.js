// controllers/reportesCalendariosController.js
import {
  getEventosEmpresaAgenda,
  getEventosDepartamentoAgenda,
  getParticipacionEmpresa,
  getParticipacionDepartamento,
  getVinculosCalendario,
} from '../models/reportesCalendariosModel.js';

import { generarPDFBufferDesdeHTML, enviarPDF } from '../services/pdfService.js';

import { renderAgenda } from '../services/reportes/templates/calendarios/agendaTemplate.js';
import { renderParticipacion } from '../services/reportes/templates/calendarios/participacionTemplate.js';
import { renderVinculos } from '../services/reportes/templates/calendarios/vinculosTemplate.js';

function validarRango(desde, hasta) {
  if (!desde || !hasta) return 'Parámetros requeridos: desde, hasta';
  if (new Date(desde).toString() === 'Invalid Date') return 'Fecha inválida en "desde"';
  if (new Date(hasta).toString() === 'Invalid Date') return 'Fecha inválida en "hasta"';
  return null;
}

function kpisEventos(eventos) {
  const norm = (s) => String(s || '').toUpperCase();
  const programados = eventos.filter(e => norm(e.estado) === 'PROGRAMADO').length;
  const cancelados = eventos.filter(e => norm(e.estado) === 'CANCELADO').length;
  const finalizados = eventos.filter(e => norm(e.estado) === 'FINALIZADO').length;
  return { total: eventos.length, programados, cancelados, finalizados };
}

export async function pdfAgendaEmpresa(req, res) {
  try {
    const { id_calendario, desde, hasta } = req.query;
    const err = validarRango(desde, hasta);
    if (err) return res.status(400).json({ message: err });
    if (!id_calendario) return res.status(400).json({ message: 'Parámetro requerido: id_calendario' });

    const eventos = await getEventosEmpresaAgenda({ id_calendario, desde, hasta });
    const html = renderAgenda({
      scopeLabel: `Empresa · Calendario #${id_calendario}`,
      desde, hasta,
      kpis: kpisEventos(eventos),
      eventos,
    });

    const pdf = await generarPDFBufferDesdeHTML(html);
    enviarPDF(res, pdf, `agenda_empresa_${id_calendario}.pdf`);
  } catch (e) {
    console.error('pdfAgendaEmpresa:', e.message);
    res.status(500).json({ message: 'Error generando PDF de agenda (empresa).' });
  }
}

export async function pdfAgendaDepartamento(req, res) {
  try {
    const { id_calendario, desde, hasta } = req.query;
    const err = validarRango(desde, hasta);
    if (err) return res.status(400).json({ message: err });
    if (!id_calendario) return res.status(400).json({ message: 'Parámetro requerido: id_calendario' });

    const eventos = await getEventosDepartamentoAgenda({ id_calendario, desde, hasta });
    const html = renderAgenda({
      scopeLabel: `Departamento · Calendario #${id_calendario}`,
      desde, hasta,
      kpis: kpisEventos(eventos),
      eventos,
    });

    const pdf = await generarPDFBufferDesdeHTML(html);
    enviarPDF(res, pdf, `agenda_departamento_${id_calendario}.pdf`);
  } catch (e) {
    console.error('pdfAgendaDepartamento:', e.message);
    res.status(500).json({ message: 'Error generando PDF de agenda (departamento).' });
  }
}

function resumenParticipacion({ eventos, participaciones, tipoEventoKey }) {
  // Mapea por eventoId
  const map = new Map(); // id -> {pendiente,aceptado,rechazado}
  for (const p of participaciones) {
    const idEv = p[tipoEventoKey];
    if (!map.has(idEv)) map.set(idEv, { pendiente: 0, aceptado: 0, rechazado: 0 });
    const s = String(p.estado || '').toUpperCase();
    if (s.includes('PEND')) map.get(idEv).pendiente++;
    else if (s.includes('ACEPT')) map.get(idEv).aceptado++;
    else if (s.includes('RECHAZ')) map.get(idEv).rechazado++;
    else map.get(idEv).pendiente++; // fallback
  }

  const items = eventos.map(ev => {
    const c = map.get(ev.id) || { pendiente: 0, aceptado: 0, rechazado: 0 };
    return { ...ev, ...c };
  });

  const totalParticipaciones = participaciones.length;
  return { items, kpis: { totalEventos: eventos.length, totalParticipaciones } };
}

export async function pdfParticipacionEmpresa(req, res) {
  try {
    const { id_calendario, desde, hasta } = req.query;
    const err = validarRango(desde, hasta);
    if (err) return res.status(400).json({ message: err });
    if (!id_calendario) return res.status(400).json({ message: 'Parámetro requerido: id_calendario' });

    const { eventos, participaciones } = await getParticipacionEmpresa({ id_calendario, desde, hasta });
    const { items, kpis } = resumenParticipacion({
      eventos,
      participaciones,
      tipoEventoKey: 'id_evento_empresa',
    });

    const html = renderParticipacion({
      scopeLabel: `Empresa · Calendario #${id_calendario}`,
      desde, hasta,
      kpis,
      items,
    });

    const pdf = await generarPDFBufferDesdeHTML(html);
    enviarPDF(res, pdf, `participacion_empresa_${id_calendario}.pdf`);
  } catch (e) {
    console.error('pdfParticipacionEmpresa:', e.message);
    res.status(500).json({ message: 'Error generando PDF de participación (empresa).' });
  }
}

export async function pdfParticipacionDepartamento(req, res) {
  try {
    const { id_calendario, desde, hasta } = req.query;
    const err = validarRango(desde, hasta);
    if (err) return res.status(400).json({ message: err });
    if (!id_calendario) return res.status(400).json({ message: 'Parámetro requerido: id_calendario' });

    const { eventos, participaciones } = await getParticipacionDepartamento({ id_calendario, desde, hasta });
    const { items, kpis } = resumenParticipacion({
      eventos,
      participaciones,
      tipoEventoKey: 'id_evento_departamento',
    });

    const html = renderParticipacion({
      scopeLabel: `Departamento · Calendario #${id_calendario}`,
      desde, hasta,
      kpis,
      items,
    });

    const pdf = await generarPDFBufferDesdeHTML(html);
    enviarPDF(res, pdf, `participacion_departamento_${id_calendario}.pdf`);
  } catch (e) {
    console.error('pdfParticipacionDepartamento:', e.message);
    res.status(500).json({ message: 'Error generando PDF de participación (departamento).' });
  }
}

export async function pdfVinculos(req, res) {
  try {
    const { id_proyecto } = req.query;
    if (!id_proyecto) return res.status(400).json({ message: 'Parámetro requerido: id_proyecto' });

    const vinculos = await getVinculosCalendario({ id_proyecto });

    const kpis = {
      total: vinculos.length,
      lectura: vinculos.filter(v => String(v.permiso || '').toUpperCase() === 'LECTURA').length,
      edicion: vinculos.filter(v => String(v.permiso || '').toUpperCase() === 'EDICION').length,
      admin: vinculos.filter(v => String(v.permiso || '').toUpperCase() === 'ADMIN').length,
    };

    const html = renderVinculos({ id_proyecto, kpis, vinculos });
    const pdf = await generarPDFBufferDesdeHTML(html);
    enviarPDF(res, pdf, `vinculos_proyecto_${id_proyecto}.pdf`);
  } catch (e) {
    console.error('pdfVinculos:', e.message);
    res.status(500).json({ message: 'Error generando PDF de vínculos.' });
  }
}
