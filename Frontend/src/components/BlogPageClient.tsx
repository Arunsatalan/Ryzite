'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  User,
  Tag,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Layers,
  Rss
} from 'lucide-react';
import { BlogPostItem, BlogCategoryItem, BlogTagItem } from '../types';

interface BlogPageClientProps {
  initialCategories: BlogCategoryItem[];
  initialTags: BlogTagItem[];
  initialPosts: BlogPostItem[];
  featuredPosts: BlogPostItem[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const BlogPageClient: React.FC<BlogPageClientProps> = ({
  initialCategories,
  initialTags,
  initialPosts,
  featuredPosts
}) => {
  const [categories] = useState<BlogCategoryItem[]>(initialCategories);
  const [tags] = useState<BlogTagItem[]>(initialTags);
  const [posts] = useState<BlogPostItem[]>(initialPosts);

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [selectedTagSlug, setSelectedTagSlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(9);

  // Featured Hero Post (First featured post or first post in list)
  const heroPost = useMemo(() => {
    if (featuredPosts && featuredPosts.length > 0) return featuredPosts[0];
    const featuredMatch = posts.find((p) => p.featured);
    return featuredMatch || posts[0] || null;
  }, [featuredPosts, posts]);

  // Filter posts based on active category, tag, and search query
  const filteredPosts = useMemo(() => {
    let result = posts;

    if (selectedCategorySlug !== 'all') {
      result = result.filter(
        (p) => p.category?.slug === selectedCategorySlug || p.categoryId === selectedCategorySlug
      );
    }

    if (selectedTagSlug !== 'all') {
      result = result.filter((p) => p.tags?.some((t) => t.slug === selectedTagSlug));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          (p.category && p.category.name.toLowerCase().includes(q)) ||
          (p.author && p.author.name.toLowerCase().includes(q)) ||
          (p.targetKeyword && p.targetKeyword.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, selectedCategorySlug, selectedTagSlug, searchQuery]);

  // Log search query for search gap analytics
  const logSearchQuery = async (query: string) => {
    if (!query.trim() || query.length < 3) return;
    try {
      await fetch(`${API_URL}/api/blog/search-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          resultsCount: filteredPosts.length,
          intent: 'INFORMATIONAL'
        })
      });
    } catch (err) {
      // Non-blocking log operation
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logSearchQuery(searchQuery);
  };

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24">
      {/* HEADER & HERO SECTION */}
      <section className="bg-white border-b border-slate-200 pt-16 pb-12 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-6 font-medium">
            <Link href="/" className="hover:text-[#0052FF] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-900 font-semibold">Engineering Insights & Blog</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-[#0052FF] border border-blue-200 rounded-full text-xs font-bold uppercase tracking-wide">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ryzite Technical Insights</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Software Engineering, <span className="text-[#0052FF]">AI Architecture</span> & AEO Insights
              </h1>
              <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
                In-depth technical guides, benchmark analysis, Next.js architecture patterns, and Answer Engine Optimization (AEO) strategies written by senior architects.
              </p>
            </div>

            {/* Instant Search Bar & RSS Link */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Search Knowledge Base</span>
                <a
                  href="/api/blog/rss.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-[#0052FF] flex items-center space-x-1 text-xs font-normal"
                >
                  <Rss className="w-3.5 h-3.5" />
                  <span>RSS Feed</span>
                </a>
              </h3>

              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles, AI workflows, Next.js 16..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => logSearchQuery(searchQuery)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0052FF] focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                />
              </form>

              {/* Quick Tag Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-xs text-slate-400 font-semibold self-center mr-1">Popular:</span>
                {tags.slice(0, 4).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTagSlug(t.slug === selectedTagSlug ? 'all' : t.slug);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedTagSlug === t.slug
                        ? 'bg-[#0052FF] text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    #{t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER NAVIGATION TABS */}
      <section className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 overflow-x-auto py-3.5 no-scrollbar">
            <button
              onClick={() => {
                setSelectedCategorySlug('all');
                setSelectedTagSlug('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategorySlug === 'all' && selectedTagSlug === 'all'
                  ? 'bg-[#0052FF] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Articles ({posts.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategorySlug(cat.slug);
                  setSelectedTagSlug('all');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategorySlug === cat.slug
                    ? 'bg-[#0052FF] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name} {cat.postsCount !== undefined ? `(${cat.postsCount})` : ''}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED HERO POST SHOWCASE */}
      {heroPost && selectedCategorySlug === 'all' && !searchQuery && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-0 group">
            {/* Cover Image */}
            <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[420px] overflow-hidden bg-slate-900">
              {heroPost.coverImageUrl ? (
                <img
                  src={heroPost.coverImageUrl}
                  alt={heroPost.coverImageAlt || heroPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-900 to-[#0052FF] p-8 flex flex-col justify-end text-white">
                  <BookOpen className="w-12 h-12 text-blue-400 mb-4" />
                  <span className="text-xs font-mono text-blue-300">FEATURED TECHNICAL ARTICLE</span>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-[#0052FF] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                  Featured Insight
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-xs text-slate-500">
                  <span className="px-2.5 py-1 bg-blue-50 text-[#0052FF] font-bold rounded-md">
                    {heroPost.category?.name || 'Technical Insight'}
                  </span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{heroPost.readingTimeMinutes || 5} min read</span>
                  </div>
                </div>

                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 group-hover:text-[#0052FF] transition-colors leading-tight">
                  <Link href={`/blog/${heroPost.slug}`}>{heroPost.title}</Link>
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {heroPost.excerpt}
                </p>
              </div>

              {/* Author & Read Action */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {heroPost.author?.avatarUrl ? (
                    <img
                      src={heroPost.author.avatarUrl}
                      alt={heroPost.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0052FF] flex items-center justify-center font-bold text-sm">
                      {heroPost.author?.name ? heroPost.author.name.slice(0, 2).toUpperCase() : 'RZ'}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-900">{heroPost.author?.name || 'Ryzite Architect'}</div>
                    <div className="text-[11px] text-slate-500">{heroPost.author?.role || 'Senior Software Engineer'}</div>
                  </div>
                </div>

                <Link
                  href={`/blog/${heroPost.slug}`}
                  className="inline-flex items-center space-x-2 text-xs font-bold text-[#0052FF] hover:text-blue-700 group-hover:translate-x-1 transition-transform"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ARTICLES GRID SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {searchQuery
                ? `Search Results for "${searchQuery}" (${filteredPosts.length})`
                : selectedCategorySlug !== 'all'
                ? `${categories.find((c) => c.slug === selectedCategorySlug)?.name || 'Category'} Articles`
                : 'Latest Articles & Case Insights'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly peer-reviewed engineering content and architectural blueprints.
            </p>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No matching articles found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find any articles matching your search filters. Try clearing your search query or selecting another category.
            </p>
            <button
              onClick={() => {
                setSelectedCategorySlug('all');
                setSelectedTagSlug('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#0052FF] text-white text-xs font-bold rounded-xl shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Cover Image */}
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden bg-slate-900">
                    {post.coverImageUrl ? (
                      <img
                        src={post.coverImageUrl}
                        alt={post.coverImageAlt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-[#0052FF] p-6 flex flex-col justify-between text-white">
                        <span className="text-[10px] font-mono text-blue-300 uppercase tracking-widest">
                          {post.postType}
                        </span>
                        <BookOpen className="w-8 h-8 text-blue-400 opacity-80" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold rounded-md shadow-xs">
                        {post.category?.name || 'Insight'}
                      </span>
                    </div>
                  </Link>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : 'Recently Published'}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readingTimeMinutes || 5} min read</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0052FF] transition-colors leading-snug line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{post.excerpt}</p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {post.author?.avatarUrl ? (
                      <img
                        src={post.author.avatarUrl}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0052FF] flex items-center justify-center font-bold text-[10px]">
                        {post.author?.name ? post.author.name.slice(0, 2).toUpperCase() : 'RZ'}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                      {post.author?.name || 'Ryzite Team'}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-[#0052FF] hover:underline flex items-center space-x-1"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredPosts.length && (
          <div className="text-center pt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-3 bg-white border border-slate-200 hover:border-[#0052FF] text-slate-800 text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              Load More Articles ({filteredPosts.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {/* BOTTOM CTA: TECHNICAL CONSULTATION & NEWSLETTER */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 lg:p-12 shadow-xl mt-16 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bespoke Software Architecture</span>
              </div>
              <h2 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight">
                Need Custom High-Throughput Software Architecture?
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Our senior software architects directly engineer high-performance web applications, AI agent pipelines, and PostgreSQL database optimizations.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                href="/#contact"
                className="px-6 py-3.5 bg-[#0052FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl text-center shadow-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>Schedule Technical Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl text-center transition-colors"
              >
                Explore Our Engineering Principles
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
