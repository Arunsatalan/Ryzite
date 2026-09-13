import { prisma } from './prisma.js';

export const projectRepository = {
  async getAllPublished() {
    return prisma.project.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        clientName: true,
        category: true,
        shortDescription: true,
        fullDescription: true,
        heroImage: true,
        mockupType: true,
        testimonial: true,
        websiteUrl: true,
        githubUrl: true,
        featured: true,
        displayOrder: true,
        metrics: {
          orderBy: { displayOrder: 'asc' },
          select: { id: true, label: true, value: true, trend: true }
        },
        highlights: {
          orderBy: { displayOrder: 'asc' },
          select: { id: true, title: true, description: true }
        },
        technologies: {
          orderBy: { displayOrder: 'asc' },
          select: {
            technology: {
              select: { id: true, name: true, slug: true, iconUrl: true }
            }
          }
        }
      }
    });
  },

  async getBySlug(slug: string) {
    return prisma.project.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: {
        id: true,
        slug: true,
        title: true,
        clientName: true,
        category: true,
        shortDescription: true,
        fullDescription: true,
        challenge: true,
        solution: true,
        results: true,
        heroImage: true,
        mockupType: true,
        testimonial: true,
        websiteUrl: true,
        githubUrl: true,
        metrics: {
          orderBy: { displayOrder: 'asc' },
          select: { id: true, label: true, value: true, trend: true }
        },
        highlights: {
          orderBy: { displayOrder: 'asc' },
          select: { id: true, title: true, description: true }
        },
        technologies: {
          orderBy: { displayOrder: 'asc' },
          select: {
            technology: { select: { id: true, name: true, slug: true } }
          }
        },
        seoMetadata: true
      }
    });
  },

  async createProject(data: any) {
    const { metrics = [], highlights = [], techStack = [], challenges = [], solutions = [], client, mockupType, description, longDescription, ...projectData } = data;
    const clientName = client || projectData.clientName || 'Enterprise Partner';
    const mockupTypeEnum = mockupType === 'dark-dashboard' ? 'DARK_DASHBOARD' : (mockupType === 'mobile-cards' ? 'MOBILE_CARDS' : (mockupType === 'bot-interface' ? 'BOT_INTERFACE' : (mockupType === 'analytics-suite' ? 'ANALYTICS_SUITE' : (mockupType || 'DARK_DASHBOARD'))));

    const shortDescription = description || projectData.shortDescription || 'Case study overview.';
    const fullDescription = longDescription || projectData.fullDescription || shortDescription;
    const challengeStr = Array.isArray(challenges) ? challenges.join('\n') : (challenges || projectData.challenge || null);
    const solutionStr = Array.isArray(solutions) ? solutions.join('\n') : (solutions || projectData.solution || null);

    return prisma.project.create({
      data: {
        ...projectData,
        clientName,
        shortDescription,
        fullDescription,
        challenge: challengeStr,
        solution: solutionStr,
        category: projectData.category || 'SaaS Platform',
        heroImage: projectData.heroImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
        mockupType: mockupTypeEnum,
        metrics: {
          create: metrics.map((m: any, idx: number) => ({
            label: typeof m === 'string' ? m : m.label,
            value: typeof m === 'string' ? '100%' : m.value,
            trend: typeof m === 'string' ? null : (m.trend || null),
            displayOrder: idx + 1
          }))
        },
        highlights: {
          create: highlights.map((h: any, idx: number) => ({
            title: typeof h === 'string' ? h : h.title,
            description: typeof h === 'string' ? null : (h.description || null),
            displayOrder: idx + 1
          }))
        }
      }
    });
  },

  async updateProject(id: string, data: any) {
    return prisma.project.update({
      where: { id },
      data
    });
  },

  async deleteProject(id: string) {
    return prisma.project.delete({
      where: { id }
    });
  }
};
