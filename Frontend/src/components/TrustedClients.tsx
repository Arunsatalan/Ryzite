'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ExternalLink } from 'lucide-react';
import { TrustedClientItem } from '../types';

interface TrustedClientsProps {
  clients: TrustedClientItem[];
  onSelectClient?: (clientName: string) => void;
}

export const TrustedClients: React.FC<TrustedClientsProps> = ({
  clients,
  onSelectClient
}) => {
  // Filter active clients and sort by display order
  const activeClients = (clients || [])
    .filter(c => c.enabled !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  if (activeClients.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto pt-8 border-t border-blue-100/80">
      <div className="text-center mb-8">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          TRUSTED BY GROWING BUSINESSES
        </p>
      </div>

      {/* --- CIRCULAR ORBIT SHOWCASE --- */}
      <div className="relative flex items-center justify-center my-8 min-h-[420px] sm:min-h-[520px] w-full">
        {/* Center Agency Core Badge */}
        <div className="relative z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#0052FF] to-[#38BDF8] p-1 shadow-xl shadow-blue-500/20 flex items-center justify-center text-white">
          <div className="w-full h-full rounded-full bg-[#0F172A] flex flex-col items-center justify-center p-2 text-center">
            <Sparkles className="w-5 h-5 text-[#38BDF8] mb-1 animate-pulse" />
            <span className="text-xs font-black tracking-tight text-white font-display">RYZITE</span>
            <span className="text-[9px] text-blue-300 font-bold uppercase tracking-wider">Clients</span>
          </div>
        </div>

        {/* Orbit Ring */}
        <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full border border-dashed border-blue-200/80 pointer-events-none animate-[spin_40s_linear_infinite] hover:[animation-play-state:paused]" />

        {/* Orbiting Client Items Container */}
        <div className="client-orbit absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full animate-[spin_35s_linear_infinite] hover:[animation-play-state:paused] pointer-events-auto flex items-center justify-center">
          {activeClients.map((client, idx) => {
            const total = activeClients.length;
            const angle = (idx / total) * 360;

            // Render Link or Div depending on website/case-study target
            const targetUrl = client.caseStudySlug 
              ? `/portfolio?slug=${client.caseStudySlug}` 
              : (client.websiteUrl || undefined);

            const content = (
              <div 
                className="client-logo-item group relative flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:scale-[1.08] focus:outline-none"
                onClick={() => onSelectClient && onSelectClient(client.name)}
              >
                {/* Counter-rotate inner item so text and logo stay right-side up */}
                <div className="animate-[spin_35s_linear_infinite_reverse] group-hover:[animation-play-state:paused] flex flex-col items-center">
                  <div className="w-[56px] h-[56px] sm:w-[72px] sm:h-[72px] rounded-full bg-white border border-slate-200 shadow-md group-hover:border-[#0052FF] group-hover:shadow-lg group-hover:shadow-blue-500/20 flex items-center justify-center p-2.5 transition-all overflow-hidden">
                    {client.logoUrl ? (
                      <img 
                        src={client.logoUrl} 
                        alt={client.logoAltText || `${client.name} company logo`}
                        className="w-full h-full object-contain filter group-hover:brightness-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-[#0052FF] font-bold text-xs uppercase">
                        {client.name.substring(0, 2)}
                      </div>
                    )}
                  </div>
                  
                  <span className="mt-1 text-[11px] font-bold tracking-tight text-slate-800 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-200/80 shadow-2xs group-hover:text-[#0052FF] group-hover:border-blue-300 transition-colors whitespace-nowrap">
                    {client.name}
                  </span>
                </div>
              </div>
            );

            // Compute CSS position on circle orbit
            const style: React.CSSProperties = {
              position: 'absolute',
              transform: `rotate(${angle}deg) translate(var(--orbit-radius, 140px)) rotate(-${angle}deg)`
            };

            return (
              <div 
                key={client.id || idx} 
                style={style}
                className="[--orbit-radius:140px] sm:[--orbit-radius:190px]"
              >
                {targetUrl ? (
                  <Link 
                    href={targetUrl} 
                    target={client.websiteUrl && !client.caseStudySlug ? '_blank' : undefined}
                    rel={client.websiteUrl && !client.caseStudySlug ? 'noopener noreferrer' : undefined}
                    aria-label={`View ${client.name} ${client.caseStudySlug ? 'case study' : 'website'}`}
                  >
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
