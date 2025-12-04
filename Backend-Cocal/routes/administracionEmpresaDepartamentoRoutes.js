// routes/administracionEmpresaDepartamentoRoutes.js
import { Router } from 'express';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

import {
  listarDepartamentosDeEmpresaAdmin,
  eliminarDepartamentoDeEmpresaAdmin,
  resumenEmpresaDepartamentoAdmin,
} from '../controllers/administracionEmpresaDepartamentoController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AdministracionEmpresaDepartamento
 *   description: Gestión administrativa de empresa y sus departamentos
 */

/**
 * @swagger
 * /api/admin/empresa-departamento/{idEmpresa}/departamentos:
 *   get:
 *     summary: Lista todos los departamentos de una empresa
 *     tags: [AdministracionEmpresaDepartamento]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/:idEmpresa/departamentos',
  verificarToken,
  validarRol('ADMIN'),
  listarDepartamentosDeEmpresaAdmin
);

/**
 * @swagger
 * /api/admin/empresa-departamento/{idEmpresa}/departamentos/{idDepartamento}:
 *   delete:
 *     summary: Elimina un departamento de una empresa
 *     description: Verifica que el departamento pertenezca a la empresa antes de eliminarlo.
 *     tags: [AdministracionEmpresaDepartamento]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  '/:idEmpresa/departamentos/:idDepartamento',
  verificarToken,
  validarRol('ADMIN'),
  eliminarDepartamentoDeEmpresaAdmin
);

/**
 * @swagger
 * /api/admin/empresa-departamento/{idEmpresa}/resumen:
 *   get:
 *     summary: Resumen de la empresa (departamentos, usuarios, proyectos)
 *     tags: [AdministracionEmpresaDepartamento]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/:idEmpresa/resumen',
  verificarToken,
  validarRol('ADMIN'),
  resumenEmpresaDepartamentoAdmin
);

export default router;
