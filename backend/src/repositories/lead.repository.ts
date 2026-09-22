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
      include: {
        service: { select: { id: true, title: true, slug: true } },
        sourceCta: { select: { id: true, name: true, headline: true } },
        touchpoints: { orderBy: { timestamp: 'asc' } }
      }
    });
  },

  async getLeadById(id: string) {
    return prisma.lead.findUnique({
      where: { id },
      include: {
        service: { select: { id: true, title: true, slug: true } },
        sourceCta: true,
        touchpoints: { orderBy: { timestamp: 'asc' }, include: { cta: { select: { id: true, name: true } } } }
      }
    });
  },

  async createLead(data: any) {
    const ctaId = data.sourceCtaId || data.ctaId || null;

    const newLead = await prisma.lead.create({
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
        source: data.source || 'Website Contact Form',
        sourceCtaId: ctaId !== 'default-fallback-cta' ? ctaId : null,
        utmSource: data.utmSource || data.utm_source || null,
        utmMedium: data.utmMedium || data.utm_medium || null,
        utmCampaign: data.utmCampaign || data.utm_campaign || null,
        referrer: data.referrer || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null
      }
    });

    // Record initial Lead Touchpoint for conversion journey tracing (Section 25)
    if (data.pageUrl || ctaId) {
      await prisma.leadTouchpoint.create({
        data: {
          leadId: newLead.id,
          ctaId: ctaId !== 'default-fallback-cta' ? ctaId : null,
          pageUrl: data.pageUrl || '/',
          eventType: 'LEAD_SUBMISSION'
        }
      }).catch(err => console.warn('[LEAD TOUCHPOINT WARN]', err.message));
    }

    return newLead;
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
