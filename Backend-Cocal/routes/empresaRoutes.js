// routes/empresaRoutes.js
import { Router } from 'express';
import {
  crearEmpresaController,
  listarEmpresasController,
  obtenerEmpresaController,
  actualizarEmpresaController,
  eliminarEmpresaController,
  listarEntornoEmpresaController
} from '../controllers/empresaController.js';

import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Empresas
 *   description: Gestión de empresas en el sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Empresa:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "New Tech Gen S.R.L."
 *         nit:
 *           type: string
 *           example: "1234567011"
 *         rubro:
 *           type: string
 *           example: "Tecnología y servicios"
 *         direccion:
 *           type: string
 *           example: "Av. Busch #123, La Paz"
 *         telefono:
 *           type: string
 *           example: "76543210"
 *         sitio_web:
 *           type: string
 *           example: "https://newtechgen.com"
 */
/**
 * @swagger
 * /api/empresas/entorno:
 *   get:
 *     summary: Obtener entorno completo de la empresa del usuario autenticado
 *     tags: [Empresas]
 *     description: >
 *       Devuelve la información de la empresa del usuario autenticado,  
 *       sus departamentos y los usuarios asignados a cada departamento,  
 *       incluyendo también la lista de usuarios sin departamento asignado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Entorno de la empresa obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 empresa:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     nit:
 *                       type: string
 *                     rubro:
 *                       type: string
 *                     direccion:
 *                       type: string
 *                     telefono:
 *                       type: string
 *                     sitio_web:
 *                       type: string
 *                 departamentos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       descripcion:
 *                         type: string
 *                       area:
 *                         type: string
 *                       visibilidad:
 *                         type: string
 *                       creado_en:
 *                         type: string
 *                         format: date-time
 *                       usuarios:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             nombre:
 *                               type: string
 *                             apellido:
 *                               type: string
 *                             correo:
 *                               type: string
 *                             cargo:
 *                               type: string
 *                             rol:
 *                               type: string
 *                             estado:
 *                               type: string
 *                             telefono:
 *                               type: integer
 *                             fecha_ingreso:
 *                               type: string
 *                               format: date
 *                             id_departamento:
 *                               type: integer
 *                 usuarios_sin_departamento:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       apellido:
 *                         type: string
 *                       correo:
 *                         type: string
 *                       cargo:
 *                         type: string
 *                       rol:
 *                         type: string
 *                       estado:
 *                         type: string
 *                       telefono:
 *                         type: integer
 *                       fecha_ingreso:
 *                         type: string
 *                         format: date
 *                       id_departamento:
 *                         type: string
 *                         nullable: true
 *         examples:
 *           application/json:
 *             value:
 *               empresa:
 *                 id: 1
 *                 nombre: "TechCorp"
 *                 nit: "123456"
 *                 rubro: "Software"
 *                 direccion: "Av. Siempre Viva 123"
 *                 telefono: "44444444"
 *                 sitio_web: "https://techcorp.com"
 *               departamentos:
 *                 - id: 3
 *                   nombre: "SISTEMAS"
 *                   descripcion: "Equipo de desarrollo"
 *                   area: "SISTEMAS"
 *                   visibilidad: "INTERNO"
 *                   creado_en: "2025-01-01T10:00:00.000Z"
 *                   usuarios:
 *                     - id: 10
 *                       nombre: "Sergio"
 *                       apellido: "Arias"
 *                       correo: "sergio@techcorp.com"
 *                       cargo: "Dev Senior"
 *                       rol: "EMPLEADO"
 *                       estado: "ACTIVO"
 *                       telefono: 78123456
 *                       fecha_ingreso: "2024-02-01"
 *                       id_departamento: 3
 *                 - id: 4
 *                   nombre: "RRHH"
 *                   descripcion: null
 *                   area: "RECURSOS_HUMANOS"
 *                   visibilidad: "INTERNO"
 *                   creado_en: "2025-01-05T10:00:00.000Z"
 *                   usuarios: []
 *               usuarios_sin_departamento:
 *                 - id: 20
 *                   nombre: "Juan"
 *                   apellido: "Pérez"
 *                   correo: "juan@techcorp.com"
 *                   cargo: "Consultor"
 *                   rol: "EMPLEADO"
 *                   estado: "ACTIVO"
 *                   telefono: 78999999
 *                   fecha_ingreso: "2024-05-10"
 *                   id_departamento: null
 *       400:
 *         description: El token no tiene empresa asociada
 *       401:
 *         description: Token inválido o ausente
 *       500:
 *         description: Error al obtener el entorno de la empresa
 */
router.get('/entorno', verificarToken, listarEntornoEmpresaController);
/**
 * @swagger
 * /api/empresas:
 *   post:
 *     summary: Crear una empresa
 *     description: Crea una nueva empresa base del sistema. Solo ADMIN. Relacionado con HU-01 (estructura organizacional para roles y JWT).
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *               nit:
 *                 type: string
 *               rubro:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *               sitio_web:
 *                 type: string
 *           example:
 *             nombre: "New Tech Gen S.R.L."
 *             nit: "1234567011"
 *             rubro: "Tecnología y servicios"
 *             direccion: "Av. Busch #123, La Paz"
 *             telefono: "76543210"
 *             sitio_web: "https://newtechgen.com"
 *     responses:
 *       201:
 *         description: Empresa creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empresa'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado (se requiere rol ADMIN)
 *       500:
 *         description: Error al crear la empresa
 */
router.post(
  '/',crearEmpresaController
);

/**
 * @swagger
 * /api/empresas:
 *   get:
 *     summary: Listar empresas
 *     description: Devuelve todas las empresas registradas. Solo ADMIN.
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresa'
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado (se requiere rol ADMIN)
 *       500:
 *         description: Error al obtener las empresas
 */
router.get(
  '/',
  verificarToken,
  validarRol('ADMIN'),
  listarEmpresasController
);

/**
 * @swagger
 * /api/empresas/{id}:
 *   get:
 *     summary: Obtener una empresa por ID
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empresa'
 *       404:
 *         description: Empresa no encontrada
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado (se requiere rol ADMIN)
 *       500:
 *         description: Error al obtener la empresa
 */
router.get(
  '/:id',
  verificarToken,
  validarRol('ADMIN'),
  obtenerEmpresaController
);

/**
 * @swagger
 * /api/empresas/{id}:
 *   put:
 *     summary: Actualizar una empresa
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empresa'
 *     responses:
 *       200:
 *         description: Empresa actualizada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Empresa no encontrada
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado (se requiere rol ADMIN)
 *       500:
 *         description: Error al actualizar la empresa
 */
router.put(
  '/:id',
  verificarToken,
  validarRol('ADMIN'),
  actualizarEmpresaController
);

/**
 * @swagger
 * /api/empresas/{id}:
 *   delete:
 *     summary: Eliminar una empresa
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     responses:
 *       204:
 *         description: Empresa eliminada correctamente
 *       404:
 *         description: Empresa no encontrada
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado (se requiere rol ADMIN)
 *       500:
 *         description: Error al eliminar la empresa
 */
router.delete(
  '/:id',
  verificarToken,
  validarRol('ADMIN'),
  eliminarEmpresaController
);

export default router;
