import type { Metadata } from 'next';
import HomePageClient from '../src/components/HomePageClient';

export const metadata: Metadata = {
  title: 'Ryzite | Elite Software Development & Digital Marketing Agency',
  description: 'Scale your business with high-performance custom web applications, AI automation agents, mobile apps, and technical SEO engineered by Ryzite.',
  alternates: {
    canonical: 'https://ryzite.com',
  },
  openGraph: {
    title: 'Ryzite | Elite Software Development & Digital Marketing Agency',
    description: 'We Build Software That Drives Growth. Scale your business with high-performance custom web applications, AI automation agents, mobile apps, and cloud engineering.',
    url: 'https://ryzite.com',
    siteName: 'Ryzite',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Ryzite Software & Digital Marketing Agency',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ryzite | Elite Software Development & Digital Marketing Agency',
    description: 'Custom full-stack web applications, AI automation agents, mobile apps, and cloud engineering.',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
