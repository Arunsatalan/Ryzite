import { prisma } from './prisma.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from environment
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Safely destroy Cloudinary image before DB deletion
async function destroyImageFirst(publicId: string | null | undefined): Promise<boolean> {
  if (!publicId) return true;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`[CLOUDINARY DELETE SUCCESS] Asset ${publicId}:`, result);
    return true;
  } catch (err: any) {
    console.error(`[CLOUDINARY DELETE WARNING] Failed to destroy asset ${publicId}:`, err.message || err);
    return false;
  }
}

export interface CreateBlogInput {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  status?: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  postType?: 'ARTICLE' | 'GUIDE' | 'HOW_TO' | 'TUTORIAL' | 'NEWS' | 'CASE_STUDY' | 'TECHNICAL' | 'OPINION' | 'REPORT' | 'ANNOUNCEMENT' | 'RESEARCH';
  categoryId?: string;
  authorId?: string;
  featured?: boolean;
  featuredOrder?: number;
  displayOrder?: number;
  publishedAt?: string | Date;
  scheduledAt?: string | Date;

  // Cover image
  coverImageUrl?: string;
  coverImagePublicId?: string;
  coverImageAlt?: string;

  // OG image
  ogImageUrl?: string;
  ogImagePublicId?: string;

  // SEO & AEO
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  focusKeyword?: string;
  targetKeyword?: string;
  secondaryKeywords?: string;
  searchIntent?: 'INFORMATIONAL' | 'COMMERCIAL' | 'TRANSACTIONAL' | 'NAVIGATIONAL' | 'COMPARISON' | 'HOW_TO';
  pillarId?: string;
  contentClusterId?: string;
  clusterId?: string;
  sourceUrl?: string;
  sourceName?: string;
  isOriginal?: boolean;
  directAnswer?: string;
  keyTakeaways?: string[];

  // Relations
  tagIds?: string[];
  serviceIds?: string[];
  projectIds?: string[];
  faqIds?: string[];
  relatedBlogIds?: string[];
}

export class BlogRepository {

  /**
   * Calculate Reading Time in minutes from HTML/Text content
   */
  private calculateReadingTime(content: string): { wordCount: number; minutes: number } {
    const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = plainText ? plainText.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return { wordCount: words, minutes };
  }

  /**
   * Calculate internal blog quality score (0 - 100)
   */
  private calculateQualityScore(input: CreateBlogInput, wordCount: number): number {
    let score = 50; // base score

    if (input.title && input.title.length >= 10) score += 10;
    if (input.excerpt && input.excerpt.length >= 50) score += 10;
    if (wordCount >= 600) score += 10;
    if (input.coverImageUrl) score += 5;
    if (input.directAnswer) score += 5;
    if (input.categoryId) score += 5;
    if (input.authorId) score += 5;

    return Math.min(100, score);
  }

  /**
   * Auto-seed default Blog Categories, Authors, and initial Published Posts
   */
  async seedDefaultBlogs() {
    try {
      const categoryCount = await (prisma as any).blogCategory.count();
      if (categoryCount === 0) {
        console.log('[BLOG SEED] Seeding default blog categories...');
        const defaultCategories = [
          { name: 'AI & Automation', slug: 'ai-automation', description: 'AI agents, LLM workflows, and intelligent business process automation.', displayOrder: 1, icon: 'Cpu' },
          { name: 'Web Development', slug: 'web-development', description: 'Next.js 15, React, TypeScript, and modern frontend architecture.', displayOrder: 2, icon: 'Code' },
          { name: 'Cloud & DevOps', slug: 'cloud-devops', description: 'PostgreSQL, Docker, Redis queues, CI/CD pipelines, and cloud scaling.', displayOrder: 3, icon: 'Cloud' },
          { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Zero-trust architecture, SOC2 compliance, data privacy, and encryption.', displayOrder: 4, icon: 'ShieldCheck' },
          { name: 'Software Engineering', slug: 'software-engineering', description: 'Clean architecture, zero-debt code standards, and agile engineering practices.', displayOrder: 5, icon: 'Layers' },
          { name: 'Business Technology', slug: 'business-technology', description: 'Digital ROI, enterprise tech strategy, and software procurement.', displayOrder: 6, icon: 'Building2' }
        ];

        for (const cat of defaultCategories) {
          await (prisma as any).blogCategory.create({ data: cat });
        }
      }

      const authorCount = await (prisma as any).blogAuthor.count();
      let defaultAuthorId: string | null = null;
      if (authorCount === 0) {
        console.log('[BLOG SEED] Seeding default blog author...');
        const defaultAuthor = await (prisma as any).blogAuthor.create({
          data: {
            name: 'Ryzite Engineering Team',
            slug: 'ryzite-engineering-team',
            jobTitle: 'Principal Software Architects & Engineers',
            bio: 'Ryzite principal software architects write hands-on engineering guides, cloud benchmarks, and enterprise software architecture insights.',
            expertise: 'Next.js, Node.js, PostgreSQL, Cloudinary, AI Workflows, Microservices'
          }
        });
        defaultAuthorId = defaultAuthor.id;
      } else {
        const firstAuthor = await (prisma as any).blogAuthor.findFirst();
        if (firstAuthor) defaultAuthorId = firstAuthor.id;
      }

      const postCount = await (prisma as any).blogPost.count();
      if (postCount === 0) {
        console.log('[BLOG SEED] Seeding initial published blog posts...');
        const aiCategory = await (prisma as any).blogCategory.findUnique({ where: { slug: 'ai-automation' } });
        const webCategory = await (prisma as any).blogCategory.findUnique({ where: { slug: 'web-development' } });
        const engCategory = await (prisma as any).blogCategory.findUnique({ where: { slug: 'software-engineering' } });

        const initialPosts: CreateBlogInput[] = [
          {
            title: 'How AI Automation Is Changing Business Workflows in 2026',
            slug: 'how-ai-automation-is-changing-business-workflows',
            excerpt: 'Explore how modern AI agents, automated Redis queues, and LLM integrations eliminate manual operational bottlenecks with sub-second execution.',
            content: `<h2>The Evolution of Workflow Automation</h2><p>Legacy business processes rely heavily on manual data entry, disconnected SaaS tools, and slow approval chains. In 2026, enterprise software engineering has shifted toward intelligent multi-agent AI workflows.</p><h2>Key Architectural Components</h2><p>By leveraging asynchronous Redis worker queues alongside Node.js and PostgreSQL, modern applications execute complex multi-step tasks in real time while maintaining zero data loss and strict SLA compliance.</p><h2>Real-World Business Impact</h2><p>Companies adopting event-driven AI pipelines report an 85% reduction in processing latency and immediate scalability to over 50,000 requests per minute.</p>`,
            directAnswer: 'AI workflow automation uses intelligent software agents and asynchronous queue workers to perform repetitive tasks with sub-second response times and minimal manual intervention.',
            keyTakeaways: [
              'AI multi-agent workflows automate repetitive operational tasks.',
              'Asynchronous Redis queues ensure zero request drops during peak traffic.',
              'Human-in-the-loop review safeguards sensitive corporate decisions.'
            ],
            status: 'PUBLISHED',
            postType: 'ARTICLE',
            featured: true,
            featuredOrder: 1,
            categoryId: aiCategory?.id,
            authorId: defaultAuthorId || undefined,
            publishedAt: new Date(),
            coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
            coverImageAlt: 'AI Automation Workflows'
          },
          {
            title: 'Building Scalable Microservices with Next.js 15 and PostgreSQL',
            slug: 'building-scalable-microservices-with-nextjs-15-and-postgresql',
            excerpt: 'A comprehensive engineering guide on architecting resilient Next.js 15 App Router applications backed by PostgreSQL database pooling.',
            content: `<h2>Why Next.js 15 for Enterprise Software</h2><p>Next.js 15 App Router combines server-side rendering, edge caching, and granular revalidation to deliver instantaneous load speeds for global enterprise platforms.</p><h2>PostgreSQL Connection Pooling</h2><p>Direct PostgreSQL database connections can quickly saturate under heavy concurrency. Using Prisma ORM with connection pooling ensures sub-10ms query executions even during peak bursts.</p>`,
            directAnswer: 'Next.js 15 App Router paired with PostgreSQL and Prisma connection pooling delivers sub-second server rendering, automatic static revalidation, and scalable query execution.',
            keyTakeaways: [
              'Next.js 15 server components reduce frontend bundle size.',
              'Prisma connection pooling prevents database connection starvation.',
              'Granular revalidation maintains fresh data with zero rebuild lag.'
            ],
            status: 'PUBLISHED',
            postType: 'GUIDE',
            featured: true,
            featuredOrder: 2,
            categoryId: webCategory?.id,
            authorId: defaultAuthorId || undefined,
            publishedAt: new Date(Date.now() - 86400000),
            coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
            coverImageAlt: 'Next.js 15 Engineering Architecture'
          },
          {
            title: 'Zero-Debt Code Standards for Enterprise Software Projects',
            slug: 'zero-debt-code-standards-for-enterprise-software-projects',
            excerpt: 'How Ryzite maintains 100% strict TypeScript compliance, automated CI/CD linting, and modular architecture on every client delivery.',
            content: `<h2>Understanding Technical Debt</h2><p>Technical debt accumulates when temporary workarounds bypass clean software architecture standards. Over time, technical debt slows feature delivery by up to 300%.</p><h2>The Zero-Debt Framework</h2><p>Our principal architects enforce strict static type checking, unit test coverage gates, and automated code review pipelines before any code reaches production.</p>`,
            directAnswer: 'Zero-Debt code standards enforce strict static typing, modular component boundaries, and automated linting to maintain high velocity and zero regression bugs.',
            keyTakeaways: [
              'Strict TypeScript typing eliminates runtime reference crashes.',
              'Automated CI/CD gates block broken commits prior to deployment.',
              'Modular architecture accelerates long-term feature iteration.'
            ],
            status: 'PUBLISHED',
            postType: 'TECHNICAL',
            featured: true,
            featuredOrder: 3,
            categoryId: engCategory?.id,
            authorId: defaultAuthorId || undefined,
            publishedAt: new Date(Date.now() - 172800000),
            coverImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
            coverImageAlt: 'Zero Debt Code Standards'
          }
        ];

        for (const postInput of initialPosts) {
          await this.createBlog(postInput);
        }
      }
    } catch (err: any) {
      console.error('[BLOG SEED ERROR]', err.message || err);
    }
  }

  /**
   * Public: Get Published Blogs (with Pagination & Filters)
   */
  async getPublicBlogs(params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    author?: string;
    postType?: string;
    searchQuery?: string;
    featured?: boolean;
  }) {
    await this.seedDefaultBlogs();

    const page = Math.max(1, params?.page || 1);
    const limit = Math.min(50, Math.max(1, params?.limit || 9));
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'PUBLISHED'
    };

    if (params?.featured !== undefined) {
      where.featured = params.featured;
    }

    if (params?.category) {
      where.OR = [
        { categoryId: params.category },
        { category: { slug: params.category } }
      ];
    }

    if (params?.tag) {
      where.tags = {
        some: {
          tag: { slug: params.tag }
        }
      };
    }

    if (params?.author) {
      where.author = { slug: params.author };
    }

    if (params?.postType) {
      where.postType = params.postType;
    }

    if (params?.searchQuery?.trim()) {
      const q = params.searchQuery.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
        { directAnswer: { contains: q, mode: 'insensitive' } },
        { focusKeyword: { contains: q, mode: 'insensitive' } }
      ];
    }

    const [total, items] = await Promise.all([
      (prisma as any).blogPost.count({ where }),
      (prisma as any).blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { featured: 'desc' },
          { publishedAt: 'desc' }
        ],
        include: {
          category: { select: { id: true, name: true, slug: true, icon: true } },
          author: { select: { id: true, name: true, slug: true, jobTitle: true, profileImageUrl: true } },
          tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
          services: { include: { service: { select: { id: true, title: true, slug: true } } } },
          projects: { include: { project: { select: { id: true, title: true, slug: true } } } },
          faqs: { include: { faq: { select: { id: true, question: true, slug: true } } } }
        }
      })
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Public: Get Latest Published Blogs (e.g. limit 3 for Homepage)
   */
  async getLatestBlogs(limit: number = 3) {
    await this.seedDefaultBlogs();

    return (prisma as any).blogPost.findMany({
      where: { status: 'PUBLISHED' },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
        author: { select: { id: true, name: true, slug: true, jobTitle: true, profileImageUrl: true } }
      }
    });
  }

  /**
   * Public: Get Blog Details by Slug
   */
  async getBlogBySlug(slug: string) {
    await this.seedDefaultBlogs();

    const post = await (prisma as any).blogPost.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
        author: { select: { id: true, name: true, slug: true, jobTitle: true, bio: true, profileImageUrl: true, linkedInUrl: true } },
        contentCluster: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
        services: { include: { service: { select: { id: true, title: true, slug: true, shortDescription: true } } } },
        projects: { include: { project: { select: { id: true, title: true, slug: true, clientName: true } } } },
        faqs: { include: { faq: { select: { id: true, question: true, slug: true, shortAnswer: true } } } },
        relatedFrom: {
          include: {
            relatedPost: {
              select: { id: true, title: true, slug: true, excerpt: true, coverImageUrl: true, publishedAt: true }
            }
          }
        }
      }
    });

    if (!post || post.status !== 'PUBLISHED') {
      return null;
    }

    // Increment view counter asynchronously
    this.incrementBlogView(post.id).catch(() => {});

    return post;
  }

  /**
   * Public: Get Blog Categories
   */
  async getBlogCategories() {
    await this.seedDefaultBlogs();
    return (prisma as any).blogCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    });
  }

  /**
   * Public: Get Blog Tags
   */
  async getBlogTags() {
    return (prisma as any).blogTag.findMany({
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Public: Get Blog Authors
   */
  async getBlogAuthors() {
    await this.seedDefaultBlogs();
    return (prisma as any).blogAuthor.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Admin: Get Blog Analytics & Overview
   */
  async getAdminBlogs() {
    await this.seedDefaultBlogs();

    const [items, categories, authors, tags, totalCount, publishedCount, draftCount, reviewCount, scheduledCount, archivedCount, aggregateViews] = await Promise.all([
      (prisma as any).blogPost.findMany({
        orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true, slug: true } },
          tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
          services: { include: { service: { select: { id: true, title: true, slug: true } } } },
          projects: { include: { project: { select: { id: true, title: true, slug: true } } } }
        }
      }),
      (prisma as any).blogCategory.findMany({ orderBy: { displayOrder: 'asc' } }),
      (prisma as any).blogAuthor.findMany({ orderBy: { name: 'asc' } }),
      (prisma as any).blogTag.findMany({ orderBy: { name: 'asc' } }),
      (prisma as any).blogPost.count(),
      (prisma as any).blogPost.count({ where: { status: 'PUBLISHED' } }),
      (prisma as any).blogPost.count({ where: { status: 'DRAFT' } }),
      (prisma as any).blogPost.count({ where: { status: 'IN_REVIEW' } }),
      (prisma as any).blogPost.count({ where: { status: 'SCHEDULED' } }),
      (prisma as any).blogPost.count({ where: { status: 'ARCHIVED' } }),
      (prisma as any).blogPost.aggregate({ _sum: { views: true } })
    ]);

    return {
      summary: {
        total: totalCount,
        published: publishedCount,
        draft: draftCount,
        inReview: reviewCount,
        scheduled: scheduledCount,
        archived: archivedCount,
        totalViews: aggregateViews._sum?.views || 0
      },
      categories,
      authors,
      tags,
      items
    };
  }

  /**
   * Admin: Create New Blog Post
   */
  async createBlog(input: CreateBlogInput) {
    const { wordCount, minutes } = this.calculateReadingTime(input.content || '');
    const qualityScore = this.calculateQualityScore(input, wordCount);

    const slug = input.slug?.trim()
      ? input.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const keyTakeawaysJson = input.keyTakeaways
      ? typeof input.keyTakeaways === 'string'
        ? input.keyTakeaways
        : JSON.stringify(input.keyTakeaways)
      : null;

    const secondaryKeywordsFormatted = Array.isArray(input.secondaryKeywords)
      ? (input.secondaryKeywords as string[]).filter(Boolean).join(', ') || null
      : typeof input.secondaryKeywords === 'string' && (input.secondaryKeywords as string).trim()
      ? (input.secondaryKeywords as string).trim()
      : null;

    const created = await (prisma as any).blogPost.create({
      data: {
        title: input.title,
        slug,
        excerpt: input.excerpt || '',
        content: input.content || '',
        plainTextContent: (input.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
        status: input.status || 'PUBLISHED',
        postType: input.postType || 'ARTICLE',
        categoryId: input.categoryId || null,
        authorId: input.authorId || null,
        featured: input.featured || false,
        featuredOrder: input.featuredOrder || 0,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
        readingTimeMinutes: minutes,
        wordCount,
        coverImageUrl: input.coverImageUrl || null,
        coverImagePublicId: input.coverImagePublicId || null,
        coverImageAlt: input.coverImageAlt || input.title,
        ogImageUrl: input.ogImageUrl || input.coverImageUrl || null,
        ogImagePublicId: input.ogImagePublicId || input.coverImagePublicId || null,
        seoTitle: input.seoTitle || input.title,
        seoDescription: input.seoDescription || input.excerpt,
        canonicalUrl: input.canonicalUrl || `https://ryzite.com/blog/${slug}`,
        focusKeyword: input.focusKeyword || null,
        secondaryKeywords: secondaryKeywordsFormatted,
        searchIntent: input.searchIntent || 'INFORMATIONAL',
        contentClusterId: input.contentClusterId || null,
        sourceUrl: input.sourceUrl || null,
        sourceName: input.sourceName || null,
        directAnswer: input.directAnswer || null,
        keyTakeaways: keyTakeawaysJson,
        qualityScore
      }
    });

    // Handle Relations: Tags, Services, Projects, FAQs
    if (input.tagIds && input.tagIds.length > 0) {
      for (const tagId of input.tagIds) {
        await (prisma as any).blogPostTag.create({
          data: { postId: created.id, tagId }
        }).catch(() => {});
      }
    }

    if (input.serviceIds && input.serviceIds.length > 0) {
      for (const serviceId of input.serviceIds) {
        await (prisma as any).blogServiceRelation.create({
          data: { postId: created.id, serviceId }
        }).catch(() => {});
      }
    }

    if (input.projectIds && input.projectIds.length > 0) {
      for (const projectId of input.projectIds) {
        await (prisma as any).blogProjectRelation.create({
          data: { postId: created.id, projectId }
        }).catch(() => {});
      }
    }

    if (input.faqIds && input.faqIds.length > 0) {
      for (const faqId of input.faqIds) {
        await (prisma as any).blogFaqRelation.create({
          data: { postId: created.id, faqId }
        }).catch(() => {});
      }
    }

    return this.getBlogBySlug(created.slug);
  }

  /**
   * Admin: Update Blog Post (with Safe Cloudinary Image Replacement)
   */
  async updateBlog(id: string, input: Partial<CreateBlogInput>) {
    const existing = await (prisma as any).blogPost.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`Blog post record ${id} not found.`);
    }

    let oldImagePublicIdToDelete: string | null = null;
    let coverImageUrl = existing.coverImageUrl;
    let coverImagePublicId = existing.coverImagePublicId;

    // Safe Cloudinary Image Replacement
    if (input.coverImageUrl !== undefined && input.coverImageUrl !== existing.coverImageUrl) {
      if (existing.coverImagePublicId && input.coverImagePublicId !== existing.coverImagePublicId) {
        oldImagePublicIdToDelete = existing.coverImagePublicId;
      }
      coverImageUrl = input.coverImageUrl;
      coverImagePublicId = input.coverImagePublicId || null;
    }

    let slug = existing.slug;
    if (input.slug && input.slug.trim() !== existing.slug) {
      slug = input.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      // Create 301 Redirect record
      await (prisma as any).blogRedirect.create({
        data: {
          oldPath: `/blog/${existing.slug}`,
          newPath: `/blog/${slug}`,
          statusCode: 301
        }
      }).catch(() => {});
    } else if (input.title && !input.slug && input.title !== existing.title) {
      slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const { wordCount, minutes } = this.calculateReadingTime(input.content || existing.content);

    const updated = await (prisma as any).blogPost.update({
      where: { id },
      data: {
        title: input.title !== undefined ? input.title : existing.title,
        slug,
        excerpt: input.excerpt !== undefined ? input.excerpt : existing.excerpt,
        content: input.content !== undefined ? input.content : existing.content,
        plainTextContent: (input.content || existing.content).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
        status: input.status !== undefined ? input.status : existing.status,
        postType: input.postType !== undefined ? input.postType : existing.postType,
        categoryId: input.categoryId !== undefined ? input.categoryId : existing.categoryId,
        authorId: input.authorId !== undefined ? input.authorId : existing.authorId,
        featured: input.featured !== undefined ? input.featured : existing.featured,
        featuredOrder: input.featuredOrder !== undefined ? input.featuredOrder : existing.featuredOrder,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : existing.publishedAt,
        readingTimeMinutes: minutes,
        wordCount,
        coverImageUrl,
        coverImagePublicId,
        coverImageAlt: input.coverImageAlt !== undefined ? input.coverImageAlt : existing.coverImageAlt,
        ogImageUrl: input.ogImageUrl !== undefined ? input.ogImageUrl : existing.ogImageUrl,
        ogImagePublicId: input.ogImagePublicId !== undefined ? input.ogImagePublicId : existing.ogImagePublicId,
        seoTitle: input.seoTitle !== undefined ? input.seoTitle : existing.seoTitle,
        seoDescription: input.seoDescription !== undefined ? input.seoDescription : existing.seoDescription,
        canonicalUrl: input.canonicalUrl !== undefined ? input.canonicalUrl : existing.canonicalUrl,
        focusKeyword: input.focusKeyword !== undefined ? input.focusKeyword : existing.focusKeyword,
        secondaryKeywords: input.secondaryKeywords !== undefined
          ? Array.isArray(input.secondaryKeywords)
            ? (input.secondaryKeywords as string[]).filter(Boolean).join(', ') || null
            : typeof input.secondaryKeywords === 'string' && (input.secondaryKeywords as string).trim()
            ? (input.secondaryKeywords as string).trim()
            : null
          : existing.secondaryKeywords,
        searchIntent: input.searchIntent !== undefined ? input.searchIntent : existing.searchIntent,
        directAnswer: input.directAnswer !== undefined ? input.directAnswer : existing.directAnswer,
        keyTakeaways: input.keyTakeaways !== undefined
          ? typeof input.keyTakeaways === 'string'
            ? input.keyTakeaways
            : JSON.stringify(input.keyTakeaways)
          : existing.keyTakeaways,
        updatedAt: new Date()
      }
    });

    // Update Tag Relations if passed
    if (input.tagIds !== undefined) {
      await (prisma as any).blogPostTag.deleteMany({ where: { postId: id } });
      for (const tagId of input.tagIds) {
        await (prisma as any).blogPostTag.create({ data: { postId: id, tagId } }).catch(() => {});
      }
    }

    // Update Service Relations if passed
    if (input.serviceIds !== undefined) {
      await (prisma as any).blogServiceRelation.deleteMany({ where: { postId: id } });
      for (const serviceId of input.serviceIds) {
        await (prisma as any).blogServiceRelation.create({ data: { postId: id, serviceId } }).catch(() => {});
      }
    }

    // Update Project Relations if passed
    if (input.projectIds !== undefined) {
      await (prisma as any).blogProjectRelation.deleteMany({ where: { postId: id } });
      for (const projectId of input.projectIds) {
        await (prisma as any).blogProjectRelation.create({ data: { postId: id, projectId } }).catch(() => {});
      }
    }

    // Safely delete old Cloudinary image asset AFTER successful DB update
    if (oldImagePublicIdToDelete) {
      await destroyImageFirst(oldImagePublicIdToDelete);
    }

    return updated;
  }

  /**
   * Admin: Delete Blog Post (Destroys Cloudinary assets first)
   */
  async deleteBlog(id: string) {
    const existing = await (prisma as any).blogPost.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`Blog post record ${id} not found.`);
    }

    let cloudinaryOk = true;

    if (existing.coverImagePublicId) {
      const ok = await destroyImageFirst(existing.coverImagePublicId);
      if (!ok) cloudinaryOk = false;
    }

    if (existing.ogImagePublicId && existing.ogImagePublicId !== existing.coverImagePublicId) {
      const ok = await destroyImageFirst(existing.ogImagePublicId);
      if (!ok) cloudinaryOk = false;
    }

    await (prisma as any).blogPost.delete({ where: { id } });

    return {
      success: true,
      cloudinaryCleaned: cloudinaryOk,
      message: cloudinaryOk
        ? 'Blog post and Cloudinary assets deleted successfully.'
        : 'Database record deleted, but Cloudinary asset cleanup encountered warnings.'
    };
  }

  /**
   * Admin: Category CRUD
   */
  async saveBlogCategory(data: { id?: string; name: string; slug?: string; description?: string; icon?: string; displayOrder?: number; isActive?: boolean }) {
    const slug = data.slug?.trim()
      ? data.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (data.id) {
      return (prisma as any).blogCategory.update({
        where: { id: data.id },
        data: {
          name: data.name,
          slug,
          description: data.description,
          icon: data.icon || 'Sparkles',
          displayOrder: data.displayOrder || 0,
          isActive: data.isActive !== false
        }
      });
    }

    return (prisma as any).blogCategory.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        icon: data.icon || 'Sparkles',
        displayOrder: data.displayOrder || 0,
        isActive: data.isActive !== false
      }
    });
  }

  async deleteBlogCategory(id: string) {
    await (prisma as any).blogCategory.delete({ where: { id } });
    return { success: true };
  }

  /**
   * Admin: Author CRUD
   */
  async saveBlogAuthor(data: { id?: string; name: string; slug?: string; jobTitle: string; bio: string; profileImageUrl?: string; profileImagePublicId?: string; linkedinUrl?: string; websiteUrl?: string; expertise?: string; isActive?: boolean }) {
    const slug = data.slug?.trim()
      ? data.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (data.id) {
      return (prisma as any).blogAuthor.update({
        where: { id: data.id },
        data: {
          name: data.name,
          slug,
          jobTitle: data.jobTitle,
          bio: data.bio,
          profileImageUrl: data.profileImageUrl || null,
          profileImagePublicId: data.profileImagePublicId || null,
          linkedInUrl: data.linkedinUrl || null,
          websiteUrl: data.websiteUrl || null,
          expertise: data.expertise || null,
          isActive: data.isActive !== false
        }
      });
    }

    return (prisma as any).blogAuthor.create({
      data: {
        name: data.name,
        slug,
        jobTitle: data.jobTitle,
        bio: data.bio,
        profileImageUrl: data.profileImageUrl || null,
        profileImagePublicId: data.profileImagePublicId || null,
        linkedInUrl: data.linkedinUrl || null,
        websiteUrl: data.websiteUrl || null,
        expertise: data.expertise || null,
        isActive: data.isActive !== false
      }
    });
  }

  async deleteBlogAuthor(id: string) {
    await (prisma as any).blogAuthor.delete({ where: { id } });
    return { success: true };
  }

  /**
   * Helper: Async view counter increment
   */
  async incrementPostViews(id: string) {
    try {
      await (prisma as any).blogPost.update({
        where: { id },
        data: { views: { increment: 1 } }
      });
    } catch (err) {
      // Non-blocking operation
    }
  }

  private async incrementBlogView(id: string) {
    return this.incrementPostViews(id);
  }

  // --- Convenience Aliases for Routes ---

  async getPublicPosts(params?: {
    categorySlug?: string;
    tagSlug?: string;
    authorSlug?: string;
    postType?: string;
    searchIntent?: string;
    featured?: boolean;
    searchQuery?: string;
    limit?: number;
    offset?: number;
  }) {
    const res = await this.getPublicBlogs({
      category: params?.categorySlug,
      tag: params?.tagSlug,
      author: params?.authorSlug,
      postType: params?.postType,
      searchQuery: params?.searchQuery,
      featured: params?.featured,
      limit: params?.limit || 10,
      page: params?.offset ? Math.floor(params.offset / (params.limit || 10)) + 1 : 1
    });

    return {
      posts: res.items,
      totalCount: res.pagination.total
    };
  }

  async getAdminPosts(params?: { searchQuery?: string; categoryId?: string; status?: string; postType?: string }) {
    return this.getAdminBlogs();
  }

  async createPost(input: CreateBlogInput) {
    return this.createBlog(input);
  }

  async updatePost(id: string, input: Partial<CreateBlogInput>) {
    return this.updateBlog(id, input);
  }

  async deletePost(id: string) {
    return this.deleteBlog(id);
  }

  async getVersions(postId: string) {
    return (prisma as any).blogPostVersion.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async restoreVersion(postId: string, versionId: string) {
    const ver = await (prisma as any).blogPostVersion.findUnique({ where: { id: versionId } });
    if (!ver || !ver.snapshot) throw new Error('Version snapshot not found');
    const snapshot = typeof ver.snapshot === 'string' ? JSON.parse(ver.snapshot) : ver.snapshot;
    return this.updateBlog(postId, snapshot);
  }

  async saveCategory(data: any) {
    return this.saveBlogCategory(data);
  }

  async deleteCategory(id: string) {
    return this.deleteBlogCategory(id);
  }

  async saveTag(data: { id?: string; name: string; slug?: string }) {
    const slug = data.slug?.trim()
      ? data.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (data.id) {
      return (prisma as any).blogTag.update({
        where: { id: data.id },
        data: { name: data.name, slug }
      });
    }

    return (prisma as any).blogTag.create({
      data: { name: data.name, slug }
    });
  }

  async deleteTag(id: string) {
    await (prisma as any).blogTag.delete({ where: { id } });
    return { success: true };
  }

  async saveAuthor(data: any) {
    return this.saveBlogAuthor(data);
  }

  async deleteAuthor(id: string) {
    return this.deleteBlogAuthor(id);
  }

  async recordSearchQuery(query: string, resultsCount: number, intent: string = 'INFORMATIONAL') {
    return (prisma as any).blogSearchLog.create({
      data: {
        query,
        resultsCount,
        searchIntent: intent
      }
    }).catch(() => {});
  }

  async getSearchLogs(limit: number = 50) {
    return (prisma as any).blogSearchLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
  }

  async getRedirects() {
    return (prisma as any).blogRedirect.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async generateRssFeed() {
    const posts = await this.getLatestBlogs(20);
    const siteUrl = process.env.FRONTEND_URL || 'https://ryzite.com';

    let itemsXml = '';
    for (const p of posts) {
      itemsXml += `
        <item>
          <title><![CDATA[${p.title}]]></title>
          <link>${siteUrl}/blog/${p.slug}</link>
          <guid>${siteUrl}/blog/${p.slug}</guid>
          <pubDate>${p.publishedAt ? new Date(p.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
          <description><![CDATA[${p.excerpt}]]></description>
          ${p.author ? `<dc:creator><![CDATA[${p.author.name}]]></dc:creator>` : ''}
          ${p.category ? `<category><![CDATA[${p.category.name}]]></category>` : ''}
        </item>
      `;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Ryzite Engineering Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Engineering Insights, AI Architecture &amp; AEO Articles</description>
    <language>en-us</language>
    ${itemsXml}
  </channel>
</rss>`;
  }

  // Compatibility aliases for blog.routes.ts
  async getAllPublished() {
    return this.getLatestBlogs(20);
  }

  async getBySlug(slug: string) {
    return this.getBlogBySlug(slug);
  }

  async getPostBySlug(slug: string) {
    return this.getBlogBySlug(slug);
  }

  async getLatestPosts(limit: number = 3) {
    return this.getLatestBlogs(limit);
  }

  async getFeaturedPosts(limit: number = 3) {
    await this.seedDefaultBlogs();
    return (prisma as any).blogPost.findMany({
      where: { status: 'PUBLISHED', featured: true },
      take: limit,
      orderBy: { featuredOrder: 'asc' },
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
        author: { select: { id: true, name: true, slug: true, jobTitle: true, profileImageUrl: true } }
      }
    });
  }

  async getCategories() {
    return this.getBlogCategories();
  }

  async getTags() {
    return this.getBlogTags();
  }

  async getAuthors() {
    return this.getBlogAuthors();
  }

  async getCategoryBySlug(slug: string) {
    await this.seedDefaultBlogs();
    return (prisma as any).blogCategory.findUnique({ where: { slug } });
  }

  async getTagBySlug(slug: string) {
    return (prisma as any).blogTag.findUnique({ where: { slug } });
  }

  async getAuthorBySlug(slug: string) {
    await this.seedDefaultBlogs();
    return (prisma as any).blogAuthor.findUnique({ where: { slug } });
  }
}

export const blogRepository = new BlogRepository();


