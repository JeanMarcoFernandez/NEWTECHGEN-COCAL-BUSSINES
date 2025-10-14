import { Router } from 'express';
import { list, listByEmpresa, create, update, remove } from '../controllers/departamentoController.js';
const router = Router();
router.get('/', list);
router.get('/empresa/:idEmpresa', listByEmpresa);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
export default router;
