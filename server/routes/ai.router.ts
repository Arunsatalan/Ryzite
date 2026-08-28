import express, { Router } from 'express';
import { generateAiEstimate } from '../controllers/ai.controller.ts';

const router: Router = express.Router();

router.post('/estimate', generateAiEstimate);

export default router;
