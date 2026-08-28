import express, { Router } from 'express';
import { getSeoMetadata, updateSeoMetadata, getSerpAudit, exportSchemaLd } from '../controllers/seo.controller.ts';

const router: Router = express.Router();

router.get('/', getSeoMetadata);
router.put('/', updateSeoMetadata);
router.get('/audit', getSerpAudit);
router.get('/schema', exportSchemaLd);

export default router;
