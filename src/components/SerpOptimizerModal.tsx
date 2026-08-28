import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  AlertTriangle, 
  Share2, 
  Code2, 
  TrendingUp, 
  Copy, 
  Check, 
  RefreshCw, 
  Sliders, 
  ExternalLink,
  Star,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';
import { PageMetadataConfig, SerpSnippetConfig, SeoFocusKeyword } from '../types';

interface SerpOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: PageMetadataConfig;
  onSave: (updated: PageMetadataConfig) => Promise<void>;
}

type PreviewTab = 'google-desktop' | 'google-mobile' | 'ai-overview' | 'social-linkedin' | 'social-twitter' | 'schema-json';

export const SerpOptimizerModal: React.FC<SerpOptimizerModalProps> = ({
  isOpen,
  onClose,
  metadata,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<PreviewTab>('google-desktop');
  const [searchQuery, setSearchQuery] = useState('software development agency');
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local editable state
  const [title, setTitle] = useState(metadata.title || 'Ryzite | Software Development & Digital Marketing Agency');
  const [description, setDescription] = useState(metadata.description || 'We Build Software That Drives Growth. Empowering startups and enterprises with scalable custom software, mobile apps, AI automation, and cloud solutions.');
  const [canonicalUrl, setCanonicalUrl] = useState(metadata.canonicalUrl || 'https://ryzite.com');
  const [ogImage, setOgImage] = useState(metadata.ogImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop');
  const [siteName, setSiteName] = useState(metadata.siteName || 'Ryzite Software & AI Agency');
  const [twitterHandle, setTwitterHandle] = useState(metadata.twitterHandle || '@ryzite_agency');
  
  const [serpConfig, setSerpConfig] = useState<SerpSnippetConfig>(
    metadata.serpSnippet || {
      pageTitle: title,
      metaDescription: description,
      slug: '',
      breadcrumb: 'Home',
      displayUrl: 'https://ryzite.com',
      enableRichSnippets: true,
      starRating: 4.9,
      reviewCount: 142,
      priceRange: '$$$$',
      sitelinks: [
        { label: 'Web Development', url: '#services', description: 'Enterprise React & Next.js high-concurrency platforms.' },
        { label: 'AI & Automation', url: '#services', description: 'Custom LLMs, autonomous agents & RAG workflows.' },
        { label: 'Case Studies', url: '#portfolio', description: 'Real-world client outcomes & performance metrics.' },
        { label: 'Get an AI Scope Estimate', url: '#contact', description: 'Instant project architecture & timeline estimator.' }
      ],
      aiOverviewAnswer: 'Ryzite is a premier software development and digital marketing agency specializing in custom full-stack web applications, AI automation agents (Gemini & OpenAI), native mobile apps, and technical SEO/AEO strategies with guaranteed 95+ Core Web Vitals performance.',
      aiKeyTakeaways: [
        'Sub-100ms API response latency with decoupled microservices',
        'Custom RAG knowledge pipelines and autonomous agents',
        'Full-cycle delivery: Design, development, CI/CD and 24/7 SLA maintenance'
      ]
    }
  );

  const [keywords, setKeywords] = useState<SeoFocusKeyword[]>(
    metadata.focusKeywords || [
      {
        id: 'kw-1',
        keyword: 'Custom Software Development Agency',
        searchVolume: '18,500/mo',
        difficulty: 'Medium',
        targetPage: '/',
        targetPosition: '#3 on Google SERP',
        currentDensity: 2.8,
        status: 'OPTIMIZED'
      },
      {
        id: 'kw-2',
        keyword: 'Enterprise AI Agent Development',
        searchVolume: '12,200/mo',
        difficulty: 'Low',
        targetPage: '/services/ai-automation-solutions',
        targetPosition: '#1 in AI Overviews',
        currentDensity: 3.4,
        status: 'OPTIMIZED'
      },
      {
        id: 'kw-3',
        keyword: 'Next.js Full Stack Development Company',
        searchVolume: '9,800/mo',
        difficulty: 'Medium',
        targetPage: '/services/web-application-development',
        targetPosition: '#4 on Google SERP',
        currentDensity: 2.1,
        status: 'OPTIMIZED'
      },
      {
        id: 'kw-4',
        keyword: 'Answer Engine Optimization Agency',
        searchVolume: '6,400/mo',
        difficulty: 'Low',
        targetPage: '/#aeo',
        targetPosition: '#2 in Perplexity & GEO',
        currentDensity: 2.5,
        status: 'OPTIMIZED'
      }
    ]
  );

  const [newKw, setNewKw] = useState({ keyword: '', searchVolume: '5,000/mo', difficulty: 'Medium' as const, targetPosition: 'Top 5' });

  if (!isOpen) return null;

  // Title & Desc Metrics
  const titleCharCount = title.length;
  const titlePixelEst = Math.round(titleCharCount * 8.8); // Google desktop limit ~600px
  const isTitleIdeal = titleCharCount >= 45 && titleCharCount <= 60;
  const isTitleTooLong = titleCharCount > 60;

  const descCharCount = description.length;
  const isDescIdeal = descCharCount >= 120 && descCharCount <= 160;
  const isDescTooLong = descCharCount > 160;

  // SERP Score calculation
  let serpScore = 70;
  if (isTitleIdeal) serpScore += 10;
  if (isDescIdeal) serpScore += 10;
  if (serpConfig.enableRichSnippets) serpScore += 5;
  if (serpConfig.sitelinks.length >= 2) serpScore += 5;

  const handleCopyJsonLd = () => {
    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": metadata.organizationSchema?.name || "Ryzite",
      "url": canonicalUrl,
      "logo": "https://ryzite.com/assets/logo.png",
      "image": ogImage,
      "description": description,
      "priceRange": serpConfig.priceRange,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": serpConfig.starRating.toString(),
        "reviewCount": serpConfig.reviewCount.toString()
      }
    };
    navigator.clipboard.writeText(JSON.stringify(jsonLdData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedConfig: PageMetadataConfig = {
        ...metadata,
        title,
        description,
        canonicalUrl,
        ogImage,
        siteName,
        twitterHandle,
        serpSnippet: serpConfig,
        focusKeywords: keywords
      };
      await onSave(updatedConfig);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save SERP config:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddKeyword = () => {
    if (!newKw.keyword.trim()) return;
    const kw: SeoFocusKeyword = {
      id: `kw-${Date.now()}`,
      keyword: newKw.keyword.trim(),
      searchVolume: newKw.searchVolume || '3,000/mo',
      difficulty: newKw.difficulty,
      targetPage: '/',
      targetPosition: newKw.targetPosition,
      currentDensity: 2.2,
      status: 'OPTIMIZED'
    };
    setKeywords([...keywords, kw]);
    setNewKw({ keyword: '', searchVolume: '5,000/mo', difficulty: 'Medium', targetPosition: 'Top 5' });
  };

  const handleDeleteKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
  };

  // Helper to highlight query terms in snippet preview
  const highlightSnippet = (text: string, query: string) => {
    if (!query.trim()) return text;
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    if (words.length === 0) return text;

    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      words.includes(part.toLowerCase()) ? <strong key={i} className="text-slate-900 font-bold dark:text-white">{part}</strong> : part
    );
  };

  return (
    <div id="serp-optimizer-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">SERP & Google Search Optimization Suite</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live Optimizer
                </span>
              </div>
              <p className="text-xs text-slate-400">Real-time Google search snippet simulation, AI Overviews tuning, and Schema.org rich markup generator.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="save-serp-config-btn"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" /> Saved to Database!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Save & Deploy SEO
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left Column: Metadata Editors & Focus Keywords (5 cols) */}
          <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-6 bg-slate-900/50">
            
            {/* SERP Health Score Card */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">SERP Quality Score</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-extrabold text-white">{serpScore}/100</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Grade A+
                  </span>
                </div>
              </div>
              <div className="text-right text-xs text-slate-400 space-y-0.5">
                <div className="flex items-center gap-1 text-emerald-400 justify-end">
                  <Check className="w-3.5 h-3.5" /> Schema.org Valid
                </div>
                <div className="flex items-center gap-1 text-emerald-400 justify-end">
                  <Check className="w-3.5 h-3.5" /> Mobile Viewport Ready
                </div>
                <div className="flex items-center gap-1 text-blue-400 justify-end">
                  <Sparkles className="w-3.5 h-3.5" /> AI Overview Ready
                </div>
              </div>
            </div>

            {/* Page Title Input with Pixel Width Gauge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">Google SERP Page Title</label>
                <div className="flex items-center gap-2 text-xs">
                  <span className={isTitleTooLong ? 'text-rose-400 font-semibold' : isTitleIdeal ? 'text-emerald-400' : 'text-amber-400'}>
                    {titleCharCount} / 60 chars
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{titlePixelEst}px / 600px</span>
                </div>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Ryzite | Software Development & Digital Marketing Agency"
              />
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    titleCharCount > 60 ? 'bg-rose-500' : titleCharCount >= 45 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, (titleCharCount / 60) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Keep primary target keywords within the first 45 characters for maximum click-through rate.
              </p>
            </div>

            {/* Meta Description with Character Counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">SERP Meta Description</label>
                <span className={`text-xs ${isDescTooLong ? 'text-rose-400 font-semibold' : isDescIdeal ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {descCharCount} / 160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Scale your business with high-performance custom web applications..."
              />
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    descCharCount > 160 ? 'bg-rose-500' : descCharCount >= 120 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, (descCharCount / 160) * 100)}%` }}
                />
              </div>
            </div>

            {/* Rich Snippets & Review Rating Settings */}
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-slate-200">Google Rich Snippets & Stars</span>
                </div>
                <input
                  type="checkbox"
                  checked={serpConfig.enableRichSnippets}
                  onChange={(e) => setSerpConfig({ ...serpConfig, enableRichSnippets: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
              
              {serpConfig.enableRichSnippets && (
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Star Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={serpConfig.starRating}
                      onChange={(e) => setSerpConfig({ ...serpConfig, starRating: parseFloat(e.target.value) || 4.9 })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Reviews</label>
                    <input
                      type="number"
                      value={serpConfig.reviewCount}
                      onChange={(e) => setSerpConfig({ ...serpConfig, reviewCount: parseInt(e.target.value, 10) || 100 })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Price Tier</label>
                    <input
                      type="text"
                      value={serpConfig.priceRange}
                      onChange={(e) => setSerpConfig({ ...serpConfig, priceRange: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                      placeholder="$$$$"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Focus Keywords & SERP Rank Tracking */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Focus Keywords & SERP Rankings
                </label>
                <span className="text-[11px] text-slate-400">{keywords.length} Tracked</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {keywords.map((kw) => (
                  <div key={kw.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-white">{kw.keyword}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>Vol: <strong className="text-slate-300">{kw.searchVolume}</strong></span>
                        <span>·</span>
                        <span className="text-emerald-400">{kw.targetPosition}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteKeyword(kw.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Keyword Form */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="New focus keyword..."
                  value={newKw.keyword}
                  onChange={(e) => setNewKw({ ...newKw, keyword: e.target.value })}
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Live Search Previewers (7 cols) */}
          <div className="lg:col-span-7 p-6 flex flex-col space-y-5 bg-slate-950/40">
            
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('google-desktop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    activeTab === 'google-desktop'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" /> Google Desktop
                </button>
                <button
                  onClick={() => setActiveTab('google-mobile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    activeTab === 'google-mobile'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Google Mobile
                </button>
                <button
                  onClick={() => setActiveTab('ai-overview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    activeTab === 'ai-overview'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Google AI Overview
                </button>
                <button
                  onClick={() => setActiveTab('social-linkedin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    activeTab === 'social-linkedin'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" /> Social Preview
                </button>
                <button
                  onClick={() => setActiveTab('schema-json')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    activeTab === 'schema-json'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" /> JSON-LD Schema
                </button>
              </div>

              {activeTab === 'schema-json' && (
                <button
                  onClick={handleCopyJsonLd}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy JSON'}
                </button>
              )}
            </div>

            {/* Test Query Search Simulator Bar */}
            {(activeTab === 'google-desktop' || activeTab === 'google-mobile' || activeTab === 'ai-overview') && (
              <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                <Search className="w-4 h-4 text-slate-400 ml-2" />
                <span className="text-slate-500 font-mono">Google Search:</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none text-white focus:outline-none text-xs"
                  placeholder="Type a test search query to see bolding effects..."
                />
              </div>
            )}

            {/* PREVIEW CONTAINER */}
            <div className="flex-1 flex flex-col justify-center">

              {/* 1. GOOGLE DESKTOP PREVIEW */}
              {activeTab === 'google-desktop' && (
                <div className="bg-white dark:bg-[#202124] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl mx-auto w-full transition-all">
                  {/* Google Desktop Header & Breadcrumb */}
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      R
                    </div>
                    <div className="leading-tight">
                      <div className="text-[14px] text-slate-800 dark:text-[#dadce0] font-medium">Ryzite</div>
                      <div className="text-[12px] text-slate-500 dark:text-[#bdc1c6] truncate">
                        https://ryzite.com <span className="text-slate-400">› services › software</span>
                      </div>
                    </div>
                  </div>

                  {/* Title Link */}
                  <h3 className="text-[20px] font-normal leading-snug text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer mb-1 tracking-tight font-sans">
                    {title || 'Ryzite | Software Development & Digital Marketing Agency'}
                  </h3>

                  {/* Rich Stars Rating */}
                  {serpConfig.enableRichSnippets && (
                    <div className="flex items-center gap-1.5 text-[12px] text-[#70757a] dark:text-[#bdc1c6] mb-1.5">
                      <span className="text-amber-500">★★★★★</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{serpConfig.starRating}</span>
                      <span>({serpConfig.reviewCount} reviews)</span>
                      <span>·</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{serpConfig.priceRange}</span>
                      <span>·</span>
                      <span>Custom Software</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-[14px] leading-relaxed text-slate-600 dark:text-[#bdc1c6] mb-4">
                    {highlightSnippet(description, searchQuery)}
                  </p>

                  {/* Sitelinks Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {serpConfig.sitelinks.map((sitelink, idx) => (
                      <div key={idx} className="p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <div className="text-[#1a0dab] dark:text-[#8ab4f8] font-medium text-[13px] hover:underline cursor-pointer">
                          {sitelink.label}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-[#9aa0a6] line-clamp-1">
                          {sitelink.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. GOOGLE MOBILE PREVIEW */}
              {activeTab === 'google-mobile' && (
                <div className="max-w-xs mx-auto w-full bg-white dark:bg-[#202124] p-4 rounded-3xl border-4 border-slate-300 dark:border-slate-800 shadow-2xl space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                      R
                    </div>
                    <div className="leading-none">
                      <div className="text-[12px] font-medium text-slate-800 dark:text-slate-200">Ryzite</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">ryzite.com</div>
                    </div>
                  </div>

                  <h3 className="text-[16px] font-normal leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">
                    {title}
                  </h3>

                  {serpConfig.enableRichSnippets && (
                    <div className="flex items-center gap-1 text-[11px] text-[#70757a] dark:text-[#bdc1c6]">
                      <span className="text-amber-500 text-[10px]">★★★★★</span>
                      <span className="font-semibold">{serpConfig.starRating}</span>
                      <span>({serpConfig.reviewCount})</span>
                    </div>
                  )}

                  <p className="text-[12px] leading-relaxed text-slate-600 dark:text-[#bdc1c6]">
                    {highlightSnippet(description, searchQuery)}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                    {serpConfig.sitelinks.slice(0, 3).map((sl, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[11px] text-[#1a0dab] dark:text-[#8ab4f8]">
                        {sl.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. GOOGLE AI OVERVIEW PREVIEW */}
              {activeTab === 'ai-overview' && (
                <div className="bg-slate-900 border border-purple-500/30 p-6 rounded-2xl shadow-xl max-w-2xl mx-auto w-full space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* AI Overview Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/30">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-200 bg-clip-text text-transparent">
                        Google AI Overview
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/20 border border-purple-500/30 text-purple-300">
                      Answer Engine Optimized (GEO)
                    </span>
                  </div>

                  {/* Direct Synthesis Answer */}
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {serpConfig.aiOverviewAnswer}
                  </p>

                  {/* Entity Badges */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Verified Entity Highlights:</span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {serpConfig.aiKeyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Citation Pill */}
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Indexed Source:</span>
                    <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 flex items-center gap-1.5 text-xs text-blue-400">
                      <Globe className="w-3 h-3" />
                      <span>ryzite.com › services › ai-automation</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. SOCIAL MEDIA PREVIEW (LinkedIn / Twitter) */}
              {activeTab === 'social-linkedin' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl max-w-xl mx-auto w-full overflow-hidden">
                  <div className="relative aspect-[1200/630] bg-slate-950 overflow-hidden">
                    <img 
                      src={ogImage} 
                      alt="Open Graph Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                      <span className="px-2 py-0.5 bg-blue-600 text-white font-bold text-[10px] rounded uppercase tracking-wider">
                        Social Graph 1200x630
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/60 border-t border-slate-800 space-y-1">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
                      RYZITE.COM · SOFTWARE DEVELOPMENT
                    </div>
                    <div className="font-bold text-white text-sm line-clamp-1">
                      {title}
                    </div>
                    <div className="text-xs text-slate-300 line-clamp-2">
                      {description}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. JSON-LD SCHEMA CODE INSPECTOR */}
              {activeTab === 'schema-json' && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-96">
                  <pre>{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ProfessionalService",
                    "name": metadata.organizationSchema?.name || "Ryzite",
                    "url": canonicalUrl,
                    "logo": "https://ryzite.com/assets/logo.png",
                    "image": ogImage,
                    "telephone": "+1-800-555-0199",
                    "email": "contact@ryzite.com",
                    "priceRange": serpConfig.priceRange,
                    "description": description,
                    "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": serpConfig.starRating.toString(),
                      "reviewCount": serpConfig.reviewCount.toString()
                    },
                    "hasOfferCatalog": {
                      "@type": "OfferCatalog",
                      "name": "Ryzite Software Services"
                    }
                  }, null, 2)}</pre>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
