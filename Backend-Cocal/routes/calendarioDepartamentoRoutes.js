// routes/calendarioDepartamentoRoutes.js
import { Router } from 'express';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

import {
  crearCalendarioDepartamentoController,
  listarCalendariosPorProyectoController,
  listarCalendariosPorDepartamentoController,
  actualizarCalendarioDepartamentoController,
  eliminarCalendarioDepartamentoController,
  crearEventoDepartamentoController,
  listarEventosCalendarioDepartamentoController,
  actualizarEventoDepartamentoController,
  eliminarEventoDepartamentoController,
  agregarParticipantesEventoDepartamentoController,
  actualizarEstadoParticipacionDepartamentoController,
} from '../controllers/calendarioDepartamentoController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: CalendariosDepartamento
 *   description: Gestión de calendarios a nivel departamento dentro de proyectos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CalendarioDepartamento:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         id_proyecto:
 *           type: integer
 *         id_departamento:
 *           type: integer
 *         nombre:
 *           type: string
 *         descripcion:
 *           type: string
 *         zona_horaria:
 *           type: string
 *         creado_por:
 *           type: integer
 *         creado_en:
 *           type: string
 *           format: date-time
 *     EventoDepartamento:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         id_calendario_grupo:
 *           type: integer
 *         titulo:
 *           type: string
 *         descripcion:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [REUNION, CAPACITACION, PROYECTO, REVISION]
 *         fecha_inicio:
 *           type: string
 *           format: date-time
 *         fecha_fin:
 *           type: string
 *           format: date-time
 *         responsable:
 *           type: integer
 *         estado:
 *           type: string
 *           enum: [PROGRAMADO, EN_CURSO, FINALIZADO, CANCELADO]
 *         visibilidad:
 *           type: string
 *           enum: [PRIVADO, INTERNO, PUBLICO]
 *     ParticipacionEventoDepartamento:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         id_evento_departamento:
 *           type: integer
 *         id_usuario:
 *           type: integer
 *         estado:
 *           type: string
 *           enum: [CONFIRMADA, PENDIENTE, RECHAZADA]
 */

// Calendarios de departamento (ADMIN / SUPERVISOR)
/**
 * @swagger
 * /api/calendarios/departamento:
 *   post:
 *     summary: Crear calendario de departamento
 *     tags: [CalendariosDepartamento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_proyecto:
 *                 type: integer
 *               id_departamento:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               zona_horaria:
 *                 type: string
 *     responses:
 *       201:
 *         description: Calendario de departamento creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalendarioDepartamento'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ADMIN / SUPERVISOR)
 */
router.post(
  '/',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  crearCalendarioDepartamentoController,
);

/**
 * @swagger
 * /api/calendarios/departamento/proyecto/{idProyecto}:
 *   get:
 *     summary: Listar calendarios de departamento por proyecto
 *     tags: [CalendariosDepartamento]
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
 *         description: Lista de calendarios de departamento del proyecto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarioDepartamento'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ADMIN / SUPERVISOR)
 */
router.get(
  '/proyecto/:idProyecto',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  listarCalendariosPorProyectoController,
);

/**
 * @swagger
 * /api/calendarios/departamento/departamento/{idDepartamento}:
 *   get:
 *     summary: Listar calendarios de un departamento
 *     tags: [CalendariosDepartamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idDepartamento
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del departamento
 *     responses:
 *       200:
 *         description: Lista de calendarios asociados al departamento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarioDepartamento'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ADMIN / SUPERVISOR)
 */
router.get(
  '/departamento/:idDepartamento',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  listarCalendariosPorDepartamentoController,
);

/**
 * @swagger
 * /api/calendarios/departamento/{idCalendario}:
 *   patch:
 *     summary: Actualizar calendario de departamento
 *     description: Permite actualizar uno, varios o todos los campos del calendario.
 *     tags: [CalendariosDepartamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCalendario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del calendario de departamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               zona_horaria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Calendario actualizado correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ADMIN / SUPERVISOR)
 */
router.patch(
  '/:idCalendario',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  actualizarCalendarioDepartamentoController,
);

/**
 * @swagger
 * /api/calendarios/departamento/{idCalendario}:
 *   delete:
 *     summary: Eliminar calendario de departamento
 *     tags: [CalendariosDepartamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCalendario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del calendario de departamento
 *     responses:
 *       204:
 *         description: Calendario eliminado correctamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ADMIN / SUPERVISOR)
 */
router.delete(
  '/:idCalendario',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  eliminarCalendarioDepartamentoController,
);

/**
 * @swagger
 * /api/calendarios/departamento/{idCalendario}/eventos:
 *   post:
 *     summary: Crear evento en calendario de departamento
 *     tags: [CalendariosDepartamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCalendario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del calendario de departamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               tipo:
 *                 type: string
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *               responsable:
 *                 type: integer
 *               estado:
 *                 type: string
 *               visibilidad:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evento creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventoDepartamento'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ADMIN / SUPERVISOR)
 */
router.post(
  '/:idCalendario/eventos',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  crearEventoDepartamentoController,
);

/**
 * @swagger
 * /api/calendarios/departamento/{idCalendario}/eventos:
 *   get:
 *     summary: Listar eventos de un calendario de departamento
 *     tags: [CalendariosDepartamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCalendario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del calendario de departamento
 *     responses:
 *       200:
 *         description: Lista de eventos del calendario de departamento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventoDepartamento'
 *       401:
 *         description: No autenticado
 */
router.get(
  '/:idCalendario/eventos',
  verificarToken,
  listarEventosCalendarioDepartamentoController,
);

/**
 * @swagger
 * /api/calendarios/departamento/eventos/{idEvento}:
 *   patch:
 *     summary: Actualizar parcialmente un evento de departamento
 *     tags: [CalendariosDepartamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento de departamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               tipo:
 *                 type: string
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *               responsable:
 *                 type: integer
 *               estado:
 *                 type: string
 *               visibilidad:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evento actualizado correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ADMIN / SUPERVISOR)
 *       404:
 *         description: Evento no encontrado
 */
router.patch(
  '/eventos/:idEvento',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  actualizarEventoDepartamentoController,
);

/**
 * @swagger
 * /api/calendarios/departamento/eventos/{idEvento}:
 *   delete:
 *     summary: Eliminar evento de departamento
 *     tags: [CalendariosDepartamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento de departamento
 *     responses:
 *       204:
 *         description: Evento eliminado correctamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ADMIN / SUPERVISOR)
 *       404:
 *         description: Evento no encontrado
 */
router.delete(
  '/eventos/:idEvento',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  eliminarEventoDepartamentoController,
);

/**
 * @swagger
 * /api/calendarios/departamento/eventos/{idEvento}/participantes:
 *   post:
 *     summary: Agregar participantes a un evento de departamento
 *     tags: [CalendariosDepartamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento de departamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participantes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_usuario:
 *                       type: integer
 *                     estado:
 *                       type: string
 *                       enum: [CONFIRMADA, PENDIENTE, RECHAZADA]
 *               id_usuario:
 *                 type: integer
 *               estado:
 *                 type: string
 *     responses:
 *       201:
 *         description: Participantes agregados correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ADMIN / SUPERVISOR)
 */
router.post(
  '/eventos/:idEvento/participantes',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  agregarParticipantesEventoDepartamentoController,
);

/**
 * @swagger
 * /api/calendarios/departamento/eventos/{idEvento}/participantes/{usuarioId}:
 *   patch:
 *     summary: Actualizar estado de participación en evento de departamento
 *     tags: [CalendariosDepartamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento de departamento
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario participante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [CONFIRMADA, PENDIENTE, RECHAZADA]
 *     responses:
 *       200:
 *         description: Estado de participación actualizado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.patch(
  '/eventos/:idEvento/participantes/:usuarioId',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  actualizarEstadoParticipacionDepartamentoController,
);

export default router;
