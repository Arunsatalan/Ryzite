import { prisma } from './prisma.js';
import { cloudinaryService } from '../services/cloudinary.service.js';

function validateClientInput(data: any) {
  const name = (data.name || '').trim();
  const companyName = data.companyName ? data.companyName.trim() : null;
  const logoUrl = data.logoUrl ? data.logoUrl.trim() : null;
  const logoPublicId = data.logoPublicId ? data.logoPublicId.trim() : null;
  const logoAltText = data.logoAltText ? data.logoAltText.trim() : null;
  const websiteUrl = data.websiteUrl ? data.websiteUrl.trim() : null;
  const description = data.description ? data.description.trim() : null;
  const caseStudySlug = data.caseStudySlug ? data.caseStudySlug.trim() : null;

  if (!name) {
    throw new Error('Client name is required.');
  }
  if (name.length > 100) {
    throw new Error('Client name must be 100 characters or less.');
  }

  if (logoUrl && !logoAltText) {
    throw new Error('Logo Alt Text is required when a Logo URL is provided.');
  }

  if (logoAltText && logoAltText.length > 200) {
    throw new Error('Logo Alt Text must be 200 characters or less.');
  }

  if (websiteUrl) {
    if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://') && !websiteUrl.startsWith('/')) {
      throw new Error('Website URL must start with http://, https://, or /');
    }
    if (websiteUrl.startsWith('javascript:')) {
      throw new Error('Invalid URL format.');
    }
  }

  const slug = data.slug
    ? data.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    name,
    slug,
    companyName: companyName || name,
    logoUrl: logoUrl || null,
    logoPublicId: logoPublicId || null,
    logoAltText: logoAltText || `${name} company logo`,
    websiteUrl: websiteUrl || null,
    description: description || null,
    caseStudySlug: caseStudySlug || null,
    featured: data.featured ?? true,
    enabled: data.enabled ?? true,
    displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0
  };
}

export const clientRepository = {
  async getAllActive() {
    const clients = await prisma.client.findMany({
      where: { enabled: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        companyName: true,
        logoUrl: true,
        logoPublicId: true,
        logoAltText: true,
        websiteUrl: true,
        caseStudySlug: true,
        featured: true,
        displayOrder: true
      }
    });

    return clients.map(c => ({
      ...c,
      logoAltText: c.logoAltText || `${c.name} company logo`
    }));
  },

  async getAllAdmin() {
    return prisma.client.findMany({
      orderBy: { displayOrder: 'asc' }
    });
  },

  async getById(id: string) {
    return prisma.client.findUnique({
      where: { id }
    });
  },

  async createClient(data: any) {
    const validated = validateClientInput(data);
    
    // Auto calculate display order if not provided
    if (data.displayOrder === undefined) {
      const count = await prisma.client.count();
      validated.displayOrder = count + 1;
    }

    return prisma.client.create({
      data: validated
    });
  },

  async updateClient(id: string, data: any) {
    const existing = await prisma.client.findUnique({ where: { id } });
    const validated = validateClientInput(data);

    if (existing?.logoPublicId && validated.logoPublicId && validated.logoPublicId !== existing.logoPublicId) {
      await cloudinaryService.deleteImage(existing.logoPublicId).catch(() => {});
    }

    return prisma.client.update({
      where: { id },
      data: validated
    });
  },

  async deleteClient(id: string) {
    const existing = await prisma.client.findUnique({ where: { id } });
    if (existing?.logoPublicId) {
      await cloudinaryService.deleteImage(existing.logoPublicId).catch(() => {});
    }
    return prisma.client.delete({
      where: { id }
    });
  },

  async reorderClients(orderedIds: string[]) {
    if (!Array.isArray(orderedIds)) throw new Error('orderedIds must be an array');
    
    const updates = orderedIds.map((id, index) =>
      prisma.client.update({
        where: { id },
        data: { displayOrder: index + 1 }
      })
    );

    await prisma.$transaction(updates);
    return this.getAllAdmin();
  }
};

