import { mantenimientoModel } from '../models/mantenimientoModel.js';
import { reservaRecurso15Model } from '../models/reservaRecurso15Model.js';

export const mantenimientoService = {
  cambiarEstado: async (id_recurso, estado) => {
    // Actualiza estado del recurso
    const resultado = await mantenimientoModel.actualizarEstado(id_recurso, estado);

    // Si el estado es "En Reparación", cancela reservas futuras
    if (estado === 'En Reparacion') {
      await reservaRecurso15Model.cancelarReservasFuturas(id_recurso);
    }

    return resultado;
  },

  programarPreventivo: async (data) => {
    return await mantenimientoModel.crearMantenimiento({
      ...data,
      tipo: 'preventivo'
    });
  },

  registrarCorrectivo: async (data) => {
    return await mantenimientoModel.crearMantenimiento({
      ...data,
      tipo: 'correctivo'
    });
  },

  historial: async (id_recurso) => {
    return await mantenimientoModel.obtenerHistorial(id_recurso);
  },

  generarReporte: async (id_recurso) => {
    return await mantenimientoModel.generarReporteCosto(id_recurso);
  }
};
