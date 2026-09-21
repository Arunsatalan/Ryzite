'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Check,
  Maximize2,
  X,
  ExternalLink,
  Building2,
  FolderKanban,
  HelpCircle
} from 'lucide-react';
import { FaqCmsItem } from '../types';

interface FaqDetailClientProps {
  faq: FaqCmsItem;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const FaqDetailClient: React.FC<FaqDetailClientProps> = ({ faq }) => {
  const [voted, setVoted] = useState<'helpful' | 'unhelpful' | null>(null);
  const [counts, setCounts] = useState({
    helpful: faq.helpfulCount || 0,
    unhelpful: faq.notHelpfulCount || faq.unhelpfulCount || 0
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleFeedback = async (type: 'helpful' | 'unhelpful') => {
    if (voted) return;
    setVoted(type);
    setCounts(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));

    try {
      await fetch(`${API_URL}/api/faqs/${faq.id}/feedback`, {
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

  const answerText = faq.answer || faq.answerContent || faq.shortAnswer || '';

  return (
    <div className="space-y-8 text-[#0F172A]">
      {/* Lightbox Modal */}
      {lightboxOpen && faq.imageUrl && (
        <div
          className="fixed inset-0 z-[100000] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 shadow-2xl bg-white p-2">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition-colors"
            >
              <X size={18} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={faq.imageUrl}
              alt={faq.imageCaption || faq.question}
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Back link */}
      <Link
        href="/faq"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#0052FF] hover:underline transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to All Frequently Asked Questions</span>
      </Link>

      {/* Main Content Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
        {/* Direct Answer Highlight Box */}
        {faq.directAnswer && (
          <div className="p-5 sm:p-6 bg-blue-50/70 border-l-4 border-l-[#0052FF] border border-blue-100 rounded-r-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0052FF] uppercase tracking-wider">
              <Zap size={14} className="fill-[#0052FF]/20" />
              <span>Direct Answer</span>
            </div>
            <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
              {faq.directAnswer}
            </p>
          </div>
        )}

        {/* Formatted Full Answer */}
        <div className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed space-y-4">
          {answerText.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Cloudinary Architecture Diagram / Screenshot */}
        {faq.imageUrl && (
          <div className="pt-2">
            <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 group/img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={faq.imageUrl}
                alt={faq.imageCaption || faq.question}
                className="w-full h-auto object-cover max-h-96 cursor-pointer group-hover/img:scale-102 transition-transform duration-300"
                onClick={() => setLightboxOpen(true)}
              />
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-2.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Maximize2 size={14} />
                <span>Enlarge Diagram</span>
              </button>
              {faq.imageCaption && (
                <div className="p-3 bg-white text-xs text-slate-500 border-t border-slate-200 font-medium">
                  {faq.imageCaption}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Services & Projects */}
        {((faq.services && faq.services.length > 0) || (faq.projects && faq.projects.length > 0)) && (
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Related Systems & Case Studies
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {faq.services?.map(s => (
                <Link
                  key={s.id}
                  href={`/services/${s.slug}`}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Building2 size={18} className="text-[#0052FF]" />
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold">Service</div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-[#0052FF] transition-colors">
                        {s.title}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-[#0052FF] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}

              {faq.projects?.map(p => (
                <Link
                  key={p.id}
                  href={`/portfolio/${p.slug}`}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-200 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <FolderKanban size={18} className="text-purple-600" />
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold">Case Study</div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                        {p.title}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Section */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-600">
            Was this answer helpful to your engineering evaluation?
          </div>

          {voted ? (
            <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-2">
              <Check size={16} />
              Thank you for your feedback!
            </span>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleFeedback('helpful')}
                className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
              >
                <ThumbsUp size={14} className="text-emerald-600" />
                <span>Yes ({counts.helpful})</span>
              </button>
              <button
                onClick={() => handleFeedback('unhelpful')}
                className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
              >
                <ThumbsDown size={14} className="text-rose-600" />
                <span>No ({counts.unhelpful})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CTA Card */}
      <div className="rounded-3xl bg-[#06162B] text-white p-8 sm:p-12 border border-slate-800 shadow-xl text-center space-y-4">
        <h2 className="text-2xl font-black text-white">Need a Custom Software Solution?</h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Talk directly with Ryzite senior software architects to review your technical requirements and scope your project.
        </p>
        <div className="pt-2">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0052FF] hover:bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md transition-all hover:scale-105"
          >
            <span>Book Discovery Call</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
