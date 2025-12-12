// routes/reportesRecursosRoutes.js
import { Router } from 'express';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

import {
  pdfReservasPorRecurso,
  pdfPendientesAprobacion,
  pdfKpisOcupacion,
} from '../controllers/reportesRecursosController.js';

const router = Router();

// Recursos / Reservas
router.get('/reservas-por-recurso.pdf', verificarToken, validarRol('ADMIN', 'SUPERVISOR', 'RRHH'), pdfReservasPorRecurso);
router.get('/pendientes-aprobacion.pdf', verificarToken, validarRol('ADMIN', 'SUPERVISOR'), pdfPendientesAprobacion);
router.get('/kpis-ocupacion.pdf', verificarToken, validarRol('ADMIN', 'SUPERVISOR', 'RRHH'), pdfKpisOcupacion);

export default router;
