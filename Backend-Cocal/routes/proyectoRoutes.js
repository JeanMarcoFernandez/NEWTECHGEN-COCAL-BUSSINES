// routes/proyectoRoutes.js
import { Router } from 'express';

import {
  crearProyectoDepartamentoController,
  crearProyectoEmpresaController,
  obtenerProyectoController,
  actualizarProyectoController,
  eliminarProyectoController,
  listarProyectosPorEmpresaController,
  listarProyectosPorDepartamentoController,
  listarDepartamentosDeProyectoController,
} from '../controllers/proyectoController.js';

import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Proyectos
 *   description: Gestión de proyectos por empresa y por departamento
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Proyecto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         id_empresa:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         id_departamento:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         nombre:
 *           type: string
 *           example: "Implementación de COCAL Business"
 *         descripcion:
 *           type: string
 *           example: "Proyecto para desplegar el calendario colaborativo en toda la empresa."
 *         visibilidad:
 *           type: string
 *           example: "INTERNO"
 *         responsable:
 *           type: integer
 *           example: 5
 *         fecha_inicio:
 *           type: string
 *           format: date
 *           example: "2025-09-01"
 *         fecha_fin:
 *           type: string
 *           format: date
 *           example: "2025-12-15"
 */

/**
 * @swagger
 * /api/proyectos/departamento:
 *   post:
 *     summary: Crear proyecto asociado a un departamento
 *     description: Crea un proyecto específico de un solo departamento (proyecto local al área).
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_departamento, nombre]
 *             properties:
 *               id_departamento:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               visibilidad:
 *                 type: string
 *                 example: "INTERNO"
 *               responsable:
 *                 type: integer
 *                 description: ID de usuario responsable
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *           example:
 *             id_departamento: 3
 *             nombre: "Proyecto Intranet RRHH"
 *             descripcion: "Portal interno de RRHH."
 *             visibilidad: "INTERNO"
 *             responsable: 7
 *             fecha_inicio: "2025-09-01"
 *             fecha_fin: "2025-11-30"
 *     responses:
 *       201:
 *         description: Proyecto creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado (ADMIN requerido)
 *       500:
 *         description: Error al crear el proyecto
 */
router.post(
  '/departamento',
  verificarToken,
  validarRol('ADMIN'),
  crearProyectoDepartamentoController
);

/**
 * @swagger
 * /api/proyectos/empresa:
 *   post:
 *     summary: Crear proyecto corporativo de empresa
 *     description: |
 *       Crea un proyecto a nivel de empresa.  
 *       En este tipo de proyecto se pueden vincular **múltiples departamentos implicados**.
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_empresa, nombre]
 *             properties:
 *               id_empresa:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               visibilidad:
 *                 type: string
 *               responsable:
 *                 type: integer
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *               departamentos_implicados:
 *                 type: array
 *                 description: IDs de departamentos que participan en el proyecto
 *                 items:
 *                   type: integer
 *           example:
 *             id_empresa: 1
 *             nombre: "Implementación COCAL a nivel corporativo"
 *             descripcion: "Proyecto transversal que involucra varios departamentos."
 *             visibilidad: "INTERNO"
 *             responsable: 5
 *             fecha_inicio: "2025-09-01"
 *             fecha_fin: "2025-12-20"
 *             departamentos_implicados: [2, 3, 4]
 *     responses:
 *       201:
 *         description: Proyecto corporativo creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado (ADMIN requerido)
 *       500:
 *         description: Error al crear el proyecto corporativo
 */
router.post(
  '/empresa',
  verificarToken,
  validarRol('ADMIN'),
  crearProyectoEmpresaController
);

/**
 * @swagger
 * /api/proyectos/empresa/{idEmpresa}:
 *   get:
 *     summary: Listar proyectos de una empresa
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEmpresa
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     responses:
 *       200:
 *         description: Lista de proyectos de la empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Proyecto'
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado (ADMIN requerido)
 *       404:
 *         description: Empresa sin proyectos o no encontrada
 *       500:
 *         description: Error al listar proyectos
 */
router.get(
  '/empresa/:idEmpresa',
  verificarToken,
  validarRol('ADMIN'),
  listarProyectosPorEmpresaController
);

/**
 * @swagger
 * /api/proyectos/departamento/{idDepartamento}:
 *   get:
 *     summary: Listar proyectos de un departamento
 *     tags: [Proyectos]
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
 *         description: Lista de proyectos del departamento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Proyecto'
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado (ADMIN requerido)
 *       404:
 *         description: Departamento sin proyectos o no encontrado
 *       500:
 *         description: Error al listar proyectos de departamento
 */
router.get(
  '/departamento/:idDepartamento',
  verificarToken,
  validarRol('ADMIN'),
  listarProyectosPorDepartamentoController
);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   get:
 *     summary: Obtener proyecto por ID
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proyecto'
 *       404:
 *         description: Proyecto no encontrado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error al obtener el proyecto
 */
router.get(
  '/:id',
  verificarToken,
  validarRol('ADMIN'),
  obtenerProyectoController
);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   put:
 *     summary: Actualizar proyecto
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proyecto'
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Proyecto no encontrado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error al actualizar el proyecto
 */
router.put(
  '/:id',
  verificarToken,
  validarRol('ADMIN'),
  actualizarProyectoController
);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   delete:
 *     summary: Eliminar proyecto
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     responses:
 *       204:
 *         description: Proyecto eliminado correctamente
 *       404:
 *         description: Proyecto no encontrado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error al eliminar el proyecto
 */
router.delete(
  '/:id',
  verificarToken,
  validarRol('ADMIN'),
  eliminarProyectoController
);

/**
 * @swagger
 * /api/proyectos/{id}/departamentos:
 *   get:
 *     summary: Listar departamentos implicados en un proyecto corporativo
 *     description: |
 *       Devuelve los departamentos asociados a un proyecto de empresa  
 *       (solo aplica para proyectos creados vía `/api/proyectos/empresa`).
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Lista de departamentos implicados
 *       404:
 *         description: Proyecto no encontrado o sin departamentos asociados
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error al obtener departamentos implicados
 */
router.get(
  '/:id/departamentos',
  verificarToken,
  validarRol('ADMIN'),
  listarDepartamentosDeProyectoController
);

export default router;
