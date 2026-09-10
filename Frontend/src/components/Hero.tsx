import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { TRUSTED_CLIENTS } from '../data/initialData';

interface HeroProps {
  onExploreServices?: () => void;
  onBookConsultation?: () => void;
  onSelectClient?: (clientName: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreServices,
  onBookConsultation,
  onSelectClient
}) => {
  return (
    <section 
      id="hero-section"
      className="hero-reference relative pt-32 sm:pt-36 lg:pt-40 pb-24 sm:pb-32 overflow-hidden bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center">
          <div className="hero-copy space-y-8 text-center flex flex-col items-center w-full">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2FF] border border-[#0052FF]/20 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#0052FF]">
                SOFTWARE SOLUTIONS THAT SCALE
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-[#0F172A] tracking-tight leading-[1.06] font-display max-w-4xl">
              We Build Software <br />
              That <span className="text-[#0052FF] relative inline-block">
                Drives Growth
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#38BDF8] opacity-70" viewBox="0 0 200 12" fill="none">
                  <path d="M2 9C50 3 150 3 198 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#19345d] leading-relaxed max-w-2xl font-normal">
              Empowering startups and enterprises with innovative, scalable and secure software solutions. From idea to impact – we turn your vision into powerful digital products.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
              <Link
                id="hero-explore-services-btn"
                href="/services"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0052FF] hover:bg-[#0040cc] active:scale-[0.98] text-white text-base font-bold rounded-full shadow-xl shadow-blue-600/30 transition-all duration-200 group"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                id="hero-book-consultation-btn"
                onClick={onBookConsultation}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-blue-50/80 active:scale-[0.98] text-[#0052FF] border border-[#0052FF]/30 text-base font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200"
              >
                <span>Book a Free Consultation</span>
              </button>
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
