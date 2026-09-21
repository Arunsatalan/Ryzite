import React, { useEffect } from 'react';
import { ServiceItem, BlogPost, PageMetadataConfig } from '../types';
import { FAQ_ITEMS } from '../data/initialData';

interface SeoStructuredDataProps {
  metadata?: PageMetadataConfig | null;
  services: ServiceItem[];
  blogs: BlogPost[];
}

export const SeoStructuredData: React.FC<SeoStructuredDataProps> = ({
  metadata,
  services,
  blogs
}) => {
  useEffect(() => {
    const pageTitle = metadata?.title || "Ryzite | Software Development & Digital Marketing Agency";
    const pageDesc = metadata?.description || "We Build Software That Drives Growth. Empowering startups and enterprises with scalable custom software, mobile apps, AI automation, and cloud solutions.";
    const canonical = metadata?.canonicalUrl || "https://ryzite.com";
    const ogImage = metadata?.ogImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop";
    const siteName = metadata?.siteName || "Ryzite Software & AI Agency";
    const twitterHandle = metadata?.twitterHandle || "@ryzite_agency";

    // Set Document Title
    document.title = pageTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard Meta
    setMetaTag('name', 'description', pageDesc);
    if (metadata?.keywords && metadata.keywords.length > 0) {
      setMetaTag('name', 'keywords', metadata.keywords.join(', '));
    }
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // OpenGraph Meta
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDesc);
    setMetaTag('property', 'og:url', canonical);
    setMetaTag('property', 'og:site_name', siteName);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:type', 'website');

    // Twitter Card Meta
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', twitterHandle);
    setMetaTag('name', 'twitter:creator', twitterHandle);
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDesc);
    setMetaTag('name', 'twitter:image', ogImage);

    // Canonical link
    let linkEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.setAttribute('rel', 'canonical');
      document.head.appendChild(linkEl);
    }
    linkEl.setAttribute('href', canonical);

    // 1. Organization Schema
    const orgSchema: any = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": metadata?.organizationSchema?.name || "Ryzite Software & AI Agency",
      "url": metadata?.organizationSchema?.url || "https://ryzite.com",
      "logo": metadata?.organizationSchema?.logo || "https://ryzite.com/assets/logo.png",
      "image": ogImage,
      "email": metadata?.organizationSchema?.email || "contact@ryzite.com",
      "knowsAbout": [
        "Software Development",
        "AI Solutions",
        "Cloud Engineering",
        "Mobile App Development",
        "Answer Engine Optimization"
      ],
      "sameAs": metadata?.organizationSchema?.sameAs || [
        "https://twitter.com/ryzite_agency",
        "https://linkedin.com/company/ryzite",
        "https://github.com/ryzite"
      ]
    };

    if (metadata?.organizationSchema?.telephone) {
      orgSchema.telephone = metadata.organizationSchema.telephone;
    }

    if (metadata?.serpSnippet?.starRating && metadata?.serpSnippet?.reviewCount) {
      orgSchema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": metadata.serpSnippet.starRating.toString(),
        "reviewCount": metadata.serpSnippet.reviewCount.toString(),
        "bestRating": "5",
        "worstRating": "1"
      };
    }

    // 2. WebSite with Credibility Data & Sitelinks Searchbox
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": siteName,
      "url": canonical,
      "about": [
        {
          "@type": "Thing",
          "name": "25+ Projects Delivered"
        },
        {
          "@type": "Thing",
          "name": "98% Client Satisfaction"
        },
        {
          "@type": "Thing",
          "name": "15+ Happy Clients"
        }
      ],
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${canonical}/?s={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };


    // 3. BreadcrumbList Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": canonical
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Services",
          "item": `${canonical}/#services`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Portfolio",
          "item": `${canonical}/#portfolio`
        }
      ]
    };

    // 4. FAQPage Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };

    // 5. OfferCatalog & SoftwareApplication Services Schema
    const servicesSchema = {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      "name": "Ryzite Software & Engineering Offerings",
      "itemListElement": services.map((s) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": s.title,
          "description": s.shortDescription,
          "category": s.category,
          ...(s.imageUrl ? { "image": s.imageUrl } : {}),
          "offers": {
            "@type": "Offer",
            "price": s.startingPrice.replace(/[^0-9]/g, '') || "5000",
            "priceCurrency": "USD"
          }
        }
      }))
    };

    const injectScript = (id: string, json: object) => {
      let script = document.getElementById(id) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(json, null, 2);
    };

    injectScript('ryzite-org-schema', orgSchema);
    injectScript('ryzite-website-schema', websiteSchema);
    injectScript('ryzite-breadcrumb-schema', breadcrumbSchema);
    injectScript('ryzite-faq-schema', faqSchema);
    injectScript('ryzite-services-schema', servicesSchema);

    return () => {
      ['ryzite-org-schema', 'ryzite-website-schema', 'ryzite-breadcrumb-schema', 'ryzite-faq-schema', 'ryzite-services-schema'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
  }, [metadata, services, blogs]);

  return null;
};
