import { prisma } from './prisma.js';

export const serviceRepository = {
  async getAllPublished() {
    return prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        categoryName: true,
        shortDescription: true,
        fullDescription: true,
        iconName: true,
        timeline: true,
        startingPrice: true,
        displayOrder: true,
        featured: true,
        features: {
          orderBy: { displayOrder: 'asc' },
          select: { id: true, title: true, description: true, iconKey: true }
        },
        deliverables: {
          orderBy: { displayOrder: 'asc' },
          select: { id: true, title: true, description: true }
        },
        technologies: {
          orderBy: { displayOrder: 'asc' },
          select: {
            technology: {
              select: { id: true, name: true, slug: true, iconUrl: true, iconKey: true }
            }
          }
        }
      }
    });
  },

  async getBySlug(slug: string) {
    return prisma.service.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        categoryName: true,
        shortDescription: true,
        fullDescription: true,
        iconName: true,
        timeline: true,
        startingPrice: true,
        features: {
          orderBy: { displayOrder: 'asc' },
          select: { id: true, title: true, description: true, iconKey: true }
        },
        deliverables: {
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
        },
        seoMetadata: true
      }
    });
  },

  async createService(data: any) {
    const { features = [], deliverables = [], techStack = [], category, ...serviceData } = data;
    const mappedCategory = category === 'web' ? 'WEB_DEV' : (category === 'mobile' ? 'MOBILE_DEV' : (category === 'ai-automation' ? 'AI_AUTOMATION' : (category === 'cloud-devops' ? 'CLOUD_DEVOPS' : (category === 'consulting' ? 'CONSULTING' : (category || 'WEB_DEV')))));

    return prisma.service.create({
      data: {
        ...serviceData,
        category: mappedCategory,
        features: {
          create: features.map((f: string | any, idx: number) =>
            typeof f === 'string' ? { title: f, displayOrder: idx + 1 } : { ...f, displayOrder: idx + 1 }
          )
        },
        deliverables: {
          create: deliverables.map((d: string | any, idx: number) =>
            typeof d === 'string' ? { title: d, displayOrder: idx + 1 } : { ...d, displayOrder: idx + 1 }
          )
        }
      }
    });
  },

  async updateService(id: string, data: any) {
    return prisma.service.update({
      where: { id },
      data
    });
  },

  async deleteService(id: string) {
    return prisma.service.delete({
      where: { id }
    });
  }
};
