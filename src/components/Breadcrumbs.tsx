import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const fullItems = [{ label: 'Home', url: '/' }, ...items];

  // Schema.org BreadcrumbList structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.url ? `https://ryzite.com${item.url}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="py-3 px-4 rounded-xl bg-slate-50 border border-slate-200/80 inline-flex items-center text-xs sm:text-sm text-slate-600 mb-8 max-w-full overflow-x-auto">
        <ol className="flex items-center space-x-2 flex-wrap">
          {fullItems.map((item, idx) => {
            const isLast = idx === fullItems.length - 1;
            return (
              <li key={idx} className="flex items-center space-x-2">
                {idx > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                )}
                {isLast || !item.url ? (
                  <span className="font-semibold text-[#0052FF] truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                    {idx === 0 && <Home className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-[#0052FF] transition-colors flex items-center gap-1 font-medium text-slate-600"
                  >
                    {idx === 0 && <Home className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
