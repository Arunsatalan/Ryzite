import { prisma } from './prisma.js';

export const solutionRepository = {
  async getAllPublished() {
    return prisma.solution.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        subtitle: true,
        category: true,
        shortDescription: true,
        fullDescription: true,
        iconKey: true,
        benefits: {
          orderBy: { displayOrder: 'asc' },
          select: { id: true, title: true, description: true, iconKey: true }
        },
        services: {
          select: { service: { select: { id: true, title: true, slug: true } } }
        },
        technologies: {
          select: { technology: { select: { id: true, name: true, slug: true } } }
        }
      }
    });
  },

  async getBySlug(slug: string) {
    return prisma.solution.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: {
        id: true,
        slug: true,
        title: true,
        subtitle: true,
        category: true,
        shortDescription: true,
        fullDescription: true,
        problem: true,
        solution: true,
        iconKey: true,
        benefits: {
          orderBy: { displayOrder: 'asc' },
          select: { id: true, title: true, description: true, iconKey: true }
        },
        seoMetadata: true
      }
    });
  }
};
