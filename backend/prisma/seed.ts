import { PrismaClient, ContentStatus, SectionKey, Role, LeadStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Standalone Backend Database Seeding...');

  // 1. Seed Admin User
  await prisma.user.upsert({
    where: { email: 'admin@ryzite.com' },
    update: {},
    create: {
      email: 'admin@ryzite.com',
      name: 'Alex Vance (Chief Architect)',
      passwordHash: '$2b$10$e8T7R72a7V5.jT5H6v2ZHeuG4vN5z4Z2qX3rX5vN5z4Z2qX3rX5vN',
      role: Role.SUPER_ADMIN,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    }
  });

  // 2. Seed Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'settings-singleton' },
    update: {},
    create: {
      id: 'settings-singleton',
      siteName: 'Ryzite',
      legalName: 'Ryzite Global Inc.',
      tagline: 'We Build Software That Drives Growth',
      siteUrl: 'https://ryzite.com',
      contactEmail: 'contact@ryzite.com',
      phone: '+1-800-555-0199',
      addressLine1: '100 Innovation Way, Suite 400, San Francisco, CA 94105',
      socialLinks: {
        create: [
          { platform: 'Twitter', label: 'Twitter / X', url: 'https://twitter.com/ryzite_agency', iconKey: 'Twitter', displayOrder: 1 },
          { platform: 'LinkedIn', label: 'LinkedIn', url: 'https://linkedin.com/company/ryzite', iconKey: 'Linkedin', displayOrder: 2 },
          { platform: 'GitHub', label: 'GitHub', url: 'https://github.com/ryzite', iconKey: 'Github', displayOrder: 3 }
        ]
      }
    }
  });

  // 3. Seed HomePage
  const homePage = await prisma.homePage.upsert({
    where: { id: 'home-singleton' },
    update: {
      heroBadgeText: 'SOFTWARE SOLUTIONS THAT SCALE',
      heroHeadingPrefix: 'We Build Software',
      heroHeadingHighlight: 'Drives Growth',
      heroHeadingSuffix: '',
      heroDescription: 'Empowering startups and enterprises with innovative, scalable and secure software solutions. From idea to impact – we turn your vision into powerful digital products.',
      heroPrimaryCtaText: 'Explore Our Services',
      heroPrimaryCtaUrl: '/services',
      heroPrimaryCtaEnabled: true,
      heroSecondaryCtaText: 'Book a Free Consultation',
      heroSecondaryCtaUrl: '#contact',
      heroSecondaryCtaType: 'consultation',
      heroSecondaryCtaEnabled: true,
      heroEnabled: true,
      heroDisplayOrder: 1
    },
    create: {
      id: 'home-singleton',
      heroBadgeText: 'SOFTWARE SOLUTIONS THAT SCALE',
      heroHeadingPrefix: 'We Build Software',
      heroHeadingHighlight: 'Drives Growth',
      heroHeadingSuffix: '',
      heroDescription: 'Empowering startups and enterprises with innovative, scalable and secure software solutions. From idea to impact – we turn your vision into powerful digital products.',
      heroPrimaryCtaText: 'Explore Our Services',
      heroPrimaryCtaUrl: '/services',
      heroPrimaryCtaEnabled: true,
      heroSecondaryCtaText: 'Book a Free Consultation',
      heroSecondaryCtaUrl: '#contact',
      heroSecondaryCtaType: 'consultation',
      heroSecondaryCtaEnabled: true,
      heroEnabled: true,
      heroDisplayOrder: 1,
      heroEyebrow: 'SOFTWARE SOLUTIONS THAT SCALE',
      heroTitle: 'We Build Software That Drives Growth',
      heroHighlightedText: 'Drives Growth',
      primaryCtaLabel: 'Explore Our Services',
      primaryCtaUrl: '/services',
      secondaryCtaLabel: 'Book a Free Consultation',
      secondaryCtaUrl: '#contact',
      servicesEyebrow: 'OUR CAPABILITIES',
      servicesTitle: 'Engineering Excellence Across the Stack',
      servicesDescription: 'High-performance web, mobile, AI, and cloud architectures built by veteran engineers.',
      portfolioEyebrow: 'PROVEN OUTCOMES',
      portfolioTitle: 'Case Studies & Client Results',
      portfolioDescription: 'Real-world software platforms engineered for maximum ROI and sub-100ms response times.',
      aboutEyebrow: 'WHY RYZITE',
      aboutTitle: 'Architected for Speed & Reliability',
      aboutDescription: 'We combine principal engineering, modern tech stacks, and AEO optimization for unmatched quality.',
      faqEyebrow: 'FREQUENTLY ASKED QUESTIONS',
      faqTitle: 'Everything You Need to Know',
      faqDescription: 'Clear answers about our methodology, security standards, SLAs, and kickoff process.',
      blogEyebrow: 'ENGINEERING INSIGHTS',
      blogTitle: 'Latest Tech & AEO Architecture',
      blogDescription: 'Deep dives into generative AI agents, vector databases, zero-downtime microservices, and AEO.',
      finalCtaEyebrow: 'READY TO BUILD?',
      finalCtaTitle: "Let's Architect Your Next Solution",
      finalCtaDescription: 'Get a comprehensive project architecture blueprint, timeline breakdown, and cost estimate.',
      finalCtaLabel: 'Get Free Scope Estimate',
      finalCtaUrl: '#contact'
    }
  });

  const sectionsList: SectionKey[] = [
    SectionKey.HERO, SectionKey.CLIENTS, SectionKey.SERVICES, SectionKey.WHY_CHOOSE_US,
    SectionKey.STATS, SectionKey.PORTFOLIO, SectionKey.AEO, SectionKey.ABOUT,
    SectionKey.CTA, SectionKey.FAQ, SectionKey.BLOG, SectionKey.FINAL_CTA
  ];

  for (let idx = 0; idx < sectionsList.length; idx++) {
    await prisma.homeSection.upsert({
      where: { homePageId_sectionKey: { homePageId: homePage.id, sectionKey: sectionsList[idx] } },
      update: {},
      create: {
        homePageId: homePage.id,
        sectionKey: sectionsList[idx],
        enabled: true,
        displayOrder: idx + 1
      }
    });
  }

  // 4. Seed Static Pages & SEO Metadata (home, services, solutions, portfolio, about, blog)
  const staticPageSeeds = [
    {
      pageKey: 'home',
      route: '/',
      title: 'Ryzite | Digital Product Studio & Enterprise AI Software Development',
      metaTitle: 'Ryzite | Digital Product Studio & Enterprise AI Software Development',
      metaDescription: 'Architecting mission-critical web applications, high-throughput cloud backends, and bespoke digital growth systems for modern scale-ups.',
      canonicalUrl: 'https://ryzite.com'
    },
    {
      pageKey: 'services',
      route: '/services',
      title: 'Our Engineering Services & Pricing | Ryzite',
      metaTitle: 'Our Engineering Services & Pricing | Ryzite',
      metaDescription: 'Explore our full-stack web development, AI workflow automation, and cloud microservices engineering services.',
      canonicalUrl: 'https://ryzite.com/services'
    },
    {
      pageKey: 'solutions',
      route: '/solutions',
      title: 'Bespoke Enterprise Solutions & AI Workflows | Ryzite',
      metaTitle: 'Bespoke Enterprise Solutions & AI Workflows | Ryzite',
      metaDescription: 'Tailored digital transformation blueprints and high-throughput software architecture solutions.',
      canonicalUrl: 'https://ryzite.com/solutions'
    },
    {
      pageKey: 'portfolio',
      route: '/portfolio',
      title: 'Verified Client Case Studies & Impact Metrics | Ryzite',
      metaTitle: 'Verified Client Case Studies & Impact Metrics | Ryzite',
      metaDescription: 'Browse production benchmarks, cloud migrations, and AI agents engineered for scale-ups and enterprises.',
      canonicalUrl: 'https://ryzite.com/portfolio'
    },
    {
      pageKey: 'about',
      route: '/about',
      title: 'About Ryzite | Software Engineering & Growth Agency',
      metaTitle: 'About Ryzite | Software Engineering & Growth Agency',
      metaDescription: 'Learn about our engineering philosophy, core team expertise, and technical delivery standards.',
      canonicalUrl: 'https://ryzite.com/about'
    },
    {
      pageKey: 'blog',
      route: '/blog',
      title: 'Engineering Insights & AEO Technical Articles | Ryzite',
      metaTitle: 'Engineering Insights & AEO Technical Articles | Ryzite',
      metaDescription: 'Technical articles on Next.js 16, PostgreSQL optimization, AI agent workflows, and Answer Engine Optimization.',
      canonicalUrl: 'https://ryzite.com/blog'
    }
  ];

  for (const pageSeed of staticPageSeeds) {
    const page = await prisma.staticPage.upsert({
      where: { pageKey: pageSeed.pageKey },
      update: {
        title: pageSeed.title,
        route: pageSeed.route
      },
      create: {
        pageKey: pageSeed.pageKey,
        route: pageSeed.route,
        title: pageSeed.title
      }
    });

    await prisma.seoMetadata.upsert({
      where: { staticPageId: page.id },
      update: {
        metaTitle: pageSeed.metaTitle,
        metaDescription: pageSeed.metaDescription,
        canonicalUrl: pageSeed.canonicalUrl,
        robotsIndex: true,
        robotsFollow: true
      },
      create: {
        staticPageId: page.id,
        metaTitle: pageSeed.metaTitle,
        metaDescription: pageSeed.metaDescription,
        canonicalUrl: pageSeed.canonicalUrl,
        robotsIndex: true,
        robotsFollow: true
      }
    });
  }

  // 5. Seed Trusted Clients
  const trustedClientsData = [
    { name: 'PineGen AI', slug: 'pinegen-ai', companyName: 'PineGen Inc', logoAltText: 'PineGen AI company logo', websiteUrl: 'https://pinegen.ai', caseStudySlug: 'pinegen-ai', displayOrder: 1, featured: true, enabled: true },
    { name: 'Dinefy Voice AI', slug: 'dinefy-voice-ai', companyName: 'Dinefy Group', logoAltText: 'Dinefy Voice AI company logo', websiteUrl: 'https://dinefy.com', caseStudySlug: 'dinefy-ai-call-bot', displayOrder: 2, featured: true, enabled: true },
    { name: 'Enterprise IO', slug: 'enterprise-io', companyName: 'Enterprise IO Inc', logoAltText: 'Enterprise IO company logo', websiteUrl: 'https://enterprise.io', displayOrder: 3, featured: true, enabled: true },
    { name: 'Nexus Cloud', slug: 'nexus-cloud', companyName: 'Nexus Cloud Networks', logoAltText: 'Nexus Cloud company logo', websiteUrl: 'https://nexuscloud.io', displayOrder: 4, featured: true, enabled: true },
    { name: 'Apex Mobility', slug: 'apex-mobility', companyName: 'Apex Mobility Group', logoAltText: 'Apex Mobility company logo', websiteUrl: 'https://apexmobility.com', displayOrder: 5, featured: true, enabled: true }
  ];

  for (const clientSeed of trustedClientsData) {
    await prisma.client.upsert({
      where: { slug: clientSeed.slug },
      update: {
        name: clientSeed.name,
        companyName: clientSeed.companyName,
        logoAltText: clientSeed.logoAltText,
        websiteUrl: clientSeed.websiteUrl,
        caseStudySlug: clientSeed.caseStudySlug,
        displayOrder: clientSeed.displayOrder,
        featured: clientSeed.featured,
        enabled: clientSeed.enabled
      },
      create: clientSeed
    });
  }

  // 6. Seed Company Statistics
  const initialCompanyStats = [
    {
      id: 'stat-1',
      value: '25',
      prefix: '',
      suffix: '+',
      label: 'Projects Delivered',
      description: 'Global enterprise deployments',
      iconName: 'Rocket',
      iconColor: '#0052FF',
      animationEnabled: true,
      displayOrder: 1,
      status: 'PUBLISHED' as const,
      seoTitle: '25+ Projects Delivered',
      seoDescription: 'Ryzite has delivered scalable software projects worldwide.'
    },
    {
      id: 'stat-2',
      value: '15',
      prefix: '',
      suffix: '+',
      label: 'Happy Clients',
      description: 'Enterprise & Startups',
      iconName: 'Users',
      iconColor: '#0052FF',
      animationEnabled: true,
      displayOrder: 2,
      status: 'PUBLISHED' as const,
      seoTitle: '15+ Happy Clients',
      seoDescription: 'Trusted by enterprise leaders and modern tech scale-ups.'
    },
    {
      id: 'stat-3',
      value: '98',
      prefix: '',
      suffix: '%',
      label: 'Client Satisfaction',
      description: '5-Star CSAT Rating',
      iconName: 'Award',
      iconColor: '#0052FF',
      animationEnabled: true,
      displayOrder: 3,
      status: 'PUBLISHED' as const,
      seoTitle: '98% Client Satisfaction',
      seoDescription: 'Industry leading satisfaction rating.'
    },
    {
      id: 'stat-4',
      value: '3',
      prefix: '',
      suffix: '+',
      label: 'Years of Experience',
      description: 'Industry Leadership',
      iconName: 'Globe',
      iconColor: '#0052FF',
      animationEnabled: true,
      displayOrder: 4,
      status: 'PUBLISHED' as const,
      seoTitle: '3+ Years Experience',
      seoDescription: 'Pioneering AI software solutions.'
    }
  ];

  for (const statSeed of initialCompanyStats) {
    await prisma.companyStatistic.upsert({
      where: { id: statSeed.id },
      update: {
        value: statSeed.value,
        prefix: statSeed.prefix,
        suffix: statSeed.suffix,
        label: statSeed.label,
        description: statSeed.description,
        iconName: statSeed.iconName,
        iconColor: statSeed.iconColor,
        animationEnabled: statSeed.animationEnabled,
        displayOrder: statSeed.displayOrder,
        status: statSeed.status,
        seoTitle: statSeed.seoTitle,
        seoDescription: statSeed.seoDescription
      },
      create: statSeed
    });
  }

  // 6b. Seed Why Choose Us Pillars (CompanyPrinciples)
  const initialPrinciplesData = [
    { id: 'principle-1', badge: 'Zero-Debt Code', title: 'Quality First', description: 'We follow industry best practices to deliver high-quality zero-debt solutions.', iconKey: 'Award', displayOrder: 1, enabled: true },
    { id: 'principle-2', badge: '2-Week Sprints', title: 'Agile & Transparent', description: 'We work in agile methodology with clear 2-week sprint communication.', iconKey: 'Workflow', displayOrder: 2, enabled: true },
    { id: 'principle-3', badge: '100% SLA Record', title: 'On-time Delivery', description: 'We value your time and ensure projects are delivered on time with a 100% SLA.', iconKey: 'Clock', displayOrder: 3, enabled: true },
    { id: 'principle-4', badge: 'Hypercare Warranty', title: 'Long-term Support', description: 'We provide continuous post-launch support and maintenance.', iconKey: 'Headphones', displayOrder: 4, enabled: true }
  ];

  for (const principleSeed of initialPrinciplesData) {
    await prisma.companyPrinciple.upsert({
      where: { id: principleSeed.id },
      update: {
        badge: principleSeed.badge,
        title: principleSeed.title,
        description: principleSeed.description,
        iconKey: principleSeed.iconKey,
        displayOrder: principleSeed.displayOrder,
        enabled: principleSeed.enabled
      },
      create: principleSeed
    });
  }

  // 7. Seed Initial Projects / Case Studies
  const initialProjectsData = [
    {
      id: 'proj-1',
      slug: 'pinegen-ai',
      title: 'PineGen AI - Generative Platform',
      clientName: 'PineGen Inc',
      category: 'AI Platform',
      shortDescription: 'Enterprise AI content platform designed for scalable content-generation workflows.',
      fullDescription: 'PineGen AI is a next-generation generative AI workspace engineered for enterprise scale-ups. Powered by high-throughput RAG document pipelines and vector search indexing, the platform enables internal teams to execute complex content generation tasks with zero latency bottleneck.',
      challenge: 'Handling over 2M daily generative API executions while maintaining sub-100ms vector index retrieval times and zero downtime during traffic spikes.',
      solution: 'Architected a distributed microservices pipeline using Node.js, Next.js, PostgreSQL, and Redis caching with automated horizontal scaling.',
      heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      mockupType: 'DARK_DASHBOARD' as const,
      featured: true,
      displayOrder: 1,
      status: 'PUBLISHED' as const,
      websiteUrl: 'https://pinegen.ai',
      metrics: [
        { label: 'Daily API Calls', value: '2M+', trend: '+340%', displayOrder: 1 },
        { label: 'System Uptime SLA', value: '99.99%', trend: 'Zero Downtime', displayOrder: 2 },
        { label: 'Query Latency', value: '0.4s', trend: 'Sub-second', displayOrder: 3 }
      ],
      highlights: [
        { title: 'Asynchronous LLM Worker Pipeline', description: 'Engineered job queues capable of handling thousands of concurrent generation requests.', displayOrder: 1 },
        { title: 'Vector Database Integration', description: 'Implemented semantic search over multi-gigabyte document repositories.', displayOrder: 2 }
      ]
    },
    {
      id: 'proj-2',
      slug: 'dinefy-ai-call-bot',
      title: 'Dinefy Voice AI Agent',
      clientName: 'Dinefy Group',
      category: 'AI Automation',
      shortDescription: 'Autonomous telephone reservation & multi-line Voice AI call handling assistant.',
      fullDescription: 'Dinefy Voice AI replaces traditional manual phone booking systems with conversational voice agents that understand complex customer speech, handle multi-party reservations, and sync instantly with POS hardware.',
      challenge: 'Reducing speech-to-text-to-speech audio latency below 500ms while maintaining human-like natural conversation quality across noisy telephone lines.',
      solution: 'Deployed custom WebRTC real-time audio streams integrated with streaming LLM inference servers and low-latency voice synthesis.',
      heroImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
      mockupType: 'BOT_INTERFACE' as const,
      featured: true,
      displayOrder: 2,
      status: 'PUBLISHED' as const,
      websiteUrl: 'https://dinefy.com',
      metrics: [
        { label: 'Calls Handled', value: '12k+', trend: '100% Automated', displayOrder: 1 },
        { label: 'Voice Response Latency', value: '0.4s', trend: 'Real-time Audio', displayOrder: 2 },
        { label: 'Booking Conversion', value: '94%', trend: '+28% Increase', displayOrder: 3 }
      ],
      highlights: [
        { title: 'Real-Time Audio Stream Processing', description: 'Sub-500ms roundtrip audio pipeline for natural multi-turn conversations.', displayOrder: 1 },
        { title: 'Multi-POS Integration API', description: 'Instant two-way synchronization with restaurant table management hardware.', displayOrder: 2 }
      ]
    },
    {
      id: 'proj-3',
      slug: 'qrbook',
      title: 'QRBook - Smart Business Identity',
      clientName: 'QRBook Global',
      category: 'Digital Business Card',
      shortDescription: 'Instant contactless digital networking and corporate vCard platform.',
      fullDescription: 'QRBook replaces paper business cards with dynamic, customizable NFC & QR digital profiles featuring real-time analytics, CRM integration, and instant contact save.',
      challenge: 'Ensuring instant sub-100ms loading speeds on all mobile browsers worldwide without app installation.',
      solution: 'Built a lightweight Next.js edge-rendered platform with global CDN caching and localized vCard download streams.',
      heroImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop',
      mockupType: 'MOBILE_CARDS' as const,
      featured: true,
      displayOrder: 3,
      status: 'PUBLISHED' as const,
      websiteUrl: 'https://qrbook.io',
      metrics: [
        { label: 'Active Profiles', value: '45k+', trend: 'Global Growth', displayOrder: 1 },
        { label: 'vCard Save Rate', value: '88%', trend: 'Contact Sync', displayOrder: 2 },
        { label: 'Page Load Speed', value: '0.2s', trend: 'Ultra Fast', displayOrder: 3 }
      ],
      highlights: [
        { title: 'Edge-Rendered Profiles', description: 'Zero-JS initial render for instantaneous profile loads on cellular networks.', displayOrder: 1 }
      ]
    },
    {
      id: 'proj-4',
      slug: 'botloop',
      title: 'BotLoop - Automated Workflow Engine',
      clientName: 'BotLoop Inc',
      category: 'Chatbot Platform',
      shortDescription: 'Enterprise workflow automation bot managing complex internal ops.',
      fullDescription: 'BotLoop connects modern SaaS stacks with autonomous bot workflows that automate repetitive approval flows, lead routing, and customer support escalation.',
      challenge: 'Connecting disparate legacy enterprise APIs into a cohesive low-code visual workflow builder.',
      solution: 'Engineered an event-driven Node.js microservices bus with resilient webhooks and visual flow node execution.',
      heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
      mockupType: 'ANALYTICS_SUITE' as const,
      featured: true,
      displayOrder: 4,
      status: 'PUBLISHED' as const,
      websiteUrl: 'https://botloop.io',
      metrics: [
        { label: 'Workflows Executed', value: '5M+', trend: 'Monthly Executions', displayOrder: 1 },
        { label: 'Ops Time Saved', value: '65%', trend: 'Efficiency Gain', displayOrder: 2 },
        { label: 'Webhook Reliability', value: '99.9%', trend: 'Fault Tolerant', displayOrder: 3 }
      ],
      highlights: [
        { title: 'Visual Flow Builder Engine', description: 'Drag-and-drop workflow designer rendering real-time execution graphs.', displayOrder: 1 }
      ]
    }
  ];

  for (const projSeed of initialProjectsData) {
    const { metrics, highlights, ...projFields } = projSeed;
    const existing = await prisma.project.findUnique({ where: { slug: projFields.slug } });
    
    if (!existing) {
      await prisma.project.create({
        data: {
          ...projFields,
          metrics: {
            create: metrics
          },
          highlights: {
            create: highlights
          }
        }
      });
    }
  }

  console.log('🎉 Backend Seeding Completed Successfully!');

}


main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
