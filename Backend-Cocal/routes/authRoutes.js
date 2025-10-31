import { Router } from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para registro e inicio de sesión de usuarios.
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registro de nuevo usuario
 *     description: Crea un nuevo usuario en el sistema con su contraseña cifrada mediante bcrypt. Solo para usuarios normales, no administradores.
 *     tags: [Autenticación]
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
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "usuario@correo.com"
 *               contrasena:
 *                 type: string
 *                 example: "Password123!"
 *               nombre:
 *                 type: string
 *                 example: "Jean"
 *               apellido:
 *                 type: string
 *                 example: "Fernandez"
 *               cargo:
 *                 type: string
 *                 example: "Gerente"
 *               rol:
 *                 type: string
 *                 enum: [ADMIN, CLIENTE]
 *                 example: "EMPLEADO"
 *               telefono:
 *                 type: string
 *                 example: "78123457"
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Usuario registrado correctamente"
 *       400:
 *         description: El correo ya está registrado
 *         content:
 *           application/json:
 *             example:
 *               message: "El correo ya está registrado."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al registrar usuario"
 *               error: "Detalle del error interno"
 */
router.post('/register', registrarUsuario);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicio de sesión de usuario
 *     description: Valida las credenciales del usuario. Si las credenciales son correctas, genera un token JWT. Incluye protección contra ataques de fuerza bruta y bloqueo temporal.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contrasena
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "usuario@correo.com"
 *               contrasena:
 *                 type: string
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso o aviso de cambio de contraseña obligatorio
 *         content:
 *           application/json:
 *             examples:
 *               loginExitoso:
 *                 summary: Sesión iniciada correctamente
 *                 value:
 *                   message: "Inicio de sesión exitoso"
 *                   token: "JWT_GENERADO_AQUI"
 *                   usuario:
 *                     id: 5
 *                     nombre: "Jean"
 *                     rol: "EMPLEADO"
 *               primerLogin:
 *                 summary: Primer inicio de sesión, requiere cambio de contraseña
 *                 value:
 *                   message: "Debe cambiar su contraseña antes de continuar."
 *                   requerirCambio: true
 *       400:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             example:
 *               message: "Credenciales inválidas."
 *       401:
 *         description: Contraseña incorrecta o intentos fallidos restantes
 *         content:
 *           application/json:
 *             examples:
 *               contrasenaIncorrecta:
 *                 summary: Contraseña incorrecta
 *                 value:
 *                   message: "Contraseña incorrecta."
 *                   intentos_restantes: 3
 *               cuentaBloqueada:
 *                 summary: Cuenta bloqueada temporalmente
 *                 value:
 *                   message: "Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos."
 *       403:
 *         description: Cuenta actualmente bloqueada
 *         content:
 *           application/json:
 *             example:
 *               message: "Cuenta bloqueada hasta 2025-10-30 14:35:00."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al iniciar sesión"
 *               error: "Detalle del error interno"
 */
router.post('/login', loginUsuario);

export default router;
