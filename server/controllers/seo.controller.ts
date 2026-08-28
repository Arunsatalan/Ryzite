import { Request, Response } from 'express';
import { store } from '../services/store.service.ts';
import { DEFAULT_SEO_AUDIT_CHECKS } from '../../src/data/initialData.ts';

export const getSeoMetadata = (req: Request, res: Response) => {
  res.json(store.getSeoMetadata());
};

export const updateSeoMetadata = (req: Request, res: Response) => {
  const updated = store.updateSeoMetadata(req.body);
  res.json({ success: true, metadata: updated });
};

export const getSerpAudit = (req: Request, res: Response) => {
  const metadata = store.getSeoMetadata();
  const title = metadata.title || '';
  const desc = metadata.description || '';

  const checks = [...DEFAULT_SEO_AUDIT_CHECKS];

  // Dynamic audit checks based on current title & desc length
  const titleLen = title.length;
  if (titleLen < 30) {
    checks[0] = {
      id: 'chk-1',
      category: 'TITLE',
      title: 'Google SERP Title Length (Too Short)',
      description: `Title is ${titleLen} characters. It is under the recommended 50-60 characters and misses keyword opportunities.`,
      status: 'WARNING',
      impact: 'HIGH',
      recommendation: 'Add primary branding and service keywords to reach 50-60 characters.'
    };
  } else if (titleLen > 65) {
    checks[0] = {
      id: 'chk-1',
      category: 'TITLE',
      title: 'Google SERP Title Truncation Risk',
      description: `Title is ${titleLen} characters (>600px). Google may truncate it with an ellipsis (...) on desktop and mobile.`,
      status: 'WARNING',
      impact: 'HIGH',
      recommendation: 'Shorten title to under 60 characters so the full message displays cleanly on SERPs.'
    };
  }

  const descLen = desc.length;
  if (descLen < 80) {
    checks[1] = {
      id: 'chk-2',
      category: 'DESCRIPTION',
      title: 'Meta Description Length (Too Short)',
      description: `Description is ${descLen} characters. Optimal length is 120-160 characters for maximum CTR on Google.`,
      status: 'WARNING',
      impact: 'MEDIUM',
      recommendation: 'Expand with clear value proposition and call to action.'
    };
  } else if (descLen > 165) {
    checks[1] = {
      id: 'chk-2',
      category: 'DESCRIPTION',
      title: 'Meta Description Truncation Risk',
      description: `Description is ${descLen} characters. Search engines will truncate it around 155-160 characters.`,
      status: 'WARNING',
      impact: 'LOW',
      recommendation: 'Refine to under 160 characters.'
    };
  }

  const passCount = checks.filter(c => c.status === 'PASS').length;
  const overallScore = Math.round((passCount / checks.length) * 100);

  res.json({
    score: overallScore,
    grade: overallScore >= 90 ? 'A+' : overallScore >= 80 ? 'A' : 'B',
    passedChecks: passCount,
    totalChecks: checks.length,
    checks,
    titlePixelWidth: Math.round(title.length * 8.8), // Approx px in Arial 20px
    descPixelWidth: Math.round(desc.length * 5.8),
    lastAuditedAt: new Date().toISOString()
  });
};

export const exportSchemaLd = (req: Request, res: Response) => {
  const metadata = store.getSeoMetadata();
  const services = store.getServices();

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": metadata?.organizationSchema?.name || "Ryzite",
    "url": metadata?.organizationSchema?.url || "https://ryzite.com",
    "logo": metadata?.organizationSchema?.logo || "https://ryzite.com/assets/logo.png",
    "telephone": metadata?.organizationSchema?.telephone || "+1-800-555-0199",
    "email": metadata?.organizationSchema?.email || "contact@ryzite.com",
    "priceRange": metadata?.serpSnippet?.priceRange || "$$$$",
    "description": metadata?.description,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": metadata?.serpSnippet?.starRating?.toString() || "4.9",
      "reviewCount": metadata?.serpSnippet?.reviewCount?.toString() || "142"
    }
  };

  const servicesCatalog = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "Ryzite Engineering Services",
    "itemListElement": services.map(s => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": s.title,
        "description": s.shortDescription
      }
    }))
  };

  res.json({
    organizationSchema: orgSchema,
    servicesCatalog: servicesCatalog,
    rawJsonLd: `<script type="application/ld+json">\n${JSON.stringify(orgSchema, null, 2)}\n</script>`
  });
};
