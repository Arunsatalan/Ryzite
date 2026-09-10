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
  }
};
