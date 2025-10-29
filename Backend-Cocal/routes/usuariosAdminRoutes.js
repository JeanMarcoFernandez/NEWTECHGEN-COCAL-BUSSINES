// routes/usuariosAdminRoutes.js
import { Router } from 'express';
import { crearUsuarioPorAdmin } from '../controllers/usuariosAdminController.js';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

const router = Router();

















router.post('/crear', verificarToken, validarRol('ADMIN'), crearUsuarioPorAdmin);

export default router;
