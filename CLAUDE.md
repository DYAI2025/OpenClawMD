# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

OpenClawMD / Animae Agentis is a client-side React app for generating AI agent configuration files (Markdown). It produces 10 files (SOUL.md, IDENTITY.md, USER.md, HEARTBEAT.md, SHIELD.md, SPIRIT.md, CORTEX.md, MEMORY.md, VERSION.md, OPS.md) from a single data model called `SpiritData`.

No backend. All generation is deterministic, client-side only. Exports are downloaded as ZIP or individual Markdown files.

## Commands

```bash
npm run dev       # Start Vite dev server (HMR)
npm run build     # TypeScript check + Vite production build (tsc -b && vite build)
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

No test runner is configured. There is one test file at `src/lib/animae-agentis/__tests__/generator.test.ts` but no test script in package.json.

## Deployment

GitHub Actions deploys on push to `main` via FTP to Hostinger (`./dist/` -> `./public_html/`). See `.github/workflows/deploy.yml`. Build uses `base: './'` (relative paths) for Hostinger compatibility.

## Architecture

### Data Model

`SpiritData` (`src/lib/animae-agentis/types.ts`) is the single source of truth. Key fields: agentMode, agentName, agentTitle, tone, autonomy, surprise, truthPolicy, negativeConstraints, output, addressing, stopWords.

### Navigation

No router library. App.tsx manages a history stack (`HistoryEntry[]`) with `pushView`/`goBack`/`goToHistoryIndex`. Views defined by `AppView` type. Session state persists to `localStorage` under key `animae_agentis_unified_session`.

### User Flow

```
LandingPage
  |- "Start Fresh" -> Interview (empty SpiritData)
  |- "Use Preset"  -> PresetsPage -> Interview (pre-filled SpiritData)

Interview (6 steps: mode -> role -> tone -> constraints -> autonomy -> review)
  -> optional BuilderPage (fine-tune SpiritData fields)
  -> ExportPage (preview + download 10 files)
```

### Presets

Defined in `src/lib/presets.ts`. Three presets (Security, Responsible, OverClaw) each provide `Partial<SpiritData>` that seeds the interview with pre-selected values.

### Generation Pipeline

- Types: `src/lib/animae-agentis/types.ts`
- Defaults & utilities: `src/lib/animae-agentis/spirit.ts` (mode defaults, createEmptySpirit, mergeWithDefaults, isSpiritComplete)
- Templates: `src/lib/animae-agentis/templates/*.template.ts` (one per output file)
- Generator: `src/lib/animae-agentis/generator.ts` (renders all 10 files from SpiritData)
- Validation: quality gates + resonance gates in `src/lib/animae-agentis/validation/`
- Export: ZIP (via jszip) and JSON in `src/lib/animae-agentis/export/`

### UI Layers

- **shadcn/ui** (`src/components/ui/`) - New York style, Radix primitives, lucide icons. Add via `npx shadcn@latest add <component>`.
- **Clay design system** (`src/components/clay/`) - Custom components (ClayButton, ClayCard, ClaySlider, ClayTabs, ClayStepper, ClayToggle, ClayErrorBanner, ClayFlowBreadcrumb). Colors in `tailwind.config.js` under `clay.*`.
- **Safety components** (`src/components/safety/`) - RiskBadge, RiskModal, OverclawBanner, ConfirmationStep, DownloadConfirmation. Risk calculation in `src/lib/safety/validation.ts`.

### Key Conventions

- Path alias: `@/` maps to `./src/`
- Tailwind v3 with CSS variables for theming (HSL-based colors)
- Clay color palette: base, peach, mint, sage, sand, coral, stone, charcoal
- Legal pages (Impressum, Datenschutz, ToS) content in `src/lib/legalData.ts`
