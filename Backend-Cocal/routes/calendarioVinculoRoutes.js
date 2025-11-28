// routes/calendarioVinculoRoutes.js
import { Router } from 'express';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

import {
  crearCalendarioVinculoController,
  listarVinculosPorProyectoController,
  listarVinculosDesdeController,
  listarVinculosHaciaController,
  eliminarVinculoPorIdController,
  eliminarVinculoUnicoController,
} from '../controllers/calendarioVinculoController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: CalendarioVinculos
 *   description: Gestión de vínculos entre calendarios de usuario, departamento y empresa
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoCalendario:
 *       type: string
 *       enum: [USUARIO, DEPARTAMENTO, EMPRESA]
 *       description: Tipo de calendario involucrado en el vínculo
 *
 *     CalendarioVinculo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         id_proyecto:
 *           type: integer
 *           description: ID del proyecto donde existe el vínculo
 *         origen_tipo:
 *           $ref: '#/components/schemas/TipoCalendario'
 *         origen_id:
 *           type: integer
 *         destino_tipo:
 *           $ref: '#/components/schemas/TipoCalendario'
 *         destino_id:
 *           type: integer
 *         permiso:
 *           type: string
 *           enum: [LECTURA, EDICION, ADMIN]
 *         creado_en:
 *           type: string
 *           format: date-time
 *
 *     CrearCalendarioVinculoInput:
 *       type: object
 *       required:
 *         - id_proyecto
 *         - origen_tipo
 *         - origen_id
 *         - destino_tipo
 *         - destino_id
 *       properties:
 *         id_proyecto:
 *           type: integer
 *           example: 10
 *         origen_tipo:
 *           $ref: '#/components/schemas/TipoCalendario'
 *         origen_id:
 *           type: integer
 *           example: 5
 *         destino_tipo:
 *           $ref: '#/components/schemas/TipoCalendario'
 *         destino_id:
 *           type: integer
 *           example: 2
 *         permiso:
 *           type: string
 *           enum: [LECTURA, EDICION, ADMIN]
 *           example: LECTURA
 *
 *     EliminarVinculoUnicoInput:
 *       type: object
 *       required:
 *         - id_proyecto
 *         - origen_tipo
 *         - origen_id
 *         - destino_tipo
 *         - destino_id
 *       properties:
 *         id_proyecto:
 *           type: integer
 *         origen_tipo:
 *           $ref: '#/components/schemas/TipoCalendario'
 *         origen_id:
 *           type: integer
 *         destino_tipo:
 *           $ref: '#/components/schemas/TipoCalendario'
 *         destino_id:
 *           type: integer
 */

/**
 * @swagger
 * /api/calendarios/vinculos:
 *   post:
 *     summary: Crear vínculo entre calendarios (usuario, departamento o empresa)
 *     description: Crea un vínculo entre dos calendarios (origen → destino) dentro de un proyecto. Solo ADMIN o SUPERVISOR pueden crear vínculos globales.
 *     tags: [CalendarioVinculos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearCalendarioVinculoInput'
 *     responses:
 *       201:
 *         description: Vínculo creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalendarioVinculo'
 *       400:
 *         description: Datos inválidos o conflicto de vínculo
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: Acceso denegado, requiere rol ADMIN o SUPERVISOR
 */
router.post(
  '/',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  crearCalendarioVinculoController,
);

/**
 * @swagger
 * /api/calendarios/vinculos/proyecto/{idProyecto}:
 *   get:
 *     summary: Listar vínculos de un proyecto
 *     description: Devuelve todos los vínculos de calendarios existentes dentro de un proyecto.
 *     tags: [CalendarioVinculos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idProyecto
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Lista de vínculos del proyecto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarioVinculo'
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: Acceso denegado, requiere rol ADMIN o SUPERVISOR
 */
router.get(
  '/proyecto/:idProyecto',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  listarVinculosPorProyectoController,
);

/**
 * @swagger
 * /api/calendarios/vinculos/origen:
 *   get:
 *     summary: Listar vínculos donde un calendario es ORIGEN
 *     description: Permite obtener todos los vínculos donde un calendario (usuario, departamento o empresa) actúa como origen.
 *     tags: [CalendarioVinculos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: origen_tipo
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/TipoCalendario'
 *         description: Tipo de calendario origen (USUARIO, DEPARTAMENTO, EMPRESA)
 *       - in: query
 *         name: origen_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del calendario origen
 *       - in: query
 *         name: id_proyecto
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtrar por proyecto específico (opcional)
 *     responses:
 *       200:
 *         description: Lista de vínculos donde el calendario actúa como origen
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarioVinculo'
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: Token inválido o ausente
 */
router.get(
  '/origen',
  verificarToken,
  listarVinculosDesdeController,
);

/**
 * @swagger
 * /api/calendarios/vinculos/destino:
 *   get:
 *     summary: Listar vínculos donde un calendario es DESTINO
 *     description: Permite obtener todos los vínculos donde un calendario (usuario, departamento o empresa) actúa como destino.
 *     tags: [CalendarioVinculos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: destino_tipo
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/TipoCalendario'
 *         description: Tipo de calendario destino (USUARIO, DEPARTAMENTO, EMPRESA)
 *       - in: query
 *         name: destino_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del calendario destino
 *       - in: query
 *         name: id_proyecto
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtrar por proyecto específico (opcional)
 *     responses:
 *       200:
 *         description: Lista de vínculos donde el calendario actúa como destino
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarioVinculo'
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: Token inválido o ausente
 */
router.get(
  '/destino',
  verificarToken,
  listarVinculosHaciaController,
);

/**
 * @swagger
 * /api/calendarios/vinculos/{id}:
 *   delete:
 *     summary: Eliminar vínculo por ID
 *     description: Elimina un vínculo específico usando su ID. Solo ADMIN o SUPERVISOR.
 *     tags: [CalendarioVinculos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vínculo
 *     responses:
 *       204:
 *         description: Vínculo eliminado correctamente (sin contenido)
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: Acceso denegado, requiere rol ADMIN o SUPERVISOR
 *       404:
 *         description: Vínculo no encontrado
 */
router.delete(
  '/:id',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  eliminarVinculoPorIdController,
);

/**
 * @swagger
 * /api/calendarios/vinculos:
 *   delete:
 *     summary: Eliminar vínculo usando la combinación única (proyecto + origen + destino)
 *     description: Elimina un vínculo a partir de la combinación única de proyecto, calendario origen y calendario destino.
 *     tags: [CalendarioVinculos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EliminarVinculoUnicoInput'
 *     responses:
 *       204:
 *         description: Vínculo eliminado correctamente (sin contenido)
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: Acceso denegado, requiere rol ADMIN o SUPERVISOR
 *       404:
 *         description: Vínculo no encontrado
 */
router.delete(
  '/',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  eliminarVinculoUnicoController,
);

export default router;
