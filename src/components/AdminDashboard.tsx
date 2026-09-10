import React, { useState, useEffect } from 'react';
import { 
  X, 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  FileText, 
  Globe, 
  Activity, 
  Download, 
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
  Star,
  Sliders,
  TrendingUp,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { LeadItem, ServiceItem, ProjectItem, BlogPost, LeadStatus, PageMetadataConfig } from '../types';
import { SerpOptimizerModal } from './SerpOptimizerModal';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  projects: ProjectItem[];
  blogs: BlogPost[];
  onUpdateServices: (services: ServiceItem[]) => void;
  onUpdateProjects: (projects: ProjectItem[]) => void;
  onUpdateBlogs: (blogs: BlogPost[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  services,
  projects,
  blogs,
  onUpdateServices,
  onUpdateProjects,
  onUpdateBlogs
}) => {
  const [activeTab, setActiveTab] = useState<'crm' | 'services' | 'projects' | 'blogs' | 'seo' | 'analytics'>('crm');
  
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

  // New item modal forms
  const [showNewService, setShowNewService] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('$10,000');

  useEffect(() => {
    if (isOpen) {
      fetchLeads();
      fetchSeo(selectedSeoPage);
      fetchAnalytics();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchSeo(selectedSeoPage);
    }
  }, [selectedSeoPage]);

  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  const fetchSeo = async (pageKey: string = 'home') => {
    try {
      const res = await fetch(`/api/seo?pageKey=${pageKey}`);
      const data = await res.json();
      setSeoConfig(data);
    } catch (err) {
      console.error('Failed to fetch SEO:', err);
    }
  };

  const runSerpAudit = async () => {
    setLoadingAudit(true);
    try {
      const res = await fetch('/api/seo/audit');
      const data = await res.json();
      setSerpAuditResult(data);
    } catch (err) {
      console.error('Failed to run SERP audit:', err);
    } finally {
      setLoadingAudit(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics/summary');
      const data = await res.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  const handleUpdateLeadStatus = async (id: string, status: LeadStatus) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    } catch (err) {
      console.error('Failed to update lead:', err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      setLeads(leads.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const handleSaveSeo = async (updatedConfig?: PageMetadataConfig) => {
    const configToSave = updatedConfig || seoConfig;
    if (!configToSave) return;
    try {
      const res = await fetch(`/api/seo?pageKey=${selectedSeoPage}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configToSave)
      });
      const data = await res.json();
      if (data.metadata) {
        setSeoConfig(data.metadata);
      }
      setSeoSaved(true);
      setTimeout(() => setSeoSaved(false), 2500);
    } catch (err) {
      console.error('Failed to save SEO config:', err);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle) return;

    const newSrv: Partial<ServiceItem> = {
      title: newServiceTitle,
      shortDescription: newServiceDesc,
      fullDescription: newServiceDesc,
      category: 'web',
      iconName: 'Sparkles',
      features: ['Custom Enterprise Architecture', 'Automated Testing', '24/7 SLA Support'],
      deliverables: ['Production Web App', 'API Documentation', 'Hypercare Support'],
      techStack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      timeline: '4 - 8 Weeks',
      startingPrice: newServicePrice,
      slug: newServiceTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSrv)
      });
      const created = await res.json();
      onUpdateServices([...services, created]);
      setShowNewService(false);
      setNewServiceTitle('');
      setNewServiceDesc('');
    } catch (err) {
      console.error('Failed to create service:', err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this service offering?')) return;
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      onUpdateServices(services.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete service:', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Delete this project case study?')) return;
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      onUpdateProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  if (!isOpen) return null;

  const filteredLeads = leads.filter(l => leadFilter === 'ALL' || l.status === leadFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-6xl h-[94vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-left">
        
        {/* Top Navbar */}
        <div className="bg-[#001F54] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0052FF] flex items-center justify-center font-bold text-white shadow-md">
              R
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight font-display flex items-center gap-2">
                <span>Ryzite Operations & CMS Hub</span>
                <span className="text-[10px] bg-cyan-400 text-[#001F54] font-black px-2 py-0.5 rounded-full">
                  ADMIN PORTAL
                </span>
              </div>
              <div className="text-[11px] text-blue-200/70">
                Manage Inquiries, Content Engine, SEO Metadata & Core Web Vitals
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white bg-blue-900/60 hover:bg-blue-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'crm', label: 'Leads & Inquiries', icon: Users, badge: leads.length },
            { id: 'services', label: 'Services CMS', icon: LayoutDashboard, badge: services.length },
            { id: 'projects', label: 'Projects & Case Studies', icon: FolderKanban, badge: projects.length },
            { id: 'blogs', label: 'Blog & Articles', icon: FileText, badge: blogs.length },
            { id: 'seo', label: 'SEO & Structured Data', icon: Globe },
            { id: 'analytics', label: 'Core Web Vitals & Analytics', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive 
                    ? 'bg-white text-[#0052FF] shadow-sm border border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0052FF]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-blue-100 text-[#0052FF]' : 'bg-slate-200 text-slate-600'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Admin Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC]">
          
          {/* TAB 1: Leads & CRM */}
          {activeTab === 'crm' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Client Inquiries & Proposals</h3>
                  <p className="text-xs text-slate-500">Track inbound consultation requests and manage proposal pipeline.</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/api/leads/export/csv"
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0052FF]" />
                    <span>Export CSV</span>
                  </a>

                  <button
                    onClick={fetchLeads}
                    className="p-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-colors"
                    title="Refresh Inquiries"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingLeads ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap items-center gap-2">
                {['ALL', 'NEW', 'PROPOSAL_SENT', 'WON', 'LOST'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setLeadFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      leadFilter === st 
                        ? 'bg-[#0052FF] text-white shadow-sm' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Inquiries Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Contact</th>
                        <th className="py-3.5 px-4">Service</th>
                        <th className="py-3.5 px-4">Budget & Timeline</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{lead.name}</div>
                            <div className="text-slate-500">{lead.email}</div>
                            {lead.company && <div className="text-[10px] text-blue-600 font-semibold">{lead.company}</div>}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800">{lead.serviceSelected}</span>
                            {lead.message && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs mt-0.5">{lead.message}</p>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">{lead.budget}</div>
                            <div className="text-[10px] text-slate-400">{lead.timeline}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                lead.status === 'NEW' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                lead.status === 'PROPOSAL_SENT' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                lead.status === 'WON' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="IN_DISCUSSION">IN_DISCUSSION</option>
                              <option value="PROPOSAL_SENT">PROPOSAL_SENT</option>
                              <option value="WON">WON</option>
                              <option value="LOST">LOST</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Services CMS */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Services Offerings Manager</h3>
                  <p className="text-xs text-slate-500">Edit features, starting pricing, deliverables, and service copy.</p>
                </div>

                <button
                  onClick={() => setShowNewService(true)}
                  className="px-4 py-2 bg-[#0052FF] hover:bg-[#0040cc] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* New Service Modal Form */}
              {showNewService && (
                <form onSubmit={handleCreateService} className="p-5 bg-white rounded-2xl border border-blue-200 shadow-sm space-y-4">
                  <div className="font-bold text-sm text-slate-900">Create Service Offering</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Service Title (e.g. Next.js SaaS Architecture)"
                      value={newServiceTitle}
                      onChange={(e) => setNewServiceTitle(e.target.value)}
                      required
                      className="px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Starting Price (e.g. $8,000)"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Short Description..."
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                  />
                  <div className="flex items-center gap-2">
                    <button type="submit" className="px-4 py-2 bg-[#0052FF] text-white rounded-xl text-xs font-bold">
                      Save Service
                    </button>
                    <button type="button" onClick={() => setShowNewService(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div key={srv.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{srv.title}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#0052FF] bg-blue-50 px-2 py-0.5 rounded">{srv.startingPrice}</span>
                        <button
                          onClick={() => handleDeleteService(srv.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{srv.shortDescription}</p>
                    <div className="flex flex-wrap gap-1">
                      {srv.techStack.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Projects & Case Studies */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Featured Projects & Case Studies</h3>
                  <p className="text-xs text-slate-500">Manage showcased client work, metrics, and technology breakdowns.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{proj.title}</div>
                        <div className="text-xs text-slate-400">{proj.client} • {proj.category}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600">{proj.description}</p>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-xl text-center">
                      {proj.metrics.map((m, idx) => (
                        <div key={idx}>
                          <div className="text-[9px] text-slate-400 uppercase">{m.label}</div>
                          <div className="text-xs font-bold text-[#0052FF]">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Blog CMS */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">Blog & AEO Articles</h3>
                <p className="text-xs text-slate-500">Publish articles with direct-answer blocks for LLM scrapers.</p>
              </div>

              <div className="space-y-4">
                {blogs.map((b) => (
                  <div key={b.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{b.title}</span>
                      <span className="text-xs text-slate-400">{b.publishedAt}</span>
                    </div>
                    <p className="text-xs text-slate-600">{b.excerpt}</p>
                    <div className="p-3 bg-blue-50/60 rounded-xl text-xs text-slate-700">
                      <strong className="text-[#0052FF]">AEO Direct Answer:</strong> {b.aeoDirectAnswer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SEO, SERP & Structured Data */}
          {activeTab === 'seo' && seoConfig && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 font-display">SERP & Google Search Optimization</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#0052FF] border border-blue-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Live Engine
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Configure real-time Google search snippets, AI Overviews, rich stars rating, and JSON-LD schema.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-700">Select Page:</label>
                    <select
                      value={selectedSeoPage}
                      onChange={(e) => setSelectedSeoPage(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 shadow-sm"
                    >
                      <optgroup label="Main Pages">
                        <option value="home">Home Page</option>
                        <option value="services">Services Page</option>
                        <option value="solutions">Solutions Page</option>
                        <option value="portfolio">Portfolio Page</option>
                        <option value="about">About Us Page</option>
                        <option value="blog">Blog Page</option>
                      </optgroup>
                      {services.length > 0 && (
                        <optgroup label="Service Pages">
                          {services.map(s => <option key={s.id} value={`service-${s.slug}`}>{s.title}</option>)}
                        </optgroup>
                      )}
                      {projects.length > 0 && (
                        <optgroup label="Case Studies">
                          {projects.map(p => <option key={p.id} value={`portfolio-${p.slug}`}>{p.title}</option>)}
                        </optgroup>
                      )}
                      {blogs.length > 0 && (
                        <optgroup label="Blog Posts">
                          {blogs.map(b => <option key={b.id} value={`blog-${b.slug}`}>{b.title}</option>)}
                        </optgroup>
                      )}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id="open-serp-optimizer-modal-btn"
                      onClick={() => setShowSerpModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                    >
                      <Search className="w-4 h-4" />
                      <span>Launch SERP Simulator</span>
                    </button>
                    <button
                      onClick={() => handleSaveSeo()}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      {seoSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                      <span>{seoSaved ? 'Saved!' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SERP Live Preview Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-600" /> Live Google Search Result Appearance
                  </span>
                  <button
                    onClick={runSerpAudit}
                    disabled={loadingAudit}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingAudit ? 'animate-spin' : ''}`} />
                    <span>{loadingAudit ? 'Running Audit...' : 'Run SERP Health Audit'}</span>
                  </button>
                </div>

                {/* Simulated Google Card */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">R</div>
                    <span className="font-medium text-slate-800">Ryzite</span>
                    <span className="text-slate-400">› {seoConfig.canonicalUrl || 'https://ryzite.com'}</span>
                  </div>
                  <h4 className="text-[17px] font-normal text-[#1a0dab] hover:underline cursor-pointer">
                    {seoConfig.title}
                  </h4>
                  {seoConfig.serpSnippet?.enableRichSnippets && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="text-amber-500">★★★★★</span>
                      <span className="font-semibold text-slate-700">{seoConfig.serpSnippet.starRating || 4.9}</span>
                      <span>({seoConfig.serpSnippet.reviewCount || 142} reviews)</span>
                      <span>·</span>
                      <span className="font-mono text-emerald-600 font-semibold">{seoConfig.serpSnippet.priceRange || '$$$$'}</span>
                    </div>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {seoConfig.description}
                  </p>
                </div>

                {/* Audit Result Display */}
                {serpAuditResult && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-900 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>SERP Audit Score: <strong>{serpAuditResult.score}/100 ({serpAuditResult.grade})</strong></span>
                      <span className="text-emerald-700">· {serpAuditResult.passedChecks}/{serpAuditResult.totalChecks} checks passed</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-mono">Title: {serpAuditResult.titlePixelWidth}px</span>
                  </div>
                )}
              </div>

              {/* Metadata Form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-slate-900">Core Metadata Fields</h4>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Page Title Tag</label>
                    <span className={`text-xs ${seoConfig.title.length > 60 ? 'text-rose-500' : 'text-slate-400'}`}>
                      {seoConfig.title.length} / 60 characters
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seoConfig.title}
                    onChange={(e) => setSeoConfig({ ...seoConfig, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Meta Description</label>
                    <span className={`text-xs ${seoConfig.description.length > 160 ? 'text-rose-500' : 'text-slate-400'}`}>
                      {seoConfig.description.length} / 160 characters
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={seoConfig.description}
                    onChange={(e) => setSeoConfig({ ...seoConfig, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Canonical URL</label>
                    <input
                      type="text"
                      value={seoConfig.canonicalUrl}
                      onChange={(e) => setSeoConfig({ ...seoConfig, canonicalUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">OpenGraph Share Image URL</label>
                    <input
                      type="text"
                      value={seoConfig.ogImage || ''}
                      onChange={(e) => setSeoConfig({ ...seoConfig, ogImage: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Core Web Vitals & Analytics */}
          {activeTab === 'analytics' && analyticsData && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">System Health & Core Web Vitals</h3>
                <p className="text-xs text-slate-500">Live performance benchmarks, latency audits, and visitor metrics.</p>
              </div>

              {/* Core Web Vitals Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-xs text-slate-400 font-bold uppercase">Largest Contentful Paint (LCP)</div>
                  <div className="text-2xl font-black text-emerald-600 font-display">{analyticsData.coreWebVitals?.lcp}s</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">✓ Pass (&lt; 2.5s)</div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-xs text-slate-400 font-bold uppercase">Interaction to Next Paint (INP)</div>
                  <div className="text-2xl font-black text-emerald-600 font-display">{analyticsData.coreWebVitals?.inp}ms</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">✓ Pass (&lt; 200ms)</div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-xs text-slate-400 font-bold uppercase">Cumulative Layout Shift (CLS)</div>
                  <div className="text-2xl font-black text-emerald-600 font-display">{analyticsData.coreWebVitals?.cls}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">✓ Pass (&lt; 0.1)</div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-xs text-slate-400 font-bold uppercase">Time to First Byte (TTFB)</div>
                  <div className="text-2xl font-black text-emerald-600 font-display">{analyticsData.coreWebVitals?.ttfb}ms</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">✓ Edge Optimized</div>
                </div>
              </div>

              {/* Traffic Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-400 uppercase font-bold">Total Page Views</div>
                  <div className="text-3xl font-black text-[#0052FF] font-display mt-1">{analyticsData.totalPageViews}</div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-400 uppercase font-bold">Unique Visitors</div>
                  <div className="text-3xl font-black text-[#001F54] font-display mt-1">{analyticsData.uniqueVisitors}</div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-400 uppercase font-bold">Inquiry Conversion Rate</div>
                  <div className="text-3xl font-black text-emerald-600 font-display mt-1">{analyticsData.leadConversionRate}%</div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Embedded SERP Optimizer Modal */}
      {showSerpModal && seoConfig && (
        <SerpOptimizerModal
          isOpen={showSerpModal}
          onClose={() => setShowSerpModal(false)}
          metadata={seoConfig}
          onSave={async (updated) => {
            await handleSaveSeo(updated);
            setShowSerpModal(false);
          }}
        />
      )}
    </div>
  );
};
