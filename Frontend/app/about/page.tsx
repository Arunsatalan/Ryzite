import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { INITIAL_SERVICES } from '@/data/initialData';
import { ArrowRight, Cpu, GitBranch, Lock, Users, CheckCircle2, ShieldCheck, Award, Zap } from 'lucide-react';
import { api } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await api.getSeo('about').catch(() => null);
    const title = seo?.title || 'About Ryzite | Software Engineering & Growth Agency';
    const description = seo?.description || 'Learn about our engineering philosophy, core team expertise, and technical delivery standards.';
    const canonical = seo?.canonicalUrl || 'https://ryzite.com/about';
    const ogImage = seo?.ogImage || 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=85&w=1200&auto=format&fit=crop';

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
      title: 'About Ryzite | Software Engineering & Growth Agency',
      description: 'Learn about our engineering philosophy, core team expertise, and technical delivery standards.',
    };
  }
}

const pillars = [
  {
    number: '01',
    title: 'Sub-100ms Performance First',
    desc: 'We architect every database query, vector index, and frontend bundle to render instantaneously with sub-100ms Core Web Vitals.',
    icon: Cpu,
  },
  {
    number: '02',
    title: 'Automated CI/CD & Testing',
    desc: 'Every commit runs through automated linting, unit tests, and E2E integration pipelines before deployment.',
    icon: GitBranch,
  },
  {
    number: '03',
    title: 'Enterprise Security by Default',
    desc: 'SOC2 compliant encryption at rest and in transit, role-based access control, and sanitization guardrails at every layer.',
    icon: Lock,
  },
  {
    number: '04',
    title: 'Direct Senior Architect Access',
    desc: 'No middle account-manager layers. You collaborate directly with senior full-stack architects and tech leads.',
    icon: Users,
  },
];

const team = [
  {
    name: 'Alex Vance',
    role: 'Principal Solutions Architect',
    bio: '12+ years building high-concurrency SaaS portals, AI vector pipelines, and distributed cloud systems.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  },
  {
    name: 'Sarah Chen',
    role: 'Head of Growth & SEO Architecture',
    bio: 'Pioneer in Answer Engine Optimization (AEO) and structured data schemas for generative AI citations.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
  },
  {
    name: 'Liam Sterling',
    role: 'DevOps & Infrastructure Practice Lead',
    bio: 'Specialist in Kubernetes zero-downtime blue-green deployments, Terraform IaC, and SOC2 compliance.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
  },
];

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ryzite',
    url: 'https://ryzite.com',
    logo: 'https://ryzite.com/assets/logo.png',
    description: 'Ryzite is an elite software development agency specializing in custom full-stack web applications, AI automation, mobile apps, and cloud engineering.',
    founders: team.map(t => ({
      '@type': 'Person',
      name: t.name,
      jobTitle: t.role,
    })),
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar services={INITIAL_SERVICES} activeSection="about" />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Breadcrumbs items={[{ label: 'About Us' }]} />

          {/* Hero Section */}
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-20 pb-16 border-b border-slate-200">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2FF] border border-[#0052FF]/20 text-[#0052FF] text-xs font-bold uppercase tracking-wider">
                WHO WE ARE
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-[#0F172A] font-display leading-[1.05]">
                Engineering Precision Meets <span className="text-[#0052FF]">Product Mastery</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Ryzite was founded by veteran Principal Software Architects with a singular mission: to eliminate the friction, technical debt, and delays of traditional agencies by delivering high-velocity, production-grade digital products.
              </p>
            </div>

            <div className="lg:col-span-5 relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=85&w=800&auto=format&fit=crop"
                alt="Ryzite Engineering Studio"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white space-y-1">
                <div className="text-xl font-bold font-display">Ryzite Engineering Labs</div>
                <div className="text-xs text-blue-200">San Francisco, CA • Global Enterprise Delivery</div>
              </div>
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] font-display">
                Our Core Engineering Pillars
              </h2>
              <p className="text-sm text-slate-600">The non-negotiable architectural standards we enforce across every client repository.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#0052FF] transition-all space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-blue-100/60 text-[#0052FF]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 font-mono">{p.number}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A] font-display">{p.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leadership Team */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] font-display">
                Technical Leadership Team
              </h2>
              <p className="text-sm text-slate-600">Architects who take hands-on ownership of your product.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((t, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 hover:shadow-lg transition-all space-y-4 text-center">
                  <img src={t.avatar} alt={t.name} className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-[#0052FF]" />
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] font-display">{t.name}</h3>
                    <div className="text-xs font-semibold text-[#0052FF] mt-0.5">{t.role}</div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0F172A] text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-black font-display">Ready to Build With Senior Architects?</h3>
              <p className="text-sm text-slate-300">Skip the generic agency pitch. Talk code and architecture directly with our team.</p>
            </div>
            <Link
              href="/#contact"
              className="px-7 py-3.5 bg-[#0052FF] hover:bg-[#0040cc] text-white font-bold text-sm rounded-full transition-all shrink-0 shadow-lg shadow-blue-600/30"
            >
              Book Discovery Session
            </Link>
          </div>

        </div>
      </main>

      <Footer services={INITIAL_SERVICES} />
    </div>
  );
}
