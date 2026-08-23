import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getRecentInvestigations,
  clearRecentInvestigations,
  formatRelativeTime,
} from '../utils/sessionHistory.js';
import RiskBadge from '../components/RiskBadge.jsx';
import { SearchIcon, ArrowRightIcon, NetworkIcon } from '../components/Icons.jsx';

export default function RecentInvestigations() {
  const [searchId, setSearchId] = useState('');
  const [historyList, setHistoryList] = useState([]);
  const navigate = useNavigate();

  // Load and listen for changes to sessionStorage history
  useEffect(() => {
    const updateList = () => {
      setHistoryList(getRecentInvestigations());
    };
    updateList();

    window.addEventListener('fraudnet_history_updated', updateList);
    return () => window.removeEventListener('fraudnet_history_updated', updateList);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchId.trim();
    if (trimmed) {
      navigate(`/investigate/${encodeURIComponent(trimmed)}`);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all recent investigation records for this browser session?')) {
      clearRecentInvestigations();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn select-none">
      {/* Top Page Header */}
      <div className="text-left">
        <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#111827] tracking-tight">
          Recent Investigations
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-0.5 font-sans-ui">
          Accounts investigated during this browser session.
        </p>
      </div>

      {/* Top 2-Column: Investigate New Account Search & On-Demand Notice Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Search Box */}
        <div className="lg:col-span-6 bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-left">
          <div>
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-1">
              Investigate a New Account
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              Enter any account ID to run on-demand fraud graph analysis.
            </p>

            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <SearchIcon className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter Account ID (e.g., ACC-010)"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2DDD5] rounded-xl text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#0E4D45]"
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

          <div className="pt-3 mt-3 border-t border-stone-100 flex items-center gap-2 text-[11px] text-stone-400">
            <span>Quick test:</span>
            {['ACC-010', 'ACC-001', 'ACC-005', 'ACC-028'].map((acc) => (
              <button
                key={acc}
                type="button"
                onClick={() => navigate(`/investigate/${acc}`)}
                className="font-mono px-2 py-0.5 rounded bg-[#FAF7F2] hover:bg-[#EAE5DC] text-stone-700 transition cursor-pointer"
              >
                {acc}
              </button>
            ))}
          </div>
        </div>

        {/* Right: On-Demand Investigation Note */}
        <div className="lg:col-span-6 bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-left">
          <div>
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              On-Demand Investigation
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Investigation results are generated live from CognoDB Cloud on demand. They are not stored permanently by the backend. This page tracks accounts you have investigated during this browser session.
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Session Storage: <span className="font-semibold text-stone-800">Active</span></span>
            <span>Total Investigated: <span className="font-bold font-mono text-[#0E4D45]">{historyList.length}</span></span>
          </div>
        </div>
      </div>

      {/* Banner Notice */}
      <div className="bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl px-4 py-3 text-left flex items-center justify-between text-xs text-stone-600">
        <span>
          This page shows the accounts you have investigated in this session. To see full details, view the investigation result or network graph for any account.
        </span>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs text-left">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Session Investigation History ({historyList.length})
          </h2>

          {historyList.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-stone-500 hover:text-rose-600 transition font-medium cursor-pointer"
            >
              Clear Session History
            </button>
          )}
        </div>

        {historyList.length === 0 ? (
          <div className="py-12 text-center text-xs text-stone-400 bg-[#FAF7F2] rounded-xl border border-[#EAE5DC] space-y-2">
            <p className="font-semibold text-stone-700">No recent investigations found in this session.</p>
            <p>Enter an account ID in the search box above to run an investigation.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Account ID</th>
                  <th className="pb-3">Risk Score</th>
                  <th className="pb-3">Risk Level</th>
                  <th className="pb-3">Top Signal Detected</th>
                  <th className="pb-3">Signals Detected</th>
                  <th className="pb-3">Investigated</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {historyList.map((item) => (
                  <tr key={item.accountId} className="hover:bg-stone-50/50 transition">
                    <td className="py-3.5 font-mono font-bold text-stone-900">{item.accountId}</td>
                    <td className="py-3.5 font-semibold text-stone-800">{item.riskScore} / 100</td>
                    <td className="py-3.5">
                      <RiskBadge level={item.riskLevel} size="sm" />
                    </td>
                    <td className="py-3.5 font-medium text-stone-700">{item.topSignal}</td>
                    <td className="py-3.5 text-stone-500">{item.signalsSummary || `${item.signalCount} signals`}</td>
                    <td className="py-3.5 text-stone-500 font-mono text-[11px]">
                      {formatRelativeTime(item.timestamp)}
                    </td>
                    <td className="py-3.5 text-right space-x-3 whitespace-nowrap">
                      <Link
                        to={`/investigate/${encodeURIComponent(item.accountId)}`}
                        className="text-[#0E4D45] font-semibold hover:underline"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/graph/${encodeURIComponent(item.accountId)}`}
                        className="text-stone-500 font-medium hover:text-[#0E4D45] hover:underline"
                      >
                        Open Graph
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom About Card */}
      <div className="bg-[#FAF7F2] border border-[#EBE6DD] rounded-2xl p-5 text-left flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-white border border-[#EAE5DC] text-[#0E4D45] flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1 text-xs">
          <h3 className="font-bold text-stone-900">About Recent Investigations</h3>
          <p className="text-stone-600 leading-relaxed">
            Recent investigations are stored in your browser's session storage. If you close your browser or clear your storage, this list will reset. Investigation results for any account can always be re-generated by running a new investigation against CognoDB Cloud.
          </p>
        </div>
      </div>
    </div>
  );
}
