import express, { Router } from 'express';
import { trackEvent, getAnalyticsSummary } from '../controllers/analytics.controller.ts';

const router: Router = express.Router();

router.post('/track', trackEvent);
router.get('/summary', getAnalyticsSummary);

export default router;
