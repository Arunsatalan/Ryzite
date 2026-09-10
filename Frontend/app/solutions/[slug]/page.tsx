import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { INITIAL_SOLUTIONS, INITIAL_SERVICES, getSolutionBySlug, getProjectBySlug } from '@/data/initialData';
import { ArrowRight, CheckCircle2, Cpu, Monitor, Smartphone, Cloud, ShieldCheck, Sparkles, Layers, Terminal } from 'lucide-react';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return INITIAL_SOLUTIONS.map((solution) => ({
    slug: solution.slug,
  }));
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    return {
      title: 'Solution Not Found | Ryzite',
    };
  }

  return {
    title: solution.metaTitle,
    description: solution.metaDescription,
    alternates: {
      canonical: `https://ryzite.com/solutions/${slug}`,
    },
    openGraph: {
      title: solution.metaTitle,
      description: solution.metaDescription,
      url: `https://ryzite.com/solutions/${slug}`,
      siteName: 'Ryzite',
      images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'],
    },
    twitter: {
      card: 'summary_large_image',
      title: solution.metaTitle,
      description: solution.metaDescription,
    },
  };
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    notFound();
  }

  const relatedProject = solution.relatedCaseStudySlug 
    ? getProjectBySlug(solution.relatedCaseStudySlug) 
    : undefined;

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
    '@type': 'Service',
    name: solution.title,
    serviceType: solution.category,
    description: solution.fullDescription,
    provider: {
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
      <Navbar services={INITIAL_SERVICES} activeSection="solutions" />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Breadcrumbs
            items={[
              { label: 'Solutions', url: '/solutions' },
              { label: solution.title },
            ]}
          />

          {/* Hero Section */}
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-16 pb-12 border-b border-slate-200">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                  {getIcon(solution.iconName)}
                </div>
                <span className="text-xs font-bold text-[#0052FF] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  {solution.category}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] font-display">
                {solution.title}
              </h1>
              <p className="text-xl text-slate-700 font-medium leading-relaxed">
                {solution.subtitle}
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                {solution.fullDescription}
              </p>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-8 rounded-3xl text-white shadow-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise Architecture</span>
              </div>
              <h3 className="text-2xl font-bold font-display">Deploy {solution.title}</h3>
              <p className="text-sm text-slate-300">
                Receive an end-to-end architecture blueprint, cost projection, and technical scope estimate for your enterprise.
              </p>
              <Link
                href="/#contact"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#0052FF] hover:bg-[#0040cc] text-white font-bold text-sm rounded-full shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>Request Custom Architecture Blueprint</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Benefits & Features Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-blue-50/70 p-8 rounded-3xl border border-blue-100 space-y-6">
              <h2 className="text-2xl font-bold text-[#0F172A] font-display flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#0052FF]" />
                <span>Key Measurable Outcomes</span>
              </h2>
              <div className="space-y-4">
                {solution.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#0052FF] shrink-0 mt-0.5" />
                    <span className="font-semibold">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
              <h2 className="text-2xl font-bold text-[#0F172A] font-display flex items-center gap-2">
                <Layers className="w-6 h-6 text-[#0052FF]" />
                <span>Technical Specifications & Features</span>
              </h2>
              <div className="space-y-4">
                {solution.features.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#0052FF] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Architecture Highlights & Use Cases */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="p-8 rounded-3xl bg-[#0F172A] text-white space-y-6">
              <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                <Terminal className="w-6 h-6 text-cyan-400" />
                <span>Architecture Highlights</span>
              </h2>
              <div className="space-y-3">
                {solution.architectureHighlights.map((arch, idx) => (
                  <div key={idx} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs sm:text-sm text-cyan-200 font-mono">
                    &gt; {arch}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-100 border border-slate-200 space-y-6">
              <h2 className="text-2xl font-bold text-[#0F172A] font-display">Target Enterprise Use Cases</h2>
              <div className="space-y-3">
                {solution.useCases.map((uc, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 font-medium shadow-sm">
                    • {uc}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Case Study */}
          {relatedProject && (
            <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#0052FF] uppercase tracking-wider">PROVEN CASE STUDY</div>
                <h3 className="text-xl font-bold text-[#0F172A]">{relatedProject.title} — {relatedProject.client}</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl">{relatedProject.description}</p>
              </div>
              <Link
                href={`/portfolio/${relatedProject.slug}`}
                className="px-6 py-3 bg-[#0052FF] hover:bg-[#0040cc] text-white font-bold text-xs sm:text-sm rounded-full shadow-md shrink-0 inline-flex items-center gap-2"
              >
                <span>Read Full Case Study</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

        </div>
      </main>

      <Footer services={INITIAL_SERVICES} />
    </div>
  );
}
