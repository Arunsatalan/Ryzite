import { prisma } from './prisma.js';
import { cloudinaryService } from '../services/cloudinary.service.js';

export const serviceRepository = {
  async getAllPublished() {
    return prisma.service.findMany({
      where: {
        active: true,
        status: 'PUBLISHED'
      },
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
        imageUrl: true,
        imagePublicId: true,
        imageAlt: true,
        active: true,
        displayOrder: true,
        featured: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
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

  async getAllAdmin() {
    return prisma.service.findMany({
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
        imageUrl: true,
        imagePublicId: true,
        imageAlt: true,
        active: true,
        displayOrder: true,
        featured: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  async getBySlug(slug: string) {
    return prisma.service.findFirst({
      where: { slug, active: true, status: 'PUBLISHED' },
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
        imageUrl: true,
        imagePublicId: true,
        imageAlt: true,
        active: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
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
    const {
      features = [],
      deliverables = [],
      techStack = [],
      category,
      active,
      order,
      displayOrder,
      id,
      createdAt,
      updatedAt,
      categoryName,
      imagePublicId,
      ...serviceData
    } = data;

    const mappedCategory =
      category === 'web' || category === 'WEB_DEV' ? 'WEB_DEV' :
      category === 'mobile' || category === 'MOBILE_DEV' ? 'MOBILE_DEV' :
      category === 'ai-automation' || category === 'AI_AUTOMATION' ? 'AI_AUTOMATION' :
      category === 'cloud-devops' || category === 'CLOUD_DEVOPS' ? 'CLOUD_DEVOPS' :
      category === 'consulting' || category === 'CONSULTING' ? 'CONSULTING' :
      'WEB_DEV';

    const finalDisplayOrder = displayOrder !== undefined ? Number(displayOrder) : (order !== undefined ? Number(order) : 0);

    return prisma.service.create({
      data: {
        ...serviceData,
        imagePublicId: imagePublicId || null,
        category: mappedCategory,
        active: active !== undefined ? Boolean(active) : true,
        displayOrder: finalDisplayOrder,
        features: {
          create: features.map((f: string | any, idx: number) =>
            typeof f === 'string'
              ? { title: f, displayOrder: idx + 1 }
              : { title: f.title || f.name || '', description: f.description || '', displayOrder: f.displayOrder || (idx + 1) }
          )
        },
        deliverables: {
          create: deliverables.map((d: string | any, idx: number) =>
            typeof d === 'string'
              ? { title: d, displayOrder: idx + 1 }
              : { title: d.title || d.name || '', description: d.description || '', displayOrder: d.displayOrder || (idx + 1) }
          )
        }
      }
    });
  },

  async updateService(id: string, data: any) {
    const existing = await prisma.service.findUnique({ where: { id }, select: { imagePublicId: true } });

    const {
      features,
      deliverables,
      techStack,
      category,
      active,
      order,
      displayOrder,
      id: _id,
      createdAt,
      updatedAt,
      categoryName,
      ...updateData
    } = data;

    if (updateData.imagePublicId && existing?.imagePublicId && updateData.imagePublicId !== existing.imagePublicId) {
      await cloudinaryService.deleteImage(existing.imagePublicId).catch(() => {});
    }

    const mappedCategory = category ? (
      category === 'web' || category === 'WEB_DEV' ? 'WEB_DEV' :
      category === 'mobile' || category === 'MOBILE_DEV' ? 'MOBILE_DEV' :
      category === 'ai-automation' || category === 'AI_AUTOMATION' ? 'AI_AUTOMATION' :
      category === 'cloud-devops' || category === 'CLOUD_DEVOPS' ? 'CLOUD_DEVOPS' :
      category === 'consulting' || category === 'CONSULTING' ? 'CONSULTING' :
      category
    ) : undefined;

    const finalDisplayOrder = displayOrder !== undefined ? Number(displayOrder) : (order !== undefined ? Number(order) : undefined);

    return prisma.service.update({
      where: { id },
      data: {
        ...updateData,
        ...(mappedCategory ? { category: mappedCategory } : {}),
        ...(active !== undefined ? { active: Boolean(active) } : {}),
        ...(finalDisplayOrder !== undefined ? { displayOrder: finalDisplayOrder } : {})
      }
    });
  },

  async deleteService(id: string) {
    const existing = await prisma.service.findUnique({ where: { id }, select: { imagePublicId: true } });
    const deleted = await prisma.service.delete({
      where: { id }
    });

    if (existing?.imagePublicId) {
      await cloudinaryService.deleteImage(existing.imagePublicId).catch(() => {});
    }

    return deleted;
  },

  async reorderServices(orderedIds: string[]) {
    const updates = orderedIds.map((id, index) =>
      prisma.service.update({
        where: { id },
        data: { displayOrder: index + 1 }
      })
    );
    return prisma.$transaction(updates);
  }
};

