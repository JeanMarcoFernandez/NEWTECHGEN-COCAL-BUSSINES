import { Router } from "express";
import { elevarRango, rebajarRango, restituirMiembro } from "../controllers/miembrosProyectoController.js";
import { verificarToken } from "../middleware/verificarToken.js";
import { validarRol } from "../middleware/validarRol.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Miembros-Proyecto
 *   description: Gestión de rangos de miembros dentro de proyectos.
 */

/**
 * @swagger
 * /api/miembros-proyecto/elevar:
 *   put:
 *     summary: Elevar rango de miembro
 *     description: Permite aumentar el rol de un miembro dentro de un proyecto.
 *     tags: [Miembros-Proyecto]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_proyecto
 *               - id_usuario
 *               - nuevo_rol
 *             properties:
 *               id_proyecto:
 *                 type: integer
 *                 example: 1
 *               id_usuario:
 *                 type: integer
 *                 example: 5
 *               nuevo_rol:
 *                 type: string
 *                 enum: [ADMIN, SUPERVISOR, EMPLEADO]
 *                 example: "SUPERVISOR"
 *     responses:
 *       200:
 *         description: Rango elevado
 *         content:
 *           application/json:
 *             example:
 *               msg: "Rango elevado"
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/elevar", verificarToken, validarRol("ADMIN", "SUPERVISOR"), elevarRango);
/**
 * @swagger
 * /api/miembros-proyecto/rebajar:
 *   put:
 *     summary: Rebajar rango de miembro
 *     description: Permite disminuir el rol de un miembro dentro de un proyecto.
 *     tags: [Miembros-Proyecto]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_proyecto
 *               - id_usuario
 *               - nuevo_rol
 *             properties:
 *               id_proyecto:
 *                 type: integer
 *                 example: 1
 *               id_usuario:
 *                 type: integer
 *                 example: 5
 *               nuevo_rol:
 *                 type: string
 *                 enum: [ADMIN, SUPERVISOR, EMPLEADO]
 *                 example: "EMPLEADO"
 *     responses:
 *       200:
 *         description: Rango rebajado
 *         content:
 *           application/json:
 *             example:
 *               msg: "Rango rebajado"
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/rebajar", verificarToken, validarRol("ADMIN", "SUPERVISOR"), rebajarRango);
/**
 * @swagger
 * /api/miembros-proyecto/restituir:
 *   put:
 *     summary: Restituir miembro
 *     description: Permite restituir un miembro a su estado activo inicial dentro del proyecto.
 *     tags: [Miembros-Proyecto]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_proyecto
 *               - id_usuario
 *             properties:
 *               id_proyecto:
 *                 type: integer
 *                 example: 1
 *               id_usuario:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Miembro restituido
 *         content:
 *           application/json:
 *             example:
 *               msg: "Miembro restituido"
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/restituir", verificarToken, validarRol("ADMIN", "SUPERVISOR"), restituirMiembro);

export default router;
