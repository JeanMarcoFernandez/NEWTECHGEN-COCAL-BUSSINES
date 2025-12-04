import { Router } from 'express';
import { recurso15Controller } from '../controllers/recurso15Controller.js';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';
import multer from 'multer';

const router = Router();
const upload = multer();

/**
 * @swagger
 * tags:
 *   name: Recursos15
 *   description: Gestión de recursos empresariales
 */

/**
 * @swagger
 * /api/recurso15/:
 *   post:
 *     summary: Crear un nuevo recurso
 *     tags: [Recursos15]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               tipo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               capacidad:
 *                 type: integer
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Recurso creado correctamente
 *       400:
 *         description: Error de validación o de negocio
 */
router.post(
  '/',
  verificarToken,
  validarRol('ADMIN'),
  upload.single('imagen'),
  recurso15Controller.crearRecurso
);

/**
 * @swagger
 * /api/recurso15:
 *   get:
 *     summary: Listar todos los recursos
 *     tags: [Recursos15]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de recursos
 *       400:
 *         description: Error al obtener recursos
 */
router.get('/', verificarToken, recurso15Controller.listarRecursos);

/**
 * @swagger
 * /api/recurso15/{id}:
 *   get:
 *     summary: Obtener un recurso por ID
 *     tags: [Recursos15]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del recurso
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recurso encontrado
 *       404:
 *         description: Recurso no encontrado
 */
router.get('/:id', verificarToken, recurso15Controller.obtenerRecurso);

/**
 * @swagger
 * /api/recurso15/reserva:
 *   post:
 *     summary: Crear una reserva de recurso
 *     tags: [Recursos15]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_recurso:
 *                 type: integer
 *               id_solicitante:
 *                 type: integer
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *               motivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reserva creada correctamente
 *       400:
 *         description: Conflicto de horarios o validación de capacidad
 */
router.post(
  '/reserva',
  verificarToken,
  validarRol('EMPLEADO', 'ADMIN'),
  recurso15Controller.crearReserva
);

/**
 * @swagger
 * /api/recurso15/reserva/{id_recurso}:
 *   get:
 *     summary: Listar reservas de un recurso
 *     tags: [Recursos15]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_recurso
 *         in: path
 *         description: ID del recurso
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de reservas del recurso
 *       400:
 *         description: Error al obtener reservas
 */
router.get(
  '/reserva/:id_recurso',
  verificarToken,
  recurso15Controller.listarReservas
);

export default router;
