export type ServiceCategory = 
  | 'web'
  | 'mobile'
  | 'ai-automation'
  | 'cloud-devops'
  | 'consulting';

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  features: string[];
  deliverables: string[];
  techStack: string[];
  timeline: string;
  startingPrice: string;
  order: number;
  featured: boolean;
}

export interface SolutionItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  fullDescription: string;
  iconName: string;
  benefits: string[];
  features: string[];
  architectureHighlights: string[];
  useCases: string[];
  techStack: string[];
  relatedCaseStudySlug?: string;
  metaTitle: string;
  metaDescription: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  description: string;
  longDescription: string;
  heroImage: string;
  mockupType: 'dark-dashboard' | 'mobile-cards' | 'bot-interface' | 'analytics-suite';
  metrics: {
    label: string;
    value: string;
    trend?: string;
  }[];
  techStack: string[];
  challenges: string[];
  solutions: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  };
  liveUrl?: string;
  featured: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  coverImage: string;
  metaTitle: string;
  metaDescription: string;
  aeoDirectAnswer: string;
}

export interface HomeHeroConfig {
  badgeText?: string;
  headingPrefix: string;
  headingHighlight?: string;
  headingSuffix?: string;
  description: string;

  primaryCtaText?: string;
  primaryCtaUrl?: string;
  primaryCtaEnabled: boolean;
  primaryCtaOpenNewTab?: boolean;

  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaType?: 'consultation' | 'link';
  secondaryCtaEnabled: boolean;
  secondaryCtaOpenNewTab?: boolean;

  backgroundImageUrl?: string | null;
  backgroundImageAlt?: string | null;

  enabled: boolean;
  displayOrder?: number;
  updatedAt?: string;
}

export interface TrustedClientItem {
  id: string;
  name: string;
  companyName?: string | null;
  slug?: string;
  logoUrl?: string | null;
  logoAltText?: string | null;
  websiteUrl?: string | null;
  description?: string | null;
  caseStudySlug?: string | null;
  featured: boolean;
  enabled: boolean;
  displayOrder: number;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'IN_DISCUSSION' | 'PROPOSAL_SENT' | 'WON' | 'LOST';

export interface LeadItem {
  id: string;
  name: string;
  email: string;
  company?: string;
  serviceSelected: string;
  budget: string;
  timeline: string;
  message: string;
  status: LeadStatus;
  notes?: string;
  source?: string;
  createdAt: string;
}

export interface SeoFocusKeyword {
  id: string;
  keyword: string;
  searchVolume: string;
  difficulty: 'Low' | 'Medium' | 'High';
  targetPage: string;
  targetPosition: string;
  currentDensity: number;
  status: 'OPTIMIZED' | 'NEEDS_ATTENTION' | 'OPPORTUNITY';
}

export interface SerpSnippetConfig {
  pageTitle: string;
  metaDescription: string;
  slug: string;
  breadcrumb: string;
  displayUrl: string;
  enableRichSnippets: boolean;
  starRating: number;
  reviewCount: number;
  priceRange: string;
  sitelinks: { label: string; url: string; description: string }[];
  aiOverviewAnswer: string;
  aiKeyTakeaways: string[];
}

export interface SeoAuditCheck {
  id: string;
  category: 'TITLE' | 'DESCRIPTION' | 'SCHEMA' | 'SPEED' | 'SOCIAL' | 'AEO';
  title: string;
  description: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
}

export interface PageMetadataConfig {
  pageKey?: string;
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  keywords?: string[];
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  siteName?: string;
  twitterHandle?: string;
  themeColor?: string;
  serpSnippet?: SerpSnippetConfig;
  focusKeywords?: SeoFocusKeyword[];
  organizationSchema: {
    name: string;
    url: string;
    logo: string;
    telephone: string;
    email: string;
    address: string;
    sameAs: string[];
  };
}

export interface CoreWebVitalsMetrics {
  lcp: number;
  inp: number;
  cls: number;
  ttfb: number;
  fcp: number;
  score: number;
}

export interface SiteAnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  leadConversionRate: number;
  avgSessionDuration: string;
  topPages: { path: string; views: number }[];
  referrers: { source: string; count: number }[];
  dailyViews: { date: string; views: number; leads: number }[];
}
