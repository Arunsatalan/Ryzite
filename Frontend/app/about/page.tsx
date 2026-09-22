import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinalCTA } from '@/components/cta/FinalCTA';
import { INITIAL_SERVICES } from '@/data/initialData';
import {
  ArrowRight,
  Cpu,
  GitBranch,
  Lock,
  Users,
  CheckCircle2,
  ShieldCheck,
  Award,
  Zap,
  Building2,
  Sparkles,
  Code,
  Rocket,
  Layers,
  MessageSquare,
  TrendingUp,
  Globe,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface PageProps {
  searchParams?: Promise<{ preview?: string }>;
}

async function getAboutData(isPreview: boolean = false) {
  try {
    const endpoint = isPreview ? `${API_URL}/api/about/preview` : `${API_URL}/api/about`;
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json : null;
  } catch (err) {
    console.error('Error fetching About page data on server:', err);
    return null;
  }
}

async function getTeamData() {
  try {
    const res = await fetch(`${API_URL}/api/team`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error('Error fetching Team page data on server:', err);
    return [];
  }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const isPreview = searchParams?.preview === 'true';
  const data = await getAboutData(isPreview);
  const page = data?.data?.page;

  if (isPreview) {
    return {
      title: '[PREVIEW DRAFT] About Ryzite',
      description: 'Draft preview of Ryzite About page.',
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const title = page?.metaTitle || 'About Ryzite | Software Engineering & AI Agency';
  const description = page?.metaDescription || 'Learn about Ryzite engineering philosophy, core leadership team, technical delivery pillars, and verified company facts.';
  const canonical = page?.canonicalUrl || 'https://ryzite.com/about';
  const ogImage = page?.ogImageUrl || page?.heroImageUrl || 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=85&w=1200&auto=format&fit=crop';

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Ryzite',
      images: [{ url: ogImage, width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    },
    robots: {
      index: page?.robotsIndex ?? true,
      follow: page?.robotsFollow ?? true
    }
  };
}

export default async function AboutPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const isPreview = searchParams?.preview === 'true';
  const rawData = await getAboutData(isPreview);
  const data = rawData?.data;

  const page = data?.page || {
    heroLabel: 'ABOUT RYZITE',
    heroTitle: 'Engineering Precision Meets Product Mastery',
    heroDescription: 'Ryzite was founded by veteran Principal Software Architects with a singular mission: to eliminate friction, technical debt, and delays by delivering high-velocity, production-grade digital products.',
    heroImageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=85&w=1200&auto=format&fit=crop',
    heroImageAlt: 'Ryzite Engineering Studio',
    heroCtaText: 'Book Discovery Session',
    heroCtaUrl: '/#contact',

    introTitle: 'Building Software Systems That Scale Without Compromise',
    introShort: 'Ryzite is an enterprise-grade digital software development agency specializing in full-stack web portals, custom AI agentic automation, and zero-downtime cloud architecture.',
    introFull: 'We partner directly with founders, CTOs, and product leaders to build clean, maintainable, and high-performance software applications.',

    whoWeAreTitle: 'Senior Engineering Leadership',
    whoWeAreDescription: 'No middle account-manager layers. You collaborate directly with senior software architects and tech leads who take hands-on ownership of your product.',

    missionTitle: 'Our Mission',
    missionDescription: 'To empower forward-thinking enterprises with reliable, high-performance, and AI-first software solutions built on clean architecture.',

    visionTitle: 'Our Vision',
    visionDescription: 'To set the gold standard for global software agency delivery by replacing traditional friction with direct senior technical leadership.',

    ctaTitle: 'Ready to Build With Senior Architects?',
    ctaDescription: 'Skip the generic agency pitch. Talk code, architecture, and timeline directly with our engineering team.',
    ctaButtonText: 'Start a Project',
    ctaButtonUrl: '/#contact'
  };

  const highlights = data?.highlights || [
    { title: 'Sub-100ms Performance First', description: 'We architect every database query to render with sub-100ms Core Web Vitals.', icon: 'Cpu' },
    { title: 'Automated CI/CD & Testing', description: 'Every commit runs through automated linting, unit tests, and integration pipelines.', icon: 'GitBranch' },
    { title: 'Enterprise Security by Default', description: 'SOC2 compliant encryption, role-based access control, and sanitization guardrails.', icon: 'Lock' },
    { title: 'Senior Architect Direct Access', description: 'No middle account managers. Collaborate directly with senior full-stack architects.', icon: 'Users' }
  ];

  const capabilities = data?.capabilities || [
    { title: 'Custom Web Application Architecture', description: 'High-throughput Next.js & Node.js backend systems built for enterprise reliability.', icon: 'Code' },
    { title: 'Enterprise AI & Workflow Automation', description: 'Autonomous LLM agents, RAG document pipelines, and custom workflow bots.', icon: 'Sparkles' },
    { title: 'Cross-Platform Mobile Engineering', description: 'Native-feel iOS and Android mobile solutions with real-time push sync.', icon: 'Rocket' },
    { title: 'Cloud Infrastructure & DevOps', description: 'Zero-downtime Kubernetes deployments, Terraform IaC, and AWS/GCP optimization.', icon: 'Layers' }
  ];

  const values = data?.values || [
    { title: 'Engineering Quality First', description: 'We write clean, documented, and tested code that scales long after deployment.', icon: 'ShieldCheck' },
    { title: 'Transparent Communication', description: 'Clear 2-week agile sprints with direct code visibility and honest status updates.', icon: 'MessageSquare' },
    { title: 'Business Impact Focus', description: 'We measure success by performance benchmarks, user conversion, and business ROI.', icon: 'TrendingUp' },
    { title: 'Continuous Innovation', description: 'Leveraging modern LLM frameworks, vector search, and edge computing to stay ahead.', icon: 'Zap' }
  ];

  const apiTeam = await getTeamData();
  const team = apiTeam.length > 0 ? apiTeam : (data?.teamMembers || []);

  const timeline = data?.timeline || [
    { year: '2022', title: 'Ryzite Founded', description: 'Established in San Francisco by veteran Principal Solutions Architects.' },
    { year: '2023', title: 'Enterprise AI Practice Launched', description: 'Built dedicated RAG vector pipelines and LLM automation practice.' },
    { year: '2024', title: '25+ Production Applications', description: 'Surpassed 25 production deployments across North America and Europe.' },
    { year: '2026', title: 'AEO Entity Knowledge Hub', description: 'Built authoritative AEO Knowledge Hub for Perplexity & AI Search Engine citations.' }
  ];

  const statistics = data?.statistics || [];
  const trustedClients = data?.trustedClients || [];
  const whyChooseUs = data?.whyChooseUs || [];
  const faqs = data?.faqs || [];

  const teamPersonSchemas = team.map((t: any) => {
    const slug = (t.name || 'member').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const sameAs: string[] = [];
    if (t.linkedInUrl) sameAs.push(t.linkedInUrl);
    if (t.githubUrl) sameAs.push(t.githubUrl);

    return {
      '@type': 'Person',
      '@id': `https://ryzite.com/about#person-${slug}`,
      'name': t.name,
      'jobTitle': t.jobTitle || t.role || 'Software Architect',
      'description': t.shortBio || '',
      'image': t.profileImage?.url || t.photoUrl || t.imageUrl || '',
      'worksFor': {
        '@type': 'Organization',
        '@id': 'https://ryzite.com/#organization',
        'name': 'Ryzite Global Software Inc.',
        'url': 'https://ryzite.com'
      },
      'sameAs': sameAs.length > 0 ? sameAs : undefined
    };
  });

  // DYNAMIC JSON-LD STRUCTURED DATA
  const jsonLdWebPage = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${page.canonicalUrl || 'https://ryzite.com/about'}#webpage`,
        'url': page.canonicalUrl || 'https://ryzite.com/about',
        'name': page.metaTitle || 'About Ryzite',
        'description': page.metaDescription,
        'isPartOf': {
          '@type': 'WebSite',
          '@id': 'https://ryzite.com/#website',
          'url': 'https://ryzite.com',
          'name': 'Ryzite'
        },
        'about': {
          '@type': 'Organization',
          '@id': 'https://ryzite.com/#organization',
          'name': 'Ryzite Global Software Inc.',
          'url': 'https://ryzite.com',
          'logo': 'https://ryzite.com/assets/logo.png',
          'foundingDate': '2022-01-01',
          'sameAs': [
            'https://github.com/ryzite',
            'https://linkedin.com/company/ryzite',
            'https://twitter.com/ryzite'
          ]
        }
      },
      ...teamPersonSchemas,
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://ryzite.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'About Us',
            'item': page.canonicalUrl || 'https://ryzite.com/about'
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col font-sans">
      {/* PREVIEW DRAFT WARNING BANNER */}
      {isPreview && (
        <div className="bg-amber-500 text-slate-950 font-bold text-center py-2.5 px-4 text-xs tracking-wider sticky top-0 z-50 flex items-center justify-center gap-2 border-b border-amber-600 shadow-md">
          <Sparkles size={16} />
          <span>PREVIEW MODE — Viewing Unpublished Draft Content (Robots: noindex, nofollow)</span>
        </div>
      )}

      {/* JSON-LD INJECTION */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />

      <Navbar services={INITIAL_SERVICES} activeSection="about" />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

          <Breadcrumbs items={[{ label: 'About Us' }]} />

          {/* HERO SECTION */}
          <div className="grid lg:grid-cols-12 gap-12 items-center pb-16 border-b border-slate-200">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2FF] border border-[#0052FF]/20 text-[#0052FF] text-xs font-bold uppercase tracking-wider">
                {page.heroLabel}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-[#0F172A] font-display leading-[1.05]">
                {page.heroTitle}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                {page.heroDescription}
              </p>
              {page.heroCtaText && (
                <Link
                  href={page.heroCtaUrl || '/#contact'}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0052FF] hover:bg-[#0040cc] text-white font-bold text-sm rounded-full transition-all shadow-lg shadow-blue-600/30"
                >
                  <span>{page.heroCtaText}</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>

            <div className="lg:col-span-5 relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src={page.heroImageUrl || 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=85&w=800&auto=format&fit=crop'}
                alt={page.heroImageAlt || 'Ryzite Engineering Studio'}
                className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white space-y-1">
                <div className="text-xl font-bold font-display">Ryzite Engineering Labs</div>
                <div className="text-xs text-blue-200">San Francisco, CA • Global Enterprise Delivery</div>
              </div>
            </div>
          </div>

          {/* COMPANY INTRODUCTION */}
          <div className="max-w-4xl mx-auto space-y-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] font-display">
              {page.introTitle}
            </h2>
            <p className="text-base sm:text-lg text-[#0052FF] font-semibold leading-relaxed">
              {page.introShort}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl mx-auto">
              {page.introFull}
            </p>
          </div>

          {/* HIGHLIGHT PILLARS */}
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] font-display">
                {page.whoWeAreTitle}
              </h2>
              <p className="text-sm text-slate-600">{page.whoWeAreDescription}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((p: any, idx: number) => (
                <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#0052FF] transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-blue-100/60 text-[#0052FF]">
                      <Cpu size={22} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 font-mono">0{idx + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] font-display">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CAPABILITIES / SERVICES LINKAGE */}
          {page.showCapabilities && capabilities.length > 0 && (
            <div className="space-y-10 pt-10 border-t border-slate-200">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] font-display">
                  Core Engineering Capabilities
                </h2>
                <p className="text-sm text-slate-600">Enterprise development capabilities backed by our active Services CMS.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {capabilities.map((cap: any, idx: number) => (
                  <div key={idx} className="p-8 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-[#0F172A] font-display">{cap.title}</h3>
                      <Link href="/services" className="text-xs font-bold text-[#0052FF] hover:underline flex items-center gap-1">
                        Explore Service <ArrowRight size={14} />
                      </Link>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{cap.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MISSION & VISION */}
          <div className="grid md:grid-cols-2 gap-8 pt-10 border-t border-slate-200">
            <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100 space-y-4">
              <div className="p-3 bg-[#0052FF] text-white w-fit rounded-2xl font-bold text-xs uppercase tracking-wider">
                OUR MISSION
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A] font-display">{page.missionTitle}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{page.missionDescription}</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4">
              <div className="p-3 bg-blue-500/20 text-blue-300 w-fit rounded-2xl font-bold text-xs uppercase tracking-wider border border-blue-400/30">
                OUR VISION
              </div>
              <h3 className="text-2xl font-bold text-white font-display">{page.visionTitle}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{page.visionDescription}</p>
            </div>
          </div>

          {/* CORE VALUES */}
          <div className="space-y-10 pt-10 border-t border-slate-200">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] font-display">
                Our Non-Negotiable Values
              </h2>
              <p className="text-sm text-slate-600">The values that guide every pull request, sprint, and client interaction.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v: any, idx: number) => (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 text-left">
                  <div className="p-3 bg-emerald-50 text-emerald-600 w-fit rounded-2xl">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] font-display">{v.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC STATISTICS CMS CONSUMPTION */}
          {page.showStatistics && statistics.length > 0 && (
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white space-y-8 shadow-2xl">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black font-display text-white">Verified Agency Metrics</h3>
                <p className="text-xs text-blue-200/80">Real-time statistics stored in PostgreSQL statistics repository.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                {statistics.map((st: any) => (
                  <div key={st.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                    <div className="text-3xl sm:text-4xl font-black text-blue-400 font-display">
                      {st.prefix}{st.value}{st.suffix}
                    </div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">{st.label}</div>
                    {st.description && <div className="text-[11px] text-slate-400">{st.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DYNAMIC TRUSTED CLIENTS CONSUMPTION */}
          {page.showTrustedClients && trustedClients.length > 0 && (
            <div className="space-y-6 pt-10 border-t border-slate-200">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Trusted By Industry Leaders</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 py-4 opacity-80">
                {trustedClients.map((client: any) => (
                  <div key={client.id} className="text-sm font-bold text-slate-700 hover:text-[#0052FF] transition-colors">
                    {client.companyName || client.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TECHNICAL LEADERSHIP TEAM */}
          {page.showTeam !== false && team.length > 0 && (
            <div className="space-y-10 pt-10 border-t border-slate-200">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] font-display">
                  Technical Leadership Team
                </h2>
                <p className="text-sm text-slate-600">Senior software architects taking direct hands-on ownership of your codebase.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {team.map((t: any, idx: number) => {
                  const imageUrl = t.profileImage?.url || t.photoUrl || t.imageUrl || '';
                  const imageAlt = t.profileImage?.alt || `${t.name} - ${t.jobTitle || t.role || 'Software Architect'}`;
                  const title = t.jobTitle || t.role || 'Software Architect';
                  const techList = t.expertiseTech || t.expertise || [];

                  return (
                    <div key={t.id || idx} className="p-6 rounded-3xl bg-white border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all space-y-5 text-left flex flex-col justify-between">
                      <div className="space-y-4">
                        {imageUrl ? (
                          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 shadow-xs relative group">
                            <img 
                              src={imageUrl} 
                              alt={imageAlt} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                            />
                          </div>
                        ) : (
                          <div className="aspect-square w-full rounded-2xl bg-blue-50 text-[#0052FF] font-black text-4xl flex items-center justify-center border border-blue-100">
                            {t.name?.charAt(0) || 'T'}
                          </div>
                        )}
                        
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-[#0F172A] font-display">{t.name}</h3>
                          <div className="text-xs font-bold text-[#0052FF]">{title}</div>
                        </div>

                        {t.shortBio && (
                          <p className="text-xs text-slate-600 leading-relaxed">{t.shortBio}</p>
                        )}

                        {techList.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {techList.map((tech: string, i: number) => (
                              <span key={i} className="text-[11px] font-semibold text-[#0052FF] bg-blue-50 border border-blue-100/80 px-2.5 py-0.5 rounded-full">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center gap-4">
                        {t.linkedInUrl && (
                          <a 
                            href={t.linkedInUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs font-bold text-[#0052FF] hover:underline inline-flex items-center gap-1"
                          >
                            <span>LinkedIn</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                        {t.githubUrl && (
                          <a 
                            href={t.githubUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline inline-flex items-center gap-1"
                          >
                            <span>GitHub</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* COMPANY TIMELINE */}
          {page.showTimeline && timeline.length > 0 && (
            <div className="space-y-10 pt-10 border-t border-slate-200">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] font-display">
                  Company Milestones & Timeline
                </h2>
                <p className="text-sm text-slate-600">Key achievements in our engineering evolution.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {timeline.map((item: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="px-3 py-1 bg-blue-100 text-[#0052FF] font-bold text-xs rounded-full">{item.year}</span>
                    <h3 className="text-lg font-bold text-[#0F172A] font-display">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DYNAMIC FAQS CONSUMPTION */}
          {page.showFaqs && faqs.length > 0 && (
            <div className="space-y-8 pt-10 border-t border-slate-200">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] font-display">Frequently Asked Questions</h2>
                <p className="text-sm text-slate-600">Verified answers regarding Ryzite engineering model and services.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {faqs.map((faq: any) => (
                  <div key={faq.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 className="text-base font-bold text-[#0F172A]">{faq.question}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.shortAnswer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final CTA Engine Banner */}
          <FinalCTA pageType="about" />

        </div>
      </main>

      <Footer services={INITIAL_SERVICES} />
    </div>
  );
}
