/**
 * INDEX.md Template
 * 
 * Workspace Map (Advanced Pack)
 * - Core Config Files
 * - Directories
 * - Naming conventions
 */

import type { CanonData } from '../types';

export function renderIndexMd(_canon: CanonData, language: 'en' | 'de' = 'en'): string {
  if (language === 'de') {
    return renderGerman();
  }
  return renderEnglish();
}

function renderEnglish(): string {
  return `# INDEX.md — Workspace Map (Advanced Pack)

## Intent
One source of truth for where things live and how often they change.

## Core Config Files

| File | Purpose | Update Frequency |
|------|---------|------------------|
| SOUL.md | Constitution (static) | Rare |
| IDENTITY.md | Name/Role/Tone | Rare |
| USER.md | Operating contract | When preferences change |
| HEARTBEAT.md | Pulse & rotations | When priorities/cadence change |
| SHIELD.md | Defensive guardrails | Rare |
| CANON.md | Resonance anchor | Only on explicit change |
| MEMORY.md | Stable facts & learned preferences | As needed |
| VERSION.md | Skill/template version marker | On upgrades |
| INDEX.md | This map | When structure changes |

## Directories (recommended)

\`\`\`
workspace/
├── memory/
│   ├── 2024-01-15.md          # Daily log example
│   ├── 2024-01-16.md
│   └── ...
├── memory/archive/            # Old logs after compaction
│   └── 2024-01-q1/
├── memory/checkpoints/        # Checkpoint snapshots
│   └── checkpoint-20240115-143022.md
└── exports/                   # Irreversible outputs separated
    └── ...
\`\`\`

## Naming conventions

### Daily Logs
- Format: \`memory/YYYY-MM-DD.md\`
- Content: Day-level activity and decisions
- Trigger: Auto-created daily
- Compaction: When exceeding 20k tokens

### Checkpoints
- Format: \`memory/checkpoints/checkpoint-YYYYMMDD-HHMMSS.md\`
- Content: Context snapshots at decision points
- Trigger: Context > 70%, or major direction changes
- Retention: Last 10 checkpoints

### Archives
- Format: \`memory/archive/YYYY-MM-Q#.zip\`
- Content: Compressed old daily logs
- Trigger: Quarterly or when directory > 100MB
- Retention: Indefinite (compressed)

### Exports
- Format: \`exports/YYYYMMDD-description.ext\`
- Content: Irreversible outputs (reports, artifacts)
- Trigger: Explicit user action
- Retention: User-managed

## File Dependencies

\`\`\`
CANON.md (anchor)
    ├── SOUL.md
    ├── IDENTITY.md
    ├── USER.md
    │       └── HEARTBEAT.md (implements cadence)
    │       └── SHIELD.md (implements approvals)
    ├── MEMORY.md (distilled from daily logs)
    └── VERSION.md
\`\`\`

## Update Triggers

### Immediate (rare)
- SOUL.md: Constitutional crisis or principle conflict
- IDENTITY.md: Role redefinition
- CANON.md: Explicit user decision

### As Needed (occasional)
- USER.md: Preference changes
- HEARTBEAT.md: Priority/cadence shifts
- MEMORY.md: Stable facts accumulation

### Automated (frequent)
- Daily logs: Every workday
- Checkpoints: Context threshold triggers
- Archives: Size/time thresholds

## Checks
- If new file types appear repeatedly: promote into INDEX and add convention.
- If update frequency doesn't match actual use: adjust frequency in this file.
`;
}

function renderGerman(): string {
  return `# INDEX.md — Workspace Map (Advanced Pack)

## Intent (Absicht)
Eine Quelle der Wahrheit darüber, wo Dinge leben und wie oft sie sich ändern.

## Core Config Files (Kern-Konfigurationsdateien)

| Datei | Zweck | Update-Frequenz |
|-------|-------|-----------------|
| SOUL.md | Verfassung (statisch) | Selten |
| IDENTITY.md | Name/Rolle/Ton | Selten |
| USER.md | Arbeitsvertrag | Bei Präferenzänderungen |
| HEARTBEAT.md | Puls & Rotationen | Bei Prioritäts-/Kadenz-Änderungen |
| SHIELD.md | Defensive Guardrails | Selten |
| CANON.md | Resonance Anchor | Nur bei expliziter Änderung |
| MEMORY.md | Stable Facts & gelernte Präferenzen | Nach Bedarf |
| VERSION.md | Skill/Template-Versionsmarker | Bei Upgrades |
| INDEX.md | Diese Map | Bei Strukturänderungen |

## Directories (empfohlen)

\`\`\`
workspace/
├── memory/
│   ├── 2024-01-15.md          # Tageslog-Beispiel
│   ├── 2024-01-16.md
│   └── ...
├── memory/archive/            # Alte Logs nach Compaction
│   └── 2024-01-q1/
├── memory/checkpoints/        # Checkpoint-Snapshots
│   └── checkpoint-20240115-143022.md
└── exports/                   # Irreversible Outputs separiert
    └── ...
\`\`\`

## Naming conventions (Namenskonventionen)

### Daily Logs (Tageslogs)
- Format: \`memory/YYYY-MM-DD.md\`
- Inhalt: Tagesaktivitäten und Entscheidungen
- Trigger: Täglich automatisch erstellt
- Compaction: Bei Überschreitung von 20k Tokens

### Checkpoints
- Format: \`memory/checkpoints/checkpoint-YYYYMMDD-HHMMSS.md\`
- Inhalt: Context-Snapshots bei Entscheidungspunkten
- Trigger: Context > 70%, oder große Richtungsänderungen
- Retention: Letzte 10 Checkpoints

### Archives
- Format: \`memory/archive/YYYY-MM-Q#.zip\`
- Inhalt: Komprimierte alte Tageslogs
- Trigger: Quartalsweise oder bei Verzeichnis > 100MB
- Retention: Unbegrenzt (komprimiert)

### Exports
- Format: \`exports/YYYYMMDD-description.ext\`
- Inhalt: Irreversible Outputs (Reports, Artefakte)
- Trigger: Explizite Nutzeraktion
- Retention: Nutzer-verwaltet

## File Dependencies (Datei-Abhängigkeiten)

\`\`\`
CANON.md (anchor)
    ├── SOUL.md
    ├── IDENTITY.md
    ├── USER.md
    │       └── HEARTBEAT.md (implementiert Kadenz)
    │       └── SHIELD.md (implementiert Freigaben)
    ├── MEMORY.md (destilliert aus Tageslogs)
    └── VERSION.md
\`\`\`

## Update Triggers (Update-Trigger)

### Immediate (sofort - selten)
- SOUL.md: Konstitutionelle Krise oder Prinzipienkonflikt
- IDENTITY.md: Rollenredefinition
- CANON.md: Explizite Nutzerentscheidung

### As Needed (nach Bedarf - gelegentlich)
- USER.md: Präferenzänderungen
- HEARTBEAT.md: Prioritäts-/Kadenz-Änderungen
- MEMORY.md: Akkumulation stabiler Fakten

### Automated (automatisiert - häufig)
- Tageslogs: Jeder Arbeitstag
- Checkpoints: Context-Threshold-Trigger
- Archive: Größen-/Zeit-Thresholds

## Checks (Prüfungen)
- Falls neue Dateitypen wiederholt auftauchen: In INDEX promoten und Konvention hinzufügen.
- Falls Update-Frequenz nicht zur tatsächlichen Nutzung passt: Frequenz in dieser Datei anpassen.
`;
}
