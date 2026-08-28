import express, { Router } from 'express';
import { 
  getAllServices, 
  createService, 
  updateService, 
  deleteService 
} from '../controllers/services.controller.ts';

const router: Router = express.Router();

router.get('/', getAllServices);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;
