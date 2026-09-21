import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FaqPageClient } from '@/components/FaqPageClient';
import { FaqCmsItem, FaqCategoryItem } from '@/types';
import { HelpCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const revalidate = 60; // Revalidate public FAQ page every 60 seconds

async function fetchFaqCategories(): Promise<FaqCategoryItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/faqs/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error('Failed to fetch FAQ categories on server:', err);
    return [];
  }
}

async function fetchFaqs(): Promise<FaqCmsItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/faqs?status=PUBLISHED`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error('Failed to fetch FAQs on server:', err);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Enterprise Software & Cloud Engineering FAQ | Ryzite',
    description:
      'Search technical answers on enterprise custom software development, microservices architecture, Next.js 15, PostgreSQL database design, and SLAs.',
    openGraph: {
      title: 'Enterprise Software & Cloud Engineering FAQ | Ryzite',
      description:
        'Search technical answers on enterprise custom software development, microservices architecture, Next.js 15, PostgreSQL database design, and SLAs.',
      url: 'https://ryzite.com/faq',
      siteName: 'Ryzite Enterprise Agency',
      type: 'website'
    },
    alternates: {
      canonical: 'https://ryzite.com/faq'
    }
  };
}

export default async function FaqPage() {
  const [categories, faqs] = await Promise.all([fetchFaqCategories(), fetchFaqs()]);

  // Structured Data (JSON-LD WebPage)
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Enterprise Software & Cloud Engineering FAQ | Ryzite',
    description:
      'Search technical answers on enterprise custom software development, microservices architecture, Next.js 15, PostgreSQL database design, and SLAs.',
    url: 'https://ryzite.com/faq',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <Navbar activeSection="faq" />

      {/* Hero Header Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0052FF] text-xs font-extrabold uppercase tracking-wider">
              <HelpCircle size={14} />
              <span>Entity Knowledge Hub</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight font-display">
              Got Questions? <span className="text-[#0052FF]">We’ve Got Answers.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Transparent technical answers verified by Ryzite software architects. Filter by engineering category, search topics, or explore enterprise case studies.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Client Container */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        <FaqPageClient initialCategories={categories} initialFaqs={faqs} />
      </section>

      <Footer />
    </main>
  );
}
