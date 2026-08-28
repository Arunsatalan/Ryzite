import React, { useState } from 'react';
import { 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Layers,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { ProjectItem } from '../types';

interface FeaturedProjectsProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onOpenConsultation: () => void;
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
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <div className="space-y-3">
            {/* <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF2FF] text-[#0052FF] text-xs font-bold uppercase tracking-wider">
              OUR WORK
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight font-display">
              Our Software Stories
            </h2> */}
          </div>

          <div className="flex items-center gap-4">
            {/* <button
              id="view-all-projects-btn"
              onClick={() => setActiveCategory('ALL')}
              className="text-sm font-bold text-[#0052FF] hover:text-[#0038B8] flex items-center gap-1.5 group"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button> */}
          </div>
        </div>

          <div className="text-center mb-14 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight font-display">
              Our Software Stories
            </h2>
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

        <div className="space-y-24 sm:space-y-32">
          {filteredProjects.map((project) => (
            <article
              key={`story-${project.id}`}
              onClick={() => onSelectProject(project)}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center cursor-pointer"
            >
              <div className="order-2 lg:order-1 text-left">
                <div className="w-24 h-24 rounded-full bg-[#F1F4F8] flex items-center justify-center mb-10 shadow-sm">
                  <span className="text-xs font-black text-[#0052FF] text-center leading-tight px-4">{project.client}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] group-hover:text-[#0052FF] transition-colors leading-tight font-display mb-6">
                  {project.title}
                </h3>
                <p className="text-sm sm:text-base text-[#19345d] leading-relaxed mb-7 max-w-xl">{project.description}</p>
                <ul className="space-y-4 max-w-xl">
                  {project.solutions.slice(0, 4).map((solution) => (
                    <li key={solution} className="flex items-start gap-3 text-sm text-[#19345d] leading-relaxed">
                      <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#0F172A]" strokeWidth={3} />
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 lg:order-2 relative min-h-[300px] sm:min-h-[420px] lg:min-h-[560px] overflow-hidden rounded-t-[28px] rounded-bl-[28px] bg-[#EDF4FF]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EAF2FF] via-white/40 to-[#D7E8FF]" />
                <img src={project.heroImage} alt="" className="absolute inset-y-0 right-0 w-[105%] h-full object-cover opacity-75 mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#EDF4FF] via-transparent to-transparent" />
              </div>
            </article>
          ))}
        </div>

        {/* Existing project card markup retained for compatibility with project metadata. */}
        <div className="hidden grid grid-cols-1 md:grid-cols-2 gap-7 max-w-6xl mx-auto">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.slug}`}
              onClick={() => onSelectProject(project)}
              className="group bg-white rounded-2xl overflow-hidden border border-blue-100 shadow-[0_12px_30px_rgba(0,82,255,0.06)] hover:shadow-[0_20px_45px_rgba(0,82,255,0.14)] hover:border-blue-300 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1.5"
            >
              
              {/* Dark Futuristic UI Mockup Container */}
              <div className="relative aspect-[16/10] bg-[#EAF2FF] p-4 overflow-hidden flex items-center justify-center">
                
                {/* Background glowing gradients */}
                {project.heroImage && (
                  <img src={project.heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0052FF]/15 via-white/20 to-[#38BDF8]/10 group-hover:scale-110 transition-transform duration-500" />
                
                {/* Mockup Preview Content based on type */}
                <div className="relative z-10 w-full h-full rounded-xl bg-slate-900/90 border border-slate-700/60 p-3 shadow-inner flex flex-col justify-between overflow-hidden">
                  
                  {/* Mockup Header Bar */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                    <span className="text-[9px] font-mono text-cyan-400 font-bold tracking-wider">
                      {project.category}
                    </span>
                  </div>

                  {/* Visual Mockup Graphic */}
                  <div className="my-auto py-1">
                    {project.mockupType === 'dark-dashboard' && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-300">
                          <span className="font-mono text-blue-400">&gt; pinegen.stream()</span>
                          <span className="text-emerald-400 font-bold">88ms</span>
                        </div>
                        <div className="h-2 bg-blue-600/40 rounded-full w-4/5 animate-pulse" />
                        <div className="h-2 bg-slate-700 rounded-full w-full" />
                      </div>
                    )}

                    {project.mockupType === 'mobile-cards' && (
                      <div className="flex justify-center items-center gap-2">
                        <div className="w-12 h-14 bg-blue-600 rounded-lg border border-cyan-300/40 p-1 flex flex-col justify-between">
                          <div className="w-3 h-3 rounded-full bg-white/60" />
                          <div className="w-full h-1 bg-white/50 rounded" />
                        </div>
                        <div className="w-12 h-14 bg-slate-800 rounded-lg border border-slate-600 p-1 flex flex-col justify-between">
                          <div className="w-3 h-3 rounded-full bg-cyan-400" />
                          <div className="w-full h-1 bg-slate-500 rounded" />
                        </div>
                      </div>
                    )}

                    {project.mockupType === 'bot-interface' && (
                      <div className="space-y-1.5 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                          <span>Voice AI Active</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 h-4">
                          {[40, 80, 55, 95, 30, 75, 45].map((h, i) => (
                            <span key={i} style={{ height: `${h}%` }} className="w-1 bg-[#38BDF8] rounded-full" />
                          ))}
                        </div>
                      </div>
                    )}

                    {project.mockupType === 'analytics-suite' && (
                      <div className="space-y-1.5">
                        <div className="grid grid-cols-3 gap-1">
                          <div className="h-5 bg-blue-500/20 rounded border border-blue-400/30 p-1 text-[8px] text-cyan-300 font-bold">Node 1</div>
                          <div className="h-5 bg-blue-500/20 rounded border border-blue-400/30 p-1 text-[8px] text-cyan-300 font-bold">Node 2</div>
                          <div className="h-5 bg-emerald-500/20 rounded border border-emerald-400/30 p-1 text-[8px] text-emerald-300 font-bold">Done</div>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full w-full" />
                      </div>
                    )}
                  </div>

                  {/* Primary Metric Badge */}
                  <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1 border-t border-slate-800">
                    <span className="text-slate-400">{project.metrics[0]?.label}:</span>
                    <span className="text-cyan-300 font-bold">{project.metrics[0]?.value}</span>
                  </div>

                </div>

                {/* Hover Reveal Overlay */}
                <div className="absolute inset-0 bg-[#0052FF]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-bold text-xs z-20">
                  <span>View Case Study</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>

              {/* Card Meta Description Footer */}
              <div className="p-4 sm:p-5 text-left flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A] group-hover:text-[#0052FF] transition-colors font-display mb-1">
                    {project.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 font-medium mb-3">
                    {project.category}
                  </p>

                  <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack Pills */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                  {project.techStack.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Callout box */}
        <div className="mt-12 text-center">
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
