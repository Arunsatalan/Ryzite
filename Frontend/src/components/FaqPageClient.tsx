'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ArrowRight,
  HelpCircle,
  Zap,
  Check,
  Maximize2,
  X,
  Building2,
  FolderKanban
} from 'lucide-react';
import { FaqCmsItem, FaqCategoryItem } from '../types';

interface FaqPageClientProps {
  initialCategories: FaqCategoryItem[];
  initialFaqs: FaqCmsItem[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const FaqPageClient: React.FC<FaqPageClientProps> = ({
  initialCategories,
  initialFaqs
}) => {
  const [categories] = useState<FaqCategoryItem[]>(initialCategories);
  const [faqs] = useState<FaqCmsItem[]>(initialFaqs);

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>(() => {
    // Open the first 2 FAQs by default
    const initialOpen: Record<string, boolean> = {};
    if (initialFaqs.length > 0) initialOpen[initialFaqs[0].id] = true;
    if (initialFaqs.length > 1) initialOpen[initialFaqs[1].id] = true;
    return initialOpen;
  });

  const [feedbackVoted, setFeedbackVoted] = useState<Record<string, 'helpful' | 'unhelpful'>>({});
  const [feedbackCounts, setFeedbackCounts] = useState<Record<string, { helpful: number; unhelpful: number }>>(() => {
    const counts: Record<string, { helpful: number; unhelpful: number }> = {};
    initialFaqs.forEach(f => {
      counts[f.id] = {
        helpful: f.helpfulCount || 0,
        unhelpful: f.notHelpfulCount || f.unhelpfulCount || 0
      };
    });
    return counts;
  });

  const [lightboxImage, setLightboxImage] = useState<{ url: string; alt: string } | null>(null);

  // Filter FAQs based on active category & search query
  const filteredFaqs = useMemo(() => {
    let result = faqs;

    if (selectedCategorySlug !== 'all') {
      result = result.filter(
        f => f.category?.slug === selectedCategorySlug || f.categoryId === selectedCategorySlug
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        f =>
          (f.question && f.question.toLowerCase().includes(q)) ||
          (f.answer && f.answer.toLowerCase().includes(q)) ||
          (f.answerContent && f.answerContent.toLowerCase().includes(q)) ||
          (f.shortAnswer && f.shortAnswer.toLowerCase().includes(q)) ||
          (f.directAnswer && f.directAnswer.toLowerCase().includes(q)) ||
          (f.category && f.category.name.toLowerCase().includes(q)) ||
          (f.keywords && f.keywords.some(k => k.toLowerCase().includes(q)))
      );
    }

    return result;
  }, [faqs, selectedCategorySlug, searchQuery]);

  // Handle Search Input Logging
  const logSearchQuery = async (query: string) => {
    if (!query.trim() || query.length < 3) return;
    try {
      await fetch(`${API_URL}/api/faqs/search-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          resultsCount: filteredFaqs.length
        })
      });
    } catch (err) {
      // Non-blocking log operation
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchBlur = () => {
    logSearchQuery(searchQuery);
  };

  const toggleItem = (id: string) => {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    filteredFaqs.forEach(f => {
      allOpen[f.id] = true;
    });
    setOpenIds(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenIds({});
  };

  // Submit Feedback
  const handleFeedback = async (faqId: string, type: 'helpful' | 'unhelpful') => {
    if (feedbackVoted[faqId]) return;

    // Optimistic UI update
    setFeedbackVoted(prev => ({ ...prev, [faqId]: type }));
    setFeedbackCounts(prev => ({
      ...prev,
      [faqId]: {
        helpful: (prev[faqId]?.helpful || 0) + (type === 'helpful' ? 1 : 0),
        unhelpful: (prev[faqId]?.unhelpful || 0) + (type === 'unhelpful' ? 1 : 0)
      }
    }));

    try {
      await fetch(`${API_URL}/api/faqs/${faqId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          helpful: type === 'helpful',
          type
        })
      });
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  return (
    <div className="space-y-8 text-[#0F172A]">
      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100000] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 shadow-2xl bg-white p-2">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition-colors"
            >
              <X size={18} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage.url}
              alt={lightboxImage.alt}
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Controls Bar: Search & Category Navigation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Search Bar */}
        <div className="relative w-full max-w-3xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0052FF]" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onBlur={handleSearchBlur}
            placeholder="Search software architecture, pricing, SLAs, security..."
            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0052FF] text-slate-900 rounded-xl pl-11 pr-11 py-3.5 text-sm sm:text-base font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          <button
            onClick={() => setSelectedCategorySlug('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedCategorySlug === 'all'
                ? 'bg-[#0052FF] text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
            }`}
          >
            All FAQs ({faqs.length})
          </button>
          {categories.map(cat => {
            const isSelected = selectedCategorySlug === cat.slug;
            const count = faqs.filter(
              f => f.category?.slug === cat.slug || f.categoryId === cat.slug
            ).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategorySlug(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0052FF] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar: Expand/Collapse All & Count indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <div className="font-semibold flex items-center gap-2">
            <HelpCircle size={15} className="text-[#0052FF]" />
            <span>
              Showing <strong className="text-slate-900">{filteredFaqs.length}</strong> {filteredFaqs.length === 1 ? 'question' : 'questions'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExpandAll}
              className="hover:text-[#0052FF] transition-colors font-medium underline underline-offset-4"
            >
              Expand All
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={handleCollapseAll}
              className="hover:text-[#0052FF] transition-colors font-medium underline underline-offset-4"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Accordion FAQ Container */}
      {filteredFaqs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0052FF] flex items-center justify-center mx-auto border border-blue-100">
            <Search size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No questions found matching your search</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            We couldn't find any FAQs matching "{searchQuery}". Have a specific technical question for our engineering team?
          </p>
          <div className="pt-2">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0052FF] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all"
            >
              <span>Ask Our Engineers Directly</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map(faq => {
            const isOpen = !!openIds[faq.id];
            const voted = feedbackVoted[faq.id];
            const counts = feedbackCounts[faq.id] || {
              helpful: faq.helpfulCount || 0,
              unhelpful: faq.notHelpfulCount || faq.unhelpfulCount || 0
            };
            const answerText = faq.answer || faq.answerContent || faq.shortAnswer || '';

            return (
              <div
                key={faq.id}
                id={`faq-${faq.slug}`}
                className={`bg-white border transition-all duration-200 rounded-2xl overflow-hidden ${
                  isOpen
                    ? 'border-[#0052FF]/40 shadow-md ring-1 ring-[#0052FF]/20'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {/* Header Row (Clickable) */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  onClick={() => toggleItem(faq.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleItem(faq.id);
                    }
                  }}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer select-none group"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {faq.category && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-blue-50 text-[#0052FF] border border-blue-200">
                          {faq.category.name}
                        </span>
                      )}
                      {faq.featured && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          Featured Entry
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0052FF] transition-colors leading-snug font-display">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 shrink-0 ${
                      isOpen
                        ? 'bg-[#0052FF] text-white border-[#0052FF] rotate-180'
                        : 'bg-slate-50 text-slate-500 border-slate-200 group-hover:bg-slate-100 group-hover:text-slate-900'
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </div>

                {/* Expanded Answer Content */}
                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-6 text-sm text-slate-700 leading-relaxed animate-in fade-in duration-200"
                  >
                    {/* Direct Answer Highlight Box */}
                    {faq.directAnswer && (
                      <div className="p-4 sm:p-5 bg-blue-50/70 border-l-4 border-l-[#0052FF] border border-blue-100 rounded-r-xl space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0052FF] uppercase tracking-wider">
                          <Zap size={14} className="fill-[#0052FF]/20" />
                          <span>Direct Answer</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                          {faq.directAnswer}
                        </p>
                      </div>
                    )}

                    {/* Formatted Full Answer */}
                    <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-3">
                      {answerText.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>

                    {/* Cloudinary Diagram / Image preview if present */}
                    {faq.imageUrl && (
                      <div className="pt-2">
                        <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group/img max-w-lg">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={faq.imageUrl}
                            alt={faq.imageCaption || faq.question}
                            className="w-full h-auto object-cover max-h-64 cursor-pointer group-hover/img:scale-105 transition-transform duration-300"
                            onClick={() => setLightboxImage({ url: faq.imageUrl!, alt: faq.imageCaption || faq.question })}
                          />
                          <button
                            onClick={() => setLightboxImage({ url: faq.imageUrl!, alt: faq.imageCaption || faq.question })}
                            className="absolute bottom-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg backdrop-blur-xs text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Maximize2 size={13} />
                            <span>Expand Diagram</span>
                          </button>
                          {faq.imageCaption && (
                            <div className="p-2.5 bg-white text-xs text-slate-500 border-t border-slate-200 font-medium">
                              {faq.imageCaption}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Related Services & Projects badges */}
                    {((faq.services && faq.services.length > 0) || (faq.projects && faq.projects.length > 0)) && (
                      <div className="pt-4 border-t border-slate-100 space-y-3">
                        {faq.services && faq.services.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className="font-bold text-slate-500">Related Services:</span>
                            {faq.services.map(s => (
                              <Link
                                key={s.id}
                                href={`/services/${s.slug}`}
                                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-[#0052FF] text-slate-700 border border-slate-200/80 transition-colors flex items-center gap-1 font-semibold"
                              >
                                <Building2 size={12} className="text-[#0052FF]" />
                                <span>{s.title}</span>
                                <ArrowRight size={12} />
                              </Link>
                            ))}
                          </div>
                        )}

                        {faq.projects && faq.projects.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className="font-bold text-slate-500">Case Studies:</span>
                            {faq.projects.map(p => (
                              <Link
                                key={p.id}
                                href={`/portfolio/${p.slug}`}
                                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-purple-50 hover:text-purple-600 text-slate-700 border border-slate-200/80 transition-colors flex items-center gap-1 font-semibold"
                              >
                                <FolderKanban size={12} className="text-purple-600" />
                                <span>{p.title}</span>
                                <ArrowRight size={12} />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer Row: Feedback Yes/No & Standalone Page Link */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                      {/* Feedback buttons */}
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-semibold">Was this answer helpful?</span>
                        {voted ? (
                          <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1.5">
                            <Check size={14} />
                            Thank you for your feedback!
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleFeedback(faq.id, 'helpful')}
                              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors font-semibold"
                            >
                              <ThumbsUp size={13} className="text-emerald-600" />
                              <span>Yes ({counts.helpful})</span>
                            </button>
                            <button
                              onClick={() => handleFeedback(faq.id, 'unhelpful')}
                              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors font-semibold"
                            >
                              <ThumbsDown size={13} className="text-rose-600" />
                              <span>No ({counts.unhelpful})</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Standalone FAQ page permalink */}
                      <Link
                        href={`/faq/${faq.slug}`}
                        className="text-[#0052FF] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>View standalone answer page</span>
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Enterprise CTA Card */}
      <div className="rounded-3xl bg-[#06162B] text-white p-8 sm:p-12 border border-slate-800 shadow-xl text-center space-y-4">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 inline-block">
            Architect Consultation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Have an Enterprise Software or Cloud Architecture Question?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Our principal software engineers and cloud architects conduct direct technical discovery sessions with zero sales friction.
          </p>
          <div className="pt-4 flex items-center justify-center">
            <Link
              href="/#contact"
              className="px-8 py-4 bg-[#0052FF] hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Schedule Architecture Review</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
