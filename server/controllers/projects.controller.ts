import { Request, Response } from 'express';
import { store } from '../services/store.service.ts';

export const getAllProjects = (req: Request, res: Response) => {
  res.json(store.getProjects());
};

export const createProject = (req: Request, res: Response) => {
  const newProject = store.addProject(req.body);
  res.status(201).json(newProject);
};

export const updateProject = (req: Request, res: Response) => {
  const updated = store.updateProject(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(updated);
};

export const deleteProject = (req: Request, res: Response) => {
  const deleted = store.deleteProject(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json({ success: true });
};
