// models/reportesCalendariosModel.js
import { supabase } from '../db.js';

export async function getEventosEmpresaAgenda({ id_calendario, desde, hasta }) {
  const { data, error } = await supabase
    .from('evento_empresa')
    .select(`
      id, titulo, descripcion, tipo, fecha_inicio, fecha_fin, estado, responsable
    `)
    .eq('id_calendario_empresa', id_calendario)
    .gte('fecha_inicio', desde)
    .lte('fecha_inicio', hasta)
    .order('fecha_inicio', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getEventosDepartamentoAgenda({ id_calendario, desde, hasta }) {
  const { data, error } = await supabase
    .from('evento_departamento')
    .select(`
      id, titulo, descripcion, tipo, fecha_inicio, fecha_fin, estado, responsable
    `)
    .eq('id_calendario_grupo', id_calendario)
    .gte('fecha_inicio', desde)
    .lte('fecha_inicio', hasta)
    .order('fecha_inicio', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getParticipacionEmpresa({ id_calendario, desde, hasta }) {
  // 1) eventos en rango
  const eventos = await getEventosEmpresaAgenda({ id_calendario, desde, hasta });
  const ids = eventos.map(e => e.id);
  if (!ids.length) return { eventos: [], participaciones: [] };

  // 2) participaciones de esos eventos
  const { data, error } = await supabase
    .from('participacion_evento_empresa')
    .select(`id, id_evento_empresa, estado`)
    .in('id_evento_empresa', ids);

  if (error) throw error;

  return { eventos, participaciones: data || [] };
}

export async function getParticipacionDepartamento({ id_calendario, desde, hasta }) {
  const eventos = await getEventosDepartamentoAgenda({ id_calendario, desde, hasta });
  const ids = eventos.map(e => e.id);
  if (!ids.length) return { eventos: [], participaciones: [] };

  const { data, error } = await supabase
    .from('participacion_evento_departamento')
    .select(`id, id_evento_departamento, estado`)
    .in('id_evento_departamento', ids);

  if (error) throw error;

  return { eventos, participaciones: data || [] };
}

export async function getVinculosCalendario({ id_proyecto }) {
  const { data, error } = await supabase
    .from('calendario_vinculo')
    .select(`id, id_proyecto, origen_tipo, origen_id, destino_tipo, destino_id, permiso, creado_en`)
    .eq('id_proyecto', id_proyecto)
    .order('creado_en', { ascending: false });

  if (error) throw error;
  return data || [];
}
