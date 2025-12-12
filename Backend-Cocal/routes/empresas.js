import { Router } from 'express'
import { verificarToken } from '../middleware/verificarToken.js'
import { obtenerEstructuraEmpresa } from '../controllers/empresasController.js'

const router = Router()

/**
 * @swagger
 * /api/empresas-adicion/{idEmpresa}/estructura:
 *   get:
 *     summary: Obtener estructura de usuarios por empresa y departamento
 *     description: |
 *       Devuelve la estructura completa de una empresa:
 *       - Empresa
 *       - Departamentos
 *       - Usuarios agrupados por departamento
 *       - Usuarios sin departamento
 *
 *       🔒 Seguridad:
 *       - Requiere token JWT
 *       - Si el usuario NO es ADMIN, solo puede consultar su propia empresa
 *     tags:
 *       - Empresas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEmpresa
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     responses:
 *       200:
 *         description: Estructura de empresa obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 empresa:
 *                   type: object
 *                 departamentos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       usuarios:
 *                         type: array
 *                         items:
 *                           type: object
 *                 sin_departamento:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado a empresa ajena
 *       404:
 *         description: Empresa no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:idEmpresa/estructura', verificarToken, obtenerEstructuraEmpresa)

export default router
