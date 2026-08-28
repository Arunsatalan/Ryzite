import express, { Router } from 'express';
import { 
  getAllProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../controllers/projects.controller.ts';

const router: Router = express.Router();

router.get('/', getAllProjects);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
