import { Shield, MessageSquare, Sliders, Sparkles } from 'lucide-react';
import { ClayCard } from '@/components/clay';

interface LandingPageProps {
  onSelectPreset: () => void;
  onStartInterview: () => void;
  onOpenBuilder: () => void;
  onLogoTap: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectPreset,
  onStartInterview,
  onOpenBuilder,
  onLogoTap,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={onLogoTap}
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-coral/50 rounded-xl p-2 -ml-2"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-clay-coral to-clay-peach shadow-clay flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-clay-charcoal">OpenCLAW</span>
          </button>
          
          <div className="text-sm text-clay-charcoal/60">
            Preset System v1.0
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-clay-mint/50 shadow-clay mb-8">
            <Shield className="w-4 h-4 text-clay-charcoal" />
            <span className="text-sm font-medium text-clay-charcoal">
              Legal-First Configuration
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-clay-charcoal mb-6 leading-tight">
            Configure Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-clay-coral to-clay-peach">
              AI Agent
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-clay-charcoal/70 max-w-2xl mx-auto mb-12">
            OpenCLAW Preset System helps you define clear boundaries, capabilities, 
            and behaviors for AI agents. Choose a preset or build your own configuration.
          </p>

          {/* Entry Points */}
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Preset Card */}
            <ClayCard 
              isInteractive 
              onClick={onSelectPreset}
              className="text-left group"
            >
              <div className="w-12 h-12 rounded-full bg-clay-peach shadow-clay flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-clay-charcoal" />
              </div>
              <h3 className="text-lg font-semibold text-clay-charcoal mb-2">
                Choose Preset
              </h3>
              <p className="text-sm text-clay-charcoal/60">
                Select from SECURITY, OPEN, or CRAZY presets for quick configuration.
              </p>
            </ClayCard>

            {/* Interview Card */}
            <ClayCard 
              isInteractive 
              onClick={onStartInterview}
              className="text-left group"
            >
              <div className="w-12 h-12 rounded-full bg-clay-mint shadow-clay flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-clay-charcoal" />
              </div>
              <h3 className="text-lg font-semibold text-clay-charcoal mb-2">
                Interview Wizard
              </h3>
              <p className="text-sm text-clay-charcoal/60">
                Answer guided questions to create the most precise configuration.
              </p>
            </ClayCard>

            {/* Builder Card */}
            <ClayCard 
              isInteractive 
              onClick={onOpenBuilder}
              className="text-left group"
            >
              <div className="w-12 h-12 rounded-full bg-clay-sage shadow-clay flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6 text-clay-charcoal" />
              </div>
              <h3 className="text-lg font-semibold text-clay-charcoal mb-2">
                Custom Builder
              </h3>
              <p className="text-sm text-clay-charcoal/60">
                Fine-tune all 8 dimensions with live preview and optional diff.
              </p>
            </ClayCard>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-clay-charcoal mb-3">
              What You Get
            </h2>
            <p className="text-clay-charcoal/60">
              Five markdown files that define your agent&apos;s behavior
            </p>
          </div>

          <div className="grid sm:grid-cols-5 gap-4">
            {[
              { name: 'soul.md', desc: 'Core principles & values' },
              { name: 'identity.md', desc: 'Role & capabilities' },
              { name: 'shield.md', desc: 'Safety boundaries' },
              { name: 'user.md', desc: 'User relationship' },
              { name: 'heartbeat.md', desc: 'Operational rhythm' },
            ].map((file) => (
              <div 
                key={file.name}
                className="bg-clay-base rounded-xl p-4 shadow-clay border border-white/50 text-center"
              >
                <code className="text-sm font-mono text-clay-coral font-semibold">
                  {file.name}
                </code>
                <p className="text-xs text-clay-charcoal/60 mt-2">
                  {file.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-clay-sand/50 rounded-xl p-4 text-center">
            <p className="text-sm text-clay-charcoal/70">
              <span className="font-semibold">Legal Notice:</span>{' '}
              All presets are legal-only. Higher autonomy increases responsibility.
            </p>
          </div>
          
          <div className="mt-6 text-center text-xs text-clay-charcoal/40">
            OpenCLAW Preset System • Stateless Client-First Generator • v1.0.0
          </div>
        </div>
      </footer>
    </div>
  );
};
