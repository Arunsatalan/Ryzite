import React from 'react';
import Link from 'next/link';
import { 
  Monitor, 
  Smartphone, 
  Cpu, 
  Cloud, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { ServiceItem } from '../types';

interface SolutionsGridProps {
  services: ServiceItem[];
  onSelectService?: (service: ServiceItem) => void;
  onExploreAll?: () => void;
}

export const SolutionsGrid: React.FC<SolutionsGridProps> = ({
  services,
  onSelectService,
  onExploreAll
}) => {
  const getIcon = (iconName: string) => {
    const className = "w-6 h-6 text-[#0052FF]";
    switch (iconName) {
      case 'Monitor': return <Monitor className={className} />;
      case 'Smartphone': return <Smartphone className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Cloud': return <Cloud className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const getTechnologyIcon = (technology: string) => {
    const normalizedTechnology = technology.toLowerCase();
    const iconName = normalizedTechnology.includes('next') ? 'nextdotjs' :
      normalizedTechnology.includes('react') ? 'react' :
      normalizedTechnology.includes('typescript') ? 'typescript' :
      normalizedTechnology.includes('node') ? 'nodedotjs' :
      normalizedTechnology.includes('postgres') ? 'postgresql' :
      normalizedTechnology.includes('tailwind') ? 'tailwindcss' :
      normalizedTechnology.includes('redis') ? 'redis' :
      normalizedTechnology.includes('docker') ? 'docker' :
      normalizedTechnology.includes('kubernetes') ? 'kubernetes' :
      normalizedTechnology.includes('aws') ? 'amazonaws' :
      normalizedTechnology.includes('google') ? 'googlecloud' :
      normalizedTechnology.includes('python') ? 'python' :
      normalizedTechnology.includes('openai') ? 'openai' :
      normalizedTechnology.includes('gemini') ? 'googlegemini' :
      normalizedTechnology.includes('prisma') ? 'prisma' : 'code';

    return `https://cdn.simpleicons.org/${iconName}`;
  };

  return (
    <section 
      id="services-section"
      className="py-20 sm:py-28 bg-white relative overflow-hidden"
    >
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute -top-12 -left-20 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-sky-50/60 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center gap-5 mb-14">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2FF] text-[#0052FF] text-xs font-bold uppercase tracking-wider">
              WHAT WE DO
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight font-display">
              End-to-End Software <br />
              <span className="text-[#0052FF]">Solutions</span>
            </h2>
          </div>

          <p className="text-slate-600 max-w-2xl text-sm sm:text-base leading-relaxed">
            We design, develop and deliver custom software solutions that help businesses automate, innovate and grow in the digital era.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/services"
              className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#0052FF] hover:bg-[#0040cc] rounded-full shadow-sm hover:shadow transition-all inline-flex items-center gap-1.5"
            >
              <span>View All Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/solutions"
              className="px-5 py-2 text-xs sm:text-sm font-bold text-[#0052FF] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition-all inline-flex items-center gap-1.5"
            >
              <span>Explore Solutions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="space-y-2 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className={`group relative min-h-[310px] sm:min-h-[350px] bg-white border-b border-blue-100/80 transition-all duration-300 flex flex-col lg:flex-row items-stretch overflow-hidden ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className={`relative lg:w-1/2 min-h-[240px] sm:min-h-[300px] bg-gradient-to-br ${index % 2 === 0 ? 'from-[#EAF2FF] via-[#F8FBFF] to-[#CFE2FF]' : 'from-[#DCEBFF] via-[#F8FBFF] to-[#EAF2FF]'} overflow-hidden flex items-center justify-center p-6`}>
                {service.imageUrl ? (
                  <div className="relative z-10 w-full h-full max-h-[260px] flex items-center justify-center">
                    <img
                      src={service.imageUrl}
                      alt={service.imageAlt || service.title}
                      className="w-full h-full max-h-[220px] sm:max-h-[260px] object-cover sm:object-contain rounded-2xl shadow-xl shadow-blue-900/15 group-hover:scale-[1.03] transition-all duration-500 border border-white/60 bg-white/40 backdrop-blur-sm"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                        const parent = (e.currentTarget as HTMLElement).parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.service-icon-fallback');
                          if (fallback) (fallback as HTMLElement).classList.remove('hidden');
                        }
                      }}
                    />
                    <div className="service-icon-fallback hidden relative z-10 w-36 h-36 sm:w-48 sm:h-48 rounded-[30px] bg-[#0F172A] shadow-2xl shadow-blue-900/20 rotate-[-6deg] group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 flex items-center justify-center">
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#0052FF] flex items-center justify-center text-white">
                        <div className="[&>svg]:!text-white [&>svg]:w-9 [&>svg]:h-9 sm:[&>svg]:w-12 sm:[&>svg]:h-12">{getIcon(service.iconName)}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 w-36 h-36 sm:w-48 sm:h-48 rounded-[30px] bg-[#0F172A] shadow-2xl shadow-blue-900/20 rotate-[-6deg] group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 flex items-center justify-center">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#0052FF] flex items-center justify-center text-white">
                      <div className="[&>svg]:!text-white [&>svg]:w-9 [&>svg]:h-9 sm:[&>svg]:w-12 sm:[&>svg]:h-12">{getIcon(service.iconName)}</div>
                    </div>
                  </div>
                )}
                <span className="absolute bottom-2 right-7 text-7xl sm:text-8xl font-black text-white/70 font-display select-none">0{index + 1}</span>
              </div>

              <div className="lg:w-1/2 p-7 sm:p-10 lg:p-12 flex flex-col justify-center text-left">
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-4xl font-light text-slate-300 font-display">0{index + 1}</span>
                  <span className="h-8 w-px bg-[#0052FF]/40" />
                  <div className="w-12 h-12 rounded-full bg-[#EBF2FF] flex items-center justify-center">
                    {getIcon(service.iconName)}
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] group-hover:text-[#0052FF] transition-colors leading-tight font-display max-w-md">
                  <Link href={`/services/${service.slug}`} className="hover:text-[#0052FF]">
                    {service.title}
                  </Link>
                </h3>

                <p className="text-sm text-[#475569] leading-relaxed max-w-md mt-3">
                  {service.shortDescription}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-5">
                  {(service.techStack || ['Next.js', 'PostgreSQL']).slice(0, 2).map((tech, idx) => (
                    <span
                      key={idx}
                      title={tech}
                      aria-label={tech}
                      className="w-9 h-9 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-center"
                    >
                      <img src={getTechnologyIcon(tech)} alt={tech} className="w-5 h-5 object-contain" />
                    </span>
                  ))}
                  {(service.techStack?.length || 0) > 2 && (
                    <span className="text-[10px] font-bold text-[#0052FF] bg-blue-50 px-1.5 py-0.5 rounded-md">
                      +{(service.techStack?.length || 0) - 2}
                    </span>
                  )}
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">◷ {service.timeline}</span>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-xs sm:text-sm font-bold text-[#0052FF] flex items-center gap-1.5 hover:translate-x-1 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] rounded"
                  >
                    <span>Learn More</span><ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 border border-blue-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 bg-[#0052FF] text-white rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#001F54]">Need a bespoke multi-platform architecture?</div>
              <div className="text-xs text-slate-500">We configure dedicated engineering pods for specialized enterprise needs.</div>
            </div>
          </div>

          <Link
            id="solutions-custom-scope-btn"
            href="/solutions"
            className="px-5 py-2 text-xs font-bold text-[#0052FF] bg-white hover:bg-blue-50 border border-[#0052FF]/30 rounded-full shadow-sm hover:shadow transition-all"
          >
            Explore All Solutions →
          </Link>
        </div>
      </div>
    </section>
  );
};
