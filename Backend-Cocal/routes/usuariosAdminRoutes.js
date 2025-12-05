import { Router } from 'express';
import { crearUsuarioPorAdmin,moverUsuarioADepartamento,quitarUsuarioDeDepartamento } from '../controllers/usuariosAdminController.js';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios (Administrador)
 *   description: Endpoints exclusivos para la creación de usuarios por parte del administrador.
 */

/**
 * @swagger
 * /api/usuarios-admin/crear:
 *   post:
 *     summary: Crear un nuevo usuario por un administrador
 *     description: Permite al administrador registrar un nuevo usuario dentro de la empresa. El usuario creado deberá cambiar su contraseña en su primer inicio de sesión.
 *     tags: [Usuarios (Administrador)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contrasena
 *               - nombre
 *               - apellido
 *               - cargo
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: empleado@empresa.com
 *               contrasena:
 *                 type: string
 *                 example: "Password123!"
 *               nombre:
 *                 type: string
 *                 example: "Juan"
 *               apellido:
 *                 type: string
 *                 example: "Pérez"
 *               cargo:
 *                 type: string
 *                 example: "Analista de sistemas"
 *               rol:
 *                 type: string
 *                 enum: [ADMIN, CLIENTE]
 *                 example: "EMPLEADO"
 *               telefono:
 *                 type: string
 *                 example: "78123457"
 *               id_departamento:
 *                 type: integer    
 *                 example: 3
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Usuario creado correctamente. Debe cambiar su contraseña en su primer inicio de sesión."
 *       400:
 *         description: Ya existe un usuario con ese correo
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Ya existe un usuario con ese correo."
 *       403:
 *         description: El usuario autenticado no tiene permisos de administrador
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "No tiene permisos para crear usuarios."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Error al crear usuario por administrador"
 */

router.post('/crear', verificarToken, validarRol('ADMIN'), crearUsuarioPorAdmin);
/**
 * @swagger
 * /api/usuarios-admin/{idUsuario}/departamento:
 *   patch:
 *     summary: Asignar o mover un usuario a un departamento
 *     description: Permite al administrador asignar un usuario a un departamento específico dentro de la misma empresa.
 *     tags:
 *       - Usuarios (Administrador)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: idUsuario
 *         in: path
 *         required: true
 *         description: ID del usuario que será movido de departamento
 *         schema:
 *           type: integer
 *           example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_departamento
 *             properties:
 *               id_departamento:
 *                 type: integer
 *                 description: Nuevo departamento al que será asignado el usuario
 *                 example: 5
 *     responses:
 *       200:
 *         description: Usuario movido correctamente al nuevo departamento.
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Usuario movido al departamento Sistemas."
 *               usuario:
 *                 id: 12
 *                 nombre: "Carlos"
 *                 apellido: "Quispe"
 *                 id_departamento: 5
 *       400:
 *         description: Error de validación (departamento no existe o datos faltantes)
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "El departamento especificado no existe."
 *       403:
 *         description: El administrador intenta mover un usuario que no pertenece a su empresa
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "No puede mover usuarios que pertenecen a otra empresa."
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Usuario no encontrado."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Error al mover usuario de departamento."
 */

router.patch(
  '/:idUsuario/departamento',
  verificarToken,
  validarRol('ADMIN'),
  moverUsuarioADepartamento
);

/**
 * @swagger
 * /api/usuarios-admin/{idUsuario}/departamento:
 *   delete:
 *     summary: Quitar el departamento asignado a un usuario
 *     description: Permite al administrador eliminar la asignación de un usuario a un departamento, dejándolo sin departamento.
 *     tags:
 *       - Usuarios (Administrador)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: idUsuario
 *         in: path
 *         required: true
 *         description: ID del usuario al que se le quitará el departamento
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Departamento eliminado correctamente
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Departamento eliminado del usuario."
 *               usuario:
 *                 id: 12
 *                 nombre: "Carlos"
 *                 apellido: "Quispe"
 *                 id_departamento: null
 *       403:
 *         description: El administrador no tiene permisos o el usuario es de otra empresa
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "No puede modificar usuarios de otra empresa."
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Usuario no encontrado."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Error al quitar el departamento del usuario."
 */

router.delete(
  '/:idUsuario/departamento',
  verificarToken,
  validarRol('ADMIN'),
  quitarUsuarioDeDepartamento
);
export default router;
