import { useState, useMemo } from 'react';
import { ArrowLeft, RotateCcw, Check } from 'lucide-react';
import { ClayButton, ClayCard, ClaySlider, ClayErrorBanner } from '@/components/clay';
import type { 
  OpenClawConfigType, 
  DimensionConfigType,
  DimensionName 
} from '@/lib/openclaw/schema';
import { DimensionNames, DimensionInfo, validateLegalBoundaries } from '@/lib/openclaw/schema';
import { detectPresetFromDimensions, getPresetById, PRESETS } from '@/lib/openclaw/presets';

interface BuilderPageProps {
  initialConfig: OpenClawConfigType;
  onComplete: (config: OpenClawConfigType) => void;
  onBack: () => void;
}

export const BuilderPage: React.FC<BuilderPageProps> = ({
  initialConfig,
  onComplete,
  onBack,
}) => {
  const [dimensions, setDimensions] = useState<DimensionConfigType>(initialConfig.dimensions);
  const [showDiff, setShowDiff] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const detectedPreset = useMemo(() => detectPresetFromDimensions(dimensions), [dimensions]);
  const basePreset = useMemo(() => getPresetById(initialConfig.presetId), [initialConfig.presetId]);
  const validation = useMemo(() => validateLegalBoundaries(dimensions), [dimensions]);

  const updateDimension = (dimension: DimensionName, value: number) => {
    setDimensions(prev => ({ ...prev, [dimension]: value }));
    setValidationError(null);
  };

  const resetToPreset = () => {
    setDimensions(basePreset.dimensions);
    setValidationError(null);
  };

  const resetToDefault = () => {
    setDimensions({
      riskTolerance: 3,
      approvalThreshold: 3,
      heartbeatAggressiveness: 3,
      strategicInitiative: 3,
      dataAccessScope: 3,
      communicationAuthority: 3,
      uncertaintyHandling: 3,
      executionScope: 3,
    });
    setValidationError(null);
  };

  const handleComplete = () => {
    if (!validation.valid) {
      setValidationError(validation.violations.map(v => v.message).join('. '));
      return;
    }

    const config: OpenClawConfigType = {
      presetId: detectedPreset,
      dimensions,
      metadata: {
        name: detectedPreset === 'custom' ? 'Custom Configuration' : PRESETS[detectedPreset].name,
        description: 'Built with custom builder',
        createdAt: new Date().toISOString(),
        version: '1.0.0',
      },
    };
    onComplete(config);
  };

  const hasChanges = useMemo(() => {
    return DimensionNames.some(dim => dimensions[dim] !== basePreset.dimensions[dim]);
  }, [dimensions, basePreset]);

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
              Custom Builder
            </h1>
            <p className="text-sm text-clay-charcoal/60">
              Fine-tune all 8 dimensions
            </p>
          </div>
          <div className="flex gap-2">
            <ClayButton
              variant="pill"
              color="stone"
              size="sm"
              onClick={resetToPreset}
            >
              <RotateCcw className="w-4 h-4" />
              Reset to {basePreset.name}
            </ClayButton>
          </div>
        </div>

        {/* Detected Preset Badge */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-sm text-clay-charcoal/60">Detected preset:</span>
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${detectedPreset === 'security' ? 'bg-clay-peach' : ''}
            ${detectedPreset === 'open' ? 'bg-clay-mint' : ''}
            ${detectedPreset === 'crazy' ? 'bg-clay-coral text-white' : ''}
            ${detectedPreset === 'custom' ? 'bg-clay-sage' : ''}
          `}>
            {detectedPreset === 'custom' ? 'CUSTOM' : PRESETS[detectedPreset].name}
          </span>
          {hasChanges && (
            <span className="text-xs text-clay-charcoal/50">
              (modified from {basePreset.name})
            </span>
          )}
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

        {/* Legal Warning */}
        {!validation.valid && (
          <div className="mb-6">
            <ClayErrorBanner
              severity="warning"
              title="Legal Boundary Warning"
              message="Current configuration violates legal boundaries. Adjust dimensions to fix:"
              details={validation.violations.map(v => v.message)}
            />
          </div>
        )}

        {/* Dimensions */}
        <div className="space-y-4">
          {DimensionNames.map((dimension) => {
            const info = DimensionInfo[dimension];
            const currentValue = dimensions[dimension];
            const baseValue = basePreset.dimensions[dimension];
            const isChanged = currentValue !== baseValue;

            return (
              <ClayCard key={dimension} padding="md">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Label */}
                  <div className="sm:w-48 flex-shrink-0">
                    <h3 className="font-semibold text-clay-charcoal">
                      {info.label}
                    </h3>
                    <p className="text-xs text-clay-charcoal/60 mt-1">
                      {info.description}
                    </p>
                  </div>

                  {/* Slider */}
                  <div className="flex-1 px-2">
                    <ClaySlider
                      value={currentValue}
                      onChange={(value) => updateDimension(dimension, value)}
                      min={1}
                      max={5}
                      labels={[info.lowLabel, info.highLabel]}
                    />
                  </div>

                  {/* Diff indicator */}
                  {showDiff && isChanged && (
                    <div className="sm:w-24 flex-shrink-0 text-right">
                      <span className={`
                        text-xs px-2 py-1 rounded-full
                        ${currentValue > baseValue ? 'bg-clay-coral/20 text-clay-coral' : 'bg-clay-mint/50 text-clay-charcoal'}
                      `}>
                        {baseValue} → {currentValue}
                      </span>
                    </div>
                  )}
                </div>
              </ClayCard>
            );
          })}
        </div>

        {/* Show Diff Toggle */}
        <div className="mt-6 flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`
              relative w-12 h-7 rounded-full transition-colors
              ${showDiff ? 'bg-clay-mint' : 'bg-clay-stone shadow-clay-inset'}
            `}>
              <input
                type="checkbox"
                checked={showDiff}
                onChange={(e) => setShowDiff(e.target.checked)}
                className="sr-only"
              />
              <span className={`
                absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-clay transition-transform
                ${showDiff ? 'translate-x-5' : ''}
              `} />
            </div>
            <span className="text-sm text-clay-charcoal">Show differences from {basePreset.name}</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <ClayButton
            variant="pill"
            color="stone"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </ClayButton>
          
          <div className="flex gap-3">
            <ClayButton
              variant="pill"
              color="sand"
              onClick={resetToDefault}
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </ClayButton>
            
            <ClayButton
              variant="pill"
              color="coral"
              onClick={handleComplete}
            >
              <Check className="w-4 h-4" />
              Complete
            </ClayButton>
          </div>
        </div>
      </div>
    </div>
  );
};
