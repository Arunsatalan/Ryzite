const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class WebAnalyticsTracker {
  private visitorId: string = '';
  private sessionId: string = '';
  private lastActivityTime: number = Date.now();
  private trackedScrollDepths: Set<number> = new Set();
  private currentPath: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVisitorAndSession();
    }
  }

  /**
   * Initialize pseudonymous Visitor ID and 30-min Session ID
   */
  private initVisitorAndSession() {
    try {
      // 1. Visitor ID (localStorage)
      let storedVisitor = localStorage.getItem('ryzite_visitor_id');
      if (!storedVisitor) {
        storedVisitor = 'v_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('ryzite_visitor_id', storedVisitor);
      }
      this.visitorId = storedVisitor;

      // 2. Session ID (sessionStorage with 30 min timeout)
      const SESSION_TIMEOUT = 30 * 60 * 1000;
      let storedSession = sessionStorage.getItem('ryzite_session_id');
      let lastTime = parseInt(sessionStorage.getItem('ryzite_session_last_active') || '0', 10);

      if (!storedSession || Date.now() - lastTime > SESSION_TIMEOUT) {
        storedSession = 's_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        sessionStorage.setItem('ryzite_session_id', storedSession);
      }

      this.sessionId = storedSession;
      sessionStorage.setItem('ryzite_session_last_active', Date.now().toString());
    } catch (e) {
      this.visitorId = 'v_fallback_' + Math.random().toString(36).substring(2, 9);
      this.sessionId = 's_fallback_' + Math.random().toString(36).substring(2, 9);
    }
  }

  /**
   * Extract UTM parameters from URL query string
   */
  private getUtmParams() {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
      utmContent: params.get('utm_content') || undefined,
      utmTerm: params.get('utm_term') || undefined
    };
  }

  /**
   * Detect device type
   */
  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'desktop';
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
    return 'desktop';
  }

  /**
   * Send analytics event non-blockingly
   */
  public trackEvent(eventName: string, extraData: Record<string, any> = {}) {
    if (typeof window === 'undefined') return;

    try {
      this.initVisitorAndSession();

      const referrer = document.referrer || '';
      let referrerHost = '';
      if (referrer) {
        try {
          referrerHost = new URL(referrer).hostname;
        } catch (e) {}
      }

      const utms = this.getUtmParams();

      const payload = {
        eventName,
        occurredAt: new Date().toISOString(),
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        pageUrl: window.location.href,
        pagePath: window.location.pathname,
        pageTitle: document.title,
        referrer,
        referrerHost,
        deviceType: this.getDeviceType(),
        language: navigator.language || 'en',
        ...utms,
        ...extraData
      };

      const url = `${API_BASE}/api/analytics/track`;
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });

      if (navigator.sendBeacon && navigator.sendBeacon(url, blob)) {
        return;
      }

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(err => {
        console.warn('[ANALYTICS SILENT WARN]', err.message);
      });
    } catch (err: any) {
      console.warn('[ANALYTICS SILENT EXCEPTION]', err.message);
    }
  }

  /**
   * Track Page View
   */
  public trackPageView(path?: string, title?: string) {
    if (typeof window === 'undefined') return;
    const currentPath = path || window.location.pathname;
    this.currentPath = currentPath;
    this.trackedScrollDepths.clear();

    this.trackEvent('PAGE_VIEW', {
      pagePath: currentPath,
      pageTitle: title || document.title
    });
  }

  /**
   * Track Scroll Depth (25%, 50%, 75%, 90%)
   */
  public trackScrollDepth(percentage: number) {
    if (this.trackedScrollDepths.has(percentage)) return;
    this.trackedScrollDepths.add(percentage);
    this.trackEvent(`SCROLL_${percentage}`, {
      depthPercentage: percentage,
      pagePath: this.currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/')
    });
  }

  /**
   * Track Outbound Click
   */
  public trackOutboundClick(targetUrl: string, linkText?: string) {
    let domain = '';
    try {
      domain = new URL(targetUrl).hostname;
    } catch (e) {
      domain = targetUrl;
    }

    this.trackEvent('OUTBOUND_CLICK', {
      targetUrl,
      targetDomain: domain,
      linkText
    });
  }

  /**
   * Track Download
   */
  public trackDownload(fileUrl: string, fileName?: string) {
    this.trackEvent('DOWNLOAD', {
      fileUrl,
      fileName: fileName || fileUrl.split('/').pop()
    });
  }

  /**
   * Track RUM Web Vital Metric
   */
  public trackWebVital(metricName: string, value: number, rating: 'GOOD' | 'NEEDS_IMPROVEMENT' | 'POOR') {
    if (typeof window === 'undefined') return;

    try {
      const payload = {
        metricName,
        value: Number(value.toFixed(2)),
        rating,
        pagePath: window.location.pathname,
        deviceType: this.getDeviceType(),
        visitorId: this.visitorId
      };

      const url = `${API_BASE}/api/analytics/vitals`;
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    } catch (e) {}
  }
}

export const webAnalyticsTracker = new WebAnalyticsTracker();
