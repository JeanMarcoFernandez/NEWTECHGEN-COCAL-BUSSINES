import { Router } from 'express';
import { listarUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario } from '../controllers/usuariosControlador.js';
import { verificarToken } from '../middleware/verificarToken.js';
import { validarRol } from '../middleware/validarRol.js';

const router = Router();

router.get('/', verificarToken, validarRol('ADMIN'), listarUsuarios);
router.get('/:id', verificarToken, obtenerUsuario);
router.put('/:id', verificarToken, actualizarUsuario);
router.delete('/:id', verificarToken, validarRol('ADMIN'), eliminarUsuario);

export default router;
