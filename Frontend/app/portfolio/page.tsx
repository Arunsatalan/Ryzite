import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinalCTA } from '@/components/cta/FinalCTA';
import { INITIAL_SERVICES } from '@/data/initialData';
import { ArrowRight, Check, ExternalLink, Sparkles, FolderKanban } from 'lucide-react';
import { api } from '@/lib/api';
import { ProjectItem } from '@/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await api.getSeo('portfolio').catch(() => null);
    const title = seo?.title || 'Verified Client Case Studies & Impact Metrics | Ryzite';
    const description = seo?.description || 'Browse production benchmarks, cloud migrations, and AI agents engineered for scale-ups and enterprises.';
    const canonical = seo?.canonicalUrl || 'https://ryzite.com/portfolio';
    const ogImage = seo?.ogImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop';

    return {
      title,
      description,
      alternates: { canonical },
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
      title: 'Verified Client Case Studies & Impact Metrics | Ryzite',
      description: 'Browse production benchmarks, cloud migrations, and AI agents engineered for scale-ups and enterprises.',
    };
  }
}

export default async function PortfolioPage() {
  let projects: ProjectItem[] = [];
  try {
    const res = await api.getProjects();
    if (Array.isArray(res)) {
      projects = res;
    }
  } catch (err) {
    console.warn('[PORTFOLIO PAGE] Failed to fetch dynamic projects from API:', err);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Ryzite Software Case Studies & Portfolio',
    itemListElement: projects.map((proj, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'CreativeWork',
        name: proj.title,
        description: proj.shortDescription || proj.description || '',
        url: `https://ryzite.com/portfolio/${proj.slug}`,
      },
    })),
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
          
          <Breadcrumbs items={[{ label: 'Portfolio' }]} />

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2FF] border border-[#0052FF]/20 text-[#0052FF] text-xs font-bold uppercase tracking-wider">
              PROVEN RESULTS & METRICS
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] font-display">
              Portfolio & <span className="text-[#0052FF]">Case Studies</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Real-world software engineering outcomes, sub-100ms latency metrics, and scalable architectures deployed for enterprise clients.
            </p>
          </div>

          {/* Case Studies Grid */}
          {projects.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-slate-50 rounded-3xl border border-slate-200">
              <FolderKanban className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="text-lg font-bold text-slate-700">No Published Case Studies</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                All client case studies are managed in real-time from the Admin CMS Dashboard.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-slate-50 hover:bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 hover:border-[#0052FF] shadow-sm hover:shadow-xl transition-all duration-300 grid lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-100/70 text-[#0052FF] text-xs font-bold rounded-full">
                        {project.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        Client: {project.clientName || project.client || 'Enterprise Partner'}
                      </span>
                    </div>

                    <h2 className="text-3xl font-black text-[#0F172A] group-hover:text-[#0052FF] transition-colors font-display">
                      <Link href={`/portfolio/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h2>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {project.shortDescription || project.description}
                    </p>

                    {/* Key Metrics Row */}
                    {project.metrics && project.metrics.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-slate-200">
                        {project.metrics.slice(0, 3).map((m, mIdx) => (
                          <div key={mIdx} className="text-center">
                            <div className="text-xs text-slate-400 font-medium truncate">{m.label}</div>
                            <div className="text-base font-extrabold text-[#0052FF]">{m.value}</div>
                            {m.trend && <div className="text-[10px] font-bold text-emerald-600">{m.trend}</div>}
                          </div>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#0052FF] hover:bg-[#0040cc] text-white text-xs sm:text-sm font-bold rounded-full shadow-md shadow-blue-500/20 transition-all"
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900 border border-slate-700">
                    <img
                      src={project.heroImage}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-bold">
                      <span>{project.clientName || project.client || 'Enterprise Partner'}</span>
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center gap-1"
                      >
                        <span>Explore</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Final CTA Engine Banner */}
          <FinalCTA pageType="portfolio" />

        </div>
      </main>

      <Footer services={INITIAL_SERVICES} />
    </div>
  );
}
