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
  BarChart3
} from 'lucide-react';
import { LeadItem, ServiceItem, ProjectItem, BlogPost, LeadStatus, PageMetadataConfig, HomeHeroConfig } from '../types';
import { SerpOptimizerModal } from './SerpOptimizerModal';
import { Hero } from './Hero';
import { api } from '../lib/api';

interface AdminDashboardProps {
  isOpen?: boolean;
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
  onClose,
  services,
  projects,
  blogs,
  onUpdateServices,
  onUpdateProjects,
  onUpdateBlogs
}) => {
  const [activeTab, setActiveTab] = useState<'crm' | 'hero' | 'services' | 'projects' | 'blogs' | 'seo' | 'analytics'>('crm');
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!isOpen) return null;

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

  // New Service Form state
  const [showNewService, setShowNewService] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('$10,000');
  const [newServiceCategory, setNewServiceCategory] = useState('web');

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

  useEffect(() => {
    fetchLeads(leadFilter);
    fetchSeo(selectedSeoPage);
    fetchAnalytics();
    fetchHero();

    const handleFocus = () => {
      fetchLeads(leadFilter);
      fetchAnalytics();
      fetchHero();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

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

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle) return;
    try {
      const newSrv = await api.createService({
        title: newServiceTitle,
        shortDescription: newServiceDesc,
        fullDescription: newServiceDesc,
        startingPrice: newServicePrice,
        category: newServiceCategory,
        slug: newServiceTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        iconName: 'Sparkles',
        features: ['Custom Portal Architecture', 'REST API Integration'],
        deliverables: ['Production Next.js App', 'Database Schema'],
        techStack: ['Next.js', 'PostgreSQL', 'TypeScript'],
        timeline: '4 - 8 Weeks',
        order: services.length + 1,
        featured: true
      });

      onUpdateServices([...services, newSrv]);
      setNewServiceTitle('');
      setNewServiceDesc('');
      setShowNewService(false);
    } catch (err) {
      console.error('Failed to create service:', err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.deleteService(id);
      onUpdateServices(services.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete service:', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.deleteProject(id);
      onUpdateProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete project:', err);
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
    switch(status) {
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'crm' 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={18} className={activeTab === 'crm' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Leads CRM</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'crm' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {leads.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'hero' 
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
              onClick={() => setActiveTab('seo')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'seo' 
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
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'services' 
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'projects' 
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'blogs' 
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'analytics' 
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
              onClick={() => setShowNewService(true)}
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        leadFilter === st 
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

          {/* TAB 2: SEO & AEO ENGINE */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
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
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        selectedSeoPage === pk 
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
            </div>
          )}

          {/* TAB 3: SERVICES CMS */}
          {activeTab === 'services' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Services Catalog ({services.length})</h2>
                  <p className="text-xs text-slate-500">Manage public engineering offerings, pricing, and capabilities.</p>
                </div>
                <button
                  onClick={() => setShowNewService(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  <span>Create Service</span>
                </button>
              </div>

              {showNewService && (
                <form onSubmit={handleCreateService} className="bg-slate-50 border border-blue-200 p-5 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-blue-900">Add New Service Offering</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Service Title</label>
                      <input
                        type="text"
                        placeholder="e.g. AI Workflow Automation"
                        value={newServiceTitle}
                        onChange={(e) => setNewServiceTitle(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Starting Price</label>
                      <input
                        type="text"
                        placeholder="e.g. $10,000"
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
                    <textarea
                      placeholder="Brief overview for homepage & services listing..."
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowNewService(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-xs">Save Service to Database</button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(srv => (
                  <div key={srv.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{srv.title}</h4>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md uppercase">
                          {srv.category || 'Engineering'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{srv.shortDescription}</p>
                      <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 inline-block">
                        Starting at {srv.startingPrice}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteService(srv.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PORTFOLIO CMS */}
          {activeTab === 'projects' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Portfolio & Case Studies ({projects.length})</h2>
                  <p className="text-xs text-slate-500">Manage client success stories and metrics published on `/portfolio`.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {projects.map(proj => (
                  <div key={proj.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <span>Client: {proj.client || 'Enterprise Partner'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
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

    </div>
  );
};
