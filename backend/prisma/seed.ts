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
