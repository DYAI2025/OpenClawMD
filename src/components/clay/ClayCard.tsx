import React from 'react';
import { cn } from '@/lib/utils';

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isInteractive?: boolean;
  isPressed?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const ClayCard = React.forwardRef<HTMLDivElement, ClayCardProps>(
  ({ 
    children, 
    isInteractive = false,
    isPressed = false,
    padding = 'md',
    className,
    ...props 
  }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };
    
    const shadowClasses = isPressed 
      ? 'shadow-clay-inset' 
      : isInteractive 
        ? 'shadow-clay hover:shadow-clay-lifted hover:-translate-y-1 active:shadow-clay-inset active:translate-y-0' 
        : 'shadow-clay';
    
    return (
      <div
        ref={ref}
        className={cn(
          'bg-clay-base rounded-xl border border-white/50',
          'bg-gradient-to-br from-white/50 via-transparent to-transparent',
          paddingClasses[padding],
          shadowClasses,
          isInteractive && 'cursor-pointer transition-all duration-250 ease-clay',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ClayCard.displayName = 'ClayCard';

// ClayCard Header
interface ClayCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ClayCardHeader = React.forwardRef<HTMLDivElement, ClayCardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

ClayCardHeader.displayName = 'ClayCardHeader';

// ClayCard Title
interface ClayCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const ClayCardTitle = React.forwardRef<HTMLHeadingElement, ClayCardTitleProps>(
  ({ children, className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-semibold text-clay-charcoal', className)}
      {...props}
    >
      {children}
    </h3>
  )
);

ClayCardTitle.displayName = 'ClayCardTitle';

// ClayCard Description
interface ClayCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const ClayCardDescription = React.forwardRef<HTMLParagraphElement, ClayCardDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-clay-charcoal/70 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  )
);

ClayCardDescription.displayName = 'ClayCardDescription';

// ClayCard Content
interface ClayCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ClayCardContent = React.forwardRef<HTMLDivElement, ClayCardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('', className)}
      {...props}
    >
      {children}
    </div>
  )
);

ClayCardContent.displayName = 'ClayCardContent';

// ClayCard Footer
interface ClayCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ClayCardFooter = React.forwardRef<HTMLDivElement, ClayCardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-4 pt-4 border-t border-clay-stone/30', className)}
      {...props}
    >
      {children}
    </div>
  )
);

ClayCardFooter.displayName = 'ClayCardFooter';
