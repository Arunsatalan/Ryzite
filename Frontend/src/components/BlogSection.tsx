'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  Clock,
  BookOpen
} from 'lucide-react';
import { api } from '../lib/api';
import { BlogPostItem } from '../types';

interface BlogSectionProps {
  blogs?: any[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogs: propBlogs }) => {
  const [latestPosts, setLatestPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatest();
  }, []);

  const fetchLatest = async () => {
    try {
      const posts = await api.getLatestBlogPosts(3);
      if (Array.isArray(posts) && posts.length > 0) {
        setLatestPosts(posts);
      }
    } catch (err) {
      console.warn('Failed to fetch latest blog posts for homepage:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayPosts = latestPosts.length > 0 ? latestPosts : (propBlogs || []);

  return (
    <section id="blog-section" className="py-28 lg:py-36 bg-white relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 text-left">
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.2em] text-[#0052FF] font-bold">
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

        {loading && displayPosts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-2xl" />
            ))}
          </div>
        ) : displayPosts.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center text-slate-500 text-xs">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No published blog insights available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayPosts.map((post: any) => (
              <article
                key={post.id}
                className="group bg-white overflow-hidden border border-slate-200 hover:border-[#0052FF] rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer text-left"
              >
                <div>
                  <Link href={`/blog/${post.slug}`} className="relative aspect-video overflow-hidden bg-slate-900 block">
                    {post.coverImageUrl || post.coverImage ? (
                      <img
                        src={post.coverImageUrl || post.coverImage}
                        alt={post.coverImageAlt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-[#0052FF] p-6 flex flex-col justify-between text-white">
                        <BookOpen className="w-8 h-8 text-blue-400" />
                        <span className="text-[10px] font-mono text-blue-200 uppercase">Engineering Insight</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white text-[#0052FF] text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-xs uppercase">
                      {post.category?.name || post.category || 'Insight'}
                    </div>
                  </Link>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'Recently Published'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readingTimeMinutes ? `${post.readingTimeMinutes} min read` : post.readTime || '5 min read'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0052FF] transition-colors leading-snug font-display line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-3 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {post.author?.avatarUrl || post.author?.avatar ? (
                      <img
                        src={post.author?.avatarUrl || post.author?.avatar}
                        alt={post.author?.name || 'Ryzite Lead'}
                        className="w-7 h-7 rounded-full object-cover border border-slate-300"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0052FF] flex items-center justify-center font-bold text-[10px]">
                        {post.author?.name ? post.author.name.slice(0, 2).toUpperCase() : 'RZ'}
                      </div>
                    )}
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                      {post.author?.name || 'Ryzite Lead'}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-[#0052FF] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
