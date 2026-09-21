import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Plus,
  Trash2,
  Edit3,
  Save,
  Search,
  RefreshCw,
  ExternalLink,
  BookOpen,
  History,
  Layers,
  FileCode,
  Tag,
  Award,
  Link,
  Info,
  Check,
  Clock,
  X
} from 'lucide-react';
import {
  CompanyEntityConfig,
  CompanyFactItem,
  CompanyFaqItem,
  CompanyExpertiseItem,
  AeoHealthScore,
  AeoAuditIssueItem,
  FactCategory,
  FactVerifiedStatus,
  ClaimType,
  StatisticStatus
} from '../../types';
import { api } from '../../lib/api';

interface AeoKnowledgeHubModuleProps {
  renderSerpSection?: React.ReactNode;
}

export const AeoKnowledgeHubModule: React.FC<AeoKnowledgeHubModuleProps> = ({ renderSerpSection }) => {
  const [subTab, setSubTab] = useState<'health' | 'entity' | 'facts' | 'faqs' | 'expertise' | 'serp'>('health');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  // Data states
  const [healthScore, setHealthScore] = useState<AeoHealthScore | null>(null);
  const [auditIssues, setAuditIssues] = useState<AeoAuditIssueItem[]>([]);
  const [entity, setEntity] = useState<CompanyEntityConfig | null>(null);
  const [facts, setFacts] = useState<CompanyFactItem[]>([]);
  const [faqs, setFaqs] = useState<CompanyFaqItem[]>([]);
  const [expertise, setExpertise] = useState<CompanyExpertiseItem[]>([]);

  // Filtering states for Facts
  const [factCategoryFilter, setFactCategoryFilter] = useState<string>('ALL');
  const [factVerifiedFilter, setFactVerifiedFilter] = useState<string>('ALL');
  const [factSearch, setFactSearch] = useState<string>('');

  // Modal states
  const [factModalOpen, setFactModalOpen] = useState<boolean>(false);
  const [editingFact, setEditingFact] = useState<Partial<CompanyFactItem> | null>(null);

  const [faqModalOpen, setFaqModalOpen] = useState<boolean>(false);
  const [editingFaq, setEditingFaq] = useState<Partial<CompanyFaqItem> | null>(null);

  const [expertiseModalOpen, setExpertiseModalOpen] = useState<boolean>(false);
  const [editingExpertise, setEditingExpertise] = useState<Partial<CompanyExpertiseItem> | null>(null);

  const [versionModalFact, setVersionModalFact] = useState<CompanyFactItem | null>(null);

  // Load all AEO data
  const loadData = async () => {
    setLoading(true);
    try {
      const [healthData, entityData, factsData, faqsData, expertiseData, issuesData] = await Promise.all([
        api.getAeoHealthScore().catch(() => null),
        api.getCompanyEntity().catch(() => null),
        api.getCompanyFacts().catch(() => []),
        api.getCompanyFaqs().catch(() => []),
        api.getCompanyExpertise().catch(() => []),
        api.getAeoIssues().catch(() => [])
      ]);

      setHealthScore(healthData);
      setEntity(entityData);
      setFacts(factsData);
      setFaqs(faqsData);
      setExpertise(expertiseData);
      setAuditIssues(issuesData);
    } catch (err: any) {
      console.error('Error loading AEO Knowledge Hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Run dynamic audit
  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await api.runAeoAudit();
      if (res.issues) setAuditIssues(res.issues);
      if (res.health) setHealthScore(res.health);
      setMessage('AEO & Search Audit completed successfully!');
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert('Audit failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save Entity metadata
  const handleSaveEntity = async () => {
    if (!entity) return;
    setSaving(true);
    try {
      const updated = await api.updateCompanyEntity(entity);
      setEntity(updated);
      setMessage('Company Entity metadata saved to database!');
      setTimeout(() => setMessage(null), 4000);
      loadData();
    } catch (err: any) {
      alert('Failed to save entity: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Fact Save
  const handleSaveFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFact || !editingFact.question || !editingFact.shortAnswer) {
      alert('Question and Short Answer are required.');
      return;
    }
    setSaving(true);
    try {
      if (editingFact.id) {
        await api.updateCompanyFact(editingFact.id, editingFact);
      } else {
        await api.createCompanyFact(editingFact);
      }
      setFactModalOpen(false);
      setEditingFact(null);
      setMessage('Company Fact saved successfully!');
      setTimeout(() => setMessage(null), 4000);
      loadData();
    } catch (err: any) {
      alert('Failed to save fact: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Fact Delete
  const handleDeleteFact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company fact?')) return;
    try {
      await api.deleteCompanyFact(id);
      loadData();
    } catch (err: any) {
      alert('Failed to delete fact: ' + err.message);
    }
  };

  // FAQ Save
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question || !editingFaq.shortAnswer) return;
    setSaving(true);
    try {
      if (editingFaq.id) {
        await api.updateCompanyFaq(editingFaq.id, editingFaq);
      } else {
        await api.createCompanyFaq(editingFaq);
      }
      setFaqModalOpen(false);
      setEditingFaq(null);
      loadData();
    } catch (err: any) {
      alert('Failed to save FAQ: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ item?')) return;
    try {
      await api.deleteCompanyFaq(id);
      loadData();
    } catch (err: any) {
      alert('Error deleting FAQ: ' + err.message);
    }
  };

  // Expertise Save
  const handleSaveExpertise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpertise || !editingExpertise.topic) return;
    setSaving(true);
    try {
      if (editingExpertise.id) {
        await api.updateCompanyExpertise(editingExpertise.id, editingExpertise);
      } else {
        await api.createCompanyExpertise(editingExpertise);
      }
      setExpertiseModalOpen(false);
      setEditingExpertise(null);
      loadData();
    } catch (err: any) {
      alert('Error saving topic expertise: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpertise = async (id: string) => {
    if (!confirm('Delete this topic expertise item?')) return;
    try {
      await api.deleteCompanyExpertise(id);
      loadData();
    } catch (err: any) {
      alert('Error deleting expertise: ' + err.message);
    }
  };

  // Filtered facts
  const filteredFacts = facts.filter(f => {
    if (factCategoryFilter !== 'ALL' && f.category !== factCategoryFilter) return false;
    if (factVerifiedFilter !== 'ALL' && f.verifiedStatus !== factVerifiedFilter) return false;
    if (factSearch) {
      const q = factSearch.toLowerCase();
      return (
        f.question.toLowerCase().includes(q) ||
        f.shortAnswer.toLowerCase().includes(q) ||
        (f.detailedAnswer && f.detailedAnswer.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* SUCCESS NOTIFICATION */}
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* TOP HEADER: DYNAMIC AEO HEALTH SCORE GAUGE */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-blue-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full text-[10px] font-bold uppercase tracking-wider">
                AEO & Entity Knowledge Hub
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Single Source of Truth
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Answer Engine & Company Facts System
            </h2>
            <p className="text-xs text-blue-200/80 max-w-2xl leading-relaxed">
              Real-time PostgreSQL identity hub feeding verified factual claims to ChatGPT, Claude, Perplexity, Google Overviews, and JSON-LD schemas.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
            {/* Dynamic Score Display */}
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-xs uppercase font-bold text-slate-400">AEO Health</div>
              <div className="text-3xl font-black text-emerald-400 flex items-baseline justify-center gap-1">
                {healthScore ? healthScore.score : 0}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
            </div>

            <div className="text-center px-3 border-r border-white/10">
              <div className="text-xs uppercase font-bold text-slate-400">Grade</div>
              <div className="text-2xl font-bold text-blue-400">
                {healthScore ? healthScore.grade : 'N/A'}
              </div>
            </div>

            <div className="space-y-1">
              <button
                onClick={handleRunAudit}
                disabled={loading}
                className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <Sparkles size={14} />
                <span>{loading ? 'Auditing...' : 'Run Automated AEO Audit'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* METRICS SUMMARY BAR */}
        {healthScore && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
              <span className="text-slate-400 text-[11px] block">Verified Facts</span>
              <span className="text-emerald-400 font-bold text-sm">{healthScore.totals.verifiedFacts} / {healthScore.totals.totalFacts}</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
              <span className="text-slate-400 text-[11px] block">Unverified Claims</span>
              <span className="text-amber-400 font-bold text-sm">{healthScore.totals.unverifiedFacts}</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
              <span className="text-slate-400 text-[11px] block">Requires Review</span>
              <span className="text-rose-400 font-bold text-sm">{healthScore.totals.requiresReviewFacts}</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
              <span className="text-slate-400 text-[11px] block">AEO FAQs</span>
              <span className="text-blue-300 font-bold text-sm">{healthScore.totals.totalFaqs}</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
              <span className="text-slate-400 text-[11px] block">Topics (knowsAbout)</span>
              <span className="text-purple-300 font-bold text-sm">{healthScore.totals.totalExpertise}</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
              <span className="text-slate-400 text-[11px] block">Open Audit Issues</span>
              <span className="text-rose-300 font-bold text-sm">{healthScore.totals.openAuditIssues}</span>
            </div>
          </div>
        )}
      </div>

      {/* MODULE NAVIGATION SUB-TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setSubTab('health')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'health' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck size={15} />
          <span>Health & Audit ({auditIssues.length})</span>
        </button>

        <button
          onClick={() => setSubTab('entity')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'entity' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award size={15} />
          <span>Company Entity Identity</span>
        </button>

        <button
          onClick={() => setSubTab('facts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'facts' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen size={15} />
          <span>Verified Facts CMS ({facts.length})</span>
        </button>

        <button
          onClick={() => setSubTab('faqs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'faqs' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HelpCircle size={15} />
          <span>AEO FAQs ({faqs.length})</span>
        </button>

        <button
          onClick={() => setSubTab('expertise')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'expertise' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Tag size={15} />
          <span>Topic Expertise ({expertise.length})</span>
        </button>

        <button
          onClick={() => setSubTab('serp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'serp' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileCode size={15} />
          <span>Page SERP & SEO Preview</span>
        </button>
      </div>

      {/* SUB-TAB 1: HEALTH & AUDIT BREAKDOWN */}
      {subTab === 'health' && (
        <div className="space-y-6">
          {healthScore && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} className="text-blue-600" />
                <span>Dynamic AEO Health Score Points Breakdown (0 - 100)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200/80">
                  <div className="flex justify-between font-bold">
                    <span>1. Entity Identity Completeness</span>
                    <span className="text-blue-600">{healthScore.breakdown.entityIdentity} / 20 pts</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(healthScore.breakdown.entityIdentity / 20) * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500">Legal name, trading name, founding year, sameAs links, headquarters address.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200/80">
                  <div className="flex justify-between font-bold">
                    <span>2. Fact Completeness & Verification</span>
                    <span className="text-emerald-600">{healthScore.breakdown.factCompleteness} / 20 pts</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(healthScore.breakdown.factCompleteness / 20) * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500">Ratio of VERIFIED facts, concise short answers, category distribution.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200/80">
                  <div className="flex justify-between font-bold">
                    <span>3. Evidence & Source Citations</span>
                    <span className="text-purple-600">{healthScore.breakdown.evidenceCitations} / 15 pts</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${(healthScore.breakdown.evidenceCitations / 15) * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500">Facts containing source URLs or attached verifiable evidence.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200/80">
                  <div className="flex justify-between font-bold">
                    <span>4. Structured JSON-LD Schema</span>
                    <span className="text-amber-600">{healthScore.breakdown.structuredSchema} / 15 pts</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(healthScore.breakdown.structuredSchema / 15) * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500">Machine-readable Organization, WebSite, and FAQPage schemas.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200/80">
                  <div className="flex justify-between font-bold">
                    <span>5. Direct Answer Structure</span>
                    <span className="text-indigo-600">{healthScore.breakdown.contentStructure} / 10 pts</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(healthScore.breakdown.contentStructure / 10) * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500">Concise Answer-First FAQ formatting optimized for AI summary extraction.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200/80">
                  <div className="flex justify-between font-bold">
                    <span>6. Discrepancy Prevention & Consistency</span>
                    <span className="text-rose-600">{healthScore.breakdown.consistency} / 10 pts</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(healthScore.breakdown.consistency / 10) * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500">Absence of unreviewed facts or open critical audit issues.</p>
                </div>
              </div>
            </div>
          )}

          {/* AUDIT ISSUES LIST */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Audit Issues & Recommendations</h3>
                <p className="text-xs text-slate-500">Automated issues flagged by the AEO engine requiring action.</p>
              </div>
              <button
                onClick={handleRunAudit}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={14} />
                <span>Re-run Audit</span>
              </button>
            </div>

            {auditIssues.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/50 border border-emerald-200/60 rounded-xl text-emerald-800 text-xs space-y-2">
                <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
                <div className="font-bold text-sm">No Active AEO Audit Issues Found!</div>
                <p className="text-slate-600 max-w-md mx-auto">Your company knowledge graph and facts entity hub are fully optimized for search engine & AI crawler ingestion.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {auditIssues.map(issue => (
                  <div key={issue.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start gap-3">
                    {issue.severity === 'CRITICAL' ? (
                      <AlertTriangle size={18} className="text-rose-600 mt-0.5 shrink-0" />
                    ) : issue.severity === 'WARNING' ? (
                      <AlertTriangle size={18} className="text-amber-500 mt-0.5 shrink-0" />
                    ) : (
                      <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
                    )}

                    <div className="space-y-1 flex-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                          issue.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : issue.severity === 'WARNING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {issue.severity}
                        </span>
                        <span className="font-bold text-slate-800">{issue.category}</span>
                      </div>
                      <div className="font-semibold text-slate-900">{issue.issue}</div>
                      <div className="text-slate-600 text-[11px]"><span className="font-bold text-blue-700">Recommendation:</span> {issue.recommendation}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: COMPANY ENTITY IDENTITY */}
      {subTab === 'entity' && entity && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Official Company Entity Profile</h3>
              <p className="text-xs text-slate-500">Legal business entity facts used in Organization JSON-LD and AI Knowledge Graphs.</p>
            </div>
            <button
              onClick={handleSaveEntity}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Entity Metadata'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Legal Registered Name *</label>
              <input
                type="text"
                value={entity.legalName}
                onChange={e => setEntity({ ...entity, legalName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Trading / Brand Name *</label>
              <input
                type="text"
                value={entity.tradingName}
                onChange={e => setEntity({ ...entity, tradingName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Industry Sector</label>
              <input
                type="text"
                value={entity.industry}
                onChange={e => setEntity({ ...entity, industry: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Founded Year</label>
              <input
                type="number"
                value={entity.foundedYear}
                onChange={e => setEntity({ ...entity, foundedYear: parseInt(e.target.value) || 2022 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Headquarters Location</label>
              <input
                type="text"
                value={entity.headquarters}
                onChange={e => setEntity({ ...entity, headquarters: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Primary Country</label>
              <input
                type="text"
                value={entity.primaryCountry}
                onChange={e => setEntity({ ...entity, primaryCountry: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Contact Email</label>
              <input
                type="email"
                value={entity.email}
                onChange={e => setEntity({ ...entity, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Contact Telephone</label>
              <input
                type="text"
                value={entity.phone || ''}
                onChange={e => setEntity({ ...entity, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="font-bold text-slate-700">Canonical Website URL</label>
              <input
                type="text"
                value={entity.canonicalUrl}
                onChange={e => setEntity({ ...entity, canonicalUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="font-bold text-slate-700">Short Entity Bio (Answer-First format, max 250 chars)</label>
              <textarea
                rows={2}
                value={entity.shortDescription}
                onChange={e => setEntity({ ...entity, shortDescription: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="font-bold text-slate-700">Detailed Entity Overview</label>
              <textarea
                rows={4}
                value={entity.longDescription}
                onChange={e => setEntity({ ...entity, longDescription: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="font-bold text-slate-700">Authoritative Social & Directory Links (SameAs links, comma-separated)</label>
              <input
                type="text"
                value={entity.sameAs ? entity.sameAs.join(', ') : ''}
                onChange={e => setEntity({ ...entity, sameAs: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="https://github.com/ryzite, https://linkedin.com/company/ryzite"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
              />
              <p className="text-[11px] text-slate-500 mt-1">These sameAs links establish unambiguous entity disambiguation in Schema.org and Knowledge Graphs.</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: COMPANY FACTS CMS */}
      {subTab === 'facts' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Company Facts Knowledge Base</h3>
              <p className="text-xs text-slate-500">Answer-First factual claims stored in PostgreSQL. Only VERIFIED facts are emitted to public APIs & JSON-LD.</p>
            </div>
            <button
              onClick={() => {
                setEditingFact({
                  category: 'COMPANY',
                  claimType: 'FACTUAL',
                  question: '',
                  shortAnswer: '',
                  detailedAnswer: '',
                  verifiedStatus: 'VERIFIED',
                  status: 'PUBLISHED',
                  priority: 1,
                  displayOrder: 0
                });
                setFactModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
            >
              <Plus size={16} />
              <span>Add New Fact</span>
            </button>
          </div>

          {/* FILTERS BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search facts..."
                value={factSearch}
                onChange={e => setFactSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <select
              value={factCategoryFilter}
              onChange={e => setFactCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs"
            >
              <option value="ALL">All Categories</option>
              {['COMPANY', 'SERVICES', 'PRICING', 'LOCATIONS', 'CLIENTS', 'PROJECTS', 'TEAM', 'SECURITY', 'SUPPORT', 'CONTACT', 'POLICIES'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={factVerifiedFilter}
              onChange={e => setFactVerifiedFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs"
            >
              <option value="ALL">All Verification Statuses</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="UNVERIFIED">UNVERIFIED</option>
              <option value="REQUIRES_REVIEW">REQUIRES_REVIEW</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
          </div>

          {/* FACTS LIST TABLE / CARDS */}
          {filteredFacts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-200 rounded-xl">
              No company facts match your filter criteria. Click "Add New Fact" to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFacts.map(fact => (
                <div key={fact.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          fact.verifiedStatus === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fact.verifiedStatus === 'UNVERIFIED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {fact.verifiedStatus}
                        </span>

                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold">
                          {fact.category}
                        </span>

                        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-medium">
                          {fact.claimType}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{fact.question}</h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {fact.versions && fact.versions.length > 0 && (
                        <button
                          onClick={() => setVersionModalFact(fact)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Version Audit Log"
                        >
                          <History size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingFact(fact);
                          setFactModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteFact(fact.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1 text-slate-800">
                    <span className="font-bold text-blue-900 block text-[11px]">Direct Short Answer:</span>
                    <p className="leading-relaxed">{fact.shortAnswer}</p>
                  </div>

                  {fact.sourceUrl && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Link size={12} className="text-blue-600" />
                      <span>Source:</span>
                      <a href={fact.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-0.5">
                        {fact.sourceUrl} <ExternalLink size={10} />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: AEO FAQS */}
      {subTab === 'faqs' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">AEO Search & Machine FAQs</h3>
              <p className="text-xs text-slate-500">Direct Question & Answer pairs exported into Google FAQPage Schema.</p>
            </div>
            <button
              onClick={() => {
                setEditingFaq({ question: '', shortAnswer: '', detailedAnswer: '', displayOrder: 0, status: 'PUBLISHED' });
                setFaqModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Plus size={16} />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map(faq => (
              <div key={faq.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 text-sm">{faq.question}</h4>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingFaq(faq); setFaqModalOpen(true); }} className="p-1 hover:bg-slate-200 rounded">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => handleDeleteFaq(faq.id)} className="p-1 hover:bg-rose-100 text-rose-600 rounded">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <p className="text-slate-700 bg-white p-2.5 rounded border border-slate-200">{faq.shortAnswer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: TOPIC EXPERTISE */}
      {subTab === 'expertise' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Topic Expertise (knowsAbout Tags)</h3>
              <p className="text-xs text-slate-500">Core technical topics mapped to entity authority in Google Knowledge Graph.</p>
            </div>
            <button
              onClick={() => {
                setEditingExpertise({ topic: '', description: '', priority: 1, active: true });
                setExpertiseModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Plus size={16} />
              <span>Add Topic Expertise</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expertise.map(item => (
              <div key={item.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                    <Tag size={14} className="text-blue-600" />
                    {item.topic}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingExpertise(item); setExpertiseModalOpen(true); }} className="p-1 hover:bg-slate-200 rounded">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => handleDeleteExpertise(item.id)} className="p-1 hover:bg-rose-100 text-rose-600 rounded">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: PAGE SERP PREVIEW */}
      {subTab === 'serp' && renderSerpSection}

      {/* FACT CREATE / EDIT MODAL */}
      {factModalOpen && editingFact && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingFact.id ? 'Edit Company Fact' : 'Create New Company Fact'}
              </h3>
              <button onClick={() => setFactModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveFact} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Fact Question / Prompt *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., When was Ryzite founded?"
                  value={editingFact.question || ''}
                  onChange={e => setEditingFact({ ...editingFact, question: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Answer-First Short Answer (Concise factual summary) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g., Ryzite was founded in 2022 as a software engineering agency..."
                  value={editingFact.shortAnswer || ''}
                  onChange={e => setEditingFact({ ...editingFact, shortAnswer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailed Answer / Explanation</label>
                <textarea
                  rows={3}
                  value={editingFact.detailedAnswer || ''}
                  onChange={e => setEditingFact({ ...editingFact, detailedAnswer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Fact Category</label>
                  <select
                    value={editingFact.category || 'COMPANY'}
                    onChange={e => setEditingFact({ ...editingFact, category: e.target.value as FactCategory })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    {['COMPANY', 'SERVICES', 'PRICING', 'LOCATIONS', 'CLIENTS', 'PROJECTS', 'TEAM', 'SECURITY', 'SUPPORT', 'CONTACT', 'POLICIES'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Claim Classification</label>
                  <select
                    value={editingFact.claimType || 'FACTUAL'}
                    onChange={e => setEditingFact({ ...editingFact, claimType: e.target.value as ClaimType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    {['FACTUAL', 'MARKETING', 'ESTIMATE', 'TESTIMONIAL', 'CASE_STUDY_RESULT', 'INTERNAL'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Verified Status</label>
                  <select
                    value={editingFact.verifiedStatus || 'VERIFIED'}
                    onChange={e => setEditingFact({ ...editingFact, verifiedStatus: e.target.value as FactVerifiedStatus })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="VERIFIED">VERIFIED (Included in JSON-LD & Public API)</option>
                    <option value="UNVERIFIED">UNVERIFIED (Draft/Internal only)</option>
                    <option value="REQUIRES_REVIEW">REQUIRES_REVIEW</option>
                    <option value="EXPIRED">EXPIRED</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Publication Status</label>
                  <select
                    value={editingFact.status || 'PUBLISHED'}
                    onChange={e => setEditingFact({ ...editingFact, status: e.target.value as StatisticStatus })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="HIDDEN">HIDDEN</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Verifiable Source URL (External citation link)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={editingFact.sourceUrl || ''}
                  onChange={e => setEditingFact({ ...editingFact, sourceUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Evidence Note / Verification Details</label>
                <input
                  type="text"
                  placeholder="e.g. Verified from state incorporation filing documents..."
                  value={editingFact.evidenceNote || ''}
                  onChange={e => setEditingFact({ ...editingFact, evidenceNote: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFactModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Fact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERSION HISTORY AUDIT LOG MODAL */}
      {versionModalFact && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History size={18} className="text-blue-600" />
                <span>Version Audit Log History</span>
              </h3>
              <button onClick={() => setVersionModalFact(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
              <div className="font-bold text-slate-800 border-b pb-2">{versionModalFact.question}</div>
              {versionModalFact.versions && versionModalFact.versions.length > 0 ? (
                versionModalFact.versions.map(v => (
                  <div key={v.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Changed by: <strong className="text-slate-800">{v.changedBy}</strong></span>
                      <span>{new Date(v.createdAt).toLocaleString()}</span>
                    </div>
                    {v.reason && <div className="text-[11px] text-blue-700 font-semibold">Reason: {v.reason}</div>}
                  </div>
                ))
              ) : (
                <div className="text-slate-500">No historic revision versions recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {faqModalOpen && editingFaq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingFaq.id ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button onClick={() => setFaqModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Question *</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question || ''}
                  onChange={e => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Answer-First Concise Answer *</label>
                <textarea
                  rows={3}
                  required
                  value={editingFaq.shortAnswer || ''}
                  onChange={e => setEditingFaq({ ...editingFaq, shortAnswer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setFaqModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">{saving ? 'Saving...' : 'Save FAQ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPERTISE MODAL */}
      {expertiseModalOpen && editingExpertise && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingExpertise.id ? 'Edit Topic Expertise' : 'Add Topic Expertise'}
              </h3>
              <button onClick={() => setExpertiseModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExpertise} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Topic Name (knowsAbout entry) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 16 Server Components Architecture"
                  value={editingExpertise.topic || ''}
                  onChange={e => setEditingExpertise({ ...editingExpertise, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Topic Description</label>
                <textarea
                  rows={3}
                  value={editingExpertise.description || ''}
                  onChange={e => setEditingExpertise({ ...editingExpertise, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setExpertiseModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">{saving ? 'Saving...' : 'Save Topic'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
