import { ServiceItem, ProjectItem, BlogPost, PageMetadataConfig, LeadItem, SolutionItem, HomeHeroConfig, TrustedClientItem, CompanyStatisticItem, WhyChooseUsItem } from '../types';

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
  uploadImage: (file: File): Promise<{ url: string; filename: string; relativePath: string; public_id?: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetchApi<{ url: string; filename: string; relativePath: string; public_id?: string }>('/api/upload', {
            method: 'POST',
            body: JSON.stringify({
              filename: file.name,
              fileData: reader.result
            })
          });
          resolve(res);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  uploadCloudinaryImage: (file: File, folder: string = 'ryzite/uploads'): Promise<{ url: string; public_id: string; format?: string; width?: number; height?: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetchApi<{ url: string; public_id: string; format?: string; width?: number; height?: number }>('/api/upload/cloudinary', {
            method: 'POST',
            body: JSON.stringify({
              filename: file.name,
              fileData: reader.result,
              folder
            })
          });
          resolve(res);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  deleteCloudinaryImage: (publicId: string): Promise<{ success: boolean; message?: string }> => {
    return fetchApi<{ success: boolean; message?: string }>('/api/upload/cloudinary', {
      method: 'DELETE',
      body: JSON.stringify({ publicId })
    });
  },


  getHomeHero: () => fetchApi<HomeHeroConfig>('/api/home/hero', { cache: 'no-store' }),
  updateHomeHero: (data: Partial<HomeHeroConfig>) => fetchApi<HomeHeroConfig>('/api/home/hero', { method: 'PUT', body: JSON.stringify(data) }),

  getTrustedClients: () => fetchApi<TrustedClientItem[]>('/api/trusted-clients', { cache: 'no-store' }),
  getAdminTrustedClients: () => fetchApi<TrustedClientItem[]>('/api/trusted-clients/admin', { cache: 'no-store' }),
  createTrustedClient: (data: any) => fetchApi<TrustedClientItem>('/api/trusted-clients', { method: 'POST', body: JSON.stringify(data) }),
  updateTrustedClient: (id: string, data: any) => fetchApi<TrustedClientItem>(`/api/trusted-clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTrustedClient: (id: string) => fetchApi<{ success: boolean }>(`/api/trusted-clients/${id}`, { method: 'DELETE' }),
  reorderTrustedClients: (orderedIds: string[]) => fetchApi<TrustedClientItem[]>('/api/trusted-clients/reorder', { method: 'PATCH', body: JSON.stringify({ orderedIds }) }),

  getWhyChooseUs: () => fetchApi<WhyChooseUsItem[]>('/api/why-choose-us', { cache: 'no-store' }),
  getAdminWhyChooseUs: () => fetchApi<WhyChooseUsItem[]>('/api/why-choose-us/admin', { cache: 'no-store' }),
  createWhyChooseUs: (data: any) => fetchApi<WhyChooseUsItem>('/api/why-choose-us', { method: 'POST', body: JSON.stringify(data) }),
  updateWhyChooseUs: (id: string, data: any) => fetchApi<WhyChooseUsItem>(`/api/why-choose-us/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWhyChooseUs: (id: string) => fetchApi<{ success: boolean }>(`/api/why-choose-us/${id}`, { method: 'DELETE' }),
  reorderWhyChooseUs: (orderedIds: string[]) => fetchApi<WhyChooseUsItem[]>('/api/why-choose-us/reorder', { method: 'PATCH', body: JSON.stringify({ orderedIds }) }),

  getPublicStatistics: () => fetchApi<CompanyStatisticItem[]>('/api/statistics', { cache: 'no-store' }),
  getAdminStatistics: () => fetchApi<CompanyStatisticItem[]>('/api/admin/statistics', { cache: 'no-store', headers: { 'x-admin-token': 'admin-jwt-token' } }),
  createStatistic: (data: any) => fetchApi<CompanyStatisticItem>('/api/admin/statistics', { method: 'POST', headers: { 'x-admin-token': 'admin-jwt-token' }, body: JSON.stringify(data) }),
  updateStatistic: (id: string, data: any) => fetchApi<CompanyStatisticItem>(`/api/admin/statistics/${id}`, { method: 'PUT', headers: { 'x-admin-token': 'admin-jwt-token' }, body: JSON.stringify(data) }),
  deleteStatistic: (id: string) => fetchApi<{ success: boolean; message?: string }>(`/api/admin/statistics/${id}`, { method: 'DELETE', headers: { 'x-admin-token': 'admin-jwt-token' } }),
  updateStatisticStatus: (id: string, status: string) => fetchApi<CompanyStatisticItem>(`/api/admin/statistics/${id}/status`, { method: 'PATCH', headers: { 'x-admin-token': 'admin-jwt-token' }, body: JSON.stringify({ status }) }),
  reorderStatistics: (orderedIds: string[]) => fetchApi<CompanyStatisticItem[]>('/api/admin/statistics/order', { method: 'PATCH', headers: { 'x-admin-token': 'admin-jwt-token' }, body: JSON.stringify({ orderedIds }) }),


  uploadServiceImage: (file: File): Promise<{ url: string; filename: string; relativePath: string; public_id?: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetchApi<{ url: string; filename: string; relativePath: string; public_id?: string }>('/api/upload/service-image', {
            method: 'POST',
            body: JSON.stringify({
              filename: file.name,
              fileData: reader.result
            })
          });
          resolve(res);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  getServices: () => fetchApi<ServiceItem[]>('/api/services', { cache: 'no-store' }),
  getAdminServices: () => fetchApi<ServiceItem[]>('/api/services/admin', { cache: 'no-store' }),
  getServiceBySlug: (slug: string) => fetchApi<ServiceItem>(`/api/services/${slug}`),
  createService: (data: any) => fetchApi<ServiceItem>('/api/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id: string, data: any) => fetchApi<ServiceItem>(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id: string) => fetchApi<{ success: boolean }>(`/api/services/${id}`, { method: 'DELETE' }),
  reorderServices: (orderedIds: string[]) => fetchApi<ServiceItem[]>('/api/services/reorder', { method: 'PATCH', body: JSON.stringify({ orderedIds }) }),

  uploadProjectImage: (file: File): Promise<{ url: string; filename: string; relativePath: string; public_id?: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetchApi<{ url: string; filename: string; relativePath: string; public_id?: string }>('/api/upload/project-image', {
            method: 'POST',
            body: JSON.stringify({
              filename: file.name,
              fileData: reader.result
            })
          });
          resolve(res);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  getProjects: (category?: string) => fetchApi<ProjectItem[]>(`/api/projects${category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`, { cache: 'no-store' }),
  getProjectBySlug: (slug: string) => fetchApi<ProjectItem>(`/api/projects/${slug}`, { cache: 'no-store' }),
  getProjectCounts: () => fetchApi<{ total: number; published: number; featured: number; drafts: number }>('/api/admin/projects/counts', { cache: 'no-store', headers: { 'x-admin-token': 'admin-jwt-token' } }),
  getAdminProjects: (params: { search?: string; category?: string; status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    return fetchApi<ProjectItem[]>(`/api/admin/projects?${query.toString()}`, { cache: 'no-store', headers: { 'x-admin-token': 'admin-jwt-token' } });
  },
  createProject: (data: any) => fetchApi<ProjectItem>('/api/admin/projects', { method: 'POST', headers: { 'x-admin-token': 'admin-jwt-token' }, body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => fetchApi<ProjectItem>(`/api/admin/projects/${id}`, { method: 'PUT', headers: { 'x-admin-token': 'admin-jwt-token' }, body: JSON.stringify(data) }),
  deleteProject: (id: string) => fetchApi<{ success: boolean; message?: string }>(`/api/admin/projects/${id}`, { method: 'DELETE', headers: { 'x-admin-token': 'admin-jwt-token' } }),
  toggleProjectStatus: (id: string, status: string) => fetchApi<ProjectItem>(`/api/admin/projects/${id}/status`, { method: 'PATCH', headers: { 'x-admin-token': 'admin-jwt-token' }, body: JSON.stringify({ status }) }),
  toggleProjectFeatured: (id: string, featured: boolean) => fetchApi<ProjectItem>(`/api/admin/projects/${id}/featured`, { method: 'PATCH', headers: { 'x-admin-token': 'admin-jwt-token' }, body: JSON.stringify({ featured }) }),
  reorderProjects: (items: { id: string; displayOrder: number }[]) => fetchApi<ProjectItem[]>('/api/admin/projects/order', { method: 'PATCH', headers: { 'x-admin-token': 'admin-jwt-token' }, body: JSON.stringify({ items }) }),

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
  getHomePageContent: () => fetchApi<any>('/api/home'),

  // AEO & Entity Knowledge Hub API methods
  getCompanyEntity: () => fetchApi<any>('/api/company/entity', { cache: 'no-store' }),
  updateCompanyEntity: (data: any) => fetchApi<any>('/api/company/entity', { method: 'PUT', body: JSON.stringify(data) }),

  getCompanyFacts: (params?: { verifiedStatus?: string; category?: string; claimType?: string; status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.verifiedStatus) query.append('verifiedStatus', params.verifiedStatus);
    if (params?.category) query.append('category', params.category);
    if (params?.claimType) query.append('claimType', params.claimType);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    return fetchApi<any[]>(`/api/company/facts?${query.toString()}`, { cache: 'no-store' });
  },

  getPublicCompanyFacts: () => fetchApi<any>('/api/company-facts', { cache: 'no-store' }),
  createCompanyFact: (data: any) => fetchApi<any>('/api/company/facts', { method: 'POST', body: JSON.stringify(data) }),
  updateCompanyFact: (id: string, data: any) => fetchApi<any>(`/api/company/facts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCompanyFact: (id: string) => fetchApi<{ success: boolean }>(`/api/company/facts/${id}`, { method: 'DELETE' }),

  getCompanyFaqs: () => fetchApi<any[]>('/api/company/faqs', { cache: 'no-store' }),
  createCompanyFaq: (data: any) => fetchApi<any>('/api/company/faqs', { method: 'POST', body: JSON.stringify(data) }),
  updateCompanyFaq: (id: string, data: any) => fetchApi<any>(`/api/company/faqs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCompanyFaq: (id: string) => fetchApi<{ success: boolean }>(`/api/company/faqs/${id}`, { method: 'DELETE' }),

  getCompanyExpertise: () => fetchApi<any[]>('/api/company/expertise', { cache: 'no-store' }),
  createCompanyExpertise: (data: any) => fetchApi<any>('/api/company/expertise', { method: 'POST', body: JSON.stringify(data) }),
  updateCompanyExpertise: (id: string, data: any) => fetchApi<any>(`/api/company/expertise/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCompanyExpertise: (id: string) => fetchApi<{ success: boolean }>(`/api/company/expertise/${id}`, { method: 'DELETE' }),

  getAeoHealthScore: () => fetchApi<any>('/api/seo/health', { cache: 'no-store' }),
  runAeoAudit: () => fetchApi<any>('/api/seo/audit', { method: 'POST' }),
  getAeoIssues: () => fetchApi<any[]>('/api/seo/issues', { cache: 'no-store' }),

  // About Page CMS API methods
  getPublicAboutPage: () => fetchApi<any>('/api/about', { cache: 'no-store' }),
  getAdminAboutPage: () => fetchApi<any>('/api/admin/about', { cache: 'no-store' }),
  updateAboutDraft: (data: any) => fetchApi<any>('/api/admin/about', { method: 'PUT', body: JSON.stringify(data) }),
  publishAboutPage: (publishedBy: string = 'Admin User', reason?: string) => fetchApi<any>('/api/admin/about/publish', { method: 'POST', body: JSON.stringify({ publishedBy, reason }) }),
  unpublishAboutPage: () => fetchApi<any>('/api/admin/about/unpublish', { method: 'POST' }),
  getAboutPreview: () => fetchApi<any>('/api/about/preview', { cache: 'no-store' }),
  getAboutHistory: () => fetchApi<any[]>('/api/admin/about/history', { cache: 'no-store' }),
  restoreAboutVersion: (versionId: string, changedBy: string = 'Admin User') => fetchApi<any>('/api/admin/about/restore', { method: 'POST', body: JSON.stringify({ versionId, changedBy }) }),

  // Technical Leadership Team CMS API methods
  getPublicTeam: () => fetchApi<any[]>('/api/team', { cache: 'no-store' }),
  getAdminTeam: () => fetchApi<any[]>('/api/admin/team', { cache: 'no-store' }),
  createTeamMember: (data: any) => fetchApi<any>('/api/admin/team', { method: 'POST', body: JSON.stringify(data) }),
  updateTeamMember: (id: string, data: any) => fetchApi<any>(`/api/admin/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTeamMember: (id: string) => fetchApi<{ success: boolean; message?: string }>(`/api/admin/team/${id}`, { method: 'DELETE' }),
  reorderTeamMembers: (items: { id: string; displayOrder: number }[]) => fetchApi<any[]>('/api/admin/team/reorder', { method: 'PATCH', body: JSON.stringify({ items }) }),
  uploadTeamMemberImage: (file: File): Promise<{ url: string; public_id: string; width?: number; height?: number; alt?: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetchApi<{ url: string; public_id: string; width?: number; height?: number; alt?: string }>('/api/admin/team/upload-image', {
            method: 'POST',
            body: JSON.stringify({
              filename: file.name,
              fileData: reader.result
            })
          });
          resolve(res);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  // Enterprise FAQ CMS API methods
  getPublicFaqs: (params?: { category?: string; serviceId?: string; projectId?: string; featured?: boolean; searchQuery?: string; faqType?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.serviceId) searchParams.append('serviceId', params.serviceId);
    if (params?.projectId) searchParams.append('projectId', params.projectId);
    if (params?.featured !== undefined) searchParams.append('featured', String(params.featured));
    if (params?.searchQuery) searchParams.append('searchQuery', params.searchQuery);
    if (params?.faqType) searchParams.append('faqType', params.faqType);
    if (params?.status) searchParams.append('status', params.status);
    const queryStr = searchParams.toString();
    return fetchApi<any[]>(`/api/faqs${queryStr ? `?${queryStr}` : ''}`, { cache: 'no-store' });
  },
  getFaqs: (params?: { category?: string; serviceId?: string; projectId?: string; featured?: boolean; searchQuery?: string; faqType?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.serviceId) searchParams.append('serviceId', params.serviceId);
    if (params?.projectId) searchParams.append('projectId', params.projectId);
    if (params?.featured !== undefined) searchParams.append('featured', String(params.featured));
    if (params?.searchQuery) searchParams.append('searchQuery', params.searchQuery);
    if (params?.faqType) searchParams.append('faqType', params.faqType);
    if (params?.status) searchParams.append('status', params.status);
    const queryStr = searchParams.toString();
    return fetchApi<any[]>(`/api/faqs${queryStr ? `?${queryStr}` : ''}`, { cache: 'no-store' });
  },
  getFaqCategories: () => fetchApi<any[]>('/api/faqs/categories', { cache: 'no-store' }),
  searchFaqs: (query: string) => fetchApi<any[]>(`/api/faqs/search?q=${encodeURIComponent(query)}`, { cache: 'no-store' }),
  getFaqBySlug: (slug: string) => fetchApi<any>(`/api/faqs/${slug}`, { cache: 'no-store' }),
  submitFaqFeedback: (faqId: string, helpful: boolean, sessionId?: string) => fetchApi<{ success: boolean }>(`/api/faqs/${faqId}/feedback`, { method: 'POST', body: JSON.stringify({ helpful, sessionId }) }),
  getAdminFaqs: () => fetchApi<{ summary: any; categories: any[]; items: any[] }>('/api/admin/faqs', { cache: 'no-store' }),
  createFaq: (data: any) => fetchApi<any>('/api/admin/faqs', { method: 'POST', body: JSON.stringify(data) }),
  updateFaq: (id: string, data: any) => fetchApi<any>(`/api/admin/faqs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFaq: (id: string) => fetchApi<{ success: boolean; message?: string }>(`/api/admin/faqs/${id}`, { method: 'DELETE' }),
  publishFaq: (id: string) => fetchApi<any>(`/api/admin/faqs/${id}/publish`, { method: 'POST' }),
  unpublishFaq: (id: string) => fetchApi<any>(`/api/admin/faqs/${id}/unpublish`, { method: 'POST' }),
  archiveFaq: (id: string) => fetchApi<any>(`/api/admin/faqs/${id}/archive`, { method: 'POST' }),
  duplicateFaq: (id: string) => fetchApi<any>(`/api/admin/faqs/${id}/duplicate`, { method: 'POST' }),
  getFaqVersions: (id: string) => fetchApi<any[]>(`/api/admin/faqs/${id}/versions`),
  restoreFaqVersion: (id: string, versionId: string) => fetchApi<any>(`/api/admin/faqs/${id}/restore`, { method: 'POST', body: JSON.stringify({ versionId }) }),
  checkFaqDuplicates: (question: string) => fetchApi<any[]>('/api/admin/faqs/check-duplicates', { method: 'POST', body: JSON.stringify({ question }) }),
  saveFaqCategory: (data: any) => fetchApi<any>('/api/admin/faqs/categories', { method: 'POST', body: JSON.stringify(data) }),
  deleteFaqCategory: (id: string) => fetchApi<{ success: boolean }>(`/api/admin/faqs/categories/${id}`, { method: 'DELETE' }),
  uploadFaqImage: (file: File): Promise<{ url: string; public_id: string; width?: number; height?: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetchApi<{ url: string; public_id: string; width?: number; height?: number }>('/api/admin/faqs/upload-image', {
            method: 'POST',
            body: JSON.stringify({
              filename: file.name,
              fileData: reader.result
            })
          });
          resolve(res);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
};
