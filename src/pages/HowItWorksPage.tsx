import { ArrowRight, FileText, Shield, Brain, Settings, Heart, Eye, Database, Tag, Cpu, ChevronRight } from 'lucide-react';
import { ClayCard, ClayButton } from '@/components/clay';

interface HowItWorksPageProps {
  onBack: () => void;
  onStartFresh: () => void;
  onSelectPreset: () => void;
}

const FILE_INFO = [
  {
    name: 'SOUL.md',
    icon: Brain,
    purpose: 'Constitution — the unchanging principles',
    sections: ['Agent Mode', 'Negative Constraints', 'Truth Policy', 'Invariants'],
    usedFor: 'Every decision the agent makes is checked against SOUL.md first. If an action conflicts with a constraint here, it is blocked regardless of what other files say.',
    color: 'bg-clay-coral',
  },
  {
    name: 'IDENTITY.md',
    icon: Tag,
    purpose: 'Who the agent is — name, role, communication style',
    sections: ['Name & Title', 'Domain Focus', 'Tone', 'Problem Statement'],
    usedFor: 'The agent reads this to know how to present itself, what expertise to draw on, and how to phrase its responses.',
    color: 'bg-clay-peach',
  },
  {
    name: 'USER.md',
    icon: Settings,
    purpose: 'Operating contract between agent and user',
    sections: ['Autonomy', 'Output Contract', 'Addressing', 'Stop Words'],
    usedFor: 'Defines the working relationship: how much independence the agent has, what format outputs should take, and how to address the user.',
    color: 'bg-clay-mint',
  },
  {
    name: 'HEARTBEAT.md',
    icon: Heart,
    purpose: 'Operational rhythm — health checks and discovery',
    sections: ['Rotating Checks', 'Context Guard', 'Compaction', 'Discovery Loop', 'Task Reconciliation'],
    usedFor: 'The agent runs heartbeat checks periodically to monitor its own health, manage memory, and trigger discovery or innovation loops.',
    color: 'bg-clay-sage',
  },
  {
    name: 'SHIELD.md',
    icon: Shield,
    purpose: 'Safety boundaries — blocks destructive actions',
    sections: ['Default Blocks', 'Policy Gates', 'Prompt Injection Defense', 'Emergency Stop'],
    usedFor: 'Before executing any potentially dangerous action, the agent checks SHIELD.md. Blocked actions are logged but never executed.',
    color: 'bg-clay-sand',
  },
  {
    name: 'SPIRIT.md',
    icon: Eye,
    purpose: 'Single source of truth — canonical values',
    sections: ['Core Identity', 'Tone', 'Autonomy', 'Surprise', 'Constitution', 'Output'],
    usedFor: 'When files disagree, SPIRIT.md is the tiebreaker. It holds the raw configuration values that all other files are derived from.',
    color: 'bg-clay-coral/70',
  },
  {
    name: 'CORTEX.md',
    icon: FileText,
    purpose: 'Workspace map — where things live',
    sections: ['File Table', 'Directory Structure', 'Naming Conventions', 'Dependencies'],
    usedFor: 'The agent reads this to understand the workspace layout — where to find logs, checkpoints, archives, and which files depend on which.',
    color: 'bg-clay-peach/70',
  },
  {
    name: 'MEMORY.md',
    icon: Database,
    purpose: 'Stable facts — learned preferences and patterns',
    sections: ['Stable Preferences', 'Operating Boundaries', 'Flush Protocol', 'Decisions', 'Patterns'],
    usedFor: 'Long-term memory for facts that remain true across sessions. The agent writes here when it learns something durable about the user or environment.',
    color: 'bg-clay-mint/70',
  },
  {
    name: 'VERSION.md',
    icon: Tag,
    purpose: 'Version marker — migration and compatibility',
    sections: ['Template Version', 'Generated At', 'Migration Notes'],
    usedFor: 'Tracks which version of the template pack generated these files, enabling clean upgrades and backwards compatibility checks.',
    color: 'bg-clay-sage/70',
  },
  {
    name: 'OPS.md',
    icon: Cpu,
    purpose: 'Operational playbook — model routing and cost control',
    sections: ['Model Routing', 'Prompt Injection Defense', 'Tool Policies', 'Cost Control', 'Security', 'Coordination'],
    usedFor: 'Reference guide for infrastructure decisions: which model to use, how to handle failures, spend limits, and multi-agent coordination patterns.',
    color: 'bg-clay-sand/70',
  },
];

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onBack,
  onStartFresh,
  onSelectPreset,
}) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="w-full px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={onBack}
            className="text-sm font-semibold text-clay-charcoal/60 hover:text-clay-coral transition-colors flex items-center gap-1"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-clay-charcoal mb-4 text-balance">
            How Animae Agentis Works
          </h1>
          <p className="text-lg text-clay-charcoal/60 max-w-2xl mx-auto">
            10 Markdown files, each with a specific job. Together they define
            every aspect of an AI agent's behavior — from identity to cost control.
          </p>
        </div>

        {/* File Relationship Diagram */}
        <ClayCard className="p-8 mb-16">
          <h2 className="text-xl font-bold text-clay-charcoal mb-6">
            File Relationships
          </h2>
          <pre className="text-sm text-clay-charcoal/70 font-mono leading-relaxed overflow-x-auto">
{`SPIRIT.md (single source of truth)
    │
    ├── SOUL.md (constitution — constrains everything)
    │
    ├── IDENTITY.md (who the agent is)
    │
    ├── USER.md (operating contract)
    │       ├── HEARTBEAT.md (implements cadence from USER autonomy)
    │       └── SHIELD.md (implements blocks from USER approval rules)
    │
    ├── MEMORY.md (distilled from daily logs)
    │
    ├── OPS.md (operational patterns — references SHIELD + HEARTBEAT)
    │
    ├── CORTEX.md (maps all files + workspace structure)
    │
    └── VERSION.md (tracks template version for migration)`}
          </pre>
        </ClayCard>

        {/* File Details */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-clay-charcoal mb-8 text-center">
            The 10 Files
          </h2>

          <div className="space-y-4">
            {FILE_INFO.map((file) => {
              const Icon = file.icon;
              return (
                <ClayCard key={file.name} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full ${file.color} shadow-clay flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="text-base font-mono font-bold text-clay-coral">
                          {file.name}
                        </code>
                        <span className="text-sm text-clay-charcoal/50">
                          {file.purpose}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {file.sections.map((section) => (
                          <span
                            key={section}
                            className="px-2 py-0.5 text-xs rounded-full bg-clay-base border border-white/50 dark:border-white/[0.06] text-clay-charcoal/60"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-clay-charcoal/60 leading-relaxed">
                        {file.usedFor}
                      </p>
                    </div>
                  </div>
                </ClayCard>
              );
            })}
          </div>
        </div>

        {/* Why Markdown */}
        <ClayCard className="p-8 mb-16">
          <h2 className="text-xl font-bold text-clay-charcoal mb-4">
            Why Markdown?
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-clay-charcoal mb-2">Human-Readable</h3>
              <p className="text-sm text-clay-charcoal/60">
                No proprietary format. Open any file in any text editor and understand
                exactly what your agent is configured to do.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-clay-charcoal mb-2">Version-Controllable</h3>
              <p className="text-sm text-clay-charcoal/60">
                Track changes with Git. See exactly what changed, when, and why.
                Roll back to any previous configuration instantly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-clay-charcoal mb-2">Model-Agnostic</h3>
              <p className="text-sm text-clay-charcoal/60">
                Works with any AI model that can read text. No vendor lock-in,
                no proprietary SDK required. Switch providers without reconfiguring.
              </p>
            </div>
          </div>
        </ClayCard>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-clay-charcoal mb-4">
            Ready to build?
          </h2>
          <p className="text-clay-charcoal/60 mb-8">
            Start with a preset for instant results, or customize every detail through the guided interview.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ClayButton onClick={onSelectPreset} variant="pill">
              Browse Presets
            </ClayButton>
            <ClayButton onClick={onStartFresh} variant="pill" color="coral">
              Start Fresh
              <ArrowRight className="w-4 h-4 ml-2" />
            </ClayButton>
          </div>
        </div>
      </div>
    </div>
  );
};
