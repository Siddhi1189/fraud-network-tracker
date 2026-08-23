import React from 'react';

/**
 * Color-coded risk badge matching the enterprise design system.
 * Risk Levels: LOW, MEDIUM, HIGH, CRITICAL
 */
export default function RiskBadge({ level = 'LOW', score = null, size = 'md' }) {
  const normalizedLevel = (level || 'LOW').toUpperCase();

  let colorClasses = 'bg-[#E6F4F1] border-[#BDE3DC] text-[#0E4D45]';

  switch (normalizedLevel) {
    case 'CRITICAL':
      colorClasses = 'bg-rose-100 border-rose-300 text-rose-800 font-bold';
      break;
    case 'HIGH':
      colorClasses = 'bg-red-50 border-red-200 text-red-700 font-semibold';
      break;
    case 'MEDIUM':
      colorClasses = 'bg-amber-50 border-amber-200 text-amber-800 font-semibold';
      break;
    case 'LOW':
    default:
      colorClasses = 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold';
      break;
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px]'
      : size === 'lg'
      ? 'px-3.5 py-1 text-sm'
      : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${colorClasses} ${sizeClasses} uppercase tracking-wider select-none`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{normalizedLevel}</span>
      {typeof score === 'number' && (
        <span className="font-mono text-stone-600 font-normal">({score})</span>
      )}
    </span>
  );
}
