import { Router } from 'express';
import { mantenimientoController } from '../controllers/mantenimientoController.js';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Mantenimiento H-16
 *   description: Gestión de estados y mantenimiento de recursos
 */

/**
 * @swagger
 * /api/mantenimiento/estado/{id_recurso}:
 *   put:
 *     summary: Cambiar estado de un recurso
 *     tags: [Mantenimiento H-16]
 *     parameters:
 *       - in: path
 *         name: id_recurso
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del recurso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: "En Reparacion"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Error al actualizar el estado
 */
router.put('/estado/:id_recurso', verificarToken, validarRol('ADMIN'), mantenimientoController.cambiarEstado);

/**
 * @swagger
 * /api/mantenimiento/programar:
 *   post:
 *     summary: Programar mantenimiento preventivo
 *     tags: [Mantenimiento H-16]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_recurso:
 *                 type: integer
 *               fecha_programada:
 *                 type: string
 *                 format: date-time
 *               descripcion:
 *                 type: string
 *               proveedor:
 *                 type: string
 *               costo:
 *                 type: number
 *                 example: 100
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mantenimiento preventivo registrado
 */
router.post('/programar', verificarToken, validarRol('ADMIN'), mantenimientoController.programarPreventivo);

/**
 * @swagger
 * /api/mantenimiento/correctivo:
 *   post:
 *     summary: Registrar mantenimiento correctivo
 *     tags: [Mantenimiento H-16]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_recurso:
 *                 type: integer
 *               fecha_real:
 *                 type: string
 *                 format: date-time
 *               descripcion:
 *                 type: string
 *               proveedor:
 *                 type: string
 *               costo:
 *                 type: number
 *                 example: 150
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mantenimiento correctivo registrado
 */
router.post('/correctivo', verificarToken, validarRol('ADMIN'), mantenimientoController.registrarCorrectivo);

/**
 * @swagger
 * /api/mantenimiento/historial/{id_recurso}:
 *   get:
 *     summary: Obtener historial de mantenimiento de un recurso
 *     tags: [Mantenimiento H-16]
 *     parameters:
 *       - in: path
 *         name: id_recurso
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del recurso
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de mantenimiento
 */
router.get('/historial/:id_recurso', verificarToken, mantenimientoController.historial);

/**
 * @swagger
 * /api/mantenimiento/reportes/{id_recurso}:
 *   get:
 *     summary: Generar reporte de costos de mantenimiento por recurso
 *     tags: [Mantenimiento H-16]
 *     parameters:
 *       - in: path
 *         name: id_recurso
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del recurso
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte de costos generado
 */
router.get('/reportes/:id_recurso', verificarToken, mantenimientoController.generarReporte);

export default router;
