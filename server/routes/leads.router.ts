import express, { Router } from 'express';
import { 
  getAllLeads, 
  createLead, 
  updateLead, 
  deleteLead, 
  exportLeadsCsv 
} from '../controllers/leads.controller.ts';

const router: Router = express.Router();

router.get('/', getAllLeads);
router.post('/', createLead);
router.patch('/:id', updateLead);
router.delete('/:id', deleteLead);
router.get('/export/csv', exportLeadsCsv);

export default router;
