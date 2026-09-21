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

async function fetchTagData(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/blog/tag/${encodeURIComponent(slug)}`, { cache: 'no-store' });
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
  const data = await fetchTagData(slug);

  if (!data || !data.tag) {
    return {
      title: 'Tag Not Found | Ryzite',
      description: 'Blog tag not found.'
    };
  }

  const tag = data.tag;
  return {
    title: `#${tag.name} Articles | Ryzite Technical Blog`,
    description: `Read technical articles tagged under #${tag.name}.`,
    alternates: {
      canonical: `https://ryzite.com/blog/tag/${tag.slug}`
    }
  };
}

export default async function BlogTagPage(props: PageProps) {
  const { slug } = await props.params;
  const [tagData, categories, tags] = await Promise.all([
    fetchTagData(slug),
    fetchAllCategories(),
    fetchAllTags()
  ]);

  if (!tagData || !tagData.tag) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#0052FF] selection:text-white">
      <Navbar activeSection="blog" />

      <div className="pt-20">
        <BlogPageClient
          initialCategories={categories}
          initialTags={tags}
          initialPosts={tagData.posts || []}
          featuredPosts={[]}
        />
      </div>

      <Footer />
    </main>
  );
}
