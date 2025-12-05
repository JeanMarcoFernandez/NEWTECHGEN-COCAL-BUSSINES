import { Router } from "express";
import { usuariosPorDepartamento, usuariosConDepartamento } from "../controllers/usuariosMiembrosController.js";
import { verificarToken } from "../middleware/verificarToken.js";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Usuarios-Miembros
 *   description: Gestión de usuarios con información de departamento y empresa.
 */

/**
 * @swagger
 * /api/usuarios-miembros/departamento/{id_departamento}:
 *   get:
 *     summary: Listar usuarios por departamento
 *     description: Retorna todos los usuarios que pertenecen a un departamento específico.
 *     tags: [Usuarios-Miembros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_departamento
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Usuarios encontrados
 *         content:
 *           application/json:
 *             example:
 *               - id: 5
 *                 nombre: "Juan"
 *                 apellido: "Pérez"
 *                 correo: "juan@empresa.com"
 *                 cargo: "Analista"
 *                 rol: "EMPLEADO"
 *                 estado: "ACTIVO"
 *                 empresa: { id: 1, nombre: "Empresa X" }
 *                 departamento: { id: 2, nombre: "Marketing" }
 *       500:
 *         description: Error interno del servidor
 */
router.get("/departamento/:id_departamento", verificarToken, usuariosPorDepartamento);
/**
 * @swagger
 * /api/usuarios-miembros/con-departamento:
 *   get:
 *     summary: Listar todos los usuarios con departamento y empresa
 *     description: Retorna todos los usuarios con su empresa y departamento asignados.
 *     tags: [Usuarios-Empresa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuarios encontrados
 *         content:
 *           application/json:
 *             example:
 *               - id: 5
 *                 nombre: "Juan"
 *                 apellido: "Pérez"
 *                 correo: "juan@empresa.com"
 *                 cargo: "Analista"
 *                 rol: "EMPLEADO"
 *                 estado: "ACTIVO"
 *                 empresa: { id: 1, nombre: "Empresa X" }
 *                 departamento: { id: 2, nombre: "Marketing" }
 *       500:
 *         description: Error interno del servidor
 */
router.get("/con-departamento", verificarToken, usuariosConDepartamento);

export default router;
