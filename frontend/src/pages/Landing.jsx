import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import HeroDiagram from '../components/HeroDiagram.jsx';
import {
  HexagonLogo,
  ShieldCheckIcon,
  CircularTransfersIcon,
  MonitorIcon,
  SharedPhonesIcon,
  HomeIcon,
  SmurfingIcon,
  SearchIcon,
  NetworkIcon,
  FileTextIcon,
  TrendingUpIcon,
  ScaleIcon,
  ClockIcon,
  LockIcon,
  ArrowRightIcon,
  LinkedInIcon,
  XTwitterIcon,
  MailIcon,
} from '../components/Icons.jsx';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#111827] flex flex-col font-sans-ui overflow-x-hidden">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EBE6DD] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <HexagonLogo className="w-9 h-9 text-[#0E4D45] transition-transform group-hover:scale-105" />
            <div className="text-left">
              <span className="text-xl font-bold tracking-tight text-[#111827] block leading-none font-sans-ui">
                FraudNet
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#0E4D45] uppercase block mt-0.5 font-sans-ui">
                TRACKER
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
            <a href="#overview" className="hover:text-[#0E4D45] transition">Platform</a>
            <a href="#how-it-works" className="hover:text-[#0E4D45] transition">How It Works</a>
            <a href="#detection" className="hover:text-[#0E4D45] transition">Detection</a>
            <a href="#overview" className="hover:text-[#0E4D45] transition">Network Intelligence</a>
            <a href="#footer" className="hover:text-[#0E4D45] transition">About</a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-xl border border-[#E5E0D8] bg-white hover:bg-[#F5F2EB] text-stone-800 text-sm font-semibold transition"
                >
                  Workspace
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-sm font-medium transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl border border-[#E5E0D8] bg-white hover:bg-[#F5F2EB] text-stone-800 text-sm font-semibold transition"
                >
                  Log in
                </Link>
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl bg-[#0E4D45] hover:bg-[#0B3B34] text-white text-sm font-semibold transition shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#EBE6DD] px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
            <a
              href="#overview"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-stone-700 font-medium hover:bg-[#FAF7F2]"
            >
              Platform
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-stone-700 font-medium hover:bg-[#FAF7F2]"
            >
              How It Works
            </a>
            <a
              href="#detection"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-stone-700 font-medium hover:bg-[#FAF7F2]"
            >
              Detection
            </a>
            <a
              href="#footer"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-stone-700 font-medium hover:bg-[#FAF7F2]"
            >
              About
            </a>
            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full text-center py-2.5 rounded-xl border border-[#E5E0D8] text-stone-800 font-semibold text-sm"
              >
                Log in
              </Link>
              <Link
                to="/login"
                className="w-full text-center py-2.5 rounded-xl bg-[#0E4D45] text-white font-semibold text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Category Kicker */}
              <div className="inline-block">
                <span className="text-[#0E4D45] text-[11px] sm:text-xs font-bold tracking-widest uppercase">
                  FRAUD DETECTION &amp; MONEY MULE NETWORK TRACKER
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif-heading font-semibold text-[#111827] leading-[1.12] tracking-tight">
                Uncover hidden networks.<br />
                <span className="text-[#0E4D45]">Stop financial crime.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl font-sans-ui">
                Graph-powered intelligence to detect suspicious connections, trace money mule networks, and accelerate investigations.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleCtaClick}
                  className="px-6 py-3.5 rounded-xl bg-[#0E4D45] hover:bg-[#0B3B34] text-white font-semibold text-sm sm:text-base transition shadow-md shadow-[#0E4D45]/20 flex items-center gap-2 group cursor-pointer"
                >
                  <span>Start Investigation</span>
                  <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <a
                  href="#overview"
                  className="px-6 py-3.5 rounded-xl border border-[#DCD6CC] bg-white/80 hover:bg-white text-stone-800 font-semibold text-sm sm:text-base transition shadow-xs flex items-center gap-2 group"
                >
                  <span>Explore Platform</span>
                  <ArrowRightIcon className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
                </a>
              </div>

              {/* Trust Badge */}
              <div className="pt-4 flex items-center gap-2.5 text-stone-600 text-xs sm:text-sm font-medium">
                <ShieldCheckIcon className="w-4 h-4 text-[#0E4D45]" />
                <span>Built for investigators. Designed for evidence.</span>
              </div>
            </div>

            {/* Right Diagram Column */}
            <div className="lg:col-span-6 w-full flex justify-center">
              <HeroDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* 3. DETECT WHAT OTHERS MISS — 5-CARD CAPABILITIES ROW */}
      <section id="detection" className="py-16 sm:py-20 border-t border-[#EBE6DD]/80 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Underline */}
          <div className="text-left mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-heading font-semibold text-[#111827] tracking-tight">
              Detect What<br />Others Miss
            </h2>
            <div className="w-12 h-1 bg-[#0E4D45] rounded-full mt-3" />
          </div>

          {/* 5 Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Card 1: Circular Transfers */}
            <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center justify-start">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center mb-4">
                <CircularTransfersIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-2">Circular Transfers</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Identify cyclic fund movement patterns
              </p>
            </div>

            {/* Card 2: Shared Devices */}
            <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center justify-start">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center mb-4">
                <MonitorIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-2">Shared Devices</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Track multiple accounts accessed from same devices
              </p>
            </div>

            {/* Card 3: Shared Phones */}
            <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center justify-start">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center mb-4">
                <SharedPhonesIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-2">Shared Phones</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Find accounts linked through same phone numbers
              </p>
            </div>

            {/* Card 4: Shared Addresses */}
            <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center justify-start">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center mb-4">
                <HomeIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-2">Shared Addresses</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Detect accounts connected via common addresses
              </p>
            </div>

            {/* Card 5: Fan-in / Smurfing */}
            <div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center justify-start">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center mb-4">
                <SmurfingIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-2">Fan-in / Smurfing</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Uncover fan-in and rapid dispersal activities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS — 5-STEP PROCESS ROW */}
      <section id="how-it-works" className="py-16 sm:py-20 border-t border-[#EBE6DD]/80 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Header */}
          <div className="mb-14 inline-block">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-heading font-semibold text-[#111827] tracking-tight">
              How It Works
            </h2>
            <div className="w-12 h-1 bg-[#0E4D45] rounded-full mx-auto mt-3" />
          </div>

          {/* 5 Steps Connected with Dashed Connectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-6 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-16 h-16 rounded-full bg-[#0E4D45] text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
                <SearchIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-bold text-stone-900 mb-1">1. Search</span>
              <p className="text-xs sm:text-sm text-stone-600 max-w-[170px] leading-relaxed">
                Enter an account ID or entity identifier
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-16 h-16 rounded-full bg-[#0E4D45] text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
                <NetworkIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-bold text-stone-900 mb-1">2. Explore</span>
              <p className="text-xs sm:text-sm text-stone-600 max-w-[170px] leading-relaxed">
                Analyze graph relationships and connection paths
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-16 h-16 rounded-full bg-[#0E4D45] text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheckIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-bold text-stone-900 mb-1">3. Detect</span>
              <p className="text-xs sm:text-sm text-stone-600 max-w-[170px] leading-relaxed">
                Run the five graph fraud detection patterns
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-16 h-16 rounded-full bg-[#0E4D45] text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
                <FileTextIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-bold text-stone-900 mb-1">4. Investigate</span>
              <p className="text-xs sm:text-sm text-stone-600 max-w-[170px] leading-relaxed">
                Review transaction trails and connected evidence
              </p>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-16 h-16 rounded-full bg-[#0E4D45] text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
                <TrendingUpIcon className="w-7 h-7" />
              </div>
              <span className="text-sm font-bold text-stone-900 mb-1">5. Assess</span>
              <p className="text-xs sm:text-sm text-stone-600 max-w-[170px] leading-relaxed">
                Review rule-based risk scores and risk levels
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INVESTIGATION OVERVIEW — PREVIEW PANEL SECTION */}
      <section id="overview" className="py-16 sm:py-24 border-t border-[#EBE6DD]/80 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Description Column */}
            <div className="lg:col-span-4 space-y-5 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[#0E4D45] text-xs font-bold tracking-widest uppercase block">
                  INVESTIGATION OVERVIEW
                </span>
                <span className="px-2 py-0.5 rounded bg-[#E6F4F1] border border-[#BDE3DC] text-[#0E4D45] text-[10px] font-semibold">
                  Illustrative Preview
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif-heading font-semibold text-[#111827] leading-tight">
                Investigate. Analyze.<br />
                Take Action.
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Get a complete view of risk, signals, and connections in one place. Drill down into networks, review evidence, and build stronger cases faster.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleCtaClick}
                  className="px-6 py-3 rounded-xl bg-[#0E4D45] hover:bg-[#0B3B34] text-white font-semibold text-sm transition shadow-sm flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore Platform</span>
                  <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Illustrative Dark Mockup Container */}
            <div className="lg:col-span-8">
              <div className="bg-[#0B131E] border border-[#1C2B3C] rounded-2xl shadow-2xl overflow-hidden p-4 sm:p-6 text-white text-left font-sans-ui">
                {/* Mockup Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1C2B3C]/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-300">Example Investigation View</span>
                  </div>

                  {/* Search Box */}
                  <div className="flex items-center gap-2 max-w-xs w-full">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        readOnly
                        value="ACC-010"
                        placeholder="Search account ID..."
                        className="w-full bg-[#14202F] border border-[#24354A] rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none"
                      />
                    </div>
                    <button className="p-1.5 rounded-lg bg-[#0E4D45] text-white">
                      <SearchIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* KPI Quick Metrics */}
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px]">High Risk</span>
                      <span className="font-bold text-rose-400 text-sm">23</span>{' '}
                      <span className="text-[10px] text-rose-400">+15%</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Medium Risk</span>
                      <span className="font-bold text-amber-400 text-sm">67</span>{' '}
                      <span className="text-[10px] text-amber-400">+8%</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Total Investigations</span>
                      <span className="font-bold text-emerald-400 text-sm">128</span>{' '}
                      <span className="text-[10px] text-emerald-400">+12%</span>
                    </div>
                  </div>
                </div>

                {/* Mockup Main Body Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-4">
                  {/* Left Column: Recent Investigations Table */}
                  <div className="sm:col-span-6 bg-[#101A26] border border-[#1E2E42] rounded-xl p-3.5">
                    <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2.5">
                      Recent Investigations
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1.5 border-b border-[#1E2E42]/60">
                        <span className="font-mono text-stone-200 font-medium">ACC-010</span>
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px]">98</span>
                        <span className="text-stone-400 text-[10px]">4 signals</span>
                        <span className="text-stone-500 text-[10px]">2m ago</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-[#1E2E42]/60">
                        <span className="font-mono text-stone-200 font-medium">ACC-005</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">76</span>
                        <span className="text-stone-400 text-[10px]">3 signals</span>
                        <span className="text-stone-500 text-[10px]">15m ago</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-[#1E2E42]/60">
                        <span className="font-mono text-stone-200 font-medium">ACC-023</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">45</span>
                        <span className="text-stone-400 text-[10px]">2 signals</span>
                        <span className="text-stone-500 text-[10px]">1h ago</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5">
                        <span className="font-mono text-stone-200 font-medium">ACC-009</span>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold text-[10px]">32</span>
                        <span className="text-stone-400 text-[10px]">1 signal</span>
                        <span className="text-stone-500 text-[10px]">3h ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Risk Distribution Donut Mockup */}
                  <div className="sm:col-span-3 bg-[#101A26] border border-[#1E2E42] rounded-xl p-3.5 flex flex-col justify-between">
                    <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                      Risk Distribution
                    </div>
                    <div className="flex flex-col items-center justify-center my-2">
                      <div className="w-16 h-16 rounded-full border-4 border-rose-500 border-t-amber-400 border-r-emerald-500 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-stone-300">128</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-[10px] text-stone-300">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>High 52%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Medium 28%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Low 20%</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Top Signals Frequency List */}
                  <div className="sm:col-span-3 bg-[#101A26] border border-[#1E2E42] rounded-xl p-3.5">
                    <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                      Top Signals
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between items-center text-stone-300">
                        <span className="truncate">Circular Transfers</span>
                        <span className="font-bold text-stone-200">34</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-300">
                        <span className="truncate">Shared Devices</span>
                        <span className="font-bold text-stone-200">28</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-300">
                        <span className="truncate">Fan-in / Smurfing</span>
                        <span className="font-bold text-stone-200">22</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-300">
                        <span className="truncate">Shared Phones</span>
                        <span className="font-bold text-stone-200">18</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-300">
                        <span className="truncate">Shared Addresses</span>
                        <span className="font-bold text-stone-200">16</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 4-ITEM VALUE PROPOSITIONS ROW */}
      <section className="py-16 sm:py-20 border-t border-[#EBE6DD]/80 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center mb-3 shadow-xs">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1.5">Comprehensive Detection</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xs">
                Multi-signal analysis catches what single-point checks miss.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center mb-3 shadow-xs">
                <ScaleIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1.5">Evidence Based</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xs">
                Every alert is backed by real connections and transactions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center mb-3 shadow-xs">
                <ClockIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1.5">Graph-Based Intelligence</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xs">
                Detect multi-hop graph patterns on demand through direct Cypher queries.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE5DC] text-[#0E4D45] flex items-center justify-center mb-3 shadow-xs">
                <LockIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1.5">Secure by Design</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xs">
                Built with JWT authentication, password hashing, and investigator privacy in mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DARK CTA BAND */}
      <section className="py-12 sm:py-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0E4D45] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-5 z-10">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 flex-shrink-0">
                <HexagonLogo className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl sm:text-3xl font-serif-heading font-semibold text-white tracking-tight">
                  Ready to uncover the network?
                </h2>
                <p className="text-emerald-100/80 text-sm sm:text-base mt-1">
                  Join investigators who are turning data into action.
                </p>
              </div>
            </div>

            <div className="z-10 flex-shrink-0">
              <button
                onClick={handleCtaClick}
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-[#0E4D45] font-bold text-sm sm:text-base transition shadow-md flex items-center gap-2 group cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer id="footer" className="border-t border-[#EBE6DD] bg-[#FAF7F2] pt-14 pb-8 text-stone-600 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#EBE6DD]/80">
            {/* Brand Column */}
            <div className="md:col-span-4 space-y-4">
              <Link to="/" className="flex items-center gap-2.5">
                <HexagonLogo className="w-8 h-8 text-[#0E4D45]" />
                <div>
                  <span className="text-lg font-bold tracking-tight text-[#111827] block leading-none font-sans-ui">
                    FraudNet
                  </span>
                  <span className="text-[9px] font-bold tracking-widest text-[#0E4D45] uppercase block mt-0.5 font-sans-ui">
                    TRACKER
                  </span>
                </div>
              </Link>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm leading-relaxed">
                Graph-powered platform to detect fraud, trace networks, and accelerate investigations.
              </p>
              <div className="flex items-center gap-3 pt-1 text-stone-400">
                <a href="#footer" className="p-2 rounded-lg hover:text-[#0E4D45] hover:bg-white transition">
                  <LinkedInIcon className="w-4 h-4" />
                </a>
                <a href="#footer" className="p-2 rounded-lg hover:text-[#0E4D45] hover:bg-white transition">
                  <XTwitterIcon className="w-4 h-4" />
                </a>
                <a href="#footer" className="p-2 rounded-lg hover:text-[#0E4D45] hover:bg-white transition">
                  <MailIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-5 gap-6 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-stone-900 mb-3">Platform</h4>
                <ul className="space-y-2 text-stone-600">
                  <li><a href="#overview" className="hover:text-[#0E4D45] transition">Overview</a></li>
                  <li><a href="#detection" className="hover:text-[#0E4D45] transition">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-[#0E4D45] transition">How It Works</a></li>
                  <li><a href="#overview" className="hover:text-[#0E4D45] transition">Security</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-3">Detection</h4>
                <ul className="space-y-2 text-stone-600">
                  <li><a href="#detection" className="hover:text-[#0E4D45] transition">Circular Transfers</a></li>
                  <li><a href="#detection" className="hover:text-[#0E4D45] transition">Shared Devices</a></li>
                  <li><a href="#detection" className="hover:text-[#0E4D45] transition">Shared Phones</a></li>
                  <li><a href="#detection" className="hover:text-[#0E4D45] transition">Shared Addresses</a></li>
                  <li><a href="#detection" className="hover:text-[#0E4D45] transition">Fan-in / Smurfing</a></li>
                  <li><a href="#detection" className="hover:text-[#0E4D45] transition">All Signals</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-3">Network Intelligence</h4>
                <ul className="space-y-2 text-stone-600">
                  <li><a href="#overview" className="hover:text-[#0E4D45] transition">Entity Resolution</a></li>
                  <li><a href="#overview" className="hover:text-[#0E4D45] transition">Network Explorer</a></li>
                  <li><a href="#detection" className="hover:text-[#0E4D45] transition">Risk Scoring</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-3">Company</h4>
                <ul className="space-y-2 text-stone-600">
                  <li><a href="#footer" className="hover:text-[#0E4D45] transition">About Us</a></li>
                  <li><a href="#footer" className="hover:text-[#0E4D45] transition">Careers</a></li>
                  <li><a href="#footer" className="hover:text-[#0E4D45] transition">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-3">Resources</h4>
                <ul className="space-y-2 text-stone-600">
                  <li><a href="#overview" className="hover:text-[#0E4D45] transition">Documentation</a></li>
                  <li><a href="#overview" className="hover:text-[#0E4D45] transition">API</a></li>
                  <li><a href="#footer" className="hover:text-[#0E4D45] transition">Support Center</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Legal / Copyright Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <div>
              &copy; 2025 FraudNet Tracker. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#footer" className="hover:text-stone-700 transition">Privacy Policy</a>
              <span className="text-stone-300">|</span>
              <a href="#footer" className="hover:text-stone-700 transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
