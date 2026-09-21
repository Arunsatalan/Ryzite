import { Router } from 'express';
import { AboutRepository } from '../repositories/about.repository.js';

export const aboutRouter = Router();

// ==========================================
// PUBLIC ABOUT ENDPOINTS
// ==========================================

// GET /api/about - Public server-rendered payload
aboutRouter.get('/about', async (req, res) => {
  try {
    const data = await AboutRepository.getPublicAboutPage();
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('[GET /api/about Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/about/preview - Preview endpoint with noindex guardrails
aboutRouter.get('/about/preview', async (req, res) => {
  try {
    // Set strictly noindex, nofollow header to prevent preview draft indexing
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    const adminData = await AboutRepository.getAdminAboutPage();
    const publicPayload = await AboutRepository.getPublicAboutPage();

    res.json({
      success: true,
      isPreview: true,
      robots: 'noindex, nofollow',
      data: {
        ...publicPayload,
        page: adminData // Override with latest draft content
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// ADMIN ABOUT CMS ENDPOINTS
// ==========================================

// GET /api/admin/about - Admin CMS full draft & section data
aboutRouter.get('/admin/about', async (req, res) => {
  try {
    const data = await AboutRepository.getAdminAboutPage();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/about - Save draft changes
aboutRouter.put('/admin/about', async (req, res) => {
  try {
    const data = await AboutRepository.saveAboutDraft(req.body);
    res.json({ success: true, message: 'About page draft saved successfully', data });
  } catch (err: any) {
    console.error('[PUT /api/admin/about Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/about/publish - Publish draft & create version snapshot
aboutRouter.post('/admin/about/publish', async (req, res) => {
  try {
    const { publishedBy = 'Admin User', reason = 'Published About page update' } = req.body;
    const data = await AboutRepository.publishAboutPage(publishedBy, reason);
    res.json({ success: true, message: 'About page published live successfully!', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/about/unpublish - Unpublish page (switch to DRAFT)
aboutRouter.post('/admin/about/unpublish', async (req, res) => {
  try {
    const data = await AboutRepository.unpublishAboutPage();
    res.json({ success: true, message: 'About page unpublished (switched to DRAFT)', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/about/history - Get version audit log
aboutRouter.get('/admin/about/history', async (req, res) => {
  try {
    const history = await AboutRepository.getVersionHistory();
    res.json({ success: true, data: history });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/about/restore - Restore version snapshot
aboutRouter.post('/admin/about/restore', async (req, res) => {
  try {
    const { versionId, changedBy } = req.body;
    if (!versionId) return res.status(400).json({ success: false, error: 'versionId is required' });
    const data = await AboutRepository.restoreVersion(versionId, changedBy);
    res.json({ success: true, message: 'Version restored to draft', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
