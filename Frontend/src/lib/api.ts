import { ServiceItem, ProjectItem, BlogPost, PageMetadataConfig, LeadItem, SolutionItem, HomeHeroConfig } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error [${res.status}]: ${errorText}`);
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

export const api = {
  getHomeHero: () => fetchApi<HomeHeroConfig>('/api/home/hero', { cache: 'no-store' }),
  updateHomeHero: (data: Partial<HomeHeroConfig>) => fetchApi<HomeHeroConfig>('/api/home/hero', { method: 'PUT', body: JSON.stringify(data) }),

  getServices: () => fetchApi<ServiceItem[]>('/api/services'),
  getServiceBySlug: (slug: string) => fetchApi<ServiceItem>(`/api/services/${slug}`),
  createService: (data: any) => fetchApi<ServiceItem>('/api/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id: string, data: any) => fetchApi<ServiceItem>(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id: string) => fetchApi<{ success: boolean }>(`/api/services/${id}`, { method: 'DELETE' }),

  getProjects: () => fetchApi<ProjectItem[]>('/api/projects'),
  getProjectBySlug: (slug: string) => fetchApi<ProjectItem>(`/api/projects/${slug}`),
  createProject: (data: any) => fetchApi<ProjectItem>('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => fetchApi<ProjectItem>(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) => fetchApi<{ success: boolean }>(`/api/projects/${id}`, { method: 'DELETE' }),

  getBlogs: () => fetchApi<BlogPost[]>('/api/blogs'),
  getBlogBySlug: (slug: string) => fetchApi<BlogPost>(`/api/blogs/${slug}`),
  createBlog: (data: any) => fetchApi<BlogPost>('/api/blogs', { method: 'POST', body: JSON.stringify(data) }),
  updateBlog: (id: string, data: any) => fetchApi<BlogPost>(`/api/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBlog: (id: string) => fetchApi<{ success: boolean }>(`/api/blogs/${id}`, { method: 'DELETE' }),

  getSolutions: () => fetchApi<SolutionItem[]>('/api/solutions'),
  getSolutionBySlug: (slug: string) => fetchApi<SolutionItem>(`/api/solutions/${slug}`),

  getSeo: (pageKey: string = 'home') => fetchApi<PageMetadataConfig>(`/api/seo?pageKey=${pageKey}`, { cache: 'no-store' }),
  updateSeo: (pageKey: string, data: any) => fetchApi<PageMetadataConfig>(`/api/seo?pageKey=${pageKey}`, { method: 'PUT', body: JSON.stringify(data) }),
  getSeoAudit: () => fetchApi<any>('/api/seo/audit'),

  getLeads: (status: string = 'ALL') => fetchApi<LeadItem[]>(`/api/leads${status && status !== 'ALL' ? `?status=${status}` : ''}`, { cache: 'no-store' }),
  createLead: (data: any) => fetchApi<LeadItem>('/api/leads', { method: 'POST', body: JSON.stringify(data) }),
  updateLeadStatus: (id: string, status: string, notes?: string) => fetchApi<LeadItem>(`/api/leads/${id}`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
  deleteLead: (id: string) => fetchApi<{ success: boolean }>(`/api/leads/${id}`, { method: 'DELETE' }),

  getAnalyticsSummary: () => fetchApi<any>('/api/analytics/summary', { cache: 'no-store' }),
  getSiteSettings: () => fetchApi<any>('/api/settings'),
  getHomePageContent: () => fetchApi<any>('/api/home')
};
