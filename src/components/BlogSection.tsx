import React, { useState } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Sparkles, 
  Tag, 
  BookOpen, 
  X,
  Share2,
  Check
} from 'lucide-react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  blogs: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogs }) => {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = (slug: string) => {
    navigator.clipboard.writeText(`https://ryzite.com/blog/${slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="blog-section" className="py-28 lg:py-36 bg-white relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 text-left">
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.2em] text-[#0052FF]">
              INSIGHTS & PERSPECTIVES
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-[-0.04em] font-display max-w-xl">
              Latest from the <span className="text-[#0052FF]">Ryzite Engineering Blog</span>
            </h2>
          </div>

          <p className="text-slate-600 max-w-md text-sm leading-relaxed">
            Deep technical dives into generative AI architecture, answer engine optimization (AEO), and high-scale cloud infrastructure.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {blogs.map((blog) => (
            <article 
              key={blog.id}
              onClick={() => setSelectedBlog(blog)}
              className="group bg-white overflow-hidden border border-slate-200 hover:border-[#0052FF] transition-all duration-300 flex flex-col justify-between cursor-pointer text-left"
            >
              <div>
                {/* Cover Image */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img 
                    src={blog.coverImage} 
                    alt={blog.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white text-[#0052FF] text-[10px] font-bold px-2.5 py-1">
                    {blog.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {blog.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {blog.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0052FF] transition-colors leading-snug font-display">
                    {blog.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 pt-0 mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src={blog.author.avatar} 
                    alt={blog.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-700">{blog.author.name}</span>
                </div>

                <span className="text-xs font-bold text-[#0052FF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Detail Modal / Reader */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col relative text-left">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md p-5 border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-[#0052FF] text-xs font-bold rounded-full">
                  {selectedBlog.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">{selectedBlog.readTime}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(selectedBlog.slug)}
                  className="p-2 text-slate-500 hover:text-[#0052FF] bg-slate-100 hover:bg-blue-50 rounded-full transition-colors"
                  title="Share Article Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Article Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                {selectedBlog.title}
              </h1>

              {/* Author and Date */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <img 
                  src={selectedBlog.author.avatar} 
                  alt={selectedBlog.author.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">{selectedBlog.author.name}</div>
                  <div className="text-xs text-slate-500">{selectedBlog.author.role} • {selectedBlog.publishedAt}</div>
                </div>
              </div>

              {/* AEO Answer Box */}
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-1.5">
                <div className="text-xs font-bold text-[#0052FF] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AEO / GEO Direct Answer Block</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {selectedBlog.aeoDirectAnswer}
                </p>
              </div>

              {/* Main Content Render */}
              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                {selectedBlog.content.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={pIdx} className="text-lg font-bold text-slate-900 mt-4 mb-2 font-display">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  return <p key={pIdx}>{paragraph}</p>;
                })}
              </div>

              {/* Tags */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                {selectedBlog.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
