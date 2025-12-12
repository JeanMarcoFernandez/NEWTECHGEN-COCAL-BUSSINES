// routes/reportesCalendariosRoutes.js
import { Router } from 'express';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

import {
  pdfAgendaEmpresa,
  pdfAgendaDepartamento,
  pdfParticipacionEmpresa,
  pdfParticipacionDepartamento,
  pdfVinculos,
} from '../controllers/reportesCalendariosController.js';

const router = Router();

// Calendarios / Eventos
router.get('/empresa/agenda.pdf', verificarToken, validarRol('ADMIN', 'SUPERVISOR', 'RRHH'), pdfAgendaEmpresa);
router.get('/departamento/agenda.pdf', verificarToken, validarRol('ADMIN', 'SUPERVISOR', 'RRHH'), pdfAgendaDepartamento);

router.get('/empresa/participacion.pdf', verificarToken, validarRol('ADMIN', 'SUPERVISOR', 'RRHH'), pdfParticipacionEmpresa);
router.get('/departamento/participacion.pdf', verificarToken, validarRol('ADMIN', 'SUPERVISOR', 'RRHH'), pdfParticipacionDepartamento);

router.get('/vinculos.pdf', verificarToken, validarRol('ADMIN', 'SUPERVISOR'), pdfVinculos);

export default router;
