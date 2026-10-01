'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { webAnalyticsTracker } from '../lib/WebAnalyticsTracker';

export const WebAnalyticsInitializer: React.FC = () => {
  const pathname = usePathname();

  // 1. Auto-track PageView on route change
  useEffect(() => {
    if (!pathname) return;
    webAnalyticsTracker.trackPageView(pathname, document.title);
  }, [pathname]);

  // 2. Attach global scroll depth & click listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Scroll depth listener
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollTop = window.scrollY;
      const progress = Math.round((scrollTop / scrollHeight) * 100);

      if (progress >= 90) webAnalyticsTracker.trackScrollDepth(90);
      else if (progress >= 75) webAnalyticsTracker.trackScrollDepth(75);
      else if (progress >= 50) webAnalyticsTracker.trackScrollDepth(50);
      else if (progress >= 25) webAnalyticsTracker.trackScrollDepth(25);
    };

    // Outbound & Download click listener
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.href) return;

      const href = target.href;
      const host = window.location.hostname;

      if (href.startsWith('mailto:')) {
        webAnalyticsTracker.trackEvent('EMAIL_CLICK', { email: href.replace('mailto:', '') });
      } else if (href.startsWith('tel:')) {
        webAnalyticsTracker.trackEvent('PHONE_CLICK', { phone: href.replace('tel:', '') });
      } else if (/\.(pdf|zip|docx|csv|epub|pptx)$/i.test(href)) {
        webAnalyticsTracker.trackDownload(href);
      } else if (!href.includes(host) && href.startsWith('http')) {
        webAnalyticsTracker.trackOutboundClick(href, target.innerText);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick, { capture: true });

    // Measure Web Vitals performance using PerformanceObserver
    try {
      if ('PerformanceObserver' in window) {
        // LCP
        const lcpObs = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            const val = lastEntry.startTime;
            const rating = val <= 2500 ? 'GOOD' : val <= 4000 ? 'NEEDS_IMPROVEMENT' : 'POOR';
            webAnalyticsTracker.trackWebVital('LCP', val, rating);
          }
        });
        lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });

        // FCP
        const fcpObs = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntriesByName('first-contentful-paint');
          if (entries.length > 0) {
            const val = entries[0].startTime;
            const rating = val <= 1800 ? 'GOOD' : val <= 3000 ? 'NEEDS_IMPROVEMENT' : 'POOR';
            webAnalyticsTracker.trackWebVital('FCP', val, rating);
          }
        });
        fcpObs.observe({ type: 'paint', buffered: true });
      }
    } catch (err) {}

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick, { capture: true });
    };
  }, []);

  return null;
};
