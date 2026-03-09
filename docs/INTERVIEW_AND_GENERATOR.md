# Interview System & Markdown Generator

Technical documentation for the Animae Agentis interview flow and the deterministic file generation pipeline.

---

## Architecture Overview

```
User Flow
=========

LandingPage ──→ PresetsPage ──→ InterviewPage ──→ BuilderPage ──→ ExportPage
     │                              │                   │              │
     └── "Start Fresh" ─────────────┘                   │              │
                                                        │              │
    SpiritData (single source of truth) ◄───────────────┘              │
         │                                                             │
         ▼                                                             │
    generateAnimaeAgentisFiles()                                       │
         │                                                             │
         ▼                                                             │
    GeneratedFile[] (13 files) ────────────────────────────────────────┘
         │
         ▼
    runFullValidation() → TrafficLight (green|yellow|red)
         │
         ├── GREEN/YELLOW → Download allowed
         └── RED → repairFiles() → Download after repair
```

---

## SpiritData — The Single Source of Truth

**File:** `src/lib/animae-agentis/types.ts`

Every generated file derives from one `SpiritData` object. No external state influences the output.

### Key Fields

| Field | Type | Purpose |
|-------|------|---------|
| `agentMode` | `'sidekick' \| 'chief-of-staff' \| 'coach'` | Determines defaults, suggestions, and template behavior |
| `agentName` | `string` | Agent display name |
| `agentTitle` | `string` | Professional title/role description |
| `tone` | `{ precision, method, directness }` | Each is a binary enum (e.g., `'precise' \| 'casual'`) |
| `autonomy` | `{ actionMode, approval }` | How independently the agent operates |
| `surprise` | `{ appetite, cadence }` | Whether agent proactively offers ideas |
| `truthPolicy` | `TruthPolicy` | Honesty configuration |
| `negativeConstraints` | `string[]` | Explicit "never do this" rules |
| `output` | `OutputConfig` | Format preferences (length, markdown, codeblocks) |
| `addressing` | `AddressingConfig` | How agent addresses the user |
| `stopWords` | `string[]` | Words/phrases agent must avoid |
| `domain` | `string` | Focus area (e.g., 'code', 'writing', 'mixed') |
| `tools` | `string[]` | Available tool names |
| `rotatingGroups` | `RotatingGroup[]` | HEARTBEAT check groups (A/B/C) |
| `language` | `'en' \| 'de'` | Output language for all templates |

### Mode Defaults

**File:** `src/lib/animae-agentis/spirit.ts`

`mergeWithDefaults(partial, mode)` fills missing fields based on the selected mode:

- **Sidekick** — Discovery-oriented. Low autonomy, research tools, explorer names.
- **Chief-of-staff** — Execution-oriented. Higher autonomy, operational tools, strategic names.
- **Coach** — Accountability-oriented. Reflective tone, growth tools, mentor names.

---

## Interview State Machine

**File:** `src/lib/animae-agentis/interview/stateMachine.ts`
**UI:** `src/pages/AnimaeAgentisInterviewPage.tsx`

### 6 Phases

```
handshake → discovery → vibecoding → constitution → pulse → generation
   (mode)    (role)      (tone)      (constraints)  (autonomy)  (review)
```

| # | Phase | What It Collects | UI Component |
|---|-------|-----------------|--------------|
| 1 | **Handshake** | `agentMode` (sidekick / chief-of-staff / coach) | 3 ChoiceButtons with descriptions |
| 2 | **Discovery** | VibeCoding role selection (3 roles per mode) | ChoiceButtons from `getRolesForMode()` |
| 3 | **VibeCoding** | `tone.precision`, `tone.method`, `tone.directness` | 3 TogglePair components |
| 4 | **Constitution** | `negativeConstraints[]` | Textarea input |
| 5 | **Pulse** | `autonomy.actionMode`, `surprise.appetite`, `surprise.cadence` | ChoiceButtons + TogglePair |
| 6 | **Generation** | Review all selections, confirm | Summary manifest display |

### Risk Detection

At step 5 (Pulse), the system checks for high-risk configurations:

```typescript
const isHighRisk =
  spirit.autonomy?.actionMode === 'autonomous_in_sandbox' ||
  spirit.surprise?.appetite === 'high';
```

If high-risk: a `RiskModal` appears requiring explicit confirmation before proceeding.

### Completion Flow

On final confirmation:
1. `mergeWithDefaults(spirit, mode)` fills remaining fields
2. `generateAnimaeAgentisFiles(finalSpirit)` produces 13 files
3. `onComplete(finalSpirit, files)` navigates to ExportPage

---

## Generator Pipeline

**File:** `src/lib/animae-agentis/generator.ts`

### Entry Point

```typescript
function generateAnimaeAgentisFiles(
  spirit: SpiritData,
  options?: { includeAdvancedPack?: boolean }
): GeneratorOutput
```

Returns `{ files: GeneratedFile[], spirit: SpiritData }`.

### GeneratedFile

```typescript
interface GeneratedFile {
  filename: string;   // e.g. "SOUL.md"
  content: string;    // Full markdown content
  pack: 'base' | 'advanced';
}
```

### 13 Output Files

**Base Pack (5 files)** — Essential agent configuration:

| File | Template | Purpose |
|------|----------|---------|
| `SOUL.md` | `soul.template.ts` | Constitution: immutable rules, truth policy, negative constraints, invariants |
| `IDENTITY.md` | `identity.template.ts` | Who the agent is: name, title, mode, domain, tone, success metrics |
| `USER.md` | `user.template.ts` | Operating contract: autonomy level, output format, addressing, stop words |
| `HEARTBEAT.md` | `heartbeat.template.ts` | Operations: health checks, rotating groups, discovery cadence, compaction rules |
| `SHIELD.md` | `shield.template.ts` | Safety: default blocks, policy gates, prompt injection defense, emergency stop |

**Advanced Pack (8 files)** — Extended configuration:

| File | Template | Purpose |
|------|----------|---------|
| `SPIRIT.md` | `spirit.template.ts` | Resonance anchor: all canonical values in one place (single source of truth) |
| `CORTEX.md` | `cortex.template.ts` | Workspace map: file layout, naming conventions, dependencies |
| `MEMORY.md` | `memory.template.ts` | Stable facts: preferences, operating boundaries, learned patterns |
| `VERSION.md` | `version.template.ts` | Template pack version, migration notes, compatibility |
| `OPS.md` | `ops.template.ts` | Playbook: model routing, cost control, security hardening |
| `AGENTS.md` | `agents.template.ts` | Session lifecycle: boot sequence, guardrails, mode behavior |
| `TOOLS.md` | `tools.template.ts` | Tool policies by category, approval workflows |
| `SKILL.md` | `skill.template.ts` | Executable kernel: YAML frontmatter + procedures |

### Template Rendering

Each template file exports a render function:

```typescript
function renderSoulTemplate(spirit: SpiritData): string
```

Templates are:
- **Bilingual** — Support `'en'` and `'de'` via `spirit.language`
- **Preset-aware** — Different content for SECURITY/RESPONSIBLE/OVERCLAW presets
- **Deterministic** — Same SpiritData always produces identical output

---

## Presets

**File:** `src/lib/presets.ts`

Three built-in presets, each providing `Partial<SpiritData>`:

| Preset | Mode | Character |
|--------|------|-----------|
| **Security** | sidekick | Conservative, high-caution, defensive defaults |
| **Responsible** | chief-of-staff | Balanced autonomy, structured workflows |
| **OverClaw** | coach | High autonomy, aggressive, minimal constraints |

Presets merge into SpiritData before the interview, pre-filling values the user can still override.

---

## Validation System (v2.2)

**Files:** `src/lib/animae-agentis/validation/`

### Pipeline

```
GeneratedFile[] + SpiritData (canon)
        │
        ▼
  runAllRules()  →  findings[], promises[], strengths[]
        │
        ▼
  computeCategoryScores()  →  6 categories with 0-100 scores
        │
        ▼
  computeOverallScore()  →  0-100 aggregate
        │
        ▼
  computeTrafficLight()  →  green | yellow | red
        │
        ▼
  ValidatorReport
```

### 6 Validation Categories

| Category | ID | What It Checks |
|----------|-----|---------------|
| Bootstrap | `bootstrap` | File presence, canon consistency, size limits |
| Policy | `policy` | Truth policy drift, stop word consistency |
| Heartbeat | `heartbeat` | Health check completeness, rotation coverage |
| Security | `security` | Shield gates, prompt injection defense |
| Purpose | `purpose` | Identity completeness, domain specificity |
| Skill | `skill` | Skill kernel integrity, preset conflicts |

### Traffic Light

- **GREEN** — Score >= threshold, no errors, max N warnings
- **YELLOW** — Warnings present but no blocking errors
- **RED** — Errors found, download blocked until `repairFiles()` is run

### Repair & Improve

```typescript
repairFiles(files, canon): GeneratedFile[]  // Fix RED-level issues
improveFiles(files, canon): Suggestion[]     // Non-critical enhancements
```

---

## FinalTouch System

**File:** `src/lib/animae-agentis/finalTouch.ts`

Pre-download completeness analysis. Runs `analyzeCompleteness(spirit)` to detect fields left at default values.

### Checks

1. **Agent Name** — Detects auto-generated or placeholder names
2. **Agent Title** — Identifies missing/default titles
3. **Domain Focus** — Flags generic "mixed" domain
4. **Tools** — Suggests mode-appropriate tools
5. **Rotating Groups** — Detects default groups, offers mode-specific alternatives

Returns `IncompleteField[]` with suggestions the user can accept or dismiss in the FinalTouchPanel UI.

---

## Suggestions Library

**File:** `src/lib/animae-agentis/suggestions.ts`

Provides mode-specific recommendations used throughout interview and builder:

- **Tool suggestions** — 6 categories (File & Code, Web & API, Calendar, Communication, Database, Git), 5 tools per mode
- **Name suggestions** — 4 names per mode (e.g., Sidekick: Scout, Atlas, Spark, Beacon)
- **Title suggestions** — Professional titles per mode
- **Rotating group suggestions** — A/B/C check groups per mode

---

## Skeletons

**File:** `src/lib/animae-agentis/skeletons.ts`

Preview templates showing the section structure of each file. Used in the HowItWorks page and file previews. Each skeleton includes:

```typescript
interface FileSkeleton {
  title: string;       // "SOUL.md"
  description: string; // "Constitution & immutable rules"
  skeleton: string;    // Markdown preview of section headers
}
```

---

## Export Page

**File:** `src/pages/AnimaeAgentisExportPage.tsx`

### Features

- **File preview** — Toggle between rendered markdown and raw text per file
- **Validation panel** — Displays traffic light, category scores, findings
- **FinalTouch panel** — Completeness suggestions with accept/dismiss
- **Per-file download** — Individual `.md` file downloads
- **Download all** — Sequential downloads with 200ms stagger, tracks downloaded files
- **Copy to clipboard** — Per-file content copy
- **High-risk confirmation** — Modal before bulk download if agent config is high-risk

### Regeneration Loop

When the user accepts a FinalTouch suggestion:
1. `currentSpirit` is updated
2. `generateAnimaeAgentisFiles()` re-runs
3. `runFullValidation()` re-runs
4. UI refreshes with new files and validation state

---

## File Map

```
src/lib/animae-agentis/
├── types.ts                    # SpiritData, GeneratedFile, all enums
├── spirit.ts                   # createEmptySpirit, mergeWithDefaults, isSpiritComplete
├── generator.ts                # generateAnimaeAgentisFiles (main entry)
├── suggestions.ts              # Mode-specific tool/name/title suggestions
├── finalTouch.ts               # analyzeCompleteness pre-download check
├── skeletons.ts                # File structure previews
├── interview/
│   └── stateMachine.ts         # 6-phase state machine, getRolesForMode
├── templates/
│   ├── soul.template.ts        # SOUL.md renderer
│   ├── identity.template.ts    # IDENTITY.md renderer
│   ├── user.template.ts        # USER.md renderer
│   ├── heartbeat.template.ts   # HEARTBEAT.md renderer
│   ├── shield.template.ts      # SHIELD.md renderer
│   ├── spirit.template.ts      # SPIRIT.md renderer
│   ├── cortex.template.ts      # CORTEX.md renderer
│   ├── memory.template.ts      # MEMORY.md renderer
│   ├── version.template.ts     # VERSION.md renderer
│   ├── ops.template.ts         # OPS.md renderer
│   ├── agents.template.ts      # AGENTS.md renderer
│   ├── tools.template.ts       # TOOLS.md renderer
│   └── skill.template.ts       # SKILL.md renderer
├── validation/
│   ├── index.ts                # Public API exports
│   ├── types.ts                # ValidatorReport, TrafficLight, etc.
│   ├── validator.ts            # runFullValidation, validateAnimaeAgentis
│   ├── rules.ts                # All validation rules (OC001, SZ001, etc.)
│   ├── scoring.ts              # computeCategoryScores, computeOverallScore
│   ├── repair.ts               # repairFiles for RED traffic light
│   ├── improve.ts              # improveFiles for enhancement suggestions
│   ├── extractor.ts            # extractPolicies from file content
│   ├── qualityGates.ts         # Legacy v1 validation
│   └── resonanceGates.ts       # Cross-file consistency, resonance score
└── __tests__/
    ├── generator.test.ts       # Generator output tests
    └── validator.test.ts       # Validation pipeline tests

src/pages/
├── AnimaeAgentisInterviewPage.tsx   # 6-step interview UI
├── AnimaeAgentisExportPage.tsx      # File preview, validation, download
└── BuilderPage.tsx                  # Fine-tune SpiritData fields

src/lib/presets.ts                   # 3 built-in presets (Security, Responsible, OverClaw)
```
