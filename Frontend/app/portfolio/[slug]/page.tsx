import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { INITIAL_SERVICES } from '@/data/initialData';
import { ArrowRight, Check, ExternalLink, Quote, Sparkles, TrendingUp, ShieldCheck, Layers, Code, Github, Terminal, ArrowUpRight, CheckCircle2, Image as ImageIcon } from 'lucide-react';
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

  // Fetch published projects for related case studies
  let allProjects: any[] = [];
  try {
    const res = await api.getProjects();
    if (Array.isArray(res)) {
      allProjects = res.filter(p => p.slug !== slug).slice(0, 2);
    }
  } catch (err) {
    console.warn('Failed to fetch related projects:', err);
  }

  const clientName = project.clientName || project.client || 'Enterprise Partner';
  const subtitle = project.subtitle || project.heroTitle || '';
  const fullDesc = project.fullDescription || project.longDescription || project.shortDescription || project.description || '';
  const websiteUrl = project.websiteUrl || project.liveUrl || null;
  const githubUrl = project.githubUrl || null;

  // Challenges, Solutions, Results, Tech Stack, Gallery
  const challengesList = project.challengesList && project.challengesList.length > 0
    ? project.challengesList
    : (project.challenge ? [{ title: 'System Bottleneck', description: project.challenge }] : []);

  const solutionsList = project.solutionsList && project.solutionsList.length > 0
    ? project.solutionsList
    : (project.solution ? [{ title: 'Architectural Solution', description: project.solution }] : []);

  const resultsList = project.resultsList && project.resultsList.length > 0
    ? project.resultsList
    : [];

  const techStack = project.techStack && project.techStack.length > 0
    ? project.techStack.map((t: any) => typeof t === 'string' ? t : (t?.name || t?.technology?.name || ''))
    : ['Next.js 14', 'PostgreSQL', 'TypeScript', 'Prisma ORM', 'Express.js', 'Cloudinary CDN'];

  const galleryImages = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [];

  // Schema.org JSON-LD (SoftwareApplication + CreativeWork + BreadcrumbList)
  const jsonLd = [
    {
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
      publisher: {
        '@type': 'Organization',
        name: 'Ryzite Software & Digital Agency',
        logo: 'https://ryzite.com/logo.png'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://ryzite.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Portfolio',
          item: 'https://ryzite.com/portfolio'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: project.title,
          item: `https://ryzite.com/portfolio/${slug}`
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar services={INITIAL_SERVICES} activeSection="portfolio" />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <Breadcrumbs
            items={[
              { label: 'Portfolio', url: '/portfolio' },
              { label: project.title },
            ]}
          />

          {/* Section 1: Hero Header */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 bg-[#EBF2FF] text-[#0052FF] text-xs font-bold rounded-full border border-[#0052FF]/20 uppercase tracking-wider">
                {project.category}
              </span>
              
              {project.clientLogoUrl && (
                <div className="h-6 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 flex items-center justify-center">
                  <img src={project.clientLogoUrl} alt={clientName} className="h-full object-contain" />
                </div>
              )}

              <span className="text-xs font-bold text-slate-400">Client: {clientName}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] font-display">
              {project.title}
            </h1>

            {subtitle && (
              <p className="text-xl font-bold text-[#0052FF] font-display">
                {subtitle}
              </p>
            )}

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
              {project.shortDescription || project.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0052FF] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-[#0040cc] shadow-md shadow-blue-500/20 transition-all"
                >
                  <span>Launch Live Platform</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 text-white text-xs sm:text-sm font-bold rounded-full hover:bg-slate-800 transition-all border border-slate-800"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              )}
            </div>
          </div>

          {/* Section 2: Hero Banner Image */}
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-950">
            <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white text-xs font-bold">
              <span className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700">
                Client Partner: {clientName}
              </span>
              <span className="bg-emerald-500/90 text-slate-950 px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                Production Live
              </span>
            </div>
          </div>

          {/* Section 3: Impact Metrics Bar */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all text-center space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.label}</div>
                  <div className="text-3xl font-black text-[#0052FF] font-display">{m.value}</div>
                  {m.trend && <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full inline-block border border-emerald-200">{m.trend}</div>}
                  {m.description && <div className="text-xs text-slate-500">{m.description}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Section 4: Narrative Overview & Executive Business Impact */}
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] font-display">
                Project Overview & <span className="text-[#0052FF]">Architectural Narrative</span>
              </h2>
              <div className="text-slate-700 leading-relaxed text-base space-y-4 whitespace-pre-line">
                {fullDesc}
              </div>
            </div>

            {project.businessImpactText && (
              <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-blue-50/80 border border-blue-200/80 space-y-4">
                <div className="flex items-center gap-2 text-[#0052FF] font-bold text-xs uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4" />
                  <span>Executive Business Impact</span>
                </div>
                <p className="text-sm font-medium text-slate-800 leading-relaxed">
                  {project.businessImpactText}
                </p>
              </div>
            )}
          </div>

          {/* Section 5: Engineering Challenges & Architectural Solutions */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Engineering Challenges */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
              <h3 className="text-2xl font-bold text-[#0F172A] font-display flex items-center gap-2">
                <Layers className="w-6 h-6 text-rose-500" />
                <span>Engineering Challenges</span>
              </h3>
              <div className="space-y-4">
                {challengesList.map((c, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 font-extrabold text-xs flex items-center justify-center shrink-0">!</span>
                      <span>{c.title}</span>
                    </div>
                    {c.description && <p className="text-xs text-slate-600 pl-7">{c.description}</p>}
                    {c.impact && <div className="pl-7 text-[11px] font-semibold text-rose-600">Impact: {c.impact}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Architectural Solutions Deployed */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
              <h3 className="text-2xl font-bold text-[#0F172A] font-display flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#0052FF]" />
                <span>Architectural Solutions Deployed</span>
              </h3>
              <div className="space-y-4">
                {solutionsList.map((s, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Check className="w-5 h-5 text-[#0052FF] shrink-0" strokeWidth={3} />
                      <span>{s.title}</span>
                    </div>
                    {s.description && <p className="text-xs text-slate-600 pl-7">{s.description}</p>}
                    {s.codeSnippet && (
                      <div className="ml-7 bg-slate-900 text-emerald-400 p-2.5 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
                        {s.codeSnippet}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Section 6: Technology Stack */}
          <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6 border border-slate-800">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-bold font-display">Technology Stack & Engineering Suite</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {techStack.map((tech: any, idx: number) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-slate-800/90 text-slate-200 rounded-xl text-xs font-mono font-bold border border-slate-700/80 hover:border-blue-400 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Section 7: System Architecture Diagram (if available) */}
          {project.architectureDiagramUrl && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#0F172A] font-display flex items-center gap-2">
                <Terminal className="w-6 h-6 text-purple-600" />
                <span>System Architecture Diagram</span>
              </h3>
              <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 overflow-hidden text-center">
                <img src={project.architectureDiagramUrl} alt="Architecture Diagram" className="max-h-[500px] max-w-full mx-auto object-contain rounded-2xl" />
              </div>
            </div>
          )}

          {/* Section 8: Screenshots & UI Gallery */}
          {galleryImages.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#0F172A] font-display flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-[#0052FF]" />
                <span>Product UI & Screenshots Gallery</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((img: any, idx: number) => (
                  <div key={idx} className="group relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                    <img src={img.url} alt={img.alt || img.caption || 'UI Screenshot'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {img.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 p-3 text-white text-xs font-bold">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 9: Quantitative Before vs. After Results Table */}
          {resultsList.length > 0 && (
            <div className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <h3 className="text-2xl font-bold text-[#0F172A] font-display flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                <span>Quantitative Benchmarks & Results Comparison</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-200/60 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Metric Benchmark</th>
                      <th className="py-3 px-4 text-rose-600">Before Optimization</th>
                      <th className="py-3 px-4 text-emerald-600">After Ryzite Architecture</th>
                      <th className="py-3 px-4 text-blue-600">Performance Delta</th>
                      <th className="py-3 px-4">Timeframe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {resultsList.map((r: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">{r.metricName || r.title || 'Metric'}</td>
                        <td className="py-3.5 px-4 font-semibold text-rose-600">{r.beforeValue || r.beforeText || 'Legacy'}</td>
                        <td className="py-3.5 px-4 font-extrabold text-emerald-600 text-sm">{r.afterValue || r.afterText || 'Optimized'}</td>
                        <td className="py-3.5 px-4 font-extrabold text-[#0052FF]">{r.percentageChange || 'Improved'}</td>
                        <td className="py-3.5 px-4 text-slate-500">{r.timeframe || 'Immediate'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 10: Client Testimonial & Endorsement */}
          {project.testimonial && (
            <div className="p-8 sm:p-12 rounded-3xl bg-[#0F172A] text-white relative overflow-hidden space-y-6">
              <Quote className="w-12 h-12 text-[#0052FF] opacity-50" />
              <p className="text-lg sm:text-xl italic text-slate-200 leading-relaxed font-serif">
                "{project.testimonial.quote}"
              </p>
              <div className="flex items-center gap-4 pt-2">
                {project.testimonial.avatarUrl && (
                  <img src={project.testimonial.avatarUrl} alt={project.testimonial.author} className="w-12 h-12 rounded-full object-cover border-2 border-blue-500" />
                )}
                <div>
                  <div className="text-base font-bold text-cyan-300">{project.testimonial.author}</div>
                  <div className="text-xs text-slate-400">{project.testimonial.role} • {project.testimonial.company || clientName}</div>
                </div>
              </div>
            </div>
          )}

          {/* Section 11: Related Case Studies Showcase */}
          {allProjects.length > 0 && (
            <div className="space-y-6 pt-6">
              <h3 className="text-2xl font-bold text-[#0F172A] font-display">Related Enterprise Case Studies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allProjects.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/portfolio/${rel.slug}`}
                    className="group bg-slate-50 hover:bg-white p-6 rounded-3xl border border-slate-200 hover:border-[#0052FF] transition-all space-y-3"
                  >
                    <span className="text-xs font-bold text-[#0052FF] uppercase">{rel.category}</span>
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#0052FF] transition-colors">{rel.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{rel.shortDescription || rel.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Section 12: Book Discovery Call CTA Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0052FF] to-blue-700 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black font-display">Ready for Similar High-Scale Results?</h3>
              <p className="text-sm text-blue-100">Schedule a technical discovery session with Ryzite senior engineering leadership.</p>
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
