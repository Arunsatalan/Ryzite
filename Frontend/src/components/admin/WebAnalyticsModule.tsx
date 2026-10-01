'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  Eye,
  MousePointerClick,
  Send,
  TrendingUp,
  Clock,
  Globe,
  Layers,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Smartphone,
  Monitor,
  FileCode,
  ShieldCheck,
  Radio,
  BarChart3,
  Sliders,
  ExternalLink,
  Info,
  Server,
  Terminal,
  Database
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type DateRangeOption = 'TODAY' | '7D' | '30D' | '90D';

export const WebAnalyticsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'realtime' | 'acquisition' | 'pages' | 'ctas' | 'entities' | 'vitals' | 'errors' | 'integrations' | 'settings'
  >('overview');

  const [dateRange, setDateRange] = useState<DateRangeOption>('30D');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Analytics Data States
  const [overview, setOverview] = useState<any>(null);
  const [realtime, setRealtime] = useState<any>(null);
  const [pagesData, setPagesData] = useState<any>(null);
  const [acquisitionData, setAcquisitionData] = useState<any>(null);
  const [ctaData, setCtaData] = useState<any>(null);
  const [vitalsData, setVitalsData] = useState<any>(null);
  const [errorsData, setErrorsData] = useState<any[]>([]);
  const [settingsData, setSettingsData] = useState<any>(null);

  // Helper Toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Helper Date Calculator
  const getDatesForRange = (range: DateRangeOption) => {
    const end = new Date();
    let days = 30;
    if (range === 'TODAY') days = 1;
    if (range === '7D') days = 7;
    if (range === '90D') days = 90;
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  };

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('ryzite_admin_token') || 'demo-admin-token';
      const headers = { Authorization: `Bearer ${token}` };
      const { startDate, endDate } = getDatesForRange(dateRange);

      const [
        overviewRes,
        realtimeRes,
        pagesRes,
        acquisitionRes,
        ctasRes,
        vitalsRes,
        errorsRes,
        settingsRes
      ] = await Promise.all([
        fetch(`${API_BASE}/api/admin/analytics/overview?startDate=${startDate}&endDate=${endDate}`, { headers }),
        fetch(`${API_BASE}/api/admin/analytics/realtime`, { headers }),
        fetch(`${API_BASE}/api/admin/analytics/pages?startDate=${startDate}&endDate=${endDate}`, { headers }),
        fetch(`${API_BASE}/api/admin/analytics/acquisition?startDate=${startDate}&endDate=${endDate}`, { headers }),
        fetch(`${API_BASE}/api/admin/analytics/ctas?startDate=${startDate}&endDate=${endDate}`, { headers }),
        fetch(`${API_BASE}/api/admin/analytics/web-vitals?startDate=${startDate}&endDate=${endDate}`, { headers }),
        fetch(`${API_BASE}/api/admin/analytics/404`, { headers }),
        fetch(`${API_BASE}/api/admin/analytics/settings`, { headers })
      ]);

      const [ovJson, rtJson, pgJson, acqJson, ctaJson, vitJson, errJson, setJson] = await Promise.all([
        overviewRes.json(),
        realtimeRes.json(),
        pagesRes.json(),
        acquisitionRes.json(),
        ctasRes.json(),
        vitalsRes.json(),
        errorsRes.json(),
        settingsRes.json()
      ]);

      if (ovJson.success) setOverview(ovJson.data);
      if (rtJson.success) setRealtime(rtJson.data);
      if (pgJson.success) setPagesData(pgJson.data);
      if (acqJson.success) setAcquisitionData(acqJson.data);
      if (ctaJson.success) setCtaData(ctaJson.data);
      if (vitJson.success) setVitalsData(vitJson.data);
      if (errJson.success) setErrorsData(errJson.data || []);
      if (setJson.success) setSettingsData(setJson.data);
    } catch (err: any) {
      console.warn('[ADMIN ANALYTICS FETCH ERROR]', err.message);
      showToast('Failed to load live analytics data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  // Realtime polling ticker (every 15s)
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('ryzite_admin_token') || 'demo-admin-token';
      fetch(`${API_BASE}/api/admin/analytics/realtime`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(json => { if (json.success) setRealtime(json.data); })
        .catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Export CSV Handler
  const handleExportCsv = () => {
    const token = localStorage.getItem('ryzite_admin_token') || 'demo-admin-token';
    const { startDate, endDate } = getDatesForRange(dateRange);
    window.open(`${API_BASE}/api/admin/analytics/export?startDate=${startDate}&endDate=${endDate}&token=${token}`, '_blank');
  };

  // Source Badge Component
  const SourceBadge = ({ source }: { source: string }) => {
    const getBadgeStyle = () => {
      if (source === 'FIRST_PARTY') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      if (source === 'GA4') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      if (source === 'SEARCH_CONSOLE') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      if (source === 'WEB_VITALS') return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      return 'bg-slate-800 text-slate-400 border-slate-700';
    };
    return (
      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getBadgeStyle()}`}>
        Source: {source}
      </span>
    );
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[999999] px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl border flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald-950 border-emerald-800 text-emerald-200' : 'bg-rose-950 border-rose-800 text-rose-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* HEADER CONTROLS BAR */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-500 animate-pulse" />
              <span>Web Analytics & Conversion Intelligence</span>
            </h1>
            <SourceBadge source="FIRST_PARTY" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time first-party event tracking, user journeys, CTA funnels, and Core Web Vitals stored in PostgreSQL.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1">
            {(['TODAY', '7D', '30D', '90D'] as DateRangeOption[]).map(r => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  dateRange === r ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'TODAY' ? 'Today' : r}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setRefreshing(true); fetchDashboardData(); }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* LIVE NOW BANNER */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/20 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30">
            <Radio className="w-6 h-6 text-blue-400 animate-pulse" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">LIVE NOW</span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">Realtime Engine</span>
            </div>
            <div className="text-3xl font-black text-white mt-0.5">
              {realtime?.activeVisitors ?? 0} <span className="text-sm font-semibold text-slate-300">Active Visitors</span>
            </div>
          </div>
        </div>

        {/* Current Active Page Distribution */}
        <div className="flex items-center gap-3 overflow-x-auto max-w-xl py-1">
          {realtime?.currentPageDistribution && realtime.currentPageDistribution.length > 0 ? (
            realtime.currentPageDistribution.map((item: any) => (
              <div key={item.page} className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0 text-xs">
                <span className="font-mono text-blue-400">{item.page}</span>
                <span className="ml-2 font-bold text-white bg-blue-500/20 px-1.5 py-0.5 rounded border border-blue-500/30">{item.activeVisitors}</span>
              </div>
            ))
          ) : (
            <span className="text-xs text-slate-500 italic">No active page sessions in last 5 minutes. Visit the website to see live activity.</span>
          )}
        </div>
      </div>

      {/* SUB NAVIGATION TABS */}
      <div className="flex border-b border-slate-800 overflow-x-auto bg-slate-900/40 rounded-2xl p-1.5 gap-1">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: Activity },
          { id: 'realtime', label: 'Realtime Stream', icon: Radio },
          { id: 'acquisition', label: 'Traffic Sources & UTM', icon: Globe },
          { id: 'pages', label: 'Pages & Entry Points', icon: FileCode },
          { id: 'ctas', label: 'CTA & Conversion Funnel', icon: MousePointerClick },
          { id: 'vitals', label: 'Web Vitals Performance', icon: Zap },
          { id: 'errors', label: '404 Broken URLs', icon: AlertTriangle },
          { id: 'integrations', label: 'GA4 & Search Console', icon: Server },
          { id: 'settings', label: 'Settings & Retention', icon: Sliders }
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* MAIN KPI CARDS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: Page Views */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Page Views</span>
                <Eye className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-black text-white">{overview?.kpis?.pageViews?.value?.toLocaleString() ?? 0}</div>
                {overview?.kpis?.pageViews?.change !== undefined && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    overview.kpis.pageViews.change >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {overview.kpis.pageViews.change >= 0 ? '+' : ''}{overview.kpis.pageViews.change}%
                  </span>
                )}
              </div>
              <SourceBadge source="FIRST_PARTY" />
            </div>

            {/* Card 2: Unique Visitors */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unique Visitors</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-black text-white">{overview?.kpis?.uniqueVisitors?.value?.toLocaleString() ?? 0}</div>
                {overview?.kpis?.uniqueVisitors?.change !== undefined && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    overview.kpis.uniqueVisitors.change >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {overview.kpis.uniqueVisitors.change >= 0 ? '+' : ''}{overview.kpis.uniqueVisitors.change}%
                  </span>
                )}
              </div>
              <SourceBadge source="FIRST_PARTY" />
            </div>

            {/* Card 3: Sessions */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sessions</span>
                <Globe className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-black text-white">{overview?.kpis?.sessions?.value?.toLocaleString() ?? 0}</div>
                <span className="text-xs font-mono text-slate-400">{overview?.kpis?.pagesPerSession?.value ?? 1} pages/sess</span>
              </div>
              <SourceBadge source="FIRST_PARTY" />
            </div>

            {/* Card 4: CRM Leads Generated */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CRM Leads Generated</span>
                <Send className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-black text-white">{overview?.kpis?.leads?.value?.toLocaleString() ?? 0}</div>
                <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {overview?.kpis?.leadConversionRate?.value ?? 0}% Conv
                </span>
              </div>
              <SourceBadge source="FIRST_PARTY" />
            </div>
          </div>

          {/* TIME SERIES TRAFFIC CHART VISUALIZER */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Daily Traffic & Event Trend</h3>
                <p className="text-xs text-slate-400">Page Views vs Unique Visitors across the selected time period</p>
              </div>
              <SourceBadge source="FIRST_PARTY" />
            </div>

            {overview?.timeSeries && overview.timeSeries.length > 0 ? (
              <div className="space-y-3 pt-2">
                <div className="h-48 flex items-end justify-between gap-1 border-b border-slate-800 pb-2">
                  {overview.timeSeries.map((d: any) => {
                    const max = Math.max(...overview.timeSeries.map((t: any) => t.pageViews)) || 1;
                    const heightPercent = Math.max(10, Math.round((d.pageViews / max) * 100));
                    return (
                      <div key={d.date} className="flex-1 flex flex-col items-center group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[10px] font-mono px-2 py-1 rounded border border-slate-800 whitespace-nowrap z-10 pointer-events-none">
                          {d.date}: {d.pageViews} Views ({d.uniqueVisitors} Visitors)
                        </div>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full max-w-[24px] bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-md group-hover:from-blue-500 group-hover:to-cyan-300 transition-all"
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>{overview.timeSeries[0]?.date}</span>
                  <span>{overview.timeSeries[overview.timeSeries.length - 1]?.date}</span>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl text-xs">
                No time-series data collected for this date range yet. Visit the website to generate analytics events.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: REALTIME STREAM */}
      {activeTab === 'realtime' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
                <span>Realtime Activity Stream</span>
              </h3>
              <p className="text-xs text-slate-400">Live non-blocking first-party events captured within the last 5 minutes</p>
            </div>
            <SourceBadge source="FIRST_PARTY" />
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Event Name</th>
                  <th className="p-3">Page Path</th>
                  <th className="p-3">Device</th>
                  <th className="p-3">Visitor Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {realtime?.recentEvents && realtime.recentEvents.length > 0 ? (
                  realtime.recentEvents.map((evt: any) => (
                    <tr key={evt.id} className="hover:bg-slate-800/40">
                      <td className="p-3 text-slate-400">{new Date(evt.occurredAt).toISOString().slice(11, 19)} UTC</td>
                      <td className="p-3">
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold">
                          {evt.eventName}
                        </span>
                      </td>
                      <td className="p-3 text-white font-sans">{evt.pagePath}</td>
                      <td className="p-3 text-slate-400 capitalize">{evt.deviceType}</td>
                      <td className="p-3 text-slate-500">{evt.visitorId}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 italic font-sans">
                      No live events recorded in the last 5 minutes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ACQUISITION & TRAFFIC SOURCES */}
      {activeTab === 'acquisition' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Traffic Acquisition Channels</h3>
              <p className="text-xs text-slate-400">Automated referrer classification and UTM parameter tracking</p>
            </div>
            <SourceBadge source="FIRST_PARTY" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acquisitionData?.trafficSources && acquisitionData.trafficSources.length > 0 ? (
              acquisitionData.trafficSources.map((src: any) => (
                <div key={src.channel} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm">{src.channel}</span>
                    <div className="text-xs text-slate-400 mt-0.5">{src.visitors} Unique Visitors</div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-blue-400">{src.percentage}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl text-xs">
                No traffic acquisition data recorded for this period yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PAGES & LANDING PAGES */}
      {activeTab === 'pages' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Top Performing Content & Landing Pages</h3>
              <p className="text-xs text-slate-400">Page views, unique visitors, CTA clicks, and conversion rates per route</p>
            </div>
            <SourceBadge source="FIRST_PARTY" />
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Page Path</th>
                  <th className="p-3 text-right">Page Views</th>
                  <th className="p-3 text-right">Unique Visitors</th>
                  <th className="p-3 text-right">CTA Clicks</th>
                  <th className="p-3 text-right">CTA CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {pagesData?.topPages && pagesData.topPages.length > 0 ? (
                  pagesData.topPages.map((p: any, idx: number) => (
                    <tr key={p.pagePath} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-slate-500 font-bold">#{idx + 1}</td>
                      <td className="p-3 font-semibold text-white">{p.pagePath}</td>
                      <td className="p-3 text-right font-mono font-bold text-blue-400">{p.pageViews?.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-300">{p.uniqueVisitors?.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-indigo-300">{p.ctaClicks?.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">{p.ctaCtr}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                      No page view data available for this range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CTA & CONVERSION FUNNEL */}
      {activeTab === 'ctas' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">CTA Conversion Engine & Funnel</h3>
              <p className="text-xs text-slate-400">Integrated tracking from CTA impression to CRM lead creation</p>
            </div>
            <SourceBadge source="FIRST_PARTY" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Impressions</span>
              <div className="text-2xl font-black text-white mt-1">{ctaData?.impressions?.toLocaleString() ?? 0}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Clicks</span>
              <div className="text-2xl font-black text-indigo-400 mt-1">{ctaData?.clicks?.toLocaleString() ?? 0}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Contact Starts</span>
              <div className="text-2xl font-black text-purple-400 mt-1">{ctaData?.contactStarts?.toLocaleString() ?? 0}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">CRM Leads</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">{ctaData?.leads?.toLocaleString() ?? 0}</div>
            </div>
          </div>

          {/* Funnel Visualizer */}
          {ctaData?.funnel && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Multi-Step Conversion Funnel</h4>
              <div className="space-y-2">
                {ctaData.funnel.map((step: any, idx: number) => (
                  <div key={step.step} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                      <span className="font-semibold text-white text-sm">{step.step}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-base font-extrabold text-blue-400 font-mono">{step.count?.toLocaleString()}</span>
                      {idx > 0 && <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">-{step.dropoff}% Drop</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: WEB VITALS PERFORMANCE */}
      {activeTab === 'vitals' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <span>Real User Web Vitals Performance</span>
              </h3>
              <p className="text-xs text-slate-400">Actual field measurements from real visitor browser sessions</p>
            </div>
            <SourceBadge source="WEB_VITALS" />
          </div>

          {vitalsData?.hasData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(vitalsData.metrics).map(([metric, data]: [string, any]) => {
                if (!data) return null;
                return (
                  <div key={metric} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-white">{metric}</span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {data.goodPercentage}% Good
                      </span>
                    </div>
                    <div className="text-3xl font-black text-blue-400 font-mono">{data.avgValue} <span className="text-xs font-normal text-slate-400">{metric === 'CLS' ? 'score' : 'ms'}</span></div>
                    <div className="text-[11px] text-slate-400">Based on {data.sampleCount} real user measurements</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 border border-dashed border-slate-800 rounded-2xl space-y-2">
              <Zap className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold">Insufficient Real-User Web Vitals Data</p>
              <p className="text-xs text-slate-500">Visit pages on the live website to begin capturing field LCP, FCP, and TTFB metrics.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: 404 BROKEN URL MONITOR */}
      {activeTab === 'errors' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>404 Broken URL Monitor</span>
              </h3>
              <p className="text-xs text-slate-400">Tracks broken page requests and referring URLs to repair broken links</p>
            </div>
            <SourceBadge source="FIRST_PARTY" />
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Broken Page URL</th>
                  <th className="p-3 text-right">Hit Count</th>
                  <th className="p-3">Referrer URL</th>
                  <th className="p-3 text-right">Last Occurred</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {errorsData && errorsData.length > 0 ? (
                  errorsData.map((err: any) => (
                    <tr key={err.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-rose-400">{err.url}</td>
                      <td className="p-3 text-right font-bold text-white">{err.hitCount}</td>
                      <td className="p-3 text-slate-400 truncate max-w-xs">{err.referrer || 'Direct'}</td>
                      <td className="p-3 text-right text-slate-500">{new Date(err.lastSeen).toISOString().slice(0, 10)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500 italic font-sans">
                      Zero 404 broken URL errors logged. Your site links are operating cleanly!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: EXTERNAL INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GA4 Integration Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Google Analytics 4 (GA4)</h3>
              <SourceBadge source="GA4" />
            </div>
            <p className="text-xs text-slate-400">Connect Google Analytics Data API to ingest official GA4 pageviews and traffic sources.</p>
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-center gap-3">
              <Info className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{settingsData?.ga4Enabled ? 'GA4 Integration Configured' : 'GA4 Not Connected — Configure GA4 Property ID in Analytics Settings to sync.'}</span>
            </div>
          </div>

          {/* Search Console Integration Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Google Search Console</h3>
              <SourceBadge source="SEARCH_CONSOLE" />
            </div>
            <p className="text-xs text-slate-400">Sync search queries, organic impressions, clicks, CTR, and average SERP positions.</p>
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-3">
              <Info className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{settingsData?.searchConsoleEnabled ? 'Search Console Connected' : 'Search Console Not Connected — Enable Search Console integration in Analytics Settings.'}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: SETTINGS & RETENTION CONTROLS */}
      {activeTab === 'settings' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Analytics Engine Configuration & Data Retention</h3>
              <p className="text-xs text-slate-400">Configure event ingestion toggles and raw event purge policy</p>
            </div>
            <SourceBadge source="FIRST_PARTY" />
          </div>

          <div className="space-y-4 max-w-2xl">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white text-sm">First-Party Event Tracking</span>
                <p className="text-xs text-slate-400">Collect non-blocking events in PostgreSQL</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">ENABLED</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white text-sm">Raw Event Retention Policy</span>
                <p className="text-xs text-slate-400">Automatic scheduled purge threshold</p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">90 DAYS</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
