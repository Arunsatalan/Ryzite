import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Calendar, 
  Clock 
} from 'lucide-react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  blogs: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogs }) => {
  return (
    <section id="blog-section" className="py-28 lg:py-36 bg-white relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 text-left">
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.2em] text-[#0052FF]">
              INSIGHTS & PERSPECTIVES
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-[-0.04em] font-display max-w-xl">
              Latest from the <span className="text-[#0052FF]">Ryzite Engineering Blog</span>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-slate-600 max-w-md text-sm leading-relaxed">
              Deep technical dives into generative AI architecture, answer engine optimization (AEO), and high-scale cloud infrastructure.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0052FF] hover:underline"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {blogs.map((blog) => (
            <article 
              key={blog.id}
              className="group bg-white overflow-hidden border border-slate-200 hover:border-[#0052FF] transition-all duration-300 flex flex-col justify-between cursor-pointer text-left"
            >
              <div>
                <Link href={`/blog/${blog.slug}`} className="relative aspect-video overflow-hidden bg-slate-900 block">
                  <img 
                    src={blog.coverImage} 
                    alt={blog.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white text-[#0052FF] text-[10px] font-bold px-2.5 py-1 rounded">
                    {blog.category}
                  </div>
                </Link>

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
                    <Link href={`/blog/${blog.slug}`}>
                      {blog.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src={blog.author.avatar} 
                    alt={blog.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-700">{blog.author.name}</span>
                </div>

                <Link
                  href={`/blog/${blog.slug}`}
                  className="text-xs font-bold text-[#0052FF] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
