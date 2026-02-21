# SoulForge_1.2 – Iterativer Implementierungsplan

## Executive Summary

Dieser Plan migriert die bestehende OpenClaw-Website von einem einfachen 8-Dimensionen-Generator zu einem vollständigen SoulForge_1.2-System mit sokratischem Interview, State Machine, Separation+Resonance-Architektur und Advanced Pack.

---

## Aktueller Stand (As-Is)

### Architektur

- **Stack**: React 19 + TypeScript + Vite + Tailwind CSS
- **UI-System**: "Clay" Design System (Neumorphism)
- **State**: React Hooks + localStorage (History-Stack)

### Funktionsumfang

- **3 Presets**: SECURITY, OPEN, CRAZY (Overclaw)
- **8 Dimensionen**: riskTolerance, approvalThreshold, heartbeatAggressiveness, strategicInitiative, dataAccessScope, communicationAuthority, uncertaintyHandling, executionScope
- **Flows**:
  - LandingPage → PresetsPage → ExportPage
  - LandingPage → InterviewPage (4 Steps) → ExportPage
  - LandingPage → BuilderPage → ExportPage
- **Output**: 5 Markdown-Dateien (soul.md, identity.md, shield.md, user.md, heartbeat.md)

### Generierungs-Logik

- Deterministische Templates basierend auf Dimension-Werten
- Keine echte SoulForge-Struktur (keine Intent/Invariants/Interfaces/Checks)
- Keine Resonance-Validierung

---

## Ziel-Architektur (SoulForge_1.2)

### Kernkonzepte

```
┌─────────────────────────────────────────────────────────────────┐
│                    THIRD_EMBODIMENT                             │
├─────────────────────────────────────────────────────────────────┤
│  SOUL.md        IDENTITY.md        USER.md                      │
│  ─────────      ───────────        ────────                     │
│  Constitution   Mask               Contract                     │
│  (Über-Ich)     (Ego)              (Betriebsvertrag)            │
│                                                                 │
│  • Grenzen      • Name             • Ansprache                  │
│  • Wahrheit     • Titel            • Output-Format              │
│  • Constraints  • Ton                • Autonomie/Freigaben      │
│                 • Avatar           • Stop-Wörter                │
│                                    • Surprise Contract          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    OPERATIONAL LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  HEARTBEAT.md                    SHIELD.md                      │
│  ────────────                    ─────────                      │
│  Pulse                           Guardrails                     │
│                                                                 │
│  • Rotating Checks               • Default Blocks               │
│  • Cheap-first                   • Policy Gates                 │
│  • Silent Protocol               • Emergency Stop               │
│  • Compaction/Checkpoints                                       │
│  • Discovery Rotation (Surprise)                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ADVANCED PACK (Optional)                     │
├─────────────────────────────────────────────────────────────────┤
│  CANON.md       INDEX.md        MEMORY.md       VERSION.md      │
│  ─────────      ────────        ─────────       ─────────       │
│  Resonance      Workspace       Stable Facts    Version Marker  │
│  Anchor         Map                                           │
└─────────────────────────────────────────────────────────────────┘
```

### State Machine (Interview-Prozess)

```
HANDSHAKE → DISCOVERY → VIBECODING → CONSTITUTION → PULSE → 
    ↓           ↓           ↓            ↓          ↓
GENERATION → VALIDATION → OUTPUT → FEEDBACK
```

**Turn-Regel**: 1-2 Fragen pro Phase, dann warten.

---

## Implementierungsphasen

---

### Phase 1: Foundation – Neue Schemas & Types

**Geschätzter Aufwand**: 2-3 Stunden
**Abhängigkeiten**: Keine

#### Ziele

- SoulForge-spezifische Types definieren
- Kompatibilität mit bestehendem Schema wahren
- Canon-Datenstruktur etablieren

#### Dateien

```
src/lib/soulforge/
├── types.ts          # Neue TypeScript-Interfaces
├── canon.ts          # Canon-Datenstruktur & Defaults
└── index.ts          # Public API
```

#### Datenstrukturen

```typescript
// Canon = Single Source of Truth
interface CanonData {
  // Identity
  agentName: string;
  agentTitle: string;
  agentMode: 'sidekick' | 'chief-of-staff' | 'coach';
  domainFocus: string;
  
  // Tone
  tone: {
    precision: 'minimalist' | 'explanatory';
    method: 'socratic' | 'instructional';
    directness: 'direct' | 'gentle';
  };
  
  // Autonomy
  autonomy: {
    actionMode: 'recommend_only' | 'execute_with_approval' | 'autonomous_in_sandbox';
    approvalThreshold: string;
  };
  
  // Surprise
  surprise: {
    appetite: 'low' | 'medium' | 'high';
    cadence: 'daily_micro' | 'weekly_deep' | 'trigger';
    boundaries: string;
  };
  
  // Constitution
  truthPolicy: 'mark_uncertainty' | 'calibrated_confidence' | 'confident_only';
  negativeConstraints: string[];
  
  // Operational
  stopWords: string[];
  timezone: string;
  language: string;
  outputFormat: 'result_only' | 'result_plus_plan' | 'options_tradeoffs';
}

// Interview State Machine
interface InterviewState {
  phase: InterviewPhase;
  canon: Partial<CanonData>;
  history: InterviewTurn[];
}

type InterviewPhase = 
  | 'handshake' 
  | 'discovery' 
  | 'vibecoding' 
  | 'constitution' 
  | 'pulse' 
  | 'generation' 
  | 'validation' 
  | 'output';
```

#### Akzeptanzkriterien

- [ ] Alle SoulForge-Types definiert
- [ ] Default-Canons für 3 Modi (Sidekick, Chief of Staff, Coach)
- [ ] Validierungsfunktionen für Canon-Vollständigkeit
- [ ] Bestehende 8-Dimensionen zu Canon Mapping

---

### Phase 2: Template-System & Canon

**Geschätzter Aufwand**: 3-4 Stunden
**Abhängigkeiten**: Phase 1

#### Ziele

- Template-Engine für alle 9 Dateien (Base + Advanced)
- Resonance-Section-Topologie implementieren
- Variable-Substitution

#### Dateien

```
src/lib/soulforge/
├── templates/
│   ├── soul.template.ts
│   ├── identity.template.ts
│   ├── user.template.ts
│   ├── heartbeat.template.ts
│   ├── shield.template.ts
│   ├── canon.template.ts
│   ├── index.template.ts
│   ├── memory.template.ts
│   └── version.template.ts
├── engine.ts         # Template-Rendering-Engine
└── types.ts
```

#### Template-Struktur (pro Datei)

Jede Template folgt der **Resonance-Section-Topologie**:

```markdown
# FILENAME.md — Intent-Kurzbeschreibung

## Intent
Was diese Datei tut.

## Invariants
Was niemals herein kommt (z.B. "No tools in SOUL").

## [File-Specific Core]
- SOUL: Constitution, Truth Policy, Negative Constraints
- IDENTITY: Name, Title, Tone, Avatar
- USER: Addressing, Output Contract, Autonomy, Surprise Contract
- HEARTBEAT: Rotating Checks, Discovery, Silent Protocol
- SHIELD: Default Blocks, Policy Gates, Emergency Stop

## Interfaces
Welche anderen Dateien konsumiert/produziert diese.

## Checks
Validierungs-Checkliste.
```

#### Akzeptanzkriterien

- [ ] Alle 9 Templates implementiert
- [ ] Template-Engine mit Variable-Substitution
- [ ] Einheitliche Resonance-Struktur
- [ ] Unit-Tests für Template-Rendering

---

### Phase 3: SoulForge-Generator

**Geschätzter Aufwand**: 2-3 Stunden
**Abhängigkeiten**: Phase 1, Phase 2

#### Ziele

- Canon-basierte Datei-Generierung
- Deterministische Output-Struktur
- Optional: Advanced Pack

#### Dateien

```
src/lib/soulforge/
├── generator.ts      # Haupt-Generator
├── files.ts          # File-Definitionen
└── index.ts
```

#### API

```typescript
interface GenerationOptions {
  includeAdvancedPack: boolean;
  language: 'en' | 'de';
}

interface GeneratedFile {
  name: string;
  content: string;
}

function generateSoulForgeFiles(
  canon: CanonData, 
  options: GenerationOptions
): GeneratedFile[];
```

#### Generierungs-Reihenfolge

1. **CANON.md** (wenn Advanced) – dient als Anchor
2. **SOUL.md** – Constitution
3. **IDENTITY.md** – Mask
4. **USER.md** – Contract
5. **HEARTBEAT.md** – Pulse
6. **SHIELD.md** – Guardrails
7. **INDEX.md** – Workspace Map
8. **MEMORY.md** – Stable Facts
9. **VERSION.md** – Version Marker

#### Akzeptanzkriterien

- [ ] Generator erzeugt alle Dateien korrekt
- [ ] Canon-Parameter durchgängig konsistent
- [ ] Advanced Pack optional auswählbar
- [ ] Deutsche und englische Ausgabe

---

### Phase 4: Sokratisches Interview (State Machine)

**Geschätzter Aufwand**: 6-8 Stunden
**Abhängigkeiten**: Phase 1

#### Ziele

- State Machine implementieren
- 1-2 Fragen pro Phase (Turn-Regel)
- Canon-Parametereingabe schrittweise
- VibeCoding: Rollen-Vorschläge

#### Dateien

```
src/pages/
├── SoulForgeInterviewPage.tsx    # Neue Interview-Seite
└── ...

src/lib/soulforge/
├── interview/
│   ├── stateMachine.ts           # Phasen-Logik
│   ├── questions.ts              # Fragen-Katalog
│   ├── roles.ts                  # VibeCoding Rollen
│   └── flow.ts                   # Flow-Steuerung
```

#### Interview-Phasen (detailliert)

**Phase 0: HANDSHAKE**

- Frage 1: Base (5 Dateien) oder Advanced (9 Dateien)?
- Frage 2: Ausgabesprache (DE/EN)?

**Phase 1: DISCOVERY**

- Frage 1: Modus? (Sidekick / Chief of Staff / Coach)
- Frage 2: Problem in 1 Satz + 2-3 Erfolgssignale (30 Tage)
- Optional: Surprise appetite (low/med/high)?

**Phase 2: VIBECODING**

- Frage 1: 2-3 hoch-spezialisierte Titel vorschlagen
- Frage 2: Ton wählen (klinisch/sokratisch/direkt/ruhig/minimalistisch)
- Hard-Stop: Tool/Prozess-Regeln → USER/HEARTBEAT

**Phase 3: CONSTITUTION**

- Frage 1: 3 Negativregeln ("niemals")
- Frage 2: Wahrheitspolitik

**Phase 4: PULSE**

- Frage 1: Tool-Landkarte + Frequenzen
- Frage 2: USER-Vertrag (Ansprache, Output, Autonomie, Stop-Wörter, Zeitzone)
- Frage 3: Surprise boundaries + Kadenz

**Phase 5: GENERATION readiness**

- Canon-Vollständigkeit prüfen
- Widersprüche identifizieren
- Bei Konflikten: Prioritätsfrage

#### UI-Komponenten

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back          Interview Wizard              [Progress]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Phase: VIBECODING                                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Welche spezialisierte Rolle passt am besten?      │   │
│  │                                                     │   │
│  │  ○ Principal Discovery Architect                   │   │
│  │    (Signal Extraction & Synthesis)                 │   │
│  │                                                     │   │
│  │  ● Senior Research Strategist                      │   │
│  │    (Hypotheses & Experiments)                      │   │
│  │                                                     │   │
│  │  ○ Systems Concept Architect                       │   │
│  │    (Modeling & Surprise Loops)                     │   │
│  │                                                     │   │
└─────────────────────────────────────────────────────────────┘
```

#### Akzeptanzkriterien

- [ ] Alle 8 Phasen implementiert
- [ ] Turn-Regel (1-2 Fragen pro Phase)
- [ ] VibeCoding Rollen-Vorschläge
- [ ] Live-Canon-Preview
- [ ] Widerspruchserkennung
- [ ] Fortschrittsspeicherung (localStorage)

---

### Phase 5: Overclaw Safety & Double Confirmation

**Geschätzter Aufwand**: 3-4 Stunden
**Abhängigkeiten**: Keine (eigenständig)

#### Ziele

- Overclaw-Modus visuell kennzeichnen
- Mandatory Risk Modal
- Double Confirmation Flow
- Legal Logging vorbereiten

#### Dateien

```
src/components/safety/
├── OverclawBanner.tsx           # Roter Banner
├── RiskModal.tsx                # Pflicht-Modal
├── ConfirmationStep.tsx         # Zweite Bestätigung
└── RiskBadge.tsx                # Risk Indicators

src/lib/safety/
├── constants.ts                 # Risk Levels
├── validation.ts                # Safety Checks
└── logging.ts                   # Log-Struktur
```

#### Overclaw-Flow

```
User wählt CRAZY/Overclaw
         ↓
┌──────────────────────┐
│ Risk Modal öffnet    │ ← Blockiert weitere Interaktion
│ sich automatisch     │
│                      │
│ ⚠️ High Autonomy     │
│   Activation         │
│                      │
│ [ ] I understand...  │ ← Muss gecheckt werden
│                      │
│ [Continue]           │ ← Disabled bis Checkbox
└──────────────────────┘
         ↓
Builder/Interview normal
         ↓
ExportPage
         ↓
┌──────────────────────┐
│ Download Confirmation│
│                      │
│ "I confirm that..."  │
│                      │
│ [Download]           │
└──────────────────────┘
         ↓
Timestamp + Version logged
```

#### Risk-Indikatoren

| Context | UI Element |
|---------|-----------|
| Overclaw selection | Roter persistenter Banner |
| Custom High Risk | Orangene Warnleiste |
| External communication | Warn-Icon neben Setting |
| Download page | Responsibility confirmation |

#### Akzeptanzkriterien

- [ ] Roter Banner bei Overclaw
- [ ] Risk Modal blockiert Flow bis Bestätigung
- [ ] Checkbox Pflichtfeld
- [ ] Zweite Bestätigung vor Download
- [ ] Logging-Struktur (für spätere Account-Integration)

---

### Phase 6: Advanced Pack (CANON, INDEX, MEMORY, VERSION)

**Geschätzter Aufwand**: 2-3 Stunden
**Abhängigkeiten**: Phase 2, Phase 3

#### Ziele

- Advanced Pack als Option implementieren
- 4 zusätzliche Dateien generieren
- Opt-in während Handshake-Phase

#### CANON.md (Resonance Anchor)

```markdown
# CANON.md — Resonance Anchor (Single Source of Truth)

## Intent
This file is the canonical parameter set. All other files must remain consistent with it.

## Invariants
- Canon values change only by explicit user decision.
- If Canon changes, apply change-impact-map.

## Canon
- agent_name: {{AGENT_NAME}}
- agent_title: {{AGENT_TITLE}}
- agent_mode: {{AGENT_MODE}}
- domain_focus: {{DOMAIN_FOCUS}}
- tone: {{TONE}}
- autonomy: {{AUTONOMY}}
- surprise: {{SURPRISE}}
- truth_policy: {{TRUTH_POLICY}}

## Interfaces
- SOUL.md must implement truth_policy + negative_constraints
- IDENTITY.md must match agent_name, agent_title, tone
- USER.md must match autonomy + surprise + output preferences
- HEARTBEAT.md must operationalize surprise.cadence

## Checks
- If any file contradicts Canon: fix the file, not Canon.
```

#### INDEX.md (Workspace Map)

```markdown
# INDEX.md — Workspace Map

## Core Config Files
| File | Purpose | Update Frequency |
|------|---------|------------------|
| SOUL.md | Constitution | Rare |
| IDENTITY.md | Name/Role/Tone | Rare |
| ... | ... | ... |

## Directories
- memory/YYYY-MM-DD.md — daily log
- memory/archive/ — old logs
- memory/checkpoints/ — checkpoint snapshots
```

#### MEMORY.md (Stable Facts)

```markdown
# MEMORY.md — Stable Facts (Small, Curated)

## Stable Preferences
- Address form: {{ADDRESS_FORM}}
- Output format: {{OUTPUT_FORMAT}}
- Stop words: {{STOP_WORDS}}

## Operating Boundaries
- Approval threshold: {{APPROVAL_THRESHOLD}}
- Surprise appetite/cadence: {{SURPRISE}}

## Decisions & Rationale
{{DURABLE_DECISIONS}}
```

#### VERSION.md

```markdown
# VERSION.md

OpenClaw Soulforge Skill Version: 2.0.0
Template Pack Version: 2.0.0
Resonance Layer: R1
```

#### Akzeptanzkriterien

- [ ] Advanced Pack Checkbox in Handshake
- [ ] Alle 4 Advanced-Dateien korrekt generiert
- [ ] CANON.md als Resonance Anchor funktioniert
- [ ] INDEX.md zeigt korrekte Struktur

---

### Phase 7: Validierung & Quality Gates

**Geschätzter Aufwand**: 3-4 Stunden
**Abhängigkeiten**: Phase 2

#### Ziele

- Quality Gates implementieren
- File-Separation validieren
- Resonance-Gates prüfen
- Repair-Playbook

#### Dateien

```
src/lib/soulforge/
├── validation/
│   ├── qualityGates.ts       # File-sep. Checks
│   ├── resonanceGates.ts     # Cross-file Checks
│   ├── repair.ts             # Auto-Repair
│   └── index.ts
```

#### Quality Gates (File Separation)

```typescript
const QUALITY_GATES = [
  {
    id: 'SOUL_NO_TOOLS_OR_SCHEDULE',
    files: ['SOUL.md'],
    mustNotContain: ['Git', 'Slack', 'Calendar', 'every ', 'minutes', 'daily', 'tool'],
    mustContain: ['Negative Constraints', 'Truth Policy'],
  },
  {
    id: 'IDENTITY_NO_PROCESS',
    files: ['IDENTITY.md'],
    mustNotContain: ['check', 'every ', 'minutes', 'use JSON', 'tool', 'heartbeat'],
    mustContain: ['Name', 'Professional Title', 'Tone'],
  },
  {
    id: 'USER_OPERATIONAL_ONLY',
    files: ['USER.md'],
    mustNotContain: ['born', 'childhood', 'my life story'],
    mustContain: ['Output Contract', 'Autonomy', 'Stop Words', 'Surprise Contract'],
  },
  {
    id: 'HEARTBEAT_SILENT_PROTOCOL',
    files: ['HEARTBEAT.md'],
    mustContain: ['HEARTBEAT_OK', 'Rotating Checks', 'Cheap Checks First'],
  },
  {
    id: 'SHIELD_DEFENSIVE_ONLY',
    files: ['SHIELD.md'],
    mustNotContain: ['bypass', 'evade', 'exploit'],
    mustContain: ['Default Blocks', 'Policy Gates'],
  },
];
```

#### Resonance Gates (Cross-File)

```typescript
const RESONANCE_GATES = [
  {
    id: 'NAME_CONSISTENCY',
    check: (files) => files.IDENTITY.name === files.CANON?.agentName,
  },
  {
    id: 'TONE_ALIGNMENT',
    check: (files) => files.IDENTITY.tone === files.CANON?.tone,
  },
  {
    id: 'APPROVAL_ALIGNMENT',
    check: (files) => files.USER.approvalThreshold === files.CANON?.autonomy.approvalThreshold,
  },
];
```

#### Repair-Playbook

```typescript
const REPLAY_RULES = {
  'SOUL_NO_TOOLS_OR_SCHEDULE': {
    action: 'remove_tool_references',
    moveTo: ['USER.md', 'HEARTBEAT.md'],
  },
  'IDENTITY_NO_PROCESS': {
    action: 'remove_process_references',
    moveTo: ['USER.md', 'HEARTBEAT.md'],
  },
  // ...
};
```

#### Akzeptanzkriterien

- [ ] Alle Quality Gates implementiert
- [ ] Alle Resonance Gates implementiert
- [ ] Auto-Repair für einfache Fälle
- [ ] Fehlerberichte für komplexe Fälle
- [ ] Validation Report im Export

---

### Phase 8: Export & ZIP-Download

**Geschätzter Aufwand**: 2-3 Stunden
**Abhängigkeiten**: Phase 3, Phase 6

#### Ziele

- ZIP-Download aller Dateien
- Einzeldatei-Download
- JSON-Export für Re-Import
- Validation Report

#### Dateien

```
src/lib/soulforge/
├── export/
│   ├── zip.ts              # ZIP-Erstellung
│   ├── json.ts             # JSON-Export/Import
│   └── report.ts           # Validation Report
```

#### Features

**ZIP-Download**

```typescript
function createZip(files: GeneratedFile[]): Blob;
```

**Datei-Struktur im ZIP**

```
openclaw-config-{name}-{date}.zip
├── SOUL.md
├── IDENTITY.md
├── USER.md
├── HEARTBEAT.md
├── SHIELD.md
├── CANON.md          # (wenn Advanced)
├── INDEX.md          # (wenn Advanced)
├── MEMORY.md         # (wenn Advanced)
├── VERSION.md        # (wenn Advanced)
└── validation-report.json
```

**JSON-Export**

```typescript
interface ConfigExport {
  version: '2.0.0';
  canon: CanonData;
  options: GenerationOptions;
  exportedAt: string;
}
```

#### Akzeptanzkriterien

- [ ] ZIP-Download funktioniert
- [ ] Alle Dateien enthalten
- [ ] JSON-Export für Re-Import
- [ ] JSON-Import in Interview/Builder
- [ ] Validation Report als JSON

---

### Phase 9: Resonance-Checks & Repair

**Geschätzter Aufwand**: 3-4 Stunden
**Abhängigkeiten**: Phase 7

#### Ziele

- Live-Resonance-Checks im Interview
- Canon-Drift-Warnungen
- Repair-Vorschläge

#### Features

**Live-Resonance-Check**

```typescript
function checkResonance(canon: CanonData): ResonanceIssue[];

interface ResonanceIssue {
  gateId: string;
  severity: 'error' | 'warning';
  message: string;
  suggestedFix?: string;
}
```

**Beispiel-Warnungen**

- "Tone in IDENTITY (socratic) passt nicht zu Output Contract (brief_by_default)"
- "Surprise appetite (high) bei approval_threshold (recommend_only) – erwägen Sie execute_with_approval"

**Repair-UI**

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ Resonance Warning                                        │
│                                                             │
│ TONE_MISMATCH: IDENTITY und USER haben konfliktierende      │
│ Tone-Einstellungen.                                         │
│                                                             │
│ [Automatisch korrigieren]  [Ignorieren]  [Manuell ändern]  │
└─────────────────────────────────────────────────────────────┘
```

#### Akzeptanzkriterien

- [ ] Live-Resonance-Check im Interview
- [ ] Warnungen bei Canon-Drift
- [ ] Repair-Vorschläge mit Erklärung
- [ ] Auto-Repair-Option

---

## Wichtige Namensänderung

**Hinweis**: Der Begriff "Triad of Selfhood" ist markenrechtlich geschützt. In SoulForge 1.2 verwenden wir stattdessen **"thrid_embodiment"** für das Drei-Ebenen-Modell von SOUL + IDENTITY + USER.

## Integration in bestehende Architektur

### Schema-Kompatibilität

```typescript
// Mapping: 8 Dimensionen → Canon
function dimensionsToCanon(dims: DimensionConfigType): Partial<CanonData> {
  return {
    autonomy: {
      actionMode: dims.approvalThreshold <= 2 
        ? 'autonomous_in_sandbox' 
        : dims.approvalThreshold <= 4 
          ? 'execute_with_approval' 
          : 'recommend_only',
      approvalThreshold: getApprovalThresholdText(dims.approvalThreshold),
    },
    surprise: {
      appetite: dims.strategicInitiative >= 4 ? 'high' : dims.strategicInitiative >= 2 ? 'medium' : 'low',
      cadence: dims.heartbeatAggressiveness >= 4 ? 'daily_micro' : 'weekly_deep',
      boundaries: getSurpriseBoundaries(dims),
    },
    // ...
  };
}
```

### Routing-Integration

```typescript
// App.tsx Erweiterung
type AppView = 'landing' | 'presets' | 'interview' | 'builder' | 'export' 
  | 'soulforge-interview'  // Neu
  | 'blog';
```

### Preset-Migration

| Altes Preset | SoulForge Mode | Besonderheiten |
|--------------|----------------|----------------|
| SECURITY | Chief of Staff | approval=recommend_only, surprise=low |
| OPEN | Sidekick | Ausgewogen |
| CRAZY | Chief of Staff | approval=execute_with_approval, surprise=high |

---

## Testing-Strategie

### Unit Tests

- Template-Rendering
- Canon-Validierung
- Quality Gates
- Resonance Gates

### Integration Tests

- Vollständiger Interview-Flow
- Generierung aller Dateien
- ZIP-Download
- JSON Import/Export

### E2E Tests

- Overclaw Double Confirmation
- Repair-Flow
- Resonance-Warnungen

---

## Zusammenfassung

| Phase | Aufwand | Dependencies | Output |
|-------|---------|--------------|--------|
| 1. Foundation | 2-3h | - | Types, Canon |
| 2. Templates | 3-4h | 1 | 9 Templates |
| 3. Generator | 2-3h | 1, 2 | Generator API |
| 4. Interview | 6-8h | 1 | State Machine |
| 5. Overclaw | 3-4h | - | Safety UI |
| 6. Advanced | 2-3h | 2, 3 | +4 Dateien |
| 7. Validation | 3-4h | 2 | Gates |
| 8. Export | 2-3h | 3, 6 | ZIP, JSON |
| 9. Resonance | 3-4h | 7 | Live-Checks |
| **Gesamt** | **~26-36h** | | |

---

## Empfohlene Reihenfolge

**Minimal Viable SoulForge** (Phasen 1-4, 5, 8)
→ Funktionsfähiges SoulForge-System mit Safety

**Full SoulForge** (alle Phasen)
→ Vollständiges System mit Advanced Pack und Resonance
