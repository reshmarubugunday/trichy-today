'use client';

import { NewsCategory } from '@/types/news';

const categoryColors: Record<NewsCategory | string, string> = {
  local: 'bg-blue-100 text-blue-700',
  business: 'bg-green-100 text-green-700',
  entertainment: 'bg-purple-100 text-purple-700',
  sports: 'bg-orange-100 text-orange-700',
  politics: 'bg-red-100 text-red-700',
  education: 'bg-cyan-100 text-cyan-700',
  health: 'bg-teal-100 text-teal-700',
};

interface BadgeProps {
  label: string;
  variant?: 'category' | 'breaking' | 'new' | 'premium' | 'sponsored' | 'verified';
  category?: string;
  className?: string;
}

export function Badge({ label, variant = 'category', category, className = '' }: BadgeProps) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide uppercase';

  if (variant === 'breaking') {
    return (
      <span className={`${base} bg-red-600 text-white animate-pulse ${className}`}>
        {label}
      </span>
    );
  }
  if (variant === 'premium') {
    return (
      <span className={`${base} bg-amber-500 text-white ${className}`}>
        {label}
      </span>
    );
  }
  if (variant === 'sponsored') {
    return (
      <span className={`${base} bg-gray-100 text-gray-400 border border-gray-200 ${className}`}>
        {label}
      </span>
    );
  }
  if (variant === 'verified') {
    return (
      <span className={`${base} bg-green-50 text-green-600 border border-green-200 ${className}`}>
        ✓ {label}
      </span>
    );
  }
  if (variant === 'new') {
    return (
      <span className={`${base} bg-emerald-500 text-white ${className}`}>
        {label}
      </span>
    );
  }

  const colorClass = category ? categoryColors[category] ?? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-600';
  return (
    <span className={`${base} ${colorClass} ${className}`}>
      {label}
    </span>
  );
}
