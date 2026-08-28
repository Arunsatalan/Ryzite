import { Request, Response } from 'express';
import { store } from '../services/store.service.ts';

export const trackEvent = (req: Request, res: Response) => {
  const { eventName, path, referrer, metadata } = req.body;
  const ev = store.addAnalyticsEvent({
    eventName: eventName || 'custom_event',
    path: path || '/',
    referrer,
    metadata
  });
  res.json({ tracked: true, event: ev });
};

export const getAnalyticsSummary = (req: Request, res: Response) => {
  const summary = store.getAnalyticsSummary();
  res.json(summary);
};
