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

- **Group A (high)**: ${groups.groupA}
- **Group B (medium)**: ${groups.groupB}
- **Group C (low)**: ${groups.groupC}

## Discovery Rotation (Surprise Loop)
Run only on cadence: **${canon.surprise.cadence || 'weekly_deep'}** with boundaries from USER/CANON.

${getDiscoveryDescription(canon.surprise.appetite || 'medium', canon.surprise.cadence || 'weekly_deep')}

Rule: propose, do not execute irreversible actions without approval.

## Cheap Checks First (Trigger Ladder)
1. metadata/filters/regex (cheap)
2. targeted fetch (medium)
3. LLM synthesis (expensive) only if signal exists

## Silent Protocol
If (no triggers) AND (no actions queued) AND (no upgrade notice): output \`HEARTBEAT_OK\`.

## Interfaces
- Must respect USER stop words and approval threshold.
- Must align with CANON "autonomy" and "surprise".

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

- **Gruppe A (hoch)**: ${groups.groupA}
- **Gruppe B (mittel)**: ${groups.groupB}
- **Gruppe C (niedrig)**: ${groups.groupC}

## Discovery Rotation (Surprise Loop)
Nur auf Kadenz ausführen: **${canon.surprise.cadence || 'weekly_deep'}** mit Grenzen aus USER/CANON.

${getDiscoveryDescriptionGerman(canon.surprise.appetite || 'medium', canon.surprise.cadence || 'weekly_deep')}

Regel: Vorschlagen, keine irreversiblen Aktionen ohne Freigabe ausführen.

## Cheap Checks First (Trigger-Leiter)
1. Metadaten/Filter/Regex (günstig)
2. Zielgerichteter Fetch (mittel)
3. LLM-Synthese (teuer) nur wenn Signal vorhanden

## Silent Protocol (Schweige-Protokoll)
Falls (keine Trigger) UND (keine Aktionen in Warteschlange) UND (kein Upgrade-Hinweis): Output \`HEARTBEAT_OK\`.

## Interfaces (Schnittstellen)
- Muss USER Stop-Wörter und Freigabe-Schwelle respektieren.
- Muss mit CANON "Autonomie" und "Surprise" übereinstimmen.

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
