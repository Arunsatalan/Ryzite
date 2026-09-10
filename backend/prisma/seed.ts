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
    update: {},
    create: {
      id: 'home-singleton',
      heroEyebrow: 'NEXT-GEN SOFTWARE & AI AGENCY',
      heroTitle: 'We Build Software That Drives Growth',
      heroHighlightedText: 'Drives Growth',
      heroDescription: 'Empowering startups and enterprises with innovative, scalable and secure custom software, mobile apps, AI automation, and cloud solutions.',
      primaryCtaLabel: 'Schedule Architecture Call',
      primaryCtaUrl: '#contact',
      secondaryCtaLabel: 'Explore Services',
      secondaryCtaUrl: '#services',
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
