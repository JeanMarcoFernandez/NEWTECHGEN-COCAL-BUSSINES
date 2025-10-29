import { Router } from 'express';
import { cambiarContrasenaPrimerLogin } from '../controllers/cambiarContrasenaController.js';

const router = Router();

// No requiere token porque es parte del primer login (flujo abierto)
router.post('/primer-login', cambiarContrasenaPrimerLogin);

export default router;
