import React from 'react';
import { Link } from 'react-router-dom';
import {
  SmurfingIcon,
  CircularTransfersIcon,
  MonitorIcon,
  SharedPhonesIcon,
  HomeIcon,
  ArrowRightIcon,
} from '../components/Icons.jsx';

export default function DetectionPatterns() {
  const patterns = [
    {
      num: '01',
      title: 'Fan-in / Smurfing',
      badge: 'High Severity',
      badgeClass: 'bg-red-50 border-red-200 text-red-700',
      weight: 30,
      icon: SmurfingIcon,
      description:
        'Detects multiple inbound transfers received in a concentrated window followed by rapid outbound dispersal to destination accounts.',
      signals: [
        'High concentration of incoming transfers in narrow timeframes',
        'Dispersal of funds within hours to recipient accounts',
        'Disproportionate transaction turnover velocity',
      ],
      diagram: (
        <svg viewBox="0 0 320 120" className="w-full max-w-[260px] mx-auto" fill="none">
          {/* Source nodes */}
          <circle cx="50" cy="30" r="14" fill="#E6F4F1" stroke="#10B981" strokeWidth="1.5" />
          <text x="50" y="33" textAnchor="middle" fill="#0E4D45" fontSize="7" fontWeight="bold">Src 1</text>
          <circle cx="50" cy="90" r="14" fill="#E6F4F1" stroke="#10B981" strokeWidth="1.5" />
          <text x="50" y="93" textAnchor="middle" fill="#0E4D45" fontSize="7" fontWeight="bold">Src 2</text>

          {/* Central Target */}
          <circle cx="160" cy="60" r="18" fill="#0E4D45" />
          <text x="160" y="63" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">Target</text>

          {/* Dest nodes */}
          <circle cx="270" cy="30" r="14" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
          <text x="270" y="33" textAnchor="middle" fill="#DC2626" fontSize="7" fontWeight="bold">Dst 1</text>
          <circle cx="270" cy="90" r="14" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
          <text x="270" y="93" textAnchor="middle" fill="#DC2626" fontSize="7" fontWeight="bold">Dst 2</text>

          {/* Arrows */}
          <line x1="64" y1="36" x2="142" y2="54" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="64" y1="84" x2="142" y2="66" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="178" y1="54" x2="256" y2="36" stroke="#EF4444" strokeWidth="1.5" />
          <line x1="178" y1="66" x2="256" y2="84" stroke="#EF4444" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Circular Transfer',
      badge: 'High Severity',
      badgeClass: 'bg-red-50 border-red-200 text-red-700',
      weight: 40,
      icon: CircularTransfersIcon,
      description:
        'Detects closed transaction loops between 2 and 5 accounts within configured detection timeframes.',
      signals: [
        'Money routed sequentially and returned to source',
        'Multi-hop path traversal (2 to 5 hops)',
        'Temporal sequence verification across transaction hops',
      ],
      diagram: (
        <svg viewBox="0 0 320 120" className="w-full max-w-[240px] mx-auto" fill="none">
          <circle cx="100" cy="35" r="14" fill="#0E4D45" />
          <text x="100" y="38" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Acc A</text>

          <circle cx="220" cy="35" r="14" fill="#E6F4F1" stroke="#0E4D45" strokeWidth="1.5" />
          <text x="220" y="38" textAnchor="middle" fill="#0E4D45" fontSize="7" fontWeight="bold">Acc B</text>

          <circle cx="220" cy="85" r="14" fill="#E6F4F1" stroke="#0E4D45" strokeWidth="1.5" />
          <text x="220" y="88" textAnchor="middle" fill="#0E4D45" fontSize="7" fontWeight="bold">Acc C</text>

          <circle cx="100" cy="85" r="14" fill="#E6F4F1" stroke="#0E4D45" strokeWidth="1.5" />
          <text x="100" y="88" textAnchor="middle" fill="#0E4D45" fontSize="7" fontWeight="bold">Acc D</text>

          {/* Loop Arrows */}
          <line x1="114" y1="35" x2="206" y2="35" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="220" y1="49" x2="220" y2="71" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="206" y1="85" x2="114" y2="85" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="100" y1="71" x2="100" y2="49" stroke="#F59E0B" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Shared Device',
      badge: 'Medium Severity',
      badgeClass: 'bg-amber-50 border-amber-200 text-amber-800',
      weight: 15,
      icon: MonitorIcon,
      description:
        'Identifies multiple unrelated bank accounts authenticating or operating through the same hardware device or digital fingerprint.',
      signals: [
        'Same hardware ID accessed across disparate accounts',
        'Multi-login velocity anomalies across multiple users',
        'Mule syndicate hardware device pooling',
      ],
      diagram: (
        <svg viewBox="0 0 320 120" className="w-full max-w-[240px] mx-auto" fill="none">
          <circle cx="80" cy="60" r="14" fill="#3B82F6" />
          <text x="80" y="63" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Acc A</text>

          <rect x="145" y="44" width="32" height="32" rx="6" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.5" />
          <text x="161" y="62" textAnchor="middle" fill="#D97706" fontSize="7" fontWeight="bold">Device</text>

          <circle cx="240" cy="60" r="14" fill="#3B82F6" />
          <text x="240" y="63" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Acc B</text>

          <line x1="94" y1="60" x2="145" y2="60" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="226" y1="60" x2="177" y2="60" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      ),
    },
    {
      num: '04',
      title: 'Shared Phone',
      badge: 'Medium Severity',
      badgeClass: 'bg-teal-50 border-teal-200 text-teal-800',
      weight: 10,
      icon: SharedPhonesIcon,
      description:
        'Identifies accounts whose registered account owners share identical contact phone numbers in CognoDB.',
      signals: [
        'Same phone number registered across multiple person entities',
        'Synthetic identity cluster links',
        'Canonical traversal: Account ← Person → PhoneNumber',
      ],
      diagram: (
        <svg viewBox="0 0 320 120" className="w-full max-w-[240px] mx-auto" fill="none">
          <circle cx="70" cy="60" r="14" fill="#6366F1" />
          <text x="70" y="63" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Person A</text>

          <polygon points="160,42 178,60 160,78 142,60" fill="#E6F4F1" stroke="#0D9488" strokeWidth="1.5" />
          <text x="160" y="62" textAnchor="middle" fill="#0D9488" fontSize="6.5" fontWeight="bold">Phone</text>

          <circle cx="250" cy="60" r="14" fill="#6366F1" />
          <text x="250" y="63" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Person B</text>

          <line x1="84" y1="60" x2="142" y2="60" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="236" y1="60" x2="178" y2="60" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      ),
    },
    {
      num: '05',
      title: 'Shared Address',
      badge: 'Low Severity',
      badgeClass: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      weight: 5,
      icon: HomeIcon,
      description:
        'Identifies accounts whose registered owners share identical physical residential addresses or mailbox drop locations.',
      signals: [
        'Residential address shared across distinct individuals',
        'Mule house and mailbox cluster detection',
        'Canonical traversal: Account ← Person → Address',
      ],
      diagram: (
        <svg viewBox="0 0 320 120" className="w-full max-w-[240px] mx-auto" fill="none">
          <circle cx="70" cy="60" r="14" fill="#6366F1" />
          <text x="70" y="63" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Person A</text>

          <polygon points="160,40 178,50 178,70 160,80 142,70 142,50" fill="#E6F4F1" stroke="#059669" strokeWidth="1.5" />
          <text x="160" y="62" textAnchor="middle" fill="#059669" fontSize="6.5" fontWeight="bold">Address</text>

          <circle cx="250" cy="60" r="14" fill="#6366F1" />
          <text x="250" y="63" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Person B</text>

          <line x1="84" y1="60" x2="142" y2="60" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="236" y1="60" x2="178" y2="60" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn select-none">
      {/* Top Banner Notice */}
      <div className="bg-[#E6F4F1] border border-[#BDE3DC] rounded-xl px-4 py-3 text-left flex items-center justify-between text-xs text-[#0E4D45]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0E4D45]" />
          <span className="font-semibold">
            Patterns are detected on demand when you investigate an account.
          </span>
        </div>
        <Link to="/investigate" className="font-bold underline hover:text-[#0B3B34] hidden sm:block">
          Investigate Account &rarr;
        </Link>
      </div>

      {/* Page Title */}
      <div className="text-left">
        <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#111827] tracking-tight">
          Detection Patterns
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-0.5 font-sans-ui">
          Understanding our five Cypher graph fraud detection algorithms and patterns.
        </p>
      </div>

      {/* 5 Pattern Cards */}
      <div className="space-y-6">
        {patterns.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.num}
              className="bg-white border border-[#EBE6DD] rounded-2xl p-6 sm:p-8 shadow-xs text-left"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Text and Details */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold text-[#0E4D45] font-mono">
                      {item.num}.
                    </span>
                    <h2 className="text-lg font-bold text-stone-900">{item.title}</h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold uppercase ${item.badgeClass}`}
                    >
                      {item.badge} (Weight: {item.weight})
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                      Captured Signals:
                    </span>
                    <ul className="space-y-1 text-xs text-stone-600 list-disc list-inside">
                      {item.signals.map((sig, sIdx) => (
                        <li key={sIdx}>{sig}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/investigate"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E4D45] hover:bg-[#0B3B34] text-white text-xs font-semibold rounded-xl transition shadow-xs"
                    >
                      <span>Investigate an Account</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right Visual Diagram */}
                <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#EAE5DC] rounded-xl p-4 flex items-center justify-center">
                  {item.diagram}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* How Detection Works Row */}
      <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 sm:p-8 shadow-xs text-left space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            How Detection Works
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time execution pipeline on CognoDB Cloud.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-center">
            <div className="w-8 h-8 rounded-full bg-[#0E4D45] text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">1</div>
            <span className="text-xs font-bold text-stone-900 block">Graph Traversal</span>
            <span className="text-[10px] text-stone-500 mt-0.5 block">2 to 5 hop paths</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-center">
            <div className="w-8 h-8 rounded-full bg-[#0E4D45] text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">2</div>
            <span className="text-xs font-bold text-stone-900 block">Pattern Match</span>
            <span className="text-[10px] text-stone-500 mt-0.5 block">Cypher graph query</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-center">
            <div className="w-8 h-8 rounded-full bg-[#0E4D45] text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">3</div>
            <span className="text-xs font-bold text-stone-900 block">Temporal Filter</span>
            <span className="text-[10px] text-stone-500 mt-0.5 block">Chronological check</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-center">
            <div className="w-8 h-8 rounded-full bg-[#0E4D45] text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">4</div>
            <span className="text-xs font-bold text-stone-900 block">Risk Scoring</span>
            <span className="text-[10px] text-stone-500 mt-0.5 block">Bounded 0 to 100</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-center">
            <div className="w-8 h-8 rounded-full bg-[#0E4D45] text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">5</div>
            <span className="text-xs font-bold text-stone-900 block">Aggregation</span>
            <span className="text-[10px] text-stone-500 mt-0.5 block">Multi-signal synthesis</span>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 text-xs text-stone-500">
          All detection algorithms execute natively inside CognoDB Cloud using indexed graph relationships.
        </div>
      </div>
    </div>
  );
}
