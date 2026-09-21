import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { INITIAL_SERVICES } from '@/data/initialData';
import { ArrowRight, Check, ExternalLink, Quote, Sparkles, TrendingUp, ShieldCheck, Layers } from 'lucide-react';
import { api } from '@/lib/api';

export const revalidate = 0;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const project = await api.getProjectBySlug(slug).catch(() => null);

  if (!project) {
    return {
      title: 'Case Study Not Found | Ryzite',
    };
  }

  const title = project.seoTitle || project.seoMetadata?.metaTitle || `${project.title} Case Study | Ryzite`;
  const description = project.seoDescription || project.seoMetadata?.metaDescription || project.shortDescription || project.description || '';
  const heroImage = project.heroImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71';

  return {
    title,
    description,
    alternates: {
      canonical: `https://ryzite.com/portfolio/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://ryzite.com/portfolio/${slug}`,
      siteName: 'Ryzite',
      images: [heroImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [heroImage],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await api.getProjectBySlug(slug).catch(() => null);

  if (!project) {
    notFound();
  }

  const clientName = project.clientName || project.client || 'Enterprise Partner';
  const fullDesc = project.fullDescription || project.longDescription || project.shortDescription || project.description || '';
  const challenges = project.challenge ? project.challenge.split('\n').filter(Boolean) : (project.challenges || ['Sub-optimal legacy throughput and concurrency bottlenecks.']);
  const solutions = project.solution ? project.solution.split('\n').filter(Boolean) : (project.solutions || ['Custom event-driven microservices architecture deployed to cloud.']);
  const websiteUrl = project.websiteUrl || project.liveUrl || null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: project.title,
    description: fullDesc,
    image: project.heroImage,
    author: {
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
      <Navbar services={INITIAL_SERVICES} activeSection="portfolio" />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Breadcrumbs
            items={[
              { label: 'Portfolio', url: '/portfolio' },
              { label: project.title },
            ]}
          />

          {/* Hero Header */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-50 text-[#0052FF] text-xs font-bold rounded-full border border-blue-200">
                {project.category}
              </span>
              <span className="text-xs font-bold text-slate-400">Client: {clientName}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] font-display">
              {project.title}
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
              {fullDesc}
            </p>

            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0052FF] text-white text-xs font-bold rounded-full hover:bg-[#0040cc] transition-colors"
              >
                <span>Visit Live Platform Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Hero Banner Image */}
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-2xl border border-slate-200">
            <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          </div>

          {/* Metrics Grid */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-blue-50/70 border border-blue-100 text-center space-y-1">
                  <div className="text-xs font-bold text-slate-500 uppercase">{m.label}</div>
                  <div className="text-3xl font-black text-[#0052FF]">{m.value}</div>
                  {m.trend && <div className="text-xs font-bold text-emerald-600">{m.trend} Performance Impact</div>}
                </div>
              ))}
            </div>
          )}

          {/* Challenges vs Solutions */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            
            {/* Challenges */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
              <h2 className="text-2xl font-bold text-[#0F172A] font-display flex items-center gap-2">
                <Layers className="w-6 h-6 text-red-500" />
                <span>Engineering Challenges</span>
              </h2>
              <div className="space-y-4">
                {challenges.map((c, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      !
                    </span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
              <h2 className="text-2xl font-bold text-[#0F172A] font-display flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#0052FF]" />
                <span>Architectural Solutions Deployed</span>
              </h2>
              <div className="space-y-4">
                {solutions.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <Check className="w-5 h-5 text-[#0052FF] shrink-0 mt-0.5" strokeWidth={3} />
                    <span className="font-medium">{s}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Testimonial Quote */}
          {project.testimonial && (
            <div className="p-8 sm:p-12 rounded-3xl bg-[#0F172A] text-white relative overflow-hidden mb-16 space-y-6">
              <Quote className="w-12 h-12 text-[#0052FF] opacity-50" />
              <p className="text-lg sm:text-xl italic text-slate-200 leading-relaxed font-serif">
                "{project.testimonial.quote}"
              </p>
              <div>
                <div className="text-base font-bold text-cyan-300">{project.testimonial.author}</div>
                <div className="text-xs text-slate-400">{project.testimonial.role}</div>
              </div>
            </div>
          )}

          {/* CTA Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0052FF] to-blue-700 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black font-display">Ready for Similar High-Scale Results?</h3>
              <p className="text-sm text-blue-100">Schedule a technical discovery session with Ryzite leadership.</p>
            </div>
            <Link
              href="/#contact"
              className="px-7 py-3.5 bg-white text-[#0052FF] font-bold text-sm rounded-full hover:bg-blue-50 transition-colors shrink-0 shadow-md"
            >
              Book Technical Discovery Call
            </Link>
          </div>

        </div>
      </main>

      <Footer services={INITIAL_SERVICES} />
    </div>
  );
}
