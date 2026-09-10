import { prisma } from './prisma.js';

export const settingsRepository = {
  async getSiteSettings() {
    let settings = await prisma.siteSettings.findFirst({
      include: {
        socialLinks: { orderBy: { displayOrder: 'asc' } },
        logo: true,
        darkLogo: true,
        defaultOgImage: true
      }
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: 'Ryzite Software & AI Agency',
          legalName: 'Ryzite Global Inc.',
          tagline: 'We Build Software That Drives Growth',
          contactEmail: 'contact@ryzite.com',
          phone: '+1-800-555-0199',
          socialLinks: {
            create: [
              { platform: 'Twitter', label: 'Twitter / X', url: 'https://twitter.com/ryzite_agency', iconKey: 'Twitter', displayOrder: 1 },
              { platform: 'LinkedIn', label: 'LinkedIn', url: 'https://linkedin.com/company/ryzite', iconKey: 'Linkedin', displayOrder: 2 },
              { platform: 'GitHub', label: 'GitHub', url: 'https://github.com/ryzite', iconKey: 'Github', displayOrder: 3 }
            ]
          }
        },
        include: {
          socialLinks: { orderBy: { displayOrder: 'asc' } },
          logo: true,
          darkLogo: true,
          defaultOgImage: true
        }
      });
    }

    return settings;
  }
};
