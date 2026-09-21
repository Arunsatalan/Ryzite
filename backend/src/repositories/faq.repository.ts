import { prisma } from './prisma.js';
import { cloudinaryService } from '../services/cloudinary.service.js';

export interface FaqFilterParams {
  categorySlug?: string;
  serviceId?: string;
  projectId?: string;
  featured?: boolean;
  searchQuery?: string;
  faqType?: string;
  limit?: number;
  offset?: number;
}

export interface CreateFaqInput {
  question: string;
  slug?: string;
  shortAnswer: string;
  answerContent: string;
  categoryId?: string;
  faqType?: string;
  status?: string;
  displayOrder?: number;
  featured?: boolean;
  isGlobal?: boolean;
  indexable?: boolean;
  imageUrl?: string;
  imagePublicId?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  sourceType?: string;
  sourceUrl?: string;
  sourceNote?: string;
  reviewDueAt?: string | Date;
  serviceIds?: string[];
  projectIds?: string[];
  relatedFaqIds?: string[];
  authorId?: string;
}

const DEFAULT_CATEGORIES = [
  { name: 'Services & Development', slug: 'services', description: 'Questions regarding our custom software engineering & architecture services.', icon: 'Code', displayOrder: 1 },
  { name: 'AI & Automation', slug: 'ai-automation', description: 'LLM agentic workflows, RAG pipelines, and automated intelligence.', icon: 'Sparkles', displayOrder: 2 },
  { name: 'Pricing & Engagement', slug: 'pricing', description: 'Transparent pricing models, sprint structures, and contract terms.', icon: 'DollarSign', displayOrder: 3 },
  { name: 'Process & Agile Delivery', slug: 'process', description: 'How we collaborate, sprint planning, and communication cadence.', icon: 'GitBranch', displayOrder: 4 },
  { name: 'Cloud & Infrastructure', slug: 'cloud-devops', description: 'Zero-downtime deployments, AWS/GCP architecture, and SOC2 compliance.', icon: 'ShieldCheck', displayOrder: 5 },
  { name: 'Company & Leadership', slug: 'company', description: 'About Ryzite engineering principles, team expertise, and locations.', icon: 'Building2', displayOrder: 6 }
];

const DEFAULT_FAQS = [
  {
    question: 'How much does custom software development cost with Ryzite?',
    slug: 'how-much-does-custom-software-cost',
    shortAnswer: 'Custom software development projects at Ryzite typically range from $10,000 for focused web MVPs to $50,000+ for enterprise AI agent systems and high-throughput SaaS portals.',
    answerContent: `<p>Project pricing depends directly on scope, complexity, third-party integrations, and performance benchmarks. Every engagement includes dedicated senior solution architects, zero-downtime cloud infrastructure setup, automated CI/CD testing, and sub-100ms Core Web Vitals optimization.</p><ul><li><strong>Small-Scale MVP / Web App:</strong> $10,000 – $18,000 (3-5 weeks)</li><li><strong>Enterprise SaaS / Mobile Suite:</strong> $20,000 – $40,000 (6-10 weeks)</li><li><strong>Autonomous AI & RAG Engine:</strong> $15,000 – $35,000 (4-8 weeks)</li></ul><p>We provide fixed-price milestone billing or transparent 2-week agile sprint packages with zero hidden fees.</p>`,
    categorySlug: 'pricing',
    faqType: 'PRICING',
    featured: true,
    isGlobal: true,
    indexable: true
  },
  {
    question: 'What is your typical project delivery timeline?',
    slug: 'what-is-typical-project-delivery-timeline',
    shortAnswer: 'Typical development timelines range from 3 to 10 weeks depending on system architecture, integrations, and compliance requirements.',
    answerContent: `<p>We operate in strict 2-week agile sprint cycles with continuous code deployment visibility. A standard timeline unfolds in four distinct phases:</p><ol><li><strong>Discovery & Architecture (Week 1):</strong> Schema design, tech stack alignment, and security blueprinting.</li><li><strong>Core Engine Build (Weeks 2-4):</strong> Full-stack frontend/backend development with automated unit tests.</li><li><strong>Integration & AI Tuning (Weeks 5-6):</strong> Cloudinary CDN asset pipelines, PostgreSQL optimization, and RAG vector tuning.</li><li><strong>Production Launch & SLA (Week 7+):</strong> Zero-downtime deployment, sub-100ms audit, and post-launch maintenance.</li></ol>`,
    categorySlug: 'process',
    faqType: 'PROCESS',
    featured: true,
    isGlobal: true,
    indexable: true
  },
  {
    question: 'How do you build enterprise AI Agent workflows and RAG pipelines?',
    slug: 'how-do-you-build-enterprise-ai-agent-workflows',
    shortAnswer: 'We construct autonomous LLM agent systems using LangChain, LlamaIndex, vector databases (pgvector/Pinecone), and custom model fine-tuning with enterprise guardrails.',
    answerContent: `<p>Our AI practice builds secure, production-grade intelligence embedded directly into your existing software stack. We implement multi-agent delegation frameworks, document parsing pipelines, and deterministic fallback mechanics to prevent hallucinations.</p><p>All data processing occurs within your private AWS/GCP VPC or SOC2-compliant container environment, ensuring full data sovereignty.</p>`,
    categorySlug: 'ai-automation',
    faqType: 'TECHNICAL',
    featured: true,
    isGlobal: true,
    indexable: true
  },
  {
    question: 'What tech stack does Ryzite use for enterprise web applications?',
    slug: 'what-tech-stack-does-ryzite-use',
    shortAnswer: 'Our core stack centers on Next.js 15 App Router, React 19, TypeScript, Node.js/Express REST APIs, PostgreSQL with Prisma ORM, Tailwind CSS, and Cloudinary CDN storage.',
    answerContent: `<p>We selected this stack because it guarantees optimal performance, sub-100ms Core Web Vitals, excellent developer velocity, and bulletproof long-term maintainability. For mobile applications, we leverage React Native with native bridge modules.</p>`,
    categorySlug: 'services',
    faqType: 'TECHNICAL',
    featured: true,
    isGlobal: true,
    indexable: true
  },
  {
    question: 'Do client teams communicate directly with senior software architects?',
    slug: 'do-clients-communicate-directly-with-architects',
    shortAnswer: 'Yes. Ryzite eliminates non-technical account managers. Clients collaborate directly with Principal Software Architects and Lead Engineers via Slack and bi-weekly sprint demos.',
    answerContent: `<p>Direct technical communication eliminates requirement distortion, accelerates feedback loops, and ensures every architectural decision aligns directly with your business goals.</p>`,
    categorySlug: 'company',
    faqType: 'COMPANY',
    featured: true,
    isGlobal: true,
    indexable: true
  },
  {
    question: 'How does Cloudinary media asset management benefit site performance?',
    slug: 'how-does-cloudinary-benefit-site-performance',
    shortAnswer: 'Cloudinary delivers automatic WebP image format conversion, dynamic responsive breakpoint scaling, and global CDN caching, ensuring image loads do not block initial render.',
    answerContent: `<p>Every image uploaded via our Admin CMS is automatically transformed, compressed without visual loss, and delivered via Cloudinary's tier-1 CDN. This ensures page load speeds remain sub-100ms regardless of device size or network speed.</p>`,
    categorySlug: 'cloud-devops',
    faqType: 'TECHNICAL',
    featured: true,
    isGlobal: true,
    indexable: true
  }
];

class FaqRepository {

  /**
   * Helper: Calculate content quality score (0-100)
   */
  private calculateQualityScore(data: {
    question: string;
    shortAnswer: string;
    answerContent: string;
    categoryId?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    lastReviewedAt?: Date | null;
  }): number {
    let score = 100;
    if (!data.question || data.question.length < 15) score -= 15;
    if (!data.shortAnswer || data.shortAnswer.length < 30) score -= 20;
    if (!data.answerContent || data.answerContent.length < 100) score -= 15;
    if (!data.categoryId) score -= 15;
    if (!data.seoTitle) score -= 10;
    if (!data.seoDescription) score -= 10;
    if (data.lastReviewedAt) {
      const daysOld = Math.floor((Date.now() - new Date(data.lastReviewedAt).getTime()) / (1000 * 60 * 60 * 24));
      if (daysOld > 180) score -= 15;
    }
    return Math.max(0, score);
  }

  /**
   * Seed default categories & FAQs if table is empty
   */
  async seedDefaultFaqs() {
    try {
      const count = await (prisma as any).faqItem.count();
      if (count > 0) return;

      console.log('[FAQ REPOSITORY] Seeding default FAQ categories and records...');

      for (const cat of DEFAULT_CATEGORIES) {
        await (prisma as any).faqCategory.upsert({
          where: { slug: cat.slug },
          update: {},
          create: cat
        });
      }

      const categories = await (prisma as any).faqCategory.findMany();
      const catMap = new Map(categories.map((c: any) => [c.slug, c.id]));

      for (let i = 0; i < DEFAULT_FAQS.length; i++) {
        const item = DEFAULT_FAQS[i];
        const categoryId: string | null = (catMap.get(item.categorySlug) as string) || null;
        const qualityScore = this.calculateQualityScore({
          question: item.question,
          shortAnswer: item.shortAnswer,
          answerContent: item.answerContent,
          categoryId
        });

        await (prisma as any).faqItem.create({
          data: {
            question: item.question,
            slug: item.slug,
            shortAnswer: item.shortAnswer,
            answerContent: item.answerContent,
            plainTextAnswer: item.shortAnswer + ' ' + item.answerContent.replace(/<[^>]+>/g, ''),
            categoryId,
            faqType: item.faqType as any,
            status: 'PUBLISHED',
            displayOrder: i + 1,
            featured: item.featured,
            isGlobal: item.isGlobal,
            indexable: item.indexable,
            qualityScore,
            seoTitle: `${item.question} | Ryzite FAQ`,
            seoDescription: item.shortAnswer.slice(0, 155),
            publishedAt: new Date()
          }
        });
      }

      console.log('[FAQ REPOSITORY] Default FAQ seed complete.');
    } catch (err) {
      console.error('[FAQ REPOSITORY SEED ERROR]', err);
    }
  }

  /**
   * Public: Get published FAQs
   */
  async getPublicFaqs(params: FaqFilterParams = {}) {
    await this.seedDefaultFaqs();

    const { categorySlug, serviceId, projectId, featured, searchQuery, faqType, limit = 50, offset = 0 } = params;

    const where: any = {
      status: 'PUBLISHED'
    };

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (faqType) {
      where.faqType = faqType;
    }

    if (categorySlug && categorySlug !== 'all') {
      where.category = {
        slug: categorySlug
      };
    }

    if (serviceId) {
      where.services = {
        some: { serviceId }
      };
    }

    if (projectId) {
      where.projects = {
        some: { projectId }
      };
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim();
      where.OR = [
        { question: { contains: q, mode: 'insensitive' } },
        { shortAnswer: { contains: q, mode: 'insensitive' } },
        { answerContent: { contains: q, mode: 'insensitive' } },
        { plainTextAnswer: { contains: q, mode: 'insensitive' } }
      ];

      // Track search query log
      try {
        const matchCount = await (prisma as any).faqItem.count({ where });
        await (prisma as any).faqSearchLog.create({
          data: {
            searchQuery: q,
            resultCount: matchCount
          }
        });
      } catch (e) {
        console.error('Error logging search query:', e);
      }
    }

    const items = await (prisma as any).faqItem.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset,
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
        services: { include: { service: { select: { id: true, title: true, slug: true } } } },
        projects: { include: { project: { select: { id: true, title: true, slug: true } } } },
        relatedFaqsFrom: {
          include: {
            relatedFaq: { select: { id: true, question: true, slug: true, shortAnswer: true } }
          }
        }
      }
    });

    return items.map(this.formatFaqResponse);
  }

  /**
   * Public: Get Categories
   */
  async getCategories() {
    await this.seedDefaultFaqs();
    return await (prisma as any).faqCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    });
  }

  /**
   * Public: Get Single FAQ by Slug
   */
  async getFaqBySlug(slug: string) {
    const item = await (prisma as any).faqItem.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
        services: { include: { service: { select: { id: true, title: true, slug: true } } } },
        projects: { include: { project: { select: { id: true, title: true, slug: true } } } },
        relatedFaqsFrom: {
          include: {
            relatedFaq: { select: { id: true, question: true, slug: true, shortAnswer: true, category: true } }
          }
        }
      }
    });

    if (!item) return null;

    // Increment view count asynchronously
    (prisma as any).faqItem.update({
      where: { id: item.id },
      data: { views: { increment: 1 } }
    }).catch((e: any) => console.error('Failed to increment FAQ views:', e));

    return this.formatFaqResponse(item);
  }

  /**
   * Public: Submit Helpfulness Feedback
   */
  async submitFeedback(faqId: string, sessionId: string = 'anon', helpful: boolean) {
    try {
      await (prisma as any).faqFeedback.create({
        data: { faqId, sessionId, helpful }
      });

      const fieldToIncrement = helpful ? 'helpfulCount' : 'notHelpfulCount';
      await (prisma as any).faqItem.update({
        where: { id: faqId },
        data: { [fieldToIncrement]: { increment: 1 } }
      });

      return { success: true };
    } catch (err: any) {
      console.error('[FAQ FEEDBACK ERROR]', err);
      throw err;
    }
  }

  /**
   * Admin: Get All FAQs with Dashboard Summary
   */
  async getAdminFaqs() {
    await this.seedDefaultFaqs();

    const items = await (prisma as any).faqItem.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { updatedAt: 'desc' }
      ],
      include: {
        category: { select: { id: true, name: true, slug: true } },
        services: { include: { service: { select: { id: true, title: true, slug: true } } } },
        projects: { include: { project: { select: { id: true, title: true, slug: true } } } }
      }
    });

    const categories = await (prisma as any).faqCategory.findMany({
      orderBy: { displayOrder: 'asc' }
    });

    const totalCount = items.length;
    const publishedCount = items.filter((i: any) => i.status === 'PUBLISHED').length;
    const draftCount = items.filter((i: any) => i.status === 'DRAFT').length;
    const archivedCount = items.filter((i: any) => i.status === 'ARCHIVED').length;
    
    const now = new Date();
    const needsReviewCount = items.filter((i: any) => i.reviewDueAt && new Date(i.reviewDueAt) <= now).length;

    const totalHelpful = items.reduce((acc: number, i: any) => acc + (i.helpfulCount || 0), 0);
    const totalNotHelpful = items.reduce((acc: number, i: any) => acc + (i.notHelpfulCount || 0), 0);
    const helpfulRatePercent = (totalHelpful + totalNotHelpful) > 0 
      ? Math.round((totalHelpful / (totalHelpful + totalNotHelpful)) * 100) 
      : 100;

    // Fetch top searches & zero-result search terms
    const topSearches = await (prisma as any).faqSearchLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    });

    const noResultSearches = await (prisma as any).faqSearchLog.findMany({
      where: { resultCount: 0 },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });

    return {
      summary: {
        total: totalCount,
        published: publishedCount,
        draft: draftCount,
        archived: archivedCount,
        needsReview: needsReviewCount,
        helpfulRatePercent,
        topSearches: topSearches.map((s: any) => s.searchQuery),
        noResultSearches: noResultSearches.map((s: any) => s.searchQuery)
      },
      categories,
      items: items.map(this.formatFaqResponse)
    };
  }

  /**
   * Admin: Create FAQ
   */
  async createFaq(input: CreateFaqInput) {
    const slug = input.slug?.trim() || input.question.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const plainTextAnswer = input.shortAnswer + ' ' + (input.answerContent || '').replace(/<[^>]+>/g, '');

    const qualityScore = this.calculateQualityScore({
      question: input.question,
      shortAnswer: input.shortAnswer,
      answerContent: input.answerContent,
      categoryId: input.categoryId,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      lastReviewedAt: new Date()
    });

    const faq = await (prisma as any).faqItem.create({
      data: {
        question: input.question,
        slug,
        shortAnswer: input.shortAnswer,
        answerContent: input.answerContent,
        plainTextAnswer,
        categoryId: input.categoryId || null,
        faqType: (input.faqType || 'GENERAL') as any,
        status: (input.status || 'PUBLISHED') as any,
        displayOrder: input.displayOrder ?? 0,
        featured: input.featured ?? false,
        isGlobal: input.isGlobal ?? true,
        indexable: input.indexable ?? true,
        qualityScore,
        imageUrl: input.imageUrl || null,
        imagePublicId: input.imagePublicId || null,
        imageAlt: input.imageAlt || input.question,
        seoTitle: input.seoTitle || `${input.question} | Ryzite FAQ`,
        seoDescription: input.seoDescription || input.shortAnswer.slice(0, 155),
        canonicalUrl: input.canonicalUrl || `https://ryzite.com/faq/${slug}`,
        sourceType: input.sourceType || 'Company Documentation',
        sourceUrl: input.sourceUrl || null,
        sourceNote: input.sourceNote || null,
        reviewDueAt: input.reviewDueAt ? new Date(input.reviewDueAt) : null,
        publishedAt: new Date(),
        authorId: input.authorId || null
      }
    });

    // Relational service bindings
    if (input.serviceIds && input.serviceIds.length > 0) {
      await (prisma as any).faqServiceRelation.createMany({
        data: input.serviceIds.map((serviceId, idx) => ({
          faqId: faq.id,
          serviceId,
          displayOrder: idx + 1
        }))
      });
    }

    // Relational project bindings
    if (input.projectIds && input.projectIds.length > 0) {
      await (prisma as any).faqProjectRelation.createMany({
        data: input.projectIds.map((projectId, idx) => ({
          faqId: faq.id,
          projectId,
          displayOrder: idx + 1
        }))
      });
    }

    // Related FAQs bindings
    if (input.relatedFaqIds && input.relatedFaqIds.length > 0) {
      await (prisma as any).faqRelationItem.createMany({
        data: input.relatedFaqIds.map((relatedFaqId, idx) => ({
          faqId: faq.id,
          relatedFaqId,
          displayOrder: idx + 1
        }))
      });
    }

    // Version Snapshot
    await (prisma as any).faqVersion.create({
      data: {
        faqId: faq.id,
        question: faq.question,
        shortAnswer: faq.shortAnswer,
        answerContent: faq.answerContent,
        categoryId: faq.categoryId,
        metadataSnapshot: { status: faq.status, qualityScore },
        changeReason: 'Initial Creation'
      }
    });

    return this.getFaqBySlug(faq.slug);
  }

  /**
   * Admin: Update FAQ (with safe Cloudinary replacement)
   */
  async updateFaq(id: string, input: Partial<CreateFaqInput>) {
    const existing = await (prisma as any).faqItem.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`FAQ record ${id} not found.`);
    }

    let oldImagePublicIdToDelete: string | null = null;
    let imageUrl = existing.imageUrl;
    let imagePublicId = existing.imagePublicId;

    // Safe Cloudinary Image Replacement
    if (input.imageUrl !== undefined && input.imageUrl !== existing.imageUrl) {
      if (existing.imagePublicId && input.imagePublicId !== existing.imagePublicId) {
        oldImagePublicIdToDelete = existing.imagePublicId;
      }
      imageUrl = input.imageUrl;
      imagePublicId = input.imagePublicId || null;
    }

    const question = input.question !== undefined ? input.question : existing.question;
    const shortAnswer = input.shortAnswer !== undefined ? input.shortAnswer : existing.shortAnswer;
    const answerContent = input.answerContent !== undefined ? input.answerContent : existing.answerContent;
    const plainTextAnswer = shortAnswer + ' ' + answerContent.replace(/<[^>]+>/g, '');
    const categoryId = input.categoryId !== undefined ? input.categoryId : existing.categoryId;

    const qualityScore = this.calculateQualityScore({
      question,
      shortAnswer,
      answerContent,
      categoryId,
      seoTitle: input.seoTitle !== undefined ? input.seoTitle : existing.seoTitle,
      seoDescription: input.seoDescription !== undefined ? input.seoDescription : existing.seoDescription,
      lastReviewedAt: new Date()
    });

    const updated = await (prisma as any).faqItem.update({
      where: { id },
      data: {
        question,
        slug: input.slug ? input.slug.trim() : existing.slug,
        shortAnswer,
        answerContent,
        plainTextAnswer,
        categoryId,
        faqType: input.faqType ? (input.faqType as any) : existing.faqType,
        status: input.status ? (input.status as any) : existing.status,
        displayOrder: input.displayOrder !== undefined ? input.displayOrder : existing.displayOrder,
        featured: input.featured !== undefined ? input.featured : existing.featured,
        isGlobal: input.isGlobal !== undefined ? input.isGlobal : existing.isGlobal,
        indexable: input.indexable !== undefined ? input.indexable : existing.indexable,
        qualityScore,
        imageUrl,
        imagePublicId,
        imageAlt: input.imageAlt !== undefined ? input.imageAlt : existing.imageAlt,
        seoTitle: input.seoTitle !== undefined ? input.seoTitle : existing.seoTitle,
        seoDescription: input.seoDescription !== undefined ? input.seoDescription : existing.seoDescription,
        canonicalUrl: input.canonicalUrl !== undefined ? input.canonicalUrl : existing.canonicalUrl,
        sourceType: input.sourceType !== undefined ? input.sourceType : existing.sourceType,
        sourceUrl: input.sourceUrl !== undefined ? input.sourceUrl : existing.sourceUrl,
        sourceNote: input.sourceNote !== undefined ? input.sourceNote : existing.sourceNote,
        reviewDueAt: input.reviewDueAt ? new Date(input.reviewDueAt) : existing.reviewDueAt,
        lastReviewedAt: new Date()
      }
    });

    // Update service relations if provided
    if (input.serviceIds !== undefined) {
      await (prisma as any).faqServiceRelation.deleteMany({ where: { faqId: id } });
      if (input.serviceIds.length > 0) {
        await (prisma as any).faqServiceRelation.createMany({
          data: input.serviceIds.map((serviceId, idx) => ({
            faqId: id,
            serviceId,
            displayOrder: idx + 1
          }))
        });
      }
    }

    // Update project relations if provided
    if (input.projectIds !== undefined) {
      await (prisma as any).faqProjectRelation.deleteMany({ where: { faqId: id } });
      if (input.projectIds.length > 0) {
        await (prisma as any).faqProjectRelation.createMany({
          data: input.projectIds.map((projectId, idx) => ({
            faqId: id,
            projectId,
            displayOrder: idx + 1
          }))
        });
      }
    }

    // Update related FAQs if provided
    if (input.relatedFaqIds !== undefined) {
      await (prisma as any).faqRelationItem.deleteMany({ where: { faqId: id } });
      if (input.relatedFaqIds.length > 0) {
        await (prisma as any).faqRelationItem.createMany({
          data: input.relatedFaqIds.map((relatedFaqId, idx) => ({
            faqId: id,
            relatedFaqId,
            displayOrder: idx + 1
          }))
        });
      }
    }

    // Clean up old Cloudinary asset AFTER DB update succeeds
    if (oldImagePublicIdToDelete) {
      try {
        await cloudinaryService.deleteImage(oldImagePublicIdToDelete);
      } catch (err) {
        console.error(`[CLOUDINARY CLEANUP WARNING] Failed to delete old image ${oldImagePublicIdToDelete}:`, err);
      }
    }

    // Version Snapshot
    await (prisma as any).faqVersion.create({
      data: {
        faqId: id,
        question: updated.question,
        shortAnswer: updated.shortAnswer,
        answerContent: updated.answerContent,
        categoryId: updated.categoryId,
        metadataSnapshot: { status: updated.status, qualityScore },
        changeReason: 'Updated via CMS'
      }
    });

    return this.getFaqBySlug(updated.slug);
  }

  /**
   * Admin: Safe Transactional Delete FAQ
   */
  async deleteFaq(id: string) {
    const existing = await (prisma as any).faqItem.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`FAQ record ${id} not found.`);
    }

    // 1. Destroy Cloudinary asset FIRST if present
    if (existing.imagePublicId) {
      try {
        await cloudinaryService.deleteImage(existing.imagePublicId);
        console.log(`[CLOUDINARY DESTROY SUCCESS] Destroyed FAQ image ${existing.imagePublicId}`);
      } catch (err: any) {
        console.error(`[CLOUDINARY DESTROY FAILED] Aborting DB deletion for FAQ ${id}:`, err);
        throw new Error(`Failed to delete Cloudinary image (${existing.imagePublicId}): ${err.message}. DB deletion aborted.`);
      }
    }

    // 2. Delete database record ONLY IF Cloudinary destroy succeeded
    await (prisma as any).faqItem.delete({ where: { id } });
    return { success: true, id };
  }

  /**
   * Admin: Duplicate Detection
   */
  async checkDuplicates(question: string) {
    if (!question || question.trim().length < 5) return [];

    const q = question.trim().toLowerCase();
    const all = await (prisma as any).faqItem.findMany({
      select: { id: true, question: true, slug: true, status: true }
    });

    const matches = all.filter((item: any) => {
      const target = item.question.toLowerCase();
      if (target === q) return true;
      if (target.includes(q) || q.includes(target)) return true;
      
      // Word overlap check
      const qWords = q.split(/\s+/).filter(w => w.length > 3);
      const tWords = target.split(/\s+/).filter((w: string) => w.length > 3);
      const overlap = qWords.filter(w => tWords.includes(w));
      return qWords.length > 0 && (overlap.length / qWords.length) >= 0.6;
    });

    return matches;
  }

  /**
   * Admin: Version History & Restore
   */
  async getVersions(faqId: string) {
    return await (prisma as any).faqVersion.findMany({
      where: { faqId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async restoreVersion(faqId: string, versionId: string) {
    const version = await (prisma as any).faqVersion.findUnique({ where: { id: versionId } });
    if (!version || version.faqId !== faqId) {
      throw new Error(`Version ${versionId} not found for FAQ ${faqId}.`);
    }

    return await this.updateFaq(faqId, {
      question: version.question,
      shortAnswer: version.shortAnswer,
      answerContent: version.answerContent,
      categoryId: version.categoryId || undefined
    });
  }

  /**
   * Admin: Category Management CRUD
   */
  async saveCategory(input: { id?: string; name: string; slug?: string; description?: string; icon?: string; displayOrder?: number; isActive?: boolean }) {
    const slug = input.slug?.trim() || input.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (input.id) {
      return await (prisma as any).faqCategory.update({
        where: { id: input.id },
        data: {
          name: input.name,
          slug,
          description: input.description,
          icon: input.icon || 'HelpCircle',
          displayOrder: input.displayOrder ?? 0,
          isActive: input.isActive ?? true
        }
      });
    }

    return await (prisma as any).faqCategory.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        icon: input.icon || 'HelpCircle',
        displayOrder: input.displayOrder ?? 0,
        isActive: input.isActive ?? true
      }
    });
  }

  async deleteCategory(id: string) {
    const count = await (prisma as any).faqItem.count({ where: { categoryId: id } });
    if (count > 0) {
      throw new Error(`Cannot delete category with ${count} assigned FAQs. Reassign or delete FAQs first.`);
    }
    await (prisma as any).faqCategory.delete({ where: { id } });
    return { success: true };
  }

  /**
   * Helper: Format response for public & admin consuming APIs
   */
  private formatFaqResponse(item: any) {
    return {
      id: item.id,
      question: item.question,
      slug: item.slug,
      shortAnswer: item.shortAnswer,
      answerContent: item.answerContent,
      plainTextAnswer: item.plainTextAnswer,
      categoryId: item.categoryId,
      category: item.category ? {
        id: item.category.id,
        name: item.category.name,
        slug: item.category.slug,
        icon: item.category.icon || 'HelpCircle'
      } : null,
      faqType: item.faqType,
      status: item.status,
      displayOrder: item.displayOrder,
      featured: item.featured,
      isGlobal: item.isGlobal,
      indexable: item.indexable,
      views: item.views,
      expands: item.expands,
      helpfulCount: item.helpfulCount,
      notHelpfulCount: item.notHelpfulCount,
      qualityScore: item.qualityScore,
      image: item.imageUrl ? {
        url: item.imageUrl,
        alt: item.imageAlt || item.question,
        publicId: item.imagePublicId
      } : null,
      seo: {
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        canonicalUrl: item.canonicalUrl
      },
      source: {
        type: item.sourceType,
        url: item.sourceUrl,
        note: item.sourceNote
      },
      services: item.services ? item.services.map((s: any) => ({
        id: s.service?.id || s.serviceId,
        title: s.service?.title,
        slug: s.service?.slug
      })) : [],
      projects: item.projects ? item.projects.map((p: any) => ({
        id: p.project?.id || p.projectId,
        title: p.project?.title,
        slug: p.project?.slug
      })) : [],
      relatedFaqs: item.relatedFaqsFrom ? item.relatedFaqsFrom.map((r: any) => ({
        id: r.relatedFaq?.id || r.relatedFaqId,
        question: r.relatedFaq?.question,
        slug: r.relatedFaq?.slug,
        shortAnswer: r.relatedFaq?.shortAnswer
      })) : [],
      lastReviewedAt: item.lastReviewedAt,
      reviewDueAt: item.reviewDueAt,
      publishedAt: item.publishedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }
}

export const faqRepository = new FaqRepository();
