import { useState } from 'react';
import { Shield, Sparkles, Globe, ExternalLink, BookOpen } from 'lucide-react';
import logoImg from '../../icons/logo.png';
import { ClayCard, ClayThemeToggle } from '@/components/clay';
import { FilePreviewDialog } from '@/components/FilePreviewDialog';

interface LandingPageProps {
  onSelectPreset: () => void;
  onStartFresh: () => void;
  onOpenBlog: () => void;
  onHowItWorks: () => void;
}

const FILE_TILES = [
  { name: 'SOUL.md', desc: 'Immutable rules & truth policy' },
  { name: 'IDENTITY.md', desc: 'Name, title & tone of voice' },
  { name: 'USER.md', desc: 'Autonomy rules & output format' },
  { name: 'HEARTBEAT.md', desc: 'Health checks & discovery loops' },
  { name: 'SHIELD.md', desc: 'Blocks destructive actions' },
  { name: 'SPIRIT.md', desc: 'Single source of truth' },
  { name: 'CORTEX.md', desc: 'File map & naming conventions' },
  { name: 'MEMORY.md', desc: 'Stable facts & learned patterns' },
  { name: 'VERSION.md', desc: 'Migration & compatibility' },
  { name: 'OPS.md', desc: 'Model routing & cost control' },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectPreset,
  onStartFresh,
  onOpenBlog,
  onHowItWorks,
}) => {
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 rounded-xl p-2 -ml-2">
            <div className="w-10 h-10 rounded-full shadow-clay flex items-center justify-center overflow-hidden">
              <img src={logoImg} alt="Animae Agentis logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold text-clay-charcoal">Animae Agentis</span>
          </div>

          <ClayThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-clay-mint/50 shadow-clay mb-8">
            <Shield className="w-4 h-4 text-clay-charcoal" />
            <span className="text-sm font-medium text-clay-charcoal">
              Open Standard - No Backend - just Markdown
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-clay-charcoal mb-6 leading-tight">
            10 Markdown files that define
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-clay-coral to-clay-peach">
              how your AI agent behaves
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-clay-charcoal/70 max-w-2xl mx-auto mb-12">
            Animae Agentis generates a complete framework based on 10 markdown files that shapes the behavior of your OpenClaw fundamentally. You can select a purpose driven preset, customize them with our guidance in detail from scratch or just downloading each template and fill it on your own. Get in control of your OpenClaw agent.
          </p>

          {/* Three Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Download Presets */}
            <ClayCard
              isInteractive
              onClick={onSelectPreset}
              className="text-left group"
            >
              <div className="w-12 h-12 rounded-full shadow-clay flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden">
                <img src={logoImg} alt="Animae Agentis logo" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-semibold text-clay-charcoal mb-2">
                Download Presets
              </h3>
              <p className="text-sm text-clay-charcoal/60">
                Get pre-configured file sets for common agent types. Ready to use in seconds.
              </p>
            </ClayCard>

            {/* Customize Your Files */}
            <ClayCard
              isInteractive
              onClick={onStartFresh}
              className="text-left group"
            >
              <div className="w-12 h-12 rounded-full bg-clay-coral shadow-clay flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-clay-charcoal mb-2">
                Customize Your Files
              </h3>
              <p className="text-sm text-clay-charcoal/60">
                Walk through a guided interview to tailor every field to your agent's purpose.
              </p>
            </ClayCard>

            {/* How It Works */}
            <ClayCard
              isInteractive
              onClick={onHowItWorks}
              className="text-left group"
            >
              <div className="w-12 h-12 rounded-full bg-clay-peach shadow-clay flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-clay-charcoal" />
              </div>
              <h3 className="text-lg font-semibold text-clay-charcoal mb-2">
                How It Works
              </h3>
              <p className="text-sm text-clay-charcoal/60">
                Understand the architecture: which file controls what, and why it matters.
              </p>
            </ClayCard>
          </div>
        </div>
      </section>

      {/* File Tiles Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-clay-charcoal mb-3">
              What You Get
            </h2>
            <p className="text-clay-charcoal/60">
              10 configuration files that define your agent&apos;s complete behavioral framework
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {FILE_TILES.map((file) => (
              <button
                key={file.name}
                onClick={() => setPreviewFile(file.name)}
                className="bg-clay-base rounded-xl p-4 shadow-clay border border-white/50 dark:border-white/[0.06] text-center cursor-pointer hover:shadow-clay-lifted hover:-translate-y-1 hover:scale-[1.02] transition-all"
              >
                <code className="text-sm font-mono text-clay-coral font-semibold">
                  {file.name}
                </code>
                <p className="text-xs text-clay-charcoal/60 mt-2">
                  {file.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="px-6 py-16 bg-clay-base/30 relative border-y border-white/50 dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-clay-charcoal mb-4">
                Ecosystem
              </h2>
              <p className="text-clay-charcoal/60 mb-8 leading-relaxed">
                Animae Agentis builds upon the <span className="text-clay-charcoal font-semibold">OpenCLAW 0.1</span> standard.
                Explore the ecosystem and related projects.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://openclaw.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-2xl bg-white/60 dark:bg-white/[0.06] border border-white dark:border-white/[0.08] shadow-clay hover:shadow-clay-lifted hover:-translate-y-1 transition-all flex items-center gap-2 text-sm font-bold text-clay-charcoal group"
                >
                  <Globe className="w-4 h-4 text-clay-charcoal/40 group-hover:text-clay-coral transition-colors" />
                  OpenCLAW.ai
                  <ExternalLink className="w-3 h-3 text-clay-charcoal/20" />
                </a>
                <a
                  href="https://clawhub.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-2xl bg-white/60 dark:bg-white/[0.06] border border-white dark:border-white/[0.08] shadow-clay hover:shadow-clay-lifted hover:-translate-y-1 transition-all flex items-center gap-2 text-sm font-bold text-clay-charcoal group"
                >
                  <Shield className="w-4 h-4 text-clay-charcoal/40 group-hover:text-clay-mint transition-colors" />
                  ClawHub
                  <ExternalLink className="w-3 h-3 text-clay-charcoal/20" />
                </a>
                <button
                  onClick={onOpenBlog}
                  className="px-6 py-3 rounded-2xl bg-white/60 dark:bg-white/[0.06] border border-white dark:border-white/[0.08] shadow-clay hover:shadow-clay-lifted hover:-translate-y-1 transition-all flex items-center gap-2 text-sm font-bold text-clay-charcoal group"
                >
                  <BookOpen className="w-4 h-4 text-clay-charcoal/40 group-hover:text-clay-peach transition-colors" />
                  Intelligence Lab
                </button>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <ClayCard className="p-8 max-w-sm border-white dark:border-white/[0.06] shadow-clay-lifted bg-gradient-to-br from-white/60 dark:from-white/[0.04] to-transparent relative overflow-hidden group">
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

      {/* File Preview Dialog */}
      <FilePreviewDialog
        fileName={previewFile}
        isOpen={previewFile !== null}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};
