import { Shield, Sparkles, Tag, Globe, ExternalLink } from 'lucide-react';
import { ClayCard } from '@/components/clay';

interface LandingPageProps {
  onSelectPreset: () => void;
  onStartFresh: () => void;
  onOpenBlog: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectPreset,
  onStartFresh,
  onOpenBlog,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 rounded-xl p-2 -ml-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-clay-coral to-clay-peach shadow-clay flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-clay-charcoal">SoulForge</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenBlog}
              className="text-sm font-semibold text-clay-charcoal/60 hover:text-clay-coral transition-colors hidden md:block"
            >
              Intelligence Lab
            </button>
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
            SoulForge
            <span className="block lg:text-[50px] text-transparent bg-clip-text bg-gradient-to-r from-clay-coral to-clay-peach">
              Agentic Autopoesis
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-clay-charcoal/70 max-w-2xl mx-auto mb-12">
            Self-creating, self-defining. SoulForge generates the behavioral fabric of autonomous agents —
            identity, values, boundaries and rhythm — from a single source of truth.
          </p>

          {/* Entry Points */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Start Fresh Card */}
            <ClayCard
              isInteractive
              onClick={onStartFresh}
              className="text-left group"
            >
              <div className="w-12 h-12 rounded-full bg-clay-coral shadow-clay flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-clay-charcoal mb-2">
                Start Fresh
              </h3>
              <p className="text-sm text-clay-charcoal/60">
                Build your agent's identity from scratch through our guided interview.
              </p>
            </ClayCard>

            {/* Preset Card */}
            <ClayCard
              isInteractive
              onClick={onSelectPreset}
              className="text-left group"
            >
              <div className="w-12 h-12 rounded-full bg-clay-mint shadow-clay flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-clay-charcoal" />
              </div>
              <h3 className="text-lg font-semibold text-clay-charcoal mb-2">
                Use a Preset
              </h3>
              <p className="text-sm text-clay-charcoal/60">
                Start with Security, Responsible, or OverClaw and customize from there.
              </p>
            </ClayCard>

            {/* Blog Card */}
            <ClayCard
              isInteractive
              onClick={onOpenBlog}
              className="text-left group"
            >
              <div className="w-12 h-12 rounded-full bg-clay-peach shadow-clay flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Tag className="w-6 h-6 text-clay-charcoal" />
              </div>
              <h3 className="text-lg font-semibold text-clay-charcoal mb-2">
                Intelligence Lab
              </h3>
              <p className="text-sm text-clay-charcoal/60">
                Read deep dives on AI agent technology and the SoulForge standard.
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
              Nine configuration files that define your agent&apos;s behavioral fabric
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {[
              { name: 'SOUL.md', desc: 'Core principles & values' },
              { name: 'IDENTITY.md', desc: 'Role & capabilities' },
              { name: 'USER.md', desc: 'User relationship' },
              { name: 'HEARTBEAT.md', desc: 'Operational rhythm' },
              { name: 'SHIELD.md', desc: 'Safety boundaries' },
              { name: 'CANON.md', desc: 'Behavioral canon' },
              { name: 'INDEX.md', desc: 'File manifest' },
              { name: 'MEMORY.md', desc: 'Memory & context' },
              { name: 'VERSION.md', desc: 'Version tracking' },
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

      {/* Ecosystem Section */}
      <section className="px-6 py-16 bg-clay-base/30 relative border-y border-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-clay-charcoal mb-4">
                The AI Agent <span className="text-clay-coral underline decoration-clay-coral/20">Ecosystem</span>
              </h2>
              <p className="text-clay-charcoal/60 mb-8 leading-relaxed">
                SoulForge lives at the intersection of technical performance and legal safety.
                We are proud to build upon the <span className="text-clay-charcoal font-semibold">OpenCLAW 0.1</span> standard and collaborate with visionary projects
                redefining what it means to give AI a body and a purpose.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://openclaw.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-2xl bg-white/60 border border-white shadow-clay hover:shadow-clay-lifted hover:-translate-y-1 transition-all flex items-center gap-2 text-sm font-bold text-clay-charcoal group"
                >
                  <Globe className="w-4 h-4 text-clay-charcoal/40 group-hover:text-clay-coral transition-colors" />
                  OpenCLAW.ai
                  <ExternalLink className="w-3 h-3 text-clay-charcoal/20" />
                </a>
                <a
                  href="https://clawhub.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-2xl bg-white/60 border border-white shadow-clay hover:shadow-clay-lifted hover:-translate-y-1 transition-all flex items-center gap-2 text-sm font-bold text-clay-charcoal group"
                >
                  <Shield className="w-4 h-4 text-clay-charcoal/40 group-hover:text-clay-mint transition-colors" />
                  ClawHub
                  <ExternalLink className="w-3 h-3 text-clay-charcoal/20" />
                </a>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <ClayCard className="p-8 max-w-sm border-white shadow-clay-lifted bg-gradient-to-br from-white/60 to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-clay-coral/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-clay-coral uppercase tracking-widest mb-3 block">Scientific Spotlight</span>
                <h3 className="text-xl font-bold text-clay-charcoal mb-3">Neoform: I gave an AI a Body</h3>
                <p className="text-sm text-clay-charcoal/60 mb-6 leading-relaxed">
                  Deep research into embodied intelligence and the boundary where code meets physical reality.
                </p>
                <a
                  href="https://cyrusclarke.substack.com/p/i-gave-an-ai-a-body?r=1i4b97&utm_campaign=post&utm_medium=web&triedRedirect=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-clay-coral font-bold text-sm hover:gap-3 transition-all"
                >
                  Read the Publication <ExternalLink className="w-4 h-4" />
                </a>
              </ClayCard>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
