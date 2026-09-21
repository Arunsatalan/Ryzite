import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Globe,
  Activity,
  Plus,
  Trash2,
  Edit3,
  Check,
  Sparkles,
  Save,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  Database,
  Sliders,
  LogOut,
  Building2,
  Mail,
  DollarSign,
  Layers,
  BarChart3,
  Star,
  ArrowUp,
  ArrowDown,
  Rocket,
  Award,
  Clock,
  Code,
  Shield,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  MessageSquareQuote,
  FileCode,
  LucideIcon
} from 'lucide-react';
import { LeadItem, ServiceItem, ServiceCategory, ProjectItem, BlogPost, LeadStatus, PageMetadataConfig, HomeHeroConfig, TrustedClientItem, CompanyStatisticItem, StatisticStatus, WhyChooseUsItem } from '../types';
import { SerpOptimizerModal } from './SerpOptimizerModal';
import { Hero } from './Hero';
import { TrustedClients } from './TrustedClients';
import { WhyChooseUs } from './WhyChooseUs';
import { AeoKnowledgeHubModule } from './admin/AeoKnowledgeHubModule';
import { AboutCmsModule } from './admin/AboutCmsModule';
import { TeamCmsModule } from './admin/TeamCmsModule';
import { api } from '../lib/api';

const STAT_ICON_MAP: Record<string, LucideIcon> = {
  Rocket,
  Award,
  Users,
  Star,
  Globe,
  Clock,
  Code,
  Shield,
  TrendingUp
};



interface AdminDashboardProps {
  isOpen?: boolean;
  initialTab?: 'crm' | 'hero' | 'clients' | 'principles' | 'statistics' | 'services' | 'projects' | 'blogs' | 'seo' | 'about' | 'team' | 'analytics';
  onClose: () => void;
  services: ServiceItem[];
  projects: ProjectItem[];
  blogs: BlogPost[];
  onUpdateServices: (services: ServiceItem[]) => void;
  onUpdateProjects: (projects: ProjectItem[]) => void;
  onUpdateBlogs: (blogs: BlogPost[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen = true,
  initialTab = 'crm',
  onClose,
  services,
  projects,
  blogs,
  onUpdateServices,
  onUpdateProjects,
  onUpdateBlogs
}) => {
  const [activeTab, setActiveTab] = useState<'crm' | 'hero' | 'clients' | 'principles' | 'statistics' | 'services' | 'projects' | 'blogs' | 'seo' | 'about' | 'team' | 'analytics'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Why Choose Us (Principles) CMS state & handlers
  const [principlesList, setPrinciplesList] = useState<WhyChooseUsItem[]>([]);
  const [loadingPrinciples, setLoadingPrinciples] = useState(false);
  const [showPrincipleModal, setShowPrincipleModal] = useState(false);
  const [editingPrinciple, setEditingPrinciple] = useState<WhyChooseUsItem | null>(null);
  const [principleSaving, setPrincipleSaving] = useState(false);
  const [principleError, setPrincipleError] = useState<string | null>(null);
  const [principleToast, setPrincipleToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [principleForm, setPrincipleForm] = useState<{
    badge: string;
    title: string;
    description: string;
    iconKey: string;
    enabled: boolean;
  }>({
    badge: '',
    title: '',
    description: '',
    iconKey: 'Award',
    enabled: true
  });

  // Company Statistics CMS state & handlers
  const [companyStatisticsList, setCompanyStatisticsList] = useState<CompanyStatisticItem[]>([]);
  const [loadingStatistics, setLoadingStatistics] = useState(false);
  const [showStatisticModal, setShowStatisticModal] = useState(false);
  const [editingStatistic, setEditingStatistic] = useState<CompanyStatisticItem | null>(null);
  const [statisticSaving, setStatisticSaving] = useState(false);
  const [statisticError, setStatisticError] = useState<string | null>(null);
  const [statisticToast, setStatisticToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [statisticForm, setStatisticForm] = useState<{
    value: string;
    prefix: string;
    suffix: string;
    label: string;
    description: string;
    iconName: string;
    iconColor: string;
    animationEnabled: boolean;
    displayOrder: number;
    status: StatisticStatus;
    seoTitle: string;
    seoDescription: string;
  }>({
    value: '',
    prefix: '',
    suffix: '+',
    label: '',
    description: '',
    iconName: 'Rocket',
    iconColor: '#0052FF',
    animationEnabled: true,
    displayOrder: 1,
    status: 'PUBLISHED',
    seoTitle: '',
    seoDescription: ''
  });


  // Leads state
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leadFilter, setLeadFilter] = useState<string>('ALL');

  // SEO state
  const [selectedSeoPage, setSelectedSeoPage] = useState<string>('home');
  const [seoConfig, setSeoConfig] = useState<PageMetadataConfig | null>(null);
  const [seoSaved, setSeoSaved] = useState(false);
  const [showSerpModal, setShowSerpModal] = useState(false);
  const [serpAuditResult, setSerpAuditResult] = useState<any>(null);
  const [loadingAudit, setLoadingAudit] = useState(false);

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Services CMS state & handlers
  const [adminServicesList, setAdminServicesList] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [tempServicePreviewUrl, setTempServicePreviewUrl] = useState<string | null>(null);
  const [uploadingServiceImg, setUploadingServiceImg] = useState(false);
  const [serviceSaving, setServiceSaving] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  const [serviceForm, setServiceForm] = useState<{
    title: string;
    slug: string;
    category: ServiceCategory;
    startingPrice: string;
    timeline: string;
    iconName: string;
    shortDescription: string;
    fullDescription: string;
    imageUrl: string;
    imageAlt: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    active: boolean;
    featured: boolean;
  }>({
    title: '',
    slug: '',
    category: 'web',
    startingPrice: '$10,000',
    timeline: '4 - 8 Weeks',
    iconName: 'Sparkles',
    shortDescription: '',
    fullDescription: '',
    imageUrl: '',
    imageAlt: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    active: true,
    featured: true
  });

  // Projects & Case Studies CMS state & handlers
  const [adminProjectsList, setAdminProjectsList] = useState<ProjectItem[]>([]);
  const [projectCounts, setProjectCounts] = useState({ total: 0, published: 0, featured: 0, drafts: 0 });
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectFilterCategory, setProjectFilterCategory] = useState<string>('ALL');
  const [projectFilterStatus, setProjectFilterStatus] = useState<string>('ALL');
  const [projectSearchQuery, setProjectSearchQuery] = useState<string>('');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [projectToast, setProjectToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [uploadingProjectImg, setUploadingProjectImg] = useState(false);
  const [tempProjectPreviewUrl, setTempProjectPreviewUrl] = useState<string | null>(null);

  const [projectActiveTab, setProjectActiveTab] = useState<number>(1);
  const [uploadingArchDiagram, setUploadingArchDiagram] = useState(false);
  const [uploadingClientLogo, setUploadingClientLogo] = useState(false);
  const [uploadingGalleryImg, setUploadingGalleryImg] = useState(false);

  const [projectForm, setProjectForm] = useState<{
    title: string;
    slug: string;
    client: string;
    clientLogoUrl: string;
    clientWebsiteUrl: string;
    category: string;
    mockupType: string;
    subtitle: string;
    shortDescription: string;
    fullDescription: string;
    businessImpactText: string;
    heroImage: string;
    architectureDiagramUrl: string;
    websiteUrl: string;
    githubUrl: string;
    ctaText: string;
    ctaLink: string;
    status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
    featured: boolean;
    metrics: { label: string; value: string; trend?: string; description?: string }[];
    techStack: string[];
    challengesList: { title: string; description?: string; impact?: string }[];
    solutionsList: { title: string; description?: string; codeSnippet?: string; diagramUrl?: string }[];
    resultsList: { metricName: string; beforeValue?: string; afterValue?: string; percentageChange?: string; timeframe?: string }[];
    galleryImages: { url: string; caption?: string; alt?: string }[];
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    focusKeywords: string;
    testimonialQuote: string;
    testimonialAuthor: string;
    testimonialRole: string;
    testimonialCompany: string;
    testimonialAvatar: string;
  }>({
    title: '',
    slug: '',
    client: '',
    clientLogoUrl: '',
    clientWebsiteUrl: '',
    category: 'SaaS Platform',
    mockupType: 'dark-dashboard',
    subtitle: '',
    shortDescription: '',
    fullDescription: '',
    businessImpactText: '',
    heroImage: '',
    architectureDiagramUrl: '',
    websiteUrl: '',
    githubUrl: '',
    ctaText: 'Book Discovery Call',
    ctaLink: '#contact',
    status: 'PUBLISHED',
    featured: true,
    metrics: [
      { label: 'Latency Reduction', value: '-85%', trend: 'Real-time' },
      { label: 'System Throughput', value: '50k RPS', trend: 'Scalable' }
    ],
    techStack: ['Next.js 14', 'PostgreSQL', 'Express.js', 'TypeScript', 'Cloudinary CDN', 'Prisma ORM'],
    challengesList: [
      { title: 'Legacy Concurrency Bottlenecks', description: 'Database locks during peak spikes caused 4s delays for enterprise users.', impact: 'Critical latency spikes' }
    ],
    solutionsList: [
      { title: 'Event-Driven Async Workers', description: 'Migrated long-running operations to asynchronous worker pools and Redis queues.', codeSnippet: '// Worker queue implementation snippet' }
    ],
    resultsList: [
      { metricName: 'API Response Time', beforeValue: '4,200ms', afterValue: '85ms', percentageChange: '-97.9%', timeframe: 'Immediate post-launch' }
    ],
    galleryImages: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    focusKeywords: '',
    testimonialQuote: '',
    testimonialAuthor: '',
    testimonialRole: '',
    testimonialCompany: '',
    testimonialAvatar: ''
  });

  const fetchAdminProjects = async () => {
    setLoadingProjects(true);
    try {
      const [projectsData, countsData] = await Promise.all([
        api.getAdminProjects({
          search: projectSearchQuery,
          category: projectFilterCategory,
          status: projectFilterStatus
        }),
        api.getProjectCounts()
      ]);

      if (Array.isArray(projectsData)) {
        setAdminProjectsList(projectsData);
      }
      if (countsData) {
        setProjectCounts(countsData);
      }
    } catch (err: any) {
      console.warn('Failed to fetch admin projects:', err.message);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleProjectImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setProjectError('Image file size exceeds maximum 5MB limit.');
      return;
    }

    setUploadingProjectImg(true);
    setProjectError(null);
    try {
      const tempUrl = URL.createObjectURL(file);
      setTempProjectPreviewUrl(tempUrl);

      const res = await api.uploadProjectImage(file);
      if (res && res.url) {
        setProjectForm(prev => ({
          ...prev,
          heroImage: res.url
        }));
        setProjectToast({ message: 'Project hero image uploaded to Cloudinary CDN', type: 'success' });
        setTimeout(() => setProjectToast(null), 3000);
      }
    } catch (err: any) {
      setProjectError(err.message || 'Failed to upload project hero image file.');
    } finally {
      setUploadingProjectImg(false);
    }
  };

  const handleClientLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingClientLogo(true);
    try {
      const res = await api.uploadCloudinaryImage(file, `ryzite/portfolio/projects/${projectForm.slug || 'general'}/logo`);
      if (res && res.url) {
        setProjectForm(prev => ({ ...prev, clientLogoUrl: res.url }));
        setProjectToast({ message: 'Client logo uploaded to Cloudinary CDN', type: 'success' });
      }
    } catch (err: any) {
      setProjectError(err.message || 'Failed to upload client logo');
    } finally {
      setUploadingClientLogo(false);
    }
  };

  const handleArchDiagramUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingArchDiagram(true);
    try {
      const res = await api.uploadCloudinaryImage(file, `ryzite/portfolio/projects/${projectForm.slug || 'general'}/architecture`);
      if (res && res.url) {
        setProjectForm(prev => ({ ...prev, architectureDiagramUrl: res.url }));
        setProjectToast({ message: 'Architecture diagram uploaded to Cloudinary CDN', type: 'success' });
      }
    } catch (err: any) {
      setProjectError(err.message || 'Failed to upload architecture diagram');
    } finally {
      setUploadingArchDiagram(false);
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGalleryImg(true);
    try {
      const res = await api.uploadCloudinaryImage(file, `ryzite/portfolio/projects/${projectForm.slug || 'general'}/gallery`);
      if (res && res.url) {
        setProjectForm(prev => ({
          ...prev,
          galleryImages: [...prev.galleryImages, { url: res.url, caption: file.name.split('.')[0], alt: `${prev.title} gallery screenshot` }]
        }));
        setProjectToast({ message: 'Gallery screenshot uploaded to Cloudinary CDN', type: 'success' });
      }
    } catch (err: any) {
      setProjectError(err.message || 'Failed to upload gallery screenshot');
    } finally {
      setUploadingGalleryImg(false);
    }
  };

  const handleOpenAddProject = () => {
    setEditingProject(null);
    setTempProjectPreviewUrl(null);
    setProjectActiveTab(1);
    setProjectForm({
      title: '',
      slug: '',
      client: '',
      clientLogoUrl: '',
      clientWebsiteUrl: '',
      category: 'SaaS Platform',
      mockupType: 'dark-dashboard',
      subtitle: '',
      shortDescription: '',
      fullDescription: '',
      businessImpactText: '',
      heroImage: '',
      architectureDiagramUrl: '',
      websiteUrl: '',
      githubUrl: '',
      ctaText: 'Book Discovery Call',
      ctaLink: '#contact',
      status: 'PUBLISHED',
      featured: true,
      metrics: [
        { label: 'Latency Reduction', value: '-85%', trend: 'Real-time' },
        { label: 'System Throughput', value: '50k RPS', trend: 'Scalable' }
      ],
      techStack: ['Next.js 14', 'PostgreSQL', 'Express.js', 'TypeScript', 'Cloudinary CDN', 'Prisma ORM'],
      challengesList: [
        { title: 'Sub-second Processing Bottleneck', description: 'Legacy synchronous REST API could not sustain 20k concurrent webhook bursts.', impact: 'Service timeouts' }
      ],
      solutionsList: [
        { title: 'Asynchronous Event-Driven Bus', description: 'Architected distributed Redis queue handling high concurrency with zero drops.', codeSnippet: 'const queue = new WorkerQueue();' }
      ],
      resultsList: [
        { metricName: 'API Throughput', beforeValue: '1,200 req/s', afterValue: '50,000 req/s', percentageChange: '+4,066%', timeframe: 'Immediate post-cutover' }
      ],
      galleryImages: [],
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      focusKeywords: '',
      testimonialQuote: '',
      testimonialAuthor: '',
      testimonialRole: '',
      testimonialCompany: '',
      testimonialAvatar: ''
    });
    setProjectError(null);
    setShowProjectModal(true);
  };

  const handleOpenEditProject = (project: ProjectItem) => {
    setEditingProject(project);
    setTempProjectPreviewUrl(null);
    setProjectActiveTab(1);
    setProjectForm({
      title: project.title || '',
      slug: project.slug || '',
      client: project.client || project.clientName || '',
      clientLogoUrl: project.clientLogoUrl || '',
      clientWebsiteUrl: project.clientWebsiteUrl || '',
      category: project.category || 'SaaS Platform',
      mockupType: project.mockupType || 'dark-dashboard',
      subtitle: project.subtitle || project.heroTitle || '',
      shortDescription: project.shortDescription || project.description || '',
      fullDescription: project.fullDescription || project.longDescription || project.shortDescription || '',
      businessImpactText: project.businessImpactText || '',
      heroImage: project.heroImage || '',
      architectureDiagramUrl: project.architectureDiagramUrl || '',
      websiteUrl: project.websiteUrl || project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      ctaText: project.ctaText || 'Book Discovery Call',
      ctaLink: project.ctaLink || '#contact',
      status: project.status || 'PUBLISHED',
      featured: project.featured ?? true,
      metrics: project.metrics && project.metrics.length > 0
        ? project.metrics.map((m: any) => ({ label: m.label, value: m.value, trend: m.trend || '', description: m.description || '' }))
        : [{ label: 'Performance Benchmark', value: '99.9%', trend: 'SLA' }],
      techStack: project.techStack && project.techStack.length > 0
        ? project.techStack.map((t: any) => typeof t === 'string' ? t : (t?.name || t?.technology?.name || ''))
        : ['Next.js', 'TypeScript', 'PostgreSQL'],
      challengesList: project.challengesList && project.challengesList.length > 0
        ? project.challengesList.map((c: any) => ({ title: c.title, description: c.description || '', impact: c.impact || '' }))
        : project.challenge ? [{ title: 'Core Challenge', description: project.challenge }] : [],
      solutionsList: project.solutionsList && project.solutionsList.length > 0
        ? project.solutionsList.map((s: any) => ({ title: s.title, description: s.description || '', codeSnippet: s.codeSnippet || '', diagramUrl: s.diagramUrl || '' }))
        : project.solution ? [{ title: 'Engineered Solution', description: project.solution }] : [],
      resultsList: project.resultsList && project.resultsList.length > 0
        ? project.resultsList.map((r: any) => ({ metricName: r.metricName || 'Metric', beforeValue: r.beforeValue || '', afterValue: r.afterValue || '', percentageChange: r.percentageChange || '', timeframe: r.timeframe || '' }))
        : [],
      galleryImages: project.galleryImages && project.galleryImages.length > 0
        ? project.galleryImages.map((g: any) => ({ url: g.imageUrl || g.url || '', caption: g.caption || '', alt: g.altText || g.alt || '' }))
        : [],
      seoTitle: project.seoTitle || project.seoMetadata?.metaTitle || '',
      seoDescription: project.seoDescription || project.seoMetadata?.metaDescription || '',
      seoKeywords: project.seoKeywords || project.seoMetadata?.focusKeywords || '',
      focusKeywords: project.seoMetadata?.focusKeywords || '',
      testimonialQuote: project.testimonial?.quote || '',
      testimonialAuthor: project.testimonial?.author || '',
      testimonialRole: project.testimonial?.role || '',
      testimonialCompany: project.testimonial?.company || '',
      testimonialAvatar: project.testimonial?.avatarUrl || ''
    });
    setProjectError(null);
    setShowProjectModal(true);
  };

  const handleSaveProject = async () => {
    if (!projectForm.title.trim()) {
      setProjectError('Project title is required.');
      return;
    }
    const slug = projectForm.slug.trim() || projectForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    setProjectSaving(true);
    setProjectError(null);
    try {
      const payload: any = {
        title: projectForm.title,
        slug,
        client: projectForm.client || 'Enterprise Partner',
        clientLogoUrl: projectForm.clientLogoUrl,
        clientWebsiteUrl: projectForm.clientWebsiteUrl,
        category: projectForm.category,
        mockupType: projectForm.mockupType,
        heroTitle: projectForm.title,
        subtitle: projectForm.subtitle,
        description: projectForm.shortDescription,
        longDescription: projectForm.fullDescription,
        businessImpactText: projectForm.businessImpactText,
        heroImage: projectForm.heroImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
        architectureDiagramUrl: projectForm.architectureDiagramUrl,
        websiteUrl: projectForm.websiteUrl,
        githubUrl: projectForm.githubUrl,
        ctaText: projectForm.ctaText,
        ctaLink: projectForm.ctaLink,
        status: projectForm.status,
        featured: projectForm.featured,
        metrics: projectForm.metrics,
        techStack: projectForm.techStack,
        challengesList: projectForm.challengesList,
        solutionsList: projectForm.solutionsList,
        resultsList: projectForm.resultsList,
        galleryImages: projectForm.galleryImages,
        seoTitle: projectForm.seoTitle || `${projectForm.title} Case Study | Ryzite`,
        seoDescription: projectForm.seoDescription || projectForm.shortDescription,
        seoKeywords: projectForm.seoKeywords,
        focusKeywords: projectForm.focusKeywords || projectForm.seoKeywords,
        testimonial: projectForm.testimonialQuote ? {
          quote: projectForm.testimonialQuote,
          author: projectForm.testimonialAuthor || 'Executive Leader',
          role: projectForm.testimonialRole || 'VP of Technology',
          company: projectForm.testimonialCompany || projectForm.client,
          avatarUrl: projectForm.testimonialAvatar
        } : undefined
      };

      if (editingProject) {
        await api.updateProject(editingProject.id, payload);
        setProjectToast({ message: 'Project case study updated successfully!', type: 'success' });
      } else {
        await api.createProject(payload);
        setProjectToast({ message: 'New project case study created and saved to PostgreSQL!', type: 'success' });
      }

      setShowProjectModal(false);
      fetchAdminProjects();
      setTimeout(() => setProjectToast(null), 3500);
    } catch (err: any) {
      setProjectError(err.message || 'Failed to save project.');
    } finally {
      setProjectSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project case study?')) return;
    try {
      await api.deleteProject(id);
      fetchAdminProjects();
      setProjectToast({ message: 'Project deleted successfully', type: 'success' });
      setTimeout(() => setProjectToast(null), 3000);
    } catch (err: any) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleToggleProjectStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.toggleProjectStatus(id, nextStatus);
      fetchAdminProjects();
    } catch (err: any) {
      console.error('Failed to toggle project status:', err);
    }
  };

  const handleToggleProjectFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await api.toggleProjectFeatured(id, !currentFeatured);
      fetchAdminProjects();
    } catch (err: any) {
      console.error('Failed to toggle project featured:', err);
    }
  };

  const fetchAdminServices = async () => {
    setLoadingServices(true);
    try {
      const data = await api.getAdminServices();
      if (Array.isArray(data)) {
        setAdminServicesList(data);
      }
    } catch (err: any) {
      console.warn('Failed to fetch admin services:', err.message);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleOpenAddService = () => {
    setEditingService(null);
    setTempServicePreviewUrl(null);
    setServiceForm({
      title: '',
      slug: '',
      category: 'web',
      startingPrice: '$10,000',
      timeline: '4 - 8 Weeks',
      iconName: 'Sparkles',
      shortDescription: '',
      fullDescription: '',
      imageUrl: '',
      imageAlt: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      active: true,
      featured: true
    });
    setServiceError(null);
    setShowServiceModal(true);
  };

  const handleOpenEditService = (service: ServiceItem) => {
    setEditingService(service);
    setTempServicePreviewUrl(null);
    setServiceForm({
      title: service.title || '',
      slug: service.slug || '',
      category: service.category || 'web',
      startingPrice: service.startingPrice || '$10,000',
      timeline: service.timeline || '4 - 8 Weeks',
      iconName: service.iconName || 'Sparkles',
      shortDescription: service.shortDescription || '',
      fullDescription: service.fullDescription || service.shortDescription || '',
      imageUrl: service.imageUrl || '',
      imageAlt: service.imageAlt || `${service.title} solution`,
      seoTitle: service.seoTitle || `${service.title} | Ryzite Agency`,
      seoDescription: service.seoDescription || service.shortDescription || '',
      seoKeywords: service.seoKeywords || '',
      active: service.active !== false,
      featured: service.featured ?? true
    });
    setServiceError(null);
    setShowServiceModal(true);
  };

  const handleServiceImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setServiceError('Image file size exceeds maximum 5MB limit.');
      return;
    }

    // Instant FileReader temporary preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setTempServicePreviewUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    setUploadingServiceImg(true);
    setServiceError(null);
    try {
      const res = await api.uploadServiceImage(file);
      if (res && res.url) {
        setServiceForm(prev => ({
          ...prev,
          imageUrl: res.url,
          imagePublicId: res.public_id || res.filename,
          imageAlt: prev.imageAlt || `${prev.title || file.name} solution`
        }));
      }
    } catch (err: any) {
      setServiceError(err.message || 'Failed to upload service image file.');
    } finally {
      setUploadingServiceImg(false);
    }
  };

  const handleSaveService = async () => {
    if (!serviceForm.title.trim()) {
      setServiceError('Service title is required.');
      return;
    }
    const slugToSave = serviceForm.slug.trim() || serviceForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-');

    setServiceSaving(true);
    setServiceError(null);
    try {
      const payload = {
        ...serviceForm,
        slug: slugToSave,
        imageAlt: serviceForm.imageAlt || `${serviceForm.title} solution`
      };

      if (editingService) {
        await api.updateService(editingService.id, payload);
      } else {
        await api.createService({
          ...payload,
          order: adminServicesList.length + 1,
          features: ['Custom Portal Architecture', 'REST API Integration'],
          deliverables: ['Production Next.js App', 'Database Schema'],
          techStack: ['Next.js', 'PostgreSQL', 'TypeScript']
        });
      }
      setShowServiceModal(false);
      fetchAdminServices();
      const pubServices = await api.getServices();
      onUpdateServices(pubServices);
    } catch (err: any) {
      setServiceError(err.message || 'Failed to save service.');
    } finally {
      setServiceSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.deleteService(id);
      fetchAdminServices();
      const pubServices = await api.getServices();
      onUpdateServices(pubServices);
    } catch (err: any) {
      console.error('Failed to delete service:', err);
    }
  };

  const handleToggleServiceActive = async (service: ServiceItem) => {
    try {
      await api.updateService(service.id, { active: !service.active });
      fetchAdminServices();
      const pubServices = await api.getServices();
      onUpdateServices(pubServices);
    } catch (err: any) {
      console.error('Failed to toggle service active:', err);
    }
  };

  const handleMoveServiceOrder = async (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= adminServicesList.length) return;

    const listCopy = [...adminServicesList];
    const temp = listCopy[currentIndex];
    listCopy[currentIndex] = listCopy[targetIndex];
    listCopy[targetIndex] = temp;

    setAdminServicesList(listCopy);
    try {
      const orderedIds = listCopy.map(s => s.id);
      await api.reorderServices(orderedIds);
      const pubServices = await api.getServices();
      onUpdateServices(pubServices);
    } catch (err: any) {
      console.error('Failed to reorder services:', err);
      fetchAdminServices();
    }
  };

  // Hero state
  const [heroForm, setHeroForm] = useState<HomeHeroConfig>({
    badgeText: 'SOFTWARE SOLUTIONS THAT SCALE',
    headingPrefix: 'We Build Software',
    headingHighlight: 'Drives Growth',
    headingSuffix: '',
    description: 'Empowering startups and enterprises with innovative, scalable and secure software solutions.',
    primaryCtaText: 'Explore Our Services',
    primaryCtaUrl: '/services',
    primaryCtaEnabled: true,
    primaryCtaOpenNewTab: false,
    secondaryCtaText: 'Book a Free Consultation',
    secondaryCtaUrl: '#contact',
    secondaryCtaType: 'consultation',
    secondaryCtaEnabled: true,
    secondaryCtaOpenNewTab: false,
    backgroundImageUrl: '',
    backgroundImageAlt: '',
    enabled: true,
    displayOrder: 1
  });
  const [initialHeroForm, setInitialHeroForm] = useState<HomeHeroConfig | null>(null);
  const [loadingHero, setLoadingHero] = useState(false);
  const [savingHero, setSavingHero] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);

  // Trusted Clients State
  const [trustedClientsList, setTrustedClientsList] = useState<TrustedClientItem[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<TrustedClientItem | null>(null);
  const [clientForm, setClientForm] = useState<{
    name: string;
    companyName: string;
    logoUrl: string;
    logoAltText: string;
    websiteUrl: string;
    caseStudySlug: string;
    featured: boolean;
    enabled: boolean;
  }>({
    name: '',
    companyName: '',
    logoUrl: '',
    logoAltText: '',
    websiteUrl: '',
    caseStudySlug: '',
    featured: true,
    enabled: true
  });
  const [clientSaving, setClientSaving] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setClientError(null);
    try {
      const res = await api.uploadImage(file);
      if (res && res.url) {
        setClientForm(prev => ({
          ...prev,
          logoUrl: res.url,
          logoPublicId: res.public_id || res.filename
        }));
      }
    } catch (err: any) {
      setClientError(err.message || 'Failed to upload logo image file.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const fetchAdminPrinciples = async () => {
    setLoadingPrinciples(true);
    try {
      const data = await api.getAdminWhyChooseUs();
      if (Array.isArray(data)) {
        setPrinciplesList(data);
      }
    } catch (err: any) {
      console.warn('Failed to fetch admin principles:', err.message);
    } finally {
      setLoadingPrinciples(false);
    }
  };

  const handleOpenAddPrinciple = () => {
    setEditingPrinciple(null);
    setPrincipleForm({
      badge: 'Zero-Debt Code',
      title: '',
      description: '',
      iconKey: 'Award',
      enabled: true
    });
    setPrincipleError(null);
    setShowPrincipleModal(true);
  };

  const handleOpenEditPrinciple = (principle: WhyChooseUsItem) => {
    setEditingPrinciple(principle);
    setPrincipleForm({
      badge: principle.badge || '',
      title: principle.title || '',
      description: principle.description || '',
      iconKey: principle.iconKey || 'Award',
      enabled: principle.enabled !== false
    });
    setPrincipleError(null);
    setShowPrincipleModal(true);
  };

  const handleSavePrinciple = async () => {
    if (!principleForm.title.trim() || !principleForm.description.trim()) {
      setPrincipleError('Title and Description are required.');
      return;
    }
    setPrincipleSaving(true);
    setPrincipleError(null);
    try {
      if (editingPrinciple) {
        await api.updateWhyChooseUs(editingPrinciple.id, principleForm);
        setPrincipleToast({ message: 'Why Choose Us pillar updated successfully', type: 'success' });
      } else {
        await api.createWhyChooseUs(principleForm);
        setPrincipleToast({ message: 'Why Choose Us pillar created successfully', type: 'success' });
      }
      setTimeout(() => setPrincipleToast(null), 3500);
      setShowPrincipleModal(false);
      fetchAdminPrinciples();
    } catch (err: any) {
      setPrincipleError(err.message || 'Failed to save principle.');
    } finally {
      setPrincipleSaving(false);
    }
  };

  const handleDeletePrinciple = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Why Choose Us pillar?')) return;
    try {
      await api.deleteWhyChooseUs(id);
      fetchAdminPrinciples();
    } catch (err: any) {
      console.error('Failed to delete principle:', err);
    }
  };

  const handleTogglePrincipleEnabled = async (principle: WhyChooseUsItem) => {
    try {
      await api.updateWhyChooseUs(principle.id, { ...principle, enabled: !principle.enabled });
      fetchAdminPrinciples();
    } catch (err: any) {
      console.error('Failed to toggle principle status:', err);
    }
  };

  const handleMovePrincipleOrder = async (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= principlesList.length) return;

    const listCopy = [...principlesList];
    const temp = listCopy[currentIndex];
    listCopy[currentIndex] = listCopy[targetIndex];
    listCopy[targetIndex] = temp;

    setPrinciplesList(listCopy);
    try {
      const orderedIds = listCopy.map(p => p.id);
      await api.reorderWhyChooseUs(orderedIds);
    } catch (err: any) {
      console.error('Failed to reorder principles:', err);
      fetchAdminPrinciples();
    }
  };

  useEffect(() => {
    fetchLeads(leadFilter);
    fetchSeo(selectedSeoPage);
    fetchAnalytics();
    fetchHero();
    fetchAdminClients();
    fetchAdminPrinciples();
    fetchAdminServices();
    fetchAdminProjects();

    const handleFocus = () => {
      fetchLeads(leadFilter);
      fetchAnalytics();
      fetchHero();
      fetchAdminClients();
      fetchAdminPrinciples();
      fetchAdminServices();
      fetchAdminProjects();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchAdminClients = async () => {
    setLoadingClients(true);
    try {
      const data = await api.getAdminTrustedClients();
      if (Array.isArray(data)) {
        setTrustedClientsList(data);
      }
    } catch (err: any) {
      console.warn('Failed to fetch trusted clients:', err.message);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleOpenAddClient = () => {
    setEditingClient(null);
    setClientForm({
      name: '',
      companyName: '',
      logoUrl: '',
      logoAltText: '',
      websiteUrl: '',
      caseStudySlug: '',
      featured: true,
      enabled: true
    });
    setClientError(null);
    setShowClientModal(true);
  };

  const handleOpenEditClient = (client: TrustedClientItem) => {
    setEditingClient(client);
    setClientForm({
      name: client.name || '',
      companyName: client.companyName || client.name || '',
      logoUrl: client.logoUrl || '',
      logoAltText: client.logoAltText || `${client.name} company logo`,
      websiteUrl: client.websiteUrl || '',
      caseStudySlug: client.caseStudySlug || '',
      featured: client.featured ?? true,
      enabled: client.enabled ?? true
    });
    setClientError(null);
    setShowClientModal(true);
  };

  const handleSaveClient = async () => {
    if (!clientForm.name.trim()) {
      setClientError('Client name is required.');
      return;
    }
    setClientSaving(true);
    setClientError(null);
    try {
      const payload = {
        ...clientForm,
        logoAltText: clientForm.logoAltText || `${clientForm.name} company logo`
      };

      if (editingClient) {
        await api.updateTrustedClient(editingClient.id, payload);
      } else {
        await api.createTrustedClient(payload);
      }
      setShowClientModal(false);
      fetchAdminClients();
    } catch (err: any) {
      setClientError(err.message || 'Failed to save client.');
    } finally {
      setClientSaving(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trusted client?')) return;
    try {
      await api.deleteTrustedClient(id);
      fetchAdminClients();
    } catch (err: any) {
      console.error('Failed to delete client:', err);
    }
  };

  const handleToggleClientActive = async (client: TrustedClientItem) => {
    try {
      await api.updateTrustedClient(client.id, { ...client, enabled: !client.enabled });
      fetchAdminClients();
    } catch (err: any) {
      console.error('Failed to toggle client status:', err);
    }
  };

  const handleToggleClientFeatured = async (client: TrustedClientItem) => {
    try {
      await api.updateTrustedClient(client.id, { ...client, featured: !client.featured });
      fetchAdminClients();
    } catch (err: any) {
      console.error('Failed to toggle client featured:', err);
    }
  };

  const handleMoveClientOrder = async (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= trustedClientsList.length) return;

    const listCopy = [...trustedClientsList];
    const temp = listCopy[currentIndex];
    listCopy[currentIndex] = listCopy[targetIndex];
    listCopy[targetIndex] = temp;

    setTrustedClientsList(listCopy);
    try {
      const orderedIds = listCopy.map(c => c.id);
      await api.reorderTrustedClients(orderedIds);
    } catch (err: any) {
      console.error('Failed to reorder clients:', err);
      fetchAdminClients();
    }
  };

  const showStatisticToast = (message: string, type: 'success' | 'error') => {
    setStatisticToast({ message, type });
    setTimeout(() => setStatisticToast(null), 3500);
  };

  const fetchAdminStatistics = async () => {
    setLoadingStatistics(true);
    try {
      const data = await api.getAdminStatistics();
      if (Array.isArray(data)) {
        setCompanyStatisticsList(data);
      }
    } catch (err: any) {
      console.warn('Failed to fetch admin statistics:', err.message);
    } finally {
      setLoadingStatistics(false);
    }
  };

  useEffect(() => {
    fetchAdminStatistics();
  }, []);

  const handleOpenAddStatistic = () => {
    setEditingStatistic(null);
    setStatisticForm({
      value: '',
      prefix: '',
      suffix: '+',
      label: '',
      description: '',
      iconName: 'Rocket',
      iconColor: '#0052FF',
      animationEnabled: true,
      displayOrder: companyStatisticsList.length + 1,
      status: 'PUBLISHED',
      seoTitle: '',
      seoDescription: ''
    });
    setStatisticError(null);
    setShowStatisticModal(true);
  };

  const handleOpenEditStatistic = (stat: CompanyStatisticItem) => {
    setEditingStatistic(stat);
    setStatisticForm({
      value: stat.value || '',
      prefix: stat.prefix || '',
      suffix: stat.suffix || '',
      label: stat.label || '',
      description: stat.description || '',
      iconName: stat.iconName || 'Rocket',
      iconColor: stat.iconColor || '#0052FF',
      animationEnabled: stat.animationEnabled !== false,
      displayOrder: stat.displayOrder || 1,
      status: stat.status || 'PUBLISHED',
      seoTitle: stat.seoTitle || `${stat.value}${stat.suffix || ''} ${stat.label}`,
      seoDescription: stat.seoDescription || stat.description || ''
    });
    setStatisticError(null);
    setShowStatisticModal(true);
  };

  const handleSaveStatistic = async () => {
    if (!statisticForm.value.trim()) {
      setStatisticError('Statistic Value is required.');
      return;
    }
    if (!statisticForm.label.trim()) {
      setStatisticError('Statistic Label is required.');
      return;
    }

    setStatisticSaving(true);
    setStatisticError(null);

    try {
      if (editingStatistic) {
        await api.updateStatistic(editingStatistic.id, statisticForm);
        showStatisticToast('Statistic updated successfully', 'success');
      } else {
        await api.createStatistic(statisticForm);
        showStatisticToast('Statistic updated successfully', 'success');
      }
      setShowStatisticModal(false);
      fetchAdminStatistics();
    } catch (err: any) {
      setStatisticError(err.message || 'Failed to update statistic');
      showStatisticToast('Failed to update statistic', 'error');
    } finally {
      setStatisticSaving(false);
    }
  };

  const handleDeleteStatistic = async (id: string) => {
    if (!confirm('Are you sure you want to delete this statistic?')) return;
    try {
      await api.deleteStatistic(id);
      showStatisticToast('Statistic updated successfully', 'success');
      fetchAdminStatistics();
    } catch (err: any) {
      showStatisticToast('Failed to update statistic', 'error');
    }
  };

  const handleToggleStatisticStatus = async (stat: CompanyStatisticItem) => {
    const nextStatus: StatisticStatus = stat.status === 'PUBLISHED' ? 'HIDDEN' : 'PUBLISHED';
    try {
      await api.updateStatisticStatus(stat.id, nextStatus);
      showStatisticToast('Statistic updated successfully', 'success');
      fetchAdminStatistics();
    } catch (err: any) {
      showStatisticToast('Failed to update statistic', 'error');
    }
  };

  const handleMoveStatisticOrder = async (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= companyStatisticsList.length) return;

    const listCopy = [...companyStatisticsList];
    const temp = listCopy[currentIndex];
    listCopy[currentIndex] = listCopy[targetIndex];
    listCopy[targetIndex] = temp;

    setCompanyStatisticsList(listCopy);
    try {
      const orderedIds = listCopy.map(s => s.id);
      await api.reorderStatistics(orderedIds);
      showStatisticToast('Statistic updated successfully', 'success');
    } catch (err: any) {
      fetchAdminStatistics();
    }
  };


  const fetchHero = async () => {
    setLoadingHero(true);
    try {
      const data = await api.getHomeHero();
      if (data) {
        setHeroForm(data);
        setInitialHeroForm(data);
      }
    } catch (err: any) {
      console.warn('Failed to fetch Hero configuration:', err.message);
    } finally {
      setLoadingHero(false);
    }
  };

  const handleSaveHero = async () => {
    setSavingHero(true);
    setHeroError(null);
    try {
      const updated = await api.updateHomeHero(heroForm);
      if (updated) {
        setHeroForm(updated);
        setInitialHeroForm(updated);
        setHeroSaved(true);
        fetchAnalytics();
        setTimeout(() => setHeroSaved(false), 3000);
      }
    } catch (err: any) {
      setHeroError(err.message || 'Failed to save Hero configuration.');
    } finally {
      setSavingHero(false);
    }
  };

  const handleReloadHero = () => {
    if (initialHeroForm) {
      setHeroForm(initialHeroForm);
      setHeroError(null);
    } else {
      fetchHero();
    }
  };

  useEffect(() => {
    fetchLeads(leadFilter);
  }, [leadFilter]);

  useEffect(() => {
    fetchSeo(selectedSeoPage);
  }, [selectedSeoPage]);

  const fetchLeads = async (status: string = 'ALL') => {
    setLoadingLeads(true);
    try {
      const data = await api.getLeads(status);
      setLeads(data || []);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  const fetchSeo = async (pageKey: string = 'home') => {
    try {
      const data = await api.getSeo(pageKey);
      setSeoConfig(data);
    } catch (err) {
      console.error('Failed to fetch SEO:', err);
    }
  };

  const runSerpAudit = async () => {
    setLoadingAudit(true);
    try {
      const data = await api.getSeoAudit();
      setSerpAuditResult(data);
    } catch (err) {
      console.error('Failed to run SERP audit:', err);
    } finally {
      setLoadingAudit(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await api.getAnalyticsSummary();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  const handleUpdateLeadStatus = async (id: string, status: LeadStatus) => {
    try {
      await api.updateLeadStatus(id, status);
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
      fetchAnalytics();
    } catch (err) {
      console.error('Failed to update lead:', err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.deleteLead(id);
      setLeads(leads.filter(l => l.id !== id));
      fetchAnalytics();
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const handleSaveSeo = async (updatedConfig?: PageMetadataConfig) => {
    const configToSave = updatedConfig || seoConfig;
    if (!configToSave) return;
    try {
      const res = await api.updateSeo(selectedSeoPage, configToSave);
      if (res) {
        setSeoConfig(res);
        setSeoSaved(true);
        fetchAnalytics();
        setTimeout(() => setSeoSaved(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save SEO config:', err);
    }
  };





  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.deleteBlog(id);
      onUpdateBlogs(blogs.filter(b => b.id !== id));
    } catch (err) {
      console.error('Failed to delete blog:', err);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONTACTED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'IN_DISCUSSION':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'WON':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'LOST':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] h-screen w-screen bg-slate-50 flex overflow-hidden font-sans text-slate-900 antialiased">

      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-5 shrink-0 shadow-xs">
        <div className="space-y-6">

          {/* Brand Logo & Status */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-xl">
              R
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-slate-900 leading-tight">Ryzite Admin</h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                API Port 5000
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Main Control Panel
            </div>

            <button
              onClick={() => setActiveTab('crm')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'crm'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <Users size={18} className={activeTab === 'crm' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Leads CRM</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'crm' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                {leads.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'hero'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} className={activeTab === 'hero' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Hero Section</span>
              </div>
              <span className="text-[10px] uppercase tracking-wide bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">
                Home CMS
              </span>
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'clients'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <Building2 size={18} className={activeTab === 'clients' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Trusted Clients</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                {trustedClientsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('principles')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'principles'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className={activeTab === 'principles' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Why Choose Us</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                {principlesList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('statistics')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'statistics'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={18} className={activeTab === 'statistics' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Company Statistics</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                {companyStatisticsList.length}
              </span>
            </button>


            <button
              onClick={() => setActiveTab('seo')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'seo'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <Globe size={18} className={activeTab === 'seo' ? 'text-blue-600' : 'text-slate-400'} />
                <span>SEO & AEO Engine</span>
              </div>
              <span className="text-[10px] uppercase tracking-wide bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'about'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <Building2 size={18} className={activeTab === 'about' ? 'text-blue-600' : 'text-slate-400'} />
                <span>About Page CMS</span>
              </div>
              <span className="text-[10px] uppercase tracking-wide bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                CMS
              </span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'team'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <Users size={18} className={activeTab === 'team' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Technical Leadership Team</span>
              </div>
              <span className="text-[10px] uppercase tracking-wide bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                CMS
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'services'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles size={18} className={activeTab === 'services' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Services Offered</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                {services.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'projects'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <FolderKanban size={18} className={activeTab === 'projects' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Portfolio Studies</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'blogs'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className={activeTab === 'blogs' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Blog Posts</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                {blogs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'analytics'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <Activity size={18} className={activeTab === 'analytics' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Web Analytics</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                98%
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Database size={14} className="text-blue-600" />
              <span>PostgreSQL Database</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Standalone Express backend operational at <code className="text-blue-600 font-mono">localhost:5000</code>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
          >
            <LogOut size={16} />
            <span>Return to Website</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">

        {/* Top Bar Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search leads, services, SEO metadata keys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => { setEditingService(null); setTempServicePreviewUrl(null); setServiceError(null); setShowServiceModal(true); }}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Plus size={15} />
              <span>Add Service</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <span>View Website</span>
              <ExternalLink size={14} />
            </a>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                RZ
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">Admin User</div>
                <div className="text-[10px] font-medium text-slate-500">System Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Body Section */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* Executive Overview KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Leads</span>
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <Users size={18} />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-extrabold text-slate-900">{analyticsData?.totalLeads ?? (leadFilter === 'ALL' ? leads.length : 0)}</h3>
                {analyticsData?.leadGrowthPercent !== null && analyticsData?.leadGrowthPercent !== undefined ? (
                  <span className={`text-xs font-semibold flex items-center gap-1 ${analyticsData.leadGrowthPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <TrendingUp size={12} /> {analyticsData.leadGrowthPercent >= 0 ? `+${analyticsData.leadGrowthPercent}%` : `${analyticsData.leadGrowthPercent}%`}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">No comparison data</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Real-time website inquiry count from PostgreSQL</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Services</span>
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                  <Sparkles size={18} />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-extrabold text-slate-900">{analyticsData?.activeServices ?? services.length}</h3>
                <span className="text-xs font-semibold text-slate-500">Live in CMS</span>
              </div>
              <p className="text-[11px] text-slate-400">Published services in PostgreSQL</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Case Studies</span>
                <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                  <FolderKanban size={18} />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-extrabold text-slate-900">{analyticsData?.caseStudies ?? projects.length}</h3>
                <span className="text-xs font-semibold text-purple-600">Published Projects</span>
              </div>
              <p className="text-[11px] text-slate-400">Verified client projects in PostgreSQL</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SEO Health</span>
                <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                  <Globe size={18} />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {analyticsData?.seoHealthScore !== undefined ? `${analyticsData.seoHealthScore} / 100` : '100 / 100'}
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <Check size={14} /> Score: {analyticsData?.seoHealthScore ?? 100}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Calculated from dynamic static page metadata checks</p>
            </div>
          </div>

          {/* TAB 1: LEADS CRM */}
          {activeTab === 'crm' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Inquiries & Leads CRM</h2>
                  <p className="text-xs text-slate-500">Track and manage client project requests submitted via website forms.</p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
                  {['ALL', 'NEW', 'CONTACTED', 'IN_DISCUSSION', 'WON', 'LOST'].map(st => (
                    <button
                      key={st}
                      onClick={() => setLeadFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${leadFilter === st
                          ? 'bg-white text-blue-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {loadingLeads ? (
                <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                  <RefreshCw size={24} className="animate-spin text-blue-600" />
                  <span className="text-xs font-semibold">Fetching leads from PostgreSQL API...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Client Name</th>
                        <th className="py-3 px-4">Service Required</th>
                        <th className="py-3 px-4">Budget</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Message Excerpt</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads
                        .filter(l => leadFilter === 'ALL' || l.status === leadFilter)
                        .filter(l => searchQuery === '' || l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.email.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(lead => (
                          <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4 font-semibold text-slate-900">
                              <div className="font-bold text-sm">{lead.name}</div>
                              <div className="text-slate-500 font-normal">{lead.email} {lead.company ? `• ${lead.company}` : ''}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                                {lead.serviceSelected}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-800">
                              {lead.budget || 'Custom Quote'}
                            </td>
                            <td className="py-4 px-4">
                              <select
                                value={lead.status}
                                onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer ${getStatusBadgeClass(lead.status)}`}
                              >
                                <option value="NEW">NEW</option>
                                <option value="CONTACTED">CONTACTED</option>
                                <option value="IN_DISCUSSION">IN DISCUSSION</option>
                                <option value="PROPOSAL_SENT">PROPOSAL SENT</option>
                                <option value="WON">WON</option>
                                <option value="LOST">LOST</option>
                              </select>
                            </td>
                            <td className="py-4 px-4 max-w-xs text-slate-600 truncate">
                              {lead.message}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete Lead"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: HERO CMS */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">Home Page → Hero Section CMS</h2>
                    {JSON.stringify(heroForm) !== JSON.stringify(initialHeroForm) ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        Unsaved Changes
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Published to Database
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Manage hero text, CTAs, and background media stored in PostgreSQL.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReloadHero}
                    disabled={loadingHero || savingHero}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={loadingHero ? 'animate-spin' : ''} />
                    <span>Reload from Database</span>
                  </button>

                  <button
                    onClick={handleSaveHero}
                    disabled={savingHero || loadingHero}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
                  >
                    {savingHero ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    <span>{savingHero ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>

              {heroSaved && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 font-semibold animate-fadeIn">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>Hero section configuration saved successfully to PostgreSQL and published live!</span>
                </div>
              )}

              {heroError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800 font-semibold">
                  <AlertTriangle size={18} className="text-rose-600 shrink-0" />
                  <span>{heroError}</span>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Hero Content Settings</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs font-semibold text-slate-700">Section Enabled</span>
                      <input
                        type="checkbox"
                        checked={heroForm.enabled}
                        onChange={(e) => setHeroForm({ ...heroForm, enabled: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                    </label>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Badge Text (Top Pill)</label>
                      <input
                        type="text"
                        maxLength={80}
                        value={heroForm.badgeText || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                        placeholder="SOFTWARE SOLUTIONS THAT SCALE"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block font-bold text-slate-700 mb-1">Heading Prefix *</label>
                        <input
                          type="text"
                          maxLength={120}
                          value={heroForm.headingPrefix}
                          onChange={(e) => setHeroForm({ ...heroForm, headingPrefix: e.target.value })}
                          placeholder="We Build Software"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block font-bold text-slate-700 mb-1">Highlighted Text</label>
                        <input
                          type="text"
                          maxLength={80}
                          value={heroForm.headingHighlight || ''}
                          onChange={(e) => setHeroForm({ ...heroForm, headingHighlight: e.target.value })}
                          placeholder="Drives Growth"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block font-bold text-slate-700 mb-1">Heading Suffix</label>
                        <input
                          type="text"
                          maxLength={120}
                          value={heroForm.headingSuffix || ''}
                          onChange={(e) => setHeroForm({ ...heroForm, headingSuffix: e.target.value })}
                          placeholder=""
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Hero Description *</label>
                      <textarea
                        rows={3}
                        maxLength={500}
                        value={heroForm.description}
                        onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                        placeholder="Empowering startups and enterprises with innovative..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Primary CTA */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Primary Call-to-Action</span>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={heroForm.primaryCtaEnabled}
                            onChange={(e) => setHeroForm({ ...heroForm, primaryCtaEnabled: e.target.checked })}
                            className="w-3.5 h-3.5 text-blue-600 rounded"
                          />
                          <span className="text-[11px] font-semibold text-slate-600">Enabled</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">CTA Label</label>
                          <input
                            type="text"
                            value={heroForm.primaryCtaText || ''}
                            onChange={(e) => setHeroForm({ ...heroForm, primaryCtaText: e.target.value })}
                            placeholder="Explore Our Services"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Target URL</label>
                          <input
                            type="text"
                            value={heroForm.primaryCtaUrl || ''}
                            onChange={(e) => setHeroForm({ ...heroForm, primaryCtaUrl: e.target.value })}
                            placeholder="/services"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={heroForm.primaryCtaOpenNewTab || false}
                          onChange={(e) => setHeroForm({ ...heroForm, primaryCtaOpenNewTab: e.target.checked })}
                          className="w-3.5 h-3.5 text-blue-600 rounded"
                        />
                        <span className="text-[11px] text-slate-600 font-medium">Open link in new tab</span>
                      </label>
                    </div>

                    {/* Secondary CTA */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Secondary Call-to-Action</span>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={heroForm.secondaryCtaEnabled}
                            onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaEnabled: e.target.checked })}
                            className="w-3.5 h-3.5 text-blue-600 rounded"
                          />
                          <span className="text-[11px] font-semibold text-slate-600">Enabled</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">CTA Label</label>
                          <input
                            type="text"
                            value={heroForm.secondaryCtaText || ''}
                            onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaText: e.target.value })}
                            placeholder="Book a Free Consultation"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Action Type</label>
                          <select
                            value={heroForm.secondaryCtaType || 'consultation'}
                            onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaType: e.target.value as 'consultation' | 'link' })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900"
                          >
                            <option value="consultation">Consultation Modal</option>
                            <option value="link">Custom URL Navigation</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Target URL</label>
                          <input
                            type="text"
                            value={heroForm.secondaryCtaUrl || ''}
                            onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaUrl: e.target.value })}
                            placeholder="#contact"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={heroForm.secondaryCtaOpenNewTab || false}
                          onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaOpenNewTab: e.target.checked })}
                          className="w-3.5 h-3.5 text-blue-600 rounded"
                        />
                        <span className="text-[11px] text-slate-600 font-medium">Open link in new tab</span>
                      </label>
                    </div>

                    {/* Background Media */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Background Image URL (Optional)</label>
                        <input
                          type="text"
                          value={heroForm.backgroundImageUrl || ''}
                          onChange={(e) => setHeroForm({ ...heroForm, backgroundImageUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Background Image Alt Text</label>
                        <input
                          type="text"
                          maxLength={200}
                          value={heroForm.backgroundImageAlt || ''}
                          onChange={(e) => setHeroForm({ ...heroForm, backgroundImageAlt: e.target.value })}
                          placeholder="Ryzite Hero Banner"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Preview */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Live Admin Preview</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Updates in Real-Time</span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm scale-[0.98] transform origin-top">
                    <Hero hero={heroForm} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TRUSTED CLIENTS CMS */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">Home Page → Trusted Clients Orbit Showcase</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                      {trustedClientsList.filter(c => c.enabled !== false).length} Active Logos
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Manage client logos, orbit display order, alt text for accessibility, and case study links stored in PostgreSQL.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchAdminClients}
                    disabled={loadingClients}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={loadingClients ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={handleOpenAddClient}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    <Plus size={16} />
                    <span>Add Trusted Client</span>
                  </button>
                </div>
              </div>

              {/* Main Content Layout: Grid (Table Left, Orbit Live Preview Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Client Management Table */}
                <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Client Showcase Directory</h3>
                    <span className="text-xs font-medium text-slate-500">
                      Total: {trustedClientsList.length} clients
                    </span>
                  </div>

                  {loadingClients ? (
                    <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                      <RefreshCw size={24} className="animate-spin text-blue-600" />
                      <span className="text-xs font-semibold">Loading clients from PostgreSQL...</span>
                    </div>
                  ) : trustedClientsList.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 space-y-3">
                      <Building2 size={36} className="mx-auto text-slate-300" />
                      <p className="text-xs font-semibold">No trusted client logos found.</p>
                      <button
                        onClick={handleOpenAddClient}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all inline-flex items-center gap-1.5"
                      >
                        <Plus size={14} /> Add First Client
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-3">Order</th>
                            <th className="py-3 px-3">Logo & Client Name</th>
                            <th className="py-3 px-3 text-center">Status</th>
                            <th className="py-3 px-3 text-center">Featured</th>
                            <th className="py-3 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {trustedClientsList.map((client, idx) => (
                            <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">

                              {/* Order & Reorder arrows */}
                              <td className="py-3 px-3 font-mono font-bold text-slate-400">
                                <div className="flex items-center gap-1">
                                  <span className="w-4 text-center">{client.displayOrder ?? idx + 1}</span>
                                  <div className="flex flex-col">
                                    <button
                                      disabled={idx === 0}
                                      onClick={() => handleMoveClientOrder(idx, 'up')}
                                      className="p-0.5 hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"
                                      title="Move Up"
                                    >
                                      <ArrowUp size={12} />
                                    </button>
                                    <button
                                      disabled={idx === trustedClientsList.length - 1}
                                      onClick={() => handleMoveClientOrder(idx, 'down')}
                                      className="p-0.5 hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"
                                      title="Move Down"
                                    >
                                      <ArrowDown size={12} />
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* Logo & Name */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center p-1 overflow-hidden shrink-0">
                                    {client.logoUrl ? (
                                      <img src={client.logoUrl} alt={client.logoAltText || client.name} className="max-h-full max-w-full object-contain" />
                                    ) : (
                                      <Building2 size={16} className="text-slate-400" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 text-xs">{client.name}</div>
                                    <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                                      {client.websiteUrl || client.caseStudySlug ? (
                                        <a href={client.websiteUrl || `/portfolio/${client.caseStudySlug}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-0.5">
                                          <span>{client.websiteUrl || `case-study: ${client.caseStudySlug}`}</span>
                                          <ExternalLink size={10} />
                                        </a>
                                      ) : (
                                        'No link set'
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Active / Enabled Toggle */}
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => handleToggleClientActive(client)}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${client.enabled !== false
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-slate-100 text-slate-500 border-slate-200'
                                    }`}
                                >
                                  {client.enabled !== false ? 'ACTIVE' : 'HIDDEN'}
                                </button>
                              </td>

                              {/* Featured Toggle */}
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => handleToggleClientFeatured(client)}
                                  className={`p-1.5 rounded-lg transition-colors ${client.featured
                                      ? 'text-amber-500 bg-amber-50 border border-amber-200'
                                      : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                                    }`}
                                  title={client.featured ? 'Featured on Orbit Showcase' : 'Mark as Featured'}
                                >
                                  <Star size={14} className={client.featured ? 'fill-amber-500' : ''} />
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-3 text-right space-x-1">
                                <button
                                  onClick={() => handleOpenEditClient(client)}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Client"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDeleteClient(client.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Delete Client"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Right Column: Live Orbit Showcase Preview */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Live Orbit Showcase Preview</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Circular Logo Rotation
                    </span>
                  </div>

                  {/* Render TrustedClients Component directly in Admin */}
                  <div className="border border-slate-800 rounded-2xl bg-slate-950 p-4 shadow-xl">
                    <TrustedClients clients={trustedClientsList.filter(c => c.enabled !== false)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: WHY CHOOSE US (PRINCIPLES) CMS */}
          {activeTab === 'principles' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">Home Page → Why Choose Us Pillars Showcase</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                      {principlesList.filter(p => p.enabled !== false).length} Active Pillars
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Manage core value pillars, badges, titles, descriptions, and icon mappings stored in PostgreSQL.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchAdminPrinciples}
                    disabled={loadingPrinciples}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={loadingPrinciples ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={handleOpenAddPrinciple}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    <Plus size={16} />
                    <span>Add Value Pillar</span>
                  </button>
                </div>
              </div>

              {/* Toast Banner */}
              {principleToast && (
                <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-md transition-all ${principleToast.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    {principleToast.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertTriangle size={16} className="text-rose-600" />}
                    <span>{principleToast.message}</span>
                  </div>
                  <button onClick={() => setPrincipleToast(null)} className="hover:opacity-75">✕</button>
                </div>
              )}

              {/* Main Content Layout: Table Left, Live Component Preview Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Management Table */}
                <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Core Pillars Directory</h3>
                    <span className="text-xs font-medium text-slate-500">
                      Total: {principlesList.length} pillars
                    </span>
                  </div>

                  {loadingPrinciples ? (
                    <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                      <RefreshCw size={24} className="animate-spin text-blue-600" />
                      <span className="text-xs font-semibold">Loading pillars from PostgreSQL...</span>
                    </div>
                  ) : principlesList.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 space-y-3">
                      <ShieldCheck size={36} className="mx-auto text-slate-300" />
                      <p className="text-xs font-semibold">No pillars configured yet.</p>
                      <button
                        onClick={handleOpenAddPrinciple}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all inline-flex items-center gap-1.5"
                      >
                        <Plus size={14} /> Add First Pillar
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-3">Order</th>
                            <th className="py-3 px-3">Badge & Title</th>
                            <th className="py-3 px-3 text-center">Status</th>
                            <th className="py-3 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {principlesList.map((principle, idx) => (
                            <tr key={principle.id} className="hover:bg-slate-50/80 transition-colors">
                              {/* Order */}
                              <td className="py-3 px-3 font-mono font-bold text-slate-400">
                                <div className="flex items-center gap-1">
                                  <span className="w-4 text-center">{principle.displayOrder ?? idx + 1}</span>
                                  <div className="flex flex-col">
                                    <button
                                      disabled={idx === 0}
                                      onClick={() => handleMovePrincipleOrder(idx, 'up')}
                                      className="p-0.5 hover:bg-slate-200 rounded disabled:opacity-30 text-slate-600"
                                      title="Move Up"
                                    >
                                      <ArrowUp size={12} />
                                    </button>
                                    <button
                                      disabled={idx === principlesList.length - 1}
                                      onClick={() => handleMovePrincipleOrder(idx, 'down')}
                                      className="p-0.5 hover:bg-slate-200 rounded disabled:opacity-30 text-slate-600"
                                      title="Move Down"
                                    >
                                      <ArrowDown size={12} />
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* Badge & Title */}
                              <td className="py-3 px-3">
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 inline-block mb-1">
                                    {principle.badge}
                                  </span>
                                  <div className="font-bold text-slate-900 text-xs">{principle.title}</div>
                                  <div className="text-[11px] text-slate-400 line-clamp-1 max-w-[240px]">
                                    {principle.description}
                                  </div>
                                </div>
                              </td>

                              {/* Enabled Toggle */}
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => handleTogglePrincipleEnabled(principle)}
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${principle.enabled !== false
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-slate-100 text-slate-500 border-slate-200'
                                    }`}
                                >
                                  {principle.enabled !== false ? 'ACTIVE' : 'HIDDEN'}
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-3 text-right space-x-1">
                                <button
                                  onClick={() => handleOpenEditPrinciple(principle)}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Pillar"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDeletePrinciple(principle.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Delete Pillar"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Right Column: Live Component Preview */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Live Section Preview</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      PostgreSQL Sync
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl bg-white shadow-lg overflow-hidden">
                    <WhyChooseUs items={principlesList.filter(p => p.enabled !== false)} />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: COMPANY STATISTICS CMS */}
          {activeTab === 'statistics' && (
            <div className="space-y-6">
              {/* Header & Controls Bar */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">Website Content → Company Statistics CMS</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                      {companyStatisticsList.filter(s => s.status === 'PUBLISHED').length} Published
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Manage dynamic metrics & credibility indicators displayed on the homepage 'Why Choose Us' section.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchAdminStatistics}
                    disabled={loadingStatistics}
                    className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    title="Refresh statistics list"
                  >
                    <RefreshCw size={16} className={loadingStatistics ? 'animate-spin' : ''} />
                  </button>

                  <button
                    onClick={handleOpenAddStatistic}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Add New Statistic</span>
                  </button>
                </div>
              </div>

              {/* Toast Notification Banner */}
              {statisticToast && (
                <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-md transition-all ${statisticToast.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    {statisticToast.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertTriangle size={16} className="text-rose-600" />}
                    <span>{statisticToast.message}</span>
                  </div>
                  <button onClick={() => setStatisticToast(null)} className="hover:opacity-75">✕</button>
                </div>
              )}

              {/* Main Table / Grid Container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Table Column (lg:col-span-7) */}
                <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <BarChart3 size={16} className="text-blue-600" />
                      <span>All Configured Statistics</span>
                    </h3>
                    <span className="text-xs font-semibold text-slate-400 font-mono">
                      {companyStatisticsList.length} Total Rows
                    </span>
                  </div>

                  {loadingStatistics ? (
                    <div className="p-12 text-center text-slate-400 space-y-2">
                      <RefreshCw size={24} className="animate-spin mx-auto text-blue-600" />
                      <p className="text-xs font-medium">Loading company statistics from PostgreSQL...</p>
                    </div>
                  ) : companyStatisticsList.length === 0 ? (
                    <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-3">
                      <BarChart3 size={32} className="mx-auto text-slate-300" />
                      <p className="text-xs font-semibold text-slate-600">No company statistics configured yet.</p>
                      <button
                        onClick={handleOpenAddStatistic}
                        className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs shadow-sm hover:bg-blue-700"
                      >
                        Add First Statistic
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-3">Order</th>
                            <th className="py-3 px-3">Icon</th>
                            <th className="py-3 px-3">Value</th>
                            <th className="py-3 px-3">Label</th>
                            <th className="py-3 px-3 text-center">Status</th>
                            <th className="py-3 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {companyStatisticsList.map((stat, idx) => {
                            const IconComp = stat.iconName && STAT_ICON_MAP[stat.iconName] ? STAT_ICON_MAP[stat.iconName] : Rocket;
                            return (
                              <tr key={stat.id} className="hover:bg-slate-50/80 transition-colors">
                                {/* Order & Reorder arrows */}
                                <td className="py-3 px-3 font-mono font-bold text-slate-400">
                                  <div className="flex items-center gap-1">
                                    <span className="w-4 text-center">{stat.displayOrder ?? idx + 1}</span>
                                    <div className="flex flex-col">
                                      <button
                                        disabled={idx === 0}
                                        onClick={() => handleMoveStatisticOrder(idx, 'up')}
                                        className="p-0.5 hover:bg-slate-200 rounded disabled:opacity-30 text-slate-600"
                                        title="Move Up"
                                      >
                                        <ArrowUp size={12} />
                                      </button>
                                      <button
                                        disabled={idx === companyStatisticsList.length - 1}
                                        onClick={() => handleMoveStatisticOrder(idx, 'down')}
                                        className="p-0.5 hover:bg-slate-200 rounded disabled:opacity-30 text-slate-600"
                                        title="Move Down"
                                      >
                                        <ArrowDown size={12} />
                                      </button>
                                    </div>
                                  </div>
                                </td>

                                {/* Icon */}
                                <td className="py-3 px-3">
                                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                                    <IconComp size={16} style={{ color: stat.iconColor || '#0052FF' }} />
                                  </div>
                                </td>

                                {/* Value (prefix + value + suffix) */}
                                <td className="py-3 px-3 font-extrabold text-blue-600 text-sm font-display">
                                  {stat.prefix || ''}{stat.value}{stat.suffix || ''}
                                </td>

                                {/* Label & Description */}
                                <td className="py-3 px-3">
                                  <div className="font-bold text-slate-900 text-xs">{stat.label}</div>
                                  {stat.description && (
                                    <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                                      {stat.description}
                                    </div>
                                  )}
                                </td>

                                {/* Status */}
                                <td className="py-3 px-3 text-center">
                                  <button
                                    onClick={() => handleToggleStatisticStatus(stat)}
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${stat.status === 'PUBLISHED'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : stat.status === 'DRAFT'
                                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                                          : 'bg-slate-100 text-slate-500 border-slate-200'
                                      }`}
                                  >
                                    {stat.status}
                                  </button>
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-3 text-right space-x-1">
                                  <button
                                    onClick={() => handleOpenEditStatistic(stat)}
                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit Statistic"
                                  >
                                    <Edit3 size={15} />
                                  </button>
                                  <button
                                    onClick={() => handleToggleStatisticStatus(stat)}
                                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                    title={stat.status === 'PUBLISHED' ? 'Hide Statistic' : 'Publish Statistic'}
                                  >
                                    {stat.status === 'PUBLISHED' ? <EyeOff size={15} /> : <Eye size={15} />}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStatistic(stat.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                    title="Delete Statistic"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Live Preview Bar (lg:col-span-5) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-cyan-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Homepage Card Preview</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Component Sync
                    </span>
                  </div>

                  {/* Dynamic Statistic Cards Render */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
                    <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                      "Why Choose Us" Floating Stats Bar
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {companyStatisticsList.filter(s => s.status === 'PUBLISHED').map((stat) => {
                        const IconComp = stat.iconName && STAT_ICON_MAP[stat.iconName] ? STAT_ICON_MAP[stat.iconName] : Rocket;
                        return (
                          <div key={stat.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
                            <div className="flex items-center justify-center gap-1">
                              <IconComp size={16} style={{ color: stat.iconColor || '#0052FF' }} />
                              <div className="text-2xl font-black text-[#0052FF] font-display">
                                {stat.prefix || ''}{stat.value}{stat.suffix || ''}
                              </div>
                            </div>
                            <div className="text-xs font-bold text-slate-800">{stat.label}</div>
                            {stat.description && <div className="text-[10px] text-slate-400">{stat.description}</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}


          {/* TAB 2: SEO & AEO ENGINE */}
          {activeTab === 'seo' && (
            <AeoKnowledgeHubModule renderSerpSection={
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">SEO & Search Engine Control</h2>
                    <p className="text-xs text-slate-500">Configure page titles, meta descriptions, canonical URLs, and preview Google desktop SERP results.</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={runSerpAudit}
                      disabled={loadingAudit}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors"
                    >
                      <Sparkles size={16} />
                      <span>{loadingAudit ? 'Auditing Schema...' : 'Metadata Completeness & Health Audit'}</span>
                    </button>
                    <button
                      onClick={() => handleSaveSeo()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                    >
                      <Save size={16} />
                      <span>{seoSaved ? 'Saved to PostgreSQL!' : 'Save SEO Metadata'}</span>
                    </button>
                  </div>
                </div>

                {/* Page Selector Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
                  {['home', 'services', 'solutions', 'portfolio', 'about', 'blog'].map(pk => (
                    <button
                      key={pk}
                      onClick={() => setSelectedSeoPage(pk)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${selectedSeoPage === pk
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      {pk} Page
                    </button>
                  ))}
                </div>

                {seoConfig && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Meta Fields Form */}
                    <div className="space-y-4 bg-slate-50 border border-slate-200/80 p-5 rounded-2xl">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Metadata Configuration</h3>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Page Title Tag (Recommended: 50-60 characters)</label>
                        <input
                          type="text"
                          value={seoConfig.title || ''}
                          onChange={(e) => setSeoConfig({ ...seoConfig, title: e.target.value })}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Meta Description (Recommended: 150-160 characters)</label>
                        <textarea
                          rows={3}
                          value={seoConfig.description || ''}
                          onChange={(e) => setSeoConfig({ ...seoConfig, description: e.target.value })}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Canonical URL</label>
                        <input
                          type="text"
                          value={seoConfig.canonicalUrl || ''}
                          onChange={(e) => setSeoConfig({ ...seoConfig, canonicalUrl: e.target.value })}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Google SERP Live Preview Card */}
                    <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Google Desktop Search Preview</h3>

                      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-slate-700 truncate font-mono">
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">R</span>
                          <span>{seoConfig.canonicalUrl || 'https://ryzite.com'}</span>
                        </div>
                        <div className="text-blue-700 font-semibold text-lg hover:underline cursor-pointer leading-snug">
                          {seoConfig.title || 'Ryzite Agency'}
                        </div>
                        <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {seoConfig.description || 'No description provided.'}
                        </div>
                      </div>

                      <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                          <CheckCircle2 size={15} className="text-blue-600" />
                          <span>Answer Engine Optimization (AEO) Ready</span>
                        </div>
                        <p className="text-[11px] text-blue-700">
                          Schema.org JSON-LD structured data generated for Google AI Overviews & Perplexity citation engines.
                        </p>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            } />
          )}

          {/* TAB: ABOUT PAGE CMS */}
          {activeTab === 'about' && <AboutCmsModule />}

          {/* TAB: TECHNICAL LEADERSHIP TEAM CMS */}
          {activeTab === 'team' && <TeamCmsModule />}

          {/* TAB 3: SERVICES CMS */}
          {/* TAB 4: SERVICES OFFERED CMS */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">Services Catalog Management</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {adminServicesList.filter(s => s.active !== false).length} Active Services Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Manage public service offerings, image media uploads, pricing, and SEO meta tags stored in PostgreSQL.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchAdminServices}
                    disabled={loadingServices}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={loadingServices ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={handleOpenAddService}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    <Plus size={16} />
                    <span>Add New Service</span>
                  </button>
                </div>
              </div>

              {/* Main Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Services List</h3>
                  <span className="text-xs font-medium text-slate-500">
                    Total: {adminServicesList.length} services
                  </span>
                </div>

                {loadingServices ? (
                  <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                    <RefreshCw size={24} className="animate-spin text-blue-600" />
                    <span className="text-xs font-semibold">Loading services catalog from PostgreSQL...</span>
                  </div>
                ) : adminServicesList.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3">
                    <Sparkles size={36} className="mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">No service offerings found.</p>
                    <button
                      onClick={handleOpenAddService}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all inline-flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Add First Service
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-3">Order</th>
                          <th className="py-3 px-3">Image & Service Title</th>
                          <th className="py-3 px-3">Category</th>
                          <th className="py-3 px-3">Starting Price</th>
                          <th className="py-3 px-3 text-center">Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {adminServicesList.map((srv, idx) => (
                          <tr key={srv.id} className="hover:bg-slate-50/80 transition-colors">

                            {/* Order & Reorder arrows */}
                            <td className="py-3 px-3 font-mono font-bold text-slate-400">
                              <div className="flex items-center gap-1">
                                <span className="w-4 text-center">{srv.displayOrder ?? idx + 1}</span>
                                <div className="flex flex-col">
                                  <button
                                    disabled={idx === 0}
                                    onClick={() => handleMoveServiceOrder(idx, 'up')}
                                    className="p-0.5 hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"
                                    title="Move Up"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    disabled={idx === adminServicesList.length - 1}
                                    onClick={() => handleMoveServiceOrder(idx, 'down')}
                                    className="p-0.5 hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"
                                    title="Move Down"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Image Thumbnail & Service Info */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                                  {srv.imageUrl ? (
                                    <img
                                      src={srv.imageUrl}
                                      alt={srv.imageAlt || srv.title}
                                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=85&w=200&auto=format&fit=crop"; }}
                                      className="w-full h-full object-cover rounded-md"
                                    />
                                  ) : (
                                    <Sparkles size={16} className="text-blue-400" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 text-xs">{srv.title}</div>
                                  <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                    /services/{srv.slug}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category Badge */}
                            <td className="py-3 px-3">
                              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200/80">
                                {srv.category}
                              </span>
                            </td>

                            {/* Starting Price */}
                            <td className="py-3 px-3 font-semibold text-emerald-700">
                              {srv.startingPrice || '$10,000'}
                            </td>

                            {/* Active / Enabled Toggle */}
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => handleToggleServiceActive(srv)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${srv.active !== false
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                  }`}
                              >
                                {srv.active !== false ? 'ACTIVE' : 'HIDDEN'}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-3 text-right space-x-1">
                              <button
                                onClick={() => handleOpenEditService(srv)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Service"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteService(srv.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete Service"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PORTFOLIO & CASE STUDIES CMS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Toast Banner */}
              {projectToast && (
                <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between animate-fadeIn ${projectToast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                    <span>{projectToast.message}</span>
                  </div>
                  <button onClick={() => setProjectToast(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
              )}

              {/* KPI Header Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Case Studies</span>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl font-black text-slate-900">{projectCounts.total || adminProjectsList.length}</h3>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      PostgreSQL DB
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Published Live</span>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl font-black text-emerald-600">{projectCounts.published}</h3>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Publicly Visible
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Featured on Homepage</span>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl font-black text-amber-500">{projectCounts.featured}</h3>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      Orbit Grid
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Drafts / In Review</span>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl font-black text-slate-500">{projectCounts.drafts}</h3>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      Unpublished
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar & Filters */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Featured Projects & Case Studies CMS</h2>
                    <p className="text-xs text-slate-500">Manage client success stories, tech stacks, impact metrics, and SEO metadata.</p>
                  </div>

                  <button
                    onClick={handleOpenAddProject}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Add New Case Study</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      placeholder="Search by project title, client, slug..."
                      value={projectSearchQuery}
                      onChange={(e) => setProjectSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={projectFilterCategory}
                      onChange={(e) => setProjectFilterCategory(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="SaaS Platform">SaaS Platform</option>
                      <option value="AI & Automation">AI & Automation</option>
                      <option value="Mobile Engineering">Mobile Engineering</option>
                      <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    </select>

                    <select
                      value={projectFilterStatus}
                      onChange={(e) => setProjectFilterStatus(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Table View */}
                {loadingProjects ? (
                  <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                    <RefreshCw size={24} className="animate-spin text-blue-600" />
                    <span className="text-xs font-semibold">Loading project case studies from PostgreSQL...</span>
                  </div>
                ) : adminProjectsList.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3">
                    <FolderKanban size={36} className="mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">No project case studies found.</p>
                    <button
                      onClick={handleOpenAddProject}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all inline-flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Add First Project Case Study
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-3">Hero & Title</th>
                          <th className="py-3 px-3">Client</th>
                          <th className="py-3 px-3">Category</th>
                          <th className="py-3 px-3 text-center">Featured</th>
                          <th className="py-3 px-3 text-center">Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {adminProjectsList
                          .filter(p => projectSearchQuery === '' || p.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) || (p.clientName || p.client || '').toLowerCase().includes(projectSearchQuery.toLowerCase()) || p.slug.toLowerCase().includes(projectSearchQuery.toLowerCase()))
                          .filter(p => projectFilterCategory === 'ALL' || p.category === projectFilterCategory)
                          .filter(p => projectFilterStatus === 'ALL' || p.status === projectFilterStatus)
                          .map(proj => (
                            <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-10 rounded-lg bg-slate-900 border border-slate-700 p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
                                    {proj.heroImage ? (
                                      <img src={proj.heroImage} alt={proj.title} className="w-full h-full object-cover rounded-md" />
                                    ) : (
                                      <FolderKanban size={16} className="text-purple-400" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 text-xs">{proj.title}</div>
                                    <div className="text-[11px] text-slate-400 font-mono">
                                      /portfolio/{proj.slug}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3 font-semibold text-slate-800">
                                {proj.clientName || proj.client || 'Enterprise Client'}
                              </td>

                              <td className="py-3 px-3">
                                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200/80">
                                  {proj.category}
                                </span>
                              </td>

                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => handleToggleProjectFeatured(proj.id, proj.featured)}
                                  className={`p-1.5 rounded-lg border transition-colors ${proj.featured
                                      ? 'bg-amber-50 text-amber-500 border-amber-200 hover:bg-amber-100'
                                      : 'bg-slate-50 text-slate-300 border-slate-200 hover:text-slate-400'
                                    }`}
                                  title={proj.featured ? 'Featured on Homepage' : 'Not Featured'}
                                >
                                  <Star size={14} fill={proj.featured ? 'currentColor' : 'none'} />
                                </button>
                              </td>

                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => handleToggleProjectStatus(proj.id, proj.status || 'PUBLISHED')}
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${proj.status === 'PUBLISHED'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-slate-100 text-slate-500 border-slate-200'
                                    }`}
                                >
                                  {proj.status || 'PUBLISHED'}
                                </button>
                              </td>

                              <td className="py-3 px-3 text-right space-x-1">
                                <button
                                  onClick={() => handleOpenEditProject(proj)}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Project"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(proj.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Delete Project"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: BLOG CMS */}
          {activeTab === 'blogs' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Engineering Articles ({blogs.length})</h2>
                  <p className="text-xs text-slate-500">Manage technical publications and AEO direct answers published on `/blog`.</p>
                </div>
              </div>

              <div className="space-y-3">
                {blogs.map(blog => (
                  <div key={blog.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{blog.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{blog.category} • Published {blog.publishedAt}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: REAL-TIME ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-lg font-bold text-slate-900">Real-Time Web Analytics</h2>
                <p className="text-xs text-slate-500">Live traffic streams, top referrers, and Core Web Vitals audit metrics.</p>
              </div>

              {analyticsData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Total Page Views</span>
                      <h4 className="text-3xl font-extrabold text-slate-900">{analyticsData.totalPageViews}</h4>
                    </div>
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Unique Visitors</span>
                      <h4 className="text-3xl font-extrabold text-slate-900">{analyticsData.uniqueVisitors}</h4>
                    </div>
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-xs font-semibold text-slate-500">Core Web Vitals Score</span>
                      <h4 className="text-3xl font-extrabold text-emerald-600">{analyticsData.coreWebVitals?.score || 98}/100</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Page Traffic</h4>
                      <div className="space-y-2">
                        {analyticsData.topPages?.map((tp: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-xs p-2.5 bg-white rounded-lg border border-slate-200/80">
                            <span className="font-mono text-slate-800 font-semibold">{tp.path}</span>
                            <span className="font-bold text-blue-600">{tp.views} views</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Referral Traffic Sources</h4>
                      <div className="space-y-2">
                        {analyticsData.referrers?.map((ref: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-xs p-2.5 bg-white rounded-lg border border-slate-200/80">
                            <span className="text-slate-800 font-medium">{ref.source}</span>
                            <span className="font-bold text-emerald-600">{ref.count} clicks</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 font-medium text-xs">
                  Loading real-time web vitals and traffic streams...
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Modal: Add/Edit Trusted Client */}
      {showClientModal && (
        <div className="fixed inset-0 z-[100000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Building2 size={18} className="text-blue-600" />
                <span>{editingClient ? 'Edit Trusted Client' : 'Add New Trusted Client'}</span>
              </h3>
              <button
                onClick={() => setShowClientModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {clientError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <AlertTriangle size={16} className="shrink-0 text-rose-600" />
                  <span>{clientError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Client / Brand Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value, companyName: e.target.value })}
                  placeholder="e.g. PineGen AI"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Logo Image (Saved to Local Disk Folder)
                  </label>
                  <label className="cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                    <Plus size={13} />
                    <span>{uploadingLogo ? 'Uploading File...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={clientForm.logoUrl}
                    onChange={(e) => setClientForm({ ...clientForm, logoUrl: e.target.value })}
                    placeholder="Upload local file above or enter image path (e.g. http://localhost:5000/uploads/logo.png)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                  {clientForm.logoUrl && (
                    <div className="w-9 h-9 rounded-lg border border-slate-700 bg-slate-900 p-1 flex items-center justify-center shrink-0 overflow-hidden" title="Live Logo Preview">
                      <img src={clientForm.logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Uploaded logo images are optimized & stored on <code className="text-blue-600 font-mono">Cloudinary CDN</code> with automatic WebP conversion.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Logo Accessible Alt Text <span className="text-xs font-normal text-slate-400">(AEO & SEO optimized)</span>
                </label>
                <input
                  type="text"
                  maxLength={200}
                  value={clientForm.logoAltText}
                  onChange={(e) => setClientForm({ ...clientForm, logoAltText: e.target.value })}
                  placeholder={clientForm.name ? `${clientForm.name} company logo` : 'PineGen AI company logo'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Website URL
                  </label>
                  <input
                    type="text"
                    value={clientForm.websiteUrl}
                    onChange={(e) => setClientForm({ ...clientForm, websiteUrl: e.target.value })}
                    placeholder="https://clientwebsite.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Related Case Study Slug
                  </label>
                  <input
                    type="text"
                    value={clientForm.caseStudySlug}
                    onChange={(e) => setClientForm({ ...clientForm, caseStudySlug: e.target.value })}
                    placeholder="pinegen-ai-automation"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clientForm.enabled}
                    onChange={(e) => setClientForm({ ...clientForm, enabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Active (Visible on Homepage)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clientForm.featured}
                    onChange={(e) => setClientForm({ ...clientForm, featured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Featured in Orbit</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowClientModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveClient}
                disabled={clientSaving}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {clientSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{clientSaving ? 'Saving...' : 'Save Trusted Client'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Service Offering */}
      {showServiceModal && (
        <div className="fixed inset-0 z-[100000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleIn">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles size={18} className="text-blue-600" />
                <span>{editingService ? 'Edit Service Offering' : 'Add New Service Offering'}</span>
              </h3>
              <button
                onClick={() => setShowServiceModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {serviceError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <AlertTriangle size={16} className="shrink-0 text-rose-600" />
                  <span>{serviceError}</span>
                </div>
              )}

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Service Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({
                      ...serviceForm,
                      title: e.target.value,
                      slug: serviceForm.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                      seoTitle: serviceForm.seoTitle || `${e.target.value} | Ryzite Agency`
                    })}
                    placeholder="e.g. AI Workflow Automation"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={serviceForm.slug}
                    onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value })}
                    placeholder="ai-workflow-automation"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as ServiceCategory })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile Engineering</option>
                    <option value="ai-automation">AI & Workflow Automation</option>
                    <option value="cloud-devops">Cloud & DevOps</option>
                    <option value="consulting">Tech Consulting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Starting Price
                  </label>
                  <input
                    type="text"
                    value={serviceForm.startingPrice}
                    onChange={(e) => setServiceForm({ ...serviceForm, startingPrice: e.target.value })}
                    placeholder="$10,000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Timeline
                  </label>
                  <input
                    type="text"
                    value={serviceForm.timeline}
                    onChange={(e) => setServiceForm({ ...serviceForm, timeline: e.target.value })}
                    placeholder="4 - 8 Weeks"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Service Image Upload & Preview Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Service Image (Cloudinary Cloud Storage)
                  </label>
                  <label className="cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">
                    <Plus size={13} />
                    <span>{uploadingServiceImg ? 'Uploading...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleServiceImageFileUpload}
                      disabled={uploadingServiceImg}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-8 space-y-2">
                    <input
                      type="text"
                      value={serviceForm.imageUrl}
                      onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })}
                      placeholder="Upload file above or enter URL (e.g. /uploads/services/ai.webp)"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />

                    <input
                      type="text"
                      value={serviceForm.imageAlt}
                      onChange={(e) => setServiceForm({ ...serviceForm, imageAlt: e.target.value })}
                      placeholder="Image Alt Text for SEO & Accessibility"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Live Image Preview Box */}
                  <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 bg-slate-900 border border-slate-700 rounded-xl text-center min-h-[90px]">
                    {tempServicePreviewUrl ? (
                      <div className="space-y-1">
                        <img src={tempServicePreviewUrl} alt="Temp Preview" className="max-h-16 max-w-full object-contain mx-auto rounded" />
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800">
                          Temporary File Preview
                        </span>
                      </div>
                    ) : serviceForm.imageUrl ? (
                      <div className="space-y-1">
                        <img src={serviceForm.imageUrl} alt="Saved Preview" className="max-h-16 max-w-full object-contain mx-auto rounded" />
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                          Database Image URL Preview
                        </span>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-[11px] font-medium space-y-1">
                        <Sparkles size={20} className="mx-auto text-slate-600" />
                        <span>No Image Selected</span>
                        <div className="text-[9px] text-slate-600">Uses default placeholder</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={serviceForm.shortDescription}
                  onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                  placeholder="Brief summary for homepage grid cards..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Description & Capabilities
                </label>
                <textarea
                  rows={3}
                  value={serviceForm.fullDescription}
                  onChange={(e) => setServiceForm({ ...serviceForm, fullDescription: e.target.value })}
                  placeholder="Comprehensive service details for full page view..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* SEO Metadata Section */}
              <div className="p-4 bg-blue-50/50 border border-blue-200/70 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">SEO & AEO Metadata</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={serviceForm.seoTitle}
                    onChange={(e) => setServiceForm({ ...serviceForm, seoTitle: e.target.value })}
                    placeholder="Page Title Tag (e.g. AI Automation Solutions | Ryzite)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <textarea
                    rows={2}
                    value={serviceForm.seoDescription}
                    onChange={(e) => setServiceForm({ ...serviceForm, seoDescription: e.target.value })}
                    placeholder="Meta Description (e.g. Build autonomous LLM agents and workflow bots...)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    type="text"
                    value={serviceForm.seoKeywords}
                    onChange={(e) => setServiceForm({ ...serviceForm, seoKeywords: e.target.value })}
                    placeholder="Focus Keywords (comma separated: AI automation, LLM workflows, RAG pipelines)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Status Switches */}
              <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceForm.active}
                    onChange={(e) => setServiceForm({ ...serviceForm, active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Active (Published on Website)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceForm.featured}
                    onChange={(e) => setServiceForm({ ...serviceForm, featured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Featured Service</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowServiceModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveService}
                disabled={serviceSaving}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {serviceSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{serviceSaving ? 'Saving...' : 'Save Service Offering'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT COMPANY STATISTIC MODAL */}
      {showStatisticModal && (
        <div className="fixed inset-0 z-[100000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-400" />
                <h3 className="font-bold text-sm">
                  {editingStatistic ? 'Edit Company Statistic' : 'Add New Company Statistic'}
                </h3>
              </div>
              <button
                onClick={() => setShowStatisticModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {statisticError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>{statisticError}</span>
                </div>
              )}

              {/* Statistic Value, Prefix, Suffix */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prefix
                  </label>
                  <input
                    type="text"
                    value={statisticForm.prefix}
                    onChange={(e) => setStatisticForm({ ...statisticForm, prefix: e.target.value })}
                    placeholder="e.g. $"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Statistic Value <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={statisticForm.value}
                    onChange={(e) => setStatisticForm({ ...statisticForm, value: e.target.value })}
                    placeholder="e.g. 25"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Suffix
                  </label>
                  <input
                    type="text"
                    value={statisticForm.suffix}
                    onChange={(e) => setStatisticForm({ ...statisticForm, suffix: e.target.value })}
                    placeholder="e.g. + or %"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* Live Form Display Preview */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Final Display Preview:</span>
                <span className="text-xl font-black text-blue-600 font-display">
                  {statisticForm.prefix}{statisticForm.value || '0'}{statisticForm.suffix}
                </span>
              </div>

              {/* Label & Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Label <span className="text-rose-500">*</span> (max 100 chars)
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={statisticForm.label}
                  onChange={(e) => setStatisticForm({
                    ...statisticForm,
                    label: e.target.value,
                    seoTitle: statisticForm.seoTitle || `${statisticForm.prefix}${statisticForm.value}${statisticForm.suffix} ${e.target.value}`
                  })}
                  placeholder="e.g. Projects Delivered"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description (max 250 chars)
                </label>
                <textarea
                  rows={2}
                  maxLength={250}
                  value={statisticForm.description}
                  onChange={(e) => setStatisticForm({ ...statisticForm, description: e.target.value })}
                  placeholder="e.g. Global enterprise deployments"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900"
                />
              </div>

              {/* Icon Selection & Icon Color */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Icon Selection
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['Rocket', 'Award', 'Users', 'Star', 'Globe', 'Clock', 'Code', 'Shield', 'TrendingUp'].map((iconKey) => {
                    const IconComp = STAT_ICON_MAP[iconKey] || Rocket;
                    const isSelected = statisticForm.iconName === iconKey;
                    return (
                      <button
                        type="button"
                        key={iconKey}
                        onClick={() => setStatisticForm({ ...statisticForm, iconName: iconKey })}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                      >
                        <IconComp size={18} />
                        <span className="text-[10px] font-bold truncate max-w-full">{iconKey}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Animation Toggle & Display Order */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={statisticForm.displayOrder}
                    onChange={(e) => setStatisticForm({ ...statisticForm, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statisticForm.status}
                    onChange={(e) => setStatisticForm({ ...statisticForm, status: e.target.value as StatisticStatus })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="HIDDEN">Hidden</option>
                  </select>
                </div>
              </div>

              {/* Counter Animation Toggle */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Enable Counter Animation</div>
                  <div className="text-[10px] text-slate-500">Animate count up from 0 → final value on scroll</div>
                </div>
                <input
                  type="checkbox"
                  checked={statisticForm.animationEnabled}
                  onChange={(e) => setStatisticForm({ ...statisticForm, animationEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* SEO Metadata */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500">
                  SEO Metadata Integration
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={statisticForm.seoTitle}
                    onChange={(e) => setStatisticForm({ ...statisticForm, seoTitle: e.target.value })}
                    placeholder="e.g. 25+ Projects Delivered | Ryzite"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SEO Description</label>
                  <input
                    type="text"
                    value={statisticForm.seoDescription}
                    onChange={(e) => setStatisticForm({ ...statisticForm, seoDescription: e.target.value })}
                    placeholder="e.g. Ryzite has delivered scalable software projects worldwide."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Live Instant Preview Card */}
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                <div className="text-[10px] uppercase tracking-wider font-bold text-cyan-400">Card Layout Preview</div>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-black text-blue-400 font-display">
                    {statisticForm.prefix}{statisticForm.value || '0'}{statisticForm.suffix}
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-white">{statisticForm.label || 'Statistic Label'}</div>
                    {statisticForm.description && <div className="text-xs text-slate-400">{statisticForm.description}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowStatisticModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStatistic}
                disabled={statisticSaving}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {statisticSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{statisticSaving ? 'Saving...' : 'Save Statistic'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD / EDIT PROJECT CASE STUDY MODAL (7-TAB ENTERPRISE EDITOR) */}
      {showProjectModal && (
        <div className="fixed inset-0 z-[100000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderKanban size={18} className="text-purple-400" />
                <h3 className="font-bold text-sm">
                  {editingProject ? `Edit Case Study: ${editingProject.title}` : 'Create New Enterprise Case Study'}
                </h3>
              </div>
              <button
                onClick={() => setShowProjectModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Editor Tab Strip */}
            <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
              {[
                { id: 1, label: 'Basic Info', icon: Building2 },
                { id: 2, label: 'Hero & Media', icon: ImageIcon },
                { id: 3, label: 'Story & Narrative', icon: FileText },
                { id: 4, label: 'Metrics & Results', icon: TrendingUp },
                { id: 5, label: 'Tech & Architecture', icon: Code },
                { id: 6, label: 'Gallery & Quote', icon: MessageSquareQuote },
                { id: 7, label: 'SEO & Schema', icon: Globe }
              ].map(tab => {
                const Icon = tab.icon;
                const active = projectActiveTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setProjectActiveTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${active
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {projectError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>{projectError}</span>
                </div>
              )}

              {/* TAB 1: BASIC INFO */}
              {projectActiveTab === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Project Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({
                          ...projectForm,
                          title: e.target.value,
                          slug: projectForm.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                          seoTitle: projectForm.seoTitle || `${e.target.value} Case Study | Ryzite`
                        })}
                        placeholder="e.g. PineGen AI Platform"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        URL Slug <span className="text-xs font-normal text-slate-400">(/portfolio/[slug])</span>
                      </label>
                      <input
                        type="text"
                        value={projectForm.slug}
                        onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                        placeholder="pinegen-ai-platform"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Client / Company Name</label>
                      <input
                        type="text"
                        value={projectForm.client}
                        onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                        placeholder="PineGen Inc."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 cursor-pointer"
                      >
                        <option value="SaaS Platform">SaaS Platform</option>
                        <option value="AI & Automation">AI & Automation</option>
                        <option value="Web Application">Web Application</option>
                        <option value="Mobile Engineering">Mobile Engineering</option>
                        <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                        <option value="Enterprise Software">Enterprise Software</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mockup UI Accent</label>
                      <select
                        value={projectForm.mockupType}
                        onChange={(e) => setProjectForm({ ...projectForm, mockupType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 cursor-pointer"
                      >
                        <option value="dark-dashboard">Dark Dashboard</option>
                        <option value="mobile-cards">Mobile Cards</option>
                        <option value="bot-interface">Bot Interface</option>
                        <option value="analytics-suite">Analytics Suite</option>
                      </select>
                    </div>
                  </div>

                  {/* Client Logo Upload */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">Client Logo (Cloudinary Storage)</label>
                      <label className="cursor-pointer text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                        <Upload size={13} />
                        <span>{uploadingClientLogo ? 'Uploading...' : 'Upload Logo'}</span>
                        <input type="file" accept="image/*" onChange={handleClientLogoUpload} disabled={uploadingClientLogo} className="hidden" />
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={projectForm.clientLogoUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, clientLogoUrl: e.target.value })}
                        placeholder="Cloudinary Logo URL or path..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900"
                      />
                      {projectForm.clientLogoUrl && (
                        <div className="w-8 h-8 rounded bg-slate-900 p-1 flex items-center justify-center shrink-0 border border-slate-700">
                          <img src={projectForm.clientLogoUrl} alt="Client Logo" className="max-h-full max-w-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={projectForm.status === 'PUBLISHED'}
                        onChange={(e) => setProjectForm({ ...projectForm, status: e.target.checked ? 'PUBLISHED' : 'DRAFT' })}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-700">Status: Published Live</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={projectForm.featured}
                        onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-700">Featured on Homepage Grid</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: HERO & MEDIA */}
              {projectActiveTab === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hero Subtitle / Tagline</label>
                    <input
                      type="text"
                      value={projectForm.subtitle}
                      onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                      placeholder="e.g. Next-Generation Autonomous AI Worker Infrastructure"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900"
                    />
                  </div>

                  {/* Main Hero Image Cloudinary Upload */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Hero Cover Image (Cloudinary CDN)
                      </label>
                      <label className="cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">
                        <Upload size={13} />
                        <span>{uploadingProjectImg ? 'Uploading File...' : 'Upload Cover Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProjectImageFileUpload}
                          disabled={uploadingProjectImg}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-8">
                        <input
                          type="text"
                          value={projectForm.heroImage}
                          onChange={(e) => setProjectForm({ ...projectForm, heroImage: e.target.value })}
                          placeholder="Upload cover file or enter CDN URL..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 bg-slate-900 border border-slate-700 rounded-xl text-center min-h-[80px]">
                        {tempProjectPreviewUrl ? (
                          <img src={tempProjectPreviewUrl} alt="Temp Preview" className="max-h-16 max-w-full object-contain mx-auto rounded" />
                        ) : projectForm.heroImage ? (
                          <img src={projectForm.heroImage} alt="Saved Cover" className="max-h-16 max-w-full object-contain mx-auto rounded" />
                        ) : (
                          <span className="text-slate-500 text-[11px]">No Cover Selected</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Live Application URL</label>
                      <input
                        type="text"
                        value={projectForm.websiteUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, websiteUrl: e.target.value })}
                        placeholder="https://app.client.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Repo / Source</label>
                      <input
                        type="text"
                        value={projectForm.githubUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                        placeholder="https://github.com/org/repo"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: STORY & NARRATIVE */}
              {projectActiveTab === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Short Overview (Teaser)</label>
                    <textarea
                      rows={2}
                      value={projectForm.shortDescription}
                      onChange={(e) => setProjectForm({ ...projectForm, shortDescription: e.target.value })}
                      placeholder="Bespoke generative AI content engine handling high concurrency..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Case Study Narrative / Story</label>
                    <textarea
                      rows={5}
                      value={projectForm.fullDescription}
                      onChange={(e) => setProjectForm({ ...projectForm, fullDescription: e.target.value })}
                      placeholder="Detailed architectural story, engineering evolution, and client outcomes..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Executive Business Impact Summary</label>
                    <textarea
                      rows={2}
                      value={projectForm.businessImpactText}
                      onChange={(e) => setProjectForm({ ...projectForm, businessImpactText: e.target.value })}
                      placeholder="e.g. Enabled PineGen Inc. to scale from $5M ARR to $32M ARR with zero downtime spikes."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: METRICS & RESULTS */}
              {projectActiveTab === 4 && (
                <div className="space-y-6">
                  {/* Dynamic Metrics Repeater */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Key Impact Metrics Pills</span>
                      <button
                        type="button"
                        onClick={() => setProjectForm(prev => ({
                          ...prev,
                          metrics: [...prev.metrics, { label: 'Metric Name', value: '100%', trend: '+20%' }]
                        }))}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-blue-200"
                      >
                        <Plus size={13} /> Add Metric Pill
                      </button>
                    </div>

                    {projectForm.metrics.map((m, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200">
                        <input
                          type="text"
                          value={m.label}
                          onChange={(e) => {
                            const updated = [...projectForm.metrics];
                            updated[idx].label = e.target.value;
                            setProjectForm({ ...projectForm, metrics: updated });
                          }}
                          placeholder="Label (e.g. Uptime)"
                          className="col-span-4 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900"
                        />
                        <input
                          type="text"
                          value={m.value}
                          onChange={(e) => {
                            const updated = [...projectForm.metrics];
                            updated[idx].value = e.target.value;
                            setProjectForm({ ...projectForm, metrics: updated });
                          }}
                          placeholder="Value (e.g. 99.99%)"
                          className="col-span-4 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-blue-600"
                        />
                        <input
                          type="text"
                          value={m.trend || ''}
                          onChange={(e) => {
                            const updated = [...projectForm.metrics];
                            updated[idx].trend = e.target.value;
                            setProjectForm({ ...projectForm, metrics: updated });
                          }}
                          placeholder="Trend/Badge"
                          className="col-span-3 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = projectForm.metrics.filter((_, i) => i !== idx);
                            setProjectForm({ ...projectForm, metrics: updated });
                          }}
                          className="col-span-1 text-slate-400 hover:text-rose-600 p-1 flex justify-center"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Quantitative Before vs After Repeater */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quantitative Results (Before vs. After)</span>
                      <button
                        type="button"
                        onClick={() => setProjectForm(prev => ({
                          ...prev,
                          resultsList: [...prev.resultsList, { metricName: 'API Latency', beforeValue: '3.5s', afterValue: '90ms', percentageChange: '-97.4%', timeframe: 'Immediate' }]
                        }))}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-blue-200"
                      >
                        <Plus size={13} /> Add Result Row
                      </button>
                    </div>

                    {projectForm.resultsList.map((r, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200">
                        <input
                          type="text"
                          value={r.metricName}
                          onChange={(e) => {
                            const updated = [...projectForm.resultsList];
                            updated[idx].metricName = e.target.value;
                            setProjectForm({ ...projectForm, resultsList: updated });
                          }}
                          placeholder="Metric Name"
                          className="col-span-3 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900"
                        />
                        <input
                          type="text"
                          value={r.beforeValue || ''}
                          onChange={(e) => {
                            const updated = [...projectForm.resultsList];
                            updated[idx].beforeValue = e.target.value;
                            setProjectForm({ ...projectForm, resultsList: updated });
                          }}
                          placeholder="Before (e.g. 4.2s)"
                          className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-rose-600 font-semibold"
                        />
                        <input
                          type="text"
                          value={r.afterValue || ''}
                          onChange={(e) => {
                            const updated = [...projectForm.resultsList];
                            updated[idx].afterValue = e.target.value;
                            setProjectForm({ ...projectForm, resultsList: updated });
                          }}
                          placeholder="After (e.g. 85ms)"
                          className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-emerald-600 font-bold"
                        />
                        <input
                          type="text"
                          value={r.percentageChange || ''}
                          onChange={(e) => {
                            const updated = [...projectForm.resultsList];
                            updated[idx].percentageChange = e.target.value;
                            setProjectForm({ ...projectForm, resultsList: updated });
                          }}
                          placeholder="Diff (e.g. -98%)"
                          className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-extrabold text-blue-600"
                        />
                        <input
                          type="text"
                          value={r.timeframe || ''}
                          onChange={(e) => {
                            const updated = [...projectForm.resultsList];
                            updated[idx].timeframe = e.target.value;
                            setProjectForm({ ...projectForm, resultsList: updated });
                          }}
                          placeholder="Timeframe"
                          className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = projectForm.resultsList.filter((_, i) => i !== idx);
                            setProjectForm({ ...projectForm, resultsList: updated });
                          }}
                          className="col-span-1 text-slate-400 hover:text-rose-600 p-1 flex justify-center"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: TECH & ARCHITECTURE */}
              {projectActiveTab === 5 && (
                <div className="space-y-6">
                  {/* Tech Stack Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tech Stack (Comma-separated)</label>
                    <input
                      type="text"
                      value={projectForm.techStack.join(', ')}
                      onChange={(e) => setProjectForm({
                        ...projectForm,
                        techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="Next.js 14, TypeScript, PostgreSQL, Prisma, Cloudinary, Tailwind CSS"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-medium text-slate-900"
                    />
                  </div>

                  {/* Architecture Diagram Upload */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">System Architecture Diagram (Cloudinary Storage)</label>
                      <label className="cursor-pointer text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                        <Upload size={13} />
                        <span>{uploadingArchDiagram ? 'Uploading Diagram...' : 'Upload Diagram'}</span>
                        <input type="file" accept="image/*" onChange={handleArchDiagramUpload} disabled={uploadingArchDiagram} className="hidden" />
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={projectForm.architectureDiagramUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, architectureDiagramUrl: e.target.value })}
                        placeholder="Cloudinary Diagram URL or path..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900"
                      />
                      {projectForm.architectureDiagramUrl && (
                        <div className="w-8 h-8 rounded bg-slate-900 p-1 flex items-center justify-center shrink-0 border border-slate-700">
                          <img src={projectForm.architectureDiagramUrl} alt="Arch Diagram" className="max-h-full max-w-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Engineering Challenges Repeater */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Engineering Challenges List</span>
                      <button
                        type="button"
                        onClick={() => setProjectForm(prev => ({
                          ...prev,
                          challengesList: [...prev.challengesList, { title: 'Challenge Title', description: 'Problem description', impact: 'Business impact' }]
                        }))}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-blue-200"
                      >
                        <Plus size={13} /> Add Challenge
                      </button>
                    </div>

                    {projectForm.challengesList.map((c, idx) => (
                      <div key={idx} className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={c.title}
                            onChange={(e) => {
                              const updated = [...projectForm.challengesList];
                              updated[idx].title = e.target.value;
                              setProjectForm({ ...projectForm, challengesList: updated });
                            }}
                            placeholder="Challenge Title"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = projectForm.challengesList.filter((_, i) => i !== idx);
                              setProjectForm({ ...projectForm, challengesList: updated });
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 ml-2"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={c.description || ''}
                          onChange={(e) => {
                            const updated = [...projectForm.challengesList];
                            updated[idx].description = e.target.value;
                            setProjectForm({ ...projectForm, challengesList: updated });
                          }}
                          placeholder="Challenge Details..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Architectural Solutions Repeater */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Architectural Solutions List</span>
                      <button
                        type="button"
                        onClick={() => setProjectForm(prev => ({
                          ...prev,
                          solutionsList: [...prev.solutionsList, { title: 'Solution Title', description: 'Architectural breakdown', codeSnippet: '// snippet' }]
                        }))}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-blue-200"
                      >
                        <Plus size={13} /> Add Solution
                      </button>
                    </div>

                    {projectForm.solutionsList.map((s, idx) => (
                      <div key={idx} className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={s.title}
                            onChange={(e) => {
                              const updated = [...projectForm.solutionsList];
                              updated[idx].title = e.target.value;
                              setProjectForm({ ...projectForm, solutionsList: updated });
                            }}
                            placeholder="Solution Title"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = projectForm.solutionsList.filter((_, i) => i !== idx);
                              setProjectForm({ ...projectForm, solutionsList: updated });
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 ml-2"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={s.description || ''}
                          onChange={(e) => {
                            const updated = [...projectForm.solutionsList];
                            updated[idx].description = e.target.value;
                            setProjectForm({ ...projectForm, solutionsList: updated });
                          }}
                          placeholder="Solution Architectural Details..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: GALLERY & TESTIMONIAL */}
              {projectActiveTab === 6 && (
                <div className="space-y-6">
                  {/* Media Screenshots Gallery Upload */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Screenshots & UI Gallery</span>
                      <label className="cursor-pointer text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                        <Upload size={13} />
                        <span>{uploadingGalleryImg ? 'Uploading Screenshot...' : 'Add Screenshot to Gallery'}</span>
                        <input type="file" accept="image/*" onChange={handleGalleryImageUpload} disabled={uploadingGalleryImg} className="hidden" />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {projectForm.galleryImages.map((img, idx) => (
                        <div key={idx} className="relative group bg-slate-900 border border-slate-700 rounded-xl overflow-hidden p-1">
                          <img src={img.url} alt={img.caption || 'Gallery Image'} className="h-24 w-full object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = projectForm.galleryImages.filter((_, i) => i !== idx);
                              setProjectForm({ ...projectForm, galleryImages: updated });
                            }}
                            className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Client Testimonial */}
                  <div className="p-4 bg-purple-50/50 border border-purple-200/80 rounded-2xl space-y-3">
                    <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">Client Endorsement / Testimonial</span>
                    <textarea
                      rows={3}
                      value={projectForm.testimonialQuote}
                      onChange={(e) => setProjectForm({ ...projectForm, testimonialQuote: e.target.value })}
                      placeholder="Executive Quote (e.g. Ryzite delivered our platform 2 weeks ahead of schedule with flawless precision...)"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={projectForm.testimonialAuthor}
                        onChange={(e) => setProjectForm({ ...projectForm, testimonialAuthor: e.target.value })}
                        placeholder="Author Name (e.g. Sarah Jenkins)"
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold"
                      />
                      <input
                        type="text"
                        value={projectForm.testimonialRole}
                        onChange={(e) => setProjectForm({ ...projectForm, testimonialRole: e.target.value })}
                        placeholder="Role (e.g. Chief Technology Officer)"
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                      />
                      <input
                        type="text"
                        value={projectForm.testimonialCompany}
                        onChange={(e) => setProjectForm({ ...projectForm, testimonialCompany: e.target.value })}
                        placeholder="Company Name"
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: SEO & AEO METADATA */}
              {projectActiveTab === 7 && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-3">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider text-[11px]">Google SERP & AEO Search Config</span>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Page Meta Title Tag</label>
                      <input
                        type="text"
                        value={projectForm.seoTitle}
                        onChange={(e) => setProjectForm({ ...projectForm, seoTitle: e.target.value })}
                        placeholder="e.g. PineGen AI - Generative Platform Case Study | Ryzite"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Page Meta Description</label>
                      <textarea
                        rows={2}
                        value={projectForm.seoDescription}
                        onChange={(e) => setProjectForm({ ...projectForm, seoDescription: e.target.value })}
                        placeholder="Search engine meta description snippet..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Focus Keywords (Comma-separated)</label>
                      <input
                        type="text"
                        value={projectForm.seoKeywords}
                        onChange={(e) => setProjectForm({ ...projectForm, seoKeywords: e.target.value, focusKeywords: e.target.value })}
                        placeholder="AI case study, SaaS architecture, Next.js 14, real-time analytics"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-medium">
                Step {projectActiveTab} of 7 • Stored in PostgreSQL
              </div>

              <div className="flex items-center gap-3">
                {projectActiveTab > 1 && (
                  <button
                    type="button"
                    onClick={() => setProjectActiveTab(prev => prev - 1)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Back
                  </button>
                )}

                {projectActiveTab < 7 ? (
                  <button
                    type="button"
                    onClick={() => setProjectActiveTab(prev => prev + 1)}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Next Tab →
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={handleSaveProject}
                  disabled={projectSaving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {projectSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>{projectSaving ? 'Saving to PostgreSQL...' : 'Save Case Study'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: WHY CHOOSE US PILLAR EDIT/ADD */}
      {showPrincipleModal && (
        <div className="fixed inset-0 z-[100000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0 animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {editingPrinciple ? 'Edit Why Choose Us Pillar' : 'Add New Pillar'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure value proposition pillar for the homepage showcase.</p>
                </div>
              </div>
              <button
                onClick={() => setShowPrincipleModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {principleError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
                  {principleError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Badge Text <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={principleForm.badge}
                  onChange={(e) => setPrincipleForm({ ...principleForm, badge: e.target.value })}
                  placeholder="e.g. Zero-Debt Code or 99.9% SLA"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pillar Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={principleForm.title}
                  onChange={(e) => setPrincipleForm({ ...principleForm, title: e.target.value })}
                  placeholder="e.g. Enterprise Engineering Standard"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pillar Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={principleForm.description}
                  onChange={(e) => setPrincipleForm({ ...principleForm, description: e.target.value })}
                  placeholder="Explain why clients choose Ryzite for this specific advantage..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-bold text-slate-700">Pillar Active Status</span>
                <button
                  type="button"
                  onClick={() => setPrincipleForm({ ...principleForm, enabled: !principleForm.enabled })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${principleForm.enabled
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-slate-100 text-slate-500 border-slate-300'
                    }`}
                >
                  {principleForm.enabled ? 'ACTIVE ON HOMEPAGE' : 'HIDDEN'}
                </button>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPrincipleModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePrinciple}
                disabled={principleSaving}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {principleSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{principleSaving ? 'Saving...' : 'Save Pillar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

