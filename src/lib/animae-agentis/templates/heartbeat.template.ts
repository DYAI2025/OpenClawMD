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
- Workspace VERSION.md present? If missing, create from template.
- If workspace Template Pack Version != skill Template Pack Version: flag "upgrade recommended".

## Context Guard & Checkpointing
- If context utilization ≥ 70%: write checkpoint immediately; skip non-critical checks.
- If context utilization ≥ 50% and last checkpoint > 30 minutes: write checkpoint first.

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

Rotation order: A → A,B → A → A,B,C → repeat.

## Discovery Rotation (Surprise Loop)
Run only on cadence: **${canon.surprise.cadence || 'weekly_deep'}** with boundaries from USER/SPIRIT.

${getDiscoveryDescription(canon.surprise.appetite || 'medium', canon.surprise.cadence || 'weekly_deep')}

Rule: ${canon.agentMode === 'chief-of-staff' ? 'execute within sandbox boundaries; escalate anything irreversible or external.' : 'propose only — do not execute without explicit user approval.'}

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

## Interfaces
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
- Workspace VERSION.md vorhanden? Falls fehlend, aus Template erstellen.
- Falls Workspace Template Pack Version != Skill Template Pack Version: "Upgrade empfohlen" markieren.

## Context Guard & Checkpointing
- Bei Context-Auslastung ≥ 70%: Sofort Checkpoint schreiben; nicht-kritische Checks überspringen.
- Bei Context-Auslastung ≥ 50% und letzter Checkpoint > 30 Minuten: Zuerst Checkpoint schreiben.

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

Rotationsfolge: A → A,B → A → A,B,C → wiederholen.

## Discovery Rotation (Surprise Loop)
Nur auf Kadenz ausführen: **${canon.surprise.cadence || 'weekly_deep'}** mit Grenzen aus USER/SPIRIT.

${getDiscoveryDescriptionGerman(canon.surprise.appetite || 'medium', canon.surprise.cadence || 'weekly_deep')}

Regel: ${canon.agentMode === 'chief-of-staff' ? 'Innerhalb Sandbox-Grenzen ausführen; alles Irreversible oder Externe eskalieren.' : 'Nur vorschlagen — nicht ohne explizite Nutzerfreigabe ausführen.'}

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

## Interfaces (Schnittstellen)
- Muss USER Stop-Wörter und Freigabe-Schwelle respektieren.
- Muss mit SPIRIT "Autonomie" und "Surprise" übereinstimmen.

## Checks (Prüfungen)
- Enthält messbare Kadenz und Rotationsgruppen.
- Enthält explizite \`HEARTBEAT_OK\`-Regel.
`;
}

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
