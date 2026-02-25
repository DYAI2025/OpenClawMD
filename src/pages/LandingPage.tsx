import { useState } from 'react';
import { Shield, ChevronRight, Clock } from 'lucide-react';
import downloadImg from '../../icons/download.png';
import customImg from '../../icons/custom.png';
import knowledgeImg from '../../icons/knowledge.png';
import { ClayCard } from '@/components/clay';
import { FilePreviewDialog } from '@/components/FilePreviewDialog';
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Logo */}
          <img
            src={logo1}
            alt="Animae Agentis"
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8 drop-shadow-lg"
          />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-clay-mint/50 shadow-clay mb-8">
            <Shield className="w-4 h-4 text-clay-charcoal" />
            <span className="text-sm font-medium text-clay-charcoal">
              Open Standard - No Backend - just Markdown
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-clay-charcoal mb-6 leading-tight text-balance">
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
                <img src={downloadImg} alt="Download Presets" width={48} height={48} className="w-full h-full object-cover" />
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
              <div className="w-12 h-12 rounded-full bg-clay-coral shadow-clay flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden">
                <img src={customImg} alt="Customize Your Files" width={48} height={48} className="w-full h-full object-cover" />
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
              <div className="w-12 h-12 rounded-full bg-clay-peach shadow-clay flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden">
                <img src={knowledgeImg} alt="How It Works" width={48} height={48} className="w-full h-full object-cover" />
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
              10 individual configurated markdown files that define your agent&apos;s complete behavioral framework. If you are already an expert, you can directly download the templates by simply click them. But we would recommand to customize your full set here.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {FILE_TILES.map((file) => (
              <button
                key={file.name}
                onClick={() => setPreviewFile(file.name)}
                className="bg-clay-base rounded-xl p-4 shadow-clay border border-white/50 dark:border-white/[0.06] text-center cursor-pointer hover:shadow-clay-lifted hover:-translate-y-1 hover:scale-[1.02] transition-[box-shadow,transform] duration-250 focus-visible:ring-2 focus-visible:ring-clay-coral/50 focus:outline-none"
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

      {/* Animae Verba Preview */}
      {latestWeekly && (
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-clay-charcoal mb-2">
                  Animae Verba
                </h2>
                <p className="text-clay-charcoal/60 text-sm">
                  Weekly reflections on autonomous agency
                </p>
              </div>
              <button
                onClick={onOpenAnimaeVerba}
                className="text-sm font-semibold text-clay-coral hover:underline flex items-center gap-1"
              >
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onOpenAnimaeVerba}
              className="w-full text-left group outline-none focus-visible:ring-2 focus-visible:ring-clay-coral rounded-3xl"
            >
              <ClayCard className="p-8 transition-all group-hover:shadow-clay-lifted group-hover:-translate-y-1 border-white/20 dark:border-white/[0.06]">
                <div className="flex items-center gap-4 mb-3">
                  <span className="px-3 py-1 bg-clay-coral/10 text-clay-coral text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {latestWeekly.category}
                  </span>
                  <span className="text-clay-charcoal/30 text-xs">{latestWeekly.date}</span>
                </div>
                <h3 className="text-xl font-bold text-clay-charcoal mb-3 group-hover:text-clay-coral transition-colors">
                  {latestWeekly.title}
                </h3>
                <p className="text-clay-charcoal/60 line-clamp-2 mb-4">{latestWeekly.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-clay-charcoal/40 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {latestWeekly.readTime}
                  </span>
                  <span className="text-clay-coral font-bold flex items-center gap-1 text-sm group-hover:gap-2 transition-[gap]">
                    Read <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </ClayCard>
            </button>
          </div>
        </section>
      )}

      {/* Educational Articles Preview */}
      {educationalPosts.length > 0 && (
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-clay-charcoal mb-2">
                  Usus
                </h2>
                <p className="text-clay-charcoal/60 text-sm">
                  Educational deep-dives
                </p>
              </div>
              <button
                onClick={onOpenUsus}
                className="text-sm font-semibold text-clay-coral hover:underline flex items-center gap-1"
              >
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {educationalPosts.map((post) => (
                <button
                  key={post.slug}
                  onClick={() => onOpenUsusArticle(post.slug)}
                  className="text-left group outline-none focus-visible:ring-2 focus-visible:ring-clay-coral rounded-3xl"
                >
                  <ClayCard className="p-6 h-full flex flex-col transition-all group-hover:shadow-clay-lifted group-hover:-translate-y-1 border-white/20 dark:border-white/[0.06]">
                    <span className="px-3 py-1 bg-clay-peach/20 text-clay-coral text-[10px] font-bold rounded-full uppercase tracking-wider self-start mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-base font-bold text-clay-charcoal mb-2 group-hover:text-clay-coral transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-clay-charcoal/60 text-sm line-clamp-2">{post.excerpt}</p>
                  </ClayCard>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* File Preview Dialog */}
      <FilePreviewDialog
        fileName={previewFile}
        isOpen={previewFile !== null}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};
