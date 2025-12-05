import { recurso15Model } from '../models/recurso15Model.js';
import { reservaRecurso15Model } from '../models/reservaRecurso15Model.js';
import sharp from 'sharp';

export const recurso15Service = {
  async crearRecurso(data, archivoImagen) {
    if (!data.nombre || !data.tipo) throw new Error('Nombre y tipo son obligatorios');

    // Optimizar imagen si existe
    if (archivoImagen) {
      const bufferOptimizado = await sharp(archivoImagen.buffer)
        .resize({ width: 1024 })
        .jpeg({ quality: 80 })
        .toBuffer();
      data.imagen = bufferOptimizado.toString('base64'); 
    }

     // Generar código único
    //data.codigo_unico = `REC15-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const { recurso, error } = await recurso15Model.crearRecurso(data);
    if (error) throw new Error(error.message);
    return recurso;
  },

  async listarRecursos() {
    const { recursos, error } = await recurso15Model.listarRecursos();
    if (error) throw new Error(error.message);
    return recursos;
  },

  async obtenerRecurso(id) {
    const { recurso, error } = await recurso15Model.obtenerRecursoPorId(id);
    if (error) throw new Error(error.message);
    return recurso;
  }
};

export const reservaRecurso15Service = {
  async crearReserva(data) {
    const { reservas } = await reservaRecurso15Model.validarDisponibilidad(
      data.id_recurso,
      data.fecha_inicio,
      data.fecha_fin
    );
    if (reservas.length) throw new Error('Conflicto de horarios con otra reserva');

    if (data.capacidad && reservas.length >= data.capacidad) {
      throw new Error('Se excede la capacidad máxima del recurso');
    }

    const { reserva, error } = await reservaRecurso15Model.crearReserva(data);
    if (error) throw new Error(error.message);
    return reserva;
  },

  async obtenerReservas(id_recurso) {
    const { reservas, error } = await reservaRecurso15Model.obtenerReservasPorRecurso(id_recurso);
    if (error) throw new Error(error.message);
    return reservas;
  }
};
