import { supabase } from '../db.js';

export const mantenimientoModel = {
  // Crear un mantenimiento (preventivo o correctivo)
  async crearMantenimiento(data) {
    const { data: mantenimiento, error } = await supabase
      .from('mantenimiento')
      .insert([{
        id_recurso: data.id_recurso,
        tipo: data.tipo,               // 'preventivo' o 'correctivo'
        fecha_programada: data.fecha_programada || null,
        fecha_real: data.fecha_real || null,
        descripcion: data.descripcion || '',
        proveedor: data.proveedor || null,
        costo: data.costo || 0,
        estado_recurso: data.estado_recurso || 'Disponible'
      }])
      .select();
    
    if (error) throw new Error(error.message);
    return mantenimiento?.[0];
  },

  // Actualizar el estado de un recurso
  async actualizarEstado(id_recurso, estado) {
    const { data, error } = await supabase
      .from('recurso')
      .update({ en_mantenimiento: estado === 'En Reparacion' })
      .eq('id', id_recurso)
      .select();

    if (error) throw new Error(error.message);
    return data?.[0];
  },

  // Obtener historial de mantenimiento de un recurso
  async obtenerHistorial(id_recurso) {
    const { data, error } = await supabase
      .from('mantenimiento')
      .select('*')
      .eq('id_recurso', id_recurso)
      .order('fecha_programada', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // Generar reporte de costos de mantenimiento
  async generarReporteCosto(id_recurso) {
    const { data, error } = await supabase
      .from('mantenimiento')
      .select('tipo, costo, fecha_programada, proveedor')
      .eq('id_recurso', id_recurso);

    if (error) throw new Error(error.message);

    const totalCosto = data.reduce((acc, item) => acc + parseFloat(item.costo || 0), 0);
    return { totalCosto, detalles: data };
  }
};
