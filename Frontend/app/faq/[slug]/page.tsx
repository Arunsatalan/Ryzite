import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FaqCmsItem } from '@/types';
import { FaqDetailClient } from '@/components/FaqDetailClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // Revalidate dynamic FAQ page every 60 seconds

async function fetchFaqBySlug(slug: string): Promise<FaqCmsItem | null> {
  try {
    let res = await fetch(`${API_URL}/api/faqs/slug/${encodeURIComponent(slug)}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      res = await fetch(`${API_URL}/api/faqs/${encodeURIComponent(slug)}`, {
        cache: 'no-store'
      });
    }
    if (!res.ok) return null;
    const json = await res.json();
    return json.success && json.data ? json.data : null;
  } catch (err) {
    console.error(`Failed to fetch FAQ by slug '${slug}':`, err);
    return null;
  }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const faq = await fetchFaqBySlug(slug);

  if (!faq) {
    return {
      title: 'FAQ Not Found | Ryzite',
      description: 'The requested enterprise FAQ entry could not be found.'
    };
  }

  const title = faq.seoTitle || `${faq.question} | Ryzite Technical FAQ`;
  const description =
    faq.seoDescription ||
    faq.directAnswer ||
    (faq.answer || faq.answerContent || '').slice(0, 160) + '...';

  return {
    title,
    description,
    keywords: faq.keywords?.join(', '),
    openGraph: {
      title,
      description,
      url: `https://ryzite.com/faq/${faq.slug}`,
      siteName: 'Ryzite Enterprise Agency',
      type: 'article',
      images: faq.imageUrl ? [{ url: faq.imageUrl }] : undefined
    },
    alternates: {
      canonical: `https://ryzite.com/faq/${faq.slug}`
    }
  };
}

export default async function FaqDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const faq = await fetchFaqBySlug(slug);

  if (!faq) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: faq.question,
    description: faq.directAnswer || (faq.answer || faq.answerContent || '').slice(0, 160),
    url: `https://ryzite.com/faq/${faq.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Ryzite',
      url: 'https://ryzite.com'
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#0052FF] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar activeSection="faq" />

      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <Breadcrumbs
            items={[
              { label: 'Frequently Asked Questions', url: '/faq' },
              { label: faq.question }
            ]}
          />

          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {faq.category && (
                <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded bg-blue-50 text-[#0052FF] border border-blue-200">
                  {faq.category.name}
                </span>
              )}
              {faq.featured && (
                <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Featured Entry
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight leading-tight font-display">
              {faq.question}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex-1 space-y-8">
        <FaqDetailClient faq={faq} />
      </section>

      <Footer />
    </main>
  );
}
