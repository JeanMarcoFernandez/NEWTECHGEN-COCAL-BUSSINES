import { Router } from 'express';
import { crearUsuarioPorAdmin } from '../controllers/usuariosAdminController.js';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios (Administrador)
 *   description: Endpoints exclusivos para la creación de usuarios por parte del administrador.
 */

/**
 * @swagger
 * /api/admin/usuarios/crear:
 *   post:
 *     summary: Crear un nuevo usuario por un administrador
 *     description: Permite al administrador registrar un nuevo usuario dentro de la empresa. El usuario creado deberá cambiar su contraseña en su primer inicio de sesión.
 *     tags: [Usuarios (Administrador)]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contrasena
 *               - nombre
 *               - apellido
 *               - cargo
 *               - id_empresa
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: empleado@empresa.com
 *               contrasena:
 *                 type: string
 *                 example: "Password123!"
 *               nombre:
 *                 type: string
 *                 example: "Juan"
 *               apellido:
 *                 type: string
 *                 example: "Pérez"
 *               cargo:
 *                 type: string
 *                 example: "Analista de sistemas"
 *               rol:
 *                 type: string
 *                 enum: [ADMIN, CLIENTE]
 *                 example: "EMPLEADO"
 *               id_empresa:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Usuario creado correctamente. Debe cambiar su contraseña en su primer inicio de sesión."
 *       400:
 *         description: Ya existe un usuario con ese correo
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Ya existe un usuario con ese correo."
 *       403:
 *         description: El usuario autenticado no tiene permisos de administrador
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "No tiene permisos para crear usuarios."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Error al crear usuario por administrador"
 */

router.post('/crear', verificarToken, validarRol('ADMIN'), crearUsuarioPorAdmin);

export default router;
