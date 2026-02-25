/**
 * FinalTouchFieldRow
 *
 * Individual row for a single incomplete/default field.
 * Shows label, current value, suggestion chips, text input, and skip toggle.
 */

import { useState } from 'react';
import { Check, SkipForward } from 'lucide-react';
import type { IncompleteField } from '@/lib/animae-agentis/finalTouch';

interface FinalTouchFieldRowProps {
  field: IncompleteField;
  onApply: (key: string, value: string) => void;
  onSkip: (key: string) => void;
  isSkipped: boolean;
  isApplied: boolean;
}

export function FinalTouchFieldRow({
  field,
  onApply,
  onSkip,
  isSkipped,
  isApplied,
}: FinalTouchFieldRowProps) {
  const [customValue, setCustomValue] = useState('');

  const handleSuggestionClick = (suggestion: string) => {
    setCustomValue(suggestion);
    onApply(field.key, suggestion);
  };

  const handleCustomApply = () => {
    if (customValue.trim()) {
      onApply(field.key, customValue.trim());
    }
  };

  return (
    <div className={`
      rounded-xl p-4 border transition-colors
      ${isApplied
        ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/30'
        : isSkipped
          ? 'bg-clay-sand/30 dark:bg-white/[0.02] border-clay-stone/20 opacity-60'
          : 'bg-white/50 dark:bg-white/[0.03] border-white/60 dark:border-white/[0.06]'
      }
    `}>
      {/* Header: label + status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-clay-charcoal">{field.label}</span>
          <span className={`
            px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide
            ${field.isDefault
              ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
              : 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
            }
          `}>
            {field.isDefault ? 'default' : 'custom'}
          </span>
          {isApplied && (
            <Check className="w-4 h-4 text-emerald-500" />
          )}
        </div>
        <button
          onClick={() => onSkip(field.key)}
          className={`
            flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors
            ${isSkipped
              ? 'bg-clay-stone/20 text-clay-charcoal/60'
              : 'text-clay-charcoal/40 hover:text-clay-charcoal/60 hover:bg-clay-sand/40'
            }
          `}
        >
          <SkipForward className="w-3 h-3" />
          {isSkipped ? 'Skipped' : 'Skip'}
        </button>
      </div>

      {/* Current value */}
      <p className="text-xs text-clay-charcoal/50 mb-3">
        Current: <code className="bg-clay-sand/40 dark:bg-white/10 px-1 rounded">{field.currentValue}</code>
      </p>

      {!isSkipped && (
        <>
          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {field.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${customValue === suggestion
                    ? 'bg-clay-coral text-white shadow-clay'
                    : 'bg-clay-sand/60 dark:bg-white/10 text-clay-charcoal/70 hover:bg-clay-peach/40 hover:text-clay-charcoal shadow-clay-inset'
                  }
                `}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomApply()}
              placeholder={`Enter custom ${field.label.toLowerCase()}...`}
              className="flex-1 px-3 py-2 rounded-lg bg-white/70 dark:bg-white/[0.06] border border-clay-stone/20 dark:border-white/10 text-sm text-clay-charcoal placeholder:text-clay-charcoal/30 focus:outline-none focus:ring-2 focus:ring-clay-coral/30"
            />
            <button
              onClick={handleCustomApply}
              disabled={!customValue.trim()}
              className="px-3 py-2 rounded-lg bg-clay-mint text-clay-charcoal text-sm font-medium shadow-clay hover:shadow-clay-lifted transition-shadow disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </>
      )}
    </div>
  );
}
