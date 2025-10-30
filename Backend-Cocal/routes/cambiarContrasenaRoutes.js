import { Router } from 'express';
import { cambiarContrasenaPrimerLogin } from '../controllers/cambiarContrasenaController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación - Cambio de Contraseña
 *   description: Endpoints relacionados con el cambio de contraseña durante el primer inicio de sesión.
 */

/**
 * @swagger
 * /api/auth/primer-login:
 *   post:
 *     summary: Cambiar contraseña en el primer inicio de sesión
 *     description: Permite a los usuarios creados por un administrador actualizar su contraseña obligatoriamente antes de ingresar al sistema.
 *     tags: [Autenticación - Cambio de Contraseña]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - nuevaContrasena
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: nuevo.empleado@empresa.com
 *               nuevaContrasena:
 *                 type: string
 *                 example: "MiNuevaContraseñaSegura2025!"
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Contraseña actualizada correctamente. Ya puede iniciar sesión normalmente."
 *       400:
 *         description: El usuario ya actualizó su contraseña o datos inválidos
 *         content:
 *           application/json:
 *             examples:
 *               yaActualizo:
 *                 summary: Ya actualizó su contraseña
 *                 value:
 *                   message: "Este usuario ya actualizó su contraseña."
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Usuario no encontrado."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al cambiar la contraseña."
 *               error: "Detalle del error interno"
 */

router.post('/primer-login', cambiarContrasenaPrimerLogin);

export default router;
