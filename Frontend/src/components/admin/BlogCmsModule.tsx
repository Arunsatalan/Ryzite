import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Eye,
  Copy,
  History,
  FolderPlus,
  Tag,
  User,
  ExternalLink,
  Upload,
  Save,
  Clock,
  ShieldCheck,
  TrendingUp,
  Layers,
  ChevronRight,
  BarChart2,
  BookOpen
} from 'lucide-react';
import { api } from '../../lib/api';
import { BlogPostItem, BlogCategoryItem, BlogAuthorItem, BlogTagItem, BlogAnalyticsSummary } from '../../types';

export const BlogCmsModule: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [authors, setAuthors] = useState<BlogAuthorItem[]>([]);
  const [tags, setTags] = useState<BlogTagItem[]>([]);
  const [summary, setSummary] = useState<BlogAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [activeTab, setActiveTab] = useState<'posts' | 'categories' | 'authors' | 'tags' | 'analytics'>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPostType, setSelectedPostType] = useState<string>('ALL');

  // Post Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [modalTab, setModalTab] = useState<'basic' | 'content' | 'taxonomy' | 'seo' | 'history'>('basic');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Versions state
  const [versions, setVersions] = useState<any[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  // Category management modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm, setCatForm] = useState({ id: '', name: '', slug: '', description: '', displayOrder: 0, active: true });

  // Tag management modal
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagForm, setTagForm] = useState({ id: '', name: '', slug: '' });

  // Author management modal
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [authorForm, setAuthorForm] = useState({
    id: '',
    name: '',
    slug: '',
    role: 'Senior Software Architect',
    bio: '',
    email: '',
    avatarUrl: '',
    avatarPublicId: '',
    linkedinUrl: '',
    twitterUrl: ''
  });

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Relational data for service/project/faq picking
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [faqsList, setFaqsList] = useState<any[]>([]);
  const [searchLogs, setSearchLogs] = useState<any[]>([]);
  const [redirects, setRedirects] = useState<any[]>([]);

  // Post Form State
  const [form, setForm] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    directAnswer: string;
    keyTakeaways: string[];
    categoryId: string;
    authorId: string;
    clusterId: string;
    status: string;
    postType: string;
    searchIntent: string;
    targetKeyword: string;
    secondaryKeywords: string[];
    featured: boolean;
    coverImageUrl: string;
    coverImagePublicId: string;
    coverImageAlt: string;
    seoTitle: string;
    seoDescription: string;
    canonicalUrl: string;
    ogImageUrl: string;
    robotsIndex: boolean;
    robotsFollow: boolean;
    tagIds: string[];
    serviceIds: string[];
    projectIds: string[];
    faqIds: string[];
  }>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    directAnswer: '',
    keyTakeaways: [],
    categoryId: '',
    authorId: '',
    clusterId: '',
    status: 'DRAFT',
    postType: 'ARTICLE',
    searchIntent: 'INFORMATIONAL',
    targetKeyword: '',
    secondaryKeywords: [],
    featured: false,
    coverImageUrl: '',
    coverImagePublicId: '',
    coverImageAlt: '',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    ogImageUrl: '',
    robotsIndex: true,
    robotsFollow: true,
    tagIds: [],
    serviceIds: [],
    projectIds: [],
    faqIds: []
  });

  useEffect(() => {
    fetchData();
    fetchRelationalData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminBlogPosts();
      if (res) {
        setPosts(res.items || []);
        setCategories(res.categories || []);
        setAuthors(res.authors || []);
        setTags(res.tags || []);
        setSummary(res.summary || null);
      }
    } catch (err: any) {
      console.error('Failed to fetch admin blog data:', err);
      setError(err.message || 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelationalData = async () => {
    try {
      const [srvs, projs, faqs, logs, redirs] = await Promise.all([
        api.getServices(),
        api.getProjects(),
        api.getFaqs(),
        api.getBlogSearchLogs(),
        api.getBlogRedirects()
      ]);
      setServicesList(srvs || []);
      setProjectsList(projs || []);
      setFaqsList(faqs || []);
      setSearchLogs(logs || []);
      setRedirects(redirs || []);
    } catch (err) {
      console.warn('Failed to fetch blog relational picker data:', err);
    }
  };

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      directAnswer: '',
      keyTakeaways: [''],
      categoryId: categories[0]?.id || '',
      authorId: authors[0]?.id || '',
      clusterId: '',
      status: 'DRAFT',
      postType: 'ARTICLE',
      searchIntent: 'INFORMATIONAL',
      targetKeyword: '',
      secondaryKeywords: [''],
      featured: false,
      coverImageUrl: '',
      coverImagePublicId: '',
      coverImageAlt: '',
      seoTitle: '',
      seoDescription: '',
      canonicalUrl: '',
      ogImageUrl: '',
      robotsIndex: true,
      robotsFollow: true,
      tagIds: [],
      serviceIds: [],
      projectIds: [],
      faqIds: []
    });
    setModalTab('basic');
    setError(null);
    setShowModal(true);
  };

  const parseArrayOrJson = (val: any): string[] => {
    if (!val) return [''];
    if (Array.isArray(val)) return val.length > 0 ? val : [''];
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return [''];
      if (trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.length > 0 ? parsed : [''];
        } catch {}
      }
      const split = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      return split.length > 0 ? split : [''];
    }
    return [''];
  };

  const handleOpenEditModal = async (post: BlogPostItem) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      directAnswer: post.directAnswer || '',
      keyTakeaways: parseArrayOrJson(post.keyTakeaways),
      categoryId: post.categoryId || categories[0]?.id || '',
      authorId: post.authorId || authors[0]?.id || '',
      clusterId: post.clusterId || '',
      status: post.status,
      postType: post.postType,
      searchIntent: post.searchIntent,
      targetKeyword: post.targetKeyword || '',
      secondaryKeywords: parseArrayOrJson(post.secondaryKeywords),
      featured: post.featured,
      coverImageUrl: post.coverImageUrl || '',
      coverImagePublicId: post.coverImagePublicId || '',
      coverImageAlt: post.coverImageAlt || post.title,
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      canonicalUrl: post.canonicalUrl || '',
      ogImageUrl: post.ogImageUrl || '',
      robotsIndex: post.robotsIndex ?? true,
      robotsFollow: post.robotsFollow ?? true,
      tagIds: post.tags?.map((t) => t.id) || [],
      serviceIds: post.services?.map((s) => s.id) || [],
      projectIds: post.projects?.map((p) => p.id) || [],
      faqIds: post.faqs?.map((f) => f.id) || []
    });
    setModalTab('basic');
    setError(null);
    setShowModal(true);

    // Fetch version history for this post
    setLoadingVersions(true);
    try {
      const vList = await api.getBlogPostVersions(post.id);
      setVersions(vList || []);
    } catch (err) {
      console.warn('Failed to load blog version history:', err);
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!editingPost) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setForm((prev) => ({ ...prev, title, slug }));
    } else {
      setForm((prev) => ({ ...prev, title }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetFolder: string = 'ryzite/blog') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const uploadRes = await api.uploadBlogImage(file, targetFolder);
      if (targetFolder.includes('authors')) {
        setAuthorForm((prev) => ({
          ...prev,
          avatarUrl: uploadRes.url,
          avatarPublicId: uploadRes.public_id
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          coverImageUrl: uploadRes.url,
          coverImagePublicId: uploadRes.public_id
        }));
      }
      showToast('Image uploaded successfully to Cloudinary');
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePost = async () => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setError('Title, Excerpt, and Article Content are required fields.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const cleanKeyTakeaways = form.keyTakeaways.filter((t) => t.trim().length > 0);
      const cleanSecondaryKeywords = form.secondaryKeywords.filter((k) => k.trim().length > 0);

      const payload = {
        ...form,
        keyTakeaways: cleanKeyTakeaways,
        secondaryKeywords: cleanSecondaryKeywords
      };

      if (editingPost) {
        await api.updateBlogPost(editingPost.id, payload);
        showToast('Blog post updated successfully.');
      } else {
        await api.createBlogPost(payload);
        showToast('Blog post created successfully.');
      }

      setShowModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    setSaving(true);
    try {
      await api.deleteBlogPost(id);
      showToast('Blog post deleted.');
      setDeleteConfirmId(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete post');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishPost = async (id: string) => {
    try {
      await api.publishBlogPost(id);
      showToast('Post published live.');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Publishing failed');
    }
  };

  const handleUnpublishPost = async (id: string) => {
    try {
      await api.unpublishBlogPost(id);
      showToast('Post unpublished to draft.');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Unpublishing failed');
    }
  };

  const handleDuplicatePost = async (id: string) => {
    try {
      await api.duplicateBlogPost(id);
      showToast('Post duplicated as draft.');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Duplication failed');
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!editingPost) return;
    setSaving(true);
    try {
      const restored = await api.restoreBlogPostVersion(editingPost.id, versionId);
      showToast('Restored to selected version.');
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Version restoration failed');
    } finally {
      setSaving(false);
    }
  };

  // Category Save / Delete
  const handleSaveCategory = async () => {
    if (!catForm.name.trim()) return;
    try {
      await api.saveBlogCategory(catForm);
      showToast('Category saved.');
      setShowCatModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.deleteBlogCategory(id);
      showToast('Category deleted.');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Tag Save / Delete
  const handleSaveTag = async () => {
    if (!tagForm.name.trim()) return;
    try {
      await api.saveBlogTag(tagForm);
      showToast('Tag saved.');
      setShowTagModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await api.deleteBlogTag(id);
      showToast('Tag deleted.');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Author Save / Delete
  const handleSaveAuthor = async () => {
    if (!authorForm.name.trim() || !authorForm.role.trim()) return;
    try {
      await api.saveBlogAuthor(authorForm);
      showToast('Author profile saved.');
      setShowAuthorModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteAuthor = async (id: string) => {
    try {
      await api.deleteBlogAuthor(id);
      showToast('Author deleted.');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Filtered post list
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.categoryId === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    const matchesPostType = selectedPostType === 'ALL' || p.postType === selectedPostType;
    return matchesSearch && matchesCategory && matchesStatus && matchesPostType;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl flex items-center space-x-3 text-sm font-medium animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-[#0052FF] rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Enterprise Blog CMS</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage articles, categories, authors, topic clusters, and AEO answer engine optimization.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-[#0052FF] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Blog Post</span>
          </button>
        </div>
      </div>

      {/* KPI Analytics Summary Grid */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-xl">
            <div className="text-slate-500 text-xs font-medium">Total Articles</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{summary.total}</div>
            <div className="text-[10px] text-slate-400 mt-1">In PostgreSQL database</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl">
            <div className="text-emerald-600 text-xs font-medium">Published Live</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{summary.published}</div>
            <div className="text-[10px] text-slate-400 mt-1">Next.js rendered</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl">
            <div className="text-amber-600 text-xs font-medium">Drafts / In Review</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{summary.draft}</div>
            <div className="text-[10px] text-slate-400 mt-1">Pending publication</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl">
            <div className="text-[#0052FF] text-xs font-medium">Total Reader Views</div>
            <div className="text-2xl font-bold text-[#0052FF] mt-1">{summary.totalViews}</div>
            <div className="text-[10px] text-slate-400 mt-1">Public engagements</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl">
            <div className="text-indigo-600 text-xs font-medium">Taxonomies</div>
            <div className="text-2xl font-bold text-indigo-600 mt-1">
              {summary.totalCategories} <span className="text-xs text-slate-400 font-normal">Cats</span> / {summary.totalAuthors} <span className="text-xs text-slate-400 font-normal">Auth</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Configured taxonomy</div>
          </div>
        </div>
      )}

      {/* Main Module Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/50 p-3 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors ${
              activeTab === 'posts' ? 'bg-[#0052FF] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Blog Articles ({posts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors ${
              activeTab === 'categories' ? 'bg-[#0052FF] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('authors')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors ${
              activeTab === 'authors' ? 'bg-[#0052FF] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Authors ({authors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors ${
              activeTab === 'tags' ? 'bg-[#0052FF] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Tags ({tags.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors ${
              activeTab === 'analytics' ? 'bg-[#0052FF] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Search Gap Analytics</span>
          </button>
        </div>

        {/* TAB 1: ARTICLES DIRECTORY */}
        {activeTab === 'posts' && (
          <div className="p-4 space-y-4">
            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles by title, slug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#0052FF]"
                />
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="ARCHIVED">Archived</option>
                </select>

                <select
                  value={selectedPostType}
                  onChange={(e) => setSelectedPostType(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Types</option>
                  <option value="ARTICLE">Article</option>
                  <option value="GUIDE">Guide</option>
                  <option value="CASE_STUDY_INSIGHT">Case Study Insight</option>
                  <option value="TECHNICAL_WHITE_PAPER">White Paper</option>
                  <option value="PILLAR_PAGE">Pillar Page</option>
                </select>
              </div>
            </div>

            {/* Articles Table */}
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0052FF]" />
                Loading blog articles...
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-200 rounded-lg">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <div className="text-slate-700 text-sm font-semibold">No blog posts found</div>
                <p className="text-slate-400 text-xs mt-1">Try adjusting search filters or create a new blog post.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Article Title & Slug</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Author</th>
                      <th className="p-3">Type / Intent</th>
                      <th className="p-3">Score & Stats</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 max-w-xs">
                          <div className="font-semibold text-slate-900 line-clamp-1 flex items-center space-x-1.5">
                            {post.featured && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold">
                                FEATURED
                              </span>
                            )}
                            <span className="truncate">{post.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                            /blog/{post.slug}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                            {post.category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            {post.author?.avatarUrl ? (
                              <img src={post.author.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-slate-400" />
                            )}
                            <span className="text-slate-800 font-medium">{post.author?.name || 'Ryzite Team'}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-slate-900 font-medium">{post.postType}</div>
                          <div className="text-[10px] text-slate-400">{post.searchIntent}</div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                                post.qualityScore >= 80
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : post.qualityScore >= 60
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              QS: {post.qualityScore}
                            </span>
                            <span className="text-slate-500 text-[11px]">{post.views} views</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {post.wordCount} words • {post.readingTimeMinutes} min read
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                              post.status === 'PUBLISHED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : post.status === 'DRAFT'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {post.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-400 hover:text-[#0052FF] hover:bg-blue-50 rounded transition-colors"
                              title="View Public Post"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleOpenEditModal(post)}
                              className="p-1.5 text-slate-400 hover:text-[#0052FF] hover:bg-blue-50 rounded transition-colors"
                              title="Edit Article"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicatePost(post.id)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                              title="Duplicate Post"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {post.status === 'PUBLISHED' ? (
                              <button
                                onClick={() => handleUnpublishPost(post.id)}
                                className="p-1.5 text-amber-500 hover:bg-amber-50 rounded transition-colors"
                                title="Unpublish to Draft"
                              >
                                <Clock className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handlePublishPost(post.id)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                title="Publish Live"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteConfirmId(post.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete Article"
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
        )}

        {/* TAB 2: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Blog Content Categories</h3>
                <p className="text-xs text-slate-500">Organize articles into topic clusters.</p>
              </div>
              <button
                onClick={() => {
                  setCatForm({ id: '', name: '', slug: '', description: '', displayOrder: 0, active: true });
                  setShowCatModal(true);
                }}
                className="px-3 py-1.5 bg-[#0052FF] text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-slate-50 border border-slate-200 p-4 rounded-lg relative">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                    <span className="text-[10px] font-mono bg-blue-100 text-[#0052FF] px-2 py-0.5 rounded font-bold">
                      {cat.postsCount || 0} Posts
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">/blog/category/{cat.slug}</div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{cat.description || 'No description provided.'}</p>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setCatForm({
                          id: cat.id,
                          name: cat.name,
                          slug: cat.slug,
                          description: cat.description || '',
                          displayOrder: cat.displayOrder,
                          active: cat.active
                        });
                        setShowCatModal(true);
                      }}
                      className="text-xs text-[#0052FF] font-semibold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-xs text-rose-600 font-semibold hover:underline ml-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AUTHORS */}
        {activeTab === 'authors' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Blog Authors & Subject Matter Experts</h3>
                <p className="text-xs text-slate-500">Profiles attached to blog posts for E-E-A-T credentials.</p>
              </div>
              <button
                onClick={() => {
                  setAuthorForm({
                    id: '',
                    name: '',
                    slug: '',
                    role: 'Senior Software Architect',
                    bio: '',
                    email: '',
                    avatarUrl: '',
                    avatarPublicId: '',
                    linkedinUrl: '',
                    twitterUrl: ''
                  });
                  setShowAuthorModal(true);
                }}
                className="px-3 py-1.5 bg-[#0052FF] text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Author</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {authors.map((author) => (
                <div key={author.id} className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex gap-4">
                  {author.avatarUrl ? (
                    <img src={author.avatarUrl} alt="" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-blue-100 text-[#0052FF] flex items-center justify-center font-bold text-lg">
                      {author.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{author.name}</h4>
                      <span className="text-[10px] font-mono bg-blue-100 text-[#0052FF] px-2 py-0.5 rounded font-bold">
                        {author.postsCount || 0} Posts
                      </span>
                    </div>
                    <div className="text-xs text-[#0052FF] font-medium">{author.role}</div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{author.bio || 'No bio provided.'}</p>
                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                      <span className="text-slate-400 font-mono text-[10px]">/blog/author/{author.slug}</span>
                      <div className="space-x-3">
                        <button
                          onClick={() => {
                            setAuthorForm({
                              id: author.id,
                              name: author.name,
                              slug: author.slug,
                              role: author.role,
                              bio: author.bio || '',
                              email: author.email || '',
                              avatarUrl: author.avatarUrl || '',
                              avatarPublicId: author.avatarPublicId || '',
                              linkedinUrl: author.linkedinUrl || '',
                              twitterUrl: author.twitterUrl || ''
                            });
                            setShowAuthorModal(true);
                          }}
                          className="text-[#0052FF] font-semibold hover:underline"
                        >
                          Edit Profile
                        </button>
                        <button
                          onClick={() => handleDeleteAuthor(author.id)}
                          className="text-rose-600 font-semibold hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TAGS */}
        {activeTab === 'tags' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Content Tags</h3>
                <p className="text-xs text-slate-500">Fine-grained topical tags for search filtering.</p>
              </div>
              <button
                onClick={() => {
                  setTagForm({ id: '', name: '', slug: '' });
                  setShowTagModal(true);
                }}
                className="px-3 py-1.5 bg-[#0052FF] text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tag</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <div key={t.id} className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full flex items-center space-x-2 text-xs">
                  <Tag className="w-3.5 h-3.5 text-[#0052FF]" />
                  <span className="font-semibold text-slate-800">{t.name}</span>
                  <span className="text-[10px] text-slate-400">({t.postsCount || 0})</span>
                  <button
                    onClick={() => handleDeleteTag(t.id)}
                    className="text-slate-400 hover:text-rose-600 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SEARCH GAP ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">User Search Queries & Content Gaps</h3>
              <p className="text-xs text-slate-500">Track queries typed into the blog search bar and 301 redirects.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search Log */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Recent Search Queries</h4>
                {searchLogs.length === 0 ? (
                  <p className="text-xs text-slate-400">No search query logs recorded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {searchLogs.map((log: any) => (
                      <div key={log.id} className="bg-white p-2.5 rounded border border-slate-200 flex justify-between text-xs">
                        <span className="font-medium text-slate-900">{log.query}</span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                              log.resultsCount === 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {log.resultsCount} results
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 301 Redirects */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Recorded 301 Redirects</h4>
                {redirects.length === 0 ? (
                  <p className="text-xs text-slate-400">No URL redirects recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {redirects.map((r: any) => (
                      <div key={r.id} className="bg-white p-2.5 rounded border border-slate-200 text-xs">
                        <div className="text-slate-500 font-mono text-[10px] line-through">{r.sourceSlug}</div>
                        <div className="text-[#0052FF] font-mono font-bold text-[11px] flex items-center space-x-1">
                          <ChevronRight className="w-3 h-3" />
                          <span>{r.targetSlug}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT POST MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingPost ? `Edit Article: ${editingPost.title}` : 'Create New Blog Post'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure article content, Cloudinary media, taxonomy, relations, and SEO metadata.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ×
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-rose-50 border-b border-rose-200 p-3 text-rose-700 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Sub Tabs */}
            <div className="border-b border-slate-200 bg-white px-5 flex space-x-4">
              <button
                onClick={() => setModalTab('basic')}
                className={`py-3 text-xs font-bold border-b-2 transition-colors ${
                  modalTab === 'basic' ? 'border-[#0052FF] text-[#0052FF]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Basic Info & Cover
              </button>
              <button
                onClick={() => setModalTab('content')}
                className={`py-3 text-xs font-bold border-b-2 transition-colors ${
                  modalTab === 'content' ? 'border-[#0052FF] text-[#0052FF]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Article Content & Direct Answer
              </button>
              <button
                onClick={() => setModalTab('taxonomy')}
                className={`py-3 text-xs font-bold border-b-2 transition-colors ${
                  modalTab === 'taxonomy' ? 'border-[#0052FF] text-[#0052FF]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Taxonomy & Internal Relations
              </button>
              <button
                onClick={() => setModalTab('seo')}
                className={`py-3 text-xs font-bold border-b-2 transition-colors ${
                  modalTab === 'seo' ? 'border-[#0052FF] text-[#0052FF]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                4. SEO & Schema
              </button>
              {editingPost && (
                <button
                  onClick={() => setModalTab('history')}
                  className={`py-3 text-xs font-bold border-b-2 transition-colors ${
                    modalTab === 'history' ? 'border-[#0052FF] text-[#0052FF]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  5. Version History
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* SUB TAB 1: BASIC INFO */}
              {modalTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Article Title *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={handleTitleChange}
                      placeholder="e.g. Engineering AI-First Software Architecture in 2026"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0052FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug</label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-[#0052FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="APPROVED">Approved</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Article Format / Post Type</label>
                      <select
                        value={form.postType}
                        onChange={(e) => setForm((prev) => ({ ...prev, postType: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
                      >
                        <option value="ARTICLE">Standard Article</option>
                        <option value="GUIDE">Comprehensive Guide</option>
                        <option value="CASE_STUDY_INSIGHT">Case Study Insight</option>
                        <option value="TECHNICAL_WHITE_PAPER">Technical White Paper</option>
                        <option value="PILLAR_PAGE">Pillar Page</option>
                        <option value="NEWS">Agency News</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Search Intent</label>
                      <select
                        value={form.searchIntent}
                        onChange={(e) => setForm((prev) => ({ ...prev, searchIntent: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
                      >
                        <option value="INFORMATIONAL">Informational (Educational)</option>
                        <option value="COMMERCIAL">Commercial (Comparing services)</option>
                        <option value="TRANSACTIONAL">Transactional (Ready to hire)</option>
                        <option value="NAVIGATIONAL">Navigational</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Short Excerpt (Summary for Cards & RSS) *</label>
                    <textarea
                      rows={3}
                      value={form.excerpt}
                      onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Concise 2-3 sentence overview..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#0052FF]"
                    />
                  </div>

                  {/* Cloudinary Cover Image */}
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
                    <label className="block text-xs font-bold text-slate-900">Cover Image (Cloudinary ryzite/blog)</label>

                    {form.coverImageUrl ? (
                      <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-48 group">
                        <img src={form.coverImageUrl} alt="Cover preview" className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, coverImageUrl: '', coverImagePublicId: '' }))}
                            className="p-2 bg-rose-600 text-white rounded-lg text-xs font-bold"
                          >
                            Remove Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-[#0052FF] transition-colors">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <div className="text-xs font-semibold text-slate-700">Upload Cover Image</div>
                        <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, WebP up to 10MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'ryzite/blog')}
                          className="mt-3 block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0052FF] hover:file:bg-blue-100"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Image Alt Text</label>
                        <input
                          type="text"
                          value={form.coverImageAlt}
                          onChange={(e) => setForm((prev) => ({ ...prev, coverImageAlt: e.target.value }))}
                          placeholder="Descriptive ALT text for accessibility"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cloudinary Public ID</label>
                        <input
                          type="text"
                          readOnly
                          value={form.coverImagePublicId}
                          className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={form.featured}
                      onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 text-[#0052FF] rounded"
                    />
                    <label htmlFor="featured" className="text-xs font-bold text-slate-800">
                      Pin as Featured Post on Blog Hub & Hero Section
                    </label>
                  </div>
                </div>
              )}

              {/* SUB TAB 2: ARTICLE CONTENT & AEO */}
              {modalTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Main Article Content (Markdown / HTML) *
                    </label>
                    <textarea
                      rows={14}
                      value={form.content}
                      onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your article body in Markdown using ## H2 headings, ### H3 subheadings, code blocks, lists..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-[#0052FF]"
                    />
                    <div className="text-[10px] text-slate-400 mt-1">
                      H2 and H3 headings will automatically populate the table of contents (TOC) on the public page.
                    </div>
                  </div>

                  {/* Direct Answer Callout (AEO) */}
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-[#0052FF]" />
                      <label className="text-xs font-bold text-[#0052FF]">
                        AEO / Direct Answer Callout (AI Engine Extract)
                      </label>
                    </div>
                    <textarea
                      rows={3}
                      value={form.directAnswer}
                      onChange={(e) => setForm((prev) => ({ ...prev, directAnswer: e.target.value }))}
                      placeholder="Clear 1-2 sentence direct response for ChatGPT, Perplexity, and Google SGE citation..."
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  {/* Key Takeaways Bullet List */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">Key Takeaways (Top Highlights)</label>
                    {(Array.isArray(form.keyTakeaways) ? form.keyTakeaways : parseArrayOrJson(form.keyTakeaways)).map((takeaway, idx) => {
                      const currentList = Array.isArray(form.keyTakeaways) ? form.keyTakeaways : parseArrayOrJson(form.keyTakeaways);
                      return (
                        <div key={idx} className="flex space-x-2">
                          <input
                            type="text"
                            value={takeaway}
                            onChange={(e) => {
                              const updated = [...currentList];
                              updated[idx] = e.target.value;
                              setForm((prev) => ({ ...prev, keyTakeaways: updated }));
                            }}
                            placeholder={`Key point #${idx + 1}`}
                            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = currentList.filter((_, i) => i !== idx);
                              setForm((prev) => ({ ...prev, keyTakeaways: updated }));
                            }}
                            className="text-slate-400 hover:text-rose-600 px-2"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        const currentList = Array.isArray(form.keyTakeaways) ? form.keyTakeaways : parseArrayOrJson(form.keyTakeaways);
                        setForm((prev) => ({ ...prev, keyTakeaways: [...currentList, ''] }));
                      }}
                      className="text-xs text-[#0052FF] font-semibold hover:underline flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Takeaway</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SUB TAB 3: TAXONOMY & RELATIONS */}
              {modalTab === 'taxonomy' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Primary Category</label>
                      <select
                        value={form.categoryId}
                        onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Author Profile</label>
                      <select
                        value={form.authorId}
                        onChange={(e) => setForm((prev) => ({ ...prev, authorId: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
                      >
                        <option value="">Select Author</option>
                        {authors.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} ({a.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Multi-Select Tags */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Topical Tags</label>
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg max-h-32 overflow-y-auto">
                      {tags.map((t) => {
                        const selected = form.tagIds.includes(t.id);
                        return (
                          <button
                            type="button"
                            key={t.id}
                            onClick={() => {
                              const updated = selected
                                ? form.tagIds.filter((id) => id !== t.id)
                                : [...form.tagIds, t.id];
                              setForm((prev) => ({ ...prev, tagIds: updated }));
                            }}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                              selected
                                ? 'bg-[#0052FF] text-white'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {t.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Relational Services */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Related Agency Services</label>
                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg max-h-36 overflow-y-auto">
                      {servicesList.map((srv) => {
                        const selected = form.serviceIds.includes(srv.id);
                        return (
                          <label key={srv.id} className="flex items-center space-x-2 text-xs text-slate-800 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => {
                                const updated = selected
                                  ? form.serviceIds.filter((id) => id !== srv.id)
                                  : [...form.serviceIds, srv.id];
                                setForm((prev) => ({ ...prev, serviceIds: updated }));
                              }}
                              className="w-3.5 h-3.5 text-[#0052FF]"
                            />
                            <span className="truncate">{srv.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Relational Case Studies */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Related Portfolio Case Studies</label>
                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg max-h-36 overflow-y-auto">
                      {projectsList.map((proj) => {
                        const selected = form.projectIds.includes(proj.id);
                        return (
                          <label key={proj.id} className="flex items-center space-x-2 text-xs text-slate-800 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => {
                                const updated = selected
                                  ? form.projectIds.filter((id) => id !== proj.id)
                                  : [...form.projectIds, proj.id];
                                setForm((prev) => ({ ...prev, projectIds: updated }));
                              }}
                              className="w-3.5 h-3.5 text-[#0052FF]"
                            />
                            <span className="truncate">{proj.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB TAB 4: SEO & METADATA */}
              {modalTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Keyword (Focus Keyword)</label>
                    <input
                      type="text"
                      value={form.targetKeyword}
                      onChange={(e) => setForm((prev) => ({ ...prev, targetKeyword: e.target.value }))}
                      placeholder="e.g. Next.js enterprise architecture"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0052FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Meta Title Tag</label>
                    <input
                      type="text"
                      value={form.seoTitle}
                      onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
                      placeholder="Primary title for search engines (50-60 characters)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Meta Description Tag</label>
                    <textarea
                      rows={3}
                      value={form.seoDescription}
                      onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
                      placeholder="Snippet description displayed in SERPs (140-160 characters)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Canonical URL</label>
                      <input
                        type="text"
                        value={form.canonicalUrl}
                        onChange={(e) => setForm((prev) => ({ ...prev, canonicalUrl: e.target.value }))}
                        placeholder="https://ryzite.com/blog/..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">OG Share Image URL</label>
                      <input
                        type="text"
                        value={form.ogImageUrl}
                        onChange={(e) => setForm((prev) => ({ ...prev, ogImageUrl: e.target.value }))}
                        placeholder="Cloudinary image URL for Twitter & LinkedIn cards"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 pt-2">
                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.robotsIndex}
                        onChange={(e) => setForm((prev) => ({ ...prev, robotsIndex: e.target.checked }))}
                        className="w-4 h-4 text-[#0052FF]"
                      />
                      <span>Robots Index (Allow Googlebot)</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.robotsFollow}
                        onChange={(e) => setForm((prev) => ({ ...prev, robotsFollow: e.target.checked }))}
                        className="w-4 h-4 text-[#0052FF]"
                      />
                      <span>Robots Follow (Follow page links)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* SUB TAB 5: VERSION HISTORY */}
              {modalTab === 'history' && editingPost && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Audit Snapshots & Prior Versions
                    </h4>
                    <span className="text-xs text-slate-500">{versions.length} versions saved</span>
                  </div>

                  {loadingVersions ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0052FF]" />
                      Loading history...
                    </div>
                  ) : versions.length === 0 ? (
                    <p className="text-xs text-slate-400 p-4 border border-dashed border-slate-200 rounded-lg text-center">
                      No prior version snapshots recorded for this post.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-72 overflow-y-auto">
                      {versions.map((ver: any) => (
                        <div
                          key={ver.id}
                          className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-900 flex items-center space-x-2">
                              <span>Version Snapshot #{ver.versionNumber}</span>
                              <span className="text-[10px] font-mono text-slate-400 font-normal">
                                ({new Date(ver.createdAt).toLocaleString()})
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Saved by <span className="font-semibold">{ver.changedBy}</span>
                            </div>
                            {ver.changeReason && (
                              <div className="text-[11px] text-[#0052FF] mt-1 font-medium">"{ver.changeReason}"</div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRestoreVersion(ver.id)}
                            disabled={saving}
                            className="px-3 py-1.5 bg-[#0052FF] text-white font-semibold text-xs rounded hover:bg-blue-700"
                          >
                            Restore This Snapshot
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePost}
                disabled={saving}
                className="px-5 py-2 bg-[#0052FF] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : editingPost ? 'Save Article' : 'Create Article'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {catForm.id ? 'Edit Category' : 'Create Category'}
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category Name</label>
              <input
                type="text"
                value={catForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
                  setCatForm((prev) => ({ ...prev, name, slug }));
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Slug</label>
              <input
                type="text"
                value={catForm.slug}
                onChange={(e) => setCatForm((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={catForm.description}
                onChange={(e) => setCatForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowCatModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-4 py-2 bg-[#0052FF] text-white text-xs font-semibold rounded-lg"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAG MODAL */}
      {showTagModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create Tag</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tag Name</label>
              <input
                type="text"
                value={tagForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
                  setTagForm({ id: '', name, slug });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Slug</label>
              <input
                type="text"
                value={tagForm.slug}
                onChange={(e) => setTagForm((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowTagModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTag}
                className="px-4 py-2 bg-[#0052FF] text-white text-xs font-semibold rounded-lg"
              >
                Save Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTHOR MODAL */}
      {showAuthorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {authorForm.id ? 'Edit Author Profile' : 'Create Author Profile'}
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={authorForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
                  setAuthorForm((prev) => ({ ...prev, name, slug }));
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role / Job Title</label>
              <input
                type="text"
                value={authorForm.role}
                onChange={(e) => setAuthorForm((prev) => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Author Bio</label>
              <textarea
                rows={3}
                value={authorForm.bio}
                onChange={(e) => setAuthorForm((prev) => ({ ...prev, bio: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
              <input
                type="text"
                value={authorForm.linkedinUrl}
                onChange={(e) => setAuthorForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Image (Cloudinary ryzite/blog/authors)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'ryzite/blog/authors')}
                className="w-full text-xs text-slate-500"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAuthorModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAuthor}
                className="px-4 py-2 bg-[#0052FF] text-white text-xs font-semibold rounded-lg"
              >
                Save Author Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4 text-center">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Blog Post?</h3>
            <p className="text-xs text-slate-500">
              This action will permanently delete the post and remove associated Cloudinary media assets. This cannot be undone.
            </p>
            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePost(deleteConfirmId)}
                disabled={saving}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700"
              >
                {saving ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
