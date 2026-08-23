import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { HexagonLogo } from '../components/Icons.jsx';

export default function DashboardStub() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#111827] flex flex-col items-center justify-center p-6 antialiased">
      <div className="w-full max-w-lg bg-white border border-[#EBE6DD] rounded-2xl p-8 shadow-xl shadow-stone-200/50 text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <HexagonLogo className="w-10 h-10 text-[#0E4D45]" />
            <div className="text-left">
              <span className="text-xl font-bold tracking-tight text-[#111827] block leading-none">
                FraudNet
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#0E4D45] uppercase block mt-0.5">
                TRACKER
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F1] border border-[#BDE3DC] text-[#0E4D45] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#0E4D45] animate-pulse" />
            Authenticated Session Active
          </div>
          <h1 className="text-2xl font-serif-heading font-bold text-[#111827]">
            Investigator Workspace
          </h1>
          <p className="text-stone-600 text-sm">
            You are successfully logged in as{' '}
            <span className="font-semibold text-[#111827]">{user?.email}</span> ({user?.role || 'investigator'}).
          </p>
        </div>

        <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#EBE6DD] text-xs text-stone-500 leading-relaxed text-left">
          <p className="font-semibold text-stone-700 mb-1">Milestone Scope Note:</p>
          This dashboard route serves as the authenticated landing target for Phase 6. Full interactive network graphs, visual query explorers, and case investigation workspaces will be built in the dedicated dashboard phase.
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2.5 rounded-lg border border-[#E5E0D8] hover:bg-[#F5F2EB] text-stone-700 text-sm font-medium transition"
          >
            Back to Home
          </button>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-lg bg-[#0E4D45] hover:bg-[#0B3B34] text-white text-sm font-medium transition shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
