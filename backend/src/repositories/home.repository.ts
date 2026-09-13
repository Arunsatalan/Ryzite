import { prisma } from './prisma.js';

export const homeRepository = {
  async getHomePageContent() {
    const [homePage, principles, statistics, clients, faqs] = await Promise.all([
      prisma.homePage.findFirst({
        include: {
          sections: { orderBy: { displayOrder: 'asc' } },
          heroImage: true
        }
      }),
      prisma.companyPrinciple.findMany({
        where: { enabled: true },
        orderBy: { displayOrder: 'asc' }
      }),
      prisma.statistic.findMany({
        where: { enabled: true },
        orderBy: { displayOrder: 'asc' }
      }),
      prisma.client.findMany({
        where: { enabled: true },
        orderBy: { displayOrder: 'asc' }
      }),
      prisma.faq.findMany({
        where: { enabled: true },
        orderBy: { displayOrder: 'asc' }
      })
    ]);

    return {
      homePage,
      principles,
      statistics,
      clients,
      faqs
    };
  },

  async getHomeHero() {
    const homePage = await prisma.homePage.findFirst();
    if (!homePage) {
      return null;
    }
    return {
      badgeText: homePage.heroBadgeText ?? 'SOFTWARE SOLUTIONS THAT SCALE',
      headingPrefix: homePage.heroHeadingPrefix ?? 'We Build Software',
      headingHighlight: homePage.heroHeadingHighlight ?? 'Drives Growth',
      headingSuffix: homePage.heroHeadingSuffix ?? '',
      description: homePage.heroDescription ?? 'Empowering startups and enterprises with innovative, scalable and secure software solutions.',
      primaryCtaText: homePage.heroPrimaryCtaText ?? 'Explore Our Services',
      primaryCtaUrl: homePage.heroPrimaryCtaUrl ?? '/services',
      primaryCtaEnabled: homePage.heroPrimaryCtaEnabled ?? true,
      primaryCtaOpenNewTab: homePage.heroPrimaryCtaOpenNewTab ?? false,
      secondaryCtaText: homePage.heroSecondaryCtaText ?? 'Book a Free Consultation',
      secondaryCtaUrl: homePage.heroSecondaryCtaUrl ?? '#contact',
      secondaryCtaType: homePage.heroSecondaryCtaType ?? 'consultation',
      secondaryCtaEnabled: homePage.heroSecondaryCtaEnabled ?? true,
      secondaryCtaOpenNewTab: homePage.heroSecondaryCtaOpenNewTab ?? false,
      backgroundImageUrl: homePage.heroBackgroundImageUrl ?? null,
      backgroundImageAlt: homePage.heroBackgroundImageAlt ?? null,
      enabled: homePage.heroEnabled ?? true,
      displayOrder: homePage.heroDisplayOrder ?? 1,
      updatedAt: homePage.updatedAt
    };
  },

  async updateHomeHero(payload: any) {
    const enabled = payload.enabled ?? true;

    const badgeText = (payload.badgeText ?? '').trim();
    const headingPrefix = (payload.headingPrefix ?? '').trim();
    const headingHighlight = (payload.headingHighlight ?? '').trim();
    const headingSuffix = (payload.headingSuffix ?? '').trim();
    const description = (payload.description ?? '').trim();

    const primaryCtaText = (payload.primaryCtaText ?? '').trim();
    const primaryCtaUrl = (payload.primaryCtaUrl ?? '').trim();
    const primaryCtaEnabled = payload.primaryCtaEnabled ?? true;
    const primaryCtaOpenNewTab = payload.primaryCtaOpenNewTab ?? false;

    const secondaryCtaText = (payload.secondaryCtaText ?? '').trim();
    const secondaryCtaUrl = (payload.secondaryCtaUrl ?? '').trim();
    const secondaryCtaType = payload.secondaryCtaType === 'link' ? 'link' : 'consultation';
    const secondaryCtaEnabled = payload.secondaryCtaEnabled ?? true;
    const secondaryCtaOpenNewTab = payload.secondaryCtaOpenNewTab ?? false;

    const backgroundImageUrl = payload.backgroundImageUrl ? payload.backgroundImageUrl.trim() : null;
    const backgroundImageAlt = payload.backgroundImageAlt ? payload.backgroundImageAlt.trim() : null;
    const displayOrder = typeof payload.displayOrder === 'number' && payload.displayOrder > 0 ? payload.displayOrder : 1;

    // Validation
    if (enabled) {
      if (!headingPrefix) {
        throw new Error('Heading Prefix is required when Hero is enabled.');
      }
      if (!description) {
        throw new Error('Description is required when Hero is enabled.');
      }
    }

    if (badgeText.length > 80) throw new Error('Badge text must be 80 characters or less.');
    if (headingPrefix.length > 120) throw new Error('Heading prefix must be 120 characters or less.');
    if (headingHighlight.length > 80) throw new Error('Heading highlight must be 80 characters or less.');
    if (headingSuffix.length > 120) throw new Error('Heading suffix must be 120 characters or less.');
    if (description.length > 500) throw new Error('Description must be 500 characters or less.');
    if (primaryCtaText.length > 80) throw new Error('Primary CTA text must be 80 characters or less.');
    if (secondaryCtaText.length > 80) throw new Error('Secondary CTA text must be 80 characters or less.');
    if (backgroundImageAlt && backgroundImageAlt.length > 200) throw new Error('Background image alt text must be 200 characters or less.');

    const validateUrl = (url: string, fieldName: string) => {
      if (!url) return;
      if (url.startsWith('/') || url.startsWith('#') || url.startsWith('https://') || url.startsWith('http://')) {
        return;
      }
      throw new Error(`${fieldName} must be a relative path (e.g. /services) or a valid HTTP/HTTPS URL.`);
    };

    validateUrl(primaryCtaUrl, 'Primary CTA URL');
    validateUrl(secondaryCtaUrl, 'Secondary CTA URL');
    if (backgroundImageUrl) validateUrl(backgroundImageUrl, 'Background Image URL');

    const existing = await prisma.homePage.findFirst();

    const dataPayload = {
      heroBadgeText: badgeText,
      heroHeadingPrefix: headingPrefix,
      heroHeadingHighlight: headingHighlight,
      heroHeadingSuffix: headingSuffix,
      heroDescription: description,
      heroPrimaryCtaText: primaryCtaText,
      heroPrimaryCtaUrl: primaryCtaUrl,
      heroPrimaryCtaEnabled: primaryCtaEnabled,
      heroPrimaryCtaOpenNewTab: primaryCtaOpenNewTab,
      heroSecondaryCtaText: secondaryCtaText,
      heroSecondaryCtaUrl: secondaryCtaUrl,
      heroSecondaryCtaType: secondaryCtaType,
      heroSecondaryCtaEnabled: secondaryCtaEnabled,
      heroSecondaryCtaOpenNewTab: secondaryCtaOpenNewTab,
      heroBackgroundImageUrl: backgroundImageUrl,
      heroBackgroundImageAlt: backgroundImageAlt,
      heroEnabled: enabled,
      heroDisplayOrder: displayOrder,
      heroEyebrow: badgeText,
      heroTitle: `${headingPrefix} ${headingHighlight} ${headingSuffix}`.trim(),
      heroHighlightedText: headingHighlight,
      primaryCtaLabel: primaryCtaText,
      primaryCtaUrl: primaryCtaUrl,
      secondaryCtaLabel: secondaryCtaText,
      secondaryCtaUrl: secondaryCtaUrl
    };

    let updated;
    if (existing) {
      updated = await prisma.homePage.update({
        where: { id: existing.id },
        data: dataPayload
      });
    } else {
      updated = await prisma.homePage.create({
        data: {
          id: 'home-singleton',
          ...dataPayload,
          servicesEyebrow: 'OUR CAPABILITIES',
          servicesTitle: 'Engineering Excellence Across the Stack',
          servicesDescription: 'High-performance web, mobile, AI, and cloud architectures built by veteran engineers.',
          portfolioEyebrow: 'PROVEN OUTCOMES',
          portfolioTitle: 'Case Studies & Client Results',
          portfolioDescription: 'Real-world software platforms engineered for maximum ROI and sub-100ms response times.',
          aboutEyebrow: 'WHY RYZITE',
          aboutTitle: 'Architected for Speed & Reliability',
          aboutDescription: 'We combine principal engineering, modern tech stacks, and AEO optimization for unmatched quality.',
          faqEyebrow: 'FREQUENTLY ASKED QUESTIONS',
          faqTitle: 'Everything You Need to Know',
          faqDescription: 'Clear answers about our methodology, security standards, SLAs, and kickoff process.',
          blogEyebrow: 'ENGINEERING INSIGHTS',
          blogTitle: 'Latest Tech & AEO Architecture',
          blogDescription: 'Deep dives into generative AI agents, vector databases, zero-downtime microservices, and AEO.',
          finalCtaEyebrow: 'READY TO BUILD?',
          finalCtaTitle: "Let's Architect Your Next Solution",
          finalCtaDescription: 'Get a comprehensive project architecture blueprint, timeline breakdown, and cost estimate.',
          finalCtaLabel: 'Get Free Scope Estimate',
          finalCtaUrl: '#contact'
        }
      });
    }

    return {
      badgeText: updated.heroBadgeText,
      headingPrefix: updated.heroHeadingPrefix,
      headingHighlight: updated.heroHeadingHighlight,
      headingSuffix: updated.heroHeadingSuffix,
      description: updated.heroDescription,
      primaryCtaText: updated.heroPrimaryCtaText,
      primaryCtaUrl: updated.heroPrimaryCtaUrl,
      primaryCtaEnabled: updated.heroPrimaryCtaEnabled,
      primaryCtaOpenNewTab: updated.heroPrimaryCtaOpenNewTab,
      secondaryCtaText: updated.heroSecondaryCtaText,
      secondaryCtaUrl: updated.heroSecondaryCtaUrl,
      secondaryCtaType: updated.heroSecondaryCtaType,
      secondaryCtaEnabled: updated.heroSecondaryCtaEnabled,
      secondaryCtaOpenNewTab: updated.heroSecondaryCtaOpenNewTab,
      backgroundImageUrl: updated.heroBackgroundImageUrl,
      backgroundImageAlt: updated.heroBackgroundImageAlt,
      enabled: updated.heroEnabled,
      displayOrder: updated.heroDisplayOrder,
      updatedAt: updated.updatedAt
    };
  }
};
