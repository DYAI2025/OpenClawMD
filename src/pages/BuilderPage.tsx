import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { ClayButton, ClayCard } from '@/components/clay';
import type {
  SpiritData,
  AgentMode,
  ActionMode,
  SurpriseAppetite,
  SurpriseCadence,
  TonePrecision,
  ToneMethod,
  ToneDirectness,
  TruthPolicy,
} from '@/lib/animae-agentis/types';

// ============================================================================
// Shared ChoiceButton component
// ============================================================================

function ChoiceButton({ selected, onClick, label, description }: {
  selected: boolean;
  onClick: () => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
        selected
          ? 'bg-clay-mint shadow-clay-inset ring-2 ring-clay-mint'
          : 'bg-clay-base shadow-clay hover:shadow-clay-lifted'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            selected ? 'border-clay-charcoal bg-clay-charcoal' : 'border-clay-stone'
          }`}
        >
          {selected && <div className="w-2 h-2 bg-white rounded-full" />}
        </div>
        <div>
          <span className="font-medium text-clay-charcoal">{label}</span>
          {description && (
            <p className="text-sm text-clay-charcoal/60 mt-0.5">{description}</p>
          )}
        </div>
      </div>
    </button>
  );
}

// ============================================================================
// Toggle pair for binary choices (Tone section)
// ============================================================================

function TogglePair<T extends string>({
  label,
  optionA,
  optionB,
  value,
  onChange,
}: {
  label: string;
  optionA: { value: T; label: string };
  optionB: { value: T; label: string };
  value: T | undefined;
  onChange: (val: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-clay-charcoal/70">{label}</span>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(optionA.value)}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            value === optionA.value
              ? 'bg-clay-charcoal text-white shadow-clay-inset'
              : 'bg-clay-base text-clay-charcoal shadow-clay hover:shadow-clay-lifted'
          }`}
        >
          {optionA.label}
        </button>
        <button
          onClick={() => onChange(optionB.value)}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            value === optionB.value
              ? 'bg-clay-charcoal text-white shadow-clay-inset'
              : 'bg-clay-base text-clay-charcoal shadow-clay hover:shadow-clay-lifted'
          }`}
        >
          {optionB.label}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Section header helper
// ============================================================================

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-lg font-semibold text-clay-charcoal">{title}</h3>
      <p className="text-sm text-clay-charcoal/60">{subtitle}</p>
    </div>
  );
}

// ============================================================================
// BuilderPage
// ============================================================================

interface BuilderPageProps {
  initialSpirit: SpiritData;
  onComplete: (spirit: SpiritData) => void;
  onBack: () => void;
}

export const BuilderPage: React.FC<BuilderPageProps> = ({
  initialSpirit,
  onComplete,
  onBack,
}) => {
  const [spirit, setSpirit] = useState<SpiritData>(initialSpirit);

  // Deep update helper that correctly merges nested objects
  const updateSpirit = (updates: Partial<SpiritData>) => {
    setSpirit(prev => ({
      ...prev,
      ...updates,
      tone: updates.tone ? { ...prev.tone, ...updates.tone } : prev.tone,
      autonomy: updates.autonomy ? { ...prev.autonomy, ...updates.autonomy } : prev.autonomy,
      surprise: updates.surprise ? { ...prev.surprise, ...updates.surprise } : prev.surprise,
      output: updates.output ? { ...prev.output, ...updates.output } : prev.output,
    }));
  };

  const handleComplete = () => {
    onComplete(spirit);
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <ClayButton
            variant="round"
            color="stone"
            size="sm"
            onClick={onBack}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </ClayButton>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-clay-charcoal">
              Fine-Tune Configuration
            </h1>
            <p className="text-sm text-clay-charcoal/60">
              Adjust your agent parameters
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">

          {/* ----------------------------------------------------------------
           * A. Agent Mode
           * -------------------------------------------------------------- */}
          <ClayCard padding="md">
            <SectionHeader
              title="Agent Mode"
              subtitle="How your agent relates to you"
            />
            <div className="space-y-2">
              <ChoiceButton
                selected={spirit.agentMode === 'sidekick'}
                onClick={() => updateSpirit({ agentMode: 'sidekick' as AgentMode })}
                label="Sidekick"
                description="Discovery-focused. Surfaces insights, connects patterns, proposes ideas."
              />
              <ChoiceButton
                selected={spirit.agentMode === 'chief-of-staff'}
                onClick={() => updateSpirit({ agentMode: 'chief-of-staff' as AgentMode })}
                label="Chief of Staff"
                description="Execution-focused. Orchestrates projects, tracks blockers, drives outcomes."
              />
              <ChoiceButton
                selected={spirit.agentMode === 'coach'}
                onClick={() => updateSpirit({ agentMode: 'coach' as AgentMode })}
                label="Coach"
                description="Accountability-focused. Reflects patterns, asks questions, holds commitments."
              />
            </div>
          </ClayCard>

          {/* ----------------------------------------------------------------
           * B. Tone
           * -------------------------------------------------------------- */}
          <ClayCard padding="md">
            <SectionHeader
              title="Tone"
              subtitle="How your agent communicates"
            />
            <div className="space-y-4">
              <TogglePair<TonePrecision>
                label="Precision"
                optionA={{ value: 'minimalist', label: 'Minimalist' }}
                optionB={{ value: 'explanatory', label: 'Explanatory' }}
                value={spirit.tone.precision}
                onChange={(val) => updateSpirit({ tone: { precision: val } })}
              />
              <TogglePair<ToneMethod>
                label="Method"
                optionA={{ value: 'socratic', label: 'Socratic' }}
                optionB={{ value: 'instructional', label: 'Instructional' }}
                value={spirit.tone.method}
                onChange={(val) => updateSpirit({ tone: { method: val } })}
              />
              <TogglePair<ToneDirectness>
                label="Directness"
                optionA={{ value: 'direct', label: 'Direct' }}
                optionB={{ value: 'gentle', label: 'Gentle' }}
                value={spirit.tone.directness}
                onChange={(val) => updateSpirit({ tone: { directness: val } })}
              />
            </div>
          </ClayCard>

          {/* ----------------------------------------------------------------
           * C. Autonomy
           * -------------------------------------------------------------- */}
          <ClayCard padding="md">
            <SectionHeader
              title="Autonomy"
              subtitle="How much freedom your agent gets"
            />
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-medium text-clay-charcoal/70">
                  Action Mode
                </span>
                <ChoiceButton
                  selected={spirit.autonomy.actionMode === 'recommend_only'}
                  onClick={() =>
                    updateSpirit({ autonomy: { actionMode: 'recommend_only' as ActionMode } })
                  }
                  label="Recommend Only"
                  description="Agent suggests actions but never executes them."
                />
                <ChoiceButton
                  selected={spirit.autonomy.actionMode === 'execute_with_approval'}
                  onClick={() =>
                    updateSpirit({ autonomy: { actionMode: 'execute_with_approval' as ActionMode } })
                  }
                  label="Execute with Approval"
                  description="Agent can act, but asks before significant operations."
                />
                <ChoiceButton
                  selected={spirit.autonomy.actionMode === 'autonomous_in_sandbox'}
                  onClick={() =>
                    updateSpirit({ autonomy: { actionMode: 'autonomous_in_sandbox' as ActionMode } })
                  }
                  label="Autonomous in Sandbox"
                  description="Agent acts freely within a sandboxed environment."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="approval-threshold"
                  className="text-sm font-medium text-clay-charcoal/70"
                >
                  Approval Threshold
                </label>
                <input
                  id="approval-threshold"
                  type="text"
                  value={spirit.autonomy.approvalThreshold ?? ''}
                  onChange={(e) =>
                    updateSpirit({ autonomy: { approvalThreshold: e.target.value } })
                  }
                  placeholder="e.g. Anything irreversible requires explicit approval."
                  className="w-full px-4 py-2.5 rounded-xl bg-clay-base shadow-clay-inset text-clay-charcoal placeholder:text-clay-charcoal/40 focus:outline-none focus:ring-2 focus:ring-clay-mint transition-all"
                />
              </div>
            </div>
          </ClayCard>

          {/* ----------------------------------------------------------------
           * D. Surprise Contract
           * -------------------------------------------------------------- */}
          <ClayCard padding="md">
            <SectionHeader
              title="Surprise Contract"
              subtitle="How your agent introduces unexpected ideas"
            />
            <div className="space-y-4">
              {/* Appetite */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-clay-charcoal/70">
                  Appetite
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as SurpriseAppetite[]).map((level) => (
                    <ChoiceButton
                      key={level}
                      selected={spirit.surprise.appetite === level}
                      onClick={() => updateSpirit({ surprise: { appetite: level } })}
                      label={level.charAt(0).toUpperCase() + level.slice(1)}
                    />
                  ))}
                </div>
              </div>

              {/* Cadence */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-clay-charcoal/70">
                  Cadence
                </span>
                <ChoiceButton
                  selected={spirit.surprise.cadence === 'daily_micro'}
                  onClick={() =>
                    updateSpirit({ surprise: { cadence: 'daily_micro' as SurpriseCadence } })
                  }
                  label="Daily Micro"
                  description="Small surprises woven into daily interactions."
                />
                <ChoiceButton
                  selected={spirit.surprise.cadence === 'weekly_deep'}
                  onClick={() =>
                    updateSpirit({ surprise: { cadence: 'weekly_deep' as SurpriseCadence } })
                  }
                  label="Weekly Deep"
                  description="Deeper surprises on a weekly cadence."
                />
                <ChoiceButton
                  selected={spirit.surprise.cadence === 'trigger'}
                  onClick={() =>
                    updateSpirit({ surprise: { cadence: 'trigger' as SurpriseCadence } })
                  }
                  label="Trigger-Based"
                  description="Surprises only when specific conditions are met."
                />
              </div>

              {/* Boundaries */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="surprise-boundaries"
                  className="text-sm font-medium text-clay-charcoal/70"
                >
                  Boundaries
                </label>
                <input
                  id="surprise-boundaries"
                  type="text"
                  value={spirit.surprise.boundaries ?? ''}
                  onChange={(e) =>
                    updateSpirit({ surprise: { boundaries: e.target.value } })
                  }
                  placeholder="e.g. No personal data, no outreach, proposals only."
                  className="w-full px-4 py-2.5 rounded-xl bg-clay-base shadow-clay-inset text-clay-charcoal placeholder:text-clay-charcoal/40 focus:outline-none focus:ring-2 focus:ring-clay-mint transition-all"
                />
              </div>
            </div>
          </ClayCard>

          {/* ----------------------------------------------------------------
           * E. Truth Policy
           * -------------------------------------------------------------- */}
          <ClayCard padding="md">
            <SectionHeader
              title="Truth Policy"
              subtitle="How your agent handles uncertainty"
            />
            <div className="space-y-2">
              <ChoiceButton
                selected={spirit.truthPolicy === 'mark_uncertainty'}
                onClick={() => updateSpirit({ truthPolicy: 'mark_uncertainty' as TruthPolicy })}
                label="Mark Uncertainty"
                description="Explicitly flags when information is uncertain or speculative."
              />
              <ChoiceButton
                selected={spirit.truthPolicy === 'calibrated_confidence'}
                onClick={() => updateSpirit({ truthPolicy: 'calibrated_confidence' as TruthPolicy })}
                label="Calibrated Confidence"
                description="Uses calibrated confidence levels (e.g. 70% sure)."
              />
              <ChoiceButton
                selected={spirit.truthPolicy === 'confident_only'}
                onClick={() => updateSpirit({ truthPolicy: 'confident_only' as TruthPolicy })}
                label="Confident Only"
                description="Only states things it is highly confident about."
              />
            </div>
          </ClayCard>

        </div>

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <ClayButton variant="pill" color="stone" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </ClayButton>

          <ClayButton variant="pill" color="coral" onClick={handleComplete}>
            <Check className="w-4 h-4" />
            Complete
          </ClayButton>
        </div>
      </div>
    </div>
  );
};
