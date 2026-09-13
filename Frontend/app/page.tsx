import type { Metadata } from 'next';
import HomePageClient from '../src/components/HomePageClient';
import { api } from '../src/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await api.getSeo('home').catch(() => null);
    const title = seo?.title || 'Ryzite | Digital Product Studio & Enterprise AI Software Development';
    const description = seo?.description || 'Architecting mission-critical web applications, high-throughput cloud backends, and bespoke digital growth systems for modern scale-ups.';
    const canonical = seo?.canonicalUrl || 'https://ryzite.com';
    const ogImage = seo?.ogImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop';

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: 'Ryzite',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: 'Ryzite Digital Product Studio',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
      robots: {
        index: seo?.robotsIndex ?? true,
        follow: seo?.robotsFollow ?? true,
      },
    };
  } catch (err) {
    return {
      title: 'Ryzite | Digital Product Studio & Enterprise AI Software Development',
      description: 'Architecting mission-critical web applications, high-throughput cloud backends, and bespoke digital growth systems for modern scale-ups.',
    };
  }
}

export default async function HomePage() {
  const initialHero = await api.getHomeHero().catch(() => null);
  return <HomePageClient initialHero={initialHero} />;
}
