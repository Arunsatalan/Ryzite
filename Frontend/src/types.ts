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
  imageUrl?: string;
  imagePublicId?: string;
  imageAlt?: string;
  active?: boolean;
  displayOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  features?: string[];
  deliverables?: string[];
  techStack?: string[];
  timeline: string;
  startingPrice: string;
  order?: number;
  featured?: boolean;
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

export interface ProjectMetricItem {
  id?: string;
  label: string;
  value: string;
  trend?: string | null;
  description?: string | null;
  displayOrder?: number;
}

export interface ProjectHighlightItem {
  id?: string;
  title: string;
  description?: string | null;
  displayOrder?: number;
}

export interface ProjectChallengeItem {
  id?: string;
  title: string;
  description?: string | null;
  impact?: string | null;
  icon?: string | null;
  displayOrder?: number;
}

export interface ProjectSolutionItem {
  id?: string;
  title: string;
  description?: string | null;
  codeSnippet?: string | null;
  diagramUrl?: string | null;
  icon?: string | null;
  displayOrder?: number;
}

export interface ProjectResultItem {
  id?: string;
  title?: string | null;
  metricName?: string | null;
  beforeValue?: string | null;
  afterValue?: string | null;
  percentageChange?: string | null;
  timeframe?: string | null;
  beforeText?: string;
  afterText?: string;
  displayOrder?: number;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  heroTitle?: string | null;
  subtitle?: string | null;
  client?: string;
  clientName?: string;
  clientLogoUrl?: string | null;
  clientLogoPublicId?: string | null;
  clientWebsiteUrl?: string | null;
  category: string;
  description?: string;
  shortDescription?: string;
  longDescription?: string;
  fullDescription?: string;
  heroImage: string;
  heroImagePublicId?: string | null;
  coverImageUrl?: string | null;
  coverImagePublicId?: string | null;
  architectureDiagramUrl?: string | null;
  architectureDiagramPublicId?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  businessImpactText?: string | null;
  galleryImages?: (string | { url: string; publicId?: string; caption?: string; order?: number })[] | any;
  mockupType: 'dark-dashboard' | 'mobile-cards' | 'bot-interface' | 'analytics-suite' | string;
  metrics: ProjectMetricItem[];
  highlights?: ProjectHighlightItem[];
  challengesList?: ProjectChallengeItem[];
  solutionsList?: ProjectSolutionItem[];
  resultsList?: ProjectResultItem[];
  techStack?: string[] | { category?: string; technology: { id: string; name: string; slug: string; iconUrl?: string | null } }[] | any;
  challenges?: string[];
  challenge?: string | null;
  solutions?: string[];
  solution?: string | null;
  results?: string | null;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company?: string;
    photoUrl?: string;
    avatar?: string;
  } | any;
  liveUrl?: string | null;
  websiteUrl?: string | null;
  githubUrl?: string | null;
  featured: boolean;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  displayOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  focusKeywords?: string;
  canonicalUrl?: string;
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    focusKeywords?: string;
  } | null;
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
    avatarPublicId?: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  coverImage: string;
  coverImagePublicId?: string;
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
  backgroundImagePublicId?: string | null;
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
  logoPublicId?: string | null;
  logoAltText?: string | null;
  websiteUrl?: string | null;
  description?: string | null;
  caseStudySlug?: string | null;
  featured: boolean;
  enabled: boolean;
  displayOrder: number;
}

export type StatisticStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export interface CompanyStatisticItem {
  id: string;
  value: string;
  prefix?: string | null;
  suffix?: string | null;
  label: string;
  description?: string | null;
  iconName?: string | null;
  iconColor?: string | null;
  animationEnabled: boolean;
  displayOrder: number;
  status: StatisticStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt?: string;
  updatedAt?: string;
}


export interface WhyChooseUsItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  iconKey: string;
  backgroundImageUrl?: string | null;
  backgroundImagePublicId?: string | null;
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

// ==========================================
// AEO / COMPANY FACTS / ENTITY KNOWLEDGE HUB
// ==========================================

export type FactCategory =
  | 'COMPANY'
  | 'SERVICES'
  | 'PRICING'
  | 'LOCATIONS'
  | 'CLIENTS'
  | 'PROJECTS'
  | 'TEAM'
  | 'SECURITY'
  | 'SUPPORT'
  | 'CONTACT'
  | 'POLICIES';

export type FactVerifiedStatus = 'VERIFIED' | 'UNVERIFIED' | 'REQUIRES_REVIEW' | 'EXPIRED';

export type ClaimType =
  | 'FACTUAL'
  | 'MARKETING'
  | 'ESTIMATE'
  | 'TESTIMONIAL'
  | 'CASE_STUDY_RESULT'
  | 'INTERNAL';

export type AuditSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface CompanyEntityConfig {
  id?: string;
  entityId: string;
  entityType: string;
  legalName: string;
  tradingName: string;
  shortDescription: string;
  longDescription: string;
  companyType: string;
  industry: string;
  foundedYear: number;
  canonicalUrl: string;
  logoUrl?: string | null;
  logoPublicId?: string | null;
  email: string;
  phone?: string | null;
  primaryCountry: string;
  headquarters: string;
  serviceAreas: string[];
  languages: string[];
  sameAs: string[];
  status?: string;
  updatedAt?: string;
}

export interface CompanyEvidenceItem {
  id: string;
  factId?: string | null;
  evidenceUrl: string;
  evidenceType: string;
  description?: string | null;
  evidenceDate?: string;
  status: FactVerifiedStatus;
}

export interface CompanyFactVersionItem {
  id: string;
  factId: string;
  oldValue: any;
  newValue: any;
  changedBy: string;
  reason?: string | null;
  createdAt: string;
}

export interface CompanyFactItem {
  id: string;
  category: FactCategory;
  claimType: ClaimType;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  sourceUrl?: string | null;
  sourceType?: string | null;
  evidenceNote?: string | null;
  verifiedStatus: FactVerifiedStatus;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  status: StatisticStatus;
  priority: number;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
  evidence?: CompanyEvidenceItem[];
  versions?: CompanyFactVersionItem[];
}

export interface CompanyFaqItem {
  id: string;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  relatedServiceId?: string | null;
  relatedPage?: string | null;
  evidenceUrl?: string | null;
  status: StatisticStatus;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyExpertiseItem {
  id: string;
  topic: string;
  description: string;
  priority: number;
  active: boolean;
  displayOrder: number;
  relatedServices: string[];
  relatedProjects: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AeoHealthScore {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: {
    entityIdentity: number;
    factCompleteness: number;
    evidenceCitations: number;
    structuredSchema: number;
    contentStructure: number;
    internalLinking: number;
    freshness: number;
    consistency: number;
  };
  totals: {
    totalFacts: number;
    verifiedFacts: number;
    unverifiedFacts: number;
    requiresReviewFacts: number;
    totalFaqs: number;
    totalExpertise: number;
    openAuditIssues: number;
  };
  lastEvaluatedAt: string;
}

export interface AeoAuditIssueItem {
  id: string;
  severity: AuditSeverity;
  category: string;
  issue: string;
  recommendation: string;
  pageRoute?: string | null;
  status: string;
  createdAt: string;
}

// ==========================================
// ABOUT PAGE CMS TYPES
// ==========================================

export interface AboutHighlightItem {
  id?: string;
  aboutPageId?: string;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
  active: boolean;
}

export interface AboutCapabilityItem {
  id?: string;
  aboutPageId?: string;
  title: string;
  description: string;
  icon: string;
  serviceId?: string | null;
  displayOrder: number;
  active: boolean;
}

export interface AboutValueItem {
  id?: string;
  aboutPageId?: string;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
  active: boolean;
}

export interface AboutTimelineItem {
  id?: string;
  aboutPageId?: string;
  year: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  imageAlt?: string | null;
  displayOrder: number;
  active: boolean;
}

export interface AboutTeamMemberItem {
  id?: string;
  aboutPageId?: string;
  name: string;
  role: string;
  shortBio: string;
  photoUrl?: string | null;
  photoPublicId?: string | null;
  photoAlt?: string | null;
  linkedInUrl?: string | null;
  displayOrder: number;
  active: boolean;
}

export interface AboutIndustryItem {
  id?: string;
  aboutPageId?: string;
  industry: string;
  description: string;
  icon: string;
  relatedServices?: string[];
  displayOrder: number;
  active: boolean;
}

export interface AboutPageVersionItem {
  id: string;
  aboutPageId: string;
  snapshot: any;
  changedBy: string;
  reason?: string | null;
  createdAt: string;
}

export interface AboutPageConfig {
  id?: string;
  slug?: string;

  // Hero Section
  heroLabel: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl?: string | null;
  heroImagePublicId?: string | null;
  heroImageAlt?: string | null;
  heroCtaText?: string | null;
  heroCtaUrl?: string | null;
  heroActive: boolean;

  // Company Intro
  introTitle: string;
  introShort: string;
  introFull: string;
  introActive: boolean;

  // Who We Are & Mission / Vision
  whoWeAreTitle: string;
  whoWeAreDescription: string;
  whoWeAreImageUrl?: string | null;
  whoWeAreImagePublicId?: string | null;
  whoWeAreImageAlt?: string | null;
  whoWeAreActive: boolean;

  missionTitle: string;
  missionDescription: string;
  missionImageUrl?: string | null;
  missionImagePublicId?: string | null;
  missionImageAlt?: string | null;
  missionActive: boolean;

  visionTitle: string;
  visionDescription: string;
  visionImageUrl?: string | null;
  visionImagePublicId?: string | null;
  visionImageAlt?: string | null;
  visionActive: boolean;

  // CTA Section
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonUrl: string;
  ctaSecondaryText?: string | null;
  ctaSecondaryUrl?: string | null;
  ctaActive: boolean;

  // Display Toggles
  showTrustedClients: boolean;
  useGlobalWhyChooseUs: boolean;
  showStatistics: boolean;
  showCapabilities: boolean;
  showTeam: boolean;
  showTimeline: boolean;
  showFaqs: boolean;
  showIndustries: boolean;

  // SEO & AEO Metadata
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  ogImagePublicId?: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  focusTopic?: string | null;

  whoIsDirectAnswer?: string | null;
  whatWeDoDirectAnswer?: string | null;

  status: StatisticStatus;
  publishedAt?: string | null;
  publishedBy?: string | null;
  updatedAt?: string;

  highlights?: AboutHighlightItem[];
  capabilities?: AboutCapabilityItem[];
  values?: AboutValueItem[];
  timeline?: AboutTimelineItem[];
  teamMembers?: AboutTeamMemberItem[];
  industries?: AboutIndustryItem[];
  versions?: AboutPageVersionItem[];
}

export interface AboutPageFullPayload {
  page: AboutPageConfig;
  highlights: AboutHighlightItem[];
  capabilities: AboutCapabilityItem[];
  values: AboutValueItem[];
  timeline: AboutTimelineItem[];
  teamMembers: AboutTeamMemberItem[];
  industries: AboutIndustryItem[];

  // Referenced Single Source of Truth CMS items
  statistics?: CompanyStatisticItem[];
  trustedClients?: TrustedClientItem[];
  whyChooseUs?: WhyChooseUsItem[];
  expertise?: CompanyExpertiseItem[];
  faqs?: CompanyFaqItem[];
}

// ==========================================
// TECHNICAL LEADERSHIP TEAM CMS TYPES
// ==========================================

export interface LeadershipTeamMemberItem {
  id: string;
  name: string;
  slug: string;
  title: string;
  shortBio: string;
  longBio?: string | null;
  profileImageUrl: string;
  profileImagePublicId: string;
  profileImageAlt: string;
  profileImageWidth?: number | null;
  profileImageHeight?: number | null;
  expertise: string[];
  technologies: string[];
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  displayOrder: number;
  status: StatisticStatus;
  isActive: boolean;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;

  // Formatted public response image
  profileImage?: {
    url: string;
    alt: string;
    publicId?: string;
    width?: number;
    height?: number;
  };
}

// ==========================================
// ENTERPRISE FAQ CMS TYPES
// ==========================================

export interface FaqCategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface FaqCmsItem {
  id: string;
  question: string;
  slug: string;
  answer: string;
  answerContent?: string;
  shortAnswer?: string;
  directAnswer?: string;
  plainTextAnswer?: string;
  categoryId?: string | null;
  category?: FaqCategoryItem | null;
  faqType: 'GENERAL' | 'SERVICE' | 'PRODUCT' | 'PROJECT' | 'TECHNICAL' | 'PRICING' | 'PROCESS' | 'SECURITY' | 'COMPANY' | 'SUPPORT';
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  displayOrder: number;
  featured: boolean;
  isGlobal: boolean;
  indexable: boolean;
  views: number;
  expands: number;
  helpfulCount: number;
  unhelpfulCount: number;
  notHelpfulCount?: number;
  qualityScore: number;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  imageCaption?: string | null;
  image?: {
    url: string;
    alt: string;
    publicId?: string;
  } | null;
  seoTitle?: string;
  seoDescription?: string;
  keywords: string[];
  seo?: {
    seoTitle?: string;
    seoDescription?: string;
    canonicalUrl?: string;
  };
  source?: {
    type?: string;
    url?: string;
    note?: string;
  };
  services?: Array<{ id: string; title: string; slug: string }>;
  projects?: Array<{ id: string; title: string; slug: string }>;
  relatedFaqs?: Array<{ id: string; question: string; slug: string; shortAnswer: string }>;
  lastReviewedAt?: string;
  reviewDueAt?: string | null;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FaqAnalyticsSummary {
  total: number;
  published: number;
  draft: number;
  archived: number;
  needsReview: number;
  helpfulRatePercent: number;
  topSearches: string[];
  noResultSearches: string[];
}

// ==========================================
// ENTERPRISE BLOG CMS TYPES
// ==========================================

export interface BlogCategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  displayOrder: number;
  active: boolean;
  postsCount?: number;
}

export interface BlogAuthorItem {
  id: string;
  name: string;
  slug: string;
  role: string;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
  avatarAlt?: string | null;
  bio?: string | null;
  email?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  websiteUrl?: string | null;
  postsCount?: number;
}

export interface BlogTagItem {
  id: string;
  name: string;
  slug: string;
  postsCount?: number;
}

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  directAnswer?: string | null;
  keyTakeaways: string[];
  
  categoryId?: string | null;
  category?: BlogCategoryItem | null;
  authorId?: string | null;
  author?: BlogAuthorItem | null;
  clusterId?: string | null;

  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  postType: 'ARTICLE' | 'GUIDE' | 'CASE_STUDY_INSIGHT' | 'TECHNICAL_WHITE_PAPER' | 'PILLAR_PAGE' | 'NEWS';
  searchIntent: 'INFORMATIONAL' | 'COMMERCIAL' | 'TRANSACTIONAL' | 'NAVIGATIONAL';
  
  targetKeyword?: string | null;
  secondaryKeywords: string[];
  
  featured: boolean;
  coverImageUrl?: string | null;
  coverImagePublicId?: string | null;
  coverImageAlt?: string | null;
  
  wordCount: number;
  readingTimeMinutes: number;
  qualityScore: number;
  views: number;
  
  tags?: BlogTagItem[];
  services?: Array<{ id: string; title: string; slug: string }>;
  projects?: Array<{ id: string; title: string; slug: string }>;
  faqs?: Array<{ id: string; question: string; slug: string; shortAnswer: string }>;
  relatedPosts?: BlogPostItem[];
  
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  ogImageUrl?: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  
  publishedAt?: string | null;
  scheduledFor?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogAnalyticsSummary {
  total: number;
  published: number;
  draft: number;
  archived: number;
  totalViews: number;
  totalCategories: number;
  totalAuthors: number;
}

// ==========================================
// FINAL CTA SYSTEM TYPES
// ==========================================

export type CtaActionType =
  | 'CONTACT_FORM'
  | 'CONTACT_PAGE'
  | 'BOOK_CALL'
  | 'SERVICE_PAGE'
  | 'PORTFOLIO_PAGE'
  | 'BLOG_PAGE'
  | 'CUSTOM_ROUTE'
  | 'EXTERNAL_URL'
  | 'DOWNLOAD'
  | 'EMAIL';

export type CtaBackgroundType = 'SOLID' | 'GRADIENT' | 'IMAGE' | 'IMAGE_GRADIENT' | 'DARK' | 'LIGHT';

export interface FinalCtaItem {
  id: string;
  name: string;
  eyebrow?: string | null;
  headline: string;
  highlightedText?: string | null;
  description?: string | null;
  supportingText?: string | null;
  primaryLabel: string;
  primaryActionType: CtaActionType;
  primaryActionUrl?: string | null;
  secondaryLabel?: string | null;
  secondaryActionType?: CtaActionType | null;
  secondaryActionUrl?: string | null;
  tertiaryLabel?: string | null;
  tertiaryActionType?: CtaActionType | null;
  tertiaryActionUrl?: string | null;
  variant?: string;
  theme?: 'DARK' | 'LIGHT' | string;
  backgroundType?: CtaBackgroundType;
  backgroundImageUrl?: string | null;
  backgroundImagePublicId?: string | null;
  backgroundImageAlt?: string | null;
  mobileBackgroundImageUrl?: string | null;
  mobileBackgroundImagePublicId?: string | null;
  overlayEnabled?: boolean;
  overlayOpacity?: number;
  showTrustLine?: boolean;
  showTertiaryAction?: boolean;
  showContactInfo?: boolean;
  contactEmail?: string | null;
  contactPhone?: string | null;
  showTrustedClients?: boolean;
  showCaseStudies?: boolean;
  isActive?: boolean;
  isGlobal?: boolean;
  priority?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'SCHEDULED' | 'ARCHIVED' | string;
  pageTarget?: string;
  startAt?: string | null;
  endAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  source?: 'OVERRIDE' | 'GLOBAL' | 'FALLBACK';
  isFallback?: boolean;
  overrides?: FinalCtaOverrideItem[];

  // Analytics metrics returned by admin APIs
  impressions?: number;
  primaryClicks?: number;
  secondaryClicks?: number;
  tertiaryClicks?: number;
  totalClicks?: number;
  contactStarts?: number;
  leads?: number;
  ctr?: number;
  primaryCtr?: number;
  secondaryCtr?: number;
  leadConversionRate?: number;
}

export interface FinalCtaOverrideItem {
  id: string;
  ctaId: string;
  cta?: FinalCtaItem;
  pageType: 'home' | 'service' | 'portfolio' | 'blog' | 'case_study' | 'about' | 'contact' | string;
  pageId?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface FinalCtaVersionItem {
  id: string;
  ctaId: string;
  snapshot: Partial<FinalCtaItem>;
  changedBy: string;
  changeReason?: string | null;
  createdAt: string;
}

export interface CtaAnalyticsSummary {
  activeCtaCount: number;
  totalImpressions: number;
  totalClicks: number;
  primaryClicks: number;
  secondaryClicks: number;
  tertiaryClicks: number;
  contactStarts: number;
  leads: number;
  ctr: number;
  conversionRate: number;
  performanceByPage?: Array<{
    pageType: string;
    impressions: number;
    clicks: number;
    ctr: number;
  }>;
}

export interface CtaHealthCheckItem {
  name: string;
  passed: boolean;
  details?: string;
}

export interface CtaHealthScore {
  score: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'NOT_FOUND';
  checks: CtaHealthCheckItem[];
}





