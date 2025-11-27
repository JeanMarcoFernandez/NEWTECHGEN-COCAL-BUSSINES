// routes/calendarioVinculoRoutes.js
import { Router } from 'express';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

import {
  crearCalendarioVinculoController,
  listarVinculosPorProyectoController,
  listarVinculosDesdeController,
  listarVinculosHaciaController,
  eliminarVinculoPorIdController,
  eliminarVinculoUnicoController,
} from '../controllers/calendarioVinculoController.js';

const router = Router();

/**
 * Base: /api/calendarios/vinculos
 * Solo ADMIN (o el rol que tú quieras) puede crear / borrar vínculos globales.
 */

// Crear vínculo (ej: calendario usuario → calendario empresa)
router.post(
  '/',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  crearCalendarioVinculoController,
);

// Listar vínculos por proyecto
router.get(
  '/proyecto/:idProyecto',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  listarVinculosPorProyectoController,
);

// Listar vínculos donde un calendario es origen
router.get(
  '/origen',
  verificarToken,
  listarVinculosDesdeController,
);

// Listar vínculos donde un calendario es destino
router.get(
  '/destino',
  verificarToken,
  listarVinculosHaciaController,
);

// Eliminar por id de vínculo
router.delete(
  '/:id',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  eliminarVinculoPorIdController,
);

// Eliminar usando la combinación única
router.delete(
  '/',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  eliminarVinculoUnicoController,
);

export default router;
