import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { healthApi } from '../api/client.js';
import { getRecentInvestigations, formatRelativeTime } from '../utils/sessionHistory.js';
import RiskBadge from '../components/RiskBadge.jsx';
import {
  SearchIcon,
  CircularTransfersIcon,
  MonitorIcon,
  SharedPhonesIcon,
  HomeIcon,
  SmurfingIcon,
  NetworkIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from '../components/Icons.jsx';

export default function Dashboard() {
  const [searchId, setSearchId] = useState('');
  const [recentList, setRecentList] = useState([]);
  const [healthStatus, setHealthStatus] = useState({
    database: 'connected',
    api: 'healthy',
    lastChecked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    loading: false,
  });

  const navigate = useNavigate();

  // Load session history and setup reactive listener
  useEffect(() => {
    const updateList = () => {
      setRecentList(getRecentInvestigations());
    };
    updateList();

    window.addEventListener('fraudnet_history_updated', updateList);
    return () => window.removeEventListener('fraudnet_history_updated', updateList);
  }, []);

  // Fetch initial health check
  useEffect(() => {
    async function loadHealth() {
      try {
        const res = await healthApi.checkHealth();
        setHealthStatus({
          database: res.database === 'connected' ? 'connected' : 'disconnected',
          api: res.status === 'healthy' ? 'healthy' : 'degraded',
          lastChecked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          loading: false,
        });
      } catch {
        setHealthStatus(prev => ({ ...prev, database: 'unavailable', api: 'unavailable', loading: false }));
      }
    }
    loadHealth();
  }, []);

  const handleRefreshHealth = async () => {
    setHealthStatus(prev => ({ ...prev, loading: true }));
    try {
      const res = await healthApi.checkHealth();
      setHealthStatus({
        database: res.database === 'connected' ? 'connected' : 'disconnected',
        api: res.status === 'healthy' ? 'healthy' : 'degraded',
        lastChecked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        loading: false,
      });
    } catch {
      setHealthStatus(prev => ({ ...prev, database: 'unavailable', api: 'unavailable', loading: false }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchId.trim();
    if (trimmed) {
      navigate(`/investigate/${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn select-none">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#111827] tracking-tight">
          Dashboard
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-0.5 font-sans-ui">
          Overview of fraud network intelligence
        </p>
      </div>

      {/* 1. Investigate an Account Hero Search Box */}
      <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3 text-left">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              Investigate an Account
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-lg">
              Search any account ID to analyze relationships, detect fraud patterns and calculate rule-based risk score.
            </p>

            <form onSubmit={handleSearch} className="pt-2 flex items-center gap-2.5 max-w-md">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <SearchIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter Account ID (e.g., ACC-010)"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2DDD5] rounded-xl text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#0E4D45] focus:ring-1 focus:ring-[#0E4D45] transition"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0E4D45] hover:bg-[#0B3B34] text-white text-sm font-semibold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <span>Investigate</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Decorative Graphic */}
          <div className="hidden lg:flex lg:col-span-5 items-center justify-end pr-4 pointer-events-none opacity-85">
            <div className="relative flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#E6F4F1] border border-[#BDE3DC] text-[#0E4D45]">
                <SearchIcon className="w-8 h-8" />
              </div>
              <div className="w-8 h-0.5 border-t border-dashed border-[#CBD5E1]" />
              <div className="p-3 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706]">
                <NetworkIcon className="w-8 h-8" />
              </div>
              <div className="w-8 h-0.5 border-t border-dashed border-[#CBD5E1]" />
              <div className="p-3 rounded-2xl bg-[#0E4D45] text-white">
                <ShieldCheckIcon className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Detection Patterns Row */}
      <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            Detection Patterns
          </h2>
          <p className="text-stone-500 text-xs mt-0.5">
            Our system detects the following five fraud patterns on demand.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Circular Transfer */}
          <Link
            to="/patterns"
            className="p-4 rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] hover:bg-white hover:border-[#0E4D45]/40 hover:shadow-xs transition group text-left flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <CircularTransfersIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-stone-900">Circular Transfer</h3>
              <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                Detect circular transactions between accounts.
              </p>
            </div>
          </Link>

          {/* Shared Device */}
          <Link
            to="/patterns"
            className="p-4 rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] hover:bg-white hover:border-[#0E4D45]/40 hover:shadow-xs transition group text-left flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-[#EAE5DC] text-[#D97706] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MonitorIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-stone-900">Shared Device</h3>
              <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                Identify accounts using the same device.
              </p>
            </div>
          </Link>

          {/* Shared Phone */}
          <Link
            to="/patterns"
            className="p-4 rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] hover:bg-white hover:border-[#0E4D45]/40 hover:shadow-xs transition group text-left flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-[#EAE5DC] text-[#0D9488] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <SharedPhonesIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-stone-900">Shared Phone</h3>
              <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                Find accounts linked to the same phone number.
              </p>
            </div>
          </Link>

          {/* Shared Address */}
          <Link
            to="/patterns"
            className="p-4 rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] hover:bg-white hover:border-[#0E4D45]/40 hover:shadow-xs transition group text-left flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <HomeIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-stone-900">Shared Address</h3>
              <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                Detect accounts sharing the same address.
              </p>
            </div>
          </Link>

          {/* Fan-in / Smurfing */}
          <Link
            to="/patterns"
            className="p-4 rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] hover:bg-white hover:border-[#0E4D45]/40 hover:shadow-xs transition group text-left flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <SmurfingIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-stone-900">Fan-in / Smurfing</h3>
              <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                Identify fan-in or smurfing transaction patterns.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* 3. Two Column: Graph Intelligence Preview & Investigation Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Graph Intelligence Preview */}
        <div className="lg:col-span-6 bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 text-left">
              Graph Intelligence Preview
            </h2>
            <p className="text-stone-500 text-xs mt-0.5 text-left">
              Visual representation of how entities are connected in the network.
            </p>
          </div>

          {/* Conceptual Static Diagram */}
          <div className="my-6 py-4 flex items-center justify-center">
            <svg viewBox="0 0 400 180" className="w-full max-w-[360px]" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Central Target Account */}
              <circle cx="200" cy="90" r="22" fill="#0E4D45" />
              <text x="200" y="94" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Account</text>

              {/* Related Person Node */}
              <circle cx="70" cy="50" r="18" fill="#E6F4F1" stroke="#BDE3DC" strokeWidth="1.5" />
              <text x="70" y="53" textAnchor="middle" fill="#0E4D45" fontSize="8" fontWeight="bold">Person</text>
              <line x1="88" y1="56" x2="180" y2="82" stroke="#CBD5E1" strokeWidth="1.2" />
              <text x="130" y="65" textAnchor="middle" fill="#64748B" fontSize="7">OWNS</text>

              {/* Related Device Node */}
              <circle cx="70" cy="130" r="18" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.5" />
              <text x="70" y="133" textAnchor="middle" fill="#D97706" fontSize="8" fontWeight="bold">Device</text>
              <line x1="88" y1="124" x2="180" y2="98" stroke="#CBD5E1" strokeWidth="1.2" />
              <text x="130" y="117" textAnchor="middle" fill="#64748B" fontSize="7">USES</text>

              {/* Related Account Node */}
              <circle cx="330" cy="50" r="18" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1.5" />
              <text x="330" y="53" textAnchor="middle" fill="#DC2626" fontSize="8" fontWeight="bold">Account</text>
              <line x1="220" y1="82" x2="312" y2="56" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="270" y="65" textAnchor="middle" fill="#EF4444" fontSize="7">TRANSFERS</text>

              {/* Related Phone Node */}
              <circle cx="330" cy="130" r="18" fill="#E6F4F1" stroke="#BDE3DC" strokeWidth="1.5" />
              <text x="330" y="133" textAnchor="middle" fill="#0E4D45" fontSize="8" fontWeight="bold">Phone</text>
              <line x1="220" y1="98" x2="312" y2="124" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="3 3" />
              <text x="270" y="117" textAnchor="middle" fill="#64748B" fontSize="7">LINKED</text>
            </svg>
          </div>

          <div className="text-left pt-2">
            <Link
              to="/graph"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#DCD6CC] bg-[#FAF7F2] hover:bg-white text-stone-800 text-xs font-semibold transition"
            >
              <span>Explore Network</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-stone-500" />
            </Link>
          </div>
        </div>

        {/* Right: Investigation Workflow */}
        <div className="lg:col-span-6 bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 text-left">
              Investigation Workflow
            </h2>
            <p className="text-stone-500 text-xs mt-0.5 text-left">
              How our graph investigation process works.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC]">
              <div className="w-9 h-9 rounded-full bg-[#0E4D45] text-white flex items-center justify-center font-bold text-xs mb-2">
                1
              </div>
              <span className="text-xs font-bold text-stone-900">Search Account</span>
              <span className="text-[10px] text-stone-500 mt-0.5">Enter account ID</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC]">
              <div className="w-9 h-9 rounded-full bg-[#0E4D45] text-white flex items-center justify-center font-bold text-xs mb-2">
                2
              </div>
              <span className="text-xs font-bold text-stone-900">Analyze Graph</span>
              <span className="text-[10px] text-stone-500 mt-0.5">Traverse connections</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC]">
              <div className="w-9 h-9 rounded-full bg-[#0E4D45] text-white flex items-center justify-center font-bold text-xs mb-2">
                3
              </div>
              <span className="text-xs font-bold text-stone-900">Detect Patterns</span>
              <span className="text-[10px] text-stone-500 mt-0.5">Apply Cypher rules</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC]">
              <div className="w-9 h-9 rounded-full bg-[#0E4D45] text-white flex items-center justify-center font-bold text-xs mb-2">
                4
              </div>
              <span className="text-xs font-bold text-stone-900">Review Results</span>
              <span className="text-[10px] text-stone-500 mt-0.5">Evidence &amp; score</span>
            </div>
          </div>

          <div className="text-xs text-stone-500 text-left bg-[#FAF7F2] p-3 rounded-xl border border-[#EBE6DD]">
            Each investigation executes on-demand Cypher queries directly against CognoDB Cloud.
          </div>
        </div>
      </div>

      {/* 4. Two Column: Recent Investigations Table & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Investigations Table */}
        <div className="lg:col-span-8 bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 text-left">
                  Recent Investigations
                </h2>
                <p className="text-stone-500 text-xs mt-0.5 text-left">
                  Your recently investigated accounts during this session.
                </p>
              </div>
              <Link
                to="/recent"
                className="text-xs font-semibold text-[#0E4D45] hover:underline"
              >
                View All →
              </Link>
            </div>

            {recentList.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-500 bg-[#FAF7F2] rounded-xl border border-[#EBE6DD]">
                No investigations in this session yet. Use the search bar above to investigate an account.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-2.5">Account ID</th>
                      <th className="pb-2.5">Risk Score</th>
                      <th className="pb-2.5">Risk Level</th>
                      <th className="pb-2.5">Top Signal Detected</th>
                      <th className="pb-2.5">Investigated</th>
                      <th className="pb-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {recentList.slice(0, 5).map((item) => (
                      <tr key={item.accountId} className="hover:bg-stone-50/50 transition">
                        <td className="py-3 font-mono font-bold text-stone-900">{item.accountId}</td>
                        <td className="py-3 font-semibold text-stone-800">{item.riskScore} / 100</td>
                        <td className="py-3">
                          <RiskBadge level={item.riskLevel} size="sm" />
                        </td>
                        <td className="py-3 font-medium text-stone-700">{item.topSignal}</td>
                        <td className="py-3 text-stone-500">{formatRelativeTime(item.timestamp)}</td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/investigate/${encodeURIComponent(item.accountId)}`}
                            className="text-[#0E4D45] font-semibold hover:underline"
                          >
                            View Details →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 text-left">
            <Link
              to="/recent"
              className="text-xs font-semibold text-[#0E4D45] hover:underline"
            >
              View All Investigations →
            </Link>
          </div>
        </div>

        {/* Right: System Status */}
        <div className="lg:col-span-4 bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 text-left">
                  System Status
                </h2>
                <p className="text-stone-500 text-xs mt-0.5 text-left">
                  Live connectivity status.
                </p>
              </div>
              <button
                onClick={handleRefreshHealth}
                disabled={healthStatus.loading}
                className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition cursor-pointer"
                title="Refresh Status"
              >
                <svg className={`w-4 h-4 ${healthStatus.loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC]">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${healthStatus.database === 'connected' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-xs font-semibold text-stone-800">CognoDB (Graph Database)</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 capitalize">{healthStatus.database}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC]">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${healthStatus.api === 'healthy' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-xs font-semibold text-stone-800">Fraud Detection Engine</span>
                </div>
                <span className="text-xs font-bold text-emerald-700">Operational</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC]">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${healthStatus.api === 'healthy' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-xs font-semibold text-stone-800">API Services</span>
                </div>
                <span className="text-xs font-bold text-emerald-700">Operational</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 text-left text-[11px] text-stone-400">
            Last checked: <span className="font-mono text-stone-600">{healthStatus.lastChecked}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
