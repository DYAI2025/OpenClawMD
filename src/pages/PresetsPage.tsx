import { ArrowLeft, Shield, Zap, Globe, ChevronRight, Settings } from 'lucide-react';
import { ClayButton, ClayCard, ClayCardContent, ClayCardFooter } from '@/components/clay';
import type { PresetIdType } from '@/lib/openclaw/schema';
import { getAllPresets, getRiskProfileColor, getAutonomyLevelColor } from '@/lib/openclaw/presets';

interface PresetsPageProps {
  onSelectPreset: (presetId: PresetIdType) => void;
  onCustomize: (presetId: PresetIdType) => void;
  onBack: () => void;
}

const presetIcons: Record<string, React.ReactNode> = {
  security: <Shield className="w-6 h-6" />,
  open: <Globe className="w-6 h-6" />,
  crazy: <Zap className="w-6 h-6" />,
};

const presetColors: Record<string, string> = {
  security: 'bg-clay-peach',
  open: 'bg-clay-mint',
  crazy: 'bg-clay-coral',
};

export const PresetsPage: React.FC<PresetsPageProps> = ({
  onSelectPreset,
  onCustomize,
  onBack,
}) => {
  const presets = getAllPresets();

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
          <div>
            <h1 className="text-2xl font-bold text-clay-charcoal">
              Choose a Preset
            </h1>
            <p className="text-sm text-clay-charcoal/60">
              Select a starting point for your configuration
            </p>
          </div>
        </div>

        {/* Preset Cards */}
        <div className="space-y-6">
          {presets.map((preset) => (
            <ClayCard
              key={preset.id}
              padding="lg"
              style={
                preset.id === 'open' ? { backgroundImage: 'linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(219, 141, 51) 100%)' } :
                preset.id === 'crazy' ? { backgroundImage: 'linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(100, 185, 133) 100%)' } :
                undefined
              }
            >
              <ClayCardContent>
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-14 h-14 rounded-full shadow-clay flex items-center justify-center flex-shrink-0
                      ${presetColors[preset.id]}
                      ${preset.id === 'crazy' ? 'text-white' : 'text-clay-charcoal'}
                    `}>
                      {presetIcons[preset.id]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-clay-charcoal">
                        {preset.name}
                      </h2>
                      <p className="text-clay-coral font-medium mt-1">
                        {preset.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 lg:ml-auto">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${getRiskProfileColor(preset.metadata.riskProfile)}
                    `}>
                      Risk: {preset.metadata.riskProfile}
                    </span>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${getAutonomyLevelColor(preset.metadata.autonomyLevel)}
                    `}>
                      Autonomy: {preset.metadata.autonomyLevel}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-clay-charcoal/70 mt-4 leading-relaxed">
                  {preset.description}
                </p>

                {/* Use Cases */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-clay-charcoal mb-2">
                    Best for:
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {preset.metadata.useCases.map((useCase, idx) => (
                      <li 
                        key={idx}
                        className="flex items-center gap-2 text-sm text-clay-charcoal/70"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-clay-sage flex-shrink-0" />
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              </ClayCardContent>

              <ClayCardFooter className="flex flex-col sm:flex-row gap-3">
                <ClayButton
                  variant="pill"
                  color={preset.id === 'security' ? 'peach' : preset.id === 'open' ? 'mint' : 'coral'}
                  className="flex-1 justify-center"
                  onClick={() => onSelectPreset(preset.id)}
                >
                  Use {preset.name}
                  <ChevronRight className="w-4 h-4" />
                </ClayButton>
                
                <ClayButton
                  variant="pill"
                  color="stone"
                  className="flex-1 justify-center"
                  onClick={() => onCustomize(preset.id)}
                >
                  <Settings className="w-4 h-4" />
                  Customize
                </ClayButton>
              </ClayCardFooter>
            </ClayCard>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-clay-sand/50 rounded-xl p-4 text-center">
          <p className="text-sm text-clay-charcoal/70">
            <span className="font-semibold">Tip:</span>{' '}
            Start with a preset and customize it in the builder for the best experience.
          </p>
        </div>
      </div>
    </div>
  );
};
