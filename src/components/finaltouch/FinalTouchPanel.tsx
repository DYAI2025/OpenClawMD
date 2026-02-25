/**
 * FinalTouchPanel
 *
 * Collapsible panel shown on the Export page between
 * ValidationPanel and file tabs. Lets users fill incomplete
 * fields with suggestions or skip with placeholder markers.
 */

import { useState, useMemo } from 'react';
import { Wand2, ChevronDown, ChevronUp, Sparkles, SkipForward } from 'lucide-react';
import { ClayButton, ClayCard } from '@/components/clay';
import { FinalTouchFieldRow } from './FinalTouchFieldRow';
import type { SpiritData } from '@/lib/animae-agentis/types';
import { analyzeCompleteness } from '@/lib/animae-agentis/finalTouch';
import type { IncompleteField } from '@/lib/animae-agentis/finalTouch';

interface FinalTouchPanelProps {
  spirit: SpiritData;
  onSpiritUpdate: (key: string, value: string) => void;
}

export function FinalTouchPanel({ spirit, onSpiritUpdate }: FinalTouchPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [skippedFields, setSkippedFields] = useState<Set<string>>(new Set());
  const [appliedFields, setAppliedFields] = useState<Set<string>>(new Set());

  const incompleteFields: IncompleteField[] = useMemo(
    () => analyzeCompleteness(spirit),
    [spirit],
  );

  if (incompleteFields.length === 0) return null;

  const handleApply = (key: string, value: string) => {
    onSpiritUpdate(key, value);
    setAppliedFields(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    setSkippedFields(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handleSkip = (key: string) => {
    const field = incompleteFields.find(f => f.key === key);
    if (!field) return;

    if (skippedFields.has(key)) {
      // Unskip
      setSkippedFields(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    } else {
      // Skip — insert placeholder
      onSpiritUpdate(key, field.placeholder);
      setSkippedFields(prev => {
        const next = new Set(prev);
        next.add(key);
        return next;
      });
      setAppliedFields(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const handleApplyAll = () => {
    for (const field of incompleteFields) {
      if (!skippedFields.has(field.key) && !appliedFields.has(field.key) && field.suggestions[0]) {
        onSpiritUpdate(field.key, field.suggestions[0]);
        setAppliedFields(prev => {
          const next = new Set(prev);
          next.add(field.key);
          return next;
        });
      }
    }
  };

  const handleSkipAll = () => {
    for (const field of incompleteFields) {
      if (!appliedFields.has(field.key)) {
        onSpiritUpdate(field.key, field.placeholder);
        setSkippedFields(prev => {
          const next = new Set(prev);
          next.add(field.key);
          return next;
        });
      }
    }
  };

  const remainingCount = incompleteFields.filter(
    f => !appliedFields.has(f.key) && !skippedFields.has(f.key),
  ).length;

  return (
    <ClayCard padding="lg" className="mb-6">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-3 w-full text-left"
      >
        <div className="w-10 h-10 rounded-full bg-clay-peach shadow-clay flex items-center justify-center">
          <Wand2 className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-clay-charcoal">Final Touch</h3>
          <p className="text-xs text-clay-charcoal/50">
            {remainingCount > 0
              ? `${remainingCount} field${remainingCount !== 1 ? 's' : ''} using defaults — personalize or skip`
              : 'All fields addressed'}
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-clay-charcoal/40" />
        ) : (
          <ChevronDown className="w-5 h-5 text-clay-charcoal/40" />
        )}
      </button>

      {isExpanded && (
        <>
          {/* Bulk actions */}
          <div className="flex gap-2 mt-4 mb-4">
            <ClayButton
              variant="pill"
              color="mint"
              size="sm"
              onClick={handleApplyAll}
              disabled={remainingCount === 0}
            >
              <Sparkles className="w-4 h-4" />
              Apply All Suggestions
            </ClayButton>
            <ClayButton
              variant="pill"
              color="stone"
              size="sm"
              onClick={handleSkipAll}
              disabled={remainingCount === 0}
            >
              <SkipForward className="w-4 h-4" />
              Skip All
            </ClayButton>
          </div>

          {/* Field rows */}
          <div className="space-y-3">
            {incompleteFields.map((field) => (
              <FinalTouchFieldRow
                key={field.key}
                field={field}
                onApply={handleApply}
                onSkip={handleSkip}
                isSkipped={skippedFields.has(field.key)}
                isApplied={appliedFields.has(field.key)}
              />
            ))}
          </div>
        </>
      )}
    </ClayCard>
  );
}
