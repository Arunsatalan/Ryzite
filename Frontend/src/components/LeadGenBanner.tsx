import React from 'react';
import { ArrowRight, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

interface LeadGenBannerProps {
  onOpenConsultation: () => void;
}

export const LeadGenBanner: React.FC<LeadGenBannerProps> = ({ onOpenConsultation }) => {
  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Deep Royal Blue Banner with Neo-Morphic Liquid Contours matching screenshot */}
        <div className="relative bg-[#06162B] text-white p-8 sm:p-12 lg:p-16 overflow-hidden border border-slate-800">
          
          {/* Liquid Splash SVG Droplets in Background */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none bg-[radial-gradient(#4f9cff_1px,transparent_1px)] [background-size:14px_14px]" />
          
          {/* Liquid Wave Splash Accent on right side */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>START YOUR PROJECT</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-display">
                Let’s Build Something <br />
                <span className="text-white">Amazing</span>{' '}
                <span className="italic font-serif font-light text-cyan-300">Together</span>
              </h2>

              <p className="text-sm sm:text-base text-blue-100 max-w-xl leading-relaxed font-normal">
                Have a project in mind? Let’s discuss how we can turn your ideas into reality. Our solutions team responds within 2 business hours with a preliminary technical architecture review.
              </p>

              {/* Guarantees */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-cyan-100/90 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-cyan-300" />
                  <span>Free Discovery & Scope Estimate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-300" />
                  <span>Strict NDA Signed Before Kickoff</span>
                </div>
              </div>
            </div>

            {/* Right Action: Big White Pill Button */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
              <button
                id="lead-banner-get-in-touch-btn"
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white hover:bg-blue-50 active:scale-[0.98] text-[#101828] text-sm font-semibold transition-all duration-200 group"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </button>
              <span className="text-[11px] text-blue-200/80 mt-2 font-medium">
                No commitment required • Direct architect call
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
