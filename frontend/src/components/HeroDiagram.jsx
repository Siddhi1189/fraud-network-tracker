import React from 'react';
import {
  CreditCardIcon,
  MonitorIcon,
  SmartPhoneIcon,
  HomeIcon,
  ShieldCheckIcon,
  NetworkIcon,
  RadarIcon,
  BarChartIcon,
  HexagonLogo,
} from './Icons.jsx';

export default function HeroDiagram() {
  return (
    <div className="relative w-full max-w-[620px] mx-auto select-none">
      {/* Background ambient warm illumination */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#E6F4F1]/60 via-[#F5EFE6]/40 to-transparent rounded-3xl -z-10 blur-2xl transform scale-95 pointer-events-none" />

      {/* SVG Connecting Relationship Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none -z-0"
        viewBox="0 0 620 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Inputs -> Center Hub Lines */}
        {/* Accounts (y:55) -> Hub Center (x:310, y:220) */}
        <path
          d="M 125 55 C 190 55, 230 180, 270 205"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 125 55 C 190 55, 230 180, 270 205"
          stroke="#0E4D45"
          strokeWidth="2"
          strokeDasharray="5 7"
          className="animate-flow"
          fill="none"
        />

        {/* Devices (y:155) -> Hub Center */}
        <path
          d="M 125 155 C 180 155, 230 205, 270 215"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 125 155 C 180 155, 230 205, 270 215"
          stroke="#D97706"
          strokeWidth="2"
          strokeDasharray="5 7"
          className="animate-flow"
          fill="none"
        />

        {/* Phones (y:255) -> Hub Center */}
        <path
          d="M 125 255 C 180 255, 230 230, 270 225"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 125 255 C 180 255, 230 230, 270 225"
          stroke="#0D9488"
          strokeWidth="2"
          strokeDasharray="5 7"
          className="animate-flow"
          fill="none"
        />

        {/* Addresses (y:355) -> Hub Center */}
        <path
          d="M 125 355 C 190 355, 230 260, 270 235"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 125 355 C 190 355, 230 260, 270 235"
          stroke="#CA8A04"
          strokeWidth="2"
          strokeDasharray="5 7"
          className="animate-flow"
          fill="none"
        />

        {/* Center Hub -> Right Outputs Lines */}
        {/* Hub -> Risk Scoring (y:55) */}
        <path
          d="M 350 205 C 390 180, 430 55, 495 55"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 350 205 C 390 180, 430 55, 495 55"
          stroke="#0E4D45"
          strokeWidth="2"
          strokeDasharray="5 7"
          className="animate-flow"
          fill="none"
        />

        {/* Hub -> Link Analysis (y:155) */}
        <path
          d="M 350 215 C 390 205, 440 155, 495 155"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 350 215 C 390 205, 440 155, 495 155"
          stroke="#0D9488"
          strokeWidth="2"
          strokeDasharray="5 7"
          className="animate-flow"
          fill="none"
        />

        {/* Hub -> Pattern Detection (y:255) */}
        <path
          d="M 350 225 C 390 230, 440 255, 495 255"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 350 225 C 390 230, 440 255, 495 255"
          stroke="#0E4D45"
          strokeWidth="2"
          strokeDasharray="5 7"
          className="animate-flow"
          fill="none"
        />

        {/* Hub -> Investigation Insights (y:355) */}
        <path
          d="M 350 235 C 390 260, 430 355, 495 355"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 350 235 C 390 260, 430 355, 495 355"
          stroke="#D97706"
          strokeWidth="2"
          strokeDasharray="5 7"
          className="animate-flow"
          fill="none"
        />

        {/* Node anchor dots */}
        <circle cx="125" cy="55" r="4" fill="#0E4D45" />
        <circle cx="125" cy="155" r="4" fill="#D97706" />
        <circle cx="125" cy="255" r="4" fill="#0D9488" />
        <circle cx="125" cy="355" r="4" fill="#CA8A04" />
        <circle cx="495" cy="55" r="4" fill="#0E4D45" />
        <circle cx="495" cy="155" r="4" fill="#0D9488" />
        <circle cx="495" cy="255" r="4" fill="#0E4D45" />
        <circle cx="495" cy="355" r="4" fill="#D97706" />
      </svg>

      {/* Main 3-Column Diagram Grid */}
      <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center py-6 sm:py-8">
        {/* Left Column: 4 Input Entities */}
        <div className="col-span-3 space-y-4 sm:space-y-6 z-10">
          <div className="bg-white border border-[#EBE6DD] rounded-xl p-2.5 sm:p-3 shadow-md shadow-stone-200/40 flex flex-col items-center justify-center text-center transition hover:-translate-y-0.5">
            <div className="text-stone-700 mb-1">
              <CreditCardIcon className="w-5 h-5 sm:w-6 sm:h-6 text-stone-700" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-stone-800">Accounts</span>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-xl p-2.5 sm:p-3 shadow-md shadow-stone-200/40 flex flex-col items-center justify-center text-center transition hover:-translate-y-0.5">
            <div className="text-stone-700 mb-1">
              <MonitorIcon className="w-5 h-5 sm:w-6 sm:h-6 text-stone-700" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-stone-800">Devices</span>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-xl p-2.5 sm:p-3 shadow-md shadow-stone-200/40 flex flex-col items-center justify-center text-center transition hover:-translate-y-0.5">
            <div className="text-stone-700 mb-1">
              <SmartPhoneIcon className="w-5 h-5 sm:w-6 sm:h-6 text-stone-700" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-stone-800">Phones</span>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-xl p-2.5 sm:p-3 shadow-md shadow-stone-200/40 flex flex-col items-center justify-center text-center transition hover:-translate-y-0.5">
            <div className="text-stone-700 mb-1">
              <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-stone-700" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-stone-800">Addresses</span>
          </div>
        </div>

        {/* Center Column: Data Flow Badges & Isometric Central Hub */}
        <div className="col-span-5 flex flex-col items-center justify-center relative min-h-[380px] z-10">
          {/* Top Left Badge: Transactions */}
          <div className="absolute top-8 left-2 sm:left-4 z-20">
            <span className="px-2.5 py-1 rounded-md bg-[#0F5147] text-white text-[10px] sm:text-xs font-semibold shadow-sm tracking-wide">
              Transactions
            </span>
          </div>

          {/* Upper Left Badge: Behavior */}
          <div className="absolute top-[138px] left-0 sm:left-2 z-20">
            <span className="px-2.5 py-1 rounded-md bg-[#D97706] text-white text-[10px] sm:text-xs font-semibold shadow-sm tracking-wide">
              Behavior
            </span>
          </div>

          {/* Lower Left Badge: Identity */}
          <div className="absolute bottom-[138px] left-2 sm:left-4 z-20">
            <span className="px-2.5 py-1 rounded-md bg-[#0D9488] text-white text-[10px] sm:text-xs font-semibold shadow-sm tracking-wide">
              Identity
            </span>
          </div>

          {/* Bottom Left Badge: Location */}
          <div className="absolute bottom-8 left-0 sm:left-2 z-20">
            <span className="px-2.5 py-1 rounded-md bg-[#CA8A04] text-white text-[10px] sm:text-xs font-semibold shadow-sm tracking-wide">
              Location
            </span>
          </div>

          {/* Multi-Layered Isometric Central Processing Hub */}
          <div className="relative flex items-center justify-center animate-float my-auto">
            {/* Layer 3 (Bottom) */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#D1EBE5] to-[#BDE3DC] border border-[#A2D4CA] shadow-xl transform rotate-45 scale-90 translate-y-3 opacity-60" />
            
            {/* Layer 2 (Middle) */}
            <div className="absolute w-22 h-22 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-tr from-[#E6F4F1] to-[#D1EBE5] border border-[#BDE3DC] shadow-lg transform rotate-45 scale-95 translate-y-1 opacity-80" />
            
            {/* Layer 1 (Top / Active Hub with Brand Logo) */}
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-[#A2D4CA] shadow-2xl flex items-center justify-center transform hover:scale-105 transition">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#E6F4F1] border border-[#BDE3DC]">
                <HexagonLogo className="w-7 h-7 sm:w-9 sm:h-9 text-[#0E4D45]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Output Analytics */}
        <div className="col-span-4 space-y-4 sm:space-y-6 z-10">
          <div className="bg-white border border-[#EBE6DD] rounded-xl p-2.5 sm:p-3 shadow-md shadow-stone-200/40 flex items-center gap-2.5 sm:gap-3 transition hover:-translate-y-0.5">
            <div className="p-1.5 sm:p-2 rounded-lg bg-[#FAF7F2] border border-[#EBE6DD] text-stone-700">
              <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-stone-700" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-stone-800">Risk Scoring</span>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-xl p-2.5 sm:p-3 shadow-md shadow-stone-200/40 flex items-center gap-2.5 sm:gap-3 transition hover:-translate-y-0.5">
            <div className="p-1.5 sm:p-2 rounded-lg bg-[#FAF7F2] border border-[#EBE6DD] text-stone-700">
              <NetworkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-stone-700" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-stone-800">Link Analysis</span>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-xl p-2.5 sm:p-3 shadow-md shadow-stone-200/40 flex items-center gap-2.5 sm:gap-3 transition hover:-translate-y-0.5">
            <div className="p-1.5 sm:p-2 rounded-lg bg-[#FAF7F2] border border-[#EBE6DD] text-stone-700">
              <RadarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-stone-700" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-stone-800 whitespace-nowrap">Pattern Detection</span>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-xl p-2.5 sm:p-3 shadow-md shadow-stone-200/40 flex items-center gap-2.5 sm:gap-3 transition hover:-translate-y-0.5">
            <div className="p-1.5 sm:p-2 rounded-lg bg-[#FAF7F2] border border-[#EBE6DD] text-stone-700">
              <BarChartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-stone-700" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-stone-800 whitespace-nowrap">Investigation Insights</span>
          </div>
        </div>
      </div>
    </div>
  );
}
