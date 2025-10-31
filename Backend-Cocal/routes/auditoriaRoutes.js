import { Router } from 'express';
import { listarAuditoriaLogin } from '../controllers/auditoriaController.js';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

const router = Router();

/**
 * @openapi
 * /api/auditoria/logins:
 *   get:
 *     tags:
 *       - Auditoría
 *     summary: Listar auditoría de logins (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/logins', verificarToken, validarRol('ADMIN'), listarAuditoriaLogin);

export default router;
