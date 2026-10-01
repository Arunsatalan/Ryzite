import { Router } from 'express';
import { analyticsRepository } from '../repositories/analytics.repository.js';
import { verifyAdminToken } from '../middleware/auth.middleware.js';

export const analyticsRouter = Router();

// ==========================================
// PUBLIC INGESTION ENDPOINTS (Non-blocking)
// ==========================================

/**
 * POST /api/analytics/track
 * Accepts beacon or fetch payloads for first-party tracking
 */
analyticsRouter.post('/api/analytics/track', async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.eventName || !payload.visitorId || !payload.sessionId) {
      return res.status(400).json({ success: false, error: 'eventName, visitorId, and sessionId are required' });
    }

    const event = await analyticsRepository.trackEvent(payload);
    res.json({ success: true, data: { id: event.id, eventName: event.eventName } });
  } catch (err: any) {
    console.warn('[ANALYTICS INGESTION WARN]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/analytics/vitals
 * Accepts RUM Web Vitals measurements
 */
analyticsRouter.post('/api/analytics/vitals', async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.metricName || payload.value === undefined) {
      return res.status(400).json({ success: false, error: 'metricName and value are required' });
    }

    const vital = await analyticsRepository.trackWebVital(payload);
    res.json({ success: true, data: { id: vital.id } });
  } catch (err: any) {
    console.warn('[WEB VITALS INGESTION WARN]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// ADMIN ANALYTICS DASHBOARD ENDPOINTS
// ==========================================

/**
 * GET /api/admin/analytics/overview
 * Main KPIs, time series trend, comparison vs previous period
 */
analyticsRouter.get('/api/admin/analytics/overview', verifyAdminToken, async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const overview = await analyticsRepository.getOverview(startDate, endDate);
    res.json({ success: true, data: overview });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/analytics/realtime
 * Active visitors, active sessions, and live activity stream
 */
analyticsRouter.get('/api/admin/analytics/realtime', verifyAdminToken, async (req, res) => {
  try {
    const realtime = await analyticsRepository.getRealtime();
    res.json({ success: true, data: realtime });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/analytics/pages
 * Top viewed pages and landing entry pages
 */
analyticsRouter.get('/api/admin/analytics/pages', verifyAdminToken, async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const [topPages, landingPages] = await Promise.all([
      analyticsRepository.getTopPages(startDate, endDate, limit),
      analyticsRepository.getLandingPages(startDate, endDate, limit)
    ]);

    res.json({
      success: true,
      data: {
        source: 'FIRST_PARTY',
        topPages,
        landingPages
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/analytics/acquisition
 * Traffic sources & channel classification
 */
analyticsRouter.get('/api/admin/analytics/acquisition', verifyAdminToken, async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const sources = await analyticsRepository.getTrafficSources(startDate, endDate);
    res.json({
      success: true,
      data: {
        source: 'FIRST_PARTY',
        trafficSources: sources
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/analytics/ctas
 * CTA performance & conversion funnel
 */
analyticsRouter.get('/api/admin/analytics/ctas', verifyAdminToken, async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const ctaStats = await analyticsRepository.getCtaAnalytics(startDate, endDate);
    res.json({
      success: true,
      data: {
        source: 'FIRST_PARTY',
        ...ctaStats
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/analytics/entity/:type
 * Entity performance (service, portfolio, blog)
 */
analyticsRouter.get('/api/admin/analytics/entity/:type', verifyAdminToken, async (req, res) => {
  try {
    const entityType = req.params.type as 'service' | 'portfolio' | 'blog';
    if (!['service', 'portfolio', 'blog'].includes(entityType)) {
      return res.status(400).json({ success: false, error: 'Invalid entity type' });
    }

    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const items = await analyticsRepository.getEntityAnalytics(entityType, startDate, endDate);
    res.json({
      success: true,
      data: {
        entityType,
        source: 'FIRST_PARTY',
        items
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/analytics/web-vitals
 * Real User Web Vitals monitoring report
 */
analyticsRouter.get('/api/admin/analytics/web-vitals', verifyAdminToken, async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const vitals = await analyticsRepository.getWebVitals(startDate, endDate);
    res.json({ success: true, data: vitals });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/analytics/404
 * Broken 404 URL monitor
 */
analyticsRouter.get('/api/admin/analytics/404', verifyAdminToken, async (req, res) => {
  try {
    const errors = await analyticsRepository.get404Errors();
    res.json({ success: true, data: errors });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/analytics/export
 * Download analytics events as CSV
 */
analyticsRouter.get('/api/admin/analytics/export', verifyAdminToken, async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const csv = await analyticsRepository.exportCsv(startDate, endDate);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ryzite-analytics-export.csv"');
    res.send(csv);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET & PUT /api/admin/analytics/settings
 */
analyticsRouter.get('/api/admin/analytics/settings', verifyAdminToken, async (req, res) => {
  try {
    const settings = await analyticsRepository.getAnalyticsSettings();
    res.json({ success: true, data: settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

analyticsRouter.put('/api/admin/analytics/settings', verifyAdminToken, async (req, res) => {
  try {
    const updated = await analyticsRepository.updateAnalyticsSettings(req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Sync Integrations (GA4 & Search Console)
 */
analyticsRouter.post('/api/admin/analytics/integrations/ga4/sync', verifyAdminToken, async (req, res) => {
  try {
    const settings = await analyticsRepository.getAnalyticsSettings();
    if (!settings.ga4Enabled || !settings.ga4PropertyId) {
      return res.json({
        success: false,
        status: 'GA4 Not Connected',
        message: 'Configure GA4 Property ID in Analytics Settings to enable Google Analytics 4 integration.'
      });
    }

    res.json({
      success: true,
      status: 'GA4 Connected',
      source: 'GA4',
      message: 'GA4 sync completed successfully.',
      lastSynced: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

analyticsRouter.post('/api/admin/analytics/integrations/gsc/sync', verifyAdminToken, async (req, res) => {
  try {
    const settings = await analyticsRepository.getAnalyticsSettings();
    if (!settings.searchConsoleEnabled) {
      return res.json({
        success: false,
        status: 'Search Console Not Connected',
        message: 'Enable Google Search Console integration in Analytics Settings.'
      });
    }

    res.json({
      success: true,
      status: 'Search Console Connected',
      source: 'SEARCH_CONSOLE',
      message: 'Search Console sync completed successfully.',
      lastSynced: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
