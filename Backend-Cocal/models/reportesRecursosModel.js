// models/reportesRecursosModel.js
import { supabase } from '../db.js';

export async function getRecursoPorId({ id_recurso }) {
  const { data, error } = await supabase
    .from('recurso')
    .select(`id, nombre, tipo, ubicacion, capacidad, visibilidad`)
    .eq('id', id_recurso)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getReservasPorRecurso({ id_recurso, desde, hasta }) {
  const { data, error } = await supabase
    .from('reserva_recurso')
    .select(`id, id_recurso, id_solicitante, id_aprobador, fecha_inicio, fecha_fin, estado, motivo, creado_en`)
    .eq('id_recurso', id_recurso)
    .gte('fecha_inicio', desde)
    .lte('fecha_inicio', hasta)
    .order('fecha_inicio', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getReservasPendientes({ desde, hasta }) {
  const { data, error } = await supabase
    .from('reserva_recurso')
    .select(`id, id_recurso, id_solicitante, fecha_inicio, fecha_fin, estado, motivo, creado_en`)
    .eq('estado', 'PENDIENTE_APROBACION')
    .gte('fecha_inicio', desde)
    .lte('fecha_inicio', hasta)
    .order('fecha_inicio', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * KPIs básicos (sin SQL raw):
 * - totalReservas
 * - canceladas
 * - noAsistio
 * - series por día/semana (aprox, con JS)
 * - top recursos (aprox)
 */
export async function getKpisOcupacionBase({ desde, hasta }) {
  const { data, error } = await supabase
    .from('reserva_recurso')
    .select(`id, id_recurso, fecha_inicio, fecha_fin, estado`)
    .gte('fecha_inicio', desde)
    .lte('fecha_inicio', hasta);

  if (error) throw error;
  return data || [];
}
