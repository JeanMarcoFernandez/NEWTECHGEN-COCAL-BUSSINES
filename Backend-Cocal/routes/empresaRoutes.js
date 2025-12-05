// routes/empresaRoutes.js
import { Router } from 'express';
import {
  crearEmpresaController,
  listarEmpresasController,
  obtenerEmpresaController,
  actualizarEmpresaController,
  eliminarEmpresaController,
} from '../controllers/empresaController.js';

import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Empresas
 *   description: Gestión de empresas en el sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Empresa:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "New Tech Gen S.R.L."
 *         nit:
 *           type: string
 *           example: "1234567011"
 *         rubro:
 *           type: string
 *           example: "Tecnología y servicios"
 *         direccion:
 *           type: string
 *           example: "Av. Busch #123, La Paz"
 *         telefono:
 *           type: string
 *           example: "76543210"
 *         sitio_web:
 *           type: string
 *           example: "https://newtechgen.com"
 */

/**
 * @swagger
 * /api/empresas:
 *   post:
 *     summary: Crear una empresa
 *     description: Crea una nueva empresa base del sistema. Solo ADMIN. Relacionado con HU-01 (estructura organizacional para roles y JWT).
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *               nit:
 *                 type: string
 *               rubro:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *               sitio_web:
 *                 type: string
 *           example:
 *             nombre: "New Tech Gen S.R.L."
 *             nit: "1234567011"
 *             rubro: "Tecnología y servicios"
 *             direccion: "Av. Busch #123, La Paz"
 *             telefono: "76543210"
 *             sitio_web: "https://newtechgen.com"
 *     responses:
 *       201:
 *         description: Empresa creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empresa'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado (se requiere rol ADMIN)
 *       500:
 *         description: Error al crear la empresa
 */
router.post(
  '/',crearEmpresaController
);

/**
 * @swagger
 * /api/empresas:
 *   get:
 *     summary: Listar empresas
 *     description: Devuelve todas las empresas registradas. Solo ADMIN.
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresa'
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado (se requiere rol ADMIN)
 *       500:
 *         description: Error al obtener las empresas
 */
router.get(
  '/',
  verificarToken,
  validarRol('ADMIN'),
  listarEmpresasController
);

/**
 * @swagger
 * /api/empresas/{id}:
 *   get:
 *     summary: Obtener una empresa por ID
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empresa'
 *       404:
 *         description: Empresa no encontrada
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado (se requiere rol ADMIN)
 *       500:
 *         description: Error al obtener la empresa
 */
router.get(
  '/:id',
  verificarToken,
  validarRol('ADMIN'),
  obtenerEmpresaController
);

/**
 * @swagger
 * /api/empresas/{id}:
 *   put:
 *     summary: Actualizar una empresa
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empresa'
 *     responses:
 *       200:
 *         description: Empresa actualizada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Empresa no encontrada
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado (se requiere rol ADMIN)
 *       500:
 *         description: Error al actualizar la empresa
 */
router.put(
  '/:id',
  verificarToken,
  validarRol('ADMIN'),
  actualizarEmpresaController
);

/**
 * @swagger
 * /api/empresas/{id}:
 *   delete:
 *     summary: Eliminar una empresa
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     responses:
 *       204:
 *         description: Empresa eliminada correctamente
 *       404:
 *         description: Empresa no encontrada
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado (se requiere rol ADMIN)
 *       500:
 *         description: Error al eliminar la empresa
 */
router.delete(
  '/:id',
  verificarToken,
  validarRol('ADMIN'),
  eliminarEmpresaController
);

export default router;
