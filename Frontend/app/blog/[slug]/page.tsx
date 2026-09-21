import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlogPostItem } from '@/types';
import { BlogDetailClient } from '@/components/BlogDetailClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // Revalidate dynamic blog post page every 60 seconds

async function fetchBlogPostBySlug(slug: string): Promise<BlogPostItem | null> {
  try {
    let res = await fetch(`${API_URL}/api/blog/slug/${encodeURIComponent(slug)}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      res = await fetch(`${API_URL}/api/blog/${encodeURIComponent(slug)}`, {
        cache: 'no-store'
      });
    }
    if (!res.ok) return null;
    const json = await res.json();
    return json.success && json.data ? json.data : null;
  } catch (err) {
    console.error(`Failed to fetch blog post by slug '${slug}':`, err);
    return null;
  }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found | Ryzite',
      description: 'The requested technical article could not be found.'
    };
  }

  const title = post.seoTitle || `${post.title} | Ryzite Technical Blog`;
  const description = post.seoDescription || post.excerpt || post.content.slice(0, 160);

  return {
    title,
    description,
    keywords: post.secondaryKeywords?.join(', '),
    openGraph: {
      title,
      description,
      url: post.canonicalUrl || `https://ryzite.com/blog/${post.slug}`,
      siteName: 'Ryzite Digital Product Studio',
      type: 'article',
      images: post.coverImageUrl ? [{ url: post.coverImageUrl, alt: post.coverImageAlt || post.title }] : undefined
    },
    alternates: {
      canonical: post.canonicalUrl || `https://ryzite.com/blog/${post.slug}`
    }
  };
}

export default async function BlogDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#0052FF] selection:text-white" suppressHydrationWarning>
      <Navbar activeSection="blog" />

      <div className="pt-20 flex-1">
        <BlogDetailClient post={post} />
      </div>

      <Footer />
    </main>
  );
}
