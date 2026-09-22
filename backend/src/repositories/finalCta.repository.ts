import { prisma } from './prisma.js';
import { cloudinaryService } from '../services/cloudinary.service.js';

export const DEFAULT_FINAL_CTA = {
  id: 'default-fallback-cta',
  name: 'Default Agency Conversion CTA',
  eyebrow: "READY TO BUILD WHAT'S NEXT?",
  headline: "Let's Turn Your Next Big Idea Into Reality.",
  highlightedText: "Next Big Idea",
  description: "From AI-powered automation and custom software to cloud infrastructure and digital products, we help ambitious businesses design, build, and scale reliable technology.",
  supportingText: "Tell us what you're building. We'll help you figure out the right technical path.",
  primaryLabel: "Start a Project",
  primaryActionType: "CONTACT_FORM",
  primaryActionUrl: "/#contact",
  secondaryLabel: "Explore Our Work",
  secondaryActionType: "PORTFOLIO_PAGE",
  secondaryActionUrl: "/portfolio",
  tertiaryLabel: "Talk to an Expert",
  tertiaryActionType: "BOOK_CALL",
  tertiaryActionUrl: "/#contact",
  variant: "DEFAULT",
  theme: "DARK",
  backgroundType: "DARK",
  backgroundImageUrl: null,
  backgroundImagePublicId: null,
  backgroundImageAlt: null,
  mobileBackgroundImageUrl: null,
  mobileBackgroundImagePublicId: null,
  overlayEnabled: true,
  overlayOpacity: 0.85,
  showTrustLine: true,
  showTertiaryAction: false,
  showContactInfo: false,
  contactEmail: "contact@ryzite.com",
  contactPhone: "+1-800-555-0199",
  showTrustedClients: true,
  showCaseStudies: false,
  isActive: true,
  isGlobal: true,
  priority: 0,
  status: "ACTIVE",
  isFallback: true
};

export const finalCtaRepository = {
  /**
   * Resolve public active CTA according to priority order:
   * 1. Specific Page Override (pageType + pageId)
   * 2. Category/PageType Override (pageType)
   * 3. Highest Priority Global Active CTA
   * 4. Safe Default Fallback CTA
   */
  async getPublicCta(pageType?: string, pageId?: string) {
    try {
      const now = new Date();

      // Step 1 & 2: Check Page Overrides
      if (pageType) {
        const override = await prisma.finalCtaOverride.findFirst({
          where: {
            pageType,
            isActive: true,
            ...(pageId ? { OR: [{ pageId }, { pageId: null }] } : { pageId: null }),
            cta: {
              isActive: true,
              status: 'ACTIVE',
              OR: [
                { startAt: null, endAt: null },
                { startAt: { lte: now }, endAt: { gte: now } },
                { startAt: { lte: now }, endAt: null },
                { startAt: null, endAt: { gte: now } }
              ]
            }
          },
          orderBy: [
            { pageId: pageId ? 'desc' : 'asc' }, // Prioritize exact pageId over generic pageType
            { createdAt: 'desc' }
          ],
          include: { cta: true }
        });

        if (override?.cta) {
          return { ...override.cta, source: 'OVERRIDE' };
        }
      }

      // Step 3: Check Global CTA
      const globalCta = await prisma.finalCta.findFirst({
        where: {
          isGlobal: true,
          isActive: true,
          OR: [
            { startAt: null, endAt: null },
            { startAt: { lte: now }, endAt: { gte: now } },
            { startAt: { lte: now }, endAt: null },
            { startAt: null, endAt: { gte: now } }
          ]
        },
        orderBy: [
          { priority: 'desc' },
          { updatedAt: 'desc' }
        ]
      });

      if (globalCta) {
        return { ...globalCta, source: 'GLOBAL' };
      }

      // Step 4: Any Active Database CTA (Ensures PostgreSQL is single source of truth)
      const anyActiveCta = await prisma.finalCta.findFirst({
        where: {
          isActive: true,
          OR: [
            { startAt: null, endAt: null },
            { startAt: { lte: now }, endAt: { gte: now } },
            { startAt: { lte: now }, endAt: null },
            { startAt: null, endAt: { gte: now } }
          ]
        },
        orderBy: [
          { priority: 'desc' },
          { updatedAt: 'desc' }
        ]
      });

      if (anyActiveCta) {
        return { ...anyActiveCta, source: 'ACTIVE_FALLBACK' };
      }

      // Step 5: Safe Fallback if table is completely empty
      return { ...DEFAULT_FINAL_CTA, source: 'FALLBACK' };
    } catch (err: any) {
      console.error('[FINAL CTA REPO ERROR] Failed to fetch public CTA, using fallback:', err.message);
      return { ...DEFAULT_FINAL_CTA, source: 'FALLBACK' };
    }
  },

  /**
   * Get all CTAs for Admin Dashboard
   */
  async getAllAdminCtas() {
    const ctas = await prisma.finalCta.findMany({
      orderBy: [
        { isGlobal: 'desc' },
        { priority: 'desc' },
        { updatedAt: 'desc' }
      ],
      include: {
        overrides: true,
        _count: {
          select: {
            analyticsEvents: true,
            leadsGenerated: true
          }
        }
      }
    });

    // Decorate each CTA with CTR and metric calculations
    const decorated = await Promise.all(
      ctas.map(async (cta) => {
        const stats = await this.getCtaStats(cta.id);
        return {
          ...cta,
          impressions: stats.impressions,
          primaryClicks: stats.primaryClicks,
          secondaryClicks: stats.secondaryClicks,
          tertiaryClicks: stats.tertiaryClicks,
          totalClicks: stats.totalClicks,
          contactStarts: stats.contactStarts,
          leads: stats.leads,
          ctr: stats.ctr,
          leadConversionRate: stats.leadConversionRate
        };
      })
    );

    return decorated;
  },

  /**
   * Get single CTA by ID with version history & overrides
   */
  async getCtaById(id: string) {
    if (id === 'default-fallback-cta') {
      return DEFAULT_FINAL_CTA;
    }
    const cta = await prisma.finalCta.findUnique({
      where: { id },
      include: {
        overrides: true,
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });
    if (!cta) return null;
    const stats = await this.getCtaStats(id);
    return {
      ...cta,
      ...stats
    };
  },

  /**
   * Create new CTA and store initial version snapshot
   */
  async createCta(data: any, createdBy: string = 'Admin') {
    const isActive = data.isActive ?? true;
    const status = isActive ? 'ACTIVE' : 'INACTIVE';
    const isGlobal = data.isGlobal ?? (data.pageTarget === 'GLOBAL' || !data.pageTarget);

    const newCta = await prisma.finalCta.create({
      data: {
        name: data.name,
        eyebrow: data.eyebrow || null,
        headline: data.headline,
        highlightedText: data.highlightedText || null,
        description: data.description || null,
        supportingText: data.supportingText || null,
        primaryLabel: data.primaryLabel,
        primaryActionType: data.primaryActionType || 'CONTACT_FORM',
        primaryActionUrl: data.primaryActionUrl || '/#contact',
        secondaryLabel: data.secondaryLabel || null,
        secondaryActionType: data.secondaryActionType || 'PORTFOLIO_PAGE',
        secondaryActionUrl: data.secondaryActionUrl || '/portfolio',
        tertiaryLabel: data.tertiaryLabel || null,
        tertiaryActionType: data.tertiaryActionType || 'BOOK_CALL',
        tertiaryActionUrl: data.tertiaryActionUrl || null,
        variant: data.variant || 'DEFAULT',
        theme: data.theme || 'DARK',
        backgroundType: data.backgroundType || 'DARK',
        backgroundImageUrl: data.backgroundImageUrl || null,
        backgroundImagePublicId: data.backgroundImagePublicId || null,
        backgroundImageAlt: data.backgroundImageAlt || null,
        mobileBackgroundImageUrl: data.mobileBackgroundImageUrl || null,
        mobileBackgroundImagePublicId: data.mobileBackgroundImagePublicId || null,
        overlayEnabled: data.overlayEnabled ?? true,
        overlayOpacity: typeof data.overlayOpacity === 'number' ? data.overlayOpacity : 0.8,
        showTrustLine: data.showTrustLine ?? true,
        showTertiaryAction: data.showTertiaryAction ?? false,
        showContactInfo: data.showContactInfo ?? false,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        showTrustedClients: data.showTrustedClients ?? false,
        showCaseStudies: data.showCaseStudies ?? false,
        isActive,
        isGlobal,
        priority: data.priority ?? 0,
        status,
        startAt: data.startAt ? new Date(data.startAt) : null,
        endAt: data.endAt ? new Date(data.endAt) : null,
        createdBy,
        updatedBy: createdBy
      }
    });

    // Handle Page Target Override if specified
    if (data.pageTarget && data.pageTarget !== 'GLOBAL') {
      const pageType = data.pageTarget.toLowerCase();
      await prisma.finalCtaOverride.create({
        data: {
          ctaId: newCta.id,
          pageType,
          isActive: true
        }
      });
    }

    // Create initial version snapshot
    await prisma.finalCtaVersion.create({
      data: {
        ctaId: newCta.id,
        snapshot: newCta as any,
        changedBy: createdBy,
        changeReason: 'Initial creation'
      }
    });

    return newCta;
  },

  /**
   * Update CTA with Cloudinary replacement workflow
   */
  async updateCta(id: string, data: any, updatedBy: string = 'Admin') {
    const existing = await prisma.finalCta.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`CTA with ID ${id} not found.`);
    }

    // Handle Cloudinary replacement sequence
    const oldPublicId = existing.backgroundImagePublicId;
    const newPublicId = data.backgroundImagePublicId;
    const shouldDeleteOldImage = oldPublicId && newPublicId && oldPublicId !== newPublicId;

    const isActive = data.isActive !== undefined ? Boolean(data.isActive) : existing.isActive;
    const status = isActive ? 'ACTIVE' : 'INACTIVE';
    let isGlobal = data.isGlobal !== undefined ? Boolean(data.isGlobal) : existing.isGlobal;

    if (data.pageTarget) {
      if (data.pageTarget === 'GLOBAL') {
        isGlobal = true;
        await prisma.finalCtaOverride.deleteMany({ where: { ctaId: id } });
      } else {
        isGlobal = false;
        const pageType = data.pageTarget.toLowerCase();
        await prisma.finalCtaOverride.deleteMany({ where: { ctaId: id } });
        await prisma.finalCtaOverride.create({
          data: {
            ctaId: id,
            pageType,
            isActive: true
          }
        });
      }
    }

    const updated = await prisma.finalCta.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        eyebrow: data.eyebrow !== undefined ? data.eyebrow : existing.eyebrow,
        headline: data.headline ?? existing.headline,
        highlightedText: data.highlightedText !== undefined ? data.highlightedText : existing.highlightedText,
        description: data.description !== undefined ? data.description : existing.description,
        supportingText: data.supportingText !== undefined ? data.supportingText : existing.supportingText,
        primaryLabel: data.primaryLabel ?? existing.primaryLabel,
        primaryActionType: data.primaryActionType ?? existing.primaryActionType,
        primaryActionUrl: data.primaryActionUrl ?? existing.primaryActionUrl,
        secondaryLabel: data.secondaryLabel !== undefined ? data.secondaryLabel : existing.secondaryLabel,
        secondaryActionType: data.secondaryActionType !== undefined ? data.secondaryActionType : existing.secondaryActionType,
        secondaryActionUrl: data.secondaryActionUrl !== undefined ? data.secondaryActionUrl : existing.secondaryActionUrl,
        tertiaryLabel: data.tertiaryLabel !== undefined ? data.tertiaryLabel : existing.tertiaryLabel,
        tertiaryActionType: data.tertiaryActionType !== undefined ? data.tertiaryActionType : existing.tertiaryActionType,
        tertiaryActionUrl: data.tertiaryActionUrl !== undefined ? data.tertiaryActionUrl : existing.tertiaryActionUrl,
        variant: data.variant ?? existing.variant,
        theme: data.theme ?? existing.theme,
        backgroundType: data.backgroundType ?? existing.backgroundType,
        backgroundImageUrl: data.backgroundImageUrl !== undefined ? data.backgroundImageUrl : existing.backgroundImageUrl,
        backgroundImagePublicId: data.backgroundImagePublicId !== undefined ? data.backgroundImagePublicId : existing.backgroundImagePublicId,
        backgroundImageAlt: data.backgroundImageAlt !== undefined ? data.backgroundImageAlt : existing.backgroundImageAlt,
        mobileBackgroundImageUrl: data.mobileBackgroundImageUrl !== undefined ? data.mobileBackgroundImageUrl : existing.mobileBackgroundImageUrl,
        mobileBackgroundImagePublicId: data.mobileBackgroundImagePublicId !== undefined ? data.mobileBackgroundImagePublicId : existing.mobileBackgroundImagePublicId,
        overlayEnabled: data.overlayEnabled !== undefined ? data.overlayEnabled : existing.overlayEnabled,
        overlayOpacity: data.overlayOpacity !== undefined ? data.overlayOpacity : existing.overlayOpacity,
        showTrustLine: data.showTrustLine !== undefined ? data.showTrustLine : existing.showTrustLine,
        showTertiaryAction: data.showTertiaryAction !== undefined ? data.showTertiaryAction : existing.showTertiaryAction,
        showContactInfo: data.showContactInfo !== undefined ? data.showContactInfo : existing.showContactInfo,
        contactEmail: data.contactEmail !== undefined ? data.contactEmail : existing.contactEmail,
        contactPhone: data.contactPhone !== undefined ? data.contactPhone : existing.contactPhone,
        showTrustedClients: data.showTrustedClients !== undefined ? data.showTrustedClients : existing.showTrustedClients,
        showCaseStudies: data.showCaseStudies !== undefined ? data.showCaseStudies : existing.showCaseStudies,
        isActive,
        isGlobal,
        priority: data.priority !== undefined ? data.priority : existing.priority,
        status,
        startAt: data.startAt !== undefined ? (data.startAt ? new Date(data.startAt) : null) : existing.startAt,
        endAt: data.endAt !== undefined ? (data.endAt ? new Date(data.endAt) : null) : existing.endAt,
        updatedBy
      }
    });

    // Delete old Cloudinary image if replacement succeeded
    if (shouldDeleteOldImage) {
      try {
        await cloudinaryService.deleteImage(oldPublicId);
        console.log(`[CLOUDINARY REPLACEMENT] Successfully deleted replaced image: ${oldPublicId}`);
      } catch (err: any) {
        console.warn(`[CLOUDINARY WARNING] Non-critical error deleting old image ${oldPublicId}:`, err.message);
      }
    }

    // Save version history snapshot
    await prisma.finalCtaVersion.create({
      data: {
        ctaId: updated.id,
        snapshot: updated as any,
        changedBy: updatedBy,
        changeReason: data.changeReason || 'Updated CTA configuration'
      }
    });

    return updated;
  },

  /**
   * Delete CTA and associated Cloudinary assets
   */
  async deleteCta(id: string) {
    const existing = await prisma.finalCta.findUnique({ where: { id } });
    if (!existing) return;

    if (existing.backgroundImagePublicId) {
      try {
        await cloudinaryService.deleteImage(existing.backgroundImagePublicId);
      } catch (e: any) {
        console.warn('[CLOUDINARY DELETE] Warning:', e.message);
      }
    }

    return prisma.finalCta.delete({ where: { id } });
  },

  /**
   * Activate a CTA
   */
  async activateCta(id: string) {
    return prisma.finalCta.update({
      where: { id },
      data: { isActive: true, status: 'ACTIVE' }
    });
  },

  /**
   * Deactivate a CTA
   */
  async deactivateCta(id: string) {
    return prisma.finalCta.update({
      where: { id },
      data: { isActive: false, status: 'INACTIVE' }
    });
  },

  /**
   * Duplicate existing CTA
   */
  async duplicateCta(id: string, user: string = 'Admin') {
    const existing = await prisma.finalCta.findUnique({ where: { id } });
    if (!existing) throw new Error(`CTA ${id} not found.`);

    const { id: oldId, createdAt, updatedAt, ...rest } = existing;
    return this.createCta(
      {
        ...rest,
        name: `${existing.name} (Copy)`,
        isActive: false,
        isGlobal: false,
        status: 'DRAFT'
      },
      user
    );
  },

  /**
   * Get version history for a CTA
   */
  async getCtaVersions(ctaId: string) {
    return prisma.finalCtaVersion.findMany({
      where: { ctaId },
      orderBy: { createdAt: 'desc' }
    });
  },

  /**
   * Restore a historical version of a CTA
   */
  async restoreCtaVersion(ctaId: string, versionId: string, restoredBy: string = 'Admin') {
    const version = await prisma.finalCtaVersion.findUnique({ where: { id: versionId } });
    if (!version || version.ctaId !== ctaId) {
      throw new Error(`Version ${versionId} not found for CTA ${ctaId}`);
    }

    const snapshot = version.snapshot as any;
    const { id, createdAt, updatedAt, createdBy, ...dataToRestore } = snapshot;

    return this.updateCta(ctaId, {
      ...dataToRestore,
      changeReason: `Restored from version created on ${new Date(version.createdAt).toLocaleString()}`
    }, restoredBy);
  },

  /**
   * Record analytics events (impression, clicks, contact start, lead)
   */
  async recordAnalyticsEvent(data: {
    ctaId: string;
    eventType: string;
    pageUrl: string;
    pageType?: string;
    pageId?: string;
    sessionId?: string;
    deviceType?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }) {
    if (data.ctaId === 'default-fallback-cta') {
      return { success: true, note: 'Fallback CTA event logged' };
    }
    return prisma.ctaAnalyticsEvent.create({
      data: {
        ctaId: data.ctaId,
        eventType: data.eventType,
        pageUrl: data.pageUrl || '/',
        pageType: data.pageType || null,
        pageId: data.pageId || null,
        sessionId: data.sessionId || null,
        deviceType: data.deviceType || null,
        referrer: data.referrer || null,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null
      }
    });
  },

  /**
   * Get CTR & metrics stats for a CTA
   */
  async getCtaStats(ctaId: string) {
    const [
      impressions,
      primaryClicks,
      secondaryClicks,
      tertiaryClicks,
      contactStarts,
      leads
    ] = await Promise.all([
      prisma.ctaAnalyticsEvent.count({ where: { ctaId, eventType: 'cta_impression' } }),
      prisma.ctaAnalyticsEvent.count({ where: { ctaId, eventType: 'cta_primary_click' } }),
      prisma.ctaAnalyticsEvent.count({ where: { ctaId, eventType: 'cta_secondary_click' } }),
      prisma.ctaAnalyticsEvent.count({ where: { ctaId, eventType: 'cta_tertiary_click' } }),
      prisma.ctaAnalyticsEvent.count({ where: { ctaId, eventType: 'cta_contact_open' } }),
      prisma.lead.count({ where: { sourceCtaId: ctaId } })
    ]);

    const totalClicks = primaryClicks + secondaryClicks + tertiaryClicks;
    const ctr = impressions > 0 ? Number(((totalClicks / impressions) * 100).toFixed(2)) : 0;
    const primaryCtr = impressions > 0 ? Number(((primaryClicks / impressions) * 100).toFixed(2)) : 0;
    const secondaryCtr = impressions > 0 ? Number(((secondaryClicks / impressions) * 100).toFixed(2)) : 0;
    const leadConversionRate = totalClicks > 0 ? Number(((leads / totalClicks) * 100).toFixed(2)) : 0;

    return {
      impressions,
      primaryClicks,
      secondaryClicks,
      tertiaryClicks,
      totalClicks,
      contactStarts,
      leads,
      ctr,
      primaryCtr,
      secondaryCtr,
      leadConversionRate
    };
  },

  /**
   * Get Overall Analytics Summary for Admin Dashboard
   */
  async getAnalyticsSummary() {
    const [
      activeCtaCount,
      totalImpressions,
      primaryClicks,
      secondaryClicks,
      tertiaryClicks,
      contactStarts,
      totalLeads
    ] = await Promise.all([
      prisma.finalCta.count({ where: { isActive: true, status: 'ACTIVE' } }),
      prisma.ctaAnalyticsEvent.count({ where: { eventType: 'cta_impression' } }),
      prisma.ctaAnalyticsEvent.count({ where: { eventType: 'cta_primary_click' } }),
      prisma.ctaAnalyticsEvent.count({ where: { eventType: 'cta_secondary_click' } }),
      prisma.ctaAnalyticsEvent.count({ where: { eventType: 'cta_tertiary_click' } }),
      prisma.ctaAnalyticsEvent.count({ where: { eventType: 'cta_contact_open' } }),
      prisma.lead.count({ where: { sourceCtaId: { not: null } } })
    ]);

    const totalClicks = primaryClicks + secondaryClicks + tertiaryClicks;
    const overallCtr = totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0;
    const conversionRate = totalClicks > 0 ? Number(((totalLeads / totalClicks) * 100).toFixed(2)) : 0;

    return {
      activeCtaCount,
      totalImpressions,
      totalClicks,
      primaryClicks,
      secondaryClicks,
      tertiaryClicks,
      contactStarts,
      leads: totalLeads,
      ctr: overallCtr,
      conversionRate
    };
  },

  /**
   * CTA Performance by Page Type
   */
  async getPerformanceByPage() {
    const events = await prisma.ctaAnalyticsEvent.groupBy({
      by: ['pageType', 'eventType'],
      _count: { id: true }
    });

    const pageMap: Record<string, { impressions: number; clicks: number; leads: number }> = {};

    events.forEach(e => {
      const type = e.pageType || 'home';
      if (!pageMap[type]) {
        pageMap[type] = { impressions: 0, clicks: 0, leads: 0 };
      }
      if (e.eventType === 'cta_impression') {
        pageMap[type].impressions += e._count.id;
      } else if (['cta_primary_click', 'cta_secondary_click', 'cta_tertiary_click'].includes(e.eventType)) {
        pageMap[type].clicks += e._count.id;
      }
    });

    return Object.entries(pageMap).map(([pageType, stats]) => ({
      pageType,
      impressions: stats.impressions,
      clicks: stats.clicks,
      ctr: stats.impressions > 0 ? Number(((stats.clicks / stats.impressions) * 100).toFixed(2)) : 0
    }));
  },

  /**
   * Internal Technical Health Check (0-100 Score)
   */
  async checkCtaHealth(id: string) {
    if (id === 'default-fallback-cta') {
      return { score: 100, status: 'HEALTHY', checks: [{ name: 'Default Fallback Configuration', passed: true }] };
    }

    const cta = await prisma.finalCta.findUnique({ where: { id } });
    if (!cta) return { score: 0, status: 'NOT_FOUND', checks: [] };

    const checks: { name: string; passed: boolean; details?: string }[] = [];

    // 1. Destination URL check
    const hasPrimaryUrl = !!cta.primaryActionUrl && cta.primaryActionUrl.trim() !== '';
    checks.push({
      name: 'Primary Action Target Valid',
      passed: hasPrimaryUrl,
      details: hasPrimaryUrl ? `Points to ${cta.primaryActionUrl}` : 'Missing primary action target URL'
    });

    // 2. Active status check
    checks.push({
      name: 'CTA Active Status',
      passed: cta.isActive && cta.status === 'ACTIVE',
      details: cta.isActive ? 'Currently Active' : 'Inactive in CMS'
    });

    // 3. Content completeness
    const hasCopy = cta.headline.length > 5 && (cta.description ? cta.description.length > 10 : true);
    checks.push({
      name: 'Content & Typography Completeness',
      passed: hasCopy,
      details: hasCopy ? 'Headline & description complete' : 'Headline or description too short'
    });

    // 4. Background image health (if backgroundType is IMAGE/IMAGE_GRADIENT)
    if (['IMAGE', 'IMAGE_GRADIENT'].includes(cta.backgroundType)) {
      const hasImage = !!cta.backgroundImageUrl;
      checks.push({
        name: 'Cloudinary Image Media Valid',
        passed: hasImage,
        details: hasImage ? 'Image URL present' : 'Background set to IMAGE but missing URL'
      });
    } else {
      checks.push({
        name: 'Background Theme Valid',
        passed: true,
        details: `Using ${cta.backgroundType} background`
      });
    }

    // 5. Accessibility checks
    const hasAltText = ['IMAGE', 'IMAGE_GRADIENT'].includes(cta.backgroundType) ? !!cta.backgroundImageAlt : true;
    checks.push({
      name: 'Accessibility & Screen Reader Labels',
      passed: hasAltText,
      details: hasAltText ? 'Alt text provided' : 'Missing background alt text'
    });

    const passedCount = checks.filter(c => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return {
      score,
      status: score >= 90 ? 'HEALTHY' : score >= 70 ? 'WARNING' : 'CRITICAL',
      checks
    };
  },

  // Page Overrides Management
  async getOverrides() {
    return prisma.finalCtaOverride.findMany({
      include: { cta: true },
      orderBy: { createdAt: 'desc' }
    });
  },

  async createOverride(data: { ctaId: string; pageType: string; pageId?: string }) {
    return prisma.finalCtaOverride.create({
      data: {
        ctaId: data.ctaId,
        pageType: data.pageType,
        pageId: data.pageId || null,
        isActive: true
      },
      include: { cta: true }
    });
  },

  async deleteOverride(id: string) {
    return prisma.finalCtaOverride.delete({ where: { id } });
  }
};
