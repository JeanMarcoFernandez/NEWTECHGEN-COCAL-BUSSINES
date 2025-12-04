import { supabase } from '../db.js';

export const reservaRecurso15Model = {
  async crearReserva(data) {
    const { data: reserva, error } = await supabase
      .from('reserva_recurso')
      .insert([data])
      .select();
    return { reserva: reserva?.[0], error };
  },

  async obtenerReservasPorRecurso(id_recurso) {
    const { data: reservas, error } = await supabase
      .from('reserva_recurso')
      .select('*')
      .eq('id_recurso', id_recurso);
    return { reservas, error };
  },

  async validarDisponibilidad(id_recurso, fecha_inicio, fecha_fin) {
    const { data: reservas, error } = await supabase
      .from('reserva_recurso')
      .select('*')
      .or(`and(fecha_inicio.lte.${fecha_fin},fecha_fin.gte.${fecha_inicio})`);
    return { reservas, error };
  }
};
