import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinalCTA } from '@/components/cta/FinalCTA';
import { INITIAL_SERVICES, getServiceBySlug } from '@/data/initialData';
import { ArrowRight, CheckCircle2, Clock, DollarSign, Layers, ShieldCheck, Sparkles, Monitor, Smartphone, Cpu, Cloud } from 'lucide-react';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return INITIAL_SERVICES.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: 'Service Not Found | Ryzite',
    };
  }

  return {
    title: `${service.title} Services | Ryzite`,
    description: service.shortDescription + ' ' + service.fullDescription.slice(0, 120),
    alternates: {
      canonical: `https://ryzite.com/services/${slug}`,
    },
    openGraph: {
      title: `${service.title} Services | Ryzite`,
      description: service.shortDescription,
      url: `https://ryzite.com/services/${slug}`,
      siteName: 'Ryzite',
      images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} Services | Ryzite`,
      description: service.shortDescription,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

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
    name: service.title,
    serviceType: service.category,
    description: service.fullDescription,
    provider: {
      '@type': 'Organization',
      name: 'Ryzite',
      url: 'https://ryzite.com',
    },
    offers: {
      '@type': 'Offer',
      price: service.startingPrice.replace(/[^0-9]/g, ''),
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar services={INITIAL_SERVICES} activeSection="services" />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Breadcrumbs
            items={[
              { label: 'Services', url: '/services' },
              { label: service.title },
            ]}
          />

          {/* Service Hero Section */}
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-16 pb-12 border-b border-slate-200">
            <div className="lg:col-span-7 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                {getIcon(service.iconName)}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] font-display">
                {service.title}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                {service.fullDescription}
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock className="w-4 h-4 text-[#0052FF]" />
                  <span>Timeline: {service.timeline}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <DollarSign className="w-4 h-4 text-[#0052FF]" />
                  <span>Starting from {service.startingPrice}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 p-8 rounded-3xl border border-blue-200 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-[#0F172A] font-display">Ready to Kick Off?</h3>
              <p className="text-sm text-slate-600">
                Book a 1-on-1 technical discovery call with our principal architect to outline your scope and architecture blueprint.
              </p>
              <Link
                href="/#contact"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#0052FF] hover:bg-[#0040cc] text-white font-bold text-sm rounded-full shadow-lg shadow-blue-500/25 transition-all"
              >
                <span>Book Consultation for {service.title}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Deep Details Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            
            {/* Features */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
              <h2 className="text-2xl font-bold text-[#0F172A] font-display flex items-center gap-2">
                <Layers className="w-6 h-6 text-[#0052FF]" />
                <span>Core Capabilities & Features</span>
              </h2>
              <div className="space-y-4">
                {(service.features || []).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#0052FF] shrink-0 mt-0.5" />
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
              <h2 className="text-2xl font-bold text-[#0F172A] font-display flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#0052FF]" />
                <span>Guaranteed Deliverables</span>
              </h2>
              <div className="space-y-4">
                {(service.deliverables || []).map((deliv, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#0052FF] shrink-0 mt-0.5" />
                    <span className="font-medium">{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Tech Stack */}
          <div className="p-8 rounded-3xl bg-[#0F172A] text-white space-y-6">
            <h2 className="text-2xl font-bold font-display">Technology & Framework Stack</h2>
            <div className="flex flex-wrap gap-2.5">
              {(service.techStack || []).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-slate-800 text-cyan-300 font-bold text-xs rounded-xl border border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Final CTA Engine Banner */}
          <FinalCTA pageType="service" pageId={service.slug} serviceName={service.title} className="mt-16" />

        </div>
      </main>

      <Footer services={INITIAL_SERVICES} />
    </div>
  );
}
