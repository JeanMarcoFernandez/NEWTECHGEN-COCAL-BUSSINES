// routes/calendarioEmpresaRoutes.js
import { Router } from 'express';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

import {
  crearCalendarioEmpresaController,
  listarCalendariosEmpresaProyectoController,
  crearEventoEmpresaController,
  listarEventosCalendarioEmpresaController,
  actualizarEventoEmpresaController,
  eliminarEventoEmpresaController,
} from '../controllers/calendarioEmpresaController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: CalendariosEmpresa
 *   description: Gestión de calendarios corporativos a nivel empresa dentro de un proyecto
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CalendarioEmpresa:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         id_proyecto:
 *           type: integer
 *         id_empresa:
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
 *     EventoEmpresa:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         id_calendario_empresa:
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
 */

/**
 * @swagger
 * /api/calendarios/empresa/proyecto/{idProyecto}:
 *   post:
 *     summary: Crear calendario de empresa para un proyecto
 *     description: Crea un calendario corporativo a nivel empresa asociado a un proyecto.
 *     tags: [CalendariosEmpresa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idProyecto
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
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
 *       201:
 *         description: Calendario de empresa creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalendarioEmpresa'
 *       400:
 *         description: Error de validación o datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ADMIN)
 */
router.post(
  '/proyecto/:idProyecto',
  verificarToken,
  validarRol('ADMIN'),
  crearCalendarioEmpresaController,
);

/**
 * @swagger
 * /api/calendarios/empresa/proyecto/{idProyecto}:
 *   get:
 *     summary: Listar calendarios de empresa de un proyecto
 *     tags: [CalendariosEmpresa]
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
 *         description: Lista de calendarios de empresa del proyecto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarioEmpresa'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ADMIN)
 */
router.get(
  '/proyecto/:idProyecto',
  verificarToken,
  validarRol('ADMIN'),
  listarCalendariosEmpresaProyectoController,
);

/**
 * @swagger
 * /api/calendarios/empresa/{idCalendario}/eventos:
 *   post:
 *     summary: Crear evento en calendario de empresa
 *     tags: [CalendariosEmpresa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCalendario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del calendario de empresa
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
 *               $ref: '#/components/schemas/EventoEmpresa'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ADMIN)
 */
router.post(
  '/:idCalendario/eventos',
  verificarToken,
  validarRol('ADMIN'),
  crearEventoEmpresaController,
);

/**
 * @swagger
 * /api/calendarios/empresa/{idCalendario}/eventos:
 *   get:
 *     summary: Listar eventos de un calendario de empresa
 *     tags: [CalendariosEmpresa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCalendario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del calendario de empresa
 *     responses:
 *       200:
 *         description: Lista de eventos del calendario de empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventoEmpresa'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ADMIN)
 */
router.get(
  '/:idCalendario/eventos',
  verificarToken,
  validarRol('ADMIN'),
  listarEventosCalendarioEmpresaController,
);

/**
 * @swagger
 * /api/calendarios/empresa/eventos/{idEvento}:
 *   patch:
 *     summary: Actualizar parcialmente un evento de empresa
 *     description: Permite actualizar uno, varios o todos los campos del evento.
 *     tags: [CalendariosEmpresa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento de empresa
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
 *         description: No autorizado (solo ADMIN)
 *       404:
 *         description: Evento no encontrado
 */
router.patch(
  '/eventos/:idEvento',
  verificarToken,
  validarRol('ADMIN'),
  actualizarEventoEmpresaController,
);

/**
 * @swagger
 * /api/calendarios/empresa/eventos/{idEvento}:
 *   delete:
 *     summary: Eliminar un evento de empresa
 *     tags: [CalendariosEmpresa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento de empresa
 *     responses:
 *       204:
 *         description: Evento eliminado correctamente (sin contenido)
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo ADMIN)
 *       404:
 *         description: Evento no encontrado
 */
router.delete(
  '/eventos/:idEvento',
  verificarToken,
  validarRol('ADMIN'),
  eliminarEventoEmpresaController,
);

export default router;
