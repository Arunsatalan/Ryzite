'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ExternalLink, 
  Search, 
  Check
} from 'lucide-react';
import { ProjectItem } from '../types';

interface FeaturedProjectsProps {
  projects: ProjectItem[];
  onSelectProject?: (project: ProjectItem) => void;
  onOpenConsultation?: () => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects,
  onSelectProject,
  onOpenConsultation
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['ALL', 'AI Platform', 'Digital Business Card', 'AI Automation', 'Chatbot Platform'];

  const filteredProjects = projects.filter((proj) => {
    const matchesCat = activeCategory === 'ALL' || proj.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <section 
      id="portfolio-section"
      className="py-20 sm:py-28 bg-[#F4F8FF] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2FF] text-[#0052FF] text-xs font-bold uppercase tracking-wider mb-3">
            OUR CASE STUDIES
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight font-display mb-4">
            Our Software Stories
          </h2>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0052FF] hover:underline"
          >
            <span>View All Case Studies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-blue-200/70">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                  activeCategory === cat
                    ? 'bg-[#0052FF] text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by tech, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-full border border-slate-200 focus:outline-none focus:border-[#0052FF] text-slate-700 shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-16 sm:space-y-24">
          {filteredProjects.map((project) => (
            <article
              key={`story-${project.id}`}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
            >
              <div className="order-2 lg:order-1 text-left">
                <div className="w-24 h-24 rounded-full bg-[#F1F4F8] flex items-center justify-center mb-6 shadow-sm">
                  <span className="text-xs font-black text-[#0052FF] text-center leading-tight px-4">{project.client}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] group-hover:text-[#0052FF] transition-colors leading-tight font-display mb-4">
                  <Link href={`/portfolio/${project.slug}`}>
                    {project.title}
                  </Link>
                </h3>
                <p className="text-sm sm:text-base text-[#19345d] leading-relaxed mb-6 max-w-xl">{project.description}</p>
                <ul className="space-y-3 max-w-xl mb-6">
                  {project.solutions.slice(0, 3).map((solution) => (
                    <li key={solution} className="flex items-start gap-3 text-sm text-[#19345d] leading-relaxed">
                      <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#0052FF]" strokeWidth={3} />
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0052FF] hover:bg-[#0040cc] text-white text-xs sm:text-sm font-bold rounded-full shadow-md shadow-blue-500/20 transition-all"
                >
                  <span>View Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <Link
                href={`/portfolio/${project.slug}`}
                className="order-1 lg:order-2 relative min-h-[280px] sm:min-h-[380px] lg:min-h-[460px] overflow-hidden rounded-t-[28px] rounded-bl-[28px] bg-[#EDF4FF] block group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#EAF2FF] via-white/40 to-[#D7E8FF]" />
                <img src={project.heroImage} alt={project.title} className="absolute inset-y-0 right-0 w-[105%] h-full object-cover opacity-85 mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#EDF4FF] via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore Case Study</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Callout box */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-600 mb-3">
            Have a custom product architecture in mind?
          </p>
          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-blue-50 text-[#0052FF] border border-blue-200 font-bold text-xs shadow-sm hover:shadow transition-all"
          >
            <span>Request a Custom Architecture Blueprint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
