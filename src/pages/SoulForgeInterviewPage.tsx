/**
 * SoulForge Interview Page
 * 
 * Socratic interview flow for SoulForge 1.2
 */

import { useState, useCallback } from 'react';
import { ArrowLeft, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { ClayButton, ClayCard, ClayErrorBanner } from '@/components/clay';
import { RiskModal } from '@/components/safety/RiskModal';
import type { CanonData } from '@/lib/soulforge/types';
import { 
  getRolesForMode, 
  mergeWithDefaults,
} from '@/lib/soulforge/canon';
import type { GeneratedFile } from '@/lib/soulforge/types';

interface SoulForgeInterviewPageProps {
  onComplete: (files: GeneratedFile[], canon: CanonData) => void;
  onBack: () => void;
}

type InterviewStep = 'mode' | 'role' | 'tone' | 'constraints' | 'autonomy' | 'review';

export function SoulForgeInterviewPage({ onComplete, onBack }: SoulForgeInterviewPageProps) {
  const [step, setStep] = useState<InterviewStep>('mode');
  const [canon, setCanon] = useState<Partial<CanonData>>({});
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isHighRisk = 
    canon.autonomy?.actionMode === 'autonomous_in_sandbox' ||
    canon.surprise?.appetite === 'high';

  const updateCanon = useCallback((updates: Partial<CanonData>) => {
    setCanon(prev => ({ ...prev, ...updates }));
    setError(null);
  }, []);

  const handleModeSelect = (mode: CanonData['agentMode']) => {
    setCanon(mergeWithDefaults({ agentMode: mode }, mode));
    setStep('role');
  };

  const handleRoleSelect = (title: string) => {
    updateCanon({ agentTitle: title });
    setStep('tone');
  };

  const steps: InterviewStep[] = ['mode', 'role', 'tone', 'constraints', 'autonomy', 'review'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    if (step === 'review') {
      const finalCanon = canon as CanonData;
      // Generate files
      import('@/lib/soulforge/generator').then(({ generateSoulForgeFiles }) => {
        const output = generateSoulForgeFiles(finalCanon, {
          includeAdvancedPack: true,
          language: 'en',
        });
        onComplete(output.files, finalCanon);
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
                selected={canon.agentMode === 'sidekick'}
                onClick={() => handleModeSelect('sidekick')}
                label="Sidekick (Discovery)"
                description="Helps you explore, discover patterns, and reframe problems"
              />
              <ChoiceButton
                selected={canon.agentMode === 'chief-of-staff'}
                onClick={() => handleModeSelect('chief-of-staff')}
                label="Chief of Staff (Execution)"
                description="Orchestrates initiatives and executes with your approval"
              />
              <ChoiceButton
                selected={canon.agentMode === 'coach'}
                onClick={() => handleModeSelect('coach')}
                label="Coach (Accountability)"
                description="Holds you accountable and reflects your patterns"
              />
            </div>
          </div>
        );

      case 'role':
        const roles = canon.agentMode ? getRolesForMode(canon.agentMode) : [];
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-clay-charcoal">Select a specialized role</h3>
            <div className="space-y-3">
              {roles.map((role) => (
                <ChoiceButton
                  key={role.title}
                  selected={canon.agentTitle === role.title}
                  onClick={() => handleRoleSelect(role.title)}
                  label={role.title}
                  description={`${role.subtitle} — ${role.description}`}
                />
              ))}
            </div>
          </div>
        );

      case 'tone':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-clay-charcoal">Set communication style</h3>
            <div className="space-y-3">
              <ChoiceButton
                selected={canon.tone?.method === 'socratic'}
                onClick={() => updateCanon({ tone: { ...canon.tone, method: 'socratic' } as CanonData['tone']})}
                label="Socratic"
                description="Questions to guide discovery"
              />
              <ChoiceButton
                selected={canon.tone?.method === 'instructional'}
                onClick={() => updateCanon({ tone: { ...canon.tone, method: 'instructional' } as CanonData['tone']})}
                label="Instructional"
                description="Clear directions and steps"
              />
            </div>
            <div className="space-y-3 mt-4">
              <ChoiceButton
                selected={canon.tone?.precision === 'minimalist'}
                onClick={() => updateCanon({ tone: { ...canon.tone, precision: 'minimalist' } as CanonData['tone']})}
                label="Minimalist"
                description="Essential information only"
              />
              <ChoiceButton
                selected={canon.tone?.precision === 'explanatory'}
                onClick={() => updateCanon({ tone: { ...canon.tone, precision: 'explanatory' } as CanonData['tone']})}
                label="Explanatory"
                description="Context and reasoning provided"
              />
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
              value={canon.negativeConstraints?.join('\n') || ''}
              onChange={(e) => {
                const constraints = e.target.value.split('\n').filter(s => s.trim());
                updateCanon({ negativeConstraints: constraints });
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
              disabled={!canon.negativeConstraints?.length}
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
                selected={canon.autonomy?.actionMode === 'recommend_only'}
                onClick={() => updateCanon({ autonomy: { ...canon.autonomy, actionMode: 'recommend_only' } as CanonData['autonomy']})}
                label="Recommend Only"
                description="Suggests actions, waits for approval"
              />
              <ChoiceButton
                selected={canon.autonomy?.actionMode === 'execute_with_approval'}
                onClick={() => updateCanon({ autonomy: { ...canon.autonomy, actionMode: 'execute_with_approval' } as CanonData['autonomy']})}
                label="Execute with Approval"
                description="Prepares actions, confirms before executing"
              />
              <ChoiceButton
                selected={canon.autonomy?.actionMode === 'autonomous_in_sandbox'}
                onClick={() => updateCanon({ autonomy: { ...canon.autonomy, actionMode: 'autonomous_in_sandbox' } as CanonData['autonomy']})}
                label="Autonomous in Sandbox"
                description="Acts freely in safe boundaries"
              />
            </div>
            <div className="space-y-3 mt-4">
              <p className="text-sm font-medium text-clay-charcoal">Surprise appetite</p>
              <div className="grid grid-cols-3 gap-2">
                <ChoiceButton
                  selected={canon.surprise?.appetite === 'low'}
                  onClick={() => updateCanon({ surprise: { ...canon.surprise, appetite: 'low' } as CanonData['surprise']})}
                  label="Low"
                  description="Minimal"
                />
                <ChoiceButton
                  selected={canon.surprise?.appetite === 'medium'}
                  onClick={() => updateCanon({ surprise: { ...canon.surprise, appetite: 'medium' } as CanonData['surprise']})}
                  label="Medium"
                  description="Balanced"
                />
                <ChoiceButton
                  selected={canon.surprise?.appetite === 'high'}
                  onClick={() => updateCanon({ surprise: { ...canon.surprise, appetite: 'high' } as CanonData['surprise']})}
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
            </div>

            <ClayCard padding="lg">
              <h4 className="font-semibold text-clay-charcoal mb-4">Configuration Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-clay-charcoal/60">Mode</span>
                  <span className="font-medium capitalize">{canon.agentMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-clay-charcoal/60">Role</span>
                  <span className="font-medium">{canon.agentTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-clay-charcoal/60">Tone</span>
                  <span className="font-medium capitalize">{canon.tone?.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-clay-charcoal/60">Autonomy</span>
                  <span className="font-medium capitalize">{canon.autonomy?.actionMode?.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-clay-charcoal/60">Surprise</span>
                  <span className="font-medium capitalize">{canon.surprise?.appetite}</span>
                </div>
              </div>
            </ClayCard>

            {isHighRisk && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
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

        {/* Progress */}
        <div className="h-2 bg-clay-sand rounded-full overflow-hidden mb-8">
          <div 
            className="h-full bg-clay-mint transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
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
        riskLevel={canon.autonomy?.actionMode === 'autonomous_in_sandbox' ? 'high' : 'medium'}
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
