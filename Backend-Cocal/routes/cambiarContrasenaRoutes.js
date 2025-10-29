import { Router } from 'express';
import { cambiarContrasenaPrimerLogin } from '../controllers/cambiarContrasenaController.js';

const router = Router();
router.post('/primer-login', cambiarContrasenaPrimerLogin);

export default router;
