// routes/recursoRoutes.js
import { Router } from 'express';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

import {
  crearRecursoController,
  listarRecursosController,
  obtenerRecursoController,
  cambiarEstadoMantenimientoController,
  recursosDisponiblesController
} from '../controllers/recursoController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: HU-04
 *     description: Sistema de asignación de recursos y disponibilidad
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RecursoInput:
 *       type: object
 *       properties:
 *         id_departamento:
 *           type: integer
 *           example: 3
 *         nombre:
 *           type: string
 *           example: "Sala de reuniones principal"
 *         descripcion:
 *           type: string
 *           example: "Sala con TV y mesa para 8 personas"
 *         tipo:
 *           type: string
 *           description: Valor del enum tipo_recurso
 *           example: "SALA_REUNIONES"
 *         ubicacion:
 *           type: string
 *           example: "Piso 3, ala norte"
 *         capacidad:
 *           type: integer
 *           example: 8
 *         visibilidad:
 *           type: string
 *           example: "INTERNO"
 *         tiempo_max_reserva:
 *           type: integer
 *           description: Minutos máximos por reserva
 *           example: 120
 *     Recurso:
 *       allOf:
 *         - $ref: '#/components/schemas/RecursoInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 10
 *             id_empresa:
 *               type: integer
 *               example: 1
 *             en_mantenimiento:
 *               type: boolean
 *               example: false
 *             creado_en:
 *               type: string
 *               format: date-time
 */

/**
 * @swagger
 * /api/recursos:
 *   post:
 *     summary: Crear recurso corporativo
 *     description: >
 *       Crea un recurso (sala, equipo, vehículo, etc.) asociado a la empresa del usuario autenticado.  
 *       **HU-04** – Sistema de asignación de recursos y disponibilidad.
 *     tags: [HU-04]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecursoInput'
 *     responses:
 *       201:
 *         description: Recurso creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recurso'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */
router.post(
  '/',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  crearRecursoController
);

/**
 * @swagger
 * /api/recursos:
 *   get:
 *     summary: Listar recursos de la empresa
 *     description: >
 *       Lista recursos filtrando por tipo, departamento, visibilidad o mantenimiento.  
 *       **HU-04** – ver qué recursos hay disponibles en la empresa.
 *     tags: [HU-04]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         description: Valor del enum tipo_recurso
 *       - in: query
 *         name: id_departamento
 *         schema:
 *           type: integer
 *       - in: query
 *         name: visibilidad
 *         schema:
 *           type: string
 *           example: "INTERNO"
 *       - in: query
 *         name: en_mantenimiento
 *         schema:
 *           type: boolean
 *           example: false
 *     responses:
 *       200:
 *         description: Lista de recursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recurso'
 *       401:
 *         description: No autenticado
 */
router.get(
  '/',
  verificarToken,
  listarRecursosController
);
/**
 * @swagger
 * /api/recursos/disponibles:
 *   get:
 *     summary: Consultar recursos disponibles en un rango de tiempo
 *     description: >
 *       Devuelve qué recursos están disponibles y cuáles tienen conflictos en el rango dado.  
 *       **HU-04** – criterios 1, 3 (disponibilidad y sugerencias).
 *     tags: [HU-04]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: fecha_fin
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de recurso
 *       - in: query
 *         name: capacidad_minima
 *         schema:
 *           type: integer
 *       - in: query
 *         name: id_departamento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recursos disponibles y ocupados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 disponibles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recurso'
 *                 ocupados:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       recurso:
 *                         $ref: '#/components/schemas/Recurso'
 *                       reservas_conflictivas:
 *                         type: array
 *                         items:
 *                           type: object
 *       400:
 *         description: Falta fecha_inicio o fecha_fin
 *       401:
 *         description: No autenticado
 */
router.get(
  '/disponibles',
  verificarToken,
  recursosDisponiblesController
);

/**
 * @swagger
 * /api/recursos/{id}:
 *   get:
 *     summary: Obtener recurso por ID
 *     description: Devuelve la información de un recurso de la empresa del usuario.
 *     tags: [HU-04]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recurso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recurso'
 *       404:
 *         description: Recurso no encontrado
 *       401:
 *         description: No autenticado
 */
router.get(
  '/:id',
  verificarToken,
  obtenerRecursoController
);

/**
 * @swagger
 * /api/recursos/{id}/mantenimiento:
 *   put:
 *     summary: Cambiar estado de mantenimiento de un recurso
 *     description: >
 *       Permite marcar o desmarcar un recurso como en mantenimiento.  
 *       Relacionado con HU-04 (criterio 6) y HU-016.
 *     tags: [HU-04]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               en_mantenimiento:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Recurso actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recurso'
 *       400:
 *         description: Petición inválida
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Recurso no encontrado
 */
router.put(
  '/:id/mantenimiento',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  cambiarEstadoMantenimientoController
);


export default router;
