import { prisma } from './prisma.js';

export const seoRepository = {
  async getSeoForStaticPage(pageKey: string = 'home') {
    const page = await prisma.staticPage.findUnique({
      where: { pageKey },
      include: { seoMetadata: true }
    });

    if (page?.seoMetadata) {
      return {
        pageKey: page.pageKey,
        title: page.seoMetadata.metaTitle || page.title,
        description: page.seoMetadata.metaDescription,
        canonicalUrl: page.seoMetadata.canonicalUrl || (page.route === '/' ? 'https://ryzite.com' : `https://ryzite.com${page.route}`),
        ogImage: page.seoMetadata.ogImageUrl || '',
        robotsIndex: page.seoMetadata.robotsIndex ?? true,
        robotsFollow: page.seoMetadata.robotsFollow ?? true,
        serpSnippet: page.seoMetadata.serpSnippet as any,
        focusKeywords: page.seoMetadata.focusKeywords as any,
      };
    }
    return null;
  },

  async upsertStaticPageSeo(pageKey: string, data: any) {
    const route = pageKey === 'home' ? '/' : `/${pageKey}`;
    const staticPage = await prisma.staticPage.upsert({
      where: { pageKey },
      update: { title: data.title || `${pageKey} | Ryzite` },
      create: {
        pageKey,
        route,
        title: data.title || `${pageKey} | Ryzite`
      }
    });

    const seoMetadata = await prisma.seoMetadata.upsert({
      where: { staticPageId: staticPage.id },
      update: {
        metaTitle: data.title || `${pageKey} | Ryzite`,
        metaDescription: data.description || '',
        canonicalUrl: data.canonicalUrl || `https://ryzite.com${route === '/' ? '' : route}`,
        ogImageUrl: data.ogImage || '',
        robotsIndex: data.robotsIndex !== undefined ? Boolean(data.robotsIndex) : true,
        robotsFollow: data.robotsFollow !== undefined ? Boolean(data.robotsFollow) : true,
        serpSnippet: data.serpSnippet || undefined,
        focusKeywords: data.focusKeywords || undefined,
      },
      create: {
        staticPageId: staticPage.id,
        metaTitle: data.title || `${pageKey} | Ryzite`,
        metaDescription: data.description || '',
        canonicalUrl: data.canonicalUrl || `https://ryzite.com${route === '/' ? '' : route}`,
        ogImageUrl: data.ogImage || '',
        robotsIndex: data.robotsIndex !== undefined ? Boolean(data.robotsIndex) : true,
        robotsFollow: data.robotsFollow !== undefined ? Boolean(data.robotsFollow) : true,
        serpSnippet: data.serpSnippet || undefined,
        focusKeywords: data.focusKeywords || undefined,
      }
    });

    return { staticPage, seoMetadata };
  },

  async getLatestAuditLogs() {
    return prisma.seoAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
  },

  async calculateSeoHealthScore(): Promise<{ score: number; totalPages: number; checkedPages: number }> {
    const pages = await prisma.staticPage.findMany({
      include: { seoMetadata: true }
    });

    if (!pages || pages.length === 0) {
      return { score: 0, totalPages: 0, checkedPages: 0 };
    }

    let totalPoints = 0;
    let earnedPoints = 0;

    for (const page of pages) {
      const meta = page.seoMetadata;
      // Checks for each page:
      // 1. Meta Title present (>= 10 chars): 2 points
      totalPoints += 2;
      if (meta?.metaTitle && meta.metaTitle.trim().length >= 10) {
        earnedPoints += 2;
      }

      // 2. Meta Description present (>= 20 chars): 2 points
      totalPoints += 2;
      if (meta?.metaDescription && meta.metaDescription.trim().length >= 20) {
        earnedPoints += 2;
      }

      // 3. Canonical URL present: 1 point
      totalPoints += 1;
      if (meta?.canonicalUrl && meta.canonicalUrl.startsWith('http')) {
        earnedPoints += 1;
      }

      // 4. Robots Index enabled: 1 point
      totalPoints += 1;
      if (meta?.robotsIndex ?? true) {
        earnedPoints += 1;
      }

      // 5. Robots Follow enabled: 1 point
      totalPoints += 1;
      if (meta?.robotsFollow ?? true) {
        earnedPoints += 1;
      }
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 100;
    return { score, totalPages: pages.length, checkedPages: pages.length };
  }
};
