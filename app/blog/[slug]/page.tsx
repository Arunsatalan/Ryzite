import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../../../src/components/Navbar';
import { Footer } from '../../../src/components/Footer';
import { Breadcrumbs } from '../../../src/components/Breadcrumbs';
import { INITIAL_BLOGS, INITIAL_SERVICES, getBlogBySlug } from '../../../src/data/initialData';
import { ArrowRight, Calendar, Clock, Sparkles, Tag, User } from 'lucide-react';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return INITIAL_BLOGS.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Article Not Found | Ryzite',
    };
  }

  return {
    title: blog.metaTitle || `${blog.title} | Ryzite`,
    description: blog.metaDescription || blog.excerpt,
    alternates: {
      canonical: `https://ryzite.com/blog/${slug}`,
    },
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      url: `https://ryzite.com/blog/${slug}`,
      siteName: 'Ryzite',
      type: 'article',
      publishedTime: blog.publishedAt,
      authors: [blog.author.name],
      images: [blog.coverImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: [blog.coverImage],
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage,
    datePublished: blog.publishedAt,
    author: {
      '@type': 'Person',
      name: blog.author.name,
      jobTitle: blog.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ryzite',
      url: 'https://ryzite.com',
    },
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar services={INITIAL_SERVICES} activeSection="blog" />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Breadcrumbs
            items={[
              { label: 'Blog', url: '/blog' },
              { label: blog.title },
            ]}
          />

          {/* Article Header */}
          <div className="space-y-6 mb-10 text-left">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 bg-blue-50 text-[#0052FF] text-xs font-bold rounded-full border border-blue-200">
                {blog.category}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {blog.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0F172A] font-display leading-[1.1]">
              {blog.title}
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed font-normal">
              {blog.excerpt}
            </p>

            <div className="flex items-center gap-4 pt-4 border-t border-b border-slate-100 py-4">
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#0052FF]"
              />
              <div>
                <div className="text-sm font-bold text-[#0F172A]">{blog.author.name}</div>
                <div className="text-xs text-slate-500">{blog.author.role} • Published {blog.publishedAt}</div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-xl border border-slate-200">
            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
          </div>

          {/* AEO Direct Answer Block */}
          {blog.aeoDirectAnswer && (
            <div className="p-6 bg-blue-50/80 rounded-3xl border border-blue-200 mb-12 space-y-2">
              <div className="text-xs font-extrabold text-[#0052FF] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Generative AI Direct Answer Summary</span>
              </div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {blog.aeoDirectAnswer}
              </p>
            </div>
          )}

          {/* Article Content Body */}
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-6 mb-12">
            {blog.content.split('\n\n').map((paragraph, pIdx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h2 key={pIdx} className="text-2xl font-bold text-[#0F172A] pt-4 font-display">
                    {paragraph.replace('### ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n');
                return (
                  <ul key={pIdx} className="space-y-2 list-disc pl-6 text-sm sm:text-base">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={pIdx} className="text-sm sm:text-base leading-relaxed text-slate-700">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="pt-8 border-t border-slate-200 flex flex-wrap gap-2 mb-16">
            {blog.tags.map((tag, tIdx) => (
              <span key={tIdx} className="px-3.5 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0F172A] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-display">Want to Implement These Architectural Patterns?</h3>
              <p className="text-xs sm:text-sm text-slate-300">Schedule a 1-on-1 architecture discovery call with Ryzite senior engineers.</p>
            </div>
            <Link
              href="/#contact"
              className="px-6 py-3 bg-[#0052FF] hover:bg-[#0040cc] text-white text-xs sm:text-sm font-bold rounded-full transition-all shrink-0"
            >
              Book Architecture Discovery
            </Link>
          </div>

        </div>
      </main>

      <Footer services={INITIAL_SERVICES} />
    </div>
  );
}
