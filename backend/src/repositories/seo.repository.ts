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
        canonicalUrl: page.seoMetadata.canonicalUrl || 'https://ryzite.com',
        ogImage: page.seoMetadata.ogImageUrl || '',
        serpSnippet: page.seoMetadata.serpSnippet as any,
        focusKeywords: page.seoMetadata.focusKeywords as any,
      };
    }
    return null;
  },

  async upsertStaticPageSeo(pageKey: string, data: any) {
    const staticPage = await prisma.staticPage.upsert({
      where: { pageKey },
      update: { title: data.title || `${pageKey} | Ryzite` },
      create: {
        pageKey,
        route: pageKey === 'home' ? '/' : `/${pageKey}`,
        title: data.title || `${pageKey} | Ryzite`
      }
    });

    const seoMetadata = await prisma.seoMetadata.upsert({
      where: { staticPageId: staticPage.id },
      update: {
        metaTitle: data.title || `${pageKey} | Ryzite`,
        metaDescription: data.description || '',
        canonicalUrl: data.canonicalUrl || `https://ryzite.com/${pageKey === 'home' ? '' : pageKey}`,
        ogImageUrl: data.ogImage || '',
        serpSnippet: data.serpSnippet || undefined,
        focusKeywords: data.focusKeywords || undefined,
      },
      create: {
        staticPageId: staticPage.id,
        metaTitle: data.title || `${pageKey} | Ryzite`,
        metaDescription: data.description || '',
        canonicalUrl: data.canonicalUrl || `https://ryzite.com/${pageKey === 'home' ? '' : pageKey}`,
        ogImageUrl: data.ogImage || '',
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
  }
};
