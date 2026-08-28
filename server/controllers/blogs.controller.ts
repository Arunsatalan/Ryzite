import { Request, Response } from 'express';
import { store } from '../services/store.service.ts';

export const getAllBlogs = (req: Request, res: Response) => {
  res.json(store.getBlogs());
};

export const createBlog = (req: Request, res: Response) => {
  const newBlog = store.addBlog(req.body);
  res.status(201).json(newBlog);
};

export const updateBlog = (req: Request, res: Response) => {
  const updated = store.updateBlog(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  res.json(updated);
};

export const deleteBlog = (req: Request, res: Response) => {
  const deleted = store.deleteBlog(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  res.json({ success: true });
};
