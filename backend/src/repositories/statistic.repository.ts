import { prisma } from './prisma.js';

export interface CompanyStatisticInput {
  value: string;
  prefix?: string | null;
  suffix?: string | null;
  label: string;
  description?: string | null;
  iconName?: string | null;
  iconColor?: string | null;
  animationEnabled?: boolean;
  displayOrder?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
  seoTitle?: string | null;
  seoDescription?: string | null;
}

function sanitizeInput(data: any): CompanyStatisticInput {
  const value = (data.value !== undefined && data.value !== null) ? String(data.value).trim() : '';
  const label = (data.label !== undefined && data.label !== null) ? String(data.label).trim() : '';

  if (!value) {
    throw new Error('Statistic value is required.');
  }
  if (!label) {
    throw new Error('Statistic label is required.');
  }
  if (label.length > 100) {
    throw new Error('Label cannot exceed 100 characters.');
  }

  const description = data.description ? String(data.description).trim() : null;
  if (description && description.length > 250) {
    throw new Error('Description cannot exceed 250 characters.');
  }

  let status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN' = 'PUBLISHED';
  if (data.status && ['DRAFT', 'PUBLISHED', 'HIDDEN'].includes(data.status)) {
    status = data.status;
  }

  return {
    value,
    prefix: data.prefix ? String(data.prefix).trim() : '',
    suffix: data.suffix ? String(data.suffix).trim() : '',
    label,
    description,
    iconName: data.iconName ? String(data.iconName).trim() : 'Rocket',
    iconColor: data.iconColor ? String(data.iconColor).trim() : '#0052FF',
    animationEnabled: data.animationEnabled ?? true,
    displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0,
    status,
    seoTitle: data.seoTitle ? String(data.seoTitle).trim() : null,
    seoDescription: data.seoDescription ? String(data.seoDescription).trim() : null
  };
}

export const statisticRepository = {
  async getAllPublished() {
    return prisma.companyStatistic.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' }
    });
  },

  async getAllAdmin() {
    return prisma.companyStatistic.findMany({
      orderBy: { displayOrder: 'asc' }
    });
  },

  async getById(id: string) {
    return prisma.companyStatistic.findUnique({
      where: { id }
    });
  },

  async createStatistic(data: any) {
    const sanitized = sanitizeInput(data);

    if (data.displayOrder === undefined || data.displayOrder === 0) {
      const count = await prisma.companyStatistic.count();
      sanitized.displayOrder = count + 1;
    }

    return prisma.companyStatistic.create({
      data: sanitized
    });
  },

  async updateStatistic(id: string, data: any) {
    const sanitized = sanitizeInput(data);
    return prisma.companyStatistic.update({
      where: { id },
      data: sanitized
    });
  },

  async deleteStatistic(id: string) {
    return prisma.companyStatistic.delete({
      where: { id }
    });
  },

  async updateStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN') {
    if (!['DRAFT', 'PUBLISHED', 'HIDDEN'].includes(status)) {
      throw new Error('Invalid statistic status.');
    }
    return prisma.companyStatistic.update({
      where: { id },
      data: { status }
    });
  },

  async reorderStatistics(orderedIds: string[]) {
    if (!Array.isArray(orderedIds)) {
      throw new Error('orderedIds must be an array of statistic IDs.');
    }

    const updates = orderedIds.map((id, index) =>
      prisma.companyStatistic.update({
        where: { id },
        data: { displayOrder: index + 1 }
      })
    );

    await prisma.$transaction(updates);
    return this.getAllAdmin();
  }
};
