import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { healthApi } from '../api/client.js';
import {
  CircularTransfersIcon,
  MonitorIcon,
  SharedPhonesIcon,
  HomeIcon,
  SmurfingIcon,
} from '../components/Icons.jsx';

export default function Settings() {
  const { user } = useAuth();

  const [healthStatus, setHealthStatus] = useState({
    database: 'connected',
    status: 'healthy',
    loading: false,
    tested: false,
  });

  useEffect(() => {
    async function loadHealth() {
      try {
        const res = await healthApi.checkHealth();
        setHealthStatus({
          database: res.database === 'connected' ? 'connected' : 'disconnected',
          status: res.status || 'healthy',
          loading: false,
          tested: true,
        });
      } catch {
        setHealthStatus({
          database: 'disconnected',
          status: 'unavailable',
          loading: false,
          tested: true,
        });
      }
    }
    loadHealth();
  }, []);

  const handleTestConnection = async () => {
    setHealthStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await healthApi.checkHealth();
      setHealthStatus({
        database: res.database === 'connected' ? 'connected' : 'disconnected',
        status: res.status || 'healthy',
        loading: false,
        tested: true,
      });
    } catch {
      setHealthStatus({
        database: 'disconnected',
        status: 'unavailable',
        loading: false,
        tested: true,
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn select-none">
      {/* Top Header */}
      <div className="text-left">
        <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#111827] tracking-tight">
          Settings
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-0.5 font-sans-ui">
          View your account details, system status and understand how the detection engine works.
        </p>
      </div>

      {/* Card 1: Account Information */}
      <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 sm:p-7 shadow-xs text-left">
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">Account Information</h2>
            <p className="text-xs text-stone-500 mt-0.5">Details of the currently logged in user.</p>
          </div>
        </div>

        <div className="border border-[#EAE5DC] rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-12 p-3 sm:px-4 hover:bg-stone-50/40">
            <span className="sm:col-span-4 font-semibold text-stone-700">Email</span>
            <span className="sm:col-span-8 font-mono text-stone-900 font-medium">{user?.email || 'investigator@fraudnet.com'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 p-3 sm:px-4 hover:bg-stone-50/40">
            <span className="sm:col-span-4 font-semibold text-stone-700">Role</span>
            <span className="sm:col-span-8 text-stone-900 capitalize font-medium">{user?.role || 'investigator'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 p-3 sm:px-4 hover:bg-stone-50/40">
            <span className="sm:col-span-4 font-semibold text-stone-700">User ID</span>
            <span className="sm:col-span-8 font-mono text-stone-600 text-[11px]">{user?.id || 'USR-INV-001'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 p-3 sm:px-4 hover:bg-stone-50/40">
            <span className="sm:col-span-4 font-semibold text-stone-700">Authentication</span>
            <span className="sm:col-span-8 text-stone-800 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              JWT authentication enabled
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Database Status */}
      <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 sm:p-7 shadow-xs text-left">
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <ellipse cx="12" cy="5" rx="9" ry="3" strokeWidth="1.75" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">Database Status</h2>
            <p className="text-xs text-stone-500 mt-0.5">Connection status for the graph database.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Table */}
          <div className="lg:col-span-7 border border-[#EAE5DC] rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
            <div className="grid grid-cols-12 p-3 px-4 hover:bg-stone-50/40">
              <span className="col-span-5 font-semibold text-stone-700">Database</span>
              <span className="col-span-7 font-bold text-stone-900">CognoDB Cloud</span>
            </div>

            <div className="grid grid-cols-12 p-3 px-4 hover:bg-stone-50/40">
              <span className="col-span-5 font-semibold text-stone-700">Protocol</span>
              <span className="col-span-7 font-mono text-stone-800">Bolt</span>
            </div>

            <div className="grid grid-cols-12 p-3 px-4 hover:bg-stone-50/40 items-center">
              <span className="col-span-5 font-semibold text-stone-700">Status</span>
              <span className="col-span-7 flex items-center gap-1.5 font-bold text-emerald-800">
                <span className={`w-2 h-2 rounded-full ${healthStatus.database === 'connected' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className="capitalize">{healthStatus.database}</span>
              </span>
            </div>
          </div>

          {/* Right Status Card with Test Button */}
          <div className="lg:col-span-5 p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-bold text-emerald-900">Connection Healthy</h3>
                <p className="text-[11px] text-emerald-800 mt-0.5">Successfully connected to CognoDB Cloud.</p>
              </div>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={healthStatus.loading}
              className="w-full py-2 bg-white hover:bg-stone-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-xl transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <svg className={`w-3.5 h-3.5 ${healthStatus.loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{healthStatus.loading ? 'Testing Connection...' : 'Test Connection'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Card 3: Detection Engine Information */}
      <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 sm:p-7 shadow-xs text-left space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">Detection Engine Information</h2>
            <p className="text-xs text-stone-500 mt-0.5">Fraud detection patterns and scoring used in investigations.</p>
          </div>
        </div>

        <div className="border border-[#EAE5DC] rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
          {/* Circular Transfer */}
          <div className="grid grid-cols-1 sm:grid-cols-12 p-3 sm:px-4 items-center gap-2 hover:bg-stone-50/40">
            <div className="sm:col-span-4 flex items-center gap-2 font-bold text-stone-900">
              <CircularTransfersIcon className="w-4 h-4 text-[#0E4D45]" />
              <span>Circular Transfer</span>
            </div>
            <span className="sm:col-span-5 text-stone-600">Detects circular money flow between accounts.</span>
            <div className="sm:col-span-3 sm:text-right">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EAE5DC] text-[10px] font-mono font-medium text-stone-700">
                Bounded traversal: 2 - 5 hops
              </span>
            </div>
          </div>

          {/* Shared Device */}
          <div className="grid grid-cols-1 sm:grid-cols-12 p-3 sm:px-4 items-center gap-2 hover:bg-stone-50/40">
            <div className="sm:col-span-4 flex items-center gap-2 font-bold text-stone-900">
              <MonitorIcon className="w-4 h-4 text-[#D97706]" />
              <span>Shared Device</span>
            </div>
            <span className="sm:col-span-5 text-stone-600">Detects accounts using the same device.</span>
            <div className="sm:col-span-3 sm:text-right">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EAE5DC] text-[10px] font-mono font-medium text-stone-700">
                Account ↔ Device
              </span>
            </div>
          </div>

          {/* Shared Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-12 p-3 sm:px-4 items-center gap-2 hover:bg-stone-50/40">
            <div className="sm:col-span-4 flex items-center gap-2 font-bold text-stone-900">
              <SharedPhonesIcon className="w-4 h-4 text-[#0D9488]" />
              <span>Shared Phone</span>
            </div>
            <span className="sm:col-span-5 text-stone-600">Detects accounts linked to the same phone number.</span>
            <div className="sm:col-span-3 sm:text-right">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EAE5DC] text-[10px] font-mono font-medium text-stone-700">
                Account → Person → PhoneNumber
              </span>
            </div>
          </div>

          {/* Shared Address */}
          <div className="grid grid-cols-1 sm:grid-cols-12 p-3 sm:px-4 items-center gap-2 hover:bg-stone-50/40">
            <div className="sm:col-span-4 flex items-center gap-2 font-bold text-stone-900">
              <HomeIcon className="w-4 h-4 text-[#0E4D45]" />
              <span>Shared Address</span>
            </div>
            <span className="sm:col-span-5 text-stone-600">Detects accounts linked to the same address.</span>
            <div className="sm:col-span-3 sm:text-right">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EAE5DC] text-[10px] font-mono font-medium text-stone-700">
                Account → Person → Address
              </span>
            </div>
          </div>

          {/* Fan-in / Smurfing */}
          <div className="grid grid-cols-1 sm:grid-cols-12 p-3 sm:px-4 items-center gap-2 hover:bg-stone-50/40">
            <div className="sm:col-span-4 flex items-center gap-2 font-bold text-stone-900">
              <SmurfingIcon className="w-4 h-4 text-[#0E4D45]" />
              <span>Fan-in / Smurfing</span>
            </div>
            <span className="sm:col-span-5 text-stone-600">Detects high inbound concentration and rapid outbound dispersal.</span>
            <div className="sm:col-span-3 sm:text-right">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EAE5DC] text-[10px] font-mono font-medium text-stone-700">
                Heuristic based
              </span>
            </div>
          </div>
        </div>

        {/* Info Note Bar */}
        <div className="bg-[#E6F4F1] border border-[#BDE3DC] rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-xs text-[#0E4D45]">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Risk Score is calculated using a rule-based heuristic algorithm. Maximum score: 100</span>
        </div>
      </div>

      {/* Card 4: Application Information */}
      <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 sm:p-7 shadow-xs text-left">
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">Application Information</h2>
            <p className="text-xs text-stone-500 mt-0.5">Technical details about the application.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-[#EAE5DC] rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
            <div className="grid grid-cols-12 p-3 px-4">
              <span className="col-span-5 font-semibold text-stone-700">Application</span>
              <span className="col-span-7 font-bold text-stone-900">FraudNet Tracker</span>
            </div>
            <div className="grid grid-cols-12 p-3 px-4">
              <span className="col-span-5 font-semibold text-stone-700">Version</span>
              <span className="col-span-7 font-mono text-stone-800">1.0.0</span>
            </div>
            <div className="grid grid-cols-12 p-3 px-4">
              <span className="col-span-5 font-semibold text-stone-700">Backend</span>
              <span className="col-span-7 text-stone-800">Node.js (Express)</span>
            </div>
          </div>

          <div className="border border-[#EAE5DC] rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
            <div className="grid grid-cols-12 p-3 px-4">
              <span className="col-span-5 font-semibold text-stone-700">Database</span>
              <span className="col-span-7 font-bold text-stone-900">CognoDB Cloud</span>
            </div>
            <div className="grid grid-cols-12 p-3 px-4">
              <span className="col-span-5 font-semibold text-stone-700">Detection Engine</span>
              <span className="col-span-7 text-stone-800">Cypher-based graph analysis</span>
            </div>
            <div className="grid grid-cols-12 p-3 px-4">
              <span className="col-span-5 font-semibold text-stone-700">Authentication</span>
              <span className="col-span-7 font-mono text-stone-800">JWT + bcrypt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 5: About Settings */}
      <div className="bg-[#FAF7F2] border border-[#EBE6DD] rounded-2xl p-5 text-left flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-white border border-[#EAE5DC] text-[#0E4D45] flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="space-y-1 text-xs">
          <h3 className="font-bold text-stone-900">About Settings</h3>
          <p className="text-stone-600 leading-relaxed">
            FraudNet Tracker performs investigations on demand using the Investigate Account feature. Results are generated live from the graph database and are not stored permanently.
          </p>
        </div>
      </div>
    </div>
  );
}
