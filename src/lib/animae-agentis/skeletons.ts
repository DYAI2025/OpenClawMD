/**
 * File Skeletons
 *
 * Empty template structures showing section headers with brief explanations.
 * Used in the FilePreviewDialog to give users a preview of what each file contains.
 */

export interface FileSkeleton {
  title: string;
  description: string;
  skeleton: string;
}

export const FILE_SKELETONS: Record<string, FileSkeleton> = {
  'SOUL.md': {
    title: 'SOUL.md',
    description: 'Constitution — immutable rules and truth policy',
    skeleton: `# SOUL.md — Constitution

## Intent
The unchanging principles that define this agent's core behavior.

## Sections

### Agent Mode
> Defines how the agent operates: sidekick, chief-of-staff, or coach.

### Negative Constraints
> Hard limits — things the agent must never do.
> Example: "Never share credentials", "Never execute without approval"

### Truth Policy
> How the agent handles uncertainty in its responses.
> Options: mark uncertainty, calibrated confidence, confident only

### Invariants
> Rules that cannot be overridden by any other file or instruction.

### Interfaces
> Which other files this document connects to and constrains.`,
  },

  'IDENTITY.md': {
    title: 'IDENTITY.md',
    description: 'Who the agent is — name, role, tone of voice',
    skeleton: `# IDENTITY.md — Who This Agent Is

## Intent
Define the agent's public identity, role, and communication style.

## Sections

### Name & Title
> The agent's name and role description.

### Domain Focus
> Primary area of expertise (engineering, product, ops, research, etc.)

### Tone
> Precision: minimalist or explanatory
> Method: socratic or instructional
> Directness: direct or gentle

### Problem Statement
> What problem this agent was created to solve.

### Success Metrics
> How to measure whether the agent is doing its job well.`,
  },

  'USER.md': {
    title: 'USER.md',
    description: 'Operating contract — autonomy, output format, preferences',
    skeleton: `# USER.md — Operating Contract

## Intent
Define how the agent and user work together.

## Sections

### Autonomy
> Action mode: recommend only, execute with approval, or autonomous in sandbox
> Approval threshold: what level of risk requires human sign-off

### Output Contract
> Format: result only, result plus plan, or options with tradeoffs
> Explanations: on request, brief by default, or detailed by default
> Confidence display: off, low/med/high, or calibrated

### Addressing
> How the agent addresses the user (formal, first name, username)
> Language and timezone preferences

### Stop Words
> Words that immediately halt the agent and return control to the user.`,
  },

  'HEARTBEAT.md': {
    title: 'HEARTBEAT.md',
    description: 'Operational rhythm — health checks and discovery loops',
    skeleton: `# HEARTBEAT.md — Pulse

## Intent
Operate the agent efficiently with rotating checks and discovery cadence.

## Sections

### Version & Migration
> Check workspace version compatibility on each tick.

### Context Guard & Checkpointing
> When to write checkpoints based on context utilization.

### Compaction
> When and how to distill daily logs into stable memory.

### Rotating Checks
> Three priority groups, one executed per tick.

### Discovery Rotation
> Surprise/innovation loop based on configured appetite and cadence.

### Task Reconciliation
> Stale task detection, cadence state machine, reconciliation loop.

### Cheap Checks First
> Trigger ladder: metadata → targeted fetch → LLM synthesis.

### Silent Protocol
> When nothing needs attention: output HEARTBEAT_OK.`,
  },

  'SHIELD.md': {
    title: 'SHIELD.md',
    description: 'Safety boundaries — blocks destructive actions',
    skeleton: `# SHIELD.md — Defensive Guardrails

## Intent
Prevent avoidable damage with small, quiet defaults.

## Sections

### Default Blocks
> Deny-by-default rules for destructive operations, credential exposure,
> unapproved exfiltration, and legal/security violations.

### Policy Gates
> Approval-tied policies for irreversible operations, privilege escalation,
> and external communication.

### Prompt Injection Defense
> Input taxonomy, detection heuristics, and containment rules
> for handling injection attempts.

### Minimal Audit
> What to log for each blocked attempt.

### Emergency Stop
> Stop word handling — immediate halt and control return.`,
  },

  'SPIRIT.md': {
    title: 'SPIRIT.md',
    description: 'Single source of truth — resonance anchor',
    skeleton: `# SPIRIT.md — Resonance Anchor

## Intent
The canonical representation of all agent configuration values.
All other files must remain consistent with this source of truth.

## Sections

### Core Identity
> Agent name, title, mode, and domain focus.

### Tone Configuration
> Precision, method, and directness settings.

### Autonomy Settings
> Action mode and approval threshold.

### Surprise Contract
> Appetite, cadence, and boundary definitions.

### Constitution
> Truth policy and negative constraints.

### Output Contract
> Format, explanations, and confidence display settings.

### Addressing
> Form, language, and timezone.`,
  },

  'CORTEX.md': {
    title: 'CORTEX.md',
    description: 'Workspace map — file layout and naming conventions',
    skeleton: `# CORTEX.md — Workspace Map

## Intent
One source of truth for where things live and how often they change.

## Sections

### Core Config Files
> Table of all configuration files with purpose and update frequency.

### Directories
> Recommended workspace directory structure.

### Naming Conventions
> Rules for daily logs, checkpoints, archives, and exports.

### File Dependencies
> Which files depend on which — the dependency tree.

### Update Triggers
> When each file should be updated (immediate, as needed, automated).`,
  },

  'MEMORY.md': {
    title: 'MEMORY.md',
    description: 'Stable facts — learned preferences and decisions',
    skeleton: `# MEMORY.md — Stable Facts

## Intent
Store only durable, high-signal facts and preferences. Not a diary.

## Sections

### Stable Preferences
> Addressing, output format, stop words — things that rarely change.

### Operating Boundaries
> Autonomy settings, surprise boundaries, forbidden zones.

### Flush Protocol
> Compaction triggers, cache TTL, session-to-daily migration rules.

### Decisions & Rationale
> Durable decisions with dates and reasoning.

### Learned Patterns
> Recurring patterns: "When X, prefer Y."`,
  },

  'VERSION.md': {
    title: 'VERSION.md',
    description: 'Version marker — migration and compatibility',
    skeleton: `# VERSION.md — Version Marker

## Intent
Track template pack version for migration and compatibility.

## Sections

### Template Pack Version
> Current version of the Animae Agentis template pack.

### Generated At
> Timestamp of when this configuration was generated.

### Migration Notes
> Instructions for upgrading from previous versions.

### Compatibility
> Which agent frameworks and tools this version supports.`,
  },

  'OPS.md': {
    title: 'OPS.md',
    description: 'Operational playbook — model routing and cost control',
    skeleton: `# OPS.md — Operational Playbook

## Intent
Standardized operational patterns for infrastructure decisions.

## Sections

### Model Routing
> 3-question decision tree, tier territory map, default-to-cheap principle.

### Prompt Injection Defense
> Input taxonomy, detection heuristics, containment rules.

### Tool Policies
> Scope constraints, approval workflows, failure handling.

### Memory Management
> Cache TTL, compaction triggers, flush protocol, embedding model choice.

### Heartbeat Operations
> Rotating check pattern, cadence state machine, cheap-model-first.

### Cost Control
> Concurrency caps, retry budgets, model pinning, daily spend limits.

### Security Hardening
> API key rotation, network lockdown, secret scanning, audit logging.

### Agent Coordination
> Coordinator vs worker separation, fallback chains, spawn patterns.`,
  },
};
