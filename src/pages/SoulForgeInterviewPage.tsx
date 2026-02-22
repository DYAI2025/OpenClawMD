/**
 * SoulForge Interview Page
 * 
 * Socratic interview flow for SoulForge 1.2
 */

import { useState, useCallback } from 'react';
import { ArrowLeft, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { ClayButton, ClayCard, ClayErrorBanner } from '@/components/clay';
import { RiskModal } from '@/components/safety/RiskModal';
import type { SpiritData } from '@/lib/soulforge/types';
import { 
  getRolesForMode, 
  mergeWithDefaults,
} from '@/lib/soulforge/spirit';
import type { GeneratedFile } from '@/lib/soulforge/types';

interface SoulForgeInterviewPageProps {
  initialSpirit?: Partial<SpiritData>;
  onComplete: (files: GeneratedFile[], spirit: SpiritData) => void;
  onBack: () => void;
}

type InterviewStep = 'mode' | 'role' | 'tone' | 'constraints' | 'autonomy' | 'review';

export function SoulForgeInterviewPage({ initialSpirit, onComplete, onBack }: SoulForgeInterviewPageProps) {
  const [step, setStep] = useState<InterviewStep>(() => {
    if (initialSpirit?.agentMode) return 'role';
    return 'mode';
  });
  const [spirit, setSpirit] = useState<Partial<SpiritData>>(() => {
    if (initialSpirit) {
      return mergeWithDefaults(initialSpirit, initialSpirit.agentMode || 'sidekick');
    }
    return {};
  });
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isHighRisk =
    spirit.autonomy?.actionMode === 'autonomous_in_sandbox' ||
    spirit.surprise?.appetite === 'high';

  const updateSpirit = useCallback((updates: Partial<SpiritData>) => {
    setSpirit(prev => ({ ...prev, ...updates }));
    setError(null);
  }, []);

  const handleModeSelect = (mode: SpiritData['agentMode']) => {
    setSpirit(mergeWithDefaults({ agentMode: mode }, mode));
    setStep('role');
  };

  const handleRoleSelect = (title: string) => {
    updateSpirit({ agentTitle: title });
    setStep('tone');
  };

  const steps: InterviewStep[] = ['mode', 'role', 'tone', 'constraints', 'autonomy', 'review'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    if (step === 'review') {
      // Ensure all fields are filled via mergeWithDefaults
      const finalSpirit = mergeWithDefaults(spirit, spirit.agentMode || 'sidekick') as SpiritData;
      // Generate files
      import('@/lib/soulforge/generator').then(({ generateSoulForgeFiles }) => {
        const output = generateSoulForgeFiles(finalSpirit, {
          includeAdvancedPack: true,
          language: finalSpirit.addressing?.language as 'en' | 'de' || 'en',
        });
        onComplete(output.files, finalSpirit);
      });
      return;
    }

    if (isHighRisk && step === 'autonomy') {
      setShowRiskModal(true);
      return;
    }

    const nextStep = steps[currentIndex + 1];
    if (nextStep) setStep(nextStep);
  };

  const handleBack = () => {
    if (step === 'mode') {
      onBack();
      return;
    }
    const prevStep = steps[currentIndex - 1];
    if (prevStep) setStep(prevStep);
  };

  const handleRiskConfirm = () => {
    setShowRiskModal(false);
    setStep('review');
  };

  const renderStep = () => {
    switch (step) {
      case 'mode':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-clay-charcoal">Choose your agent mode</h3>
            <div className="space-y-3">
              <ChoiceButton
                selected={spirit.agentMode === 'sidekick'}
                onClick={() => handleModeSelect('sidekick')}
                label="Sidekick (Discovery)"
                description="Helps you explore, discover patterns, and reframe problems"
              />
              <ChoiceButton
                selected={spirit.agentMode === 'chief-of-staff'}
                onClick={() => handleModeSelect('chief-of-staff')}
                label="Chief of Staff (Execution)"
                description="Orchestrates initiatives and executes with your approval"
              />
              <ChoiceButton
                selected={spirit.agentMode === 'coach'}
                onClick={() => handleModeSelect('coach')}
                label="Coach (Accountability)"
                description="Holds you accountable and reflects your patterns"
              />
            </div>
          </div>
        );

      case 'role': {
        const roles = spirit.agentMode ? getRolesForMode(spirit.agentMode) : [];
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-clay-charcoal">Select a specialized role</h3>
            <div className="space-y-3">
              {roles.map((role) => (
                <ChoiceButton
                  key={role.title}
                  selected={spirit.agentTitle === role.title}
                  onClick={() => handleRoleSelect(role.title)}
                  label={role.title}
                  description={`${role.subtitle} — ${role.description}`}
                />
              ))}
            </div>
          </div>
        );
      }

      case 'tone':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-clay-charcoal mb-4">Communication Method</h3>
              <div className="space-y-3">
                <ChoiceButton
                  selected={spirit.tone?.method === 'socratic'}
                  onClick={() => updateSpirit({ tone: { ...spirit.tone, method: 'socratic' } as SpiritData['tone']})}
                  label="Socratic"
                  description="Questions to guide discovery"
                />
                <ChoiceButton
                  selected={spirit.tone?.method === 'instructional'}
                  onClick={() => updateSpirit({ tone: { ...spirit.tone, method: 'instructional' } as SpiritData['tone']})}
                  label="Instructional"
                  description="Clear directions and steps"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-clay-charcoal mb-4">Detail Level</h3>
              <div className="space-y-3">
                <ChoiceButton
                  selected={spirit.tone?.precision === 'minimalist'}
                  onClick={() => updateSpirit({ tone: { ...spirit.tone, precision: 'minimalist' } as SpiritData['tone']})}
                  label="Minimalist"
                  description="Essential information only"
                />
                <ChoiceButton
                  selected={spirit.tone?.precision === 'explanatory'}
                  onClick={() => updateSpirit({ tone: { ...spirit.tone, precision: 'explanatory' } as SpiritData['tone']})}
                  label="Explanatory"
                  description="Context and reasoning provided"
                />
              </div>
            </div>
            <ClayButton variant="pill" color="mint" onClick={handleNext} className="w-full mt-4">
              Continue
            </ClayButton>
          </div>
        );

      case 'constraints':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-clay-charcoal">Define hard boundaries</h3>
            <p className="text-sm text-clay-charcoal/60">
              List 3 things the agent should NEVER do (one per line)
            </p>
            <textarea
              value={spirit.negativeConstraints?.join('\n') || ''}
              onChange={(e) => {
                const constraints = e.target.value.split('\n').filter(s => s.trim());
                updateSpirit({ negativeConstraints: constraints });
              }}
              placeholder={`Never send emails without approval
Never guess at data
Never make commitments on my behalf`}
              className="w-full p-4 rounded-xl bg-clay-base shadow-clay-inset border-0 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-clay-mint"
            />
            <ClayButton 
              variant="pill" 
              color="mint" 
              onClick={handleNext} 
              className="w-full"
              disabled={!spirit.negativeConstraints?.length}
            >
              Continue
            </ClayButton>
          </div>
        );

      case 'autonomy':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-clay-charcoal">Set autonomy level</h3>
            <div className="space-y-3">
              <ChoiceButton
                selected={spirit.autonomy?.actionMode === 'recommend_only'}
                onClick={() => updateSpirit({ autonomy: { ...spirit.autonomy, actionMode: 'recommend_only' } as SpiritData['autonomy']})}
                label="Recommend Only"
                description="Suggests actions, waits for approval"
              />
              <ChoiceButton
                selected={spirit.autonomy?.actionMode === 'execute_with_approval'}
                onClick={() => updateSpirit({ autonomy: { ...spirit.autonomy, actionMode: 'execute_with_approval' } as SpiritData['autonomy']})}
                label="Execute with Approval"
                description="Prepares actions, confirms before executing"
              />
              <ChoiceButton
                selected={spirit.autonomy?.actionMode === 'autonomous_in_sandbox'}
                onClick={() => updateSpirit({ autonomy: { ...spirit.autonomy, actionMode: 'autonomous_in_sandbox' } as SpiritData['autonomy']})}
                label="Autonomous in Sandbox"
                description="Acts freely in safe boundaries"
              />
            </div>
            <div className="space-y-3 mt-4">
              <p className="text-sm font-medium text-clay-charcoal">Surprise appetite</p>
              <div className="grid grid-cols-3 gap-2">
                <ChoiceButton
                  selected={spirit.surprise?.appetite === 'low'}
                  onClick={() => updateSpirit({ surprise: { ...spirit.surprise, appetite: 'low' } as SpiritData['surprise']})}
                  label="Low"
                  description="Minimal"
                />
                <ChoiceButton
                  selected={spirit.surprise?.appetite === 'medium'}
                  onClick={() => updateSpirit({ surprise: { ...spirit.surprise, appetite: 'medium' } as SpiritData['surprise']})}
                  label="Medium"
                  description="Balanced"
                />
                <ChoiceButton
                  selected={spirit.surprise?.appetite === 'high'}
                  onClick={() => updateSpirit({ surprise: { ...spirit.surprise, appetite: 'high' } as SpiritData['surprise']})}
                  label="High"
                  description="Active"
                />
              </div>
            </div>
            <ClayButton 
              variant="pill" 
              color={isHighRisk ? 'coral' : 'mint'} 
              onClick={handleNext} 
              className="w-full mt-4"
            >
              {isHighRisk ? 'Review High-Risk Config' : 'Continue'}
            </ClayButton>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-clay-mint rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-clay-charcoal" />
              </div>
              <h3 className="text-xl font-semibold text-clay-charcoal">Ready to Generate</h3>
              <p className="text-sm text-clay-charcoal/60 mt-1">
                {spirit.agentName || 'Your agent'} — 10 files will be generated
              </p>
            </div>

            <ClayCard padding="lg">
              <h4 className="font-semibold text-clay-charcoal mb-4">Configuration Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-clay-charcoal/60">Agent</span>
                  <span className="font-medium">{spirit.agentName || 'Auto-generated'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-clay-charcoal/60">Mode</span>
                  <span className="font-medium capitalize">{spirit.agentMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-clay-charcoal/60">Role</span>
                  <span className="font-medium">{spirit.agentTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-clay-charcoal/60">Tone</span>
                  <span className="font-medium capitalize">{spirit.tone?.method}, {spirit.tone?.precision}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-clay-charcoal/60">Autonomy</span>
                  <span className="font-medium capitalize">{spirit.autonomy?.actionMode?.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-clay-charcoal/60">Surprise</span>
                  <span className="font-medium capitalize">{spirit.surprise?.appetite}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-clay-charcoal/60">Constraints</span>
                  <span className="font-medium">{spirit.negativeConstraints?.length || 0} defined</span>
                </div>
              </div>
            </ClayCard>

            {isHighRisk && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">High Autonomy Configuration</p>
                  <p className="mt-1">
                    This configuration grants significant autonomy. Please verify all settings.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <ClayButton variant="round" color="stone" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </ClayButton>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-clay-charcoal">SoulForge Interview</h1>
            <p className="text-sm text-clay-charcoal/60">
              Step {currentIndex + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Preset Seed Indicator */}
        {initialSpirit && (
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-clay-mint/30 text-xs text-clay-charcoal/70">
            <Sparkles className="w-3 h-3" />
            Pre-filled from preset — adjust as needed
          </div>
        )}

        {/* Progress */}
        <div className="h-2 bg-clay-sand rounded-full overflow-hidden mb-8">
          <div 
            className={`h-full bg-clay-mint transition-all duration-500 ${
              currentIndex === 0 ? 'w-1/6' :
              currentIndex === 1 ? 'w-2/6' :
              currentIndex === 2 ? 'w-3/6' :
              currentIndex === 3 ? 'w-4/6' :
              currentIndex === 4 ? 'w-5/6' :
              'w-full'
            }`}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6">
            <ClayErrorBanner message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {/* Content */}
        <ClayCard padding="lg">
          {renderStep()}
        </ClayCard>

        {/* Navigation for review step */}
        {step === 'review' && (
          <div className="flex justify-center mt-8">
            <ClayButton variant="blob" color="coral" onClick={handleNext}>
              <Check className="w-5 h-5" />
              Generate Configuration
            </ClayButton>
          </div>
        )}
      </div>

      {/* Risk Modal */}
      <RiskModal
        isOpen={showRiskModal}
        onConfirm={handleRiskConfirm}
        onCancel={() => setShowRiskModal(false)}
        riskLevel={spirit.autonomy?.actionMode === 'autonomous_in_sandbox' ? 'high' : 'medium'}
      />
    </div>
  );
}

// Helper Component
function ChoiceButton({
  selected,
  onClick,
  label,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-xl transition-all duration-200
        ${selected 
          ? 'bg-clay-mint shadow-clay-inset ring-2 ring-clay-mint' 
          : 'bg-clay-base shadow-clay hover:shadow-clay-lifted'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
          ${selected ? 'border-clay-charcoal bg-clay-charcoal' : 'border-clay-stone'}
        `}>
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
