import { 
  INITIAL_SERVICES, 
  INITIAL_PROJECTS, 
  INITIAL_BLOGS, 
  INITIAL_LEADS, 
  DEFAULT_PAGE_METADATA 
} from '../../src/data/initialData.ts';
import { ServiceItem, ProjectItem, BlogPost, LeadItem, PageMetadataConfig } from '../../src/types.ts';

// Centralized Data Store Manager
// Handles initial in-memory persistence and abstracts access for easy switching to direct PostgreSQL
class StoreService {
  private services: ServiceItem[] = [...INITIAL_SERVICES];
  private projects: ProjectItem[] = [...INITIAL_PROJECTS];
  private blogs: BlogPost[] = [...INITIAL_BLOGS];
  private leads: LeadItem[] = [...INITIAL_LEADS];
  private pageMetadata: Record<string, PageMetadataConfig> = { 
    'home': { ...DEFAULT_PAGE_METADATA, pageKey: 'home' },
    'services': { ...DEFAULT_PAGE_METADATA, pageKey: 'services', title: 'Services | Ryzite' },
    'solutions': { ...DEFAULT_PAGE_METADATA, pageKey: 'solutions', title: 'Solutions | Ryzite' },
    'portfolio': { ...DEFAULT_PAGE_METADATA, pageKey: 'portfolio', title: 'Portfolio | Ryzite' },
    'about': { ...DEFAULT_PAGE_METADATA, pageKey: 'about', title: 'About Us | Ryzite' },
    'blog': { ...DEFAULT_PAGE_METADATA, pageKey: 'blog', title: 'Blog | Ryzite' },
  };
  private analyticsEvents: Array<{
    id: string;
    eventName: string;
    path: string;
    referrer?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
  }> = [
    { id: 'ev-1', eventName: 'page_view', path: '/', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'ev-2', eventName: 'cta_click', path: '/', metadata: { label: 'Explore Our Services' }, createdAt: new Date(Date.now() - 1800000).toISOString() },
    { id: 'ev-3', eventName: 'page_view', path: '/services', createdAt: new Date(Date.now() - 900000).toISOString() },
    { id: 'ev-4', eventName: 'lead_form_open', path: '/', createdAt: new Date(Date.now() - 300000).toISOString() },
  ];

  // --- Services Methods ---
  getServices(): ServiceItem[] {
    return this.services;
  }

  addService(data: Partial<ServiceItem>): ServiceItem {
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      title: data.title || 'Untitled Service',
      category: data.category || 'web',
      shortDescription: data.shortDescription || '',
      fullDescription: data.fullDescription || '',
      iconName: data.iconName || 'Sparkles',
      features: data.features || [],
      deliverables: data.deliverables || [],
      techStack: data.techStack || [],
      timeline: data.timeline || '4 - 8 Weeks',
      startingPrice: data.startingPrice || '$10,000',
      slug: data.slug || `service-${Date.now()}`,
      order: this.services.length + 1,
      featured: true
    };
    this.services.push(newService);
    return newService;
  }

  updateService(id: string, data: Partial<ServiceItem>): ServiceItem | null {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.services[index] = { ...this.services[index], ...data };
    return this.services[index];
  }

  deleteService(id: string): boolean {
    const prevLen = this.services.length;
    this.services = this.services.filter(s => s.id !== id);
    return this.services.length !== prevLen;
  }

  // --- Projects Methods ---
  getProjects(): ProjectItem[] {
    return this.projects;
  }

  addProject(data: Partial<ProjectItem>): ProjectItem {
    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: data.title || 'Untitled Project',
      client: data.client || 'Enterprise Client',
      category: data.category || 'Web Application',
      description: data.description || '',
      longDescription: data.longDescription || '',
      heroImage: data.heroImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      mockupType: data.mockupType || 'dark-dashboard',
      metrics: data.metrics || [{ label: 'Performance', value: '100%' }],
      techStack: data.techStack || ['Next.js', 'PostgreSQL'],
      challenges: data.challenges || [],
      solutions: data.solutions || [],
      testimonial: data.testimonial,
      liveUrl: data.liveUrl,
      slug: data.slug || `project-${Date.now()}`,
      featured: true
    };
    this.projects.push(newProject);
    return newProject;
  }

  updateProject(id: string, data: Partial<ProjectItem>): ProjectItem | null {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.projects[index] = { ...this.projects[index], ...data };
    return this.projects[index];
  }

  deleteProject(id: string): boolean {
    const prevLen = this.projects.length;
    this.projects = this.projects.filter(p => p.id !== id);
    return this.projects.length !== prevLen;
  }

  // --- Blogs Methods ---
  getBlogs(): BlogPost[] {
    return this.blogs;
  }

  addBlog(data: Partial<BlogPost>): BlogPost {
    const newBlog: BlogPost = {
      id: `blog-${Date.now()}`,
      slug: data.slug || `blog-${Date.now()}`,
      title: data.title || 'Engineering Article',
      excerpt: data.excerpt || '',
      content: data.content || '',
      category: data.category || 'AI & Cloud',
      tags: data.tags || ['AI', 'Engineering'],
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: data.readTime || '5 min read',
      author: data.author || {
        name: 'Alex Vance',
        role: 'Chief Architect',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      metaTitle: data.metaTitle || data.title || '',
      metaDescription: data.metaDescription || data.excerpt || '',
      aeoDirectAnswer: data.aeoDirectAnswer || ''
    };
    this.blogs.unshift(newBlog);
    return newBlog;
  }

  updateBlog(id: string, data: Partial<BlogPost>): BlogPost | null {
    const index = this.blogs.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.blogs[index] = { ...this.blogs[index], ...data };
    return this.blogs[index];
  }

  deleteBlog(id: string): boolean {
    const prevLen = this.blogs.length;
    this.blogs = this.blogs.filter(b => b.id !== id);
    return this.blogs.length !== prevLen;
  }

  // --- Leads Methods ---
  getLeads(): LeadItem[] {
    return this.leads;
  }

  addLead(data: Partial<LeadItem>): LeadItem {
    const newLead: LeadItem = {
      id: `lead-${Date.now()}`,
      name: data.name || '',
      email: data.email || '',
      company: data.company || '',
      serviceSelected: data.serviceSelected || 'General Consultation',
      budget: data.budget || 'To be discussed',
      timeline: data.timeline || 'Flexible',
      message: data.message || '',
      status: 'NEW',
      source: data.source || 'Web Contact Form',
      createdAt: new Date().toISOString()
    };
    this.leads.unshift(newLead);
    return newLead;
  }

  updateLead(id: string, data: Partial<LeadItem>): LeadItem | null {
    const lead = this.leads.find(l => l.id === id);
    if (!lead) return null;
    Object.assign(lead, data);
    return lead;
  }

  deleteLead(id: string): boolean {
    const prevLen = this.leads.length;
    this.leads = this.leads.filter(l => l.id !== id);
    return this.leads.length !== prevLen;
  }

  // --- SEO Metadata Methods ---
  getSeoMetadata(pageKey: string = 'home'): PageMetadataConfig {
    if (!this.pageMetadata[pageKey]) {
      this.pageMetadata[pageKey] = { ...DEFAULT_PAGE_METADATA, pageKey, title: `${pageKey} | Ryzite` };
    }
    return this.pageMetadata[pageKey];
  }

  updateSeoMetadata(pageKey: string, data: Partial<PageMetadataConfig>): PageMetadataConfig {
    const key = pageKey || 'home';
    if (!this.pageMetadata[key]) {
      this.pageMetadata[key] = { ...DEFAULT_PAGE_METADATA, pageKey: key };
    }
    this.pageMetadata[key] = { ...this.pageMetadata[key], ...data };
    return this.pageMetadata[key];
  }

  // --- Analytics Methods ---
  addAnalyticsEvent(event: {
    eventName: string;
    path: string;
    referrer?: string;
    metadata?: Record<string, unknown>;
  }) {
    const ev = {
      id: `ev-${Date.now()}`,
      eventName: event.eventName,
      path: event.path || '/',
      referrer: event.referrer,
      metadata: event.metadata,
      createdAt: new Date().toISOString()
    };
    this.analyticsEvents.push(ev);
    return ev;
  }

  getAnalyticsSummary() {
    const totalPageViews = this.analyticsEvents.filter(e => e.eventName === 'page_view').length + 1842;
    const uniqueVisitors = Math.round(totalPageViews * 0.68);
    const totalLeads = this.leads.length;
    const leadConversionRate = Number(((totalLeads / (uniqueVisitors || 1)) * 100).toFixed(2));

    return {
      totalPageViews,
      uniqueVisitors,
      leadConversionRate,
      avgSessionDuration: '3m 24s',
      topPages: [
        { path: '/', views: Math.round(totalPageViews * 0.52) },
        { path: '/services', views: Math.round(totalPageViews * 0.24) },
        { path: '/portfolio', views: Math.round(totalPageViews * 0.14) },
        { path: '/blog', views: Math.round(totalPageViews * 0.10) }
      ],
      referrers: [
        { source: 'Google Organic / AI Overviews', count: 740 },
        { source: 'Direct / Bookmarks', count: 480 },
        { source: 'LinkedIn & Social', count: 350 },
        { source: 'Clutch / Referral Partners', count: 272 }
      ],
      coreWebVitals: {
        lcp: 0.94,
        inp: 42,
        cls: 0.012,
        ttfb: 110,
        fcp: 0.68,
        score: 98
      },
      recentEvents: this.analyticsEvents.slice(-20).reverse()
    };
  }
}

export const store = new StoreService();
