/**
 * Overclaw Banner
 * 
 * Persistent red banner for high-risk configurations
 */

import { AlertTriangle } from 'lucide-react';

interface OverclawBannerProps {
  className?: string;
}

export function OverclawBanner({ className = '' }: OverclawBannerProps) {
  return (
    <div 
      className={`
        bg-red-500 text-white px-4 py-3 
        flex items-center justify-center gap-2
        font-semibold text-sm
        ${className}
      `}
    >
      <AlertTriangle className="w-5 h-5" />
      <span>HIGH AUTONOMY CONFIGURATION ENABLED</span>
      <span className="mx-2">•</span>
      <span className="opacity-90">Risk Level: HIGH</span>
    </div>
  );
}
