import { Router } from "express";
import { enviarCodigo2FA, verificarCodigo2FA } from "../controllers/twoFactorController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Verificación 2FA
 *   description: Endpoints para el sistema de autenticación en dos pasos (Two-Factor Authentication).
 */

/**
 * @swagger
 * /api/auth/enviar-2fa:
 *   post:
 *     summary: Enviar código de verificación 2FA al correo del usuario
 *     description: 
 *       Genera un código de 6 dígitos, lo guarda temporalmente en la base de datos y lo envía por correo electrónico.  
 *       Este endpoint normalmente se ejecuta automáticamente después del login exitoso.
 *     tags: [Verificación 2FA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - correo
 *               - nombre
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 example: 12
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "usuario@correo.com"
 *               nombre:
 *                 type: string
 *                 example: "Jean"
 *     responses:
 *       200:
 *         description: Código 2FA enviado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Código 2FA enviado correctamente."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al enviar código 2FA"
 *               error: "Detalle del error interno"
 */
router.post("/enviar-2fa", enviarCodigo2FA);

/**
 * @swagger
 * /api/auth/verificar-2fa:
 *   post:
 *     summary: Verificar código 2FA y generar token JWT
 *     description:
 *       Verifica si el código ingresado es correcto, no ha expirado y no fue usado.  
 *       Si la verificación es exitosa, genera un token JWT y devuelve la información del usuario autenticado.
 *     tags: [Verificación 2FA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - codigo
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "usuario@correo.com"
 *               codigo:
 *                 type: string
 *                 example: "481292"
 *     responses:
 *       200:
 *         description: Verificación exitosa, se devuelve el token JWT
 *         content:
 *           application/json:
 *             example:
 *               message: "Verificación 2FA exitosa."
 *               token: "JWT_GENERADO_AQUI"
 *               usuario:
 *                 id: 12
 *                 nombre: "Jean"
 *                 rol: "ADMIN"
 *       400:
 *         description: Código inválido, expirado o ya usado
 *         content:
 *           application/json:
 *             examples:
 *               codigoInvalido:
 *                 summary: Código incorrecto
 *                 value:
 *                   message: "Código inválido o ya usado."
 *               codigoExpirado:
 *                 summary: Código expirado
 *                 value:
 *                   message: "El código ha expirado."
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
 *               message: "Error al verificar código 2FA"
 *               error: "Detalle del error interno"
 */
router.post("/verificar-2fa", verificarCodigo2FA);

export default router;
