import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Workflow, 
  Clock, 
  Headphones, 
  CheckCircle2, 
  Sparkles,
  Zap,
  ShieldAlert,
  Rocket,
  Users,
  Star,
  Globe,
  Code,
  Shield,
  TrendingUp,
  LucideIcon
} from 'lucide-react';
import { CompanyStatisticItem, WhyChooseUsItem } from '../types';
import { api } from '../lib/api';
import { AnimatedCounter } from './AnimatedCounter';

const ICON_MAP: Record<string, LucideIcon> = {
  Rocket,
  Award,
  Users,
  Star,
  Globe,
  Clock,
  Code,
  Shield,
  TrendingUp,
  Workflow,
  Headphones,
  Zap,
  CheckCircle2,
  Sparkles
};

const DEFAULT_FALLBACK_STATS: CompanyStatisticItem[] = [
  { id: '1', value: '25', prefix: '', suffix: '+', label: 'Projects Delivered', description: 'Global enterprise deployments', iconName: 'Rocket', iconColor: '#0052FF', animationEnabled: true, displayOrder: 1, status: 'PUBLISHED' },
  { id: '2', value: '15', prefix: '', suffix: '+', label: 'Happy Clients', description: 'Enterprise & Startups', iconName: 'Users', iconColor: '#0052FF', animationEnabled: true, displayOrder: 2, status: 'PUBLISHED' },
  { id: '3', value: '98', prefix: '', suffix: '%', label: 'Client Satisfaction', description: '5-Star CSAT Rating', iconName: 'Award', iconColor: '#0052FF', animationEnabled: true, displayOrder: 3, status: 'PUBLISHED' },
  { id: '4', value: '3', prefix: '', suffix: '+', label: 'Years of Experience', description: 'Industry Leadership', iconName: 'Globe', iconColor: '#0052FF', animationEnabled: true, displayOrder: 4, status: 'PUBLISHED' }
];

const DEFAULT_FALLBACK_PILLARS: WhyChooseUsItem[] = [
  { id: 'p-1', title: 'Quality First', description: 'We follow industry best practices to deliver high-quality zero-debt solutions.', iconKey: 'Award', badge: 'Zero-Debt Code', enabled: true, displayOrder: 1 },
  { id: 'p-2', title: 'Agile & Transparent', description: 'We work in agile methodology with clear 2-week sprint communication.', iconKey: 'Workflow', badge: '2-Week Sprints', enabled: true, displayOrder: 2 },
  { id: 'p-3', title: 'On-time Delivery', description: 'We value your time and ensure projects are delivered on time with a 100% SLA.', iconKey: 'Clock', badge: '100% SLA Record', enabled: true, displayOrder: 3 },
  { id: 'p-4', title: 'Long-term Support', description: 'We provide continuous post-launch support and maintenance.', iconKey: 'Headphones', badge: 'Hypercare Warranty', enabled: true, displayOrder: 4 }
];

interface WhyChooseUsProps {
  onStartConsultation?: () => void;
  principles?: WhyChooseUsItem[];
  items?: WhyChooseUsItem[];
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onStartConsultation, principles: initialPrinciples, items }) => {
  const [stats, setStats] = useState<CompanyStatisticItem[]>(DEFAULT_FALLBACK_STATS);
  const [pillars, setPillars] = useState<WhyChooseUsItem[]>(items || initialPrinciples || DEFAULT_FALLBACK_PILLARS);

  useEffect(() => {
    let isMounted = true;
    api.getPublicStatistics()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setStats(data);
        }
      })
      .catch(() => {});

    api.getWhyChooseUs()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setPillars(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section 
      id="about-section"
      className="relative bg-gradient-to-b from-[#0052FF] via-[#0048E0] to-[#0038B8] text-white pt-24 pb-32 overflow-hidden"
    >
      {/* Top Liquid Wave Divider SVG */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-10">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-12 sm:h-16 fill-white"
        >
          <path d="M0,0 C150,90 350,-40 500,60 C650,140 900,-20 1200,40 L1200,0 L0,0 Z"></path>
        </svg>
      </div>

      {/* Ambient Liquid Splash Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Liquid Particles */}
      <div className="absolute top-1/3 left-1/4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm animate-float-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-8 h-8 rounded-full bg-cyan-300/20 backdrop-blur-sm animate-float-reverse pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Section Header */}
        <div className="space-y-4 mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              WHY CHOOSE RYZITE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-2xl font-display">
            We don’t just build software, <br />
            <span className="text-cyan-300">We build relationships.</span>
          </h2>
        </div>

        {/* Content Layout: 3D Cube on Left + 4 Pillars Grid on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column: 3D Isometric Ryzite Cube with Liquid Splash */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            
            {/* Liquid Splash Backing */}
            <div className="relative w-72 sm:w-80 h-72 sm:h-80 flex items-center justify-center">
              
              {/* Outer Splash Droplets */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/30 to-blue-300/10 rounded-full blur-2xl animate-pulse-glow" />

              {/* Liquid Splashing Contour SVG */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full fill-white/10 animate-liquid-drift">
                <path d="M45,-65C58,-58,68,-45,74,-30C80,-15,82,2,78,18C74,34,64,49,50,59C36,69,18,74,-1,75C-20,76,-40,73,-55,62C-70,51,-80,32,-82,12C-84,-8,-78,-29,-66,-44C-54,-59,-36,-68,-18,-69C-1,-70,16,-72,45,-65Z" transform="translate(100 100)" />
              </svg>

              {/* 3D Isometric Cube Container */}
              <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 bg-gradient-to-br from-[#0066FF] via-[#0052FF] to-[#001F54] rounded-3xl p-1 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border-2 border-cyan-300/40 transform -rotate-6 hover:rotate-0 transition-transform duration-500 flex items-center justify-center group cursor-pointer">
                
                {/* Cube Top Highlight / Depth */}
                <div className="absolute inset-2 bg-gradient-to-tr from-white/20 via-transparent to-white/5 rounded-2xl pointer-events-none" />

                {/* Embossed Ryzite Neo "R" Symbol */}
                <div className="relative flex flex-col items-center justify-center text-center space-y-1">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-950/40 transform group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 sm:w-14 sm:h-14 fill-[#0052FF]" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 4h6.5a5.5 5.5 0 0 1 3.9 9.38L19 20h-4l-3.2-5.5H8v5.5H5V4zm3 3v4.5h3.5a2.25 2.25 0 0 0 0-4.5H8z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-black tracking-widest text-cyan-200 uppercase mt-2">
                    RYZITE CORE
                  </span>
                </div>

                {/* Micro floating badge on cube */}
                <div className="absolute -top-3 -right-3 bg-cyan-400 text-[#001F54] text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>3.7 Flash Engine</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: 4 Core Pillars Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 text-left">
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.iconKey && ICON_MAP[pillar.iconKey] ? ICON_MAP[pillar.iconKey] : Award;
              const badgeText = pillar.badge;
              return (
                <div 
                  key={pillar.id || idx}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15 transition-all duration-300 hover:border-cyan-300/40 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-cyan-300 shadow-inner">
                      <IconComp className="w-[#20px] h-[#20px]" />
                    </div>
                    {badgeText && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200 bg-white/10 px-2 py-0.5 rounded-md">
                        {badgeText}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 font-display">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Floating Dynamic Statistics Card (Fully CMS-Driven) */}
        <div className="relative mt-8 bg-white text-[#0F172A] rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,31,84,0.18)] p-6 sm:p-8 border border-slate-100">
          <div className={`grid grid-cols-2 lg:grid-cols-${Math.min(stats.length, 4)} gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100`}>
            {stats.map((stat, idx) => {
              const IconComponent = stat.iconName && ICON_MAP[stat.iconName] ? ICON_MAP[stat.iconName] : Rocket;
              return (
                <div 
                  key={stat.id || idx} 
                  className={`text-center space-y-1 ${idx > 0 ? 'pt-4 lg:pt-0 lg:pl-4' : ''}`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <IconComponent className="w-5 h-5 text-[#0052FF]" style={{ color: stat.iconColor || '#0052FF' }} />
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0052FF] font-display tracking-tight">
                      <AnimatedCounter 
                        value={stat.value} 
                        prefix={stat.prefix} 
                        suffix={stat.suffix} 
                        animationEnabled={stat.animationEnabled !== false}
                      />
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-800">
                    {stat.label}
                  </div>
                  {stat.description && (
                    <div className="text-[11px] text-slate-400 font-medium">
                      {stat.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Liquid Wave Divider SVG */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-10 sm:h-14 fill-[#F8FAFC]"
        >
          <path d="M0,0 C300,120 600,-40 900,80 C1050,140 1150,50 1200,120 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
};
