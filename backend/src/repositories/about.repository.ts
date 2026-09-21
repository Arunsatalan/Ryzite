import { prisma } from './prisma.js';
import { StatisticStatus } from '@prisma/client';

export class AboutRepository {
  /**
   * Get or initialize default AboutPage record in PostgreSQL.
   */
  static async getOrCreateAboutPage() {
    let page = await prisma.aboutPage.findFirst({
      where: { slug: 'about' },
      include: {
        highlights: { orderBy: { displayOrder: 'asc' } },
        capabilities: { orderBy: { displayOrder: 'asc' } },
        values: { orderBy: { displayOrder: 'asc' } },
        timeline: { orderBy: { displayOrder: 'asc' } },
        teamMembers: { orderBy: { displayOrder: 'asc' } },
        industries: { orderBy: { displayOrder: 'asc' } },
        versions: { take: 10, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!page) {
      page = await prisma.aboutPage.create({
        data: {
          slug: 'about',
          heroLabel: 'ABOUT RYZITE',
          heroTitle: 'Engineering Precision Meets Product Mastery',
          heroDescription: 'Ryzite was founded by veteran Principal Software Architects with a singular mission: to eliminate friction, technical debt, and delays by delivering high-velocity, production-grade digital products.',
          heroImageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=85&w=1200&auto=format&fit=crop',
          heroImageAlt: 'Ryzite Engineering Studio',
          heroCtaText: 'Book Discovery Session',
          heroCtaUrl: '/#contact',

          introTitle: 'Building Software Systems That Scale Without Compromise',
          introShort: 'Ryzite is an enterprise-grade digital software development agency specializing in full-stack web portals, custom AI agentic automation, and zero-downtime cloud architecture.',
          introFull: 'We partner directly with founders, CTOs, and product leaders to build clean, maintainable, and high-performance software applications. By combining senior full-stack engineering with modern AI capabilities and automated testing, we deliver measurable business impact on tight schedules.',

          whoWeAreTitle: 'Senior Engineering Leadership',
          whoWeAreDescription: 'No middle account-manager layers. You collaborate directly with senior software architects and tech leads who take hands-on ownership of your product.',
          whoWeAreImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=85&w=1000&auto=format&fit=crop',
          whoWeAreImageAlt: 'Ryzite Engineering Team Collaborating',

          missionTitle: 'Our Mission',
          missionDescription: 'To empower forward-thinking enterprises with reliable, high-performance, and AI-first software solutions built on clean architecture and transparent communication.',
          missionImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=85&w=800&auto=format&fit=crop',
          missionImageAlt: 'Ryzite Mission & Engineering Precision',

          visionTitle: 'Our Vision',
          visionDescription: 'To set the gold standard for global software agency delivery by replacing traditional friction with direct senior technical leadership, zero-downtime deployments, and verifiable business value.',
          visionImageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=85&w=800&auto=format&fit=crop',
          visionImageAlt: 'Ryzite Global Vision',

          ctaTitle: 'Ready to Build With Senior Architects?',
          ctaDescription: 'Skip the generic agency pitch. Talk code, architecture, and timeline directly with our engineering team.',
          ctaButtonText: 'Start a Project',
          ctaButtonUrl: '/#contact',
          ctaSecondaryText: 'View Case Studies',
          ctaSecondaryUrl: '/portfolio',

          showTrustedClients: true,
          useGlobalWhyChooseUs: true,
          showStatistics: true,
          showCapabilities: true,
          showTeam: true,
          showTimeline: true,
          showFaqs: true,
          showIndustries: true,

          metaTitle: 'About Ryzite | Software Engineering & AI Agency',
          metaDescription: 'Learn about Ryzite engineering philosophy, core leadership team, technical delivery pillars, and verified company facts.',
          canonicalUrl: 'https://ryzite.com/about',
          robotsIndex: true,
          robotsFollow: true,

          whoIsDirectAnswer: 'Ryzite is a premier Software Development and Digital Marketing Agency specializing in full-stack web applications, mobile engineering (iOS/Android), custom Generative AI & agentic automation workflows, and zero-downtime cloud architecture.',
          whatWeDoDirectAnswer: 'Ryzite architects custom SaaS platforms, enterprise AI automation systems, high-speed mobile apps, and search-optimized web applications with sub-100ms response times.',

          status: StatisticStatus.PUBLISHED,
          publishedAt: new Date(),
          publishedBy: 'System Initializer',

          highlights: {
            create: [
              { title: 'Sub-100ms Performance First', description: 'We architect every database query and vector index to render with sub-100ms Core Web Vitals.', icon: 'Cpu', displayOrder: 0 },
              { title: 'Automated CI/CD & Testing', description: 'Every commit runs through automated linting, unit tests, and integration pipelines.', icon: 'GitBranch', displayOrder: 1 },
              { title: 'Enterprise Security by Default', description: 'SOC2 compliant encryption, role-based access control, and sanitization guardrails at every layer.', icon: 'Lock', displayOrder: 2 },
              { title: 'Senior Architect Direct Access', description: 'No middle account managers. Collaborate directly with senior full-stack architects.', icon: 'Users', displayOrder: 3 }
            ]
          },
          capabilities: {
            create: [
              { title: 'Custom Web Application Architecture', description: 'High-throughput Next.js & Node.js backend systems built for enterprise reliability.', icon: 'Code', displayOrder: 0 },
              { title: 'Enterprise AI & Workflow Automation', description: 'Autonomous LLM agents, RAG document pipelines, and custom workflow bots.', icon: 'Sparkles', displayOrder: 1 },
              { title: 'Cross-Platform Mobile Engineering', description: 'Native-feel iOS and Android mobile solutions with real-time push sync.', icon: 'Rocket', displayOrder: 2 },
              { title: 'Cloud Infrastructure & DevOps', description: 'Zero-downtime Kubernetes deployments, Terraform IaC, and AWS/GCP optimization.', icon: 'Layers', displayOrder: 3 }
            ]
          },
          values: {
            create: [
              { title: 'Engineering Quality First', description: 'We write clean, documented, and tested code that scales long after deployment.', icon: 'ShieldCheck', displayOrder: 0 },
              { title: 'Transparent Communication', description: 'Clear 2-week agile sprints with direct code visibility and honest status updates.', icon: 'MessageSquare', displayOrder: 1 },
              { title: 'Business Impact Focus', description: 'We measure success by performance benchmarks, user conversion, and business ROI.', icon: 'TrendingUp', displayOrder: 2 },
              { title: 'Continuous Innovation', description: 'Leveraging modern LLM frameworks, vector search, and edge computing to stay ahead.', icon: 'Zap', displayOrder: 3 }
            ]
          },
          timeline: {
            create: [
              { year: '2022', title: 'Ryzite Engineering Studio Founded', description: 'Established in San Francisco by veteran Principal Solutions Architects.', displayOrder: 0 },
              { year: '2023', title: 'Expanded Enterprise AI Practice', description: 'Launched dedicated RAG vector pipelines and LLM automation practice.', displayOrder: 1 },
              { year: '2024', title: '25+ Production Applications Live', description: 'Surpassed 25 production deployments across North America and Europe with 98% satisfaction.', displayOrder: 2 },
              { year: '2026', title: 'Next-Gen Answer Engine Optimization', description: 'Built authoritative AEO Entity Knowledge Hub for Perplexity & AI Search Engine citations.', displayOrder: 3 }
            ]
          },
          teamMembers: {
            create: [
              { name: 'Alex Vance', role: 'Principal Solutions Architect', shortBio: '12+ years building high-concurrency SaaS portals, AI vector pipelines, and distributed cloud systems.', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop', linkedInUrl: 'https://linkedin.com/in/alex-vance', displayOrder: 0 },
              { name: 'Sarah Chen', role: 'Head of Growth & AEO Architecture', shortBio: 'Pioneer in Answer Engine Optimization (AEO) and structured data schemas for generative AI citations.', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop', linkedInUrl: 'https://linkedin.com/in/sarah-chen', displayOrder: 1 },
              { name: 'Liam Sterling', role: 'DevOps & Infrastructure Practice Lead', shortBio: 'Specialist in Kubernetes zero-downtime blue-green deployments, Terraform IaC, and SOC2 compliance.', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop', linkedInUrl: 'https://linkedin.com/in/liam-sterling', displayOrder: 2 }
            ]
          },
          industries: {
            create: [
              { industry: 'SaaS & Software Platforms', description: 'High-scale multi-tenant web applications and API microservices.', icon: 'Code', displayOrder: 0 },
              { industry: 'AI & Machine Learning Ops', description: 'Agentic workflows, RAG vector retrieval, and custom model integrations.', icon: 'Sparkles', displayOrder: 1 },
              { industry: 'E-commerce & Digital Retail', description: 'High-conversion headless storefronts and automated inventory sync.', icon: 'ShoppingBag', displayOrder: 2 },
              { industry: 'Healthcare & HealthTech', description: 'HIPAA-compliant patient portals and secure telemetry storage.', icon: 'Activity', displayOrder: 3 }
            ]
          }
        },
        include: {
          highlights: { orderBy: { displayOrder: 'asc' } },
          capabilities: { orderBy: { displayOrder: 'asc' } },
          values: { orderBy: { displayOrder: 'asc' } },
          timeline: { orderBy: { displayOrder: 'asc' } },
          teamMembers: { orderBy: { displayOrder: 'asc' } },
          industries: { orderBy: { displayOrder: 'asc' } },
          versions: { take: 10, orderBy: { createdAt: 'desc' } }
        }
      });
    }

    return page;
  }

  /**
   * Fetch public About payload (only active content + referenced published tables).
   */
  static async getPublicAboutPage() {
    const page = await this.getOrCreateAboutPage();

    // If unpublished draft, return null or status indicator unless preview mode
    if (page.status !== StatisticStatus.PUBLISHED) {
      // In production, fallback to latest published version or page state
    }

    // Single source of truth references from existing CMS tables:
    const [statistics, trustedClients, whyChooseUs, expertise, faqs] = await Promise.all([
      // Fetch verified published statistics
      prisma.companyStatistic.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { displayOrder: 'asc' }
      }).catch(() => []),

      // Fetch enabled trusted clients
      prisma.client.findMany({
        where: { enabled: true },
        orderBy: { displayOrder: 'asc' }
      }).catch(() => []),

      // Fetch enabled why choose us cards
      prisma.companyPrinciple.findMany({
        where: { enabled: true },
        orderBy: { displayOrder: 'asc' }
      }).catch(() => []),

      // Fetch active topic expertise from AEO Engine
      prisma.companyExpertise.findMany({
        where: { active: true },
        orderBy: [{ priority: 'desc' }, { displayOrder: 'asc' }]
      }).catch(() => []),

      // Fetch published FAQs
      prisma.companyFaq.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { displayOrder: 'asc' }
      }).catch(() => [])
    ]);

    return {
      page,
      highlights: page.highlights.filter(h => h.active),
      capabilities: page.capabilities.filter(c => c.active),
      values: page.values.filter(v => v.active),
      timeline: page.timeline.filter(t => t.active),
      teamMembers: page.teamMembers.filter(t => t.active),
      industries: page.industries.filter(i => i.active),

      // Single source of truth consumed data
      statistics: page.showStatistics ? statistics : [],
      trustedClients: page.showTrustedClients ? trustedClients : [],
      whyChooseUs: page.useGlobalWhyChooseUs ? whyChooseUs : [],
      expertise,
      faqs: page.showFaqs ? faqs : []
    };
  }

  /**
   * Fetch complete admin About data (including draft items and version logs).
   */
  static async getAdminAboutPage() {
    return this.getOrCreateAboutPage();
  }

  /**
   * Save draft edits for About page and child section items.
   */
  static async saveAboutDraft(data: any) {
    const existing = await this.getOrCreateAboutPage();
    const pageId = existing.id;

    // Transaction to update page and child collections safely
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update main AboutPage fields
      const p = await tx.aboutPage.update({
        where: { id: pageId },
        data: {
          heroLabel: data.heroLabel ?? existing.heroLabel,
          heroTitle: data.heroTitle ?? existing.heroTitle,
          heroDescription: data.heroDescription ?? existing.heroDescription,
          heroImageUrl: data.heroImageUrl ?? existing.heroImageUrl,
          heroImagePublicId: data.heroImagePublicId ?? existing.heroImagePublicId,
          heroImageAlt: data.heroImageAlt ?? existing.heroImageAlt,
          heroCtaText: data.heroCtaText ?? existing.heroCtaText,
          heroCtaUrl: data.heroCtaUrl ?? existing.heroCtaUrl,
          heroActive: data.heroActive ?? existing.heroActive,

          introTitle: data.introTitle ?? existing.introTitle,
          introShort: data.introShort ?? existing.introShort,
          introFull: data.introFull ?? existing.introFull,
          introActive: data.introActive ?? existing.introActive,

          whoWeAreTitle: data.whoWeAreTitle ?? existing.whoWeAreTitle,
          whoWeAreDescription: data.whoWeAreDescription ?? existing.whoWeAreDescription,
          whoWeAreImageUrl: data.whoWeAreImageUrl ?? existing.whoWeAreImageUrl,
          whoWeAreImagePublicId: data.whoWeAreImagePublicId ?? existing.whoWeAreImagePublicId,
          whoWeAreImageAlt: data.whoWeAreImageAlt ?? existing.whoWeAreImageAlt,
          whoWeAreActive: data.whoWeAreActive ?? existing.whoWeAreActive,

          missionTitle: data.missionTitle ?? existing.missionTitle,
          missionDescription: data.missionDescription ?? existing.missionDescription,
          missionImageUrl: data.missionImageUrl ?? existing.missionImageUrl,
          missionImagePublicId: data.missionImagePublicId ?? existing.missionImagePublicId,
          missionImageAlt: data.missionImageAlt ?? existing.missionImageAlt,
          missionActive: data.missionActive ?? existing.missionActive,

          visionTitle: data.visionTitle ?? existing.visionTitle,
          visionDescription: data.visionDescription ?? existing.visionDescription,
          visionImageUrl: data.visionImageUrl ?? existing.visionImageUrl,
          visionImagePublicId: data.visionImagePublicId ?? existing.visionImagePublicId,
          visionImageAlt: data.visionImageAlt ?? existing.visionImageAlt,
          visionActive: data.visionActive ?? existing.visionActive,

          ctaTitle: data.ctaTitle ?? existing.ctaTitle,
          ctaDescription: data.ctaDescription ?? existing.ctaDescription,
          ctaButtonText: data.ctaButtonText ?? existing.ctaButtonText,
          ctaButtonUrl: data.ctaButtonUrl ?? existing.ctaButtonUrl,
          ctaSecondaryText: data.ctaSecondaryText ?? existing.ctaSecondaryText,
          ctaSecondaryUrl: data.ctaSecondaryUrl ?? existing.ctaSecondaryUrl,
          ctaActive: data.ctaActive ?? existing.ctaActive,

          showTrustedClients: data.showTrustedClients ?? existing.showTrustedClients,
          useGlobalWhyChooseUs: data.useGlobalWhyChooseUs ?? existing.useGlobalWhyChooseUs,
          showStatistics: data.showStatistics ?? existing.showStatistics,
          showCapabilities: data.showCapabilities ?? existing.showCapabilities,
          showTeam: data.showTeam ?? existing.showTeam,
          showTimeline: data.showTimeline ?? existing.showTimeline,
          showFaqs: data.showFaqs ?? existing.showFaqs,
          showIndustries: data.showIndustries ?? existing.showIndustries,

          metaTitle: data.metaTitle ?? existing.metaTitle,
          metaDescription: data.metaDescription ?? existing.metaDescription,
          canonicalUrl: data.canonicalUrl ?? existing.canonicalUrl,
          ogTitle: data.ogTitle ?? existing.ogTitle,
          ogDescription: data.ogDescription ?? existing.ogDescription,
          ogImageUrl: data.ogImageUrl ?? existing.ogImageUrl,
          ogImagePublicId: data.ogImagePublicId ?? existing.ogImagePublicId,
          robotsIndex: data.robotsIndex ?? existing.robotsIndex,
          robotsFollow: data.robotsFollow ?? existing.robotsFollow,
          focusTopic: data.focusTopic ?? existing.focusTopic,

          whoIsDirectAnswer: data.whoIsDirectAnswer ?? existing.whoIsDirectAnswer,
          whatWeDoDirectAnswer: data.whatWeDoDirectAnswer ?? existing.whatWeDoDirectAnswer,

          updatedAt: new Date()
        }
      });

      // 2. Replace Highlights if passed
      if (Array.isArray(data.highlights)) {
        await tx.aboutHighlight.deleteMany({ where: { aboutPageId: pageId } });
        if (data.highlights.length > 0) {
          await tx.aboutHighlight.createMany({
            data: data.highlights.map((h: any, idx: number) => ({
              aboutPageId: pageId,
              title: h.title,
              description: h.description,
              icon: h.icon || 'Sparkles',
              displayOrder: h.displayOrder ?? idx,
              active: h.active ?? true
            }))
          });
        }
      }

      // 3. Replace Capabilities if passed
      if (Array.isArray(data.capabilities)) {
        await tx.aboutCapability.deleteMany({ where: { aboutPageId: pageId } });
        if (data.capabilities.length > 0) {
          await tx.aboutCapability.createMany({
            data: data.capabilities.map((c: any, idx: number) => ({
              aboutPageId: pageId,
              title: c.title,
              description: c.description,
              icon: c.icon || 'Cpu',
              serviceId: c.serviceId || null,
              displayOrder: c.displayOrder ?? idx,
              active: c.active ?? true
            }))
          });
        }
      }

      // 4. Replace Values if passed
      if (Array.isArray(data.values)) {
        await tx.aboutValue.deleteMany({ where: { aboutPageId: pageId } });
        if (data.values.length > 0) {
          await tx.aboutValue.createMany({
            data: data.values.map((v: any, idx: number) => ({
              aboutPageId: pageId,
              title: v.title,
              description: v.description,
              icon: v.icon || 'ShieldCheck',
              displayOrder: v.displayOrder ?? idx,
              active: v.active ?? true
            }))
          });
        }
      }

      // 5. Replace Timeline if passed
      if (Array.isArray(data.timeline)) {
        await tx.aboutTimeline.deleteMany({ where: { aboutPageId: pageId } });
        if (data.timeline.length > 0) {
          await tx.aboutTimeline.createMany({
            data: data.timeline.map((t: any, idx: number) => ({
              aboutPageId: pageId,
              year: t.year,
              title: t.title,
              description: t.description,
              imageUrl: t.imageUrl || null,
              imagePublicId: t.imagePublicId || null,
              imageAlt: t.imageAlt || null,
              displayOrder: t.displayOrder ?? idx,
              active: t.active ?? true
            }))
          });
        }
      }

      // 6. Replace Team Members if passed
      if (Array.isArray(data.teamMembers)) {
        await tx.aboutTeamMember.deleteMany({ where: { aboutPageId: pageId } });
        if (data.teamMembers.length > 0) {
          await tx.aboutTeamMember.createMany({
            data: data.teamMembers.map((m: any, idx: number) => ({
              aboutPageId: pageId,
              name: m.name,
              role: m.role,
              shortBio: m.shortBio,
              photoUrl: m.photoUrl || null,
              photoPublicId: m.photoPublicId || null,
              photoAlt: m.photoAlt || null,
              linkedInUrl: m.linkedInUrl || null,
              displayOrder: m.displayOrder ?? idx,
              active: m.active ?? true
            }))
          });
        }
      }

      // 7. Replace Industries if passed
      if (Array.isArray(data.industries)) {
        await tx.aboutIndustry.deleteMany({ where: { aboutPageId: pageId } });
        if (data.industries.length > 0) {
          await tx.aboutIndustry.createMany({
            data: data.industries.map((ind: any, idx: number) => ({
              aboutPageId: pageId,
              industry: ind.industry,
              description: ind.description,
              icon: ind.icon || 'Building2',
              relatedServices: ind.relatedServices || [],
              displayOrder: ind.displayOrder ?? idx,
              active: ind.active ?? true
            }))
          });
        }
      }

      return p;
    });

    return this.getAdminAboutPage();
  }

  /**
   * Publish current draft & create recoverable version snapshot.
   */
  static async publishAboutPage(publishedBy: string = 'Admin User', reason: string = 'Published new About page version') {
    const page = await this.getAdminAboutPage();

    // Create complete snapshot
    const snapshotData = {
      page: {
        heroLabel: page.heroLabel,
        heroTitle: page.heroTitle,
        heroDescription: page.heroDescription,
        heroImageUrl: page.heroImageUrl,
        introTitle: page.introTitle,
        introShort: page.introShort,
        introFull: page.introFull,
        whoWeAreTitle: page.whoWeAreTitle,
        missionTitle: page.missionTitle,
        missionDescription: page.missionDescription,
        visionTitle: page.visionTitle,
        visionDescription: page.visionDescription,
        ctaTitle: page.ctaTitle,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription
      },
      highlights: page.highlights,
      capabilities: page.capabilities,
      values: page.values,
      timeline: page.timeline,
      teamMembers: page.teamMembers,
      industries: page.industries,
      publishedAt: new Date().toISOString()
    };

    await prisma.aboutPageVersion.create({
      data: {
        aboutPageId: page.id,
        snapshot: snapshotData as any,
        changedBy: publishedBy,
        reason
      }
    });

    return prisma.aboutPage.update({
      where: { id: page.id },
      data: {
        status: StatisticStatus.PUBLISHED,
        publishedAt: new Date(),
        publishedBy,
        updatedAt: new Date()
      },
      include: {
        highlights: true,
        capabilities: true,
        values: true,
        timeline: true,
        teamMembers: true,
        industries: true
      }
    });
  }

  /**
   * Unpublish About page (switch to DRAFT).
   */
  static async unpublishAboutPage() {
    const page = await this.getOrCreateAboutPage();
    return prisma.aboutPage.update({
      where: { id: page.id },
      data: {
        status: StatisticStatus.DRAFT,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Fetch version audit history list.
   */
  static async getVersionHistory() {
    const page = await this.getOrCreateAboutPage();
    return prisma.aboutPageVersion.findMany({
      where: { aboutPageId: page.id },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Restore a historical snapshot.
   */
  static async restoreVersion(versionId: string, changedBy: string = 'Admin Restorer') {
    const version = await prisma.aboutPageVersion.findUnique({
      where: { id: versionId }
    });
    if (!version) throw new Error('Version snapshot not found');

    const snapshot = version.snapshot as any;
    if (snapshot?.page) {
      await this.saveAboutDraft({
        ...snapshot.page,
        highlights: snapshot.highlights,
        capabilities: snapshot.capabilities,
        values: snapshot.values,
        timeline: snapshot.timeline,
        teamMembers: snapshot.teamMembers,
        industries: snapshot.industries
      });
    }

    return this.getAdminAboutPage();
  }
}
