import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { INITIAL_BLOGS, INITIAL_SERVICES } from '@/data/initialData';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { api } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await api.getSeo('blog').catch(() => null);
    const title = seo?.title || 'Engineering Insights & AEO Technical Articles | Ryzite';
    const description = seo?.description || 'Technical articles on Next.js 16, PostgreSQL optimization, AI agent workflows, and Answer Engine Optimization.';
    const canonical = seo?.canonicalUrl || 'https://ryzite.com/blog';
    const ogImage = seo?.ogImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: 'Ryzite',
        images: [{ url: ogImage, width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
      robots: {
        index: seo?.robotsIndex ?? true,
        follow: seo?.robotsFollow ?? true,
      },
    };
  } catch (err) {
    return {
      title: 'Engineering Insights & AEO Technical Articles | Ryzite',
      description: 'Technical articles on Next.js 16, PostgreSQL optimization, AI agent workflows, and Answer Engine Optimization.',
    };
  }
}

export default function BlogPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Ryzite Engineering Blog',
    url: 'https://ryzite.com/blog',
    blogPost: INITIAL_BLOGS.map((b) => ({
      '@type': 'BlogPosting',
      headline: b.title,
      description: b.excerpt,
      datePublished: b.publishedAt,
      url: `https://ryzite.com/blog/${b.slug}`,
      author: {
        '@type': 'Person',
        name: b.author?.name || 'Ryzite Technical Lead',
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar services={INITIAL_SERVICES} activeSection="blog" />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Breadcrumbs items={[{ label: 'Blog' }]} />

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2FF] border border-[#0052FF]/20 text-[#0052FF] text-xs font-bold uppercase tracking-wider">
              INSIGHTS & PERSPECTIVES
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] font-display">
              Ryzite <span className="text-[#0052FF]">Engineering Blog</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Deep technical breakdowns into AI-first software architecture, Answer Engine Optimization (AEO), and zero-downtime microservices.
            </p>
          </div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INITIAL_BLOGS.map((blog) => (
              <article
                key={blog.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-[#0052FF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <Link href={`/blog/${blog.slug}`} className="relative aspect-video overflow-hidden block bg-slate-900">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-white text-[#0052FF] text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                      {blog.category}
                    </span>
                  </Link>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {blog.publishedAt}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-[#0F172A] group-hover:text-[#0052FF] transition-colors leading-snug font-display">
                      <Link href={`/blog/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-2 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <img
                      src={blog.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                      alt={blog.author?.name || 'Ryzite Technical Lead'}
                      className="w-8 h-8 rounded-full object-cover border border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700">{blog.author?.name || 'Ryzite Technical Lead'}</span>
                  </div>

                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-xs font-bold text-[#0052FF] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </main>

      <Footer services={INITIAL_SERVICES} />
    </div>
  );
}
