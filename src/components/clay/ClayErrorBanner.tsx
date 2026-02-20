import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, X } from 'lucide-react';

interface ClayErrorBannerProps {
  title?: string;
  message: string;
  details?: string[];
  onDismiss?: () => void;
  severity?: 'error' | 'warning';
}

export const ClayErrorBanner: React.FC<ClayErrorBannerProps> = ({
  title = 'Configuration Issue',
  message,
  details,
  onDismiss,
  severity = 'error',
}) => {
  return (
    <div className={cn(
      'rounded-xl p-4 shadow-clay border border-white/30',
      severity === 'error' 
        ? 'bg-gradient-to-br from-clay-coral/20 to-clay-coral/10' 
        : 'bg-gradient-to-br from-clay-sand to-clay-peach/50'
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          severity === 'error' ? 'bg-clay-coral text-white' : 'bg-clay-sand text-clay-charcoal'
        )}>
          <AlertTriangle className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'font-semibold',
            severity === 'error' ? 'text-clay-coral' : 'text-clay-charcoal'
          )}>
            {title}
          </h4>
          <p className="text-sm text-clay-charcoal/80 mt-1">
            {message}
          </p>
          
          {details && details.length > 0 && (
            <ul className="mt-2 space-y-1">
              {details.map((detail, index) => (
                <li 
                  key={index} 
                  className="text-sm text-clay-charcoal/70 flex items-start gap-2"
                >
                  <span className="text-clay-coral mt-1">•</span>
                  {detail}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-full hover:bg-clay-stone/50 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-clay-charcoal/60" />
          </button>
        )}
      </div>
    </div>
  );
};
