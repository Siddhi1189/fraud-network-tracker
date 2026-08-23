import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header({ onToggleMobile = () => {} }) {
  const { user } = useAuth();
  const location = useLocation();

  // Generate dynamic breadcrumbs based on pathname
  const generateBreadcrumbs = () => {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);

    const crumbs = [{ label: 'Dashboard', path: '/dashboard' }];

    if (parts[0] === 'investigate') {
      crumbs.push({ label: 'Investigate Account', path: '/investigate' });
      if (parts[1]) {
        crumbs.push({ label: parts[1], path: `/investigate/${parts[1]}` });
      }
    } else if (parts[0] === 'graph') {
      crumbs.push({ label: 'Investigate Account', path: '/investigate' });
      crumbs.push({ label: 'Network Graph', path: path });
    } else if (parts[0] === 'patterns') {
      crumbs.push({ label: 'Detection Patterns', path: '/patterns' });
    } else if (parts[0] === 'recent') {
      crumbs.push({ label: 'Recent Investigations', path: '/recent' });
    } else if (parts[0] === 'settings') {
      crumbs.push({ label: 'Settings', path: '/settings' });
    }

    return crumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EBE6DD] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Left: Mobile Drawer Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-xl border border-[#E5E0D8] bg-white text-stone-700 hover:bg-[#FAF7F2] focus:outline-none cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-xs font-medium text-stone-500">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.path + idx}>
              {idx > 0 && <span className="text-stone-300">›</span>}
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-stone-800 font-semibold">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="hover:text-[#0E4D45] transition">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Authenticated Investigator Profile Pill */}
      <div className="flex items-center">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-[#EBE6DD] shadow-2xs">
          <div className="w-7 h-7 rounded-full bg-[#0E4D45] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.email ? user.email.charAt(0).toUpperCase() : 'I'}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-stone-900 leading-tight">
              Investigator
            </div>
            <div className="text-[11px] text-stone-500 font-mono leading-tight truncate max-w-[170px] hidden sm:block">
              {user?.email || 'investigator@fraudnet.com'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
