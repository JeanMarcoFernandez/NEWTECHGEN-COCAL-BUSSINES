import { Router } from 'express';
import { listarUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario } from '../controllers/usuariosControlador.js';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para la gestión de usuarios dentro del sistema
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos los usuarios
 *     description: Devuelve una lista completa de usuarios registrados en el sistema. Solo accesible para administradores.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *       401:
 *         description: Token inválido o expirado
 *       403:
 *         description: Acceso denegado, requiere rol ADMIN
 *       500:
 *         description: Error al listar los usuarios
 */
router.get('/', verificarToken, validarRol('ADMIN'), listarUsuarios);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     description: Devuelve la información de un usuario específico según su ID.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a obtener
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error al obtener el usuario
 */
router.get('/:id', verificarToken, obtenerUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza la información de un usuario
 *     description: Permite modificar los datos personales, rol o estado de un usuario. Solo accesible para el propio usuario o administradores.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Marco
 *               apellido:
 *                 type: string
 *                 example: Silva
 *               rol:
 *                 type: string
 *                 example: SUPERVISOR
 *               estado:
 *                 type: string
 *                 example: ACTIVO
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error al actualizar el usuario
 */
router.put('/:id', verificarToken, actualizarUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     description: Elimina un usuario de la base de datos. Solo accesible para administradores.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       401:
 *         description: Token inválido o expirado
 *       403:
 *         description: Acceso denegado, requiere rol ADMIN
 *       500:
 *         description: Error al eliminar el usuario
 */
router.delete('/:id', verificarToken, validarRol('ADMIN'), eliminarUsuario);

export default router;
