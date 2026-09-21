import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlogPageClient } from '@/components/BlogPageClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

async function fetchAuthorData(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/blog/author/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    return null;
  }
}

async function fetchAllCategories() {
  try {
    const res = await fetch(`${API_URL}/api/blog/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    return [];
  }
}

async function fetchAllTags() {
  try {
    const res = await fetch(`${API_URL}/api/blog/tags`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    return [];
  }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await fetchAuthorData(slug);

  if (!data || !data.author) {
    return {
      title: 'Author Not Found | Ryzite',
      description: 'Author profile not found.'
    };
  }

  const author = data.author;
  return {
    title: `${author.name} (${author.role}) | Ryzite Technical Author`,
    description: author.bio || `Read technical engineering articles written by ${author.name}.`,
    alternates: {
      canonical: `https://ryzite.com/blog/author/${author.slug}`
    }
  };
}

export default async function BlogAuthorPage(props: PageProps) {
  const { slug } = await props.params;
  const [authorData, categories, tags] = await Promise.all([
    fetchAuthorData(slug),
    fetchAllCategories(),
    fetchAllTags()
  ]);

  if (!authorData || !authorData.author) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#0052FF] selection:text-white">
      <Navbar activeSection="blog" />

      <div className="pt-20">
        <BlogPageClient
          initialCategories={categories}
          initialTags={tags}
          initialPosts={authorData.posts || []}
          featuredPosts={[]}
        />
      </div>

      <Footer />
    </main>
  );
}
