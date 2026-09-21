import type { MetadataRoute } from 'next';
import { INITIAL_SERVICES, INITIAL_SOLUTIONS, INITIAL_PROJECTS, INITIAL_BLOGS } from '@/data/initialData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ryzite.com';
  const now = new Date();

  // Static main navigation routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solutions`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/company-facts`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamic Service routes
  const serviceRoutes: MetadataRoute.Sitemap = INITIAL_SERVICES.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Solution routes
  const solutionRoutes: MetadataRoute.Sitemap = INITIAL_SOLUTIONS.map((s) => ({
    url: `${baseUrl}/solutions/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Portfolio routes
  const portfolioRoutes: MetadataRoute.Sitemap = INITIAL_PROJECTS.map((p) => ({
    url: `${baseUrl}/portfolio/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Dynamic Blog routes
  const blogRoutes: MetadataRoute.Sitemap = INITIAL_BLOGS.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...solutionRoutes,
    ...portfolioRoutes,
    ...blogRoutes,
  ];
}
