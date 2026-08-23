import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fraudApi } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { addRecentInvestigation, formatSignalName, formatLocalDateTime } from '../utils/sessionHistory.js';
import RiskBadge from '../components/RiskBadge.jsx';
import { LoadingState, ErrorState } from '../components/FeedbackStates.jsx';
import {
  SearchIcon,
  CircularTransfersIcon,
  MonitorIcon,
  SharedPhonesIcon,
  HomeIcon,
  SmurfingIcon,
  ArrowRightIcon,
  NetworkIcon,
  CreditCardIcon,
} from '../components/Icons.jsx';

export default function InvestigateAccount() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [accountIdInput, setAccountIdInput] = useState(id || '');
  const [currentAccountId, setCurrentAccountId] = useState(id || '');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Active tabs
  const [activeTxnTab, setActiveTxnTab] = useState('inbound');
  const [activeEntityTab, setActiveEntityTab] = useState('persons');

  // Fetch investigation report from real backend
  const fetchInvestigation = useCallback(async (accId) => {
    if (!accId || !accId.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fraudApi.investigate(accId.trim());
      setReport(data);
      // Automatically record in session history
      addRecentInvestigation(data);
    } catch (err) {
      setReport(null);
      setError({
        status: err.status,
        message: err.message || 'Failed to complete investigation.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync with URL params
  useEffect(() => {
    if (id) {
      setAccountIdInput(id);
      setCurrentAccountId(id);
      fetchInvestigation(id);
    }
  }, [id, fetchInvestigation]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = accountIdInput.trim();
    if (trimmed) {
      navigate(`/investigate/${encodeURIComponent(trimmed)}`);
    }
  };

  // Helper to extract evidence data safely
  const extractEvidence = () => {
    if (!report || !Array.isArray(report.signals)) {
      return {
        inboundTxns: [],
        outboundTxns: [],
        devices: [],
        phones: [],
        addresses: [],
        persons: [],
        relatedAccounts: new Set(),
        topSignalName: 'No Significant Signal',
      };
    }

    let inboundTxns = [];
    let outboundTxns = [];
    const devices = [];
    const phones = [];
    const addresses = [];
    const personsMap = new Map();
    const relatedAccounts = new Set();

    for (const sig of report.signals) {
      const ev = sig.evidence || {};

      if (sig.signal === 'FAN_IN_DISPERSAL') {
        if (Array.isArray(ev.inboundTransactions)) {
          inboundTxns = ev.inboundTransactions;
        }
        if (Array.isArray(ev.outboundTransactions)) {
          outboundTxns = ev.outboundTransactions;
        }
        (ev.sourceAccountIds || []).forEach(a => relatedAccounts.add(a));
        (ev.destinationAccountIds || []).forEach(a => relatedAccounts.add(a));
      }

      if (sig.signal === 'CIRCULAR_TRANSFER' && Array.isArray(ev.cycles)) {
        for (const cycle of ev.cycles) {
          (cycle.cyclePath || []).forEach(a => {
            if (a !== report.accountId) relatedAccounts.add(a);
          });
          if (Array.isArray(cycle.transactions)) {
            // Include cycle transactions as outbound/inbound
            outboundTxns = [...outboundTxns, ...cycle.transactions];
          }
        }
      }

      if (sig.signal === 'SHARED_DEVICE' && Array.isArray(ev.sharedDevices)) {
        for (const dev of ev.sharedDevices) {
          devices.push(dev);
          (dev.relatedAccounts || []).forEach(a => {
            if (a !== report.accountId) relatedAccounts.add(a);
          });
        }
      }

      if (sig.signal === 'SHARED_PHONE' && Array.isArray(ev.sharedPhones)) {
        for (const ph of ev.sharedPhones) {
          phones.push(ph);
          (ph.relatedAccountIds || []).forEach(a => {
            if (a !== report.accountId) relatedAccounts.add(a);
          });
          (ph.relatedPersonIds || []).forEach(p => {
            personsMap.set(p, { id: p, name: `Person ${p}`, linkedEntity: ph.phoneNumber || ph.phoneId });
          });
        }
      }

      if (sig.signal === 'SHARED_ADDRESS' && Array.isArray(ev.sharedAddresses)) {
        for (const addr of ev.sharedAddresses) {
          addresses.push(addr);
          (addr.relatedAccountIds || []).forEach(a => {
            if (a !== report.accountId) relatedAccounts.add(a);
          });
          (addr.relatedPersonIds || []).forEach(p => {
            if (!personsMap.has(p)) {
              personsMap.set(p, { id: p, name: `Person ${p}`, linkedEntity: `${addr.street || addr.addressId}, ${addr.city || ''}` });
            }
          });
        }
      }
    }

    // Top signal
    let topSignalName = 'No Significant Signal';
    if (report.signals.length > 0) {
      const sorted = [...report.signals].sort((a, b) => (b.weight || 0) - (a.weight || 0));
      topSignalName = formatSignalName(sorted[0].signal);
    } else if (report.accountInfo?.isFlagged === false && report.riskScore === 0) {
      topSignalName = 'Low Activity';
    }

    return {
      inboundTxns,
      outboundTxns,
      devices,
      phones,
      addresses,
      persons: Array.from(personsMap.values()),
      relatedAccounts: Array.from(relatedAccounts),
      topSignalName,
    };
  };

  const evidenceData = extractEvidence();

  const getSignalIcon = (signalKey) => {
    switch (signalKey) {
      case 'FAN_IN_DISPERSAL':
        return <SmurfingIcon className="w-5 h-5 text-[#0E4D45]" />;
      case 'CIRCULAR_TRANSFER':
        return <CircularTransfersIcon className="w-5 h-5 text-[#0E4D45]" />;
      case 'SHARED_DEVICE':
        return <MonitorIcon className="w-5 h-5 text-[#D97706]" />;
      case 'SHARED_PHONE':
        return <SharedPhonesIcon className="w-5 h-5 text-[#0D9488]" />;
      case 'SHARED_ADDRESS':
        return <HomeIcon className="w-5 h-5 text-[#0E4D45]" />;
      default:
        return <NetworkIcon className="w-5 h-5 text-stone-500" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn select-none">
      {/* Top Header Row with Title and Back CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#111827] tracking-tight text-left">
            Investigate Account
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5 text-left font-sans-ui">
            Analyze account relationships, detect fraud patterns and review evidence.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DCD6CC] bg-white text-stone-700 hover:bg-[#FAF7F2] text-xs font-semibold transition self-start sm:self-auto"
        >
          <span>&larr; Back to Dashboard</span>
        </Link>
      </div>

      {/* Row 1: Search Form & Account Risk Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Search Box */}
        <div className="lg:col-span-5 bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-left">
          <div>
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-1">
              Search Account
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              Enter an account ID to begin on-demand investigation.
            </p>

            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <SearchIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={accountIdInput}
                  onChange={(e) => setAccountIdInput(e.target.value)}
                  placeholder="e.g., ACC-010"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2DDD5] rounded-xl text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#0E4D45] focus:ring-1 focus:ring-[#0E4D45] transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#0E4D45] hover:bg-[#0B3B34] text-white text-sm font-semibold rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Network...</span>
                  </>
                ) : (
                  <>
                    <SearchIcon className="w-4 h-4" />
                    <span>Investigate</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex flex-wrap items-center gap-2 text-[11px] text-stone-400">
            <span>Quick test accounts:</span>
            {['ACC-010', 'ACC-001', 'ACC-005', 'ACC-008', 'ACC-020'].map((acc) => (
              <button
                key={acc}
                type="button"
                onClick={() => {
                  setAccountIdInput(acc);
                  navigate(`/investigate/${acc}`);
                }}
                className="font-mono px-2 py-0.5 rounded-md bg-[#FAF7F2] hover:bg-[#EAE5DC] text-stone-700 transition cursor-pointer"
              >
                {acc}
              </button>
            ))}
          </div>
        </div>

        {/* Account Risk Summary Card */}
        <div className="lg:col-span-7 bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Account Risk Summary
              </h2>
              {report && (
                <span className="text-[11px] text-stone-400 font-mono">
                  {report.accountInfo?.bank || 'Bank Account'} • {report.accountInfo?.accountNumber || ''}
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-8 flex items-center justify-center gap-3 text-stone-500 text-sm">
                <div className="w-5 h-5 border-2 border-[#0E4D45] border-t-transparent rounded-full animate-spin" />
                <span>Running graph traversal and fraud detectors...</span>
              </div>
            ) : error ? (
              <div className="py-6 text-center text-rose-600 text-sm font-medium">
                {error.status === 404 ? 'Account not found in graph database.' : error.message}
              </div>
            ) : report ? (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8 space-y-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-[11px] text-stone-400 uppercase font-bold block">Account ID</span>
                      <span className="text-xl font-bold font-mono text-stone-900">{report.accountId}</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-stone-400 uppercase font-bold block">Risk Score</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-stone-900">{report.riskScore}</span>
                        <span className="text-xs text-stone-400 font-medium">/ 100</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-stone-400 uppercase font-bold block mb-1">Risk Level</span>
                      <RiskBadge level={report.riskLevel} />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-400 uppercase font-bold block">Top Signal Detected</span>
                    <span className="text-sm font-bold text-[#0E4D45] mt-0.5 block">
                      {evidenceData.topSignalName}
                    </span>
                  </div>
                </div>

                {/* Right Shield Graphic */}
                <div className="sm:col-span-4 flex items-center justify-center">
                  <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center ${
                    report.riskLevel === 'CRITICAL' || report.riskLevel === 'HIGH'
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : report.riskLevel === 'MEDIUM'
                      ? 'bg-amber-50 border-amber-200 text-amber-600'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  }`}>
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      {report.riskLevel === 'CRITICAL' || report.riskLevel === 'HIGH' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-stone-400">
                Enter an account ID to display risk evaluation and detected signals.
              </div>
            )}
          </div>

          <div className="text-[11px] text-stone-400 pt-3 mt-3 border-t border-stone-100">
            Rule-based heuristic risk score generated from on-demand Cypher graph traversal.
          </div>
        </div>
      </div>

      {/* Main Investigation Content Body (Only shown when report is loaded) */}
      {loading ? (
        <LoadingState message="Analyzing graph relationships..." submessage="Executing parameterized Cypher queries across CognoDB" />
      ) : error ? (
        <ErrorState
          title={error.status === 404 ? 'Account Not Found' : 'Investigation Failed'}
          message={error.message}
          onRetry={() => fetchInvestigation(currentAccountId)}
        />
      ) : report ? (
        <>
          {/* Row 2: 3 Cards (Risk Signals Detected, Network Overview, Transaction Evidence) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 1. Risk Signals Detected */}
            <div className="lg:col-span-4 bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                      Risk Signals Detected
                    </h2>
                    <span className="w-5 h-5 rounded-full bg-[#0E4D45] text-white text-[10px] font-bold flex items-center justify-center">
                      {report.signals?.length || 0}
                    </span>
                  </div>
                </div>

                {(!report.signals || report.signals.length === 0) ? (
                  <div className="py-8 text-center text-xs text-stone-400 bg-[#FAF7F2] rounded-xl border border-[#EAE5DC]">
                    No suspicious fraud signals detected for this account.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {report.signals.map((sig, idx) => (
                      <div
                        key={sig.signal + idx}
                        className="p-3.5 rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-white border border-[#EAE5DC]">
                              {getSignalIcon(sig.signal)}
                            </div>
                            <span className="text-xs font-bold text-stone-900">
                              {formatSignalName(sig.signal)}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            sig.severity === 'HIGH'
                              ? 'bg-red-100 text-red-700'
                              : sig.severity === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {sig.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed">
                          {sig.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 mt-4">
                <Link
                  to="/patterns"
                  className="text-xs font-semibold text-[#0E4D45] hover:underline inline-flex items-center gap-1"
                >
                  <span>Learn about detection patterns</span>
                  <ArrowRightIcon className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* 2. Network Overview */}
            <div className="lg:col-span-4 bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                    Network Overview
                  </h2>
                </div>

                {/* Graph Legend mini */}
                <div className="flex flex-wrap items-center gap-3 text-[10px] text-stone-500 mb-4 pb-2 border-b border-stone-100">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0E4D45]" /> Primary</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Inbound</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Outbound</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Related</span>
                </div>

                {/* Mini Visual Diagram */}
                <div className="my-3 py-2 flex items-center justify-center bg-[#FAF7F2] rounded-xl border border-[#EAE5DC]">
                  <svg viewBox="0 0 320 160" className="w-full max-w-[280px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Primary Node */}
                    <circle cx="160" cy="80" r="18" fill="#0E4D45" />
                    <text x="160" y="83" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                      {report.accountId}
                    </text>

                    {/* Left Inbound Nodes */}
                    <circle cx="50" cy="40" r="12" fill="#E6F4F1" stroke="#10B981" strokeWidth="1.5" />
                    <text x="50" y="43" textAnchor="middle" fill="#0E4D45" fontSize="6" fontWeight="bold">IN-1</text>
                    <line x1="62" y1="45" x2="142" y2="74" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />

                    <circle cx="50" cy="120" r="12" fill="#E6F4F1" stroke="#10B981" strokeWidth="1.5" />
                    <text x="50" y="123" textAnchor="middle" fill="#0E4D45" fontSize="6" fontWeight="bold">IN-2</text>
                    <line x1="62" y1="115" x2="142" y2="86" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* Right Outbound Nodes */}
                    <circle cx="270" cy="40" r="12" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
                    <text x="270" y="43" textAnchor="middle" fill="#DC2626" fontSize="6" fontWeight="bold">OUT-1</text>
                    <line x1="178" y1="74" x2="258" y2="45" stroke="#EF4444" strokeWidth="1.5" />

                    <circle cx="270" cy="120" r="12" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
                    <text x="270" y="123" textAnchor="middle" fill="#DC2626" fontSize="6" fontWeight="bold">OUT-2</text>
                    <line x1="178" y1="86" x2="258" y2="115" stroke="#EF4444" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 mt-4 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  {evidenceData.relatedAccounts.length} related account{evidenceData.relatedAccounts.length === 1 ? '' : 's'}
                </span>
                <Link
                  to={`/graph/${encodeURIComponent(report.accountId)}`}
                  className="text-xs font-semibold text-[#0E4D45] hover:underline inline-flex items-center gap-1"
                >
                  <span>View Full Graph</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 3. Transaction Evidence */}
            <div className="lg:col-span-4 bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                    Transaction Evidence
                  </h2>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-stone-200 mb-3 text-xs">
                  <button
                    onClick={() => setActiveTxnTab('inbound')}
                    className={`pb-2 px-3 font-semibold transition border-b-2 cursor-pointer ${
                      activeTxnTab === 'inbound'
                        ? 'border-[#0E4D45] text-[#0E4D45]'
                        : 'border-transparent text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    Incoming ({evidenceData.inboundTxns.length})
                  </button>
                  <button
                    onClick={() => setActiveTxnTab('outbound')}
                    className={`pb-2 px-3 font-semibold transition border-b-2 cursor-pointer ${
                      activeTxnTab === 'outbound'
                        ? 'border-[#0E4D45] text-[#0E4D45]'
                        : 'border-transparent text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    Outgoing ({evidenceData.outboundTxns.length})
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-y-auto max-h-[190px]">
                  {activeTxnTab === 'inbound' ? (
                    evidenceData.inboundTxns.length === 0 ? (
                      <div className="py-6 text-center text-xs text-stone-400">
                        No inbound transaction evidence detected.
                      </div>
                    ) : (
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="text-stone-400 font-bold border-b border-stone-100">
                            <th className="pb-1.5">From</th>
                            <th className="pb-1.5">Amount</th>
                            <th className="pb-1.5">Txn ID</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50 font-mono">
                          {evidenceData.inboundTxns.map((txn, idx) => (
                            <tr key={txn.transactionId || idx} className="hover:bg-stone-50/60">
                              <td className="py-1.5 text-stone-800 font-semibold">{txn.fromAccountId || '—'}</td>
                              <td className="py-1.5 text-emerald-700 font-semibold">${(txn.amount || 0).toLocaleString()}</td>
                              <td className="py-1.5 text-stone-500">{txn.transactionId || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                  ) : (
                    evidenceData.outboundTxns.length === 0 ? (
                      <div className="py-6 text-center text-xs text-stone-400">
                        No outbound transaction evidence detected.
                      </div>
                    ) : (
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="text-stone-400 font-bold border-b border-stone-100">
                            <th className="pb-1.5">To</th>
                            <th className="pb-1.5">Amount</th>
                            <th className="pb-1.5">Txn ID</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50 font-mono">
                          {evidenceData.outboundTxns.map((txn, idx) => (
                            <tr key={txn.transactionId || idx} className="hover:bg-stone-50/60">
                              <td className="py-1.5 text-stone-800 font-semibold">{txn.toAccountId || '—'}</td>
                              <td className="py-1.5 text-rose-700 font-semibold">${(txn.amount || 0).toLocaleString()}</td>
                              <td className="py-1.5 text-stone-500">{txn.transactionId || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 mt-3 text-xs text-stone-500 flex justify-between">
                <span>Total transactions in evidence:</span>
                <span className="font-bold text-stone-800">
                  {evidenceData.inboundTxns.length + evidenceData.outboundTxns.length}
                </span>
              </div>
            </div>
          </div>

          {/* Row 3: 3 Cards (Connected Entities, Evidence Summary, Investigation Details) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 1. Connected Entities */}
            <div className="lg:col-span-5 bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-left">
              <div>
                <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                  Connected Entities
                </h2>

                {/* Entity Tabs */}
                <div className="flex border-b border-stone-200 mb-3 text-xs overflow-x-auto">
                  <button
                    onClick={() => setActiveEntityTab('persons')}
                    className={`pb-2 px-2.5 font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
                      activeEntityTab === 'persons' ? 'border-[#0E4D45] text-[#0E4D45]' : 'border-transparent text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    Persons ({evidenceData.persons.length})
                  </button>
                  <button
                    onClick={() => setActiveEntityTab('devices')}
                    className={`pb-2 px-2.5 font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
                      activeEntityTab === 'devices' ? 'border-[#0E4D45] text-[#0E4D45]' : 'border-transparent text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    Devices ({evidenceData.devices.length})
                  </button>
                  <button
                    onClick={() => setActiveEntityTab('phones')}
                    className={`pb-2 px-2.5 font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
                      activeEntityTab === 'phones' ? 'border-[#0E4D45] text-[#0E4D45]' : 'border-transparent text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    Phones ({evidenceData.phones.length})
                  </button>
                  <button
                    onClick={() => setActiveEntityTab('addresses')}
                    className={`pb-2 px-2.5 font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
                      activeEntityTab === 'addresses' ? 'border-[#0E4D45] text-[#0E4D45]' : 'border-transparent text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    Addresses ({evidenceData.addresses.length})
                  </button>
                </div>

                {/* Tab content */}
                <div className="overflow-y-auto max-h-[160px]">
                  {activeEntityTab === 'persons' && (
                    evidenceData.persons.length === 0 ? (
                      <div className="py-6 text-center text-xs text-stone-400">No connected persons in evidence.</div>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {evidenceData.persons.map((p) => (
                          <div key={p.id} className="p-2 rounded-lg bg-[#FAF7F2] border border-[#EAE5DC] flex justify-between items-center">
                            <span className="font-mono font-bold text-stone-900">{p.id}</span>
                            <span className="text-stone-500 truncate max-w-[180px]">{p.linkedEntity}</span>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {activeEntityTab === 'devices' && (
                    evidenceData.devices.length === 0 ? (
                      <div className="py-6 text-center text-xs text-stone-400">No connected devices in evidence.</div>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {evidenceData.devices.map((d, i) => (
                          <div key={d.deviceId || i} className="p-2 rounded-lg bg-[#FAF7F2] border border-[#EAE5DC] flex justify-between items-center">
                            <span className="font-mono font-bold text-stone-900">{d.deviceId}</span>
                            <span className="text-stone-500 font-mono text-[11px]">{d.hardwareId} ({d.deviceType || 'device'})</span>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {activeEntityTab === 'phones' && (
                    evidenceData.phones.length === 0 ? (
                      <div className="py-6 text-center text-xs text-stone-400">No connected phones in evidence.</div>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {evidenceData.phones.map((ph, i) => (
                          <div key={ph.phoneId || i} className="p-2 rounded-lg bg-[#FAF7F2] border border-[#EAE5DC] flex justify-between items-center">
                            <span className="font-mono font-bold text-stone-900">{ph.phoneId}</span>
                            <span className="text-stone-500 font-mono text-[11px]">{ph.phoneNumber}</span>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {activeEntityTab === 'addresses' && (
                    evidenceData.addresses.length === 0 ? (
                      <div className="py-6 text-center text-xs text-stone-400">No connected addresses in evidence.</div>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {evidenceData.addresses.map((a, i) => (
                          <div key={a.addressId || i} className="p-2 rounded-lg bg-[#FAF7F2] border border-[#EAE5DC] flex justify-between items-center">
                            <span className="font-mono font-bold text-stone-900">{a.addressId}</span>
                            <span className="text-stone-500 text-[11px] truncate max-w-[180px]">{a.street}, {a.city}</span>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 mt-3 text-xs text-stone-500">
                Connected entities extracted directly from Cypher relationship traversals.
              </div>
            </div>

            {/* 2. Evidence Summary */}
            <div className="lg:col-span-4 bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-left">
              <div>
                <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                  Evidence Summary
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-2">
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-center">
                    <span className="text-base font-bold text-stone-900 block">{evidenceData.relatedAccounts.length}</span>
                    <span className="text-[10px] text-stone-500">Accounts</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-center">
                    <span className="text-base font-bold text-stone-900 block">{evidenceData.inboundTxns.length + evidenceData.outboundTxns.length}</span>
                    <span className="text-[10px] text-stone-500">Transfers</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-center">
                    <span className="text-base font-bold text-stone-900 block">{evidenceData.devices.length}</span>
                    <span className="text-[10px] text-stone-500">Devices</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-center">
                    <span className="text-base font-bold text-stone-900 block">{evidenceData.addresses.length}</span>
                    <span className="text-[10px] text-stone-500">Addresses</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 mt-4 leading-relaxed">
                  {report.signals && report.signals.length > 0
                    ? `Account exhibits ${report.signals.length} suspicious pattern signal${report.signals.length === 1 ? '' : 's'} across connected entity clusters.`
                    : 'Account exhibits standard transaction activity without detected multi-hop fraud anomalies.'}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 mt-3 text-xs text-stone-400">
                Data reflects current CognoDB graph state.
              </div>
            </div>

            {/* 3. Investigation Details */}
            <div className="lg:col-span-3 bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-left">
              <div>
                <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
                  Investigation Details
                </h2>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Evaluation Time</span>
                    <span className="font-mono text-stone-800 font-medium">
                      {formatLocalDateTime(report.evaluatedAt) || 'Current Session'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Investigated By</span>
                    <span className="text-stone-800 font-mono text-[11px] truncate block">
                      {user?.email || 'investigator@fraudnet.com'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Status</span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[10px] mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 mt-4">
                <Link
                  to={`/graph/${encodeURIComponent(report.accountId)}`}
                  className="w-full py-2 rounded-xl bg-[#0E4D45] hover:bg-[#0B3B34] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <NetworkIcon className="w-3.5 h-3.5" />
                  <span>Open in Network Graph</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
