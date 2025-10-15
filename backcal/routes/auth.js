import { Router } from 'express';
import { login, me, seedAdmin } from '../controllers/authController.js';
const router = Router();

router.post('/login', login);
router.get('/me', me);
router.post('/seed-admin', seedAdmin); 

export default router;
