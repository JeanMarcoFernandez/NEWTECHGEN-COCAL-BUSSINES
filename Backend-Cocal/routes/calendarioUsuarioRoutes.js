// routes/calendarioUsuarioRoutes.js
import { Router } from 'express';
import { verificarToken } from '../middleware/verificarToken.js';

import {
  crearCalendarioUsuarioController,
  listarCalendariosUsuarioController,
  crearEventoUsuarioController,
  listarEventosCalendarioUsuarioController,
  actualizarEventoUsuarioController,
  eliminarEventoUsuarioController,
  agregarParticipantesEventoUsuarioController,
  actualizarEstadoParticipacionUsuarioController,
  actualizarCalendarioUsuarioController,
  eliminarCalendarioUsuarioController,
} from '../controllers/calendarioUsuarioController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: CalendariosUsuario
 *   description: Gestión de calendarios y eventos personales de cada usuario
 *
 * components:
 *   schemas:
 *     CalendarioUsuarioInput:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Calendario personal"
 *         zona_horaria:
 *           type: string
 *           example: "America/La_Paz"
 *
 *     CalendarioUsuario:
 *       allOf:
 *         - $ref: '#/components/schemas/CalendarioUsuarioInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *             id_usuario:
 *               type: integer
 *             creado_en:
 *               type: string
 *               format: date-time
 *
 *     EventoUsuarioInput:
 *       type: object
 *       required:
 *         - titulo
 *         - fecha_inicio
 *         - fecha_fin
 *       properties:
 *         titulo:
 *           type: string
 *           example: "Reunión de planificación"
 *         descripcion:
 *           type: string
 *           example: "Definir tareas de la semana"
 *         tipo:
 *           type: string
 *           enum: [REUNION, CAPACITACION, PROYECTO, REVISION]
 *           example: "REUNION"
 *         fecha_inicio:
 *           type: string
 *           format: date-time
 *           example: "2025-11-27T09:00:00"
 *         fecha_fin:
 *           type: string
 *           format: date-time
 *           example: "2025-11-27T10:00:00"
 *         responsable:
 *           type: integer
 *           example: 5
 *         visibilidad:
 *           type: string
 *           enum: [PRIVADO, INTERNO, PUBLICO]
 *           example: "INTERNO"
 *
 *     EventoUsuario:
 *       allOf:
 *         - $ref: '#/components/schemas/EventoUsuarioInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *             id_calendario:
 *               type: integer
 *             estado:
 *               type: string
 *               enum: [PROGRAMADO, EN_CURSO, FINALIZADO, CANCELADO]
 *               example: "PROGRAMADO"
 *
 *     EventoUsuarioPatch:
 *       type: object
 *       description: |
 *         Todos los campos son opcionales. Se puede actualizar uno, varios o todos.
 *       properties:
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
 *
 *     ParticipantesEventoInput:
 *       type: object
 *       description: Puedes enviar un solo participante o un array.
 *       properties:
 *         participantes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *               estado:
 *                 type: string
 *                 enum: [CONFIRMADA, PENDIENTE, RECHAZADA]
 *           example:
 *             - { "id_usuario": 2, "estado": "PENDIENTE" }
 *             - { "id_usuario": 3, "estado": "CONFIRMADA" }
 *         id_usuario:
 *           type: integer
 *           description: ID de usuario si solo agregas uno
 *           example: 7
 *         estado:
 *           type: string
 *           enum: [CONFIRMADA, PENDIENTE, RECHAZADA]
 *           example: "PENDIENTE"
 *
 *     ParticipacionEvento:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         id_evento:
 *           type: integer
 *         id_usuario:
 *           type: integer
 *         estado:
 *           type: string
 *           enum: [CONFIRMADA, PENDIENTE, RECHAZADA]
 */

/**
 * @swagger
 * /api/calendarios/usuario:
 *   post:
 *     summary: Crea un calendario personal para el usuario autenticado
 *     tags: [CalendariosUsuario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarioUsuarioInput'
 *     responses:
 *       201:
 *         description: Calendario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalendarioUsuario'
 *       400:
 *         description: Error de validación o datos inválidos
 *       401:
 *         description: Token inválido o ausente
 */
router.post('/', verificarToken, crearCalendarioUsuarioController);

/**
 * @swagger
 * /api/calendarios/usuario/mis:
 *   get:
 *     summary: Lista todos los calendarios personales del usuario autenticado
 *     tags: [CalendariosUsuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de calendarios personales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalendarioUsuario'
 *       401:
 *         description: Token inválido o ausente
 *       500:
 *         description: Error al listar calendarios de usuario
 */
router.get('/mis', verificarToken, listarCalendariosUsuarioController);

/**
 * @swagger
 * /api/calendarios/usuario/{idCalendario}:
 *   patch:
 *     summary: Actualiza parcialmente un calendario personal
 *     description: |
 *       El calendario debe pertenecer al usuario autenticado.
 *       Puedes enviar solo uno, varios o todos los campos (nombre, zona_horaria).
 *     tags: [CalendariosUsuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCalendario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del calendario a actualizar
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarioUsuarioInput'
 *     responses:
 *       200:
 *         description: Calendario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/CalendarioUsuario'
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: El calendario no pertenece al usuario
 *       404:
 *         description: Calendario no encontrado
 *       500:
 *         description: Error al actualizar el calendario
 *   delete:
 *     summary: Elimina un calendario personal del usuario
 *     description: También eliminará los eventos asociados a este calendario.
 *     tags: [CalendariosUsuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCalendario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del calendario a eliminar
 *     responses:
 *       204:
 *         description: Calendario eliminado correctamente (sin contenido)
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: El calendario no pertenece al usuario
 *       404:
 *         description: Calendario no encontrado
 *       500:
 *         description: Error al eliminar el calendario
 */
router.patch('/:idCalendario', verificarToken, actualizarCalendarioUsuarioController);
router.delete('/:idCalendario', verificarToken, eliminarCalendarioUsuarioController);

/**
 * @swagger
 * /api/calendarios/usuario/{idCalendario}/eventos:
 *   post:
 *     summary: Crea un evento en un calendario personal
 *     tags: [CalendariosUsuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCalendario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del calendario del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventoUsuarioInput'
 *     responses:
 *       201:
 *         description: Evento creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventoUsuario'
 *       400:
 *         description: Datos inválidos o rango de fechas incorrecto
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: El calendario no pertenece al usuario
 *   get:
 *     summary: Lista los eventos de un calendario personal
 *     tags: [CalendariosUsuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCalendario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del calendario del usuario
 *     responses:
 *       200:
 *         description: Lista de eventos del calendario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventoUsuario'
 *       400:
 *         description: Error al listar eventos
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: El calendario no pertenece al usuario
 */
router.post('/:idCalendario/eventos', verificarToken, crearEventoUsuarioController);
router.get('/:idCalendario/eventos', verificarToken, listarEventosCalendarioUsuarioController);

/**
 * @swagger
 * /api/calendarios/usuario/eventos/{idEvento}:
 *   patch:
 *     summary: Actualiza parcialmente un evento del calendario personal
 *     description: |
 *       El evento debe pertenecer a un calendario del usuario autenticado.
 *       Puedes actualizar solo uno, varios o todos los campos del evento.
 *     tags: [CalendariosUsuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento a actualizar
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventoUsuarioPatch'
 *     responses:
 *       200:
 *         description: Evento actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/EventoUsuario'
 *       400:
 *         description: Rango de fechas inválido u otros errores
 *       401:
 *         description: Token inválido o ausente
 *       404:
 *         description: Evento no encontrado o no pertenece al usuario
 *       500:
 *         description: Error al actualizar el evento
 *   delete:
 *     summary: Elimina un evento del calendario personal
 *     tags: [CalendariosUsuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento a eliminar
 *     responses:
 *       204:
 *         description: Evento eliminado correctamente
 *       400:
 *         description: Error al eliminar el evento
 *       401:
 *         description: Token inválido o ausente
 */
router.patch('/eventos/:idEvento', verificarToken, actualizarEventoUsuarioController);
router.delete('/eventos/:idEvento', verificarToken, eliminarEventoUsuarioController);

/**
 * @swagger
 * /api/calendarios/usuario/eventos/{idEvento}/participantes:
 *   post:
 *     summary: Agrega participantes a un evento del calendario personal
 *     description: |
 *       Solo el dueño del calendario puede agregar participantes.
 *       Se puede enviar un solo participante (id_usuario, estado)
 *       o un array en la propiedad participantes.
 *     tags: [CalendariosUsuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParticipantesEventoInput'
 *     responses:
 *       201:
 *         description: Participantes agregados correctamente
 *       400:
 *         description: Error al agregar participantes
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: El evento no pertenece al usuario
 */
router.post(
  '/eventos/:idEvento/participantes',
  verificarToken,
  agregarParticipantesEventoUsuarioController,
);

/**
 * @swagger
 * /api/calendarios/usuario/eventos/{idEvento}/participantes/{usuarioId}:
 *   patch:
 *     summary: Actualiza el estado de participación de un usuario en un evento
 *     description: Solo el dueño del calendario puede cambiar el estado.
 *     tags: [CalendariosUsuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEvento
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
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
 *                 example: "CONFIRMADA"
 *     responses:
 *       200:
 *         description: Estado de participación actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ParticipacionEvento'
 *       400:
 *         description: Error al actualizar el estado
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: El evento no pertenece al usuario
 */
router.patch(
  '/eventos/:idEvento/participantes/:usuarioId',
  verificarToken,
  actualizarEstadoParticipacionUsuarioController,
);

export default router;
