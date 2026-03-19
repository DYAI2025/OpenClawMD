import { ArrowLeft, Shield, Zap, Globe, ChevronRight } from 'lucide-react';
import { ClayButton, ClayCard, ClayCardContent } from '@/components/clay';
import { getAllPresets, getRiskProfileColor, getAutonomyLevelColor } from '@/lib/presets';
import { useTheme } from '@/hooks/use-theme';

interface PresetsPageProps {
  onSelectPreset: (presetId: string) => void;
  onBack: () => void;
}

const presetIcons: Record<string, React.ReactNode> = {
  security: <Shield className="w-6 h-6" />,
  responsible: <Globe className="w-6 h-6" />,
  overclaw: <Zap className="w-6 h-6" />,
};

const presetColors: Record<string, string> = {
  security: 'bg-clay-peach',
  responsible: 'bg-clay-mint',
  overclaw: 'bg-clay-coral',
};

export const PresetsPage: React.FC<PresetsPageProps> = ({
  onSelectPreset,
  onBack,
}) => {
  const presets = getAllPresets();
  const { isDark } = useTheme();

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
                preset.id === 'security' ? { backgroundImage: isDark
                  ? 'linear-gradient(90deg, rgba(30,34,54,1) 0%, rgba(52,223,166,0.3) 100%)'
                  : 'linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(52, 223, 166) 100%)' } :
                preset.id === 'responsible' ? { backgroundImage: isDark
                  ? 'linear-gradient(90deg, rgba(30,34,54,1) 0%, rgba(160,100,30,0.3) 100%)'
                  : 'linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(219, 141, 51) 100%)' } :
                preset.id === 'overclaw' ? { backgroundImage: isDark
                  ? 'linear-gradient(90deg, rgba(30,34,54,1) 0%, rgba(60,130,80,0.3) 100%)'
                  : 'linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(200, 106, 115) 100%)' } :
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
                      ${preset.id === 'overclaw' ? 'text-white' : 'text-clay-charcoal'}
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

              <ClayButton
                variant="pill"
                color={preset.id === 'security' ? 'peach' : preset.id === 'responsible' ? 'mint' : 'coral'}
                className="flex-1 justify-center mt-4 ml-6 mb-6"
                onClick={() => onSelectPreset(preset.id)}
              >
                Start with {preset.name}
                <ChevronRight className="w-4 h-4" />
              </ClayButton>
            </ClayCard>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-clay-sand/50 rounded-2xl p-6 text-center border border-white/40">
          <p className="text-sm text-clay-charcoal/70 leading-relaxed">
            <span className="font-bold text-clay-coral">Pro Tip:</span>{' '}
            Presets are designed as architectural foundations. Once selected, you can fine-tune every parameter in the Customizer to match your specific hardware and safety requirements.
          </p>
        </div>

        {/* Educational Content Section — Critical for AdSense Publisher Content Compliance */}
        <div className="mt-20 pt-12 border-t border-clay-stone/10">
          <h2 className="text-3xl font-black text-clay-charcoal mb-8 text-center md:text-left">
            How to Choose the Right <span className="text-clay-coral">Agent Architecture</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 text-clay-charcoal/70 leading-relaxed">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-clay-charcoal">Understanding Risk Profiles</h3>
              <p>
                In autonomous agency, risk is defined by the degree of irreversibility. A <strong>High Risk</strong> profile like OverClaw assumes the agent is operating in a sandboxed environment where it can safely experiment with file system changes and tool execution. 
              </p>
              <p>
                For production systems handling sensitive user data, a <strong>Security-First</strong> architecture is mandatory. This preset enforces strict SHIELD.md boundaries and requires human-in-the-loop (HITL) verification for all write operations.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-clay-charcoal">Autonomy vs. Control</h3>
              <p>
                Autonomy is not binary; it's a spectrum. The <strong>Responsible AI</strong> preset is optimized for the "Co-Pilot" pattern, where the agent suggests and the user validates. It prioritizes semantic transparency over raw speed.
              </p>
              <p>
                When building multi-agent systems, we recommend starting with a <strong>Security-First Orchestrator</strong> that manages multiple <strong>OverClaw Specialists</strong> in isolated containers. This "Trust-But-Verify" architecture is the current industry standard for agentic reliability.
              </p>
            </div>
          </div>

          <ClayCard className="mt-12 p-8 bg-clay-peach/5 border-clay-peach/20">
            <h3 className="text-lg font-bold text-clay-charcoal mb-4">A Note on Determinism</h3>
            <p className="text-sm text-clay-charcoal/60 leading-relaxed">
              While Large Language Models (LLMs) are inherently probabilistic, Animae Agentis aims to maximize <strong>behavioral determinism</strong>. By using a standardized 12-file framework, we ensure that the agent's identity and safety rules remain stable even as the underlying model fluctuates. This is the core of our "Identity-as-Code" philosophy.
            </p>
          </ClayCard>
        </div>
      </div>
    </div>
  );
};
