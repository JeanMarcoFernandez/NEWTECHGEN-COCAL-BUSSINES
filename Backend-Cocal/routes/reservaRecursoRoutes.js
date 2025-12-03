// routes/reservaRecursoRoutes.js
import { Router } from 'express';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

import {
  crearReservaRecursoController,
  cancelarReservaRecursoController,
  aprobarReservaRecursoController,
  checkinReservaRecursoController,
  checkoutReservaRecursoController,
  historialReservasController,
  liberarReservasNoUsadasController
} from '../controllers/reservaRecursoController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Reservas de Recursos
 *     description: Reservas, aprobación, check-in/out y liberación (HU-04, HU-011, HU-012, HU-017)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ReservaRecursoCreate:
 *       type: object
 *       properties:
 *         id_recurso:
 *           type: integer
 *           example: 5
 *         fecha_inicio:
 *           type: string
 *           format: date-time
 *         fecha_fin:
 *           type: string
 *           format: date-time
 *         motivo:
 *           type: string
 *           example: "Reunión con el cliente X"
 *       required:
 *         - id_recurso
 *         - fecha_inicio
 *         - fecha_fin
 *     ReservaRecurso:
 *       allOf:
 *         - $ref: '#/components/schemas/ReservaRecursoCreate'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 12
 *             id_solicitante:
 *               type: integer
 *               example: 7
 *             id_aprobador:
 *               type: integer
 *               nullable: true
 *             estado:
 *               type: string
 *               description: Valor del enum estado_reserva
 *               example: "PENDIENTE_APROBACION"
 *             checkin_en:
 *               type: string
 *               format: date-time
 *               nullable: true
 *             checkout_en:
 *               type: string
 *               format: date-time
 *               nullable: true
 */

/**
 * @swagger
 * /api/reservas-recursos:
 *   post:
 *     summary: Crear una reserva de recurso
 *     description: >
 *       Crea una nueva reserva de recurso en estado **PENDIENTE_APROBACION**.  
 *       Valida conflictos, mantenimiento y tiempo máximo (HU-04 criterios 2, 3 y 7).
 *     tags: [Reservas de Recursos, HU-04]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservaRecursoCreate'
 *     responses:
 *       201:
 *         description: Reserva creada (puede venir ajustada por tiempo máximo)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reserva:
 *                   $ref: '#/components/schemas/ReservaRecurso'
 *                 fueAjustadoPorMaximo:
 *                   type: boolean
 *       400:
 *         description: Datos inválidos o recurso en mantenimiento
 *       401:
 *         description: No autenticado
 *       409:
 *         description: Conflicto de reservas
 */
router.post(
  '/',
  verificarToken,
  crearReservaRecursoController
);

/**
 * @swagger
 * /api/reservas-recursos/{id}/cancelar:
 *   put:
 *     summary: Cancelar una reserva
 *     description: >
 *       El solicitante o un rol elevado (ADMIN/SUPERVISOR/RRHH) puede cancelar una reserva.  
 *       Relacionado con HU-04 criterio 4.
 *     tags: [Reservas de Recursos, HU-04]
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
 *         description: Reserva cancelada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservaRecurso'
 *       400:
 *         description: La reserva ya no puede cancelarse
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Reserva no encontrada
 */
router.put(
  '/:id/cancelar',
  verificarToken,
  cancelarReservaRecursoController
);

/**
 * @swagger
 * /api/reservas-recursos/{id}/aprobar:
 *   put:
 *     summary: Aprobar o rechazar una reserva
 *     description: >
 *       Permite aprobar o rechazar una reserva pendiente.  
 *       Úsalo para el flujo de aprobación de salas/equipos (HU-04.2 y HU-012/HU-017).
 *     tags: [Reservas de Recursos, HU-04]
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
 *               aprobar:
 *                 type: boolean
 *                 example: true
 *               comentario:
 *                 type: string
 *                 example: "Aprobado, no olvides el proyector."
 *     responses:
 *       200:
 *         description: Reserva actualizada (APROBADA o RECHAZADA)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservaRecurso'
 *       400:
 *         description: La reserva no está pendiente de aprobación
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Reserva no encontrada
 */
router.put(
  '/:id/aprobar',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR', 'RRHH'),
  aprobarReservaRecursoController
);

/**
 * @swagger
 * /api/reservas-recursos/{id}/checkin:
 *   put:
 *     summary: Registrar check-in de una reserva
 *     description: >
 *       El solicitante marca que empezó a usar el recurso (estado pasa a EN_USO).  
 *       Relacionado con HU-04 (control de uso real del recurso).
 *     tags: [Reservas de Recursos, HU-04]
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
 *         description: Check-in registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservaRecurso'
 *       400:
 *         description: Reserva no está aprobada o no se puede hacer check-in
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo el solicitante puede hacer check-in
 *       404:
 *         description: Reserva no encontrada
 */
router.put(
  '/:id/checkin',
  verificarToken,
  checkinReservaRecursoController
);

/**
 * @swagger
 * /api/reservas-recursos/{id}/checkout:
 *   put:
 *     summary: Registrar check-out de una reserva
 *     description: >
 *       El solicitante marca que terminó de usar el recurso (estado pasa a FINALIZADA).
 *     tags: [Reservas de Recursos, HU-04]
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
 *         description: Check-out registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservaRecurso'
 *       400:
 *         description: La reserva no está en uso
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo el solicitante puede hacer check-out
 *       404:
 *         description: Reserva no encontrada
 */
router.put(
  '/:id/checkout',
  verificarToken,
  checkoutReservaRecursoController
);

/**
 * @swagger
 * /api/reservas-recursos/historial:
 *   get:
 *     summary: Historial de reservas de recursos
 *     description: >
 *       Permite filtrar el historial por recurso, solicitante, aprobador, estado y rango de fechas.  
 *       **HU-04.5** – historial de uso por período.
 *     tags: [Reservas de Recursos, HU-04]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_recurso
 *         schema:
 *           type: integer
 *       - in: query
 *         name: id_solicitante
 *         schema:
 *           type: integer
 *       - in: query
 *         name: id_aprobador
 *         schema:
 *           type: integer
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *       - in: query
 *         name: fecha_desde
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: fecha_hasta
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Lista de reservas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReservaRecurso'
 *       401:
 *         description: No autenticado
 */
router.get(
  '/historial',
  verificarToken,
  historialReservasController
);

/**
 * @swagger
 * /api/reservas-recursos/liberar-no-usadas:
 *   post:
 *     summary: Liberar reservas no usadas (no hubo check-in)
 *     description: >
 *       Marca como EXPIRADA las reservas aprobadas donde no se hizo check-in y ya pasaron X minutos desde la hora de inicio (por defecto 15).  
 *       Implementa HU-04 criterio 8 (liberar recursos no utilizados).
 *     tags: [Reservas de Recursos, HU-04]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: minutos
 *         schema:
 *           type: integer
 *           example: 15
 *     responses:
 *       200:
 *         description: Reservas liberadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cantidad:
 *                   type: integer
 *                 reservas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ReservaRecurso'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */
router.post(
  '/liberar-no-usadas',
  verificarToken,
  validarRol('ADMIN'),
  liberarReservasNoUsadasController
);

export default router;
