import React, { useState } from 'react';
import { 
  Users, 
  Bike, 
  Route, 
  IndianRupee, 
  ShieldCheck, 
  ArrowLeft, 
  Check, 
  X, 
  AlertTriangle, 
  Sliders, 
  Power,
  RefreshCw,
  FileCode2,
  Lock,
  BarChart3,
  LineChart,
  TrendingUp,
  Car,
  Package,
  Upload,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';
import { INITIAL_ADMIN_METRICS, INITIAL_CAPTAINS } from '../data/mockData';
import { CaptainRequest } from '../types';
import { BharatMitraLogo } from './BharatMitraLogo';

interface AdminPanelScreenProps {
  onBackToHome: () => void;
  onBackToSplash: () => void;
  onOpenCodeViewer?: () => void;
  customLogo?: string | null;
  onUpdateLogo?: (logoUrl: string | null) => void;
}

export const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({
  onBackToHome,
  onBackToSplash,
  onOpenCodeViewer,
  customLogo = null,
  onUpdateLogo,
}) => {
  const [metrics, setMetrics] = useState(INITIAL_ADMIN_METRICS);
  const [captains, setCaptains] = useState<CaptainRequest[]>(INITIAL_CAPTAINS);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly'>('daily');
  const [chartView, setChartView] = useState<'bar' | 'graph'>('bar');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(6); // Default Sunday
  const [activeServices, setActiveServices] = useState({
    bike: true,
    auto: true,
    cab: true,
    parcel: true,
    rent_car: true,
    hire_driver: true,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Daily Revenue Stats for Current Week (Mon - Sun)
  const dailyEarningsData = [
    { label: 'Mon', transport: 48, rental: 22, total: 70, rides: 1420 },
    { label: 'Tue', transport: 56, rental: 25, total: 81, rides: 1650 },
    { label: 'Wed', transport: 68, rental: 30, total: 98, rides: 1980 },
    { label: 'Thu', transport: 74, rental: 34, total: 108, rides: 2150 },
    { label: 'Fri', transport: 92, rental: 45, total: 137, rides: 2840 },
    { label: 'Sat', transport: 110, rental: 58, total: 168, rides: 3420 },
    { label: 'Sun', transport: 122, rental: 65, total: 187, rides: 3890 },
  ];

  // Weekly Revenue Stats for the Month (Week 1 - Week 4)
  const weeklyEarningsData = [
    { label: 'Week 1', transport: 440, rental: 140, total: 580, rides: 11200 },
    { label: 'Week 2', transport: 490, rental: 155, total: 645, rides: 13100 },
    { label: 'Week 3', transport: 530, rental: 165, total: 695, rides: 14800 },
    { label: 'Week 4', transport: 570, rental: 179, total: 749, rides: 17450 },
  ];

  const currentDataset = chartPeriod === 'daily' ? dailyEarningsData : weeklyEarningsData;
  const maxDatasetRevenue = Math.max(...currentDataset.map(d => d.total));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleApproveCaptain = (id: string, name: string) => {
    setCaptains(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    setMetrics(prev => ({
      ...prev,
      activeCaptains: prev.activeCaptains + 1,
      pendingKyc: Math.max(0, prev.pendingKyc - 1),
    }));
    showToast(`Captain ${name} approved and activated!`);
  };

  const handleRejectCaptain = (id: string, name: string) => {
    setCaptains(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
    setMetrics(prev => ({
      ...prev,
      pendingKyc: Math.max(0, prev.pendingKyc - 1),
    }));
    showToast(`Captain request for ${name} rejected.`);
  };

  const toggleService = (key: keyof typeof activeServices, label: string) => {
    setActiveServices(prev => {
      const next = { ...prev, [key]: !prev[key] };
      showToast(`${label} is now ${next[key] ? 'ENABLED' : 'DISABLED'} regionally.`);
      return next;
    });
  };

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size exceeds 5MB limit. Please choose a smaller file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (onUpdateLogo) {
          onUpdateLogo(result);
        }
        try {
          localStorage.setItem('bharat_mitra_custom_logo', result);
        } catch (err) {
          console.warn('Could not save to localStorage', err);
        }
        showToast('✓ Dynamic logo updated! Instantly reflected on Splash and Header.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    if (onUpdateLogo) {
      onUpdateLogo(null);
    }
    try {
      localStorage.removeItem('bharat_mitra_custom_logo');
    } catch (err) {
      console.warn(err);
    }
    showToast('Reverted to official default Bharat Mitra emblem.');
  };

  const handleSampleLogoPreset = (presetName: string, iconSymbol: string) => {
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="40" fill="#0B1B3D"/><circle cx="100" cy="100" r="70" fill="#F58220" opacity="0.25"/><circle cx="100" cy="100" r="50" fill="#F58220"/><text x="100" y="115" font-size="44" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold">${iconSymbol}</text><text x="100" y="175" font-size="13" text-anchor="middle" fill="#0F8A3C" font-family="sans-serif" font-weight="900">${presetName}</text></svg>`;
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;
    if (onUpdateLogo) {
      onUpdateLogo(dataUrl);
    }
    try {
      localStorage.setItem('bharat_mitra_custom_logo', dataUrl);
    } catch (err) {
      console.warn(err);
    }
    showToast(`✓ Applied ${presetName} logo! Persisted to state.`);
  };

  return (
    <div className="w-full min-h-full bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Admin App Bar */}
      <div className="sticky top-0 z-30 bg-[#0B1B3D] border-b border-slate-700/80 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to App</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <h1 className="text-sm sm:text-base font-extrabold tracking-wide text-white">
                BHARAT MITRA • ADMIN OPS
              </h1>
            </div>
            <p className="text-[11px] text-amber-400 font-mono">
              Restricted Operations Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenCodeViewer && (
            <button
              onClick={onOpenCodeViewer}
              className="py-1 px-2.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-orange-500/30 transition-colors"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Flutter Code</span>
            </button>
          )}
          <button
            onClick={onBackToSplash}
            className="py-1 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-slate-300 transition-colors"
          >
            Lock / Splash
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Admin Scrollable Canvas */}
      <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-5xl mx-auto w-full">
        {/* Secret Authentication Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-emerald-300">
                Secret Access Verification Passed
              </p>
              <p className="text-[11px] text-emerald-400/80">
                Triggered via continuous 7-second logo hold gesture on Splash Screen.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block font-mono text-[10px] bg-emerald-900/60 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-700/50">
            SESSION: AUTH_OK_7S
          </span>
        </div>

        {/* 4 PRIMARY MANAGEMENT METRICS (REQUIRED) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Key Operational Metrics
            </h2>
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <RefreshCw className="w-3 h-3 text-slate-500 animate-spin" /> Live Sync
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Metric 1: Total Users */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Total Users</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-black text-white font-mono tracking-tight">
                  {metrics.totalUsers.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                  +1,420 registered today
                </p>
              </div>
            </div>

            {/* Metric 2: Active Captains */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Active Captains</span>
                <div className="p-2 rounded-xl bg-orange-500/10 text-[#FF9933]">
                  <Bike className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-black text-white font-mono tracking-tight">
                  {metrics.activeCaptains.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-amber-400 font-semibold mt-1">
                  Online across 14 clusters
                </p>
              </div>
            </div>

            {/* Metric 3: Total Rides */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Total Rides</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Route className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-black text-white font-mono tracking-tight">
                  {metrics.totalRides.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                  99.4% completion rate
                </p>
              </div>
            </div>

            {/* Metric 4: Total Earnings */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Gross Earnings</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-black text-white font-mono tracking-tight">
                  ₹{(metrics.totalEarnings / 10000000).toFixed(2)} Cr
                </p>
                <p className="text-[11px] text-purple-300 font-semibold mt-1">
                  Platform Commission: ₹42.8 L
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* VISUAL EARNINGS CHART & GRAPH (অ্যাডমিন প্যানেলে আর্নিং চার্ট) */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                {chartView === 'bar' ? (
                  <BarChart3 className="w-5 h-5" />
                ) : (
                  <LineChart className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Revenue Analytics & Visual Earnings {chartView === 'bar' ? 'Chart' : 'Graph'}</span>
                  <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                    আর্নিং চার্ট
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {chartPeriod === 'daily' ? 'Daily breakdown (Mon - Sun)' : 'Weekly trajectory (Month W1 - W4)'} • Transport vs Rentals
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Daily vs Weekly Toggle */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700/80 text-xs">
                <button
                  onClick={() => {
                    setChartPeriod('daily');
                    setActiveItemIndex(6); // Default Sunday
                  }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    chartPeriod === 'daily'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Daily (7 Days)
                </button>
                <button
                  onClick={() => {
                    setChartPeriod('weekly');
                    setActiveItemIndex(3); // Default Week 4
                  }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    chartPeriod === 'weekly'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Weekly (4 Weeks)
                </button>
              </div>

              {/* Bar vs Graph View Mode */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700/80 text-xs">
                <button
                  onClick={() => setChartView('bar')}
                  className={`px-2 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                    chartView === 'bar'
                      ? 'bg-[#FF9933] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Stacked Bar Chart"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Bars</span>
                </button>
                <button
                  onClick={() => setChartView('graph')}
                  className={`px-2 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                    chartView === 'graph'
                      ? 'bg-[#FF9933] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Line & Area Graph"
                >
                  <LineChart className="w-3.5 h-3.5" />
                  <span>Graph</span>
                </button>
              </div>
            </div>
          </div>

          {/* Revenue KPI Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-700/40 text-xs">
            <div>
              <span className="text-slate-400 text-[11px]">
                {chartPeriod === 'daily' ? 'Weekly Gross' : 'Monthly Gross'}
              </span>
              <p className="text-base font-black text-white font-mono">
                {chartPeriod === 'daily' ? '₹7,49,000' : '₹26,69,000'}
              </p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-bold mt-0.5">
                <TrendingUp className="w-3 h-3" /> +18.4% growth
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Transport Services</span>
              <p className="text-base font-black text-[#FF9933] font-mono">
                {chartPeriod === 'daily' ? '₹5,70,000' : '₹20,30,000'}
              </p>
              <span className="text-[10px] text-slate-400">76.1% share</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Car & Driver Rentals</span>
              <p className="text-base font-black text-emerald-400 font-mono">
                {chartPeriod === 'daily' ? '₹1,79,000' : '₹6,39,000'}
              </p>
              <span className="text-[10px] text-slate-400">23.9% share</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Completed Trips</span>
              <p className="text-base font-black text-blue-400 font-mono">
                {chartPeriod === 'daily' ? '17,450' : '56,550'}
              </p>
              <span className="text-[10px] text-slate-400">Avg ₹42.9 / trip</span>
            </div>
          </div>

          {/* Legend and Subtitle */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-300">
              {chartView === 'bar' ? 'Stacked Revenue Breakdown' : 'Trend Graph & Trajectory'} (₹ in Thousands)
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#FF9933]"></span>
                <span className="text-slate-300">Transport (Bike/Auto/Cab)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                <span className="text-slate-300">Rentals (Car/Driver)</span>
              </span>
              {chartView === 'graph' && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  <span className="text-slate-300">Total Revenue</span>
                </span>
              )}
            </div>
          </div>

          {/* VISUALIZATION CONTAINER: BAR CHART OR TREND GRAPH */}
          {chartView === 'bar' ? (
            /* STACKED BAR CHART */
            <div className="h-48 pt-6 pb-2 px-2 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-end justify-between gap-2 sm:gap-4 select-none">
              {currentDataset.map((item, idx) => {
                const isSelected = activeItemIndex === idx;
                const totalHeightPercent = Math.round((item.total / maxDatasetRevenue) * 100);
                const transportPercent = Math.round((item.transport / item.total) * 100);
                const rentalPercent = 100 - transportPercent;

                return (
                  <div
                    key={item.label}
                    onClick={() => setActiveItemIndex(idx)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  >
                    {/* Floating Value */}
                    <div className={`text-[10px] font-mono font-bold transition-all mb-1 ${
                      isSelected ? 'text-amber-300 scale-105' : 'text-slate-400 group-hover:text-white'
                    }`}>
                      ₹{item.total}k
                    </div>

                    {/* Stacked Bar Container */}
                    <div 
                      className={`w-full max-w-[48px] rounded-t-lg overflow-hidden flex flex-col justify-end transition-all ${
                        isSelected 
                          ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-900 shadow-lg' 
                          : 'opacity-85 hover:opacity-100'
                      }`}
                      style={{ height: `${Math.max(16, totalHeightPercent)}%` }}
                    >
                      {/* Rental segment (Green) */}
                      <div 
                        className="w-full bg-emerald-500 hover:bg-emerald-400 transition-colors"
                        style={{ height: `${rentalPercent}%` }}
                        title={`${item.label} Rentals: ₹${item.rental}k`}
                      />
                      {/* Transport segment (Saffron) */}
                      <div 
                        className="w-full bg-[#FF9933] hover:bg-[#ff8819] transition-colors"
                        style={{ height: `${transportPercent}%` }}
                        title={`${item.label} Transport: ₹${item.transport}k`}
                      />
                    </div>

                    {/* Label */}
                    <div className={`mt-2 text-[11px] font-bold tracking-wide transition-colors ${
                      isSelected ? 'text-purple-300 font-black' : 'text-slate-400'
                    }`}>
                      {item.label}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* VISUAL SVG TREND GRAPH */
            <div className="h-52 p-3 rounded-xl bg-slate-900/80 border border-slate-700/50 relative overflow-hidden select-none">
              <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="totalRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="30" y1="20" x2="490" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="30" y1="60" x2="490" y2="60" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="30" y1="100" x2="490" y2="100" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="30" y1="140" x2="490" y2="140" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />

                {/* Y-axis labels */}
                <text x="5" y="24" fill="#64748b" fontSize="9" fontFamily="monospace">₹{maxDatasetRevenue}k</text>
                <text x="5" y="64" fill="#64748b" fontSize="9" fontFamily="monospace">₹{Math.round(maxDatasetRevenue * 0.75)}k</text>
                <text x="5" y="104" fill="#64748b" fontSize="9" fontFamily="monospace">₹{Math.round(maxDatasetRevenue * 0.5)}k</text>
                <text x="5" y="144" fill="#64748b" fontSize="9" fontFamily="monospace">₹{Math.round(maxDatasetRevenue * 0.25)}k</text>

                {/* Compute curve points */}
                {(() => {
                  const points = currentDataset.map((d, i) => {
                    const x = 50 + (i / (currentDataset.length - 1)) * 420;
                    const y = 145 - (d.total / maxDatasetRevenue) * 125;
                    const yTrans = 145 - (d.transport / maxDatasetRevenue) * 125;
                    const yRental = 145 - (d.rental / maxDatasetRevenue) * 125;
                    return { x, y, yTrans, yRental, ...d };
                  });

                  const totalPathD = points.reduce((acc, p, i) => {
                    if (i === 0) return `M ${p.x} ${p.y}`;
                    const prev = points[i - 1];
                    const cx1 = prev.x + (p.x - prev.x) / 2;
                    const cx2 = prev.x + (p.x - prev.x) / 2;
                    return `${acc} C ${cx1} ${prev.y}, ${cx2} ${p.y}, ${p.x} ${p.y}`;
                  }, '');

                  const areaPathD = `${totalPathD} L ${points[points.length - 1].x} 145 L ${points[0].x} 145 Z`;

                  const transPathD = points.reduce((acc, p, i) => {
                    if (i === 0) return `M ${p.x} ${p.yTrans}`;
                    const prev = points[i - 1];
                    const cx = prev.x + (p.x - prev.x) / 2;
                    return `${acc} C ${cx} ${prev.yTrans}, ${cx} ${p.yTrans}, ${p.x} ${p.yTrans}`;
                  }, '');

                  const rentalPathD = points.reduce((acc, p, i) => {
                    if (i === 0) return `M ${p.x} ${p.yRental}`;
                    const prev = points[i - 1];
                    const cx = prev.x + (p.x - prev.x) / 2;
                    return `${acc} C ${cx} ${prev.yRental}, ${cx} ${p.yRental}, ${p.x} ${p.yRental}`;
                  }, '');

                  return (
                    <>
                      {/* Area Gradient fill */}
                      <path d={areaPathD} fill="url(#totalRevenueGrad)" />

                      {/* Transport Line (Saffron) */}
                      <path d={transPathD} fill="none" stroke="#FF9933" strokeWidth="2.5" strokeDasharray="4 2" />

                      {/* Rental Line (Green) */}
                      <path d={rentalPathD} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />

                      {/* Total Revenue Curve (Purple) */}
                      <path d={totalPathD} fill="none" stroke="#c084fc" strokeWidth="3.5" strokeLinecap="round" />

                      {/* Data point markers */}
                      {points.map((p, idx) => {
                        const isSelected = activeItemIndex === idx;
                        return (
                          <g key={p.label} onClick={() => setActiveItemIndex(idx)} className="cursor-pointer">
                            {isSelected && (
                              <circle cx={p.x} cy={p.y} r="10" fill="#a855f7" opacity="0.3" className="animate-ping" />
                            )}
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={isSelected ? 6 : 4.5}
                              fill={isSelected ? '#fde047' : '#c084fc'}
                              stroke="#0f172a"
                              strokeWidth="2"
                            />
                            {/* X-axis Label */}
                            <text
                              x={p.x}
                              y="165"
                              textAnchor="middle"
                              fill={isSelected ? '#c084fc' : '#94a3b8'}
                              fontSize={isSelected ? '11' : '10'}
                              fontWeight={isSelected ? 'bold' : 'normal'}
                            >
                              {p.label}
                            </text>
                            {/* Value label */}
                            <text
                              x={p.x}
                              y={p.y - 10}
                              textAnchor="middle"
                              fill={isSelected ? '#fde047' : '#e2e8f0'}
                              fontSize="9"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              ₹{p.total}k
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>
          )}

          {/* Selected Item Drilldown Details */}
          {activeItemIndex !== null && currentDataset[activeItemIndex] && (
            <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping"></div>
                <span className="font-bold text-white">
                  Selected {chartPeriod === 'daily' ? 'Day' : 'Period'}: {currentDataset[activeItemIndex].label}
                </span>
                <span className="text-slate-400">
                  (Total Revenue: <strong className="text-amber-300 font-mono">₹{currentDataset[activeItemIndex].total * 1000}</strong>)
                </span>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="text-[#FF9933]">
                  Mobility: ₹{currentDataset[activeItemIndex].transport * 1000}
                </span>
                <span className="text-emerald-400">
                  Rentals: ₹{currentDataset[activeItemIndex].rental * 1000}
                </span>
                <span className="text-blue-300">
                  Trips: {currentDataset[activeItemIndex].rides.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Controls: Surge Pricing & Service Dispatch Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Surge & Fuel Rate Tuning */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FF9933]" />
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-300">
                  Dynamic Fare & Surge Multiplier
                </h3>
              </div>
              <span className="text-xs font-black font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                {surgeMultiplier.toFixed(1)}x
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Apply localized multiplier during heavy rains, mandi festival rushes, or fuel price revisions.
            </p>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={surgeMultiplier}
              onChange={(e) => {
                setSurgeMultiplier(parseFloat(e.target.value));
                showToast(`Regional surge adjusted to ${parseFloat(e.target.value).toFixed(1)}x`);
              }}
              className="w-full accent-[#FF9933] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>1.0x (Standard)</span>
              <span>1.5x (Peak Rush)</span>
              <span>2.5x (Emergency Max)</span>
            </div>
          </div>

          {/* Regional Service Toggles */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Power className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-300">
                Cluster Dispatch Toggles
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Instantly enable or pause specific mobility branches per district regulation:
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'bike', label: 'Bike Taxi' },
                { id: 'auto', label: 'Auto' },
                { id: 'cab', label: 'Cab Ride' },
                { id: 'parcel', label: 'Parcel' },
                { id: 'rent_car', label: 'Car Rental' },
                { id: 'hire_driver', label: 'Hire Driver' },
              ].map(s => {
                const isEnabled = activeServices[s.id as keyof typeof activeServices];
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleService(s.id as keyof typeof activeServices, s.label)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold transition-all text-center ${
                      isEnabled
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="block text-[9px] font-mono mt-0.5 opacity-80">
                      {isEnabled ? '● Active' : '○ Paused'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Logo Management Section (লোগো ব্যবস্থাপনা) */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-[#FF9933] flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-white flex items-center gap-2">
                  <span>Dynamic Logo & Brand Identity</span>
                  <span className="text-[10px] font-mono bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full border border-orange-500/30">
                    লোগো আপলোড
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Select and persist custom logo from device storage; instantly updates Splash Screen and Home Header.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                customLogo ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
              }`}>
                {customLogo ? 'Custom Logo Active' : 'Default Emblem Active'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-900/90 border border-slate-700/70 rounded-xl flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Logo Preview Box */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 p-2 flex items-center justify-center overflow-hidden shadow-inner shrink-0 relative group">
                {customLogo ? (
                  <img
                    src={customLogo}
                    alt="Custom App Logo"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <BharatMitraLogo size="sm" showText={false} />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">
                  {customLogo ? 'Active Custom Brand Asset' : 'Default Official Emblem (India Map + Handshake)'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {customLogo ? 'Source: Device Storage / Base64 Data' : 'Source: SVG / assets/images/logo.png'}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono">
                  State: Persisted to SharedPreferences & LocalStorage
                </p>
              </div>
            </div>

            {/* Actions: Upload & Reset */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 md:flex-none py-2 px-3.5 rounded-xl bg-[#FF9933] hover:bg-[#ff8819] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Logo</span>
              </button>

              {customLogo && (
                <button
                  type="button"
                  onClick={handleResetLogo}
                  className="flex-1 md:flex-none py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Presets & Flutter Implementation Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-400 border-t border-slate-700/60">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Quick Test Presets:</span>
              <button
                onClick={() => handleSampleLogoPreset('Express Mobility', '🚀')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-[10px] font-mono transition-colors"
              >
                Preset 1 (Rocket)
              </button>
              <button
                onClick={() => handleSampleLogoPreset('Green Fleet', '⚡')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 text-[10px] font-mono transition-colors"
              >
                Preset 2 (Volt)
              </button>
            </div>
            <p className="font-mono text-slate-500">
              Flutter Engine: image_picker + SharedPreferences
            </p>
          </div>
        </div>

        {/* Captain KYC & Vehicle Approval Queue */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-300">
                Captain Onboarding Verification Queue ({metrics.pendingKyc} Pending)
              </h3>
            </div>
          </div>

          <div className="space-y-2.5">
            {captains.map(c => (
              <div
                key={c.id}
                className="p-3.5 bg-slate-900/80 border border-slate-700/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{c.name}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                      {c.city}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-0.5">
                    Service: <span className="text-slate-200 font-semibold">{c.service}</span> · Plate: <span className="font-mono text-amber-300">{c.vehicleModel}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    DL: {c.dlNumber} · {c.date}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {c.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApproveCaptain(c.id, c.name)}
                        className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve KYC</span>
                      </button>
                      <button
                        onClick={() => handleRejectCaptain(c.id, c.name)}
                        className="py-1.5 px-2.5 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-rose-300 border border-rose-700/50 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-lg font-bold font-mono text-[11px] ${
                      c.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {c.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SOS Emergency Hotline Monitor */}
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-rose-200">
                24/7 Safety Command & Police SOS Line
              </h4>
              <p className="text-slate-400 text-[11px]">
                0 active distress alarms across north-west clusters. Emergency call center ready.
              </p>
            </div>
          </div>
          <button
            onClick={() => showToast('SOS Diagnostics: All satellite emergency channels online.')}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0"
          >
            Run Diagnostic
          </button>
        </div>

        {/* Navigation Action Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            Bharat Mitra Regional Administrative Dashboard • Confidential
          </p>
          <div className="flex gap-2">
            <button
              onClick={onBackToHome}
              className="py-2 px-4 rounded-xl bg-[#FF9933] hover:bg-[#ff8819] text-white font-bold transition-all shadow-md"
            >
              Back to Home Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
