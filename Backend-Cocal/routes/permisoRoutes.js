// routes/permisoRoutes.js
import { Router } from 'express';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

import {
  configurarPermisosEquipoController,
  crearPermisoPersonalizadoDeptController,
  modificarPermisoEquipoController,
  revocarPermisosPorSalidaEquipoController,
  delegarPermisosTemporalController,
  auditarPermisosController
} from '../controllers/permisoController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Permisos
 *   description: Gestión de permisos granulares por equipo (HU-010)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PermisoEquipoRegla:
 *       type: object
 *       properties:
 *         id_departamento:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         id_proyecto:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         rol_objetivo:
 *           type: string
 *           description: Rol que hereda el permiso
 *           example: EMPLEADO
 *         permiso:
 *           type: string
 *           description: Clave lógica del permiso
 *           example: GESTION_CALENDARIO
 *         nivel:
 *           type: string
 *           description: Nivel de permiso
 *           enum: [NINGUNO, LECTURA, EDICION, ADMIN]
 *           example: EDICION
 *
 *     PermisoEquipoInput:
 *       type: object
 *       required:
 *         - reglas
 *       properties:
 *         reglas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PermisoEquipoRegla'
 *
 *     PermisoEquipo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         id_empresa:
 *           type: integer
 *           example: 1
 *         id_departamento:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         id_proyecto:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         rol_objetivo:
 *           type: string
 *           example: EMPLEADO
 *         permiso:
 *           type: string
 *           example: GESTION_CALENDARIO
 *         nivel:
 *           type: string
 *           enum: [NINGUNO, LECTURA, EDICION, ADMIN]
 *           example: EDICION
 *         creado_por:
 *           type: integer
 *           example: 10
 *         creado_en:
 *           type: string
 *           format: date-time
 *
 *     PermisoPersonalizadoDeptInput:
 *       type: object
 *       required:
 *         - id_departamento
 *         - rol_objetivo
 *         - permiso
 *         - nivel
 *       properties:
 *         id_departamento:
 *           type: integer
 *           example: 3
 *         rol_objetivo:
 *           type: string
 *           example: EMPLEADO
 *         permiso:
 *           type: string
 *           example: VER_REPORTES
 *         nivel:
 *           type: string
 *           enum: [NINGUNO, LECTURA, EDICION, ADMIN]
 *           example: LECTURA
 *
 *     DelegacionPermisoInput:
 *       type: object
 *       required:
 *         - id_sustituto
 *         - fecha_inicio
 *         - fecha_fin
 *       properties:
 *         id_sustituto:
 *           type: integer
 *           example: 15
 *         fecha_inicio:
 *           type: string
 *           format: date-time
 *           example: "2025-12-05T08:00:00Z"
 *         fecha_fin:
 *           type: string
 *           format: date-time
 *           example: "2025-12-10T18:00:00Z"
 *
 *     DelegacionPermiso:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         id_gerente:
 *           type: integer
 *           example: 10
 *         id_sustituto:
 *           type: integer
 *           example: 15
 *         fecha_inicio:
 *           type: string
 *           format: date-time
 *         fecha_fin:
 *           type: string
 *           format: date-time
 *         activo:
 *           type: boolean
 *           example: true
 *         creado_en:
 *           type: string
 *           format: date-time
 *
 *     AuditoriaPermiso:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         id_empresa:
 *           type: integer
 *         id_usuario_objetivo:
 *           type: integer
 *           nullable: true
 *         permiso:
 *           type: string
 *           nullable: true
 *         nivel_anterior:
 *           type: string
 *           nullable: true
 *         nivel_nuevo:
 *           type: string
 *           nullable: true
 *         accion:
 *           type: string
 *           example: CREAR
 *         realizado_por:
 *           type: integer
 *         detalle:
 *           type: string
 *         creado_en:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/permisos/equipo:
 *   post:
 *     summary: Configurar permisos por equipo (empresa/departamento/proyecto)
 *     description: |
 *       Director (ADMIN) o SUPERVISOR define reglas de permisos que serán heredadas por empleados según rol y ámbito.
 *     tags: [Permisos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PermisoEquipoInput'
 *           example:
 *             reglas:
 *               - id_departamento: null
 *                 id_proyecto: null
 *                 rol_objetivo: EMPLEADO
 *                 permiso: GESTION_CALENDARIO
 *                 nivel: LECTURA
 *               - id_departamento: 3
 *                 id_proyecto: null
 *                 rol_objetivo: SUPERVISOR
 *                 permiso: GESTION_CALENDARIO
 *                 nivel: ADMIN
 *     responses:
 *       201:
 *         description: Reglas de permisos creadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PermisoEquipo'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Rol no autorizado
 */

// Director configura permisos por equipo
router.post(
  '/equipo',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'), // tu "Director" entra aquí
  configurarPermisosEquipoController
);

/**
 * @swagger
 * /api/permisos/departamento/personalizado:
 *   post:
 *     summary: Crear permiso personalizado para departamento
 *     description: Gerente/SUPERVISOR define reglas específicas para su departamento.
 *     tags: [Permisos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PermisoPersonalizadoDeptInput'
 *           example:
 *             id_departamento: 3
 *             rol_objetivo: EMPLEADO
 *             permiso: VER_REPORTES
 *             nivel: LECTURA
 *     responses:
 *       201:
 *         description: Permiso personalizado creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermisoEquipo'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Rol no autorizado
 */

// Gerente crea permiso personalizado del departamento
router.post(
  '/departamento/personalizado',
  verificarToken,
  validarRol('SUPERVISOR', 'ADMIN'),
  crearPermisoPersonalizadoDeptController
);

/**
 * @swagger
 * /api/permisos/equipo/{id}:
 *   put:
 *     summary: Modificar un permiso de equipo existente
 *     tags: [Permisos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del permiso de equipo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nivel:
 *                 type: string
 *                 enum: [NINGUNO, LECTURA, EDICION, ADMIN]
 *                 example: ADMIN
 *           example:
 *             nivel: ADMIN
 *     responses:
 *       200:
 *         description: Permiso actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermisoEquipo'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Rol no autorizado
 *       404:
 *         description: Permiso no encontrado
 */

// Modificar permiso existente
router.put(
  '/equipo/:id',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR'),
  modificarPermisoEquipoController
);

/**
 * @swagger
 * /api/permisos/revocar-por-salida-equipo:
 *   post:
 *     summary: Revocar permisos cuando se remueve usuario de un equipo
 *     description: |
 *       Revoca los permisos con origen 'EQUIPO' del usuario indicado (cuando sale de un proyecto/departamento).
 *     tags: [Permisos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_usuario
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 22
 *           example:
 *             id_usuario: 22
 *     responses:
 *       200:
 *         description: Permisos revocados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 revocados:
 *                   type: integer
 *                   example: 3
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Rol no autorizado
 */

// Revocar permisos cuando se remueve usuario de equipo
router.post(
  '/revocar-por-salida-equipo',
  verificarToken,
  validarRol('SUPERVISOR', 'ADMIN'),
  revocarPermisosPorSalidaEquipoController
);

/**
 * @swagger
 * /api/permisos/delegar:
 *   post:
 *     summary: Delegar permisos temporalmente a un sustituto
 *     description: Cuando un Gerente se ausenta, delega sus permisos a otro usuario por un período.
 *     tags: [Permisos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DelegacionPermisoInput'
 *           example:
 *             id_sustituto: 15
 *             fecha_inicio: "2025-12-05T08:00:00Z"
 *             fecha_fin: "2025-12-10T18:00:00Z"
 *     responses:
 *       201:
 *         description: Delegación creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DelegacionPermiso'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Rol no autorizado
 */

// Delegación temporal de permisos (gerente ausente)
router.post(
  '/delegar',
  verificarToken,
  validarRol('SUPERVISOR', 'ADMIN'),
  delegarPermisosTemporalController
);

/**
 * @swagger
 * /api/permisos/auditoria:
 *   get:
 *     summary: Consultar historial de cambios de permisos
 *     description: Director/ADMIN/SUPERVISOR/RRHH pueden ver el historial de auditoría de permisos.
 *     tags: [Permisos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_usuario_objetivo
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtrar por usuario objetivo
 *       - in: query
 *         name: permiso
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtrar por clave de permiso
 *     responses:
 *       200:
 *         description: Lista de registros de auditoría
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AuditoriaPermiso'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Rol no autorizado
 */

// Auditoría de permisos
router.get(
  '/auditoria',
  verificarToken,
  validarRol('ADMIN', 'SUPERVISOR', 'RRHH'),
  auditarPermisosController
);

export default router;
