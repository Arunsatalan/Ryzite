import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MousePointerClick,
  Send,
  ShieldCheck,
  Plus,
  Edit3,
  Trash2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Monitor,
  Tablet,
  Smartphone,
  History,
  Activity,
  Layers,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  FinalCtaItem,
  FinalCtaOverrideItem,
  CtaAnalyticsSummary,
  CtaHealthScore,
  FinalCtaVersionItem,
  CtaActionType,
  CtaBackgroundType
} from '../../types';
import { FinalCTA } from '../cta/FinalCTA';
import { api } from '../../lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const FinalCtaCmsModule: React.FC = () => {
  // State
  const [ctas, setCtas] = useState<FinalCtaItem[]>([]);
  const [summary, setSummary] = useState<CtaAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Editor Modal & Form state
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingCta, setEditingCta] = useState<FinalCtaItem | null>(null);
  const [editorTab, setEditorTab] = useState<'content' | 'buttons' | 'design' | 'trust' | 'overrides'>('content');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [form, setForm] = useState<Partial<FinalCtaItem>>({
    name: '',
    eyebrow: "READY TO BUILD WHAT'S NEXT?",
    headline: "Let's Turn Your Next Big Idea Into Reality.",
    highlightedText: "Next Big Idea",
    description: "From AI-powered automation and custom software to cloud infrastructure and digital products, we help ambitious businesses design, build, and scale reliable technology.",
    supportingText: "Tell us what you're building. We'll help you figure out the right technical path.",
    primaryLabel: "Start a Project",
    primaryActionType: "CONTACT_FORM",
    primaryActionUrl: "/#contact",
    secondaryLabel: "Explore Our Work",
    secondaryActionType: "PORTFOLIO_PAGE",
    secondaryActionUrl: "/portfolio",
    tertiaryLabel: "Talk to an Expert",
    tertiaryActionType: "BOOK_CALL",
    tertiaryActionUrl: "/#contact",
    variant: "DEFAULT",
    theme: "DARK",
    backgroundType: "DARK",
    backgroundImageUrl: "",
    backgroundImagePublicId: "",
    backgroundImageAlt: "",
    overlayEnabled: true,
    overlayOpacity: 0.85,
    showTrustLine: true,
    showTertiaryAction: false,
    showContactInfo: false,
    contactEmail: "contact@ryzite.com",
    contactPhone: "+1-800-555-0199",
    showTrustedClients: true,
    showCaseStudies: false,
    isActive: true,
    isGlobal: true,
    priority: 0
  });

  // Cloudinary Upload State
  const [uploadingImage, setUploadingImage] = useState(false);

  // Health Check Modal State
  const [healthScore, setHealthScore] = useState<CtaHealthScore | null>(null);
  const [showHealthModal, setShowHealthModal] = useState(false);

  // Version History Modal State
  const [versions, setVersions] = useState<FinalCtaVersionItem[]>([]);
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  const [selectedVersionCtaId, setSelectedVersionCtaId] = useState<string | null>(null);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Data
  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('ryzite_admin_token') || 'demo-admin-token';
      const headers = { Authorization: `Bearer ${token}` };

      const [ctasRes, summaryRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/final-ctas`, { headers }),
        fetch(`${API_BASE}/api/admin/final-cta-summary`, { headers })
      ]);

      const ctasJson = await ctasRes.json();
      const summaryJson = await summaryRes.json();

      if (ctasJson.success) setCtas(ctasJson.data || []);
      if (summaryJson.success) setSummary(summaryJson.data || null);
    } catch (err: any) {
      console.error('[ADMIN CTA FETCH ERROR]', err);
      showToast('Failed to load CTA data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleOpenCreate = () => {
    setEditingCta(null);
    setForm({
      name: 'New Custom CTA Banner',
      eyebrow: "READY TO BUILD WHAT'S NEXT?",
      headline: "Let's Turn Your Next Big Idea Into Reality.",
      highlightedText: "Next Big Idea",
      description: "From AI-powered automation and custom software to cloud infrastructure, we help ambitious businesses design, build, and scale reliable technology.",
      supportingText: "Tell us what you're building. We'll help you figure out the right technical path.",
      primaryLabel: "Start a Project",
      primaryActionType: "CONTACT_FORM",
      primaryActionUrl: "/#contact",
      secondaryLabel: "Explore Our Work",
      secondaryActionType: "PORTFOLIO_PAGE",
      secondaryActionUrl: "/portfolio",
      tertiaryLabel: "Talk to an Expert",
      tertiaryActionType: "BOOK_CALL",
      tertiaryActionUrl: "/#contact",
      variant: "DEFAULT",
      theme: "DARK",
      backgroundType: "DARK",
      backgroundImageUrl: "",
      backgroundImagePublicId: "",
      backgroundImageAlt: "",
      overlayEnabled: true,
      overlayOpacity: 0.85,
      showTrustLine: true,
      showTertiaryAction: false,
      showContactInfo: false,
      contactEmail: "contact@ryzite.com",
      contactPhone: "+1-800-555-0199",
      showTrustedClients: true,
      showCaseStudies: false,
      isActive: true,
      status: "ACTIVE",
      isGlobal: true,
      pageTarget: "GLOBAL",
      priority: 1
    });
    setEditorTab('content');
    setShowEditorModal(true);
  };

  const handleOpenEdit = (cta: FinalCtaItem) => {
    setEditingCta(cta);
    const pageTarget = cta.isGlobal
      ? 'GLOBAL'
      : (cta.overrides && cta.overrides.length > 0 ? cta.overrides[0].pageType.toUpperCase() : 'HOME');

    setForm({
      ...cta,
      isActive: cta.isActive ?? true,
      status: cta.status || (cta.isActive ? 'ACTIVE' : 'INACTIVE'),
      isGlobal: cta.isGlobal ?? (pageTarget === 'GLOBAL'),
      pageTarget
    });
    setEditorTab('content');
    setShowEditorModal(true);
  };

  const handleSaveCta = async () => {
    if (!form.name || !form.headline || !form.primaryLabel) {
      showToast('Name, Headline, and Primary Button Label are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('ryzite_admin_token') || 'demo-admin-token';
      const isEdit = !!editingCta;
      const url = isEdit
        ? `${API_BASE}/api/admin/final-ctas/${editingCta.id}`
        : `${API_BASE}/api/admin/final-ctas`;

      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        ...form,
        isActive: Boolean(form.isActive),
        status: form.isActive ? 'ACTIVE' : 'INACTIVE',
        isGlobal: form.pageTarget === 'GLOBAL' || Boolean(form.isGlobal),
        pageTarget: form.pageTarget || (form.isGlobal ? 'GLOBAL' : 'HOME')
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        showToast(isEdit ? 'CTA Updated Successfully!' : 'CTA Created Successfully!');
        setShowEditorModal(false);
        loadData();
      } else {
        showToast(json.error || 'Failed to save CTA', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Cloudinary Image Upload & Replacement Handler
  const handleCloudinaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const fileData = reader.result as string;
        const uploadRes = await fetch(`${API_BASE}/api/upload/cloudinary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileData,
            folder: 'ryzite/final-cta',
            filename: `cta-${Date.now()}`
          })
        });

        const json = await uploadRes.json();
        if (json.success && json.data) {
          setForm(prev => ({
            ...prev,
            backgroundImageUrl: json.data.url,
            backgroundImagePublicId: json.data.public_id,
            backgroundType: 'IMAGE_GRADIENT'
          }));
          showToast('Image uploaded to Cloudinary successfully!');
        } else {
          showToast(json.error || 'Cloudinary upload failed', 'error');
        }
      } catch (err: any) {
        showToast(err.message, 'error');
      } finally {
        setUploadingImage(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleToggleActivate = async (cta: FinalCtaItem) => {
    try {
      const token = localStorage.getItem('ryzite_admin_token') || 'demo-admin-token';
      const endpoint = cta.isActive ? 'deactivate' : 'activate';

      const res = await fetch(`${API_BASE}/api/admin/final-ctas/${cta.id}/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const json = await res.json();
      if (json.success) {
        showToast(`CTA ${cta.isActive ? 'Deactivated' : 'Activated'}!`);
        loadData();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const token = localStorage.getItem('ryzite_admin_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE}/api/admin/final-ctas/${id}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        showToast('CTA Duplicated Successfully!');
        loadData();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this CTA?')) return;
    try {
      const token = localStorage.getItem('ryzite_admin_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE}/api/admin/final-ctas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        showToast('CTA Deleted!');
        loadData();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleOpenHealthModal = async (ctaId: string) => {
    try {
      const token = localStorage.getItem('ryzite_admin_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE}/api/admin/final-ctas/${ctaId}/health`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setHealthScore(json.data);
        setShowHealthModal(true);
      }
    } catch (err: any) {
      showToast('Health check failed', 'error');
    }
  };

  const handleOpenVersionsModal = async (ctaId: string) => {
    try {
      const token = localStorage.getItem('ryzite_admin_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE}/api/admin/final-ctas/${ctaId}/versions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setVersions(json.data || []);
        setSelectedVersionCtaId(ctaId);
        setShowVersionsModal(true);
      }
    } catch (err: any) {
      showToast('Failed to fetch versions', 'error');
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!selectedVersionCtaId) return;
    try {
      const token = localStorage.getItem('ryzite_admin_token') || 'demo-admin-token';
      const res = await fetch(`${API_BASE}/api/admin/final-ctas/${selectedVersionCtaId}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ versionId })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Version restored successfully!');
        setShowVersionsModal(false);
        loadData();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Filtered List
  const filteredCtas = ctas.filter(cta => {
    const matchesSearch =
      cta.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cta.headline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'ACTIVE'
        ? cta.isActive
        : !cta.isActive;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 p-6 text-slate-100 antialiased">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium border ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800/80'
              : 'bg-rose-950/90 text-rose-200 border-rose-800/80'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-400 uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Website → Conversion → Final CTA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Final CTA Conversion Engine
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage PostgreSQL-driven final conversion banners, A/B testing, CTR analytics, and page-specific intent matching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-white shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New CTA</span>
          </button>
        </div>
      </div>

      {/* Analytics Dashboard Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold tracking-wider uppercase mb-2">
            <span>Total Impressions</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {summary?.totalImpressions?.toLocaleString() || '0'}
          </div>
          <p className="text-xs text-slate-400 mt-1">Total CTA renders across pages</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold tracking-wider uppercase mb-2">
            <span>Total Clicks & CTR</span>
            <MousePointerClick className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {summary?.totalClicks?.toLocaleString() || '0'}
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {summary?.ctr || 0}% CTR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Primary: {summary?.primaryClicks || 0} | Secondary: {summary?.secondaryClicks || 0}
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold tracking-wider uppercase mb-2">
            <span>Contact Starts</span>
            <Send className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {summary?.contactStarts?.toLocaleString() || '0'}
          </div>
          <p className="text-xs text-slate-400 mt-1">Form / Consultation modals initiated</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold tracking-wider uppercase mb-2">
            <span>Leads Generated</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {summary?.leads?.toLocaleString() || '0'}
            </span>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              {summary?.conversionRate || 0}% Lead Conv
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Attributed in CRM</p>
        </div>
      </div>

      {/* No-Lead Warning Alert (Section 66) */}
      {summary && summary.totalImpressions >= 1000 && summary.leads === 0 && (
        <div className="bg-amber-950/60 border border-amber-800/80 rounded-2xl p-4 flex items-center gap-3 text-amber-200 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Conversion Review Required:</span> This CTA has accumulated 1,000+ impressions with 0 lead conversions. Review the conversion path and primary action destination.
          </div>
        </div>
      )}

      {/* CTA List Management Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white">CTA Conversion Engine Repository</h2>
            <span className="text-xs font-medium bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
              {filteredCtas.length} Items
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search CTAs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 w-48 sm:w-64"
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading CTA configurations...</div>
        ) : filteredCtas.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No CTA configurations found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/50">
                  <th className="p-4">CTA Name & Headline</th>
                  <th className="p-4">Page Target / Scope</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Impressions</th>
                  <th className="p-4 text-right">Clicks (CTR)</th>
                  <th className="p-4 text-right">Leads</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredCtas.map(cta => (
                  <tr key={cta.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{cta.name}</span>
                        {cta.isGlobal && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 font-bold uppercase">
                            Global
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                        "{cta.headline}"
                      </div>
                    </td>

                    <td className="p-4 text-slate-300 text-xs">
                      {cta.overrides && cta.overrides.length > 0 ? (
                        <div className="space-y-0.5">
                          {cta.overrides.map(ov => (
                            <span key={ov.id} className="inline-block bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono text-[11px] mr-1">
                              {ov.pageType}{ov.pageId ? `/${ov.pageId}` : ''}
                            </span>
                          ))}
                        </div>
                      ) : cta.isGlobal ? (
                        <span className="text-slate-400 italic">All Pages (Global Default)</span>
                      ) : (
                        <span className="text-slate-500">Unassigned</span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleActivate(cta)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                          cta.isActive
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80 hover:bg-emerald-900'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cta.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                        <span>{cta.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                      </button>
                    </td>

                    <td className="p-4 text-right font-mono text-slate-200">
                      {cta.impressions?.toLocaleString() || 0}
                    </td>

                    <td className="p-4 text-right">
                      <div className="font-mono text-slate-200">{cta.totalClicks?.toLocaleString() || 0}</div>
                      <div className="text-[11px] text-emerald-400 font-bold">{cta.ctr || 0}% CTR</div>
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-amber-400">
                      {cta.leads?.toLocaleString() || 0}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(cta)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit CTA Configuration"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenHealthModal(cta.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors"
                          title="Technical Health Check"
                        >
                          <Activity className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenVersionsModal(cta.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
                          title="Version History"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(cta.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Duplicate CTA"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cta.id)}
                          className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/80 text-rose-400 transition-colors"
                          title="Delete CTA"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CTA EDITOR MODAL WITH LIVE PREVIEW */}
      {showEditorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl overflow-hidden shadow-2xl my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingCta ? `Edit CTA: ${editingCta.name}` : 'Create New Final CTA Banner'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure headline, actions, visual theme, and live responsive preview.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Viewport Switcher for Live Preview */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      previewDevice === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      previewDevice === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Tablet className="w-4 h-4" />
                    <span className="hidden sm:inline">Tablet</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      previewDevice === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowEditorModal(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* LIVE PREVIEW SECTION (Section 10 & 46) */}
            <div className="bg-slate-950 border-b border-slate-800 p-4 overflow-x-auto flex justify-center">
              <div
                className={`transition-all duration-300 border border-slate-800 rounded-2xl bg-slate-900/80 shadow-2xl ${
                  previewDevice === 'desktop'
                    ? 'w-full max-w-5xl'
                    : previewDevice === 'tablet'
                    ? 'w-[768px]'
                    : 'w-[375px]'
                }`}
              >
                <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-blue-400">
                    Live Component Preview ({previewDevice})
                  </span>
                  <span>Production Next.js Banner Render</span>
                </div>
                <div className="p-2">
                  <FinalCTA overrideData={form as FinalCtaItem} isPreview={true} />
                </div>
              </div>
            </div>

            {/* EDITOR TAB NAVIGATION */}
            <div className="flex border-b border-slate-800 bg-slate-950 px-6">
              {[
                { key: 'content', label: '1. Content & Copy' },
                { key: 'buttons', label: '2. Conversion Buttons' },
                { key: 'design', label: '3. Theme & Cloudinary' },
                { key: 'trust', label: '4. Trust Signals' },
                { key: 'overrides', label: '5. Page Targets & Scope' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setEditorTab(tab.key as any)}
                  className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                    editorTab === tab.key
                      ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            <div className="p-6 max-h-[500px] overflow-y-auto space-y-6">
              {/* TAB 1: CONTENT */}
              {editorTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Internal CTA Name *
                    </label>
                    <input
                      type="text"
                      value={form.name || ''}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. AI Service Page Dedicated Final CTA"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Eyebrow Badge Text
                      </label>
                      <input
                        type="text"
                        value={form.eyebrow || ''}
                        onChange={e => setForm({ ...form, eyebrow: e.target.value })}
                        placeholder="READY TO BUILD WHAT'S NEXT?"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Highlighted Text Portion (Gradient Accent)
                      </label>
                      <input
                        type="text"
                        value={form.highlightedText || ''}
                        onChange={e => setForm({ ...form, highlightedText: e.target.value })}
                        placeholder="Next Big Idea"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Main Headline *
                    </label>
                    <input
                      type="text"
                      value={form.headline || ''}
                      onChange={e => setForm({ ...form, headline: e.target.value })}
                      placeholder="Let's Turn Your Next Big Idea Into Reality."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Supporting Value Proposition Description
                    </label>
                    <textarea
                      rows={3}
                      value={form.description || ''}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="From AI-powered automation to cloud infrastructure, we help ambitious businesses..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Reassurance / Trust Line Copy
                    </label>
                    <input
                      type="text"
                      value={form.supportingText || ''}
                      onChange={e => setForm({ ...form, supportingText: e.target.value })}
                      placeholder="Tell us what you're building. We'll help you figure out the right technical path."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: BUTTONS */}
              {editorTab === 'buttons' && (
                <div className="space-y-6">
                  {/* Primary Button */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      Primary Action Button (High Intent) *
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Button Label *</label>
                        <input
                          type="text"
                          value={form.primaryLabel || ''}
                          onChange={e => setForm({ ...form, primaryLabel: e.target.value })}
                          placeholder="Start a Project"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Action Type</label>
                        <select
                          value={form.primaryActionType || 'CONTACT_FORM'}
                          onChange={e => setForm({ ...form, primaryActionType: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                        >
                          <option value="CONTACT_FORM">Open Contact Form Modal</option>
                          <option value="BOOK_CALL">Book Discovery Call</option>
                          <option value="SERVICE_PAGE">Service Page Route</option>
                          <option value="PORTFOLIO_PAGE">Portfolio Page Route</option>
                          <option value="CUSTOM_ROUTE">Custom Internal Route</option>
                          <option value="EXTERNAL_URL">External URL</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Target URL / Hash</label>
                        <input
                          type="text"
                          value={form.primaryActionUrl || ''}
                          onChange={e => setForm({ ...form, primaryActionUrl: e.target.value })}
                          placeholder="/#contact"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Secondary Button */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Secondary Action Button (Medium Intent)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Button Label</label>
                        <input
                          type="text"
                          value={form.secondaryLabel || ''}
                          onChange={e => setForm({ ...form, secondaryLabel: e.target.value })}
                          placeholder="Explore Our Work"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Action Type</label>
                        <select
                          value={form.secondaryActionType || 'PORTFOLIO_PAGE'}
                          onChange={e => setForm({ ...form, secondaryActionType: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                        >
                          <option value="PORTFOLIO_PAGE">Portfolio / Case Studies</option>
                          <option value="SERVICE_PAGE">Service Page</option>
                          <option value="BLOG_PAGE">Blog Insights</option>
                          <option value="CUSTOM_ROUTE">Custom Route</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Target URL</label>
                        <input
                          type="text"
                          value={form.secondaryActionUrl || ''}
                          onChange={e => setForm({ ...form, secondaryActionUrl: e.target.value })}
                          placeholder="/portfolio"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tertiary Button */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Tertiary Action Button (Low Intent Option)
                      </h4>
                      <label className="flex items-center gap-2 text-xs text-slate-400">
                        <input
                          type="checkbox"
                          checked={form.showTertiaryAction || false}
                          onChange={e => setForm({ ...form, showTertiaryAction: e.target.checked })}
                          className="rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Enable Tertiary Button</span>
                      </label>
                    </div>

                    {form.showTertiaryAction && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Button Label</label>
                          <input
                            type="text"
                            value={form.tertiaryLabel || ''}
                            onChange={e => setForm({ ...form, tertiaryLabel: e.target.value })}
                            placeholder="Talk to an Expert"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Action Type</label>
                          <select
                            value={form.tertiaryActionType || 'BOOK_CALL'}
                            onChange={e => setForm({ ...form, tertiaryActionType: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                          >
                            <option value="BOOK_CALL">Book Technical Call</option>
                            <option value="EMAIL">Email Inquiry</option>
                            <option value="CUSTOM_ROUTE">Custom Route</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Target URL / Mailto</label>
                          <input
                            type="text"
                            value={form.tertiaryActionUrl || ''}
                            onChange={e => setForm({ ...form, tertiaryActionUrl: e.target.value })}
                            placeholder="mailto:contact@ryzite.com"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: DESIGN & CLOUDINARY */}
              {editorTab === 'design' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Visual Background Style
                      </label>
                      <select
                        value={form.backgroundType || 'DARK'}
                        onChange={e => setForm({ ...form, backgroundType: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="DARK">Premium Dark Gradient (Recommended)</option>
                        <option value="GRADIENT">Vibrant Radial Glow Gradient</option>
                        <option value="IMAGE_GRADIENT">Cloudinary Image + Dark Gradient Overlay</option>
                        <option value="IMAGE">Cloudinary High-Res Background Image</option>
                        <option value="SOLID">Solid Dark Slate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Dark Overlay Opacity (0.0 to 1.0)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        max="1"
                        value={form.overlayOpacity ?? 0.85}
                        onChange={e => setForm({ ...form, overlayOpacity: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Cloudinary Upload & Image Replacement Box (Section 13 & 14) */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>Cloudinary Image Integration (ryzite/final-cta/)</span>
                    </h4>

                    {form.backgroundImageUrl ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-800 h-40 bg-slate-900 group">
                        <img
                          src={form.backgroundImageUrl}
                          alt={form.backgroundImageAlt || 'CTA Background'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <label className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer hover:bg-blue-500">
                            <span>Replace Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleCloudinaryUpload}
                              disabled={uploadingImage}
                            />
                          </label>
                          <button
                            onClick={() => setForm({ ...form, backgroundImageUrl: '', backgroundImagePublicId: '' })}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/40">
                        <Upload className="w-8 h-8 text-slate-500 mb-2" />
                        <span className="text-sm font-semibold text-slate-300">
                          {uploadingImage ? 'Uploading to Cloudinary...' : 'Click to Upload High-Res CTA Image'}
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          PNG, JPG, WebP stored securely in Cloudinary
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCloudinaryUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Image Alt Text (Accessibility)
                      </label>
                      <input
                        type="text"
                        value={form.backgroundImageAlt || ''}
                        onChange={e => setForm({ ...form, backgroundImageAlt: e.target.value })}
                        placeholder="Abstract software engineering network background"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TRUST SIGNALS */}
              {editorTab === 'trust' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.showTrustLine ?? true}
                        onChange={e => setForm({ ...form, showTrustLine: e.target.checked })}
                        className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-blue-600"
                      />
                      <div>
                        <span className="text-sm font-semibold text-white">Show Supporting Trust Line</span>
                        <p className="text-xs text-slate-400">Displays reassurance copy under CTA buttons</p>
                      </div>
                    </label>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.showTrustedClients ?? false}
                        onChange={e => setForm({ ...form, showTrustedClients: e.target.checked })}
                        className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-blue-600"
                      />
                      <div>
                        <span className="text-sm font-semibold text-white">Integrate Trusted Clients CMS Logo Strip</span>
                        <p className="text-xs text-slate-400">Fetches verified active client logos without duplication</p>
                      </div>
                    </label>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.showContactInfo ?? false}
                        onChange={e => setForm({ ...form, showContactInfo: e.target.checked })}
                        className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-blue-600"
                      />
                      <div>
                        <span className="text-sm font-semibold text-white">Display Direct Email & Phone Strip</span>
                        <p className="text-xs text-slate-400">Shows contact email and telephone line directly in banner</p>
                      </div>
                    </label>

                    {form.showContactInfo && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Contact Email</label>
                          <input
                            type="text"
                            value={form.contactEmail || ''}
                            onChange={e => setForm({ ...form, contactEmail: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Contact Phone</label>
                          <input
                            type="text"
                            value={form.contactPhone || ''}
                            onChange={e => setForm({ ...form, contactPhone: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: OVERRIDES & SCOPE */}
              {editorTab === 'overrides' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Page Target / Scope Target
                      </label>
                      <select
                        value={form.pageTarget || (form.isGlobal ? 'GLOBAL' : 'HOME')}
                        onChange={e => {
                          const val = e.target.value;
                          setForm({
                            ...form,
                            pageTarget: val,
                            isGlobal: val === 'GLOBAL'
                          });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="GLOBAL">Global Default (All Pages)</option>
                        <option value="HOME">Home Page (/)</option>
                        <option value="SERVICE">Service Pages (/services)</option>
                        <option value="PORTFOLIO">Portfolio Page (/portfolio)</option>
                        <option value="BLOG">Blog Pages (/blog)</option>
                        <option value="ABOUT">About Page (/about)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Status Toggle
                      </label>
                      <select
                        value={form.isActive ? 'ACTIVE' : 'INACTIVE'}
                        onChange={e => {
                          const isAct = e.target.value === 'ACTIVE';
                          setForm({
                            ...form,
                            isActive: isAct,
                            status: isAct ? 'ACTIVE' : 'INACTIVE'
                          });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="ACTIVE">Active (Published)</option>
                        <option value="INACTIVE">Inactive (Disabled)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Priority Weight (Higher numbers win)
                      </label>
                      <input
                        type="number"
                        value={form.priority ?? 0}
                        onChange={e => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isGlobal ?? false}
                          onChange={e => setForm({ ...form, isGlobal: e.target.checked, pageTarget: e.target.checked ? 'GLOBAL' : (form.pageTarget === 'GLOBAL' ? 'HOME' : form.pageTarget) })}
                          className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-blue-600"
                        />
                        <div>
                          <span className="text-sm font-semibold text-white">Is Global Banner</span>
                          <p className="text-xs text-slate-400">Renders on all unassigned pages</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-950">
              <button
                onClick={() => setShowEditorModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCta}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all"
              >
                {saving ? 'Saving...' : editingCta ? 'Save Changes' : 'Create CTA Banner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TECHNICAL HEALTH MODAL */}
      {showHealthModal && healthScore && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Internal CTA Technical Health Check</h3>
              </div>
              <button onClick={() => setShowHealthModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-sm text-slate-300 font-medium">Internal Technical Health Score</span>
              <span
                className={`text-2xl font-black px-3 py-1 rounded-xl border ${
                  healthScore.score >= 90
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {healthScore.score} / 100
              </span>
            </div>

            <div className="space-y-2">
              {healthScore.checks.map((check, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  {check.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-200">{check.name}</div>
                    {check.details && <div className="text-slate-400 mt-0.5">{check.details}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VERSION HISTORY MODAL */}
      {showVersionsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">CTA Version History & Restore</h3>
              </div>
              <button onClick={() => setShowVersionsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {versions.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No historical versions recorded yet.</p>
              ) : (
                versions.map(v => (
                  <div key={v.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-slate-400 font-mono">
                        {new Date(v.createdAt).toLocaleString()} by <span className="text-slate-200 font-semibold">{v.changedBy}</span>
                      </div>
                      <div className="text-sm font-semibold text-white mt-1">
                        "{v.snapshot?.headline || 'Version Snapshot'}"
                      </div>
                      {v.changeReason && (
                        <div className="text-xs text-slate-400 italic mt-0.5">
                          Reason: {v.changeReason}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleRestoreVersion(v.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                    >
                      Restore Version
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
