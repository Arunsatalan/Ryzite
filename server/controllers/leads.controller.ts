import { Request, Response } from 'express';
import { store } from '../services/store.service.ts';

export const getAllLeads = (req: Request, res: Response) => {
  res.json(store.getLeads());
};

export const createLead = (req: Request, res: Response) => {
  const { name, email, company, serviceSelected, budget, timeline, message, source } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newLead = store.addLead({
    name,
    email,
    company,
    serviceSelected,
    budget,
    timeline,
    message,
    source
  });

  // Track conversion in analytics
  store.addAnalyticsEvent({
    eventName: 'lead_submitted',
    path: '/contact',
    metadata: { service: serviceSelected, budget }
  });

  res.status(201).json({ success: true, lead: newLead });
};

export const updateLead = (req: Request, res: Response) => {
  const updated = store.updateLead(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Lead not found' });
  }
  res.json({ success: true, lead: updated });
};

export const deleteLead = (req: Request, res: Response) => {
  const deleted = store.deleteLead(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Lead not found' });
  }
  res.json({ success: true });
};

export const exportLeadsCsv = (req: Request, res: Response) => {
  const leads = store.getLeads();
  const headers = ['ID', 'Name', 'Email', 'Company', 'Service', 'Budget', 'Timeline', 'Status', 'Message', 'CreatedAt'];
  const rows = leads.map(l => [
    `"${l.id}"`,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.email || '').replace(/"/g, '""')}"`,
    `"${(l.company || '').replace(/"/g, '""')}"`,
    `"${(l.serviceSelected || '').replace(/"/g, '""')}"`,
    `"${(l.budget || '').replace(/"/g, '""')}"`,
    `"${(l.timeline || '').replace(/"/g, '""')}"`,
    `"${l.status}"`,
    `"${(l.message || '').replace(/"/g, '""')}"`,
    `"${l.createdAt}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="ryzite_leads_export.csv"');
  res.send(csvContent);
};
