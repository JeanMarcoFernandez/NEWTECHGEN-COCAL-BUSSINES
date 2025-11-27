import { Router } from "express";
import { asignarDepartamentoAProyecto, verDepartamentosDelProyecto, agregarMiembro } from "../controllers/proyectosController.js";
import { verificarToken} from "../middleware/verificarToken.js";
import { validarRol } from "../middleware/validarRol.js"; 
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Proyectos
 *   description: Gestión de departamentos y miembros dentro de proyectos.
 */

/**
 * @swagger
 * /api/proyectos/departamento:
 *   put:
 *     summary: Asignar departamento a un proyecto
 *     description: Permite asignar un departamento existente a un proyecto específico.
 *     tags: [Proyectos]
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
 *               - id_departamento
 *             properties:
 *               id_proyecto:
 *                 type: integer
 *                 example: 1
 *               id_departamento:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Departamento asignado al proyecto
 *         content:
 *           application/json:
 *             example:
 *               msg: "Departamento asignado al proyecto"
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/departamento", verificarToken, validarRol("ADMIN", "SUPERVISOR"), asignarDepartamentoAProyecto);
/**
 * @swagger
 * /api/proyectos/departamentos/{id_proyecto}:
 *   get:
 *     summary: Ver departamentos de un proyecto
 *     description: Retorna los departamentos asignados a un proyecto específico.
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_proyecto
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Departamentos encontrados
 *         content:
 *           application/json:
 *             example:
 *               - id: 2
 *                 nombre: "Marketing"
 *                 area: "MARKETING"
 *       500:
 *         description: Error interno del servidor
 */
router.get("/departamentos/:id_proyecto", verificarToken, verDepartamentosDelProyecto);
/**
 * @swagger
 * /api/proyectos/miembro:
 *   post:
 *     summary: Agregar miembro a un proyecto
 *     description: Permite agregar un usuario como miembro de un proyecto con un rol específico.
 *     tags: [Proyectos]
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
 *               rol:
 *                 type: string
 *                 enum: [ADMIN, SUPERVISOR, EMPLEADO]
 *                 example: "EMPLEADO"
 *     responses:
 *       200:
 *         description: Miembro agregado al proyecto
 *         content:
 *           application/json:
 *             example:
 *               msg: "Miembro agregado al proyecto"
 *               miembro:
 *                 id: 10
 *                 id_proyecto: 1
 *                 id_usuario: 5
 *                 rol: "EMPLEADO"
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/miembro", verificarToken, validarRol("ADMIN", "SUPERVISOR"), agregarMiembro);

export default router;
