// controllers/analyticsController.js
import { analyticsService } from '../services/analyicsService.js';
import { Parser } from 'json2csv';

export const analyticsController = {

  corporativo: async (req, res) => {
    try {
      const data = await analyticsService.obtenerMetricaCorporativa();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  departamento: async (req, res) => {
    try {
      const data = await analyticsService.obtenerUsoDepartamento(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  benchmarking: async (req, res) => {
    try {
      const data = await analyticsService.benchmarkingDepartamentos();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  exportarDepartamento: async (req, res) => {
    try {
      const rows = await analyticsService.obtenerDatasetDepartamento(req.params.id);
      if (rows.length === 0) return res.status(404).json({ message: 'No hay datos' });

      const parser = new Parser();
      const csv = parser.parse(rows);

      res.setHeader('Content-Type', 'text/csv');
      res.attachment('dataset_departamento.csv');
      res.send(csv);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  tendenciasNegativas: async (req, res) => {
    try {
      const alertas = await analyticsService.detectarTendenciasNegativas();
      res.json(alertas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  guardarKpi: async (req, res) => {
    try {
      const result = await analyticsService.guardarKpi({
        nombre: req.body.nombre,
        formula_sql: req.body.formula_sql,
        userId: req.user.id
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  configDashboard: async (req, res) => {
    try {
      const result = await analyticsService.guardarDashboardConfig(
        req.user.id,
        req.body.layout
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
