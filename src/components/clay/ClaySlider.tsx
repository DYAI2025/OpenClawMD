import React from 'react';
import { cn } from '@/lib/utils';

interface ClaySliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  labels?: [string, string];
  showValue?: boolean;
  disabled?: boolean;
}

export const ClaySlider: React.FC<ClaySliderProps> = ({
  value,
  onChange,
  min = 1,
  max = 5,
  step = 1,
  labels,
  showValue = true,
  disabled = false,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div 
      className={cn('w-full', disabled && 'opacity-50 pointer-events-none')}
      style={{ '--percentage': `${percentage}%` } as React.CSSProperties}
    >
      {(labels || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {labels && (
            <span className="text-sm text-clay-charcoal/60">{labels[0]}</span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-clay-charcoal bg-clay-sand px-2 py-0.5 rounded-full">
              {value}
            </span>
          )}
          {labels && (
            <span className="text-sm text-clay-charcoal/60">{labels[1]}</span>
          )}
        </div>
      )}
      
      <div className="relative h-4">
        {/* Track background */}
        <div className="absolute inset-0 rounded-full bg-clay-stone shadow-clay-inset" />
        
        {/* Fill */}
        <div 
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-clay-mint to-clay-sage"
          style={{ width: 'var(--percentage)' }}
        />
        
        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          title="Adjust dimension value"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none bg-transparent m-0 p-0 z-10"
        />
        
        {/* Thumb */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-clay-peach to-clay-coral shadow-clay border-2 border-white/50 dark:border-white/10 pointer-events-none transition-transform duration-150"
          style={{ left: 'calc(var(--percentage) - 12px)' }}
        />
        
        {/* Tick marks */}
        <div className="absolute inset-x-0 top-6 flex justify-between px-1">
          {Array.from({ length: max - min + 1 }, (_, i) => (
            <div 
              key={i} 
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-colors',
                i + min <= value ? 'bg-clay-sage' : 'bg-clay-stone'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
