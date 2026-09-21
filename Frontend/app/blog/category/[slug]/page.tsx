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

async function fetchCategoryData(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/blog/category/${encodeURIComponent(slug)}`, { cache: 'no-store' });
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
  const data = await fetchCategoryData(slug);

  if (!data || !data.category) {
    return {
      title: 'Category Not Found | Ryzite',
      description: 'Blog category not found.'
    };
  }

  const category = data.category;
  return {
    title: `${category.name} Articles & Insights | Ryzite Technical Blog`,
    description: category.description || `Read peer-reviewed engineering articles in ${category.name}.`,
    alternates: {
      canonical: `https://ryzite.com/blog/category/${category.slug}`
    }
  };
}

export default async function BlogCategoryPage(props: PageProps) {
  const { slug } = await props.params;
  const [catData, categories, tags] = await Promise.all([
    fetchCategoryData(slug),
    fetchAllCategories(),
    fetchAllTags()
  ]);

  if (!catData || !catData.category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#0052FF] selection:text-white">
      <Navbar activeSection="blog" />

      <div className="pt-20">
        <BlogPageClient
          initialCategories={categories}
          initialTags={tags}
          initialPosts={catData.posts || []}
          featuredPosts={[]}
        />
      </div>

      <Footer />
    </main>
  );
}
