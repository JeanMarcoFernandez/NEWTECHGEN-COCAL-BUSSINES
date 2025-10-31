import { Router } from 'express';
import { desbloquearUsuario } from '../controllers/seguridadController.js';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

const router = Router();

/**
 * @openapi
 * /api/seguridad/desbloquear/{id}:
 *   post:
 *     tags:
 *       - Seguridad
 *     summary: Desbloquear un usuario (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario desbloqueado.
 *       404:
 *         description: Usuario no encontrado.
 *       401:
 *         description: No autorizado.
 */
router.post('/desbloquear/:id', verificarToken, validarRol('ADMIN'), desbloquearUsuario);

export default router;
