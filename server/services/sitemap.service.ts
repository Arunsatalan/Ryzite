import { store } from './store.service.ts';

export function generateSitemapXml(baseUrl: string = 'https://ryzite.com'): string {
  const services = store.getServices();
  const projects = store.getProjects();
  const blogs = store.getBlogs();

  const urls = [
    '',
    '/services',
    '/portfolio',
    '/about',
    '/blog',
    '/contact',
    ...services.map(s => `/services/${s.slug}`),
    ...projects.map(p => `/portfolio/${p.slug}`),
    ...blogs.map(b => `/blog/${b.slug}`)
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '' ? '1.0' : url.startsWith('/services') ? '0.9' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;
}

export function generateRobotsTxt(baseUrl: string = 'https://ryzite.com'): string {
  return `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-images.xml`;
}
