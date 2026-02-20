import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, AlertTriangle } from 'lucide-react';
import { ClayButton, ClayStepper, ClayCard, ClayErrorBanner, ClaySlider } from '@/components/clay';
import type { OpenClawConfigType, DimensionConfigType, DimensionName } from '@/lib/openclaw/schema';
import { DimensionInfo, validateLegalBoundaries } from '@/lib/openclaw/schema';
import { detectPresetFromDimensions } from '@/lib/openclaw/presets';

interface InterviewPageProps {
  initialConfig: OpenClawConfigType;
  onComplete: (config: OpenClawConfigType) => void;
  onBack: () => void;
}

type QuestionType = 'slider' | 'choice';

interface Question {
  id: string;
  dimension: DimensionName;
  type: QuestionType;
  question: string;
  description: string;
  options?: { value: number; label: string; description: string }[];
}

const interviewQuestions: Question[] = [
  {
    id: 'risk-tolerance',
    dimension: 'riskTolerance',
    type: 'slider',
    question: 'How much risk are you comfortable with?',
    description: 'This determines how the system handles uncertainty and potential downsides.',
  },
  {
    id: 'approval-threshold',
    dimension: 'approvalThreshold',
    type: 'slider',
    question: 'How much human oversight do you want?',
    description: 'Higher values mean more actions require explicit approval.',
  },
  {
    id: 'heartbeat',
    dimension: 'heartbeatAggressiveness',
    type: 'choice',
    question: 'How often should the system check in?',
    description: 'Choose the communication frequency that works for you.',
    options: [
      { value: 1, label: 'Minimal', description: 'Only when explicitly asked or on completion' },
      { value: 2, label: 'Low', description: 'At major milestones and blockers' },
      { value: 3, label: 'Moderate', description: 'Regular updates every 10-15 minutes' },
      { value: 4, label: 'High', description: 'Frequent updates every 5 minutes' },
      { value: 5, label: 'Continuous', description: 'Real-time progress and anomaly alerts' },
    ],
  },
  {
    id: 'communication',
    dimension: 'communicationAuthority',
    type: 'slider',
    question: 'How much communication autonomy?',
    description: 'Determines autonomy in external communications.',
  },
  {
    id: 'initiative',
    dimension: 'strategicInitiative',
    type: 'slider',
    question: 'How proactive should the system be?',
    description: 'Higher values mean the system will propose and pursue goals more actively.',
  },
  {
    id: 'data-access',
    dimension: 'dataAccessScope',
    type: 'slider',
    question: 'What data should the system access?',
    description: 'Defines the breadth of data the system can analyze.',
  },
  {
    id: 'uncertainty',
    dimension: 'uncertaintyHandling',
    type: 'choice',
    question: 'How should the system handle uncertainty?',
    description: 'Choose the default behavior when confidence is low.',
    options: [
      { value: 1, label: 'Halt & Ask', description: 'Stop immediately and request guidance' },
      { value: 2, label: 'Cautious', description: 'Pause and present options for confirmation' },
      { value: 3, label: 'Balanced', description: 'Proceed if confidence >70%, document caveats' },
      { value: 4, label: 'Adaptive', description: 'Make best effort with documented assumptions' },
      { value: 5, label: 'Aggressive', description: 'Iterate quickly, learn from outcomes' },
    ],
  },
  {
    id: 'execution',
    dimension: 'executionScope',
    type: 'slider',
    question: 'What actions can the system perform?',
    description: 'Defines the range of autonomous actions.',
  },
];

// Fix #9: 4 balanced question steps (2 questions each) + 1 review step
const steps = [
  { id: 'risk',      label: 'Risk',    description: 'Tolerance & approval' },
  { id: 'comm',      label: 'Comm',    description: 'Heartbeat & authority' },
  { id: 'data',      label: 'Data',    description: 'Initiative & access' },
  { id: 'execution', label: 'Execute', description: 'Scope & uncertainty' },
  { id: 'review',    label: 'Review',  description: 'Finalize config' },
];

const REVIEW_STEP = steps.length - 1; // index 4

export const InterviewPage: React.FC<InterviewPageProps> = ({
  initialConfig,
  onComplete,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dimensions, setDimensions] = useState<DimensionConfigType>(initialConfig.dimensions);
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateDimension = (dimension: DimensionName, value: number) => {
    setDimensions(prev => ({ ...prev, [dimension]: value }));
    setValidationError(null);
  };

  // Fix #9: evenly distribute 8 dimensions across 4 question steps (2 each)
  const getStepQuestions = (stepIndex: number): Question[] => {
    switch (stepIndex) {
      case 0: // Risk
        return interviewQuestions.filter(q =>
          q.dimension === 'riskTolerance' || q.dimension === 'approvalThreshold'
        );
      case 1: // Comm
        return interviewQuestions.filter(q =>
          q.dimension === 'heartbeatAggressiveness' || q.dimension === 'communicationAuthority'
        );
      case 2: // Data
        return interviewQuestions.filter(q =>
          q.dimension === 'strategicInitiative' || q.dimension === 'dataAccessScope'
        );
      case 3: // Execute
        return interviewQuestions.filter(q =>
          q.dimension === 'uncertaintyHandling' || q.dimension === 'executionScope'
        );
      default:
        return [];
    }
  };

  const handleNext = () => {
    if (currentStep < REVIEW_STEP) {
      setCurrentStep(prev => prev + 1);
    } else {
      const validation = validateLegalBoundaries(dimensions);
      if (!validation.valid) {
        setValidationError(validation.violations.map(v => v.message).join('. '));
        return;
      }

      const config: OpenClawConfigType = {
        presetId: detectPresetFromDimensions(dimensions),
        dimensions,
        metadata: {
          name: 'Interview Configuration',
          description: 'Generated via interview wizard',
          createdAt: new Date().toISOString(),
          version: '1.0.0',
        },
      };
      onComplete(config);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const isLastStep = currentStep === REVIEW_STEP;
  const currentQuestions = getStepQuestions(currentStep);

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <ClayButton
            variant="round"
            color="stone"
            size="sm"
            onClick={handleBack}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </ClayButton>
          <div>
            <h1 className="text-2xl font-bold text-clay-charcoal">
              Interview Wizard
            </h1>
            <p className="text-sm text-clay-charcoal/60">
              Answer questions to create your configuration
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <ClayStepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="mb-6">
            <ClayErrorBanner
              message={validationError}
              onDismiss={() => setValidationError(null)}
            />
          </div>
        )}

        {/* Questions */}
        {currentStep < REVIEW_STEP ? (
          <div className="space-y-6">
            {currentQuestions.map((question) => (
              <ClayCard key={question.id} padding="lg">
                <h3 className="text-lg font-semibold text-clay-charcoal mb-2">
                  {question.question}
                </h3>
                <p className="text-sm text-clay-charcoal/60 mb-6">
                  {question.description}
                </p>

                {/* Fix #5: use ClaySlider instead of raw <input type="range"> */}
                {question.type === 'slider' && (
                  <ClaySlider
                    value={dimensions[question.dimension]}
                    onChange={(value) => updateDimension(question.dimension, value)}
                    min={1}
                    max={5}
                    labels={[
                      DimensionInfo[question.dimension].lowLabel,
                      DimensionInfo[question.dimension].highLabel,
                    ]}
                  />
                )}

                {question.type === 'choice' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateDimension(question.dimension, option.value)}
                        className={`
                          w-full text-left p-4 rounded-xl transition-all duration-250
                          ${dimensions[question.dimension] === option.value
                            ? 'bg-clay-mint shadow-clay-inset'
                            : 'bg-clay-base shadow-clay hover:shadow-clay-lifted'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                            ${dimensions[question.dimension] === option.value
                              ? 'border-clay-coral bg-clay-coral'
                              : 'border-clay-stone'
                            }
                          `}>
                            {dimensions[question.dimension] === option.value && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-clay-charcoal">
                              {option.label}
                            </span>
                            <p className="text-sm text-clay-charcoal/60">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ClayCard>
            ))}
          </div>
        ) : (
          /* Review Step */
          <ClayCard padding="lg">
            <h3 className="text-lg font-semibold text-clay-charcoal mb-4">
              Review Your Configuration
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {(Object.keys(dimensions) as DimensionName[]).map((dim) => (
                <div
                  key={dim}
                  className="flex items-center justify-between p-3 bg-clay-sand/50 rounded-lg"
                >
                  <span className="text-sm text-clay-charcoal/70">
                    {DimensionInfo[dim].label}
                  </span>
                  <span className="text-sm font-medium text-clay-charcoal bg-clay-base px-2 py-1 rounded-full">
                    {dimensions[dim]}/5
                  </span>
                </div>
              ))}
            </div>

            {/* Legal Check */}
            {validateLegalBoundaries(dimensions).valid ? (
              <div className="mt-6 p-4 bg-clay-mint/50 rounded-xl flex items-center gap-3">
                <Check className="w-5 h-5 text-clay-charcoal" />
                <span className="text-sm text-clay-charcoal">
                  Configuration passes all legal boundary checks
                </span>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-clay-coral/20 rounded-xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-clay-coral" />
                <span className="text-sm text-clay-charcoal">
                  Configuration has legal boundary issues. Please review.
                </span>
              </div>
            )}
          </ClayCard>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <ClayButton
            variant="pill"
            color="stone"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 0 ? 'Back to Start' : 'Previous'}
          </ClayButton>

          <ClayButton
            variant="pill"
            color={isLastStep ? 'coral' : 'mint'}
            onClick={handleNext}
          >
            {isLastStep ? 'Complete' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </ClayButton>
        </div>
      </div>
    </div>
  );
};
