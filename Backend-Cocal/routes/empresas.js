import { Router } from 'express'
import { verificarToken } from '../middleware/verificarToken.js'
import { obtenerEstructuraEmpresa } from '../controllers/empresasController.js'
import {
  obtenerUsuarioEmpresa,
  patchUsuarioEmpresa,
  eliminarUsuarioEmpresa,
} from '../controllers/empresaUsuariosController.js'
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
 *         Seguridad:
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

/**
 * @swagger
 * /api/empresas-adicion/{idEmpresa}/usuarios/{idUsuario}:
 *   get:
 *     summary: Obtener un usuario dentro de una empresa
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEmpresa
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuario encontrado }
 *       401: { description: Token inválido o no proporcionado }
 *       403: { description: Acceso denegado }
 *       404: { description: Usuario no encontrado en esta empresa }
 */
router.get('/:idEmpresa/usuarios/:idUsuario', verificarToken, obtenerUsuarioEmpresa)

/**
 * @swagger
 * /api/empresas-adicion/{idEmpresa}/usuarios/{idUsuario}:
 *   patch:
 *     summary: Editar (PATCH) un usuario dentro de una empresa (solo ADMIN)
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEmpresa
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               nombre: "Juan"
 *               cargo: "Dev"
 *               id_departamento: 2
 *               estado: "ACTIVO"
 *     responses:
 *       200: { description: Usuario actualizado }
 *       400: { description: No se enviaron campos válidos }
 *       401: { description: Token inválido o no proporcionado }
 *       403: { description: Requiere rol ADMIN / acceso denegado }
 *       404: { description: Usuario no encontrado en esta empresa }
 */
router.patch('/:idEmpresa/usuarios/:idUsuario', verificarToken, patchUsuarioEmpresa)

/**
 * @swagger
 * /api/empresas-adicion/{idEmpresa}/usuarios/{idUsuario}:
 *   delete:
 *     summary: Eliminar un usuario dentro de una empresa (solo ADMIN, NO puede eliminar ADMIN)
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEmpresa
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuario eliminado }
 *       400: { description: No puedes eliminar tu propio usuario }
 *       401: { description: Token inválido o no proporcionado }
 *       403: { description: Requiere rol ADMIN / no se puede eliminar ADMIN }
 *       404: { description: Usuario no encontrado en esta empresa }
 */
router.delete('/:idEmpresa/usuarios/:idUsuario', verificarToken, eliminarUsuarioEmpresa)

export default router



