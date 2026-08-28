import express, { Router } from 'express';
import { 
  getAllBlogs, 
  createBlog, 
  updateBlog, 
  deleteBlog 
} from '../controllers/blogs.controller.ts';

const router: Router = express.Router();

router.get('/', getAllBlogs);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;
