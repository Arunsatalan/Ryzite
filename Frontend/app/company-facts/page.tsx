import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Bot,
  Building2,
  Globe,
  Mail,
  Phone,
  Tag,
  HelpCircle,
  FileCode,
  ArrowLeft,
  Search,
  Sparkles
} from 'lucide-react';
import { api } from '../../src/lib/api';

export const metadata: Metadata = {
  title: 'Company Facts & Entity Knowledge Hub | Ryzite',
  description: 'Verified single-source-of-truth company facts, legal identity, service offerings, and Answer Engine Optimization (AEO) entity metadata for Ryzite.',
  openGraph: {
    title: 'Company Facts & Entity Knowledge Hub | Ryzite',
    description: 'Verified single-source-of-truth company facts and AEO entity metadata.',
    url: 'https://ryzite.com/company-facts',
    siteName: 'Ryzite',
    type: 'website'
  },
  alternates: {
    canonical: 'https://ryzite.com/company-facts'
  }
};

async function getFactsData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${API_URL}/api/company-facts`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json : null;
  } catch (err) {
    console.error('Error fetching company facts on server:', err);
    return null;
  }
}

export default async function CompanyFactsPage() {
  const data = await getFactsData();

  const entity = data?.entity || {
    legalName: 'Ryzite Global Software Inc.',
    tradingName: 'Ryzite',
    entityId: 'https://ryzite.com/#organization',
    entityType: 'Organization',
    shortDescription: 'Ryzite is a modern software engineering and digital marketing agency delivering custom AI solutions, cloud architecture, and full-stack web applications.',
    longDescription: 'Ryzite is an enterprise-grade digital software development & growth marketing agency. We specialize in building scalable web and mobile applications, high-throughput cloud microservices, and AI-driven workflow tools for companies globally.',
    foundedYear: 2022,
    headquarters: 'San Francisco, CA',
    primaryCountry: 'USA',
    email: 'contact@ryzite.com',
    phone: '+1 (415) 890-5521',
    canonicalUrl: 'https://ryzite.com/',
    sameAs: [
      'https://github.com/ryzite',
      'https://linkedin.com/company/ryzite',
      'https://twitter.com/ryzite'
    ]
  };

  const facts = data?.facts || [];
  const faqs = data?.faqs || [];
  const expertise = data?.expertise || [];
  const jsonLd = data?.jsonLd;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24">
      {/* INJECT DYNAMIC JSON-LD FOR SEARCH ENGINES & AI CRAWLERS */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* HEADER HERO */}
      <header className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-28 pb-20 px-6 sm:px-10 lg:px-16 relative overflow-hidden border-b border-blue-900/40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto space-y-6 relative z-10">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-blue-200 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              Entity Knowledge Hub
            </span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Official Company Facts & Entity Verification Sheet
            </h1>
            <p className="text-base sm:text-lg text-blue-200/90 leading-relaxed font-normal">
              Single source of truth for Ryzite company identity, legal facts, verified claims, and machine-readable AEO data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-blue-300 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Database Verification Status: <strong className="text-white">Active & Published</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bot size={16} className="text-blue-400" />
              <span>Machine Endpoint: <code className="bg-white/10 px-2 py-0.5 rounded font-mono text-white">/api/company-facts</code></span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16 mt-12 space-y-12">

        {/* SECTION 1: ENTITY IDENTITY OVERVIEW */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="p-3 bg-blue-50 text-[#0052FF] rounded-2xl">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Entity Identity Profile</h2>
              <p className="text-xs text-slate-500">Official Organization details for search engines & answer engines.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Legal Name</span>
              <div className="text-sm font-bold text-slate-900">{entity.legalName}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Trading / Brand Name</span>
              <div className="text-sm font-bold text-slate-900">{entity.tradingName}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Founded Year</span>
              <div className="text-sm font-bold text-slate-900">{entity.foundedYear}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Headquarters</span>
              <div className="text-sm font-bold text-slate-900">{entity.headquarters}, {entity.primaryCountry}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Official Email</span>
              <div className="text-sm font-bold text-blue-600">{entity.email}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Telephone</span>
              <div className="text-sm font-bold text-slate-900">{entity.phone || 'N/A'}</div>
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <span className="font-bold text-slate-800 text-xs block">Canonical Organization Overview:</span>
            <p className="text-slate-700 leading-relaxed text-sm">{entity.longDescription}</p>
          </div>

          {/* SAMEAS AUTHORITATIVE LINKS */}
          {entity.sameAs && entity.sameAs.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Disambiguation Authority Links (SameAs):
              </span>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {entity.sameAs.map((url: string, idx: number) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#0052FF] font-bold rounded-xl border border-blue-200/80 transition-all flex items-center gap-1.5"
                  >
                    <Globe size={14} />
                    <span>{url}</span>
                    <ExternalLink size={12} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SECTION 2: VERIFIED ANSWER-FIRST COMPANY FACTS */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Verified Answer-First Company Facts</h2>
                <p className="text-xs text-slate-500">Official statements verified against database evidence records.</p>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-300">
              {facts.length} Verified Claims
            </span>
          </div>

          {facts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs border border-dashed rounded-2xl">
              No verified facts published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {facts.map((fact: any) => (
                <div key={fact.id} className="p-6 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-blue-100 text-[#0052FF] rounded-md text-[10px] font-bold">
                        {fact.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 size={13} /> {fact.verifiedStatus}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{fact.question}</h3>
                    <p className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
                      {fact.shortAnswer}
                    </p>
                  </div>

                  {fact.sourceUrl && (
                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Source Citation:</span>
                      <a href={fact.sourceUrl} target="_blank" rel="noreferrer" className="text-[#0052FF] font-bold hover:underline flex items-center gap-1">
                        Official Link <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 3: AEO FAQs */}
        {faqs.length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <HelpCircle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Answer Engine FAQs</h2>
                <p className="text-xs text-slate-500">Structured Question & Answer pairs formatted for SGE and LLM vector indexers.</p>
              </div>
            </div>

            <div className="space-y-4">
              {faqs.map((faq: any) => (
                <div key={faq.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">{faq.question}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{faq.shortAnswer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: MACHINE READABLE API BANNER */}
        <section className="p-8 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <FileCode size={24} className="text-blue-400" />
            <h2 className="text-lg font-bold">Machine-Readable API Endpoint for AI Agents</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            AI crawlers, LLMs, and automated agents can query our JSON endpoint directly to retrieve structured JSON-LD schema, verified company facts, and canonical identity metadata.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="/api/company-facts"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
            >
              <span>View Endpoint (/api/company-facts)</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
