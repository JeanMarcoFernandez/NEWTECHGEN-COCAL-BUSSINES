// models/reservaRecursoModel.js
import { supabase } from '../db.js';

// Crear reserva
export async function crearReservaRecursoDB(payload) {
  const { data, error } = await supabase
    .from('reserva_recurso')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// Buscar reservas solapadas para un recurso y rango de fechas
export async function buscarReservasSolapadasDB({
  id_recurso,
  fecha_inicio,
  fecha_fin,
  estadosBloqueantes = [
    'PENDIENTE_APROBACION',
    'APROBADA',
    'EN_USO'
  ]
}) {
  // Solape de rangos: inicio < nueva_fin AND fin > nueva_inicio
  let query = supabase
    .from('reserva_recurso')
    .select('*')
    .eq('id_recurso', id_recurso)
    .in('estado', estadosBloqueantes)
    .lt('fecha_inicio', fecha_fin)
    .gt('fecha_fin', fecha_inicio);

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

// Obtener reserva por ID
export async function obtenerReservaPorIdDB(id) {
  const { data, error } = await supabase
    .from('reserva_recurso')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Actualizar reserva
export async function actualizarReservaRecursoDB(id, campos) {
  const { data, error } = await supabase
    .from('reserva_recurso')
    .update({
      ...campos,
      actualizado_en: new Date().toISOString()
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// Historial de reservas con filtros
export async function listarHistorialReservasDB(filtros = {}) {
  let query = supabase.from('reserva_recurso').select('*');

  if (filtros.id_recurso) {
    query = query.eq('id_recurso', filtros.id_recurso);
  }
  if (filtros.id_solicitante) {
    query = query.eq('id_solicitante', filtros.id_solicitante);
  }
  if (filtros.id_aprobador) {
    query = query.eq('id_aprobador', filtros.id_aprobador);
  }
  if (filtros.estado) {
    query = query.eq('estado', filtros.estado);
  }
  if (filtros.fecha_desde) {
    query = query.gte('fecha_inicio', filtros.fecha_desde);
  }
  if (filtros.fecha_hasta) {
    query = query.lte('fecha_fin', filtros.fecha_hasta);
  }

  const { data, error } = await query.order('fecha_inicio', {
    ascending: false
  });

  if (error) throw error;
  return data;
}

// Buscar reservas aprobadas sin checkin que ya pasaron 15 minutos
export async function listarReservasParaLiberarDB(minutosTolerancia = 15) {
  // Usamos SQL crudo vía rpc? Para simplificar, lo haremos con filtro de tiempo aproximado.
  const ahora = new Date();
  const limite = new Date(ahora.getTime() - minutosTolerancia * 60 * 1000);

  const { data, error } = await supabase
    .from('reserva_recurso')
    .select('*')
    .eq('estado', 'APROBADA')
    .is('checkin_en', null)
    .lte('fecha_inicio', limite.toISOString());

  if (error) throw error;
  return data;
}
