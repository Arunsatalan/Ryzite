'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Sparkles,
  Tag,
  Eye,
  List,
  Linkedin,
  Twitter,
  Copy,
  ExternalLink,
  Building2,
  FolderKanban,
  HelpCircle
} from 'lucide-react';
import { FinalCTA } from './cta/FinalCTA';
import { BlogPostItem } from '../types';

interface BlogDetailClientProps {
  post: BlogPostItem;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const BlogDetailClient: React.FC<BlogDetailClientProps> = ({ post }) => {
  const [copied, setCopied] = useState(false);
  const [activeTocId, setActiveTocId] = useState<string>('');

  // Automatically record view count on mount
  useEffect(() => {
    if (post && post.id) {
      fetch(`${API_URL}/api/blog/${post.id}/view`, { method: 'POST' }).catch(() => {});
    }
  }, [post]);

  // Safely parse key takeaways whether passed as array or JSON string
  const keyTakeawaysList = useMemo<string[]>(() => {
    if (!post || !post.keyTakeaways) return [];
    if (Array.isArray(post.keyTakeaways)) return post.keyTakeaways;
    if (typeof post.keyTakeaways === 'string') {
      try {
        const parsed = JSON.parse(post.keyTakeaways);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [post.keyTakeaways];
      }
    }
    return [];
  }, [post?.keyTakeaways]);

  // Extract H2 and H3 headings for dynamic Table of Contents (TOC)
  const tocItems = useMemo(() => {
    if (!post || !post.content) return [];
    const lines = post.content.split('\n');
    const items: { id: string; text: string; level: number }[] = [];

    lines.forEach((line) => {
      const h2Match = line.match(/^##\s+(.+)/);
      const h3Match = line.match(/^###\s+(.+)/);

      if (h2Match) {
        const text = h2Match[1].trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        items.push({ id, text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1].trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        items.push({ id, text, level: 3 });
      }
    });

    return items;
  }, [post?.content]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Helper to format content into paragraphs & section headings
  const renderFormattedContent = (content: string) => {
    if (!content) return null;
    const blocks = content.split(/\n\n+/);

    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace(/^##\s+/, '');
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        return (
          <h2 key={idx} id={id} className="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">
            {text}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        const text = trimmed.replace(/^###\s+/, '');
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        return (
          <h3 key={idx} id={id} className="text-xl font-bold text-slate-900 mt-8 mb-3 scroll-mt-24">
            {text}
          </h3>
        );
      }
      if (trimmed.startsWith('```')) {
        const codeText = trimmed.replace(/```[a-z]*\n?/g, '');
        return (
          <pre
            key={idx}
            className="bg-slate-950 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto my-6 border border-slate-800"
          >
            <code>{codeText}</code>
          </pre>
        );
      }
      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace(/^>\s+/, '');
        return (
          <blockquote key={idx} className="border-l-4 border-[#0052FF] pl-4 py-2 my-6 italic text-slate-700 bg-blue-50/50 rounded-r-lg">
            {quoteText}
          </blockquote>
        );
      }
      return (
        <p key={idx} className="text-slate-700 text-base leading-relaxed mb-5">
          {trimmed}
        </p>
      );
    });
  };

  const authorName = post.author?.name || 'Ryzite Engineering Team';
  const authorRole = (post.author as any)?.jobTitle || post.author?.role || 'Senior Software Architect';
  const authorAvatar = (post.author as any)?.profileImageUrl || post.author?.avatarUrl || null;
  const authorLinkedin = (post.author as any)?.linkedInUrl || post.author?.linkedinUrl || null;

  // JSON-LD Schema.org BlogPosting metadata
  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl ? [post.coverImageUrl] : [],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: authorRole
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ryzite',
      url: 'https://ryzite.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ryzite.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.canonicalUrl || `https://ryzite.com/blog/${post.slug}`
    },
    wordCount: post.wordCount || 800,
    articleSection: post.category?.name || 'Software Engineering'
  };

  return (
    <article className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />

      {/* ARTICLE HERO HEADER */}
      <header className="bg-white border-b border-slate-200 pt-16 pb-12 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-[#0052FF]">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <Link href="/blog" className="hover:text-[#0052FF]">
              Blog
            </Link>
            {post.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <Link href={`/blog/category/${post.category.slug}`} className="hover:text-[#0052FF]">
                  {post.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-900 font-semibold truncate max-w-[200px]">{post.title}</span>
          </nav>

          {/* Badges & Meta Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 bg-blue-50 text-[#0052FF] font-bold rounded-full border border-blue-200 uppercase tracking-wider">
              {post.category?.name || 'Technical Insight'}
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-md uppercase tracking-wider text-[10px]">
              {post.postType}
            </span>
            <div className="flex items-center space-x-1 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Published'}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.readingTimeMinutes || 5} min read</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-500">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.views || 1} views</span>
            </div>
          </div>

          {/* Title & Excerpt */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed font-normal">{post.excerpt}</p>

          {/* Author Profile Bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0052FF] flex items-center justify-center font-bold text-base">
                  {authorName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold text-slate-900">{authorName}</h3>
                <p className="text-xs text-slate-500">{authorRole}</p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyLink}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                title="Copy Article Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
              {authorLinkedin && (
                <a
                  href={authorLinkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-blue-50 text-[#0052FF] hover:bg-blue-100 rounded-xl text-xs"
                  title="Author LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ARTICLE BODY & SIDEBAR CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT CONTENT AREA */}
          <main className="lg:col-span-8 space-y-8">
            {/* Cover Image Banner */}
            {post.coverImageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <img
                  src={post.coverImageUrl}
                  alt={post.coverImageAlt || post.title}
                  className="w-full max-h-[480px] object-cover"
                />
                {post.coverImageAlt && (
                  <div className="p-3 bg-slate-100 text-slate-500 text-xs text-center border-t border-slate-200 font-mono">
                    {post.coverImageAlt}
                  </div>
                )}
              </div>
            )}

            {/* DIRECT ANSWER / AEO EXTRACT BOX */}
            {post.directAnswer && (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#0052FF] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Direct Answer (AEO Extract)</span>
                </div>
                <p className="text-sm font-medium text-slate-900 leading-relaxed font-sans">
                  {post.directAnswer}
                </p>
              </div>
            )}

            {/* KEY TAKEAWAYS BOX */}
            {keyTakeawaysList.length > 0 && (
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-[#0052FF]" />
                  <span>Key Takeaways</span>
                </h3>
                <ul className="space-y-2">
                  {keyTakeawaysList.map((point, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-[#0052FF] mt-1.5 shrink-0" />
                      <span className="leading-normal">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FORMATTED ARTICLE CONTENT */}
            <div className="bg-white border border-slate-200 p-8 lg:p-10 rounded-2xl shadow-xs">
              {renderFormattedContent(post.content)}
            </div>

            {/* ARTICLE TAGS CLOUD */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center space-x-2 flex-wrap pt-4">
                <span className="text-xs font-bold text-slate-500 mr-2 flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Topics:</span>
                </span>
                {post.tags.map((tItem: any) => {
                  const t = tItem.tag || tItem;
                  return (
                    <Link
                      key={t.id || t.slug}
                      href={`/blog/tag/${t.slug}`}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      #{t.name}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* AUTHOR BIO FOOTER BOX */}
            {post.author && (
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start gap-4">
                {authorAvatar ? (
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-[#0052FF] flex items-center justify-center font-bold text-xl shrink-0">
                    {authorName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{authorName}</h4>
                      <div className="text-xs text-[#0052FF] font-medium">{authorRole}</div>
                    </div>
                    {authorLinkedin && (
                      <a
                        href={authorLinkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 font-semibold hover:underline flex items-center space-x-1"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {post.author.bio ||
                      'Senior software engineer and systems architect specializing in high-throughput cloud backends, PostgreSQL optimization, and autonomous AI agent workflows.'}
                  </p>
                </div>
              </div>
            )}
          </main>

          {/* RIGHT SIDEBAR (TOC + RELATIONS) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* TABLE OF CONTENTS (TOC) CARD */}
            {tocItems.length > 0 && (
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs sticky top-24 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <List className="w-4 h-4 text-[#0052FF]" />
                  <span>Table of Contents</span>
                </h3>
                <nav className="space-y-2 text-xs max-h-72 overflow-y-auto">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block py-1 font-medium transition-colors hover:text-[#0052FF] ${
                        item.level === 3 ? 'pl-4 text-slate-500' : 'text-slate-800 font-semibold'
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* RELATED SERVICES CARD */}
            {post.services && post.services.length > 0 && (
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <Building2 className="w-4 h-4 text-[#0052FF]" />
                  <span>Related Services</span>
                </h3>
                <div className="space-y-2">
                  {post.services.map((srvItem: any) => {
                    const srv = srvItem.service || srvItem;
                    return (
                      <Link
                        key={srv.id || srv.slug}
                        href={`/services#${srv.slug}`}
                        className="block p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 hover:text-[#0052FF] transition-colors"
                      >
                        {srv.title} →
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* RELATED CASE STUDIES CARD */}
            {post.projects && post.projects.length > 0 && (
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <FolderKanban className="w-4 h-4 text-[#0052FF]" />
                  <span>Related Case Studies</span>
                </h3>
                <div className="space-y-2">
                  {post.projects.map((projItem: any) => {
                    const proj = projItem.project || projItem;
                    return (
                      <Link
                        key={proj.id || proj.slug}
                        href={`/portfolio/${proj.slug}`}
                        className="block p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 hover:text-[#0052FF] transition-colors"
                      >
                        {proj.title} →
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* RELATED FAQS CARD */}
            {post.faqs && post.faqs.length > 0 && (
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <HelpCircle className="w-4 h-4 text-[#0052FF]" />
                  <span>Related FAQs</span>
                </h3>
                <div className="space-y-2">
                  {post.faqs.map((faqItem: any) => {
                    const faq = faqItem.faq || faqItem;
                    return (
                      <Link
                        key={faq.id || faq.slug}
                        href={`/faq#${faq.slug}`}
                        className="block p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 hover:text-[#0052FF] transition-colors"
                      >
                        {faq.question}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Final CTA Engine Banner */}
        <FinalCTA pageType="blog" pageId={post.slug} className="mt-16" />
      </div>
    </article>
  );
};
