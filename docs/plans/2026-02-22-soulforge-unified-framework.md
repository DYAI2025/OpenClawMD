# SoulForge Unified Framework Implementation Plan

> **For Claude:** Use `${SUPERPOWERS_SKILLS_ROOT}/skills/collaboration/executing-plans/SKILL.md` to implement this plan task-by-task.

**Goal:** Merge OpenClaw legacy and SoulForge 1.2 into a single unified framework where SoulForge is the primary path, presets seed the interview, and the builder serves as a post-interview fine-tuning tool.

**Architecture:** Single data model (`SpiritData`, renamed from `CanonData`). Landing page offers two entry points: "Start from Scratch" (empty SpiritData) and "Use Preset" (pre-filled SpiritData). Both flow through the SoulForge interview, optional builder fine-tuning, and SoulForge export. Legacy OpenClaw pipeline (schema, generator, old interview/export pages) is removed entirely.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 3, Zod 4, shadcn/ui (New York), JSZip

---

## Task 1: Rename CanonData to SpiritData

**Files:**
- Modify: `src/lib/soulforge/types.ts` (all `CanonData` references)
- Modify: `src/lib/soulforge/canon.ts` → rename to `src/lib/soulforge/spirit.ts`
- Modify: `src/lib/soulforge/index.ts` (re-exports)
- Modify: `src/lib/soulforge/generator.ts`
- Modify: `src/lib/soulforge/templates/*.template.ts` (all 9 template files)
- Modify: `src/lib/soulforge/validation/qualityGates.ts`
- Modify: `src/lib/soulforge/validation/resonanceGates.ts`
- Modify: `src/lib/soulforge/validation/validator.ts`
- Modify: `src/lib/soulforge/export/json.ts`
- Modify: `src/lib/soulforge/export/zip.ts`
- Modify: `src/lib/soulforge/interview/stateMachine.ts`
- Modify: `src/lib/soulforge/interview/questions.ts`
- Modify: `src/lib/safety/validation.ts`
- Modify: `src/pages/SoulForgeInterviewPage.tsx`
- Modify: `src/pages/SoulForgeExportPage.tsx`
- Modify: `src/App.tsx`

This is a mechanical find-and-replace task. It must be done first because all subsequent tasks depend on the new naming.

**Step 1: Rename the file `canon.ts` → `spirit.ts`**

```bash
mv src/lib/soulforge/canon.ts src/lib/soulforge/spirit.ts
```

**Step 2: Find-and-replace in `src/lib/soulforge/types.ts`**

Replace all occurrences:
- `CanonData` → `SpiritData`
- `CanonTone` → `SpiritTone`
- `CanonAutonomy` → `SpiritAutonomy`
- `CanonSurprise` → `SpiritSurprise`
- `CanonOutput` → `SpiritOutput`
- `CanonAddressing` → `SpiritAddressing`

Keep interfaces otherwise identical.

**Step 3: Update `src/lib/soulforge/spirit.ts` (formerly canon.ts)**

- All `CanonData` → `SpiritData`, `CanonTone` → `SpiritTone` etc.
- `createEmptyCanon()` → `createEmptySpirit()`
- `isCanonComplete()` → `isSpiritComplete()`
- `mergeWithDefaults()` stays the same name
- `dimensionsToCanon()` → `dimensionsToSpirit()`
- Update all import paths from `./types`
- Constants stay: `SIDEKICK_DEFAULTS`, `CHIEF_OF_STAFF_DEFAULTS`, `COACH_DEFAULTS`

**Step 4: Update `src/lib/soulforge/index.ts`**

- Change all re-exports to use new type names
- Change import source from `'./canon'` to `'./spirit'`
- Export `createEmptySpirit` instead of `createEmptyCanon`
- Export `isSpiritComplete` instead of `isCanonComplete`
- Export `dimensionsToSpirit` instead of `dimensionsToCanon`
- Keep legacy re-exports as aliases if needed for this step (remove in Task 6)

**Step 5: Update all template files**

For each file in `src/lib/soulforge/templates/`:
- `soul.template.ts`, `identity.template.ts`, `user.template.ts`, `heartbeat.template.ts`, `shield.template.ts`, `canon.template.ts`, `index.template.ts`, `memory.template.ts`, `version.template.ts`
- Replace `CanonData` → `SpiritData` in imports and function signatures

**Step 6: Update generator, validation, export, interview files**

- `src/lib/soulforge/generator.ts`: `CanonData` → `SpiritData` in imports and types
- `src/lib/soulforge/validation/*.ts`: same rename
- `src/lib/soulforge/export/*.ts`: same rename
- `src/lib/soulforge/interview/*.ts`: same rename
- `src/lib/safety/validation.ts`: `CanonData` → `SpiritData` in import and function signatures

**Step 7: Update page components**

- `src/pages/SoulForgeInterviewPage.tsx`: `CanonData` → `SpiritData`, import from `spirit` instead of `canon`
- `src/pages/SoulForgeExportPage.tsx`: `CanonData` → `SpiritData`
- `src/App.tsx`: `CanonData` → `SpiritData` in type annotation on line 44

**Step 8: Verify build**

```bash
npm run build
```

Expected: Successful build with zero type errors.

**Step 9: Commit**

```bash
git add -A
git commit -m "refactor: rename CanonData to SpiritData throughout codebase"
```

---

## Task 2: Create Unified Preset Definitions

**Files:**
- Create: `src/lib/presets.ts`
- Modify: `src/lib/soulforge/spirit.ts` (may need to export more defaults)

The new presets file replaces `src/lib/openclaw/presets.ts`. Each preset defines `Partial<SpiritData>` directly instead of the old 8-dimension format.

**Step 1: Create `src/lib/presets.ts`**

```typescript
import type { SpiritData } from './soulforge/types';

export interface PresetDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  color: 'peach' | 'mint' | 'coral' | 'sage';
  spirit: Partial<SpiritData>;
  metadata: {
    riskProfile: 'low' | 'medium' | 'high';
    autonomyLevel: 'minimal' | 'moderate' | 'maximum';
    useCases: string[];
  };
}

const SECURITY_PRESET: PresetDefinition = {
  id: 'security',
  name: 'SECURITY',
  tagline: 'Maximum safety. Minimal risk. Human in control.',
  description: 'The SECURITY preset prioritizes safety above all else. Every action requires explicit approval, and the system operates with minimal autonomy. Ideal for sensitive environments where human oversight is paramount.',
  color: 'peach',
  spirit: {
    agentMode: 'sidekick',
    tone: { precision: 'explanatory', method: 'instructional', directness: 'gentle' },
    autonomy: {
      actionMode: 'recommend_only',
      approvalThreshold: 'ALL actions require explicit approval.',
    },
    surprise: { appetite: 'low', cadence: 'trigger', boundaries: 'No surprises; proposals only, no irreversible actions.' },
    truthPolicy: 'mark_uncertainty',
    output: { format: 'options_tradeoffs', explanations: 'detailed_by_default', confidenceDisplay: 'calibrated' },
  },
  metadata: {
    riskProfile: 'low',
    autonomyLevel: 'minimal',
    useCases: [
      'Production systems with sensitive data',
      'Regulated industries (finance, healthcare)',
      'High-stakes decision environments',
      'New team members or untrusted contexts',
    ],
  },
};

const RESPONSIBLE_PRESET: PresetDefinition = {
  id: 'responsible',
  name: 'Responsible',
  tagline: 'Careful growth. Iterative evolution. Shared reflection.',
  description: 'The Responsible preset strikes a balance between autonomy and oversight. The system can propose initiatives and handle moderate uncertainty, but key decisions still involve human collaboration.',
  color: 'mint',
  spirit: {
    agentMode: 'sidekick',
    tone: { precision: 'minimalist', method: 'socratic', directness: 'direct' },
    autonomy: {
      actionMode: 'execute_with_approval',
      approvalThreshold: 'Significant actions require approval.',
    },
    surprise: { appetite: 'medium', cadence: 'weekly_deep', boundaries: 'No personal data, no outreach, no destructive actions.' },
    truthPolicy: 'calibrated_confidence',
    output: { format: 'result_plus_plan', explanations: 'brief_by_default', confidenceDisplay: 'low_med_high' },
  },
  metadata: {
    riskProfile: 'medium',
    autonomyLevel: 'moderate',
    useCases: [
      'General development workflows',
      'Research and exploration projects',
      'Team collaboration environments',
      'Iterative improvement processes',
    ],
  },
};

const OVERCLAW_PRESET: PresetDefinition = {
  id: 'overclaw',
  name: 'OverClaw',
  tagline: 'Speed. Strategy. Emergence.',
  description: 'The OverClaw preset unleashes maximum autonomy. The system can act strategically, handle high uncertainty, and execute with minimal human intervention. Use with caution and clear monitoring.',
  color: 'coral',
  spirit: {
    agentMode: 'chief-of-staff',
    tone: { precision: 'minimalist', method: 'instructional', directness: 'direct' },
    autonomy: {
      actionMode: 'autonomous_in_sandbox',
      approvalThreshold: 'Any external communication, upload, deletion, or privilege change requires approval.',
    },
    surprise: { appetite: 'high', cadence: 'daily_micro', boundaries: 'Surprise must be operationally relevant; no outreach; propose smallest next step.' },
    truthPolicy: 'calibrated_confidence',
    output: { format: 'result_plus_plan', explanations: 'on_request_only', confidenceDisplay: 'calibrated' },
  },
  metadata: {
    riskProfile: 'high',
    autonomyLevel: 'maximum',
    useCases: [
      'Rapid prototyping and experimentation',
      'Well-monitored sandbox environments',
      'Trusted autonomous agents',
      'High-velocity startup contexts',
    ],
  },
};

export const PRESETS: PresetDefinition[] = [SECURITY_PRESET, RESPONSIBLE_PRESET, OVERCLAW_PRESET];

export function getPresetById(id: string): PresetDefinition | undefined {
  return PRESETS.find(p => p.id === id);
}

export function getAllPresets(): PresetDefinition[] {
  return PRESETS;
}

export function getRiskProfileColor(profile: 'low' | 'medium' | 'high'): string {
  switch (profile) {
    case 'low': return 'bg-clay-peach text-clay-charcoal';
    case 'medium': return 'bg-clay-mint text-clay-charcoal';
    case 'high': return 'bg-clay-coral text-white';
    default: return 'bg-clay-stone text-clay-charcoal';
  }
}

export function getAutonomyLevelColor(level: 'minimal' | 'moderate' | 'maximum'): string {
  switch (level) {
    case 'minimal': return 'bg-clay-sand text-clay-charcoal';
    case 'moderate': return 'bg-clay-sage text-clay-charcoal';
    case 'maximum': return 'bg-clay-coral text-white';
    default: return 'bg-clay-stone text-clay-charcoal';
  }
}
```

**Step 2: Verify build**

```bash
npm run build
```

Expected: Successful (new file, no consumers yet).

**Step 3: Commit**

```bash
git add src/lib/presets.ts
git commit -m "feat: add unified preset definitions with Partial<SpiritData>"
```

---

## Task 3: Rebuild PresetsPage for SpiritData

**Files:**
- Modify: `src/pages/PresetsPage.tsx`

The PresetsPage now uses the new `src/lib/presets.ts` instead of `src/lib/openclaw/presets.ts`. Instead of calling `onSelectPreset(presetId)` which created an `OpenClawConfigType`, it now calls `onSelectPreset(presetId)` and the parent (App.tsx) will use the preset's `spirit` field to seed the interview.

**Step 1: Update PresetsPage imports and props**

Replace the imports at the top of `src/pages/PresetsPage.tsx`:

```typescript
import { ArrowLeft, Shield, Zap, Globe, ChevronRight } from 'lucide-react';
import { ClayButton, ClayCard, ClayCardContent, ClayCardFooter } from '@/components/clay';
import { getAllPresets, getRiskProfileColor, getAutonomyLevelColor } from '@/lib/presets';

interface PresetsPageProps {
  onSelectPreset: (presetId: string) => void;
  onBack: () => void;
}
```

Remove the `onCustomize` prop (customization now happens via builder after interview).

**Step 2: Update the component body**

- Remove the `Customize` button from each card's footer
- Change `onSelectPreset(preset.id)` to pass the string preset ID
- Remove import of `PresetIdType` from openclaw/schema
- Update the preset icon map to use the new preset IDs (`'responsible'` instead of `'open'`, `'overclaw'` instead of `'crazy'`)

The "Use Preset" button text should change to "Start with {preset.name}" to communicate that it seeds the interview.

**Step 3: Verify build**

```bash
npm run build
```

Expected: Build may fail because App.tsx still references old types. That's OK — we fix App.tsx in Task 5.

**Step 4: Commit**

```bash
git add src/pages/PresetsPage.tsx
git commit -m "refactor: PresetsPage uses unified presets with SpiritData"
```

---

## Task 4: Add Interview Seeding to SoulForgeInterviewPage

**Files:**
- Modify: `src/pages/SoulForgeInterviewPage.tsx`

The interview page now accepts an optional `initialSpirit: Partial<SpiritData>` prop. When provided (from a preset), each step shows pre-selected values that the user can confirm or change.

**Step 1: Update props interface**

```typescript
interface SoulForgeInterviewPageProps {
  initialSpirit?: Partial<SpiritData>;
  onComplete: (files: GeneratedFile[], spirit: SpiritData) => void;
  onBack: () => void;
}
```

**Step 2: Initialize state from `initialSpirit`**

Change the `useState` for `canon` (now `spirit`):

```typescript
const [spirit, setSpirit] = useState<Partial<SpiritData>>(() => {
  if (initialSpirit) {
    return mergeWithDefaults(initialSpirit, initialSpirit.agentMode || 'sidekick');
  }
  return {};
});
```

If `initialSpirit` has an `agentMode`, auto-advance to the 'role' step:

```typescript
const [step, setStep] = useState<InterviewStep>(() => {
  if (initialSpirit?.agentMode) return 'role';
  return 'mode';
});
```

**Step 3: Rename all `canon` references to `spirit`**

Throughout the component:
- `canon` → `spirit`
- `setCanon` → `setSpirit`
- `updateCanon` → `updateSpirit`
- `CanonData` → `SpiritData` (already done in Task 1)

**Step 4: Update the `handleNext` completion handler**

```typescript
if (step === 'review') {
  const finalSpirit = spirit as SpiritData;
  import('@/lib/soulforge/generator').then(({ generateSoulForgeFiles }) => {
    const output = generateSoulForgeFiles(finalSpirit, {
      includeAdvancedPack: true,
      language: 'en',
    });
    onComplete(output.files, finalSpirit);
  });
  return;
}
```

**Step 5: Add "Preset Seed" indicator**

When `initialSpirit` is provided, show a small badge at the top:

```tsx
{initialSpirit && (
  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-clay-mint/30 text-xs text-clay-charcoal/70">
    <Sparkles className="w-3 h-3" />
    Pre-filled from preset — adjust as needed
  </div>
)}
```

**Step 6: Verify build**

```bash
npm run build
```

**Step 7: Commit**

```bash
git add src/pages/SoulForgeInterviewPage.tsx
git commit -m "feat: interview page accepts initialSpirit for preset seeding"
```

---

## Task 5: Rebuild App.tsx for Unified Flow

**Files:**
- Modify: `src/App.tsx`

This is the central wiring task. The App component changes from managing two parallel flows to a single unified flow.

**Step 1: Update imports**

Remove:
```typescript
import { InterviewPage } from './pages/InterviewPage';
import { ExportPage } from './pages/ExportPage';
import type { OpenClawConfigType, PresetIdType } from './lib/openclaw/schema';
import { createEmptyConfig } from './lib/openclaw/schema';
import { createConfigFromPreset } from './lib/openclaw/presets';
import { ConfigModeOverlay } from './components/ConfigModeOverlay';
```

Add/update:
```typescript
import { getPresetById } from './lib/presets';
import type { GeneratedFile, SpiritData } from './lib/soulforge/types';
```

Rename SoulForge page imports:
```typescript
import { SoulForgeInterviewPage } from './pages/SoulForgeInterviewPage';
import { SoulForgeExportPage } from './pages/SoulForgeExportPage';
```

**Step 2: Simplify AppView type**

```typescript
export type AppView = 'landing' | 'presets' | 'interview' | 'builder' | 'export' | 'blog' | 'legal-impressum' | 'legal-privacy' | 'legal-tos';
```

Remove: `'soulforge-interview'`, `'soulforge-export'`

**Step 3: Simplify HistoryEntry**

```typescript
export interface HistoryEntry {
  view: AppView;
  presetId?: string;
  spirit?: Partial<SpiritData>;
}
```

Remove `config: OpenClawConfigType | null`.

**Step 4: Replace state variables**

Remove:
```typescript
const [soulForgeData, setSoulForgeData] = useState<{ files: GeneratedFile[]; canon: CanonData } | null>(null);
```

Add:
```typescript
const [spiritData, setSpiritData] = useState<{ files: GeneratedFile[]; spirit: SpiritData } | null>(null);
```

**Step 5: Remove Easter egg / ConfigModeOverlay**

Remove:
- `configModeOpen` state
- `tapCount` / `lastTapTime` state
- `handleLogoTap` callback
- `ConfigModeOverlay` component in JSX
- The `?forge=true` URL parameter check in `useEffect`

**Step 6: Rewrite navigation handlers**

```typescript
const selectPreset = useCallback((presetId: string) => {
  const preset = getPresetById(presetId);
  if (!preset) return;
  pushView('interview', { presetId, spirit: preset.spirit });
}, [pushView]);

const startFresh = useCallback(() => {
  pushView('interview');
}, [pushView]);
```

Update `pushView` to accept the new `HistoryEntry` shape:
```typescript
const pushView = useCallback((view: AppView, extra?: Partial<HistoryEntry>) => {
  setHistory(prev => [...prev, { view, ...extra }]);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, []);
```

**Step 7: Rewrite renderView**

```typescript
const renderView = () => {
  switch (currentEntry.view) {
    case 'landing':
      return (
        <LandingPage
          onSelectPreset={() => navigateTo('presets')}
          onStartFresh={startFresh}
          onOpenBlog={() => pushView('blog')}
        />
      );

    case 'presets':
      return (
        <PresetsPage
          onSelectPreset={selectPreset}
          onBack={goBack}
        />
      );

    case 'interview':
      return (
        <SoulForgeInterviewPage
          initialSpirit={currentEntry.spirit}
          onComplete={(files, spirit) => {
            setSpiritData({ files, spirit });
            pushView('export');
          }}
          onBack={goBack}
        />
      );

    case 'builder':
      return spiritData ? (
        <BuilderPage
          initialSpirit={spiritData.spirit}
          onComplete={(spirit) => {
            // Regenerate files from updated spirit
            import('./lib/soulforge/generator').then(({ generateSoulForgeFiles }) => {
              const output = generateSoulForgeFiles(spirit, { includeAdvancedPack: true, language: 'en' });
              setSpiritData({ files: output.files, spirit });
              pushView('export');
            });
          }}
          onBack={goBack}
        />
      ) : null;

    case 'export':
      return spiritData ? (
        <SoulForgeExportPage
          spirit={spiritData.spirit}
          onBack={goBack}
          onNewConfig={resetToLanding}
          onFineTune={() => pushView('builder')}
        />
      ) : null;

    case 'blog':
      return <BlogPage onBack={goBack} />;

    case 'legal-impressum':
      return <LegalPage title="Impressum" content={IMPRESSUM_DE} onBack={goBack} />;
    case 'legal-privacy':
      return <LegalPage title="Datenschutzerklärung" content={PRIVACY_POLICY_DE} onBack={goBack} />;
    case 'legal-tos':
      return <LegalPage title="Terms & Conditions" content={TOS_DE} onBack={goBack} />;

    default:
      return null;
  }
};
```

**Step 8: Update LandingPage props**

The LandingPage needs updated props (handled in Task 7).

**Step 9: Remove ConfigModeOverlay from JSX**

Delete the `<ConfigModeOverlay>` block from the return statement.

**Step 10: Verify build**

```bash
npm run build
```

Expected: May have errors from LandingPage/BuilderPage props not matching yet. Those are fixed in Tasks 6 and 7.

**Step 11: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: App.tsx unified flow with single SpiritData pipeline"
```

---

## Task 6: Rebuild BuilderPage for SpiritData

**Files:**
- Modify: `src/pages/BuilderPage.tsx`

The builder now works with `SpiritData` fields instead of 8 abstract dimensions. It shows controls for agentMode, tone settings, autonomy, surprise appetite, output format, etc.

**Step 1: Update imports and props**

```typescript
import { useState, useMemo } from 'react';
import { ArrowLeft, RotateCcw, Check } from 'lucide-react';
import { ClayButton, ClayCard, ClaySlider, ClayErrorBanner } from '@/components/clay';
import type { SpiritData, AgentMode, ActionMode, SurpriseAppetite, TonePrecision, ToneMethod, ToneDirectness, OutputFormat, TruthPolicy } from '@/lib/soulforge/types';
import { isSpiritComplete } from '@/lib/soulforge/spirit';

interface BuilderPageProps {
  initialSpirit: SpiritData;
  onComplete: (spirit: SpiritData) => void;
  onBack: () => void;
}
```

**Step 2: Replace dimension sliders with SpiritData controls**

Instead of 8 generic sliders, create grouped sections:

1. **Identity** — AgentMode selector (3 radio buttons: sidekick/chief-of-staff/coach)
2. **Tone** — Precision (minimalist/explanatory), Method (socratic/instructional), Directness (direct/gentle) — each as a toggle pair
3. **Autonomy** — ActionMode (3 options), ApprovalThreshold (text input)
4. **Surprise** — Appetite slider (low/medium/high), Cadence selector, Boundaries text
5. **Output** — Format selector, Explanations policy, Confidence display
6. **Truth Policy** — 3 radio options
7. **Stop Words** — Editable list

Use `ChoiceButton` pattern from SoulForgeInterviewPage for selectors. Use `ClaySlider` for appetite (mapped to low=1, medium=2, high=3).

**Step 3: State management**

```typescript
const [spirit, setSpirit] = useState<SpiritData>(initialSpirit);

const updateSpirit = (updates: Partial<SpiritData>) => {
  setSpirit(prev => ({
    ...prev,
    ...updates,
    tone: updates.tone ? { ...prev.tone, ...updates.tone } : prev.tone,
    autonomy: updates.autonomy ? { ...prev.autonomy, ...updates.autonomy } : prev.autonomy,
    surprise: updates.surprise ? { ...prev.surprise, ...updates.surprise } : prev.surprise,
    output: updates.output ? { ...prev.output, ...updates.output } : prev.output,
  }));
};
```

**Step 4: Update header**

```tsx
<h1 className="text-2xl font-bold text-clay-charcoal">Fine-Tune Configuration</h1>
<p className="text-sm text-clay-charcoal/60">Adjust your SpiritData parameters</p>
```

**Step 5: Completion handler**

```typescript
const handleComplete = () => {
  if (!isSpiritComplete(spirit)) {
    setError('Please fill all required fields');
    return;
  }
  onComplete(spirit);
};
```

**Step 6: Verify build**

```bash
npm run build
```

**Step 7: Commit**

```bash
git add src/pages/BuilderPage.tsx
git commit -m "refactor: BuilderPage uses SpiritData controls instead of 8 dimensions"
```

---

## Task 7: Update LandingPage for Unified Flow

**Files:**
- Modify: `src/pages/LandingPage.tsx`

**Step 1: Update props interface**

```typescript
interface LandingPageProps {
  onSelectPreset: () => void;
  onStartFresh: () => void;
  onOpenBlog: () => void;
}
```

Remove: `onStartInterview`, `onOpenBuilder`, `onLogoTap`, `onImportConfig`

**Step 2: Simplify header**

Remove the Import Config button and the "Preset System v1.0" label. Remove the logo tap handler. Remove the `fileInputRef` and `handleFileChange` logic. Remove `OpenClawConfig` import from openclaw/schema.

**Step 3: Update entry point cards**

Replace the 4-card grid with 3 cards:

1. **"Start Fresh"** — Starts SoulForge interview with empty SpiritData. Primary CTA.
2. **"Use a Preset"** — Goes to PresetsPage, seeds the interview. Secondary CTA.
3. **"Intelligence Lab"** — Blog. Tertiary.

Remove the "Classic Interview" and "Custom Builder" cards.

**Step 4: Update "What You Get" section**

Change from "Five markdown files" to "Nine markdown files that define your agent's behavioral fabric" and list all 9 files (SOUL.md, IDENTITY.md, USER.md, HEARTBEAT.md, SHIELD.md, CANON.md, INDEX.md, MEMORY.md, VERSION.md).

**Step 5: Verify build**

```bash
npm run build
```

**Step 6: Commit**

```bash
git add src/pages/LandingPage.tsx
git commit -m "refactor: LandingPage simplified for unified SoulForge flow"
```

---

## Task 8: Add "Fine-Tune" Button to Export Page

**Files:**
- Modify: `src/pages/SoulForgeExportPage.tsx`

**Step 1: Update props**

```typescript
interface SoulForgeExportPageProps {
  spirit: SpiritData;
  onBack: () => void;
  onNewConfig: () => void;
  onFineTune: () => void;
}
```

**Step 2: Rename internal `canon` references to `spirit`**

All references to `canon` prop → `spirit`.

**Step 3: Add Fine-Tune button**

In the actions area (around line 384), add a button before "Create New Configuration":

```tsx
<div className="mt-8 flex justify-center gap-4">
  <ClayButton variant="pill" color="sage" onClick={onFineTune}>
    <Sliders className="w-5 h-5" />
    Fine-Tune
  </ClayButton>
  <ClayButton variant="blob" color="sage" onClick={onNewConfig}>
    <Sparkles className="w-5 h-5" />
    Create New Configuration
  </ClayButton>
</div>
```

**Step 4: Verify build**

```bash
npm run build
```

**Step 5: Commit**

```bash
git add src/pages/SoulForgeExportPage.tsx
git commit -m "feat: export page adds Fine-Tune button for post-interview adjustment"
```

---

## Task 9: Delete Legacy Code

**Files:**
- Delete: `src/lib/openclaw/schema.ts`
- Delete: `src/lib/openclaw/generator.ts`
- Delete: `src/lib/openclaw/presets.ts`
- Delete: `src/pages/InterviewPage.tsx`
- Delete: `src/pages/ExportPage.tsx`
- Delete: `src/components/ConfigModeOverlay.tsx`

**Step 1: Delete the files**

```bash
rm src/lib/openclaw/schema.ts
rm src/lib/openclaw/generator.ts
rm src/lib/openclaw/presets.ts
rmdir src/lib/openclaw
rm src/pages/InterviewPage.tsx
rm src/pages/ExportPage.tsx
rm src/components/ConfigModeOverlay.tsx
```

**Step 2: Remove stale imports from App.tsx**

Ensure no remaining imports reference deleted files. Grep for `openclaw`:

```bash
grep -r "openclaw" src/
```

Expected: Zero matches (or only in comments/docs that can be cleaned).

**Step 3: Remove legacy compatibility code from spirit.ts**

In `src/lib/soulforge/spirit.ts`, remove:
- `LegacyDimensions` interface (lines 360-369)
- `dimensionsToSpirit()` function (lines 371-420)
- `getApprovalThresholdText()` helper (lines 422-430)
- `generateSurpriseBoundaries()` helper (lines 433-449)

Also remove the re-export of `dimensionsToSpirit` and `LegacyDimensions` from `src/lib/soulforge/index.ts`.

**Step 4: Verify build**

```bash
npm run build
```

Expected: Clean build, zero errors.

**Step 5: Verify dev server**

```bash
npm run dev
```

Navigate through: Landing → Presets → Interview → Export. Verify the full flow works.

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove legacy OpenClaw pipeline and ConfigModeOverlay"
```

---

## Task 10: Update CLAUDE.md and Session Persistence

**Files:**
- Modify: `CLAUDE.md`
- Modify: `src/App.tsx` (localStorage key)

**Step 1: Update localStorage key**

In `src/App.tsx`, change the session persistence key from `'soulforge_session'` to `'soulforge_unified_session'` to avoid conflicts with old session data that would reference deleted views.

**Step 2: Update CLAUDE.md**

Update the architecture section to reflect the new unified flow:
- Remove references to "two generation pipelines"
- Remove references to legacy OpenClaw pipeline
- Update the flow description
- Note the `SpiritData` naming

**Step 3: Verify full flow**

```bash
npm run build && npm run preview
```

Test:
1. Landing → Start Fresh → complete interview → export → verify 9 files
2. Landing → Presets → select Security → interview (verify pre-filled) → export
3. Landing → Presets → select OverClaw → interview → Fine-Tune (builder) → export
4. Blog and Legal pages still work
5. Breadcrumb navigation works correctly

**Step 4: Commit**

```bash
git add CLAUDE.md src/App.tsx
git commit -m "docs: update CLAUDE.md for unified SoulForge framework"
```

---

## Execution Order & Dependencies

```
Task 1 (Rename CanonData → SpiritData)
  └─→ Task 2 (Create unified presets)
       └─→ Task 3 (Rebuild PresetsPage)
       └─→ Task 4 (Interview seeding)
            └─→ Task 5 (Rebuild App.tsx)
                 └─→ Task 6 (Rebuild BuilderPage)
                 └─→ Task 7 (Update LandingPage)
                 └─→ Task 8 (Export Fine-Tune button)
                      └─→ Task 9 (Delete legacy code)
                           └─→ Task 10 (Docs & cleanup)
```

Tasks 3, 4, 6, 7, 8 can be partially parallelized once Task 2 is complete, but Task 5 (App.tsx) is the integration point that wires them together. Task 9 must come last before Task 10.
