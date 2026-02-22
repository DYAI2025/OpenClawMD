import React from 'react';
import { cn } from '@/lib/utils';

interface ClayToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const ClayToggle: React.FC<ClayToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <div className={cn('flex items-center justify-between', disabled && 'opacity-50')}>
      {(label || description) && (
        <div className="flex-1 mr-4">
          {label && (
            <label className="text-sm font-medium text-clay-charcoal">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-clay-charcoal/60 mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
      
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          'relative w-14 h-8 rounded-full transition-all duration-250 ease-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-coral/50',
          checked 
            ? 'bg-gradient-to-r from-clay-mint to-clay-sage' 
            : 'bg-clay-stone shadow-clay-inset'
        )}
      >
        <span
          className={cn(
            'absolute top-1 left-1 w-6 h-6 rounded-full bg-gradient-to-br from-white to-clay-base dark:from-white/15 dark:to-clay-sand shadow-clay border border-white/50 dark:border-white/[0.06] transition-all duration-250 ease-clay',
            checked && 'translate-x-6'
          )}
        />
      </button>
    </div>
  );
};
