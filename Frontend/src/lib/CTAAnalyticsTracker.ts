/**
 * CTA Analytics Tracker Utility
 * Async non-blocking tracking engine for Final CTA conversions.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function getCtaSessionId(): string {
  if (typeof window === 'undefined') return 'server-side';
  let sessionId = sessionStorage.getItem('ryzite_cta_session_id');
  if (!sessionId) {
    sessionId = `cta-sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('ryzite_cta_session_id', sessionId);
  }
  return sessionId;
}

export function getDeviceType(): string {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export const ctaAnalyticsTracker = {
  async trackImpression(params: {
    ctaId: string;
    pageType?: string;
    pageId?: string;
  }) {
    try {
      if (typeof window === 'undefined' || !params.ctaId) return;
      
      const payload = {
        ctaId: params.ctaId,
        pageUrl: window.location.pathname + window.location.search,
        pageType: params.pageType || 'home',
        pageId: params.pageId || null,
        sessionId: getCtaSessionId(),
        deviceType: getDeviceType(),
        referrer: document.referrer || null
      };

      fetch(`${API_BASE}/api/analytics/cta/impression`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('[CTA TRACKING SILENT FAIL]', err));
    } catch (e) {
      // Never block UI execution
    }
  },

  async trackClick(params: {
    ctaId: string;
    actionType: 'primary' | 'secondary' | 'tertiary';
    pageType?: string;
    pageId?: string;
  }) {
    try {
      if (typeof window === 'undefined' || !params.ctaId) return;

      const payload = {
        ctaId: params.ctaId,
        actionType: params.actionType,
        pageUrl: window.location.pathname + window.location.search,
        pageType: params.pageType || 'home',
        pageId: params.pageId || null,
        sessionId: getCtaSessionId(),
        deviceType: getDeviceType(),
        referrer: document.referrer || null
      };

      fetch(`${API_BASE}/api/analytics/cta/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('[CTA TRACKING SILENT FAIL]', err));
    } catch (e) {
      // Never block UI execution
    }
  },

  async trackContactOpen(params: {
    ctaId: string;
    pageType?: string;
    pageId?: string;
  }) {
    try {
      if (typeof window === 'undefined' || !params.ctaId) return;

      const payload = {
        ctaId: params.ctaId,
        pageUrl: window.location.pathname + window.location.search,
        pageType: params.pageType || 'home',
        pageId: params.pageId || null,
        sessionId: getCtaSessionId(),
        deviceType: getDeviceType(),
        referrer: document.referrer || null
      };

      fetch(`${API_BASE}/api/analytics/cta/contact-start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('[CTA TRACKING SILENT FAIL]', err));
    } catch (e) {
      // Never block UI execution
    }
  }
};
