import { prisma } from './prisma.js';

export const leadRepository = {
  async getAllLeads(status?: string) {
    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    return prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { service: { select: { id: true, title: true, slug: true } } }
    });
  },

  async createLead(data: any) {
    return prisma.lead.create({
      data: {
        name: data.name || 'Anonymous Inquiry',
        email: data.email,
        company: data.company || null,
        serviceSelected: data.serviceSelected || 'General Consultation',
        serviceId: data.serviceId || null,
        budget: data.budget || 'To be discussed',
        timeline: data.timeline || 'Flexible',
        message: data.message || '',
        status: 'NEW',
        source: data.source || 'Website Contact Form'
      }
    });
  },

  async updateLeadStatus(id: string, status: any, notes?: string) {
    return prisma.lead.update({
      where: { id },
      data: { status, notes }
    });
  },

  async deleteLead(id: string) {
    return prisma.lead.delete({
      where: { id }
    });
  }
};
