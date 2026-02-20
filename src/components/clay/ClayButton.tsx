import React from 'react';
import { cn } from '@/lib/utils';

export type ClayVariant = 'round' | 'pill' | 'blob';
export type ClayColor = 'peach' | 'mint' | 'sage' | 'coral' | 'sand' | 'stone';

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ClayVariant;
  color?: ClayColor;
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  children: React.ReactNode;
}

const colorMap: Record<ClayColor, string> = {
  peach: 'bg-clay-peach',
  mint: 'bg-clay-mint',
  sage: 'bg-clay-sage',
  coral: 'bg-clay-coral',
  sand: 'bg-clay-sand',
  stone: 'bg-clay-stone',
};

const textColorMap: Record<ClayColor, string> = {
  peach: 'text-clay-charcoal',
  mint: 'text-clay-charcoal',
  sage: 'text-clay-charcoal',
  coral: 'text-white',
  sand: 'text-clay-charcoal',
  stone: 'text-clay-charcoal',
};

export const ClayButton = React.forwardRef<HTMLButtonElement, ClayButtonProps>(
  ({ 
    variant = 'pill', 
    color = 'peach', 
    size = 'md', 
    isActive = false,
    className, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-250 ease-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-coral/50 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      round: 'rounded-full aspect-square',
      pill: 'rounded-full',
      blob: 'rounded-blob',
    };
    
    const sizeClasses = {
      round: {
        sm: 'w-10 h-10 text-sm',
        md: 'w-14 h-14 text-base',
        lg: 'w-18 h-18 text-lg',
      },
      pill: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
      blob: {
        sm: 'px-5 py-3 text-sm',
        md: 'px-8 py-4 text-base',
        lg: 'px-10 py-5 text-lg',
      },
    };
    
    const shadowClasses = isActive 
      ? 'shadow-clay-inset translate-y-0.5' 
      : 'shadow-clay hover:shadow-clay-lifted hover:-translate-y-0.5 active:shadow-clay-inset active:translate-y-0.5';
    
    const gradientClasses = 'bg-gradient-to-br from-white/40 via-transparent to-transparent';
    
    const borderClasses = 'border border-white/40';
    
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[variant][size],
          colorMap[color],
          textColorMap[color],
          shadowClasses,
          gradientClasses,
          borderClasses,
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ClayButton.displayName = 'ClayButton';
