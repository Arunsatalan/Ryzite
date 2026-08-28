import React, { useState } from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { FAQ_ITEMS } from '../data/initialData';

interface FaqSectionProps {
  onOpenConsultation: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenConsultation }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-28 lg:py-36 bg-white relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 text-left">
        
        {/* Section Header */}
        <div className="space-y-4 mb-14 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-[#0052FF]">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-[-0.04em] font-display">
            Got Questions? <span className="text-[#0052FF]">We’ve Got Answers.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl">
            Everything you need to know about our engagement models, development processes, and technical guarantees.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="grid lg:grid-cols-[1.65fr_0.8fr] gap-12 lg:gap-20 items-start">
          <div className="border-t border-slate-200">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="border-b border-slate-200 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full min-h-16 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-semibold text-[#0F172A] font-display">
                    {item.question}
                  </span>
                  <div className={`w-7 h-7 border border-slate-300 flex items-center justify-center transition-transform duration-200 ${isOpen ? 'bg-[#0052FF] border-[#0052FF] text-white rotate-180' : 'text-slate-500'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="pb-6 pr-10 text-sm text-slate-600 leading-relaxed pt-1 animate-in fade-in duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
          </div>

          <aside className="bg-[#F7F8FA] p-8 lg:p-10 min-h-64">
            <div className="w-10 h-10 bg-[#101828] text-white flex items-center justify-center mb-8"><MessageSquare className="w-5 h-5" /></div>
            <h3 className="text-2xl font-bold tracking-tight text-[#101828] mb-4">Have a unique technical question?</h3>
            <p className="text-sm text-slate-500 leading-6 mb-8">Our engineering architects are happy to provide detailed answers.</p>
            <button onClick={onOpenConsultation} className="min-h-11 inline-flex items-center gap-2 text-sm font-semibold text-[#0052FF] hover:text-[#0038B8] transition-colors">Ask a Solutions Architect <span>→</span></button>
          </aside>
        </div>

      </div>
    </section>
  );
};
