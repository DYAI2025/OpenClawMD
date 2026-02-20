import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface ClayStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  allowNavigation?: boolean;
}

export const ClayStepper: React.FC<ClayStepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  allowNavigation = false,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="flex flex-col items-center flex-1">
                <button
                  type="button"
                  onClick={() => allowNavigation && onStepClick?.(index)}
                  disabled={!allowNavigation || isUpcoming}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-250 ease-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-coral/50',
                    isCompleted && 'bg-clay-mint text-clay-charcoal shadow-clay',
                    isCurrent && 'bg-clay-coral text-white shadow-clay scale-110',
                    isUpcoming && 'bg-clay-stone text-clay-charcoal/50',
                    allowNavigation && !isUpcoming && 'cursor-pointer hover:shadow-clay-lifted'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </button>
                
                <div className="mt-2 text-center">
                  <p className={cn(
                    'text-sm font-medium transition-colors',
                    isCurrent ? 'text-clay-charcoal' : 'text-clay-charcoal/60'
                  )}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-clay-charcoal/50 mt-0.5 max-w-[100px]">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center justify-center pt-5 px-2">
                  <div className={cn(
                    'h-1 w-full rounded-full transition-colors duration-500',
                    isCompleted ? 'bg-clay-mint' : 'bg-clay-stone'
                  )} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
