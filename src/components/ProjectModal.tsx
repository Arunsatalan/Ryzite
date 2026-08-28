import React from 'react';
import { X, ExternalLink, TrendingUp, CheckCircle2, AlertCircle, Sparkles, Layers, Quote } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onOpenConsultation }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col relative text-left">
        
        {/* Modal Top Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-5 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-50 text-[#0052FF] text-xs font-bold rounded-full">
              {project.category}
            </span>
            <span className="text-xs text-slate-400 font-semibold">{project.client}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Title & Overview */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-display">
              {project.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {project.longDescription}
            </p>
          </div>

          {/* Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 p-5 rounded-2xl border border-blue-100">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{m.label}</div>
                <div className="text-2xl sm:text-3xl font-black text-[#0052FF] font-display flex items-center gap-1.5">
                  <span>{m.value}</span>
                  {m.trend && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                      {m.trend}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Challenges vs Solutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Challenges */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-rose-600 text-sm font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Technical Challenges</span>
              </div>
              <ul className="space-y-2">
                {project.challenges.map((c, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
              <div className="flex items-center gap-2 text-[#0052FF] text-sm font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ryzite Solutions & Architecture</span>
              </div>
              <ul className="space-y-2">
                {project.solutions.map((s, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-[#0052FF] font-bold">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Tech Stack Chips */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technology Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Client Testimonial */}
          {project.testimonial && (
            <div className="p-6 rounded-2xl bg-[#001F54] text-white space-y-3 relative overflow-hidden">
              <Quote className="w-8 h-8 text-cyan-400/40 absolute right-4 top-4" />
              <p className="text-sm sm:text-base italic text-blue-100 leading-relaxed font-light">
                "{project.testimonial.quote}"
              </p>
              <div className="text-xs font-bold text-cyan-300">
                — {project.testimonial.author}, <span className="text-blue-200 font-normal">{project.testimonial.role}</span>
              </div>
            </div>
          )}

          {/* Modal Bottom CTA */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-slate-600 hover:text-[#0052FF] flex items-center gap-1.5"
              >
                <span>Visit Live Preview Sandbox</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="w-full sm:w-auto px-7 py-3 bg-[#0052FF] hover:bg-[#0040cc] text-white font-bold text-xs rounded-full shadow-lg shadow-blue-500/20 transition-all"
            >
              Build a Similar Product With Ryzite →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
