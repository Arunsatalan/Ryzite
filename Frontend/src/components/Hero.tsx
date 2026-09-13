import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { TRUSTED_CLIENTS } from '../data/initialData';
import { HomeHeroConfig } from '../types';

interface HeroProps {
  hero?: HomeHeroConfig;
  onExploreServices?: () => void;
  onBookConsultation?: () => void;
  onSelectClient?: (clientName: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  hero,
  onExploreServices,
  onBookConsultation,
  onSelectClient
}) => {
  // If Hero is explicitly disabled in database, hide section
  if (hero && hero.enabled === false) {
    return null;
  }

  const badgeText = hero?.badgeText ?? 'SOFTWARE SOLUTIONS THAT SCALE';
  const headingPrefix = hero?.headingPrefix ?? 'We Build Software';
  const headingHighlight = hero?.headingHighlight ?? 'Drives Growth';
  const headingSuffix = hero?.headingSuffix ?? '';
  const description = hero?.description ?? 'Empowering startups and enterprises with innovative, scalable and secure software solutions. From idea to impact – we turn your vision into powerful digital products.';

  const primaryCtaText = hero?.primaryCtaText ?? 'Explore Our Services';
  const primaryCtaUrl = hero?.primaryCtaUrl ?? '/services';
  const primaryCtaEnabled = hero?.primaryCtaEnabled ?? true;
  const primaryCtaOpenNewTab = hero?.primaryCtaOpenNewTab ?? false;

  const secondaryCtaText = hero?.secondaryCtaText ?? 'Book a Free Consultation';
  const secondaryCtaUrl = hero?.secondaryCtaUrl ?? '#contact';
  const secondaryCtaType = hero?.secondaryCtaType ?? 'consultation';
  const secondaryCtaEnabled = hero?.secondaryCtaEnabled ?? true;
  const secondaryCtaOpenNewTab = hero?.secondaryCtaOpenNewTab ?? false;

  return (
    <section 
      id="hero-section"
      className="hero-reference relative pt-32 sm:pt-36 lg:pt-40 pb-24 sm:pb-32 overflow-hidden bg-white"
      style={
        hero?.backgroundImageUrl 
          ? { backgroundImage: `url(${hero.backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
          : undefined
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center">
          <div className="hero-copy space-y-8 text-center flex flex-col items-center w-full">
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2FF] border border-[#0052FF]/20 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse" />
                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#0052FF]">
                  {badgeText}
                </span>
              </div>
            )}

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-[#0F172A] tracking-tight leading-[1.06] font-display max-w-4xl">
              {headingPrefix}{' '}
              {headingHighlight && (
                <>
                  <br className="hidden sm:inline" />
                  <span className="text-[#0052FF] relative inline-block">
                    {headingHighlight}
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#38BDF8] opacity-70" viewBox="0 0 200 12" fill="none">
                      <path d="M2 9C50 3 150 3 198 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                </>
              )}
              {headingSuffix && ` ${headingSuffix}`}
            </h1>

            <p className="text-base sm:text-lg text-[#19345d] leading-relaxed max-w-2xl font-normal">
              {description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
              {primaryCtaEnabled && (
                <Link
                  id="hero-explore-services-btn"
                  href={primaryCtaUrl}
                  target={primaryCtaOpenNewTab ? '_blank' : undefined}
                  rel={primaryCtaOpenNewTab ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0052FF] hover:bg-[#0040cc] active:scale-[0.98] text-white text-base font-bold rounded-full shadow-xl shadow-blue-600/30 transition-all duration-200 group"
                >
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}

              {secondaryCtaEnabled && (
                secondaryCtaType === 'consultation' ? (
                  <button
                    id="hero-book-consultation-btn"
                    onClick={onBookConsultation}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-blue-50/80 active:scale-[0.98] text-[#0052FF] border border-[#0052FF]/30 text-base font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <span>{secondaryCtaText}</span>
                  </button>
                ) : (
                  <Link
                    id="hero-secondary-cta-link"
                    href={secondaryCtaUrl}
                    target={secondaryCtaOpenNewTab ? '_blank' : undefined}
                    rel={secondaryCtaOpenNewTab ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-blue-50/80 active:scale-[0.98] text-[#0052FF] border border-[#0052FF]/30 text-base font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <span>{secondaryCtaText}</span>
                  </Link>
                )
              )}
            </div>

            <div className="pt-9 border-t border-blue-100/80 w-full max-w-2xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                TRUSTED BY GROWING BUSINESSES
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
                {TRUSTED_CLIENTS.map((client, idx) => (
                  <Link
                    key={idx}
                    id={`client-trust-${client.name.toLowerCase().replace(/\s+/g, '-')}`}
                    href="/portfolio"
                    className="flex items-center gap-1.5 text-slate-700 hover:text-[#0052FF] transition-colors group cursor-pointer focus:outline-none"
                    title={`View ${client.name} case study`}
                  >
                    <div className="w-5 h-5 rounded-md bg-blue-100/60 group-hover:bg-[#0052FF] group-hover:text-white text-[#0052FF] flex items-center justify-center transition-colors">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-bold tracking-tight text-[#001F54] group-hover:text-[#0052FF]">
                      {client.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
