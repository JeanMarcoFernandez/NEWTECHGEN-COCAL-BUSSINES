import { Router } from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para el registro e inicio de sesión de usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Crea un nuevo usuario en el sistema y encripta su contraseña antes de almacenarla.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 example: usuario@correo.com
 *               contrasena:
 *                 type: string
 *                 example: 123456
 *               nombre:
 *                 type: string
 *                 example: Jean
 *               apellido:
 *                 type: string
 *                 example: Fernandez
 *               rol:
 *                 type: string
 *                 example: EMPLEADO
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: El correo ya está registrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/register', registrarUsuario);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     description: Verifica las credenciales del usuario y devuelve un token JWT válido si son correctas.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 example: usuario@correo.com
 *               contrasena:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve un token JWT
 *       400:
 *         description: Credenciales inválidas
 *       401:
 *         description: Contraseña incorrecta
 *       500:
 *         description: Error interno del servidor
 */
router.post('/login', loginUsuario);

export default router;
