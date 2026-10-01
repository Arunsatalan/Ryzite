import { prisma } from './prisma.js';

export const analyticsRepository = {
  /**
   * Ingest first-party analytics event
   */
  async trackEvent(data: {
    eventId?: string;
    eventName: string;
    occurredAt?: Date;
    visitorId: string;
    sessionId: string;
    pageUrl: string;
    pagePath: string;
    pageTitle?: string;
    referrer?: string;
    referrerHost?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    deviceType?: string;
    browser?: string;
    os?: string;
    country?: string;
    language?: string;
    entityType?: string;
    entityId?: string;
    ctaId?: string;
    metadata?: any;
  }) {
    // 1. Log 404 URL if event is 404
    if (data.eventName === '404' && data.pagePath) {
      try {
        await prisma.brokenUrl404.upsert({
          where: { url: data.pagePath },
          update: {
            hitCount: { increment: 1 },
            referrer: data.referrer || undefined
          },
          create: {
            url: data.pagePath,
            referrer: data.referrer || null,
            hitCount: 1
          }
        });
      } catch (err: any) {
        console.warn('[ANALYTICS 404 TRACK WARN]', err.message);
      }
    }

    // 2. Insert Event
    const created = await prisma.analyticsEvent.create({
      data: {
        eventId: data.eventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        eventName: data.eventName,
        occurredAt: data.occurredAt ? new Date(data.occurredAt) : new Date(),
        visitorId: data.visitorId,
        sessionId: data.sessionId,
        pageUrl: data.pageUrl,
        pagePath: data.pagePath,
        pageTitle: data.pageTitle || null,
        referrer: data.referrer || null,
        referrerHost: data.referrerHost || null,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        utmContent: data.utmContent || null,
        utmTerm: data.utmTerm || null,
        deviceType: data.deviceType || 'desktop',
        browser: data.browser || 'Unknown',
        os: data.os || 'Unknown',
        country: data.country || 'Global',
        language: data.language || 'en',
        entityType: data.entityType || null,
        entityId: data.entityId || null,
        ctaId: data.ctaId || null,
        metadata: data.metadata || null
      }
    });

    return created;
  },

  /**
   * Track RUM Web Vital metric
   */
  async trackWebVital(data: {
    metricName: string;
    value: number;
    rating: string;
    pagePath: string;
    deviceType?: string;
    visitorId?: string;
  }) {
    return prisma.webVitalMetric.create({
      data: {
        metricName: data.metricName,
        value: Number(data.value),
        rating: data.rating || 'GOOD',
        pagePath: data.pagePath || '/',
        deviceType: data.deviceType || 'desktop',
        visitorId: data.visitorId || null
      }
    });
  },

  /**
   * Get Realtime Dashboard Metrics (Active visitors in last 5 min)
   */
  async getRealtime() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const [recentEvents, activeVisitorsRaw, activeSessionsRaw] = await Promise.all([
      prisma.analyticsEvent.findMany({
        where: { occurredAt: { gte: fiveMinutesAgo } },
        orderBy: { occurredAt: 'desc' },
        take: 20
      }),
      prisma.analyticsEvent.groupBy({
        by: ['visitorId'],
        where: { occurredAt: { gte: fiveMinutesAgo } }
      }),
      prisma.analyticsEvent.groupBy({
        by: ['sessionId'],
        where: { occurredAt: { gte: fiveMinutesAgo } }
      })
    ]);

    // Current page distribution
    const pagesMap: Record<string, number> = {};
    recentEvents.forEach(evt => {
      if (evt.pagePath) {
        pagesMap[evt.pagePath] = (pagesMap[evt.pagePath] || 0) + 1;
      }
    });

    const currentPageDistribution = Object.entries(pagesMap).map(([page, count]) => ({
      page,
      activeVisitors: count
    })).sort((a, b) => b.activeVisitors - a.activeVisitors);

    return {
      activeVisitors: activeVisitorsRaw.length,
      activeSessions: activeSessionsRaw.length,
      currentPageDistribution,
      recentEvents: recentEvents.map(e => ({
        id: e.id,
        eventName: e.eventName,
        pagePath: e.pagePath,
        deviceType: e.deviceType,
        occurredAt: e.occurredAt,
        visitorId: e.visitorId.slice(0, 8) + '...'
      }))
    };
  },

  /**
   * Get Main Overview KPIs & Comparison Stats
   */
  async getOverview(startDate?: Date, endDate?: Date) {
    const end = endDate || new Date();
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const durationMs = end.getTime() - start.getTime();

    const prevStart = new Date(start.getTime() - durationMs);
    const prevEnd = new Date(start.getTime());

    // Current Period Counts
    const [
      pageViews,
      uniqueVisitorsRaw,
      sessionsRaw,
      ctaClicks,
      contactStarts,
      leadsCount,
      outboundClicks,
      downloads
    ] = await Promise.all([
      prisma.analyticsEvent.count({
        where: { eventName: 'PAGE_VIEW', occurredAt: { gte: start, lte: end } }
      }),
      prisma.analyticsEvent.groupBy({
        by: ['visitorId'],
        where: { occurredAt: { gte: start, lte: end } }
      }),
      prisma.analyticsEvent.groupBy({
        by: ['sessionId'],
        where: { occurredAt: { gte: start, lte: end } }
      }),
      prisma.analyticsEvent.count({
        where: { eventName: { in: ['CTA_CLICK', 'cta_primary_click', 'cta_secondary_click', 'cta_tertiary_click'] }, occurredAt: { gte: start, lte: end } }
      }),
      prisma.analyticsEvent.count({
        where: { eventName: { in: ['CONTACT_START', 'cta_contact_open'] }, occurredAt: { gte: start, lte: end } }
      }),
      prisma.lead.count({
        where: { createdAt: { gte: start, lte: end } }
      }),
      prisma.analyticsEvent.count({
        where: { eventName: 'OUTBOUND_CLICK', occurredAt: { gte: start, lte: end } }
      }),
      prisma.analyticsEvent.count({
        where: { eventName: 'DOWNLOAD', occurredAt: { gte: start, lte: end } }
      })
    ]);

    // Previous Period Counts (for % change calculation)
    const [
      prevPageViews,
      prevVisitorsRaw,
      prevSessionsRaw,
      prevLeadsCount
    ] = await Promise.all([
      prisma.analyticsEvent.count({
        where: { eventName: 'PAGE_VIEW', occurredAt: { gte: prevStart, lte: prevEnd } }
      }),
      prisma.analyticsEvent.groupBy({
        by: ['visitorId'],
        where: { occurredAt: { gte: prevStart, lte: prevEnd } }
      }),
      prisma.analyticsEvent.groupBy({
        by: ['sessionId'],
        where: { occurredAt: { gte: prevStart, lte: prevEnd } }
      }),
      prisma.lead.count({
        where: { createdAt: { gte: prevStart, lte: prevEnd } }
      })
    ]);

    const uniqueVisitors = uniqueVisitorsRaw.length;
    const sessions = sessionsRaw.length;
    const prevUniqueVisitors = prevVisitorsRaw.length;
    const prevSessions = prevSessionsRaw.length;

    const pagesPerSession = sessions > 0 ? Number((pageViews / sessions).toFixed(1)) : 0;
    const ctaCtr = pageViews > 0 ? Number(((ctaClicks / pageViews) * 100).toFixed(2)) : 0;
    const leadConversionRate = sessions > 0 ? Number(((leadsCount / sessions) * 100).toFixed(2)) : 0;

    // Helper for percentage change calculation
    const calcChange = (current: number, prev: number) => {
      if (prev === 0) return current > 0 ? 100 : 0;
      return Number((((current - prev) / prev) * 100).toFixed(1));
    };

    // Time-series daily trend data
    const timeSeriesData = await this.getTimeSeriesTrend(start, end);

    return {
      source: 'FIRST_PARTY',
      period: { start, end },
      kpis: {
        pageViews: { value: pageViews, change: calcChange(pageViews, prevPageViews) },
        uniqueVisitors: { value: uniqueVisitors, change: calcChange(uniqueVisitors, prevUniqueVisitors) },
        sessions: { value: sessions, change: calcChange(sessions, prevSessions) },
        pagesPerSession: { value: pagesPerSession, change: 0 },
        ctaClicks: { value: ctaClicks, change: 0 },
        ctaCtr: { value: ctaCtr, change: 0 },
        contactStarts: { value: contactStarts, change: 0 },
        leads: { value: leadsCount, change: calcChange(leadsCount, prevLeadsCount) },
        leadConversionRate: { value: leadConversionRate, change: 0 },
        outboundClicks: { value: outboundClicks, change: 0 },
        downloads: { value: downloads, change: 0 }
      },
      timeSeries: timeSeriesData
    };
  },

  /**
   * Helper: Generate time-series daily aggregations
   */
  async getTimeSeriesTrend(start: Date, end: Date) {
    const events = await prisma.analyticsEvent.findMany({
      where: { occurredAt: { gte: start, lte: end } },
      select: { occurredAt: true, eventName: true, visitorId: true }
    });

    const dayMap: Record<string, { date: string; pageViews: number; visitors: Set<string>; ctaClicks: number }> = {};

    events.forEach(evt => {
      const dateKey = evt.occurredAt.toISOString().split('T')[0];
      if (!dayMap[dateKey]) {
        dayMap[dateKey] = { date: dateKey, pageViews: 0, visitors: new Set(), ctaClicks: 0 };
      }
      if (evt.eventName === 'PAGE_VIEW') {
        dayMap[dateKey].pageViews++;
      }
      if (evt.eventName.includes('CTA_CLICK') || evt.eventName.includes('cta_')) {
        dayMap[dateKey].ctaClicks++;
      }
      dayMap[dateKey].visitors.add(evt.visitorId);
    });

    return Object.values(dayMap).map(d => ({
      date: d.date,
      pageViews: d.pageViews,
      uniqueVisitors: d.visitors.size,
      ctaClicks: d.ctaClicks
    })).sort((a, b) => a.date.localeCompare(b.date));
  },

  /**
   * Get Top Pages Performance Table
   */
  async getTopPages(startDate?: Date, endDate?: Date, limit: number = 20) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const events = await prisma.analyticsEvent.findMany({
      where: { occurredAt: { gte: start, lte: end } },
      select: { pagePath: true, eventName: true, visitorId: true, sessionId: true }
    });

    const pageStatsMap: Record<string, {
      pagePath: string;
      views: number;
      visitors: Set<string>;
      sessions: Set<string>;
      ctaClicks: number;
      contactStarts: number;
    }> = {};

    events.forEach(evt => {
      const path = evt.pagePath || '/';
      if (!pageStatsMap[path]) {
        pageStatsMap[path] = {
          pagePath: path,
          views: 0,
          visitors: new Set(),
          sessions: new Set(),
          ctaClicks: 0,
          contactStarts: 0
        };
      }
      if (evt.eventName === 'PAGE_VIEW') {
        pageStatsMap[path].views++;
      }
      if (evt.eventName.includes('CTA_CLICK') || evt.eventName.includes('cta_')) {
        pageStatsMap[path].ctaClicks++;
      }
      if (evt.eventName.includes('CONTACT')) {
        pageStatsMap[path].contactStarts++;
      }
      pageStatsMap[path].visitors.add(evt.visitorId);
      pageStatsMap[path].sessions.add(evt.sessionId);
    });

    const results = Object.values(pageStatsMap).map(p => {
      const uniqueVisitors = p.visitors.size;
      const ctr = p.views > 0 ? Number(((p.ctaClicks / p.views) * 100).toFixed(2)) : 0;
      return {
        pagePath: p.pagePath,
        pageViews: p.views,
        uniqueVisitors,
        sessions: p.sessions.size,
        ctaClicks: p.ctaClicks,
        contactStarts: p.contactStarts,
        ctaCtr: ctr
      };
    }).sort((a, b) => b.pageViews - a.pageViews).slice(0, limit);

    return results;
  },

  /**
   * Get Landing Page Performance
   */
  async getLandingPages(startDate?: Date, endDate?: Date, limit: number = 20) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    // Get earliest event in each session
    const events = await prisma.analyticsEvent.findMany({
      where: { occurredAt: { gte: start, lte: end } },
      orderBy: { occurredAt: 'asc' },
      select: { sessionId: true, pagePath: true, eventName: true }
    });

    const sessionLandingMap: Record<string, string> = {};
    events.forEach(evt => {
      if (!sessionLandingMap[evt.sessionId]) {
        sessionLandingMap[evt.sessionId] = evt.pagePath || '/';
      }
    });

    const landingStatsMap: Record<string, { landingPage: string; sessions: number }> = {};
    Object.values(sessionLandingMap).forEach(landingPath => {
      if (!landingStatsMap[landingPath]) {
        landingStatsMap[landingPath] = { landingPage: landingPath, sessions: 0 };
      }
      landingStatsMap[landingPath].sessions++;
    });

    return Object.values(landingStatsMap)
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, limit);
  },

  /**
   * Get Traffic Sources Classification
   */
  async getTrafficSources(startDate?: Date, endDate?: Date) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const events = await prisma.analyticsEvent.findMany({
      where: { occurredAt: { gte: start, lte: end } },
      select: { referrerHost: true, utmSource: true, utmMedium: true, visitorId: true, sessionId: true }
    });

    const channelMap: Record<string, Set<string>> = {
      'Direct': new Set(),
      'Organic Search': new Set(),
      'Organic Social': new Set(),
      'Paid Search / Social': new Set(),
      'AI / LLM Referral': new Set(),
      'Referral': new Set(),
      'Email': new Set()
    };

    events.forEach(evt => {
      const ref = (evt.referrerHost || '').toLowerCase();
      const utmSrc = (evt.utmSource || '').toLowerCase();
      const utmMed = (evt.utmMedium || '').toLowerCase();
      const visitor = evt.visitorId;

      if (utmMed === 'cpc' || utmMed === 'ppc' || utmMed === 'paid') {
        channelMap['Paid Search / Social'].add(visitor);
      } else if (utmMed === 'email') {
        channelMap['Email'].add(visitor);
      } else if (ref.includes('chatgpt') || ref.includes('openai') || ref.includes('claude') || ref.includes('perplexity') || ref.includes('gemini') || ref.includes('copilot')) {
        channelMap['AI / LLM Referral'].add(visitor);
      } else if (ref.includes('google') || ref.includes('bing') || ref.includes('duckduckgo') || ref.includes('yahoo') || ref.includes('baidu')) {
        channelMap['Organic Search'].add(visitor);
      } else if (ref.includes('linkedin') || ref.includes('twitter') || ref.includes('x.com') || ref.includes('facebook') || ref.includes('instagram') || ref.includes('youtube') || ref.includes('reddit')) {
        channelMap['Organic Social'].add(visitor);
      } else if (!ref || ref.includes('localhost') || ref.includes('ryzite.com')) {
        channelMap['Direct'].add(visitor);
      } else {
        channelMap['Referral'].add(visitor);
      }
    });

    const totalVisitors = Object.values(channelMap).reduce((acc, set) => acc + set.size, 0) || 1;

    const sources = Object.entries(channelMap).map(([channel, set]) => ({
      channel,
      visitors: set.size,
      percentage: Number(((set.size / totalVisitors) * 100).toFixed(1))
    })).sort((a, b) => b.visitors - a.visitors);

    return sources;
  },

  /**
   * Get CTA Analytics & Conversion Funnel
   */
  async getCtaAnalytics(startDate?: Date, endDate?: Date) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const [impressions, clicks, contactStarts, leadsCount] = await Promise.all([
      prisma.analyticsEvent.count({
        where: { eventName: { in: ['CTA_VIEW', 'cta_impression'] }, occurredAt: { gte: start, lte: end } }
      }),
      prisma.analyticsEvent.count({
        where: { eventName: { in: ['CTA_CLICK', 'cta_primary_click', 'cta_secondary_click', 'cta_tertiary_click'] }, occurredAt: { gte: start, lte: end } }
      }),
      prisma.analyticsEvent.count({
        where: { eventName: { in: ['CONTACT_START', 'cta_contact_open'] }, occurredAt: { gte: start, lte: end } }
      }),
      prisma.lead.count({
        where: { createdAt: { gte: start, lte: end } }
      })
    ]);

    const ctr = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;
    const conversionRate = clicks > 0 ? Number(((leadsCount / clicks) * 100).toFixed(2)) : 0;

    // Funnel Steps
    const funnel = [
      { step: 'CTA Impression', count: impressions, dropoff: 0 },
      { step: 'CTA Click', count: clicks, dropoff: impressions > 0 ? Number((((impressions - clicks) / impressions) * 100).toFixed(1)) : 0 },
      { step: 'Contact Form Start', count: contactStarts, dropoff: clicks > 0 ? Number((((clicks - contactStarts) / clicks) * 100).toFixed(1)) : 0 },
      { step: 'CRM Lead Submission', count: leadsCount, dropoff: contactStarts > 0 ? Number((((contactStarts - leadsCount) / contactStarts) * 100).toFixed(1)) : 0 }
    ];

    return {
      impressions,
      clicks,
      ctr,
      contactStarts,
      leads: leadsCount,
      conversionRate,
      funnel
    };
  },

  /**
   * Get Entity Specific Analytics (Service, Portfolio, Blog)
   */
  async getEntityAnalytics(entityType: 'service' | 'portfolio' | 'blog', startDate?: Date, endDate?: Date) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const targetEvent = entityType === 'service' ? 'SERVICE_VIEW' : entityType === 'portfolio' ? 'PORTFOLIO_VIEW' : 'BLOG_VIEW';

    const events = await prisma.analyticsEvent.findMany({
      where: {
        entityType,
        occurredAt: { gte: start, lte: end }
      },
      select: { entityId: true, eventName: true, visitorId: true }
    });

    const entityMap: Record<string, { entityId: string; views: number; visitors: Set<string>; ctaClicks: number }> = {};

    events.forEach(evt => {
      const id = evt.entityId || 'unknown';
      if (!entityMap[id]) {
        entityMap[id] = { entityId: id, views: 0, visitors: new Set(), ctaClicks: 0 };
      }
      if (evt.eventName === targetEvent || evt.eventName === 'PAGE_VIEW') {
        entityMap[id].views++;
      }
      if (evt.eventName.includes('CTA_CLICK') || evt.eventName.includes('cta_')) {
        entityMap[id].ctaClicks++;
      }
      entityMap[id].visitors.add(evt.visitorId);
    });

    const items = Object.values(entityMap).map(item => ({
      entityId: item.entityId,
      views: item.views,
      uniqueVisitors: item.visitors.size,
      ctaClicks: item.ctaClicks
    })).sort((a, b) => b.views - a.views);

    return items;
  },

  /**
   * Get RUM Core Web Vitals Monitoring Report
   */
  async getWebVitals(startDate?: Date, endDate?: Date) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const vitals = await prisma.webVitalMetric.findMany({
      where: { occurredAt: { gte: start, lte: end } }
    });

    if (vitals.length === 0) {
      return {
        hasData: false,
        message: 'Insufficient real-user Web Vitals data collected yet.',
        metrics: { LCP: null, INP: null, CLS: null, FCP: null, TTFB: null }
      };
    }

    const metricsGroup: Record<string, { sum: number; count: number; good: number; needsImprovement: number; poor: number }> = {
      LCP: { sum: 0, count: 0, good: 0, needsImprovement: 0, poor: 0 },
      INP: { sum: 0, count: 0, good: 0, needsImprovement: 0, poor: 0 },
      CLS: { sum: 0, count: 0, good: 0, needsImprovement: 0, poor: 0 },
      FCP: { sum: 0, count: 0, good: 0, needsImprovement: 0, poor: 0 },
      TTFB: { sum: 0, count: 0, good: 0, needsImprovement: 0, poor: 0 }
    };

    vitals.forEach(v => {
      const name = v.metricName.toUpperCase();
      if (metricsGroup[name]) {
        metricsGroup[name].sum += v.value;
        metricsGroup[name].count++;
        if (v.rating === 'GOOD') metricsGroup[name].good++;
        else if (v.rating === 'POOR') metricsGroup[name].poor++;
        else metricsGroup[name].needsImprovement++;
      }
    });

    const summary: Record<string, any> = {};
    Object.entries(metricsGroup).forEach(([key, data]) => {
      if (data.count > 0) {
        summary[key] = {
          avgValue: Number((data.sum / data.count).toFixed(2)),
          sampleCount: data.count,
          goodPercentage: Number(((data.good / data.count) * 100).toFixed(1)),
          poorPercentage: Number(((data.poor / data.count) * 100).toFixed(1))
        };
      } else {
        summary[key] = null;
      }
    });

    return {
      hasData: true,
      source: 'WEB_VITALS',
      totalSamples: vitals.length,
      metrics: summary
    };
  },

  /**
   * Get 404 Broken URL Report
   */
  async get404Errors() {
    const errors = await prisma.brokenUrl404.findMany({
      orderBy: { hitCount: 'desc' },
      take: 50
    });
    return errors;
  },

  /**
   * Get / Update Analytics Settings
   */
  async getAnalyticsSettings() {
    let settings = await prisma.analyticsSettings.findUnique({
      where: { id: 'default-analytics-settings' }
    });
    if (!settings) {
      settings = await prisma.analyticsSettings.create({
        data: {
          id: 'default-analytics-settings',
          trackingEnabled: true,
          firstPartyEnabled: true,
          ga4Enabled: false,
          searchConsoleEnabled: false,
          webVitalsEnabled: true,
          retentionDays: 90
        }
      });
    }
    return settings;
  },

  async updateAnalyticsSettings(data: any) {
    return prisma.analyticsSettings.upsert({
      where: { id: 'default-analytics-settings' },
      update: data,
      create: {
        id: 'default-analytics-settings',
        ...data
      }
    });
  },

  /**
   * Purge expired raw analytics events according to retention settings
   */
  async purgeExpiredEvents() {
    const settings = await this.getAnalyticsSettings();
    const cutoffDate = new Date(Date.now() - settings.retentionDays * 24 * 60 * 60 * 1000);

    const deleted = await prisma.analyticsEvent.deleteMany({
      where: { occurredAt: { lt: cutoffDate } }
    });

    console.log(`[ANALYTICS RETENTION PURGE] Cleaned ${deleted.count} events older than ${settings.retentionDays} days.`);
    return deleted;
  },

  /**
   * Export Analytics Data to CSV format string
   */
  async exportCsv(startDate?: Date, endDate?: Date) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const events = await prisma.analyticsEvent.findMany({
      where: { occurredAt: { gte: start, lte: end } },
      orderBy: { occurredAt: 'desc' },
      take: 5000
    });

    const header = 'Occurred At,Event Name,Page Path,Visitor ID,Session ID,Device Type,Referrer Host,UTM Source,UTM Campaign\n';
    const rows = events.map(e => [
      e.occurredAt.toISOString(),
      `"${e.eventName}"`,
      `"${e.pagePath}"`,
      `"${e.visitorId}"`,
      `"${e.sessionId}"`,
      `"${e.deviceType || ''}"`,
      `"${e.referrerHost || ''}"`,
      `"${e.utmSource || ''}"`,
      `"${e.utmCampaign || ''}"`
    ].join(',')).join('\n');

    return header + rows;
  }
};
