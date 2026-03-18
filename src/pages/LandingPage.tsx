import { useState, useRef, useCallback } from 'react';
import { Shield, ChevronRight, Clock } from 'lucide-react';
import downloadImg from '../../icons/download.png';
import customImg from '../../icons/custom.png';
import knowledgeImg from '../../icons/knowledge.png';
import { ClayCard, ShareBar } from '@/components/clay';
import { FilePreviewDialog } from '@/components/FilePreviewDialog';
import { AdSenseUnit, AD_SLOTS } from '@/components/AdSenseUnit';
import { getLatestWeeklyPost, getEducationalPosts } from '@/lib/blogData';
import logo1 from '../../icons/logo1.png';

interface LandingPageProps {
  onSelectPreset: () => void;
  onStartFresh: () => void;
  onOpenAnimaeVerba: () => void;
  onOpenUsus: () => void;
  onOpenUsusArticle: (slug: string) => void;
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
  { name: 'AGENTS.md', desc: 'Multi-agent collaboration rules' },
  { name: 'TOOLS.md', desc: 'Available tool definitions' },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectPreset,
  onStartFresh,
  onOpenAnimaeVerba,
  onOpenUsus,
  onOpenUsusArticle,
  onHowItWorks,
}) => {
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const latestWeekly = getLatestWeeklyPost();
  const educationalPosts = getEducationalPosts().slice(0, 3);

  // Track mouse position for file tile glow
  const tileGridRef = useRef<HTMLDivElement>(null);
  const handleTileMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 lg:py-24 relative">
        {/* Dot grid background */}
        <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Hero Logo */}
          <img
            src={logo1}
            alt="Animae Agentis"
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8 drop-shadow-lg animate-fade-up"
          />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-clay-mint/30 backdrop-blur-[12px] shadow-clay border border-white/40 dark:border-white/[0.08] mb-8 animate-fade-up stagger-2">
            <Shield className="w-4 h-4 text-clay-charcoal" />
            <span className="text-sm font-medium text-clay-charcoal tracking-wide">
              Open Standard &middot; No Backend &middot; just Markdown
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-clay-charcoal mb-8 leading-[1.1] text-balance animate-fade-up stagger-3 tracking-tight">
            12 Markdown files that define
            <span className="block gradient-text-animated mt-2">
              how your AI agent behaves
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-clay-charcoal/70 max-w-3xl mx-auto mb-16 leading-relaxed animate-fade-up stagger-4 font-medium">
            Animae Agentis generates a complete framework of 12 markdown files that shapes the behavior of your OpenClaw agent fundamentally. Select a purpose-driven preset, customize from scratch with our guided interview, or download each template and fill it on your own.
          </p>

          {/* Three Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Download Presets */}
            <ClayCard
              isInteractive
              onClick={onSelectPreset}
              className="text-left group animate-fade-up stagger-5 clay-glow p-8 rounded-[2.5rem]"
            >
              <div className="w-14 h-14 rounded-full shadow-clay flex items-center justify-center mb-6 group-hover:scale-110 transition-transform overflow-hidden bg-clay-peach/20">
                <img src={downloadImg} alt="Download Presets" width={56} height={56} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-clay-charcoal mb-3">
                Download Presets
              </h3>
              <p className="text-base text-clay-charcoal/60 leading-relaxed">
                Get pre-configured file sets for common agent types. Ready to use in seconds.
              </p>
            </ClayCard>

            {/* Customize Your Files — THE MAIN CTA */}
            <ClayCard
              isInteractive
              onClick={onStartFresh}
              className="text-left group animate-fade-up stagger-6 glass-glow-strong p-8 rounded-[2.5rem] bg-clay-coral text-white border-clay-coral/50 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
              <div className="w-14 h-14 rounded-full bg-white shadow-clay flex items-center justify-center mb-6 group-hover:scale-110 transition-transform overflow-hidden relative z-10">
                <img src={customImg} alt="Customize Your Files" width={56} height={56} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10">
                Customize Your Files
              </h3>
              <p className="text-base text-white/90 leading-relaxed relative z-10">
                Walk through a guided interview to tailor every field to your agent's purpose.
              </p>
              <div className="mt-6 flex justify-end relative z-10">
                <div className="px-4 py-2 rounded-full bg-white text-clay-coral font-bold text-sm shadow-clay flex items-center gap-2 group-hover:gap-3 transition-all">
                  Get Started <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </ClayCard>

            {/* How It Works */}
            <ClayCard
              isInteractive
              onClick={onHowItWorks}
              className="text-left group animate-fade-up stagger-7 clay-glow p-8 rounded-[2.5rem]"
            >
              <div className="w-14 h-14 rounded-full bg-clay-peach/20 shadow-clay flex items-center justify-center mb-6 group-hover:scale-110 transition-transform overflow-hidden">
                <img src={knowledgeImg} alt="How It Works" width={56} height={56} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-clay-charcoal mb-3">
                How It Works
              </h3>
              <p className="text-base text-clay-charcoal/60 leading-relaxed">
                Understand the architecture: which file controls what, and why it matters.
              </p>
            </ClayCard>
          </div>
        </div>
      </section>

      {/* File Tiles Section */}
      <section className="px-6 py-32 bg-clay-stone/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay-coral mb-4">The Framework</p>
            <h2 className="text-4xl sm:text-5xl font-black text-clay-charcoal mb-6">
              What You Get
            </h2>
            <p className="text-lg text-clay-charcoal/60 max-w-2xl mx-auto">
              12 individually configured markdown files that define your agent&apos;s complete behavioral framework. Click any file to preview the template.
            </p>
          </div>

          <div ref={tileGridRef} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {FILE_TILES.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setPreviewFile(file.name)}
                onMouseMove={handleTileMouseMove}
                aria-label={`Preview OpenClaw configuration file: ${file.name}`}
                title={`OpenClaw Standard: ${file.name}`}
                className={`file-tile group relative bg-clay-base/45 backdrop-blur-[14px] backdrop-saturate-[1.2] rounded-2xl p-0 shadow-clay border border-white/40 dark:border-white/[0.08] text-left cursor-pointer hover:shadow-glass-glow-strong hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-clay-coral/50 focus:outline-none animate-fade-up stagger-${idx + 1} overflow-hidden`}
              >
                {/* Markdown Header Strip */}
                <div className="bg-clay-stone/10 border-b border-white/20 px-3 py-2 flex items-center justify-between">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-clay-coral/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-clay-peach/40" />
                  </div>
                  <span className="text-[9px] font-black text-clay-charcoal/30 uppercase tracking-tighter">OpenClaw 0.1</span>
                </div>

                <div className="p-5">
                  <code className="text-sm font-mono text-clay-coral font-black block mb-3">
                    {file.name}
                  </code>
                  
                  {/* Faux Code Lines for 'Markdown' Look */}
                  <div className="space-y-1.5 mb-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <div className="h-1 w-full bg-clay-charcoal rounded-full" />
                    <div className="h-1 w-4/5 bg-clay-charcoal rounded-full" />
                    <div className="h-1 w-2/3 bg-clay-charcoal rounded-full" />
                  </div>

                  <p className="text-[11px] text-clay-charcoal/60 leading-relaxed font-bold line-clamp-2">
                    {file.desc}
                  </p>
                </div>

                {/* AI Search Semantic Hint (Hidden but Crawlable) */}
                <span className="sr-only" data-openclaw-meta="config-layer">
                  Standardized AI Agent {file.name} configuration for {file.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophical Content Section — Critical for AdSense Content Ratio */}
      <section className="px-6 py-32 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay-sage mb-6">Philosophy</p>
              <h2 className="text-4xl sm:text-5xl font-black text-clay-charcoal mb-8 leading-tight">
                The Soul of <span className="text-clay-coral text-balance">Autonomous Agency</span>
              </h2>
              <div className="space-y-6 text-clay-charcoal/70 leading-relaxed text-xl font-medium">
                <p>
                  Most AI implementations today are just sophisticated text predictors. True autonomy requires more than just intelligence—it requires a <strong>constitutional framework</strong>. Without a defined soul, an agent is merely a mirror of its immediate context, drifting without purpose or boundaries.
                </p>
                <p>
                  Animae Agentis is built on the belief that for an AI to be truly helpful and safe, its identity must be decoupled from its tasks. By defining 12 distinct behavioral layers—from immutable truth policies in <code>SOUL.md</code> to operational rhythms in <code>HEARTBEAT.md</code>—we create agents that remain coherent across long-term horizons and complex multi-agent collaborations.
                </p>
                <p>
                  This isn't just about prompt engineering; it's about <strong>agentic autopoiesis</strong>—the process of an system defining its own operational boundaries and identity. OpenClaw provides the engine, but Animae Agentis provides the spirit.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square rounded-[3rem] bg-gradient-to-br from-clay-coral/20 to-clay-peach/20 border border-white/40 shadow-clay flex items-center justify-center p-12 animate-pulse-slow">
              <Shield className="w-full h-full text-clay-coral/40" />
            </div>
          </div>
        </div>
      </section>

      {/* Animae Verba Preview */}
      {latestWeekly && (
        <section className="px-6 py-32 bg-clay-stone/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay-sage mb-3">Reflections</p>
                <h2 className="text-4xl font-black text-clay-charcoal">
                  Animae Verba
                </h2>
                <p className="text-clay-charcoal/60 text-lg mt-2">
                  Weekly reflections on autonomous agency
                </p>
              </div>
              <button
                onClick={onOpenAnimaeVerba}
                className="text-base font-bold text-clay-coral hover:underline flex items-center gap-2 transition-all hover:gap-3"
              >
                View all <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={onOpenAnimaeVerba}
              className="w-full text-left group outline-none focus-visible:ring-2 focus-visible:ring-clay-coral rounded-[2.5rem]"
            >
              <ClayCard className="p-10 transition-all group-hover:shadow-clay-lifted group-hover:-translate-y-2 border-white/20 dark:border-white/[0.06] rounded-[2.5rem]">
                <div className="flex items-center gap-6 mb-6">
                  <span className="px-4 py-1.5 bg-clay-coral/10 text-clay-coral text-xs font-black rounded-full uppercase tracking-widest">
                    {latestWeekly.category}
                  </span>
                  <span className="text-clay-charcoal/30 text-sm font-bold">{latestWeekly.date}</span>
                </div>
                <h3 className="text-3xl font-black text-clay-charcoal mb-4 group-hover:text-clay-coral transition-colors">
                  {latestWeekly.title}
                </h3>
                <p className="text-clay-charcoal/60 line-clamp-2 mb-8 text-xl font-medium">{latestWeekly.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-clay-charcoal/40 text-base font-bold flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {latestWeekly.readTime}
                  </span>
                  <span className="text-clay-coral font-black flex items-center gap-2 text-base group-hover:gap-3 transition-all">
                    Read Article <ChevronRight className="w-5 h-5" />
                  </span>
                </div>
              </ClayCard>
            </button>
          </div>
        </section>
      )}

      {/* Ad Unit — moved further down after substantial content */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <AdSenseUnit slot={AD_SLOTS.LANDING_MID} />
        </div>
      </section>

      {/* Educational Articles Preview */}
      {educationalPosts.length > 0 && (
        <section className="px-6 py-32">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay-mint mb-3">Learn</p>
                <h2 className="text-4xl font-black text-clay-charcoal">
                  Usus
                </h2>
                <p className="text-clay-charcoal/60 text-lg mt-2">
                  Educational deep-dives
                </p>
              </div>
              <button
                onClick={onOpenUsus}
                className="text-base font-bold text-clay-coral hover:underline flex items-center gap-2 transition-all hover:gap-3"
              >
                View all <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {educationalPosts.map((post) => (
                <button
                  key={post.slug}
                  onClick={() => onOpenUsusArticle(post.slug)}
                  className="text-left group outline-none focus-visible:ring-2 focus-visible:ring-clay-coral rounded-[2rem]"
                >
                  <ClayCard className="p-8 h-full flex flex-col transition-all group-hover:shadow-clay-lifted group-hover:-translate-y-2 border-white/20 dark:border-white/[0.06] rounded-[2rem]">
                    <span className="px-3 py-1 bg-clay-peach/20 text-clay-coral text-[10px] font-black rounded-full uppercase tracking-widest self-start mb-4">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold text-clay-charcoal mb-3 group-hover:text-clay-coral transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-clay-charcoal/60 text-base line-clamp-2 font-medium">{post.excerpt}</p>
                  </ClayCard>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Share Section */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-clay-charcoal/50 mb-3">Share OpenClawMD</p>
          <ShareBar />
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
