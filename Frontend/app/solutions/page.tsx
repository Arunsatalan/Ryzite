import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { INITIAL_SOLUTIONS, INITIAL_SERVICES } from '@/data/initialData';
import { ArrowRight, CheckCircle2, Monitor, Cpu, Smartphone, Cloud, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import { api } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await api.getSeo('solutions').catch(() => null);
    const title = seo?.title || 'Bespoke Enterprise Solutions & AI Workflows | Ryzite';
    const description = seo?.description || 'Tailored digital transformation blueprints and high-throughput software architecture solutions.';
    const canonical = seo?.canonicalUrl || 'https://ryzite.com/solutions';
    const ogImage = seo?.ogImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop';

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
      title: 'Bespoke Enterprise Solutions & AI Workflows | Ryzite',
      description: 'Tailored digital transformation blueprints and high-throughput software architecture solutions.',
    };
  }
}

export default function SolutionsPage() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor': return <Monitor className="w-8 h-8 text-[#0052FF]" />;
      case 'Smartphone': return <Smartphone className="w-8 h-8 text-[#0052FF]" />;
      case 'Cpu': return <Cpu className="w-8 h-8 text-[#0052FF]" />;
      case 'Cloud': return <Cloud className="w-8 h-8 text-[#0052FF]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-8 h-8 text-[#0052FF]" />;
      default: return <Sparkles className="w-8 h-8 text-[#0052FF]" />;
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Ryzite Enterprise Technical Solutions',
    itemListElement: INITIAL_SOLUTIONS.map((sol, idx) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: sol.title,
        description: sol.description,
        url: `https://ryzite.com/solutions/${sol.slug}`,
      },
      position: idx + 1,
    })),
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar services={INITIAL_SERVICES} activeSection="solutions" />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Breadcrumbs items={[{ label: 'Solutions' }]} />

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2FF] border border-[#0052FF]/20 text-[#0052FF] text-xs font-bold uppercase tracking-wider">
              ENTERPRISE BLUEPRINTS
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] font-display">
              Enterprise Technical <span className="text-[#0052FF]">Solutions</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Custom-engineered solution frameworks for scaling SaaS applications, AI agent automation, cloud infrastructure, and mobile ecosystems.
            </p>
          </div>

          {/* Solutions List */}
          <div className="space-y-8">
            {INITIAL_SOLUTIONS.map((solution, idx) => (
              <div
                key={solution.id}
                className="group bg-slate-50 hover:bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 hover:border-[#0052FF] shadow-sm hover:shadow-xl transition-all duration-300 grid lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100/60 flex items-center justify-center">
                      {getIcon(solution.iconName)}
                    </div>
                    <span className="text-xs font-bold text-[#0052FF] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      {solution.category}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] group-hover:text-[#0052FF] transition-colors font-display">
                    <Link href={`/solutions/${solution.slug}`}>
                      {solution.title}
                    </Link>
                  </h2>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                    {solution.subtitle}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-2 pt-2">
                    {solution.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#0052FF] shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-8">
                  <div className="flex flex-wrap gap-1.5">
                    {solution.techStack.slice(0, 3).map((tech, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/solutions/${solution.slug}`}
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0052FF] hover:bg-[#0040cc] text-white text-xs sm:text-sm font-bold rounded-full shadow-md shadow-blue-500/20 transition-all"
                  >
                    <span>Explore Solution</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer services={INITIAL_SERVICES} />
    </div>
  );
}
