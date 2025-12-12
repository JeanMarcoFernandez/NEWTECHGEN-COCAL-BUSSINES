import { Router } from 'express'
import { listarUsuarios } from '../controllers/usuariosController.js'
import { verificarToken } from '../middleware/verificarToken.js'
import { validarRol } from '../middleware/validarRol.js'

const router = Router()

/**
 * @swagger
 * /api/usuarios-actualizado:
 *   get:
 *     summary: Listar todos los usuarios del sistema
 *     description: |
 *       Devuelve la lista completa de usuarios registrados en el sistema.
 *
 *       🔒 Seguridad:
 *       - Requiere token JWT
 *       - Requiere rol ADMIN
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   id_empresa:
 *                     type: integer
 *                   id_departamento:
 *                     type: integer
 *                     nullable: true
 *                   correo:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   apellido:
 *                     type: string
 *                   cargo:
 *                     type: string
 *                   rol:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   telefono:
 *                     type: string
 *                   fecha_ingreso:
 *                     type: string
 *                     format: date
 *                   creado_en:
 *                     type: string
 *                     format: date-time
 *                   actualizado_en:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado, requiere rol ADMIN
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', verificarToken, validarRol('ADMIN'), listarUsuarios)

export default router
