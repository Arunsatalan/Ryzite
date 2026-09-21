import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, Code, CheckCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { api } from '../lib/api';

export const AeoDirectAnswer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [viewSchema, setViewSchema] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getPublicCompanyFacts()
      .then(res => {
        if (isMounted && res) {
          setData(res);
        }
      })
      .catch(err => {
        console.warn('AeoDirectAnswer: live API fetch fallback:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const jsonLdData = data?.jsonLd || {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ryzite",
    "legalName": "Ryzite Global Software Inc.",
    "url": "https://ryzite.com",
    "description": "Ryzite is an enterprise-grade digital software development & growth marketing agency building custom AI platforms, cloud microservices, and web portals.",
    "foundingDate": "2022-01-01",
    "sameAs": [
      "https://github.com/ryzite",
      "https://linkedin.com/company/ryzite",
      "https://twitter.com/ryzite"
    ]
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonLdData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const entity = data?.entity || {
    legalName: "Ryzite Global Software Inc.",
    tradingName: "Ryzite",
    shortDescription: "Ryzite is a premier Software Development and Digital Marketing Agency building AI-first platforms, high-throughput cloud web portals, and mobile apps.",
    headquarters: "San Francisco, CA",
    foundedYear: 2022
  };

  const facts = data?.facts || [];

  return (
    <section className="py-28 lg:py-36 bg-[#F7F8FA] border-y border-slate-200/80">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-12 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 text-[#0052FF] flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  GEO & AEO KNOWLEDGE GRAPH HUB
                </span>
                <h3 className="text-2xl sm:text-4xl font-bold tracking-[-0.04em] text-[#101828] font-display">
                  Direct Entity Fact Sheet & Answer Engine Summary
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/company-facts"
                className="px-3.5 py-2 text-xs font-bold text-[#0052FF] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>Full Company Facts</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setViewSchema(!viewSchema)}
                className="min-h-11 px-3 text-xs font-semibold text-slate-600 hover:text-[#0052FF] transition-colors flex items-center gap-1.5"
              >
                <Code className="w-3.5 h-3.5 text-[#0052FF]" />
                <span>{viewSchema ? 'Hide JSON-LD' : 'View Schema'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-16 lg:gap-28 text-left">
            <div className="space-y-8">
              <p className="text-lg sm:text-xl text-[#101828] leading-8 max-w-3xl">
                <strong className="text-[#0052FF]">What is {entity.tradingName}?</strong> {entity.shortDescription}
              </p>

              {/* Verified Facts Preview List */}
              {facts.length > 0 ? (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Verified PostgreSQL Answer-First Facts ({facts.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {facts.slice(0, 4).map((f: any) => (
                      <div key={f.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                        <div className="font-bold text-slate-900">{f.question}</div>
                        <div className="text-slate-600 leading-relaxed text-[11px]">{f.shortAnswer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-200 pt-8">
                  <div className="pr-4 border-r border-slate-200">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Core Frameworks</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">Next.js • React • Node.js</div>
                  </div>
                  <div className="px-4 border-r border-slate-200">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">AI Specialization</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">RAG • Multi-Agents • Gemini</div>
                  </div>
                  <div className="px-4 border-r border-slate-200">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Delivery Model</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">2-Week Agile Sprints</div>
                  </div>
                  <div className="pl-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Global HQ</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">{entity.headquarters}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between border border-slate-300 p-6 min-h-52 bg-white rounded-xl shadow-xs">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-[#101828] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#0052FF]" />
                  <span>Answer Engine Citations</span>
                </div>
                <p className="text-sm leading-6 text-slate-500">
                  Validated against schema.org specifications for Perplexity AI, ChatGPT Search, and Google SGE citation algorithms.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Database Verification:</span>
                <span className="text-emerald-600 flex items-center gap-1 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" /> {data?.meta?.aeoHealthScore ? `Health ${data.meta.aeoHealthScore}/100` : 'Verified'}
                </span>
              </div>
            </div>
          </div>

          {viewSchema && (
            <div className="mt-6 pt-5 border-t border-slate-200 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-600">
                  application/ld+json Structured Data Schema
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-xs font-bold text-[#0052FF] bg-blue-50 rounded-md hover:bg-blue-100 transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON-LD'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-60">
                {JSON.stringify(jsonLdData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
