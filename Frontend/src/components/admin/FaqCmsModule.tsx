import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Eye,
  EyeOff,
  Copy,
  History,
  FolderPlus,
  Globe,
  Layers,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  FileText,
  Clock,
  ShieldCheck,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Upload,
  Save,
  Tag
} from 'lucide-react';
import { api } from '../../lib/api';
import { FaqCmsItem, FaqCategoryItem, FaqAnalyticsSummary } from '../../types';

export const FaqCmsModule: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqCmsItem[]>([]);
  const [categories, setCategories] = useState<FaqCategoryItem[]>([]);
  const [summary, setSummary] = useState<FaqAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqCmsItem | null>(null);
  const [modalTab, setModalTab] = useState<'basic' | 'answer' | 'media' | 'relations' | 'seo' | 'history'>('basic');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Duplicate detection & quality score state
  const [duplicateMatches, setDuplicateMatches] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  // Category management modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FaqCategoryItem | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '', icon: 'HelpCircle' });

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Services & Projects lists for relations
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);

  // FAQ Form State
  const [form, setForm] = useState<{
    question: string;
    slug: string;
    shortAnswer: string;
    answerContent: string;
    categoryId: string;
    faqType: string;
    status: string;
    featured: boolean;
    isGlobal: boolean;
    indexable: boolean;
    imageUrl: string;
    imagePublicId: string;
    imageAlt: string;
    seoTitle: string;
    seoDescription: string;
    canonicalUrl: string;
    sourceType: string;
    sourceUrl: string;
    sourceNote: string;
    serviceIds: string[];
    projectIds: string[];
    relatedFaqIds: string[];
  }>({
    question: '',
    slug: '',
    shortAnswer: '',
    answerContent: '',
    categoryId: '',
    faqType: 'GENERAL',
    status: 'PUBLISHED',
    featured: false,
    isGlobal: true,
    indexable: true,
    imageUrl: '',
    imagePublicId: '',
    imageAlt: '',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    sourceType: 'Company Documentation',
    sourceUrl: '',
    sourceNote: '',
    serviceIds: [],
    projectIds: [],
    relatedFaqIds: []
  });

  useEffect(() => {
    fetchFaqData();
    fetchRelationalData();
  }, []);

  const fetchFaqData = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminFaqs();
      if (res) {
        setFaqs(res.items || []);
        setCategories(res.categories || []);
        setSummary(res.summary || null);
      }
    } catch (err: any) {
      console.error('Failed to fetch admin FAQ data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelationalData = async () => {
    try {
      const [srvs, projs] = await Promise.all([
        api.getServices(),
        api.getProjects()
      ]);
      setServicesList(srvs || []);
      setProjectsList(projs || []);
    } catch (e) {
      console.error('Error fetching relational services/projects:', e);
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingFaq(null);
    setDuplicateMatches([]);
    setVersions([]);
    setModalTab('basic');
    setForm({
      question: '',
      slug: '',
      shortAnswer: '',
      answerContent: '',
      categoryId: categories.length > 0 ? categories[0].id : '',
      faqType: 'GENERAL',
      status: 'PUBLISHED',
      featured: false,
      isGlobal: true,
      indexable: true,
      imageUrl: '',
      imagePublicId: '',
      imageAlt: '',
      seoTitle: '',
      seoDescription: '',
      canonicalUrl: '',
      sourceType: 'Company Documentation',
      sourceUrl: '',
      sourceNote: '',
      serviceIds: [],
      projectIds: [],
      relatedFaqIds: []
    });
    setError(null);
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = async (faq: FaqCmsItem) => {
    setEditingFaq(faq);
    setDuplicateMatches([]);
    setModalTab('basic');
    setForm({
      question: faq.question || '',
      slug: faq.slug || '',
      shortAnswer: faq.shortAnswer || '',
      answerContent: faq.answerContent || '',
      categoryId: faq.categoryId || (categories.length > 0 ? categories[0].id : ''),
      faqType: faq.faqType || 'GENERAL',
      status: faq.status || 'PUBLISHED',
      featured: faq.featured ?? false,
      isGlobal: faq.isGlobal ?? true,
      indexable: faq.indexable ?? true,
      imageUrl: faq.image?.url || '',
      imagePublicId: faq.image?.publicId || '',
      imageAlt: faq.image?.alt || '',
      seoTitle: faq.seo?.seoTitle || '',
      seoDescription: faq.seo?.seoDescription || '',
      canonicalUrl: faq.seo?.canonicalUrl || '',
      sourceType: faq.source?.type || 'Company Documentation',
      sourceUrl: faq.source?.url || '',
      sourceNote: faq.source?.note || '',
      serviceIds: faq.services ? faq.services.map((s: any) => s.id) : [],
      projectIds: faq.projects ? faq.projects.map((p: any) => p.id) : [],
      relatedFaqIds: faq.relatedFaqs ? faq.relatedFaqs.map((r: any) => r.id) : []
    });
    setError(null);
    setShowModal(true);

    // Fetch version history
    setLoadingVersions(true);
    try {
      const vList = await api.getFaqVersions(faq.id);
      setVersions(vList || []);
    } catch (e) {
      console.error('Failed to fetch versions:', e);
    } finally {
      setLoadingVersions(false);
    }
  };

  // Question change listener with duplicate check
  const handleQuestionChange = async (q: string) => {
    setForm(prev => ({
      ...prev,
      question: q,
      slug: prev.slug || q.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
      seoTitle: prev.seoTitle || `${q} | Ryzite FAQ`
    }));

    if (q.trim().length > 6) {
      try {
        const matches = await api.checkFaqDuplicates(q);
        setDuplicateMatches(matches.filter((m: any) => !editingFaq || m.id !== editingFaq.id));
      } catch (e) {
        console.error('Duplicate check error:', e);
      }
    } else {
      setDuplicateMatches([]);
    }
  };

  // Save FAQ
  const handleSaveFaq = async () => {
    if (!form.question.trim()) {
      setError('Question title is required.');
      return;
    }
    if (!form.shortAnswer.trim()) {
      setError('Direct Answer (short answer) is required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingFaq) {
        await api.updateFaq(editingFaq.id, form);
      } else {
        await api.createFaq(form);
      }
      setShowModal(false);
      fetchFaqData();
    } catch (err: any) {
      setError(err.message || 'Failed to save FAQ record.');
    } finally {
      setSaving(false);
    }
  };

  // Safe Transactional Delete FAQ
  const handleDeleteFaq = async (id: string) => {
    try {
      await api.deleteFaq(id);
      setDeleteConfirmId(null);
      fetchFaqData();
    } catch (err: any) {
      alert(`Delete Error: ${err.message}`);
    }
  };

  // Status Toggles
  const handleTogglePublish = async (faq: FaqCmsItem) => {
    try {
      if (faq.status === 'PUBLISHED') {
        await api.unpublishFaq(faq.id);
      } else {
        await api.publishFaq(faq.id);
      }
      fetchFaqData();
    } catch (err: any) {
      console.error('Error toggling publish status:', err);
    }
  };

  // Image Upload Handler targeting ryzite/faq
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await api.uploadFaqImage(file);
      if (res && res.url) {
        setForm(prev => ({
          ...prev,
          imageUrl: res.url,
          imagePublicId: res.public_id || '',
          imageAlt: prev.imageAlt || prev.question
        }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload FAQ image to Cloudinary.');
    }
  };

  // Filtered FAQs
  const filteredFaqs = faqs
    .filter(f => searchQuery === '' || f.question.toLowerCase().includes(searchQuery.toLowerCase()) || (f.shortAnswer || f.answer || '').toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(f => selectedCategory === 'ALL' || f.categoryId === selectedCategory || (f.category?.slug === selectedCategory))
    .filter(f => selectedStatus === 'ALL' || f.status === selectedStatus)
    .filter(f => selectedType === 'ALL' || f.faqType === selectedType);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER BAR */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-slate-900 font-display">Frequently Asked Questions (FAQ) CMS</h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              PostgreSQL & Cloudinary Core
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage factual question-answer pairs, direct answers, category structures, and relational links across Ryzite services & portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCatModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            <FolderPlus size={16} />
            <span>Manage Categories ({categories.length})</span>
          </button>

          <button
            onClick={fetchFaqData}
            disabled={loading}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
            title="Refresh FAQs"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus size={16} />
            <span>Create New FAQ</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS OVERVIEW */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total FAQs</div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 font-display">{summary.total}</span>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{summary.published} Live</span>
            </div>
            <p className="text-[11px] text-slate-400">Database count in PostgreSQL</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Review Reminders</div>
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-black font-display ${summary.needsReview > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {summary.needsReview}
              </span>
              <span className="text-xs font-semibold text-slate-500">Overdue</span>
            </div>
            <p className="text-[11px] text-slate-400">Over 180 days since review</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Helpful Vote Rate</div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-600 font-display">{summary.helpfulRatePercent}%</span>
              <ThumbsUp size={16} className="text-emerald-500" />
            </div>
            <p className="text-[11px] text-slate-400">User satisfaction metric</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Draft & Review</div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600 font-display">{summary.draft}</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Drafts</span>
            </div>
            <p className="text-[11px] text-slate-400">Unpublished draft content</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">No-Result Searches</div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-purple-600 font-display">{summary.noResultSearches.length}</span>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Ideas</span>
            </div>
            <p className="text-[11px] text-slate-400">Unanswered query logs</p>
          </div>
        </div>
      )}

      {/* FILTER BAR & SEARCH */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, keywords, answers..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All FAQ Types</option>
            <option value="GENERAL">General</option>
            <option value="SERVICE">Service</option>
            <option value="TECHNICAL">Technical</option>
            <option value="PRICING">Pricing</option>
            <option value="PROCESS">Process</option>
            <option value="SECURITY">Security</option>
            <option value="COMPANY">Company</option>
          </select>
        </div>
      </div>

      {/* MAIN FAQ DIRECTORY TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="font-bold text-sm text-slate-900 uppercase tracking-wider">
            FAQ Questions Directory ({filteredFaqs.length})
          </div>
          <span className="text-xs text-slate-400">
            Click row action buttons to edit, publish, or delete safely
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <RefreshCw size={24} className="animate-spin text-blue-600 mx-auto" />
            <span className="text-xs font-semibold">Loading FAQ directory from PostgreSQL...</span>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <HelpCircle size={36} className="mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No FAQs match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Question & Direct Answer</th>
                  <th className="py-3.5 px-4">Category & Type</th>
                  <th className="py-3.5 px-4 text-center">Score</th>
                  <th className="py-3.5 px-4 text-center">Helpful</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFaqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Question & Short Answer */}
                    <td className="py-4 px-4 max-w-md">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                          {faq.featured && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                              Featured
                            </span>
                          )}
                          <span>{faq.question}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {faq.shortAnswer}
                        </p>
                      </div>
                    </td>

                    {/* Category & Type */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                          {faq.category?.name || 'General'}
                        </span>
                        <div className="text-[10px] font-mono text-slate-400">
                          Type: {faq.faqType}
                        </div>
                      </div>
                    </td>

                    {/* Content Quality Score */}
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        faq.qualityScore >= 85 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : faq.qualityScore >= 60 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {faq.qualityScore} / 100
                      </span>
                    </td>

                    {/* Helpfulness */}
                    <td className="py-4 px-4 text-center">
                      <div className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                        <ThumbsUp size={12} />
                        <span>{faq.helpfulCount}</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-rose-500 font-semibold">{faq.notHelpfulCount}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(faq)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                          faq.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {faq.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(faq)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit FAQ"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(faq.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete FAQ"
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

      {/* MODAL: CREATE / EDIT FAQ */}
      {showModal && (
        <div className="fixed inset-0 z-[100000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base font-display">
                    {editingFaq ? 'Edit Enterprise FAQ' : 'Create New Enterprise FAQ'}
                  </h3>
                  <p className="text-xs text-slate-400">PostgreSQL + Cloudinary Media Asset Integration</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Near-Duplicate Warning Banner */}
            {duplicateMatches.length > 0 && (
              <div className="bg-amber-500 text-slate-950 px-6 py-2.5 text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>Possible Duplicate Found: "{duplicateMatches[0].question}"</span>
                </div>
                <span className="text-[10px] bg-amber-600 px-2 py-0.5 rounded font-mono">Check existing before publishing</span>
              </div>
            )}

            {/* Modal Tabs Bar */}
            <div className="px-6 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
              {[
                { id: 'basic', label: '1. Basic Info', icon: HelpCircle },
                { id: 'answer', label: '2. Answers & Content', icon: FileText },
                { id: 'media', label: '3. Media & Cloudinary', icon: Upload },
                { id: 'relations', label: '4. Relational Links', icon: Layers },
                { id: 'seo', label: '5. SEO & AEO Meta', icon: Globe },
                { id: 'history', label: '6. Version History', icon: History }
              ].map(tab => {
                const IconComp = tab.icon;
                const active = modalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalTab(tab.id as any)}
                    className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                      active
                        ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <IconComp size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* TAB 1: BASIC INFO */}
              {modalTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Question Text <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.question}
                      onChange={(e) => handleQuestionChange(e.target.value)}
                      placeholder="e.g. How much does custom software development cost?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug</label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        placeholder="how-much-does-custom-software-cost"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">FAQ Type</label>
                      <select
                        value={form.faqType}
                        onChange={(e) => setForm({ ...form, faqType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                      >
                        <option value="GENERAL">General</option>
                        <option value="SERVICE">Service</option>
                        <option value="TECHNICAL">Technical</option>
                        <option value="PRICING">Pricing</option>
                        <option value="PROCESS">Process</option>
                        <option value="SECURITY">Security</option>
                        <option value="COMPANY">Company</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Publishing Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                      >
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Featured on Homepage</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.indexable}
                        onChange={(e) => setForm({ ...form, indexable: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Google Search Indexable</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: ANSWER CONTENT */}
              {modalTab === 'answer' && (
                <div className="space-y-5">
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase">
                      <Sparkles size={16} className="text-blue-600" />
                      <span>Direct Answer (AEO / Answer Engine Snippet)</span>
                    </div>
                    <p className="text-[11px] text-blue-800">
                      Clear 1-2 sentence direct response displayed at top of FAQ accordion for search crawlers & Perplexity citations.
                    </p>
                    <textarea
                      rows={2}
                      value={form.shortAnswer}
                      onChange={(e) => setForm({ ...form, shortAnswer: e.target.value })}
                      placeholder="e.g. Custom software development projects range from $10,000 for web MVPs to $50,000+ for enterprise AI platforms."
                      className="w-full bg-white border border-blue-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Detailed Answer Content (Formatted HTML / Text)
                    </label>
                    <textarea
                      rows={8}
                      value={form.answerContent}
                      onChange={(e) => setForm({ ...form, answerContent: e.target.value })}
                      placeholder="Detailed explanation, paragraphs, bullet points (<p>, <ul>, <li>, <strong>)..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: MEDIA & CLOUDINARY */}
              {modalTab === 'media' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Optional FAQ Image (Cloudinary <code className="text-blue-600 font-mono">ryzite/faq</code> folder)
                      </label>
                      <label className="cursor-pointer text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                        <Upload size={14} />
                        <span>Upload File</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                        placeholder="https://res.cloudinary.com/..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900"
                      />
                    </div>

                    {form.imageUrl && (
                      <div className="aspect-video max-w-sm rounded-xl overflow-hidden border border-slate-300 bg-slate-900">
                        <img src={form.imageUrl} alt={form.imageAlt || 'FAQ preview'} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: RELATIONAL LINKS */}
              {modalTab === 'relations' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Related Services</label>
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      {servicesList.map(s => (
                        <label key={s.id} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.serviceIds.includes(s.id)}
                            onChange={(e) => {
                              if (e.target.checked) setForm({ ...form, serviceIds: [...form.serviceIds, s.id] });
                              else setForm({ ...form, serviceIds: form.serviceIds.filter(id => id !== s.id) });
                            }}
                          />
                          <span>{s.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Related Portfolio Case Studies</label>
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      {projectsList.map(p => (
                        <label key={p.id} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.projectIds.includes(p.id)}
                            onChange={(e) => {
                              if (e.target.checked) setForm({ ...form, projectIds: [...form.projectIds, p.id] });
                              else setForm({ ...form, projectIds: form.projectIds.filter(id => id !== p.id) });
                            }}
                          />
                          <span>{p.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SEO & AEO META */}
              {modalTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">SEO Title Tag</label>
                    <input
                      type="text"
                      value={form.seoTitle}
                      onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                      placeholder="e.g. How Much Does Custom Software Cost? | Ryzite"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Meta Description</label>
                    <textarea
                      rows={3}
                      value={form.seoDescription}
                      onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                      placeholder="Search engine meta snippet..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* TAB 6: VERSION HISTORY */}
              {modalTab === 'history' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700">Audit & Change Timeline</div>
                  {loadingVersions ? (
                    <div className="text-xs text-slate-500">Loading version snapshots...</div>
                  ) : versions.length === 0 ? (
                    <div className="text-xs text-slate-400">No previous versions recorded yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {versions.map(v => (
                        <div key={v.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-900">{v.question}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {new Date(v.createdAt).toLocaleString()} • {v.changeReason || 'Updated'}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!editingFaq) return;
                              await api.restoreFaqVersion(editingFaq.id, v.id);
                              alert('Version restored!');
                              setShowModal(false);
                              fetchFaqData();
                            }}
                            className="px-3 py-1 bg-blue-600 text-white font-bold text-[10px] rounded-lg hover:bg-blue-700"
                          >
                            Restore
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveFaq}
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{saving ? 'Saving FAQ...' : 'Save FAQ Item'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Safe Transactional Delete</h4>
              <p className="text-xs text-slate-500 mt-1">
                Cloudinary image asset will be destroyed FIRST. PostgreSQL record will only be removed if Cloudinary deletion succeeds.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteFaq(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FAQ CATEGORIES MANAGEMENT */}
      {showCatModal && (
        <div className="fixed inset-0 z-[100000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">FAQ Category CMS</h3>
              <button onClick={() => setShowCatModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Category Name (e.g. AI & Automation)"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!categoryForm.name.trim()) return;
                    await api.saveFaqCategory(categoryForm);
                    setCategoryForm({ name: '', slug: '', description: '', icon: 'HelpCircle' });
                    fetchFaqData();
                  }}
                  className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Category
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {categories.map(c => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">/faq?category={c.slug}</div>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await api.deleteFaqCategory(c.id);
                          fetchFaqData();
                        } catch (e: any) {
                          alert(e.message);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
