import { recurso15Service, reservaRecurso15Service } from '../services/recurso15Service.js';

export const recurso15Controller = {
  crearRecurso: async (req, res) => {
    try {
      const archivo = req.file;
      const recurso = await recurso15Service.crearRecurso(req.body, archivo);
      res.json({ recurso });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  listarRecursos: async (req, res) => {
    try {
      const recursos = await recurso15Service.listarRecursos();
      res.json({ recursos });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  obtenerRecurso: async (req, res) => {
    try {
      const recurso = await recurso15Service.obtenerRecurso(req.params.id);
      res.json({ recurso });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  crearReserva: async (req, res) => {
    try {
      const reserva = await reservaRecurso15Service.crearReserva(req.body);
      res.json({ reserva });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  listarReservas: async (req, res) => {
    try {
      const reservas = await reservaRecurso15Service.obtenerReservas(req.params.id_recurso);
      res.json({ reservas });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
