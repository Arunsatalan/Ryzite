import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, MessageSquare, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { FAQ_ITEMS } from '../data/initialData';
import { FaqCmsItem } from '../types';
import { api } from '../lib/api';

interface FaqSectionProps {
  onOpenConsultation?: () => void;
  initialItems?: FaqCmsItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenConsultation, initialItems }) => {
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string; slug?: string; directAnswer?: string }>>(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems;
    }
    return FAQ_ITEMS;
  });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    if (!initialItems || initialItems.length === 0) {
      api.getFaqs({ status: 'PUBLISHED', featured: true })
        .then(res => {
          if (Array.isArray(res) && res.length > 0) {
            setFaqs(res);
          }
        })
        .catch(err => {
          console.warn('Failed to load dynamic FAQs for homepage section:', err);
        });
    }
  }, [initialItems]);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-28 lg:py-36 bg-white relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 text-left">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-4 max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-[#0052FF] font-bold">
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-[-0.04em] font-display">
              Got Questions? <span className="text-[#0052FF]">We’ve Got Answers.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl">
              Everything you need to know about our engagement models, development processes, and technical guarantees.
            </p>
          </div>

          <Link
            href="/faq"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-[#0052FF] hover:text-white text-slate-800 text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0 self-start md:self-auto"
          >
            <span>Explore Knowledge Hub ({faqs.length}+ FAQs)</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* FAQ Accordion List */}
        <div className="grid lg:grid-cols-[1.65fr_0.8fr] gap-12 lg:gap-20 items-start">
          <div className="border-t border-slate-200">
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="border-b border-slate-200 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    className="w-full min-h-16 py-5 text-left flex items-center justify-between gap-4 focus:outline-none group"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#0F172A] font-display group-hover:text-[#0052FF] transition-colors">
                      {item.question}
                    </span>
                    <div className={`w-7 h-7 border border-slate-300 flex items-center justify-center transition-transform duration-200 shrink-0 ${isOpen ? 'bg-[#0052FF] border-[#0052FF] text-white rotate-180' : 'text-slate-500'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="pb-6 pr-6 sm:pr-10 text-sm text-slate-600 leading-relaxed pt-1 space-y-3 animate-in fade-in duration-200">
                      {item.directAnswer && (
                        <div className="p-3.5 bg-blue-50 border-l-4 border-l-[#0052FF] rounded-r-xl space-y-1">
                          <div className="text-[10px] font-extrabold text-[#0052FF] uppercase tracking-wider flex items-center gap-1">
                            <Zap size={12} />
                            Direct Answer
                          </div>
                          <div className="text-xs font-semibold text-slate-900">
                            {item.directAnswer}
                          </div>
                        </div>
                      )}
                      <p>{item.answer || (item as any).answerContent || (item as any).shortAnswer || ''}</p>

                      {item.slug && (
                        <div className="pt-2">
                          <Link
                            href={`/faq/${item.slug}`}
                            className="text-xs font-bold text-[#0052FF] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Read complete technical answer →</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <aside className="bg-[#F7F8FA] p-8 lg:p-10 border border-slate-200/80 rounded-2xl space-y-6">
            <div className="w-10 h-10 bg-[#101828] text-white flex items-center justify-center rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight text-[#101828]">Have a unique technical question?</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Our principal software architects are happy to review your custom requirements with zero sales pressure.
              </p>
            </div>
            {onOpenConsultation ? (
              <button
                onClick={onOpenConsultation}
                className="w-full py-3 px-4 bg-[#0052FF] hover:bg-[#0038B8] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Ask a Solutions Architect</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <Link
                href="/#contact"
                className="w-full py-3 px-4 bg-[#0052FF] hover:bg-[#0038B8] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Ask a Solutions Architect</span>
                <ArrowRight size={16} />
              </Link>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};
