import { prisma } from './prisma.js';
import { cloudinaryService } from '../services/cloudinary.service.js';

export const projectRepository = {
  async getAllPublished(category?: string) {
    const whereCondition: any = { status: 'PUBLISHED' };
    if (category && category !== 'All' && category !== 'ALL') {
      whereCondition.category = category;
    }

    return prisma.project.findMany({
      where: whereCondition,
      orderBy: { displayOrder: 'asc' },
      include: {
        metrics: { orderBy: { displayOrder: 'asc' } },
        highlights: { orderBy: { displayOrder: 'asc' } },
        challengesList: { orderBy: { displayOrder: 'asc' } },
        solutionsList: { orderBy: { displayOrder: 'asc' } },
        resultsList: { orderBy: { displayOrder: 'asc' } },
        technologies: {
          orderBy: { displayOrder: 'asc' },
          select: {
            technology: { select: { id: true, name: true, slug: true, iconUrl: true } }
          }
        },
        seoMetadata: true
      }
    });
  },

  async getBySlug(slug: string) {
    return prisma.project.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: {
        metrics: { orderBy: { displayOrder: 'asc' } },
        highlights: { orderBy: { displayOrder: 'asc' } },
        challengesList: { orderBy: { displayOrder: 'asc' } },
        solutionsList: { orderBy: { displayOrder: 'asc' } },
        resultsList: { orderBy: { displayOrder: 'asc' } },
        technologies: {
          orderBy: { displayOrder: 'asc' },
          select: {
            technology: { select: { id: true, name: true, slug: true, iconUrl: true } }
          }
        },
        seoMetadata: true
      }
    });
  },

  async getAdminProjects(params: { search?: string; category?: string; status?: string; page?: number; limit?: number }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 50;
    const skip = (page - 1) * limit;

    const whereCondition: any = {};

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      whereCondition.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { clientName: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
        { shortDescription: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } }
      ];
    }

    if (params.category && params.category !== 'ALL' && params.category !== 'All') {
      whereCondition.category = params.category;
    }

    if (params.status && params.status !== 'ALL') {
      whereCondition.status = params.status;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: whereCondition,
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        include: {
          metrics: { orderBy: { displayOrder: 'asc' } },
          highlights: { orderBy: { displayOrder: 'asc' } },
          challengesList: { orderBy: { displayOrder: 'asc' } },
          solutionsList: { orderBy: { displayOrder: 'asc' } },
          resultsList: { orderBy: { displayOrder: 'asc' } },
          seoMetadata: true
        }
      }),
      prisma.project.count({ where: whereCondition })
    ]);

    return {
      projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getCounts() {
    const [total, published, featured, drafts] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'PUBLISHED' } }),
      prisma.project.count({ where: { featured: true, status: 'PUBLISHED' } }),
      prisma.project.count({ where: { status: 'DRAFT' } })
    ]);

    return { total, published, featured, drafts };
  },

  async createProject(data: any, userId?: string) {
    const {
      metrics = [],
      highlights = [],
      challengesList = [],
      solutionsList = [],
      resultsList = [],
      client,
      mockupType,
      description,
      longDescription,
      seoTitle,
      seoDescription,
      coverImageUrl,
      coverImagePublicId,
      galleryImages,
      ...projectData
    } = data;

    const clientName = client || projectData.clientName || 'Enterprise Client';
    const mockupTypeEnum = ['DARK_DASHBOARD', 'MOBILE_CARDS', 'BOT_INTERFACE', 'ANALYTICS_SUITE'].includes(mockupType)
      ? mockupType
      : (mockupType === 'dark-dashboard' ? 'DARK_DASHBOARD' : (mockupType === 'mobile-cards' ? 'MOBILE_CARDS' : (mockupType === 'bot-interface' ? 'BOT_INTERFACE' : (mockupType === 'analytics-suite' ? 'ANALYTICS_SUITE' : 'DARK_DASHBOARD'))));

    const shortDescription = description || projectData.shortDescription || 'Case study overview.';
    const fullDescription = longDescription || projectData.fullDescription || shortDescription;
    const heroImage = coverImageUrl || projectData.heroImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71';

    const created = await prisma.project.create({
      data: {
        title: projectData.title,
        slug: projectData.slug,
        heroTitle: projectData.heroTitle || null,
        subtitle: projectData.subtitle || null,
        category: projectData.category || 'SaaS Platform',
        clientName,
        clientLogoUrl: projectData.clientLogoUrl || null,
        clientLogoPublicId: projectData.clientLogoPublicId || null,
        clientWebsiteUrl: projectData.clientWebsiteUrl || null,
        shortDescription,
        fullDescription,
        challenge: projectData.challenge || null,
        solution: projectData.solution || null,
        results: projectData.results || null,
        businessImpactText: projectData.businessImpactText || null,
        heroImage,
        heroImagePublicId: projectData.heroImagePublicId || null,
        coverImageUrl: coverImageUrl || heroImage,
        coverImagePublicId: coverImagePublicId || projectData.publicId || null,
        architectureDiagramUrl: projectData.architectureDiagramUrl || null,
        architectureDiagramPublicId: projectData.architectureDiagramPublicId || null,
        liveUrl: projectData.liveUrl || projectData.websiteUrl || null,
        ctaText: projectData.ctaText || 'Visit Live Platform Demo',
        ctaLink: projectData.ctaLink || projectData.websiteUrl || null,
        galleryImages: galleryImages || null,
        mockupType: mockupTypeEnum,
        testimonial: projectData.testimonial || null,
        websiteUrl: projectData.websiteUrl || null,
        githubUrl: projectData.githubUrl || null,
        status: projectData.status || 'PUBLISHED',
        featured: projectData.featured ?? true,
        displayOrder: projectData.displayOrder ?? 0,
        metrics: {
          create: metrics.map((m: any, idx: number) => ({
            label: typeof m === 'string' ? m : m.label,
            value: typeof m === 'string' ? '100%' : m.value,
            trend: typeof m === 'string' ? null : (m.trend || null),
            description: typeof m === 'string' ? null : (m.description || null),
            icon: typeof m === 'string' ? 'TrendingUp' : (m.icon || 'TrendingUp'),
            displayOrder: idx + 1
          }))
        },
        highlights: {
          create: highlights.map((h: any, idx: number) => ({
            title: typeof h === 'string' ? h : h.title,
            description: typeof h === 'string' ? null : (h.description || null),
            displayOrder: idx + 1
          }))
        },
        challengesList: {
          create: challengesList.map((c: any, idx: number) => ({
            title: typeof c === 'string' ? c : c.title,
            description: typeof c === 'string' ? null : (c.description || null),
            icon: typeof c === 'string' ? 'AlertTriangle' : (c.icon || 'AlertTriangle'),
            displayOrder: idx + 1
          }))
        },
        solutionsList: {
          create: solutionsList.map((s: any, idx: number) => ({
            title: typeof s === 'string' ? s : s.title,
            description: typeof s === 'string' ? null : (s.description || null),
            icon: typeof s === 'string' ? 'CheckCircle2' : (s.icon || 'CheckCircle2'),
            displayOrder: idx + 1
          }))
        },
        resultsList: {
          create: resultsList.map((r: any, idx: number) => ({
            title: r.title || `Outcome ${idx + 1}`,
            beforeText: r.beforeText || 'Manual Workflow',
            afterText: r.afterText || 'Automated Pipeline',
            displayOrder: idx + 1
          }))
        },
        seoMetadata: (seoTitle || seoDescription || projectData.canonicalUrl) ? {
          create: {
            metaTitle: seoTitle || projectData.title,
            metaDescription: seoDescription || shortDescription,
            canonicalUrl: projectData.canonicalUrl || null,
            focusKeywords: projectData.focusKeywords || null
          }
        } : undefined
      },
      include: {
        metrics: true,
        highlights: true,
        challengesList: true,
        solutionsList: true,
        resultsList: true,
        seoMetadata: true
      }
    });

    if (userId) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE',
          entity: 'PROJECT',
          entityId: created.id,
          details: { title: created.title, slug: created.slug }
        }
      }).catch(() => {});
    }

    return created;
  },

  async updateProject(id: string, data: any, userId?: string) {
    const existing = await prisma.project.findUnique({ where: { id }, select: { coverImagePublicId: true, architectureDiagramPublicId: true, clientLogoPublicId: true } });

    const {
      metrics,
      highlights,
      challengesList,
      solutionsList,
      resultsList,
      client,
      mockupType,
      description,
      longDescription,
      seoTitle,
      seoDescription,
      coverImageUrl,
      coverImagePublicId,
      galleryImages,
      ...projectData
    } = data;

    const updatePayload: any = { ...projectData };

    if (coverImageUrl) {
      updatePayload.coverImageUrl = coverImageUrl;
      updatePayload.heroImage = coverImageUrl;
    }

    if (coverImagePublicId !== undefined) {
      updatePayload.coverImagePublicId = coverImagePublicId;
      if (existing?.coverImagePublicId && coverImagePublicId !== existing.coverImagePublicId) {
        await cloudinaryService.deleteImage(existing.coverImagePublicId).catch(() => {});
      }
    }

    if (galleryImages !== undefined) {
      updatePayload.galleryImages = galleryImages;
    }

    if (client !== undefined) updatePayload.clientName = client;
    if (description !== undefined) updatePayload.shortDescription = description;
    if (longDescription !== undefined) updatePayload.fullDescription = longDescription;

    if (mockupType !== undefined) {
      updatePayload.mockupType = ['DARK_DASHBOARD', 'MOBILE_CARDS', 'BOT_INTERFACE', 'ANALYTICS_SUITE'].includes(mockupType)
        ? mockupType
        : (mockupType === 'dark-dashboard' ? 'DARK_DASHBOARD' : (mockupType === 'mobile-cards' ? 'MOBILE_CARDS' : (mockupType === 'bot-interface' ? 'BOT_INTERFACE' : (mockupType === 'analytics-suite' ? 'ANALYTICS_SUITE' : 'DARK_DASHBOARD'))));
    }

    if (metrics && Array.isArray(metrics)) {
      await prisma.projectMetric.deleteMany({ where: { projectId: id } });
      updatePayload.metrics = {
        create: metrics.map((m: any, idx: number) => ({
          label: typeof m === 'string' ? m : m.label,
          value: typeof m === 'string' ? '100%' : m.value,
          trend: typeof m === 'string' ? null : (m.trend || null),
          description: typeof m === 'string' ? null : (m.description || null),
          icon: typeof m === 'string' ? 'TrendingUp' : (m.icon || 'TrendingUp'),
          displayOrder: idx + 1
        }))
      };
    }

    if (highlights && Array.isArray(highlights)) {
      await prisma.projectHighlight.deleteMany({ where: { projectId: id } });
      updatePayload.highlights = {
        create: highlights.map((h: any, idx: number) => ({
          title: typeof h === 'string' ? h : h.title,
          description: typeof h === 'string' ? null : (h.description || null),
          displayOrder: idx + 1
        }))
      };
    }

    if (challengesList && Array.isArray(challengesList)) {
      await prisma.projectChallenge.deleteMany({ where: { projectId: id } });
      updatePayload.challengesList = {
        create: challengesList.map((c: any, idx: number) => ({
          title: typeof c === 'string' ? c : c.title,
          description: typeof c === 'string' ? null : (c.description || null),
          icon: typeof c === 'string' ? 'AlertTriangle' : (c.icon || 'AlertTriangle'),
          displayOrder: idx + 1
        }))
      };
    }

    if (solutionsList && Array.isArray(solutionsList)) {
      await prisma.projectSolution.deleteMany({ where: { projectId: id } });
      updatePayload.solutionsList = {
        create: solutionsList.map((s: any, idx: number) => ({
          title: typeof s === 'string' ? s : s.title,
          description: typeof s === 'string' ? null : (s.description || null),
          icon: typeof s === 'string' ? 'CheckCircle2' : (s.icon || 'CheckCircle2'),
          displayOrder: idx + 1
        }))
      };
    }

    if (resultsList && Array.isArray(resultsList)) {
      await prisma.projectResult.deleteMany({ where: { projectId: id } });
      updatePayload.resultsList = {
        create: resultsList.map((r: any, idx: number) => ({
          title: r.title || `Outcome ${idx + 1}`,
          beforeText: r.beforeText || 'Manual Workflow',
          afterText: r.afterText || 'Automated Pipeline',
          displayOrder: idx + 1
        }))
      };
    }

    if (seoTitle !== undefined || seoDescription !== undefined || projectData.canonicalUrl !== undefined) {
      updatePayload.seoMetadata = {
        upsert: {
          create: {
            metaTitle: seoTitle || projectData.title || 'Project',
            metaDescription: seoDescription || updatePayload.shortDescription || 'Case Study',
            canonicalUrl: projectData.canonicalUrl || null,
            focusKeywords: projectData.focusKeywords || null
          },
          update: {
            ...(seoTitle !== undefined ? { metaTitle: seoTitle } : {}),
            ...(seoDescription !== undefined ? { metaDescription: seoDescription } : {}),
            ...(projectData.canonicalUrl !== undefined ? { canonicalUrl: projectData.canonicalUrl } : {}),
            ...(projectData.focusKeywords !== undefined ? { focusKeywords: projectData.focusKeywords } : {})
          }
        }
      };
    }

    const updated = await prisma.project.update({
      where: { id },
      data: updatePayload,
      include: {
        metrics: true,
        highlights: true,
        challengesList: true,
        solutionsList: true,
        resultsList: true,
        seoMetadata: true
      }
    });

    if (userId) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE',
          entity: 'PROJECT',
          entityId: updated.id,
          details: { title: updated.title, slug: updated.slug }
        }
      }).catch(() => {});
    }

    return updated;
  },

  async deleteProject(id: string, userId?: string) {
    const existing = await prisma.project.findUnique({
      where: { id },
      select: { coverImagePublicId: true, galleryImages: true }
    });

    const deleted = await prisma.project.delete({
      where: { id }
    });

    if (existing?.coverImagePublicId) {
      await cloudinaryService.deleteImage(existing.coverImagePublicId).catch(() => {});
    }

    if (existing?.galleryImages && Array.isArray(existing.galleryImages)) {
      for (const item of (existing.galleryImages as any[])) {
        if (item?.publicId) {
          await cloudinaryService.deleteImage(item.publicId).catch(() => {});
        }
      }
    }

    if (userId) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'DELETE',
          entity: 'PROJECT',
          entityId: id,
          details: { title: deleted.title, slug: deleted.slug }
        }
      }).catch(() => {});
    }

    return deleted;
  },

  async toggleStatus(id: string, status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED', userId?: string) {
    const updated = await prisma.project.update({
      where: { id },
      data: { status }
    });

    if (userId) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'TOGGLE_STATUS',
          entity: 'PROJECT',
          entityId: id,
          details: { status }
        }
      }).catch(() => {});
    }

    return updated;
  },

  async toggleFeatured(id: string, featured: boolean, userId?: string) {
    const updated = await prisma.project.update({
      where: { id },
      data: { featured }
    });

    if (userId) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'TOGGLE_FEATURED',
          entity: 'PROJECT',
          entityId: id,
          details: { featured }
        }
      }).catch(() => {});
    }

    return updated;
  },

  async reorderProjects(items: { id: string; displayOrder: number }[], userId?: string) {
    const transactions = items.map(item =>
      prisma.project.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder }
      })
    );
    const result = await prisma.$transaction(transactions);

    if (userId) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'REORDER',
          entity: 'PROJECT',
          details: { count: items.length }
        }
      }).catch(() => {});
    }

    return result;
  }
};


