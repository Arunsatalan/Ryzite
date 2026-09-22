import { Router } from 'express';
import { finalCtaRepository } from '../repositories/finalCta.repository.js';
import { verifyAdminToken } from '../middleware/auth.middleware.js';

export const finalCtaRouter = Router();

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

/**
 * GET /api/final-cta
 * Resolves active CTA according to priority rules: Page Override -> Service/Category CTA -> Global CTA -> Safe Fallback.
 * Query Params: page (e.g. 'home', 'service', 'portfolio', 'blog', 'about'), id (e.g. 'ai-automation')
 */
finalCtaRouter.get('/api/final-cta', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const pageType = (req.query.page as string) || (req.query.pageType as string);
    const pageId = (req.query.id as string) || (req.query.pageId as string);

    const cta = await finalCtaRepository.getPublicCta(pageType, pageId);
    res.json({ success: true, data: cta });
  } catch (err: any) {
    console.error('[FINAL CTA PUBLIC API ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// ANALYTICS LOGGING ENDPOINTS
// ==========================================

finalCtaRouter.post('/api/analytics/cta/impression', async (req, res) => {
  try {
    const event = await finalCtaRepository.recordAnalyticsEvent({
      ...req.body,
      eventType: 'cta_impression'
    });
    res.json({ success: true, data: event });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

finalCtaRouter.post('/api/analytics/cta/click', async (req, res) => {
  try {
    const { actionType = 'primary', ...rest } = req.body;
    const eventType = actionType === 'secondary'
      ? 'cta_secondary_click'
      : actionType === 'tertiary'
      ? 'cta_tertiary_click'
      : 'cta_primary_click';

    const event = await finalCtaRepository.recordAnalyticsEvent({
      ...rest,
      eventType
    });
    res.json({ success: true, data: event });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

finalCtaRouter.post('/api/analytics/cta/contact-start', async (req, res) => {
  try {
    const event = await finalCtaRepository.recordAnalyticsEvent({
      ...req.body,
      eventType: 'cta_contact_open'
    });
    res.json({ success: true, data: event });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

finalCtaRouter.post('/api/analytics/cta/lead', async (req, res) => {
  try {
    const event = await finalCtaRepository.recordAnalyticsEvent({
      ...req.body,
      eventType: 'cta_lead_created'
    });
    res.json({ success: true, data: event });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// ADMIN CMS ENDPOINTS
// ==========================================

finalCtaRouter.get('/api/admin/final-ctas', verifyAdminToken, async (req, res) => {
  try {
    const ctas = await finalCtaRepository.getAllAdminCtas();
    res.json({ success: true, data: ctas });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

finalCtaRouter.get('/api/admin/final-cta-summary', verifyAdminToken, async (req, res) => {
  try {
    const summary = await finalCtaRepository.getAnalyticsSummary();
    const performanceByPage = await finalCtaRepository.getPerformanceByPage();
    res.json({ success: true, data: { ...summary, performanceByPage } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

finalCtaRouter.get('/api/admin/final-ctas/:id', verifyAdminToken, async (req, res) => {
  try {
    const cta = await finalCtaRepository.getCtaById(req.params.id);
    if (!cta) {
      return res.status(404).json({ success: false, error: 'CTA not found' });
    }
    res.json({ success: true, data: cta });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

finalCtaRouter.post('/api/admin/final-ctas', verifyAdminToken, async (req, res) => {
  try {
    const created = await finalCtaRepository.createCta(req.body, (req as any).user?.name || 'Admin');
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

finalCtaRouter.put('/api/admin/final-ctas/:id', verifyAdminToken, async (req, res) => {
  try {
    const updated = await finalCtaRepository.updateCta(req.params.id, req.body, (req as any).user?.name || 'Admin');
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

finalCtaRouter.delete('/api/admin/final-ctas/:id', verifyAdminToken, async (req, res) => {
  try {
    await finalCtaRepository.deleteCta(req.params.id);
    res.json({ success: true, data: { success: true } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

finalCtaRouter.post('/api/admin/final-ctas/:id/activate', verifyAdminToken, async (req, res) => {
  try {
    const updated = await finalCtaRepository.activateCta(req.params.id);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

finalCtaRouter.post('/api/admin/final-ctas/:id/deactivate', verifyAdminToken, async (req, res) => {
  try {
    const updated = await finalCtaRepository.deactivateCta(req.params.id);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

finalCtaRouter.post('/api/admin/final-ctas/:id/duplicate', verifyAdminToken, async (req, res) => {
  try {
    const duplicated = await finalCtaRepository.duplicateCta(req.params.id, (req as any).user?.name || 'Admin');
    res.status(201).json({ success: true, data: duplicated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

finalCtaRouter.get('/api/admin/final-ctas/:id/versions', verifyAdminToken, async (req, res) => {
  try {
    const versions = await finalCtaRepository.getCtaVersions(req.params.id);
    res.json({ success: true, data: versions });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

finalCtaRouter.post('/api/admin/final-ctas/:id/restore', verifyAdminToken, async (req, res) => {
  try {
    const { versionId } = req.body;
    if (!versionId) {
      return res.status(400).json({ success: false, error: 'versionId is required' });
    }
    const restored = await finalCtaRepository.restoreCtaVersion(req.params.id, versionId, (req as any).user?.name || 'Admin');
    res.json({ success: true, data: restored });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

finalCtaRouter.get('/api/admin/final-ctas/:id/health', verifyAdminToken, async (req, res) => {
  try {
    const health = await finalCtaRepository.checkCtaHealth(req.params.id);
    res.json({ success: true, data: health });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

finalCtaRouter.get('/api/admin/final-cta-overrides', verifyAdminToken, async (req, res) => {
  try {
    const overrides = await finalCtaRepository.getOverrides();
    res.json({ success: true, data: overrides });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

finalCtaRouter.post('/api/admin/final-cta-overrides', verifyAdminToken, async (req, res) => {
  try {
    const override = await finalCtaRepository.createOverride(req.body);
    res.status(201).json({ success: true, data: override });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

finalCtaRouter.delete('/api/admin/final-cta-overrides/:id', verifyAdminToken, async (req, res) => {
  try {
    await finalCtaRepository.deleteOverride(req.params.id);
    res.json({ success: true, data: { success: true } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
