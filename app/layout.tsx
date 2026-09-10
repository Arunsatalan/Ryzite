import type { Metadata } from 'next';
import React, { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ryzite.com'),
  title: {
    default: 'Ryzite | Elite Software Development & Digital Marketing Agency',
    template: '%s | Ryzite',
  },
  description: 'Scale your business with high-performance custom web applications, AI automation agents, mobile apps, and technical SEO engineered by Ryzite.',
  keywords: [
    'Ryzite',
    'Software Development Agency',
    'AI Automation Solutions',
    'Custom Web Applications',
    'Mobile App Development',
    'Cloud DevOps Services',
    'Next.js Agency',
    'Digital Marketing Agency'
  ],
  authors: [{ name: 'Ryzite Technical Leadership' }],
  creator: 'Ryzite',
  publisher: 'Ryzite',
  openGraph: {
    title: 'Ryzite | Software Development & Digital Marketing Agency',
    description: 'We Build Software That Drives Growth. Enterprise web apps, mobile apps, AI automation, and cloud engineering.',
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
    title: 'Ryzite | Software Development & Digital Marketing Agency',
    description: 'Custom full-stack web applications, AI automation agents, mobile apps, and cloud engineering.',
    creator: '@ryzite_agency',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-[#0F172A] selection:bg-[#0052FF] selection:text-white font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
