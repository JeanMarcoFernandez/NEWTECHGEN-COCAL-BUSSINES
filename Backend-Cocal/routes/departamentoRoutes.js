// routes/departamentoRoutes.js
import { Router } from 'express';

import {
  crearDepartamentoController,
  listarDepartamentosPorEmpresaController,
  obtenerDepartamentoController,
  actualizarDepartamentoController,
  eliminarDepartamentoController,
} from '../controllers/departamentoController.js';

import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Departamentos
 *   description: Gestión de departamentos y estructura organizacional
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Departamento:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         id_empresa:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Recursos Humanos"
 *         descripcion:
 *           type: string
 *           example: "Departamento encargado de la gestión del personal."
 *         area:
 *           type: string
 *           example: "RECURSOS_HUMANOS"
 *         visibilidad:
 *           type: string
 *           example: "INTERNO"
 *         creado_en:
 *           type: string
 *           format: date-time
 *           example: "2025-11-25T15:30:00Z"
 */

/**
 * @swagger
 * /api/departamentos:
 *   post:
 *     summary: Crear un departamento (HU-02)
 *     description: |
 *       Crea un nuevo departamento dentro de una empresa.  
 *       Relacionado directamente con HU-02: **Gestión de departamentos y equipos con permisos**.
 *     tags: [Departamentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_empresa, nombre]
 *             properties:
 *               id_empresa:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               area:
 *                 type: string
 *                 description: Debe ser un valor válido del ENUM area_corporativa
 *                 example: "SISTEMAS"
 *               visibilidad:
 *                 type: string
 *                 description: ENUM visibilidad_recurso
 *                 example: "INTERNO"
 *           example:
 *             id_empresa: 1
 *             nombre: "Departamento de Sistemas"
 *             descripcion: "Área responsable de infraestructura y desarrollo."
 *             area: "SISTEMAS"
 *             visibilidad: "INTERNO"
 *     responses:
 *       201:
 *         description: Departamento creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Departamento'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado, requiere rol ADMIN
 *       500:
 *         description: Error al crear el departamento
 */
router.post(
  '/',
  verificarToken,
  validarRol('ADMIN'),
  crearDepartamentoController
);

/**
 * @swagger
 * /api/departamentos/empresa/{idEmpresa}:
 *   get:
 *     summary: Listar departamentos de una empresa (HU-02)
 *     description: Devuelve todos los departamentos pertenecientes a una empresa específica.
 *     tags: [Departamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEmpresa
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     responses:
 *       200:
 *         description: Lista de departamentos de la empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Departamento'
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado, requiere rol ADMIN
 *       404:
 *         description: Empresa no encontrada o sin departamentos registrados
 *       500:
 *         description: Error al listar los departamentos
 */
router.get(
  '/empresa/:idEmpresa',
  verificarToken,
  validarRol('ADMIN'),
  listarDepartamentosPorEmpresaController
);

/**
 * @swagger
 * /api/departamentos/{id}:
 *   get:
 *     summary: Obtener un departamento por ID
 *     tags: [Departamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del departamento
 *     responses:
 *       200:
 *         description: Departamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Departamento'
 *       404:
 *         description: Departamento no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado, requiere rol ADMIN
 *       500:
 *         description: Error al obtener el departamento
 */
router.get(
  '/:id',
  verificarToken,
  validarRol('ADMIN'),
  obtenerDepartamentoController
);

/**
 * @swagger
 * /api/departamentos/{id}:
 *   put:
 *     summary: Actualizar un departamento (HU-02)
 *     tags: [Departamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del departamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Departamento'
 *     responses:
 *       200:
 *         description: Departamento actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Departamento no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado, requiere rol ADMIN
 *       500:
 *         description: Error al actualizar el departamento
 */
router.put(
  '/:id',
  verificarToken,
  validarRol('ADMIN'),
  actualizarDepartamentoController
);

/**
 * @swagger
 * /api/departamentos/{id}:
 *   delete:
 *     summary: Eliminar un departamento
 *     description: |
 *       Elimina un departamento.  
 *       Si tiene dependencias (proyectos, usuarios asociados, etc.), la BD las manejará según las FKs.  
 *       Útil en HU-02 cuando se reestructura la organización.
 *     tags: [Departamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del departamento
 *     responses:
 *       204:
 *         description: Departamento eliminado correctamente
 *       404:
 *         description: Departamento no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado, requiere rol ADMIN
 *       500:
 *         description: Error al eliminar el departamento
 */
router.delete(
  '/:id',
  verificarToken,
  validarRol('ADMIN'),
  eliminarDepartamentoController
);

export default router;
