import React from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, GitBranch, Lock, Users } from 'lucide-react';

interface AboutSectionProps {
  onOpenConsultation?: () => void;
}

const principles = [
  ['01', 'Sub-100ms Performance First', 'We architect every database query, vector index, and frontend bundle to render instantaneously.', Cpu],
  ['02', 'Automated CI/CD & Testing', 'Every commit runs through automated linting, unit tests, and integration pipelines before staging.', GitBranch],
  ['03', 'Enterprise Security by Default', 'SOC2 compliant encryption, role-based access control, and sanitization guardrails at every layer.', Lock],
  ['04', 'Direct Senior Architect Access', 'No account-manager layers. You collaborate directly with senior full-stack architects.', Users]
] as const;

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenConsultation }) => (
  <section id="about-us-section" className="bg-white text-[#101828] overflow-hidden">
    <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16 py-28 lg:py-40">
      <div className="grid lg:grid-cols-[1fr_0.8fr] gap-16 lg:gap-28 items-end">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-[#0052FF] mb-8">WHO WE ARE</div>
          <h2 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-[-0.06em] leading-[0.94] font-display mb-10">
            Engineering Precision Meets <span className="text-[#0052FF]">Product Mastery</span>
          </h2>
          <p className="max-w-2xl text-lg sm:text-xl leading-8 text-slate-600 mb-8">
            Ryzite was founded by Principal Software Architects with a singular mission: to eliminate the friction, technical debt, and delays of traditional software agencies by delivering high-velocity, production-grade digital products.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-50 text-[#0052FF] font-bold text-sm hover:bg-blue-100 transition-colors"
          >
            <span>Learn More About Our Team</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="hidden lg:flex h-64 border-l border-slate-200 pl-8 items-end text-sm leading-6 text-slate-500">
          <div><div className="w-12 border-t border-[#0052FF] mb-5" />Precision is a practice.<br />Mastery is the result.</div>
        </div>
      </div>

      <div className="mt-28 border-y border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {principles.map(([number, title, description, Icon]) => (
          <article key={number} className="py-8 lg:px-8 first:pl-0 border-b sm:border-b-0 lg:border-l border-slate-200 first:border-l-0 last:border-b-0">
            <div className="flex items-center justify-between mb-10"><Icon className="w-5 h-5 text-[#0052FF]" strokeWidth={1.5} /><span className="text-sm text-slate-400">{number}</span></div>
            <h3 className="text-lg font-semibold tracking-tight mb-4 max-w-[190px]">{title}</h3>
            <p className="text-sm leading-6 text-slate-500 max-w-[230px]">{description}</p>
          </article>
        ))}
      </div>
    </div>

    <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16 py-28 lg:py-36 grid lg:grid-cols-[1fr_0.8fr] gap-12 items-center">
      <div>
        <div className="w-12 border-t border-[#0052FF] mb-8" />
        <h3 className="text-4xl sm:text-6xl font-bold tracking-[-0.05em] font-display max-w-xl">Ready to Build Something Exceptional?</h3>
        <p className="text-lg text-slate-500 mt-6 max-w-lg">Share your requirements and our architects will design the right solution for your business.</p>
        <div className="flex flex-wrap gap-4 mt-8">
          <button onClick={onOpenConsultation} className="min-h-11 inline-flex items-center gap-2 px-6 py-3 bg-[#101828] text-white text-sm font-semibold hover:bg-[#0052FF] transition-colors rounded-xl">
            <span>Get In Touch</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <Link href="/portfolio" className="min-h-11 inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-sm font-semibold hover:border-[#0052FF] hover:text-[#0052FF] transition-colors rounded-xl">
            <span>View Our Work</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="hidden lg:block h-72 bg-[#F4F6F8] overflow-hidden relative rounded-2xl">
        <img src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=85&w=1000&auto=format&fit=crop" alt="Geometric architectural interior" className="absolute inset-0 w-full h-full object-cover grayscale opacity-70" />
        <div className="absolute inset-0 bg-white/25" />
      </div>
    </div>
  </section>
);
