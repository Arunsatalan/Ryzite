import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  Eye,
  Globe,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  ExternalLink,
  History,
  Layers,
  Tag,
  Users,
  Building2,
  Award,
  ShieldCheck,
  Check,
  X,
  Code,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AboutPageConfig, ServiceItem, StatisticStatus } from '../../types';
import { api } from '../../lib/api';

export const AboutCmsModule: React.FC = () => {
  const [data, setData] = useState<AboutPageConfig | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active section accordions
  const [openSection, setOpenSection] = useState<string>('hero');
  const [versionModalOpen, setVersionModalOpen] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<any[]>([]);

  // Load Admin About Data & Services list
  const loadData = async () => {
    setLoading(true);
    try {
      const [aboutData, servicesData] = await Promise.all([
        api.getAdminAboutPage().catch(() => null),
        api.getServices().catch(() => [])
      ]);
      if (aboutData) setData(aboutData);
      setServices(servicesData);
    } catch (err: any) {
      console.error('Error loading About CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Draft
  const handleSaveDraft = async () => {
    if (!data) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.updateAboutDraft(data);
      setData(res.data);
      setMessage({ type: 'success', text: 'About page draft saved to PostgreSQL!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to save draft: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  // Publish
  const handlePublish = async () => {
    if (!data) return;
    if (!confirm('Are you sure you want to publish this About page live to production?')) return;
    setSaving(true);
    try {
      const res = await api.publishAboutPage('Admin User', 'Published from Admin Dashboard');
      setData(res.data);
      setMessage({ type: 'success', text: 'About page is now PUBLISHED live on /about!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Publish failed: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  // Unpublish
  const handleUnpublish = async () => {
    if (!confirm('Unpublish About page (switch status to DRAFT)?')) return;
    try {
      const res = await api.unpublishAboutPage();
      setData(res.data);
      setMessage({ type: 'success', text: 'About page status set to DRAFT.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert('Unpublish failed: ' + err.message);
    }
  };

  // Load History
  const handleOpenHistory = async () => {
    try {
      const history = await api.getAboutHistory();
      setHistoryList(history);
      setVersionModalOpen(true);
    } catch (err: any) {
      alert('Failed to load version history: ' + err.message);
    }
  };

  // Restore Version
  const handleRestoreVersion = async (versionId: string) => {
    if (!confirm('Restore this snapshot into your current draft?')) return;
    try {
      const res = await api.restoreAboutVersion(versionId);
      setData(res.data);
      setVersionModalOpen(false);
      setMessage({ type: 'success', text: 'Historical snapshot restored to draft!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert('Restore failed: ' + err.message);
    }
  };

  // Cloudinary Image Upload Helper
  const handleImageUpload = async (file: File, fieldUrlKey: string, fieldPublicIdKey: string) => {
    try {
      const res = await api.uploadCloudinaryImage(file, 'ryzite/about');
      if (data && res.url) {
        setData({
          ...data,
          [fieldUrlKey]: res.url,
          [fieldPublicIdKey]: res.public_id
        });
      }
    } catch (err: any) {
      alert('Cloudinary upload failed: ' + err.message);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 text-xs">
        <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-blue-600" />
        <span>Loading About CMS Module...</span>
      </div>
    );
  }

  const toggleAccordion = (name: string) => {
    setOpenSection(openSection === name ? '' : name);
  };

  return (
    <div className="space-y-6">
      {/* NOTIFICATION MESSAGES */}
      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border shadow-xs ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-rose-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* CMS HEADER BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">About Page CMS</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
                data.status === 'PUBLISHED'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {data.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Manage /about content, team members, mission, vision, capabilities, and SEO/AEO metadata stored in PostgreSQL.
            </p>
          </div>

          {/* CONTROL ACTIONS */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenHistory}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <History size={15} />
              <span>Version History</span>
            </button>

            <a
              href="/about?preview=true"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-blue-50 text-[#0052FF] hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Eye size={15} />
              <span>Live Preview</span>
            </a>

            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Draft'}</span>
            </button>

            {data.status === 'PUBLISHED' ? (
              <button
                onClick={handleUnpublish}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Unpublish
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Globe size={15} />
                <span>Publish Live</span>
              </button>
            )}
          </div>
        </div>

        {/* METRICS METADATA BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
            <span className="text-slate-400 text-[11px] block font-semibold">Last Updated</span>
            <span className="font-bold text-slate-800">{data.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'N/A'}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
            <span className="text-slate-400 text-[11px] block font-semibold">Published By</span>
            <span className="font-bold text-slate-800">{data.publishedBy || 'Admin User'}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
            <span className="text-slate-400 text-[11px] block font-semibold">Published At</span>
            <span className="font-bold text-slate-800">{data.publishedAt ? new Date(data.publishedAt).toLocaleDateString() : 'Draft Only'}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
            <span className="text-slate-400 text-[11px] block font-semibold">Production URL</span>
            <a href="/about" target="_blank" className="font-bold text-blue-600 hover:underline flex items-center gap-0.5">
              /about <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>

      {/* ACCORDION SECTIONS */}

      {/* SECTION 1: ABOUT HERO */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => toggleAccordion('hero')}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#0052FF] rounded-xl font-bold text-xs">01</div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">About Hero Section</h3>
              <p className="text-xs text-slate-500">Eyebrow label, main title, short intro description, and hero media.</p>
            </div>
          </div>
          {openSection === 'hero' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {openSection === 'hero' && (
          <div className="p-6 border-t border-slate-100 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Eyebrow Badge Label *</label>
                <input
                  type="text"
                  value={data.heroLabel}
                  onChange={e => setData({ ...data, heroLabel: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Main Heading Title *</label>
                <input
                  type="text"
                  value={data.heroTitle}
                  onChange={e => setData({ ...data, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Short Hero Description *</label>
              <textarea
                rows={3}
                value={data.heroDescription}
                onChange={e => setData({ ...data, heroDescription: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">CTA Button Text</label>
                <input
                  type="text"
                  value={data.heroCtaText || ''}
                  onChange={e => setData({ ...data, heroCtaText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">CTA Button Target URL</label>
                <input
                  type="text"
                  value={data.heroCtaUrl || ''}
                  onChange={e => setData({ ...data, heroCtaUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* HERO IMAGE CLOUDINARY UPLOAD */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <label className="font-bold text-slate-700 block">Hero Image (Cloudinary Storage)</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {data.heroImageUrl && (
                  <img src={data.heroImageUrl} alt="Hero Preview" className="w-32 h-20 object-cover rounded-lg border" />
                )}
                <div className="space-y-2 flex-1 w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files?.[0]) handleImageUpload(e.target.files[0], 'heroImageUrl', 'heroImagePublicId');
                    }}
                    className="text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Image Alt Text (e.g. Ryzite Engineering Studio)"
                    value={data.heroImageAlt || ''}
                    onChange={e => setData({ ...data, heroImageAlt: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: COMPANY INTRODUCTION */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => toggleAccordion('intro')}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#0052FF] rounded-xl font-bold text-xs">02</div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Company Introduction</h3>
              <p className="text-xs text-slate-500">Section heading, short introduction, and full detailed agency text.</p>
            </div>
          </div>
          {openSection === 'intro' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {openSection === 'intro' && (
          <div className="p-6 border-t border-slate-100 space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Intro Section Title</label>
              <input
                type="text"
                value={data.introTitle}
                onChange={e => setData({ ...data, introTitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Short Summary Intro</label>
              <textarea
                rows={2}
                value={data.introShort}
                onChange={e => setData({ ...data, introShort: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Detailed Overview</label>
              <textarea
                rows={4}
                value={data.introFull}
                onChange={e => setData({ ...data, introFull: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: WHO WE ARE & HIGHLIGHT CARDS */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => toggleAccordion('whoweare')}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#0052FF] rounded-xl font-bold text-xs">03</div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Who We Are & Pillar Highlight Cards</h3>
              <p className="text-xs text-slate-500">Core engineering pillar cards (sub-100ms, CI/CD, security, direct access).</p>
            </div>
          </div>
          {openSection === 'whoweare' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {openSection === 'whoweare' && (
          <div className="p-6 border-t border-slate-100 space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Heading Title</label>
                <input
                  type="text"
                  value={data.whoWeAreTitle}
                  onChange={e => setData({ ...data, whoWeAreTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <input
                  type="text"
                  value={data.whoWeAreDescription}
                  onChange={e => setData({ ...data, whoWeAreDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* HIGHLIGHT CARDS LIST */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold text-slate-800 text-xs">Pillar Highlight Cards ({data.highlights?.length || 0})</span>
                <button
                  type="button"
                  onClick={() => {
                    const list = [...(data.highlights || [])];
                    list.push({ title: 'New Pillar', description: 'Description...', icon: 'Sparkles', displayOrder: list.length, active: true });
                    setData({ ...data, highlights: list });
                  }}
                  className="px-3 py-1 bg-blue-50 text-[#0052FF] font-bold rounded-lg hover:bg-blue-100 flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>Add Pillar</span>
                </button>
              </div>

              {data.highlights?.map((hl, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">Pillar #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const list = data.highlights?.filter((_, i) => i !== idx);
                        setData({ ...data, highlights: list });
                      }}
                      className="text-rose-600 hover:bg-rose-50 p-1 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={hl.title}
                      onChange={e => {
                        const list = [...(data.highlights || [])];
                        list[idx].title = e.target.value;
                        setData({ ...data, highlights: list });
                      }}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Icon Name (e.g. Cpu, GitBranch, Lock, Users)"
                      value={hl.icon}
                      onChange={e => {
                        const list = [...(data.highlights || [])];
                        list[idx].icon = e.target.value;
                        setData({ ...data, highlights: list });
                      }}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Description"
                    value={hl.description}
                    onChange={e => {
                      const list = [...(data.highlights || [])];
                      list[idx].description = e.target.value;
                      setData({ ...data, highlights: list });
                    }}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: WHAT WE DO & CAPABILITIES (WITH SERVICES DROPDOWN) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => toggleAccordion('capabilities')}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#0052FF] rounded-xl font-bold text-xs">04</div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">What We Do & Capabilities (Services Linkage)</h3>
              <p className="text-xs text-slate-500">Add capabilities and optionally link to existing Services CMS entries.</p>
            </div>
          </div>
          {openSection === 'capabilities' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {openSection === 'capabilities' && (
          <div className="p-6 border-t border-slate-100 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-bold text-slate-800">Capabilities List ({data.capabilities?.length || 0})</span>
              <button
                type="button"
                onClick={() => {
                  const list = [...(data.capabilities || [])];
                  list.push({ title: 'New Capability', description: 'Description...', icon: 'Cpu', serviceId: null, displayOrder: list.length, active: true });
                  setData({ ...data, capabilities: list });
                }}
                className="px-3 py-1 bg-blue-50 text-[#0052FF] font-bold rounded-lg hover:bg-blue-100 flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Add Capability</span>
              </button>
            </div>

            {data.capabilities?.map((cap, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">Capability #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const list = data.capabilities?.filter((_, i) => i !== idx);
                      setData({ ...data, capabilities: list });
                    }}
                    className="text-rose-600 hover:bg-rose-50 p-1 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={cap.title}
                    onChange={e => {
                      const list = [...(data.capabilities || [])];
                      list[idx].title = e.target.value;
                      setData({ ...data, capabilities: list });
                    }}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                  <select
                    value={cap.serviceId || ''}
                    onChange={e => {
                      const list = [...(data.capabilities || [])];
                      list[idx].serviceId = e.target.value || null;
                      setData({ ...data, capabilities: list });
                    }}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="">Link Existing Services CMS Entity (Optional)</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  rows={2}
                  placeholder="Description"
                  value={cap.description}
                  onChange={e => {
                    const list = [...(data.capabilities || [])];
                    list[idx].description = e.target.value;
                    setData({ ...data, capabilities: list });
                  }}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 5: MISSION & VISION */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => toggleAccordion('mission')}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#0052FF] rounded-xl font-bold text-xs">05</div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Mission & Vision</h3>
              <p className="text-xs text-slate-500">Company Mission and Vision statements with image media.</p>
            </div>
          </div>
          {openSection === 'mission' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {openSection === 'mission' && (
          <div className="p-6 border-t border-slate-100 space-y-6 text-xs">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-xs">Mission</h4>
              <input
                type="text"
                value={data.missionTitle}
                onChange={e => setData({ ...data, missionTitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <textarea
                rows={3}
                value={data.missionDescription}
                onChange={e => setData({ ...data, missionDescription: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-800 text-xs">Vision</h4>
              <input
                type="text"
                value={data.visionTitle}
                onChange={e => setData({ ...data, visionTitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <textarea
                rows={3}
                value={data.visionDescription}
                onChange={e => setData({ ...data, visionDescription: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 6: CORE VALUES */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => toggleAccordion('values')}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#0052FF] rounded-xl font-bold text-xs">06</div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Core Values ({data.values?.length || 0})</h3>
              <p className="text-xs text-slate-500">Engineering values (quality, transparency, business impact, innovation).</p>
            </div>
          </div>
          {openSection === 'values' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {openSection === 'values' && (
          <div className="p-6 border-t border-slate-100 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-bold text-slate-800">Values List</span>
              <button
                type="button"
                onClick={() => {
                  const list = [...(data.values || [])];
                  list.push({ title: 'New Value', description: 'Description...', icon: 'ShieldCheck', displayOrder: list.length, active: true });
                  setData({ ...data, values: list });
                }}
                className="px-3 py-1 bg-blue-50 text-[#0052FF] font-bold rounded-lg hover:bg-blue-100 flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Add Value</span>
              </button>
            </div>

            {data.values?.map((val, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">Value #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const list = data.values?.filter((_, i) => i !== idx);
                      setData({ ...data, values: list });
                    }}
                    className="text-rose-600 hover:bg-rose-50 p-1 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Title"
                  value={val.title}
                  onChange={e => {
                    const list = [...(data.values || [])];
                    list[idx].title = e.target.value;
                    setData({ ...data, values: list });
                  }}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                />
                <textarea
                  rows={2}
                  placeholder="Description"
                  value={val.description}
                  onChange={e => {
                    const list = [...(data.values || [])];
                    list[idx].description = e.target.value;
                    setData({ ...data, values: list });
                  }}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 7: TEAM MEMBERS */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => toggleAccordion('team')}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#0052FF] rounded-xl font-bold text-xs">07</div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Technical Leadership Team ({data.teamMembers?.length || 0})</h3>
              <p className="text-xs text-slate-500">Public profile details for senior software architects.</p>
            </div>
          </div>
          {openSection === 'team' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {openSection === 'team' && (
          <div className="p-6 border-t border-slate-100 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-bold text-slate-800">Team Profiles</span>
              <button
                type="button"
                onClick={() => {
                  const list = [...(data.teamMembers || [])];
                  list.push({ name: 'New Member', role: 'Solutions Architect', shortBio: 'Bio...', photoUrl: '', linkedInUrl: '', displayOrder: list.length, active: true });
                  setData({ ...data, teamMembers: list });
                }}
                className="px-3 py-1 bg-blue-50 text-[#0052FF] font-bold rounded-lg hover:bg-blue-100 flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Add Member</span>
              </button>
            </div>

            {data.teamMembers?.map((m, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">Member #{idx + 1}: {m.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const list = data.teamMembers?.filter((_, i) => i !== idx);
                      setData({ ...data, teamMembers: list });
                    }}
                    className="text-rose-600 hover:bg-rose-50 p-1 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={m.name}
                    onChange={e => {
                      const list = [...(data.teamMembers || [])];
                      list[idx].name = e.target.value;
                      setData({ ...data, teamMembers: list });
                    }}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Role Title"
                    value={m.role}
                    onChange={e => {
                      const list = [...(data.teamMembers || [])];
                      list[idx].role = e.target.value;
                      setData({ ...data, teamMembers: list });
                    }}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <input
                  type="text"
                  placeholder="LinkedIn URL (e.g. https://linkedin.com/in/...)"
                  value={m.linkedInUrl || ''}
                  onChange={e => {
                    const list = [...(data.teamMembers || [])];
                    list[idx].linkedInUrl = e.target.value;
                    setData({ ...data, teamMembers: list });
                  }}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                />

                <textarea
                  rows={2}
                  placeholder="Short Bio"
                  value={m.shortBio}
                  onChange={e => {
                    const list = [...(data.teamMembers || [])];
                    list[idx].shortBio = e.target.value;
                    setData({ ...data, teamMembers: list });
                  }}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 8: SECTION DISPLAY TOGGLES (REUSING EXISTING CMS TABLES) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => toggleAccordion('toggles')}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#0052FF] rounded-xl font-bold text-xs">08</div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Single Source of Truth Section Toggles</h3>
              <p className="text-xs text-slate-500">Enable/disable display of existing CMS tables (Statistics, Trusted Clients, Why Choose Us, FAQs).</p>
            </div>
          </div>
          {openSection === 'toggles' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {openSection === 'toggles' && (
          <div className="p-6 border-t border-slate-100 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <label className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Company Statistics CMS</span>
                  <span className="text-[11px] text-slate-500">Reuse published Company Statistics</span>
                </div>
                <input
                  type="checkbox"
                  checked={data.showStatistics}
                  onChange={e => setData({ ...data, showStatistics: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Trusted Clients CMS</span>
                  <span className="text-[11px] text-slate-500">Reuse enabled Trusted Clients</span>
                </div>
                <input
                  type="checkbox"
                  checked={data.showTrustedClients}
                  onChange={e => setData({ ...data, showTrustedClients: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Global Why Choose Us</span>
                  <span className="text-[11px] text-slate-500">Reuse Why Choose Us cards</span>
                </div>
                <input
                  type="checkbox"
                  checked={data.useGlobalWhyChooseUs}
                  onChange={e => setData({ ...data, useGlobalWhyChooseUs: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">AEO Search FAQs</span>
                  <span className="text-[11px] text-slate-500">Reuse published Company FAQs</span>
                </div>
                <input
                  type="checkbox"
                  checked={data.showFaqs}
                  onChange={e => setData({ ...data, showFaqs: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Leadership Team Section</span>
                  <span className="text-[11px] text-slate-500">Show Team members grid</span>
                </div>
                <input
                  type="checkbox"
                  checked={data.showTeam}
                  onChange={e => setData({ ...data, showTeam: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 9: SEO & AEO METADATA */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => toggleAccordion('seo')}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#0052FF] rounded-xl font-bold text-xs">09</div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">SEO & Direct AEO Metadata</h3>
              <p className="text-xs text-slate-500">Canonical URL, Title tag, Meta description, and Answer Engine Prompts.</p>
            </div>
          </div>
          {openSection === 'seo' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {openSection === 'seo' && (
          <div className="p-6 border-t border-slate-100 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Page SEO Title Tag *</label>
                <input
                  type="text"
                  value={data.metaTitle}
                  onChange={e => setData({ ...data, metaTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Canonical URL *</label>
                <input
                  type="text"
                  value={data.canonicalUrl}
                  onChange={e => setData({ ...data, canonicalUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Meta Description *</label>
              <textarea
                rows={3}
                value={data.metaDescription}
                onChange={e => setData({ ...data, metaDescription: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1 pt-2 border-t">
              <label className="font-bold text-slate-800 block">Direct Answer Prompt: "Who is Ryzite?"</label>
              <textarea
                rows={2}
                value={data.whoIsDirectAnswer || ''}
                onChange={e => setData({ ...data, whoIsDirectAnswer: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* VERSION HISTORY MODAL */}
      {versionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History size={18} className="text-[#0052FF]" />
                <span>About Page Version Snapshot History</span>
              </h3>
              <button onClick={() => setVersionModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto text-xs">
              {historyList.length === 0 ? (
                <div className="p-4 text-center text-slate-500">No version snapshots recorded yet.</div>
              ) : (
                historyList.map(ver => (
                  <div key={ver.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{ver.reason || 'Snapshot'}</div>
                      <div className="text-[11px] text-slate-500">
                        By <strong>{ver.changedBy}</strong> on {new Date(ver.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestoreVersion(ver.id)}
                      className="px-3 py-1.5 bg-blue-50 text-[#0052FF] hover:bg-blue-100 font-bold rounded-lg transition-colors text-xs"
                    >
                      Restore Draft
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
