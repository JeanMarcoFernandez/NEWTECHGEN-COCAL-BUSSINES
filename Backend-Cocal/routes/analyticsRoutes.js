// routes/analyticsRoutes.js
import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Módulo de análisis de productividad (HU-014)
 */

// HU-014 — criterios de aceptación
/**
 * @swagger
 * /api/analytics/corporativo:
 *   get:
 *     summary: Métricas corporativas y tendencias globales
 *     description: Retorna métricas generales de la empresa (uso por tipo y tendencias).
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos corporativos obtenidos correctamente.
 *       401:
 *         description: Token inválido o expirado.
 *       403:
 *         description: Acceso denegado — Rol requiere ADMIN.
 */
router.get('/corporativo', verificarToken, validarRol('ADMIN'), analyticsController.corporativo);
/**
 * @swagger
 * /api/analytics/departamento/{id}:
 *   get:
 *     summary: Métricas de uso por departamento
 *     description: Retorna análisis de utilización y patrones de uso de un departamento.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del departamento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Métricas del departamento obtenidas.
 *       401:
 *         description: Token inválido o expirado.
 *       403:
 *         description: Acceso denegado — Rol requiere ADMIN o GERENTE.
 */
router.get('/departamento/:id', verificarToken, validarRol('ADMIN', 'GERENTE'), analyticsController.departamento);
/**
 * @swagger
 * /api/analytics/benchmarking:
 *   get:
 *     summary: Comparativa entre departamentos
 *     description: Retorna un ranking y métricas comparativas por departamento.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comparativa generada correctamente.
 *       401:
 *         description: Token inválido o expirado.
 *       403:
 *         description: Acceso denegado — Solo ADMIN.
 */
router.get('/benchmarking', verificarToken, validarRol('ADMIN'), analyticsController.benchmarking);
/**
 * @swagger
 * /api/analytics/exportar/{id}:
 *   get:
 *     summary: Exportar dataset de reservas de un departamento
 *     description: Exporta un archivo CSV con todas las reservas del departamento.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del departamento
 *     responses:
 *       200:
 *         description: CSV descargado correctamente.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Token inválido o expirado.
 *       403:
 *         description: Acceso denegado — Rol requiere ADMIN o GERENTE.
 */

router.get('/exportar/:id', verificarToken, validarRol('ADMIN', 'GERENTE'), analyticsController.exportarDepartamento);
/**
 * @swagger
 * /api/analytics/alertas/tendencias:
 *   get:
 *     summary: Detección de tendencias negativas
 *     description: Identifica caídas significativas en el uso de recursos.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de alertas de tendencias negativas.
 *       401:
 *         description: Token inválido o expirado.
 *       403:
 *         description: Acceso denegado — Rol requiere ADMIN o GERENTE.
 */
router.get('/alertas/tendencias', verificarToken, validarRol('ADMIN', 'GERENTE'), analyticsController.tendenciasNegativas);
/**
 * @swagger
 * /api/analytics/kpi:
 *   post:
 *     summary: Crear KPI personalizado
 *     description: Permite al Director definir KPIs con fórmulas SQL.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               formula_sql:
 *                 type: string
 *             required:
 *               - nombre
 *               - formula_sql
 *     responses:
 *       200:
 *         description: KPI creado correctamente.
 *       401:
 *         description: Token inválido o expirado.
 *       403:
 *         description: Solo ADMIN puede crear KPIs.
 */
router.post('/kpi', verificarToken, validarRol('ADMIN'), analyticsController.guardarKpi);
/**
 * @swagger
 * /api/analytics/dashboard/config:
 *   put:
 *     summary: Guardar configuración del dashboard ejecutivo
 *     description: Guarda el layout del dashboard por usuario.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               layout:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: Configuración guardada exitosamente.
 *       401:
 *         description: Token inválido o expirado.
 *       403:
 *         description: Rol no autorizado.
 */
router.put('/dashboard/config', verificarToken, validarRol('ADMIN', 'GERENTE'), analyticsController.configDashboard);

export default router;
