import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { INITIAL_SERVICES } from '@/data/initialData';
import { ArrowRight, CheckCircle2, Monitor, Smartphone, Cpu, Cloud, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await api.getSeo('services').catch(() => null);
    const title = seo?.title || 'Our Engineering Services & Pricing | Ryzite';
    const description = seo?.description || 'Explore our full-stack web development, AI workflow automation, and cloud microservices engineering services.';
    const canonical = seo?.canonicalUrl || 'https://ryzite.com/services';
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
      title: 'Our Engineering Services & Pricing | Ryzite',
      description: 'Explore our full-stack web development, AI workflow automation, and cloud microservices engineering services.',
    };
  }
}

export default function ServicesPage() {
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
    serviceType: 'Software Development & Engineering',
    provider: {
      '@type': 'Organization',
      name: 'Ryzite',
      url: 'https://ryzite.com',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Ryzite Enterprise Services Catalog',
      itemListElement: INITIAL_SERVICES.map((s, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          description: s.shortDescription,
          url: `https://ryzite.com/services/${s.slug}`,
        },
        position: idx + 1,
      })),
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
          
          <Breadcrumbs items={[{ label: 'Services' }]} />

          {/* Page Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2FF] border border-[#0052FF]/20 text-[#0052FF] text-xs font-bold uppercase tracking-wider">
              END-TO-END SOFTWARE SOLUTIONS
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] font-display">
              High-Performance <span className="text-[#0052FF]">Engineering Services</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              We design, build, and deploy custom software products engineered for extreme scale, security, and measurable business growth.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INITIAL_SERVICES.map((service) => (
              <div
                key={service.id}
                className="group bg-white rounded-3xl p-8 border border-slate-200 hover:border-[#0052FF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 group-hover:bg-[#0052FF] group-hover:text-white transition-colors flex items-center justify-center mb-6">
                    <div className="group-hover:[&>svg]:text-white transition-colors">
                      {getIcon(service.iconName)}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-[#0F172A] group-hover:text-[#0052FF] transition-colors font-display mb-3">
                    <Link href={`/services/${service.slug}`}>
                      {service.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Capabilities</div>
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#0052FF] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold uppercase">Starting From</div>
                    <div className="text-base font-extrabold text-[#0F172A]">{service.startingPrice}</div>
                  </div>

                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0052FF] hover:bg-[#0040cc] text-white text-xs font-bold rounded-full shadow-md shadow-blue-500/20 transition-all"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0052FF] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-black font-display">Need a Specialized Enterprise Pod?</h3>
              <p className="text-sm text-slate-300">Our senior architects will assemble a dedicated pod tailored to your tech stack and SLA needs.</p>
            </div>
            <Link
              href="/"
              className="px-7 py-3.5 bg-white text-[#0052FF] font-bold text-sm rounded-full hover:bg-blue-50 transition-colors shrink-0 shadow-lg"
            >
              Request Custom Proposal
            </Link>
          </div>

        </div>
      </main>

      <Footer services={INITIAL_SERVICES} />
    </div>
  );
}
