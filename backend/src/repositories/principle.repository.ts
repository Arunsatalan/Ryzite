import { prisma } from './prisma.js';
import { cloudinaryService } from '../services/cloudinary.service.js';

function validatePrincipleInput(data: any) {
  const title = (data.title || '').trim();
  const description = (data.description || '').trim();
  const badge = (data.badge || data.tag || 'PILLAR').trim();
  const iconKey = (data.iconKey || data.icon || 'Cpu').trim();
  const backgroundImageUrl = data.backgroundImageUrl ? data.backgroundImageUrl.trim() : null;
  const backgroundImagePublicId = data.backgroundImagePublicId ? data.backgroundImagePublicId.trim() : null;

  if (!title) {
    throw new Error('Pillar title is required.');
  }
  if (!description) {
    throw new Error('Pillar description is required.');
  }

  return {
    badge,
    title,
    description,
    iconKey,
    backgroundImageUrl,
    backgroundImagePublicId,
    enabled: data.enabled ?? data.active ?? true,
    displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0
  };
}

export const principleRepository = {
  async getAllActive() {
    return prisma.companyPrinciple.findMany({
      where: { enabled: true },
      orderBy: { displayOrder: 'asc' }
    });
  },

  async getAllAdmin() {
    return prisma.companyPrinciple.findMany({
      orderBy: { displayOrder: 'asc' }
    });
  },

  async getById(id: string) {
    return prisma.companyPrinciple.findUnique({
      where: { id }
    });
  },

  async createPrinciple(data: any) {
    const validated = validatePrincipleInput(data);
    if (data.displayOrder === undefined) {
      const count = await prisma.companyPrinciple.count();
      validated.displayOrder = count + 1;
    }
    return prisma.companyPrinciple.create({
      data: validated
    });
  },

  async updatePrinciple(id: string, data: any) {
    const existing = await prisma.companyPrinciple.findUnique({ where: { id } });
    const validated = validatePrincipleInput(data);

    if (existing?.backgroundImagePublicId && validated.backgroundImagePublicId && validated.backgroundImagePublicId !== existing.backgroundImagePublicId) {
      await cloudinaryService.deleteImage(existing.backgroundImagePublicId).catch(() => {});
    }

    return prisma.companyPrinciple.update({
      where: { id },
      data: validated
    });
  },

  async deletePrinciple(id: string) {
    const existing = await prisma.companyPrinciple.findUnique({ where: { id } });
    if (existing?.backgroundImagePublicId) {
      await cloudinaryService.deleteImage(existing.backgroundImagePublicId).catch(() => {});
    }
    return prisma.companyPrinciple.delete({
      where: { id }
    });
  },

  async reorderPrinciples(orderedIds: string[]) {
    if (!Array.isArray(orderedIds)) throw new Error('orderedIds must be an array');

    const updates = orderedIds.map((id, index) =>
      prisma.companyPrinciple.update({
        where: { id },
        data: { displayOrder: index + 1 }
      })
    );

    await prisma.$transaction(updates);
    return this.getAllAdmin();
  }
};
