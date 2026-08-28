import { Request, Response } from 'express';
import { store } from '../services/store.service.ts';

export const getAllServices = (req: Request, res: Response) => {
  res.json(store.getServices());
};

export const createService = (req: Request, res: Response) => {
  const newService = store.addService(req.body);
  res.status(201).json(newService);
};

export const updateService = (req: Request, res: Response) => {
  const updated = store.updateService(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json(updated);
};

export const deleteService = (req: Request, res: Response) => {
  const deleted = store.deleteService(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json({ success: true });
};
