import React from 'react';

export function LoadingState({ message = 'Loading data...', submessage = 'Connecting to graph engine...' }) {
  return (
    <div className="bg-white border border-[#EBE6DD] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
      <div className="w-10 h-10 border-3 border-[#0E4D45] border-t-transparent rounded-full animate-spin" />
      <div>
        <h3 className="text-base font-semibold text-[#111827]">{message}</h3>
        {submessage && <p className="text-xs text-stone-500 mt-1">{submessage}</p>}
      </div>
    </div>
  );
}

export function ErrorState({ title = 'Error', message = 'Something went wrong.', onRetry = null }) {
  return (
    <div className="bg-white border border-rose-200 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="1.75" />
          <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      </div>
      <div className="max-w-md">
        <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
        <p className="text-sm text-stone-600 mt-1.5 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#0E4D45] hover:bg-[#0B3B34] text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'No records found', message = 'No data available for this view.' }) {
  return (
    <div className="bg-white border border-[#EBE6DD] rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
      <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#EAE5DC] text-stone-400 flex items-center justify-center">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect width="18" height="18" x="3" y="3" rx="2" strokeWidth="1.5" />
          <path d="M9 12h6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="max-w-sm">
        <h4 className="text-sm font-semibold text-stone-800">{title}</h4>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
