import { useRef } from 'react';
import { Shield, MessageSquare, Sliders, Sparkles, Upload, Tag, Globe, ExternalLink } from 'lucide-react';
import { ClayCard, ClayButton } from '@/components/clay';
import { toast } from 'sonner';
import { OpenClawConfig } from '@/lib/openclaw/schema';
import type { OpenClawConfigType } from '@/lib/openclaw/schema';

interface LandingPageProps {
  onSelectPreset: () => void;
  onStartInterview: () => void;
  onOpenBuilder: () => void;
  onLogoTap: () => void;
  onImportConfig: (config: OpenClawConfigType) => void;
  onOpenBlog: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectPreset,
  onStartInterview,
  onOpenBuilder,
  onLogoTap,
  onImportConfig,
  onOpenBlog,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        const parsed = OpenClawConfig.safeParse(raw);
        if (!parsed.success) {
          toast.error('Invalid config file — schema validation failed');
          return;
        }
        toast.success(`Loaded config: ${parsed.data.metadata.name}`);
        onImportConfig(parsed.data);
      } catch {
        toast.error('Could not parse JSON file');
      }
    };
    reader.readAsText(file);
    // Reset so same file can be re-imported
    e.target.value = '';
  };
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
            <span className="text-xl font-bold text-clay-charcoal">OpenForge</span>
          </button>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={onOpenBlog}
              className="text-sm font-semibold text-clay-charcoal/60 hover:text-clay-coral transition-colors hidden md:block"
            >
              Intelligence Lab
            </button>
            <div className="flex items-center gap-3">
            <ClayButton
              variant="pill"
              color="stone"
              size="sm"
              onClick={handleImportClick}
              title="Import a previously exported openclaw-config.json"
            >
              <Upload className="w-4 h-4" />
              Import Config
            </ClayButton>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Import OpenCLAW configuration JSON file"
            />
            <span className="text-sm text-clay-charcoal/60 hidden sm:block">
              Preset System v1.0
            </span>
          </div>
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
            OpenForge
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-clay-coral to-clay-peach">
              Skill &amp; Soul
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-clay-charcoal/70 max-w-2xl mx-auto mb-12">
            Define the skill, shape the soul. OpenForge helps you craft precise boundaries, 
            capabilities, and behaviors for AI agents — choose a preset or build your own.
          </p>

          {/* Entry Points */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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

            {/* Blog Card */}
            <ClayCard 
              isInteractive 
              onClick={onOpenBlog}
              className="text-left group bg-clay-sand/30"
            >
              <div className="w-12 h-12 rounded-full bg-clay-peach shadow-clay flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Tag className="w-6 h-6 text-clay-charcoal" />
              </div>
              <h3 className="text-lg font-semibold text-clay-charcoal mb-2">
                Intelligence Lab
              </h3>
              <p className="text-sm text-clay-charcoal/60">
                Read deep dives on AI agent technology and the OpenForge standard.
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

      {/* Ecosystem Section */}
      <section className="px-6 py-16 bg-clay-base/30 relative border-y border-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-clay-charcoal mb-4">
                The AI Agent <span className="text-clay-coral underline decoration-clay-coral/20">Ecosystem</span>
              </h2>
              <p className="text-clay-charcoal/60 mb-8 leading-relaxed">
                OpenForge lives at the intersection of technical performance and legal safety. 
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
            OpenForge • Skill &amp; Soul • Stateless Client-First Generator • v1.0.0
          </div>
        </div>
      </footer>
    </div>
  );
};
