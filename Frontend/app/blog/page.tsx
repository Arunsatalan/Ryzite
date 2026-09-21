import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlogPageClient } from '@/components/BlogPageClient';
import { BlogPostItem, BlogCategoryItem, BlogTagItem } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const revalidate = 60; // Revalidate public blog hub page every 60 seconds

async function fetchBlogCategories(): Promise<BlogCategoryItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/blog/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error('Failed to fetch blog categories on server:', err);
    return [];
  }
}

async function fetchBlogTags(): Promise<BlogTagItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/blog/tags`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error('Failed to fetch blog tags on server:', err);
    return [];
  }
}

async function fetchBlogPosts(): Promise<BlogPostItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/blog?limit=50`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success && json.data?.posts ? json.data.posts : [];
  } catch (err) {
    console.error('Failed to fetch blog posts on server:', err);
    return [];
  }
}

async function fetchFeaturedBlogPosts(): Promise<BlogPostItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/blog/featured?limit=3`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error('Failed to fetch featured blog posts on server:', err);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Engineering Insights & AEO Technical Articles | Ryzite',
    description:
      'Technical articles, architectural blueprints, Next.js 16 optimization, PostgreSQL tuning, and Answer Engine Optimization (AEO) strategies by senior software architects.',
    openGraph: {
      title: 'Engineering Insights & AEO Technical Articles | Ryzite',
      description:
        'Technical articles, architectural blueprints, Next.js 16 optimization, PostgreSQL tuning, and Answer Engine Optimization (AEO) strategies by senior software architects.',
      url: 'https://ryzite.com/blog',
      siteName: 'Ryzite Digital Product Studio',
      type: 'website'
    },
    alternates: {
      canonical: 'https://ryzite.com/blog'
    }
  };
}

export default async function BlogPage() {
  const [categories, tags, posts, featuredPosts] = await Promise.all([
    fetchBlogCategories(),
    fetchBlogTags(),
    fetchBlogPosts(),
    fetchFeaturedBlogPosts()
  ]);

  // Structured Data (JSON-LD WebPage & CollectionPage)
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Engineering Insights & AEO Technical Articles | Ryzite',
    description:
      'Technical articles, architectural blueprints, Next.js 16 optimization, PostgreSQL tuning, and Answer Engine Optimization (AEO) strategies by senior software architects.',
    url: 'https://ryzite.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Ryzite',
      url: 'https://ryzite.com'
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#0052FF] selection:text-white" suppressHydrationWarning>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <Navbar activeSection="blog" />

      <div className="pt-20">
        <BlogPageClient
          initialCategories={categories}
          initialTags={tags}
          initialPosts={posts}
          featuredPosts={featuredPosts}
        />
      </div>

      <Footer />
    </main>
  );
}
