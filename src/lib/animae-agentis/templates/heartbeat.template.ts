/**
 * HEARTBEAT.md Template
 * 
 * Pulse (Rotating Checks + Discovery Loop)
 * - Version & Migration
 * - Context Guard & Checkpointing
 * - Compaction
 * - Rotating Checks
 * - Discovery Rotation (Surprise Loop)
 * - Cheap Checks First
 * - Silent Protocol
 * 
 * INVARIANT: When inactive and no pending actions: output exactly `HEARTBEAT_OK`
 */

import type { SpiritData } from '../types';

export function renderHeartbeatMd(canon: SpiritData, language: 'en' | 'de' = 'en'): string {
  if (language === 'de') {
    return renderGerman(canon);
  }
  return renderEnglish(canon);
}

function renderEnglish(canon: SpiritData): string {
  const groups = canon.rotatingGroups || {
    groupA: 'High priority items',
    groupB: 'Medium priority items',
    groupC: 'Low priority items',
  };

  return `# HEARTBEAT.md — Pulse (Rotating Checks + Discovery Loop)

## Intent
Operate the agent efficiently: rotating checks, cheap-first triggers, compaction/checkpoints, and discovery cadence.

## Invariants
- When inactive and no pending actions: output exactly \`HEARTBEAT_OK\`.
- Do not "check everything always". Rotate.
- Cheap checks first; expensive calls only when triggers fire.

## Version & Migration (cheap)
${getVersionMigrationText(canon.presetId, 'en')}
- If workspace Template Pack Version != skill Template Pack Version: flag "upgrade recommended".

${getCheckpointingText(canon.presetId, 'en')}

Checkpoint format: timestamp, reason, current state, next actions.

## Compaction
- If daily log exceeds 20,000 tokens: distill to MEMORY.md.
- Keep only durable facts and preferences.

## Rotating Checks (Base Ops)
Define 3 groups. Each tick runs only 1 group.
Base tick interval: **${canon.agentMode === 'chief-of-staff' ? '5 minutes' : '15 minutes'}**.

| Group | Priority | Interval | Items |
|-------|----------|----------|-------|
| **A** | High | Every tick | ${groups.groupA} |
| **B** | Medium | Every 2nd tick | ${groups.groupB} |
| **C** | Low | Every 4th tick | ${groups.groupC} |

${getRotationOrder(canon.presetId, 'en')}

## Discovery Rotation (Surprise Loop)
Run only on cadence: **${canon.surprise.cadence || 'weekly_deep'}** with boundaries from USER/SPIRIT.

${getDiscoveryDescription(canon.surprise.appetite || 'medium', canon.surprise.cadence || 'weekly_deep')}

${getDiscoveryRule(canon.presetId, canon.agentMode, 'en')}

## Task Reconciliation

### Stale Task Detection
- If a task has been in-progress for >2x its expected duration: flag as potentially stale
- If a task's last update is >30 minutes old and context has shifted: verify task is still relevant
- Stale tasks are surfaced to the user, not auto-cancelled

### Cadence State Machine
\`\`\`
IDLE → (trigger fires) → CHECKING → (all checks pass) → IDLE
                                   → (issue found) → ACTING → (resolved) → IDLE
                                   → (issue found) → ACTING → (blocked) → ESCALATE → IDLE
\`\`\`

### Reconciliation Loop
1. At each heartbeat tick: compare active tasks against current priorities
2. If priority has shifted: flag outdated tasks for user review
3. If task is complete but not marked: auto-close with summary
4. If task is blocked: surface blocker and suggest next steps

## Cheap Checks First (Trigger Ladder)
1. metadata/filters/regex (cheap)
2. targeted fetch (medium)
3. LLM synthesis (expensive) only if signal exists

## Silent Protocol
If (no triggers) AND (no actions queued) AND (no upgrade notice): output \`HEARTBEAT_OK\`.
${getPresetGateSection(canon.presetId, 'en')}## Interfaces
- Must respect USER stop words and approval threshold.
- Must align with SPIRIT "autonomy" and "surprise".

## Checks
- Contains measurable cadences and rotation groups.
- Contains explicit \`HEARTBEAT_OK\` rule.
`;
}

function renderGerman(canon: SpiritData): string {
  const groups = canon.rotatingGroups || {
    groupA: 'Hohe Priorität',
    groupB: 'Mittlere Priorität',
    groupC: 'Niedrige Priorität',
  };



  return `# HEARTBEAT.md — Puls (Rotierende Checks + Discovery Loop)

## Intent (Absicht)
Den Agenten effizient betreiben: rotierende Checks, Cheap-First-Trigger, Compaction/Checkpoints und Discovery-Kadenz.

## Invariants (Invarianten)
- Bei Inaktivität und keine ausstehenden Aktionen: Output exakt \`HEARTBEAT_OK\`.
- Nicht "immer alles checken". Rotieren.
- Cheap checks first; teure Aufrufe nur wenn Trigger auslösen.

## Version & Migration (günstig)
${getVersionMigrationText(canon.presetId, 'de')}
- Falls Workspace Template Pack Version != Skill Template Pack Version: "Upgrade empfohlen" markieren.

${getCheckpointingText(canon.presetId, 'de')}

Checkpoint-Format: Zeitstempel, Grund, aktueller State, nächste Aktionen.

## Compaction (Verdichtung)
- Wenn Tageslog > 20.000 Tokens: In MEMORY.md verdichten.
- Nur dauerhafte Fakten und Präferenzen behalten.

## Rotating Checks (Basis-Operationen)
3 Gruppen definieren. Jeder Tick führt nur 1 Gruppe aus.
Basis-Tick-Intervall: **${canon.agentMode === 'chief-of-staff' ? '5 Minuten' : '15 Minuten'}**.

| Gruppe | Priorität | Intervall | Inhalt |
|--------|-----------|-----------|--------|
| **A** | Hoch | Jeder Tick | ${groups.groupA} |
| **B** | Mittel | Jeder 2. Tick | ${groups.groupB} |
| **C** | Niedrig | Jeder 4. Tick | ${groups.groupC} |

${getRotationOrder(canon.presetId, 'de')}

## Discovery Rotation (Surprise Loop)
Nur auf Kadenz ausführen: **${canon.surprise.cadence || 'weekly_deep'}** mit Grenzen aus USER/SPIRIT.

${getDiscoveryDescriptionGerman(canon.surprise.appetite || 'medium', canon.surprise.cadence || 'weekly_deep')}

${getDiscoveryRule(canon.presetId, canon.agentMode, 'de')}

## Task-Reconciliation (Aufgaben-Abgleich)

### Erkennung veralteter Tasks
- Wenn ein Task >2x seiner erwarteten Dauer in Bearbeitung ist: als potenziell veraltet markieren
- Wenn ein Task seit >30 Minuten kein Update hat und Kontext sich verschoben hat: Relevanz prüfen
- Veraltete Tasks werden dem Nutzer angezeigt, nicht auto-abgebrochen

### Kadenz-State-Machine
\`\`\`
IDLE → (Trigger feuert) → CHECKING → (alle Checks bestanden) → IDLE
                                    → (Problem gefunden) → ACTING → (gelöst) → IDLE
                                    → (Problem gefunden) → ACTING → (blockiert) → ESCALATE → IDLE
\`\`\`

### Abgleich-Schleife
1. Bei jedem Heartbeat-Tick: aktive Tasks gegen aktuelle Prioritäten vergleichen
2. Wenn Priorität sich verschoben hat: veraltete Tasks für Nutzer-Review markieren
3. Wenn Task abgeschlossen aber nicht markiert: Auto-Close mit Zusammenfassung
4. Wenn Task blockiert: Blocker anzeigen und nächste Schritte vorschlagen

## Cheap Checks First (Trigger-Leiter)
1. Metadaten/Filter/Regex (günstig)
2. Zielgerichteter Fetch (mittel)
3. LLM-Synthese (teuer) nur wenn Signal vorhanden

## Silent Protocol (Schweige-Protokoll)
Falls (keine Trigger) UND (keine Aktionen in Warteschlange) UND (kein Upgrade-Hinweis): Output \`HEARTBEAT_OK\`.
${getPresetGateSection(canon.presetId, 'de')}## Interfaces (Schnittstellen)
- Muss USER Stop-Wörter und Freigabe-Schwelle respektieren.
- Muss mit SPIRIT "Autonomie" und "Surprise" übereinstimmen.

## Checks (Prüfungen)
- Enthält messbare Kadenz und Rotationsgruppen.
- Enthält explizite \`HEARTBEAT_OK\`-Regel.
`;
}

// ============================================================================
// Preset-Aware Helpers
// ============================================================================

type PresetId = SpiritData['presetId'];
type Language = 'en' | 'de';

function getVersionMigrationText(presetId: PresetId, language: Language): string {
  if (language === 'de') {
    if (presetId === 'security') {
      return '- Workspace VERSION.md vorhanden? Falls fehlend, Erstellung aus Template vorschlagen (nicht automatisch schreiben im SECURITY-Preset).';
    }
    return '- Workspace VERSION.md vorhanden? Falls fehlend, aus Template erstellen.';
  }
  // English
  if (presetId === 'security') {
    return '- Workspace VERSION.md present? If missing, propose creation from template (do not write automatically in SECURITY preset).';
  }
  return '- Workspace VERSION.md present? If missing, create from template.';
}

function getCheckpointingText(presetId: PresetId, language: Language): string {
  if (language === 'de') {
    if (presetId === 'security') {
      return `## Context Guard & Checkpointing
- Bei Context-Auslastung ≥ 70%: Checkpoint-Schreiben vorschlagen; nicht-kritische Checks überspringen.
- Bei Context-Auslastung ≥ 50% und letzter Checkpoint > 30 Minuten: Checkpoint-Schreiben zuerst vorschlagen.`;
    }
    return `## Context Guard & Checkpointing
- Bei Context-Auslastung ≥ 70%: Sofort Checkpoint schreiben; nicht-kritische Checks überspringen.
- Bei Context-Auslastung ≥ 50% und letzter Checkpoint > 30 Minuten: Zuerst Checkpoint schreiben.`;
  }
  // English
  if (presetId === 'security') {
    return `## Context Guard & Checkpointing
- If context utilization ≥ 70%: propose checkpoint write; skip non-critical checks.
- If context utilization ≥ 50% and last checkpoint > 30 minutes: propose checkpoint write first.`;
  }
  return `## Context Guard & Checkpointing
- If context utilization ≥ 70%: write checkpoint immediately; skip non-critical checks.
- If context utilization ≥ 50% and last checkpoint > 30 minutes: write checkpoint first.`;
}

function getRotationOrder(presetId: PresetId, language: Language): string {
  if (language === 'de') {
    switch (presetId) {
      case 'security':
        return 'Rotationsfolge (genau eine Gruppe pro Tick): A → B → C → wiederholen.';
      case 'responsible':
        return 'Rotationsfolge (genau eine Gruppe pro Tick): A → B → C → wiederholen.';
      case 'overclaw':
        return 'Rotationsfolge (genau eine Gruppe pro Tick, Baseline-lastige Gruppen): A (Baseline) → B (Baseline+Projekte) → A (Baseline) → C (Baseline+Aufräumen) → wiederholen.';
      default:
        return 'Rotationsfolge (genau eine Gruppe pro Tick): A → B → C → wiederholen.';
    }
  }
  // English
  switch (presetId) {
    case 'security':
      return 'Rotation order (exactly one group per tick): A → B → C → repeat.';
    case 'responsible':
      return 'Rotation order (exactly one group per tick): A → B → C → repeat.';
    case 'overclaw':
      return 'Rotation order (exactly one group per tick, baseline-heavy groups): A (baseline) → B (baseline+projects) → A (baseline) → C (baseline+tidy) → repeat.';
    default:
      return 'Rotation order (exactly one group per tick): A → B → C → repeat.';
  }
}

function getDiscoveryRule(presetId: PresetId, agentMode: SpiritData['agentMode'], language: Language): string {
  if (language === 'de') {
    if (agentMode === 'chief-of-staff') {
      return 'Regel: Innerhalb Sandbox-Grenzen ausführen; alles Irreversible oder Externe eskalieren.';
    }
    if (presetId === 'overclaw') {
      return 'Regel: Standardmäßig vorschlagen. Autonome Ausführung nur für erlaubte, reversible Sandbox-Aktionen (siehe USER/TOOLS), niemals für ausgehende Sends/Löschungen/Exporte.';
    }
    return 'Regel: Nur vorschlagen — nicht ohne explizite Nutzerfreigabe ausführen.';
  }
  // English
  if (agentMode === 'chief-of-staff') {
    return 'Rule: execute within sandbox boundaries; escalate anything irreversible or external.';
  }
  if (presetId === 'overclaw') {
    return 'Rule: propose by default. Autonomous execution allowed only for allowlisted, reversible sandbox actions (see USER/TOOLS), never for outbound sends/deletes/exports.';
  }
  return 'Rule: propose only — do not execute without explicit user approval.';
}

function getPresetGateSection(presetId: PresetId, language: Language): string {
  if (language === 'de') {
    switch (presetId) {
      case 'security':
        return `
## Delta-Only Reporting (SECURITY-Preset)
Wenn keine Änderungen seit dem letzten Tick (keine neuen Events/Nachrichten/Blocker) und kein Upgrade-Hinweis: Output exakt \`HEARTBEAT_OK\`.
`;
      case 'responsible':
        return `
## Anti-Routine Gate (RESPONSIBLE-Preset)
- Nur Deltas berichten: neue/geänderte Events, neue/geänderte Inbox-Prioritäten, neue/geänderte Blocker.
- Identische Alerts nicht innerhalb von 4 Ticks wiederholen, es sei denn Schweregrad hat sich erhöht.
- Letzten alert_hash in den Checkpoint-Metadaten des neuesten Checkpoints persistieren.
`;
      case 'overclaw':
        return `
## Anti-Routine Gate (OVERCLAW_AUTONOMY-Preset)
- Nur Deltas berichten und Cooldown erzwingen (kein identischer Alert innerhalb von 4 Ticks, es sei denn Schweregrad hat sich erhöht).
- Einmal pro Woche: 1 Hypothese + 1 kleinen In-Sandbox-Experimentvorschlag erstellen; nur ausführen wenn erlaubt.
`;
      default:
        return '';
    }
  }
  // English
  switch (presetId) {
    case 'security':
      return `
## Delta-Only Reporting (SECURITY preset)
If no changes since last tick (no new events/messages/blockers) and no upgrade notice: output exactly \`HEARTBEAT_OK\`.
`;
    case 'responsible':
      return `
## Anti-Routine Gate (RESPONSIBLE preset)
- Report deltas only: new/changed events, new/changed inbox priorities, new/changed blockers.
- Do not repeat identical alerts within 4 ticks unless severity increased.
- Persist last_alert_hash in the latest checkpoint metadata.
`;
    case 'overclaw':
      return `
## Anti-Routine Gate (OVERCLAW_AUTONOMY preset)
- Report deltas only and enforce cooldown (no identical alert within 4 ticks unless severity increased).
- Once per week: produce 1 hypothesis + 1 small in-sandbox experiment proposal; execute only if allowlisted.
`;
    default:
      return '';
  }
}

// ============================================================================
// Discovery Description Helpers (existing)
// ============================================================================

function getDiscoveryDescription(appetite: string, cadence: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    low: {
      daily_micro: '- Micro: One small observation or connection\n- Focus: pattern recognition only',
      weekly_deep: '- Deep: One reflection prompt that reframes\n- Focus: perspective shifts, no operational changes',
      trigger: '- Trigger: Only when explicitly stalled\n- Focus: unblock, not expand',
    },
    medium: {
      daily_micro: '- Micro: One small process improvement with lowest risk\n- Focus: efficiency gains',
      weekly_deep: '- Deep: One new perspective, one hypothesis, one small experiment\n- Focus: operational relevance',
      trigger: '- Trigger: On stalled progress or confusion\n- Focus: clarity and next steps',
    },
    high: {
      daily_micro: '- Micro: One bold hypothesis or unexpected connection\n- Focus: breakthrough thinking',
      weekly_deep: '- Deep: Comprehensive reframing, multiple experiments\n- Focus: transformative insights',
      trigger: '- Trigger: Aggressive pattern matching on all signals\n- Focus: maximum discovery',
    },
  };

  return descriptions[appetite]?.[cadence] || descriptions.medium.weekly_deep;
}

function getDiscoveryDescriptionGerman(appetite: string, cadence: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    low: {
      daily_micro: '- Micro: Eine kleine Beobachtung oder Verbindung\n- Fokus: Nur Mustererkennung',
      weekly_deep: '- Deep: Ein Reflection-Prompt, der umrahmt\n- Fokus: Perspektivwechsel, keine operativen Änderungen',
      trigger: '- Trigger: Nur wenn explizit blockiert\n- Fokus: Entblocken, nicht erweitern',
    },
    medium: {
      daily_micro: '- Micro: Eine kleine Prozessverbesserung mit geringstem Risiko\n- Fokus: Effizienzgewinne',
      weekly_deep: '- Deep: Eine neue Perspektive, eine Hypothese, ein kleines Experiment\n- Fokus: Operative Relevanz',
      trigger: '- Trigger: Bei blockiertem Fortschritt oder Verwirrung\n- Fokus: Klarheit und nächste Schritte',
    },
    high: {
      daily_micro: '- Micro: Eine kühne Hypothese oder unerwartete Verbindung\n- Fokus: Durchbruchs-Denken',
      weekly_deep: '- Deep: Umfassende Umrahmung, multiple Experimente\n- Fokus: Transformative Erkenntnisse',
      trigger: '- Trigger: Aggressives Muster-Matching auf allen Signalen\n- Fokus: Maximale Entdeckung',
    },
  };

  return descriptions[appetite]?.[cadence] || descriptions.medium.weekly_deep;
}
