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
    const { metrics = [], highlights = [], ...projectData } = data;
    return prisma.project.create({
      data: {
        ...projectData,
        metrics: {
          create: metrics.map((m: any, idx: number) => ({ ...m, displayOrder: idx + 1 }))
        },
        highlights: {
          create: highlights.map((h: any, idx: number) => ({ ...h, displayOrder: idx + 1 }))
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
