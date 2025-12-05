import { mantenimientoService } from '../services/mantenimientoService.js';

export const mantenimientoController = {
  cambiarEstado: async (req, res) => {
    try {
      const resultado = await mantenimientoService.cambiarEstado(req.params.id_recurso, req.body.estado);
      res.json({ mensaje: 'Estado actualizado', resultado });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  programarPreventivo: async (req, res) => {
    try {
      const mantenimiento = await mantenimientoService.programarPreventivo(req.body);
      res.json({ mantenimiento });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  registrarCorrectivo: async (req, res) => {
    try {
      const mantenimiento = await mantenimientoService.registrarCorrectivo(req.body);
      res.json({ mantenimiento });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  historial: async (req, res) => {
    try {
      const historial = await mantenimientoService.historial(req.params.id_recurso);
      res.json({ historial });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  generarReporte: async (req, res) => {
    try {
      const reporte = await mantenimientoService.generarReporte(req.params.id_recurso);
      res.json({ reporte });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
