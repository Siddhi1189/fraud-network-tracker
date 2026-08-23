import React from 'react';

export default function StatusBadge({ status = 'Operational', type = 'success' }) {
  let styles = 'bg-emerald-50 border-emerald-200 text-emerald-800';

  if (type === 'warning') {
    styles = 'bg-amber-50 border-amber-200 text-amber-800';
  } else if (type === 'error') {
    styles = 'bg-rose-50 border-rose-200 text-rose-800';
  } else if (type === 'neutral') {
    styles = 'bg-stone-100 border-stone-200 text-stone-700';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{status}</span>
    </span>
  );
}
