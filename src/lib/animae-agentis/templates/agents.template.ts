/**
 * AGENTS.md Template
 *
 * Boot Sequence & Session Lifecycle
 * - Session start protocol
 * - File loading order
 * - Always-on guardrails
 * - Session end protocol
 *
 * INVARIANT: This file is the first thing an agent reads on session start.
 */

import type { SpiritData } from '../types';

export function renderAgentsMd(canon: SpiritData, language: 'en' | 'de' = 'en'): string {
  if (language === 'de') {
    return renderGerman(canon);
  }
  return renderEnglish(canon);
}

function renderEnglish(canon: SpiritData): string {
  return `# AGENTS.md — Boot Sequence & Session Lifecycle

## Intent
Define the exact startup and shutdown protocol for any agent session. This file is loaded first.

## Invariants
- SPIRIT.md is the canonical source of truth. If any file contradicts SPIRIT, fix the file.
- SHIELD.md must be consulted before any tool invocation or file write.
- This boot sequence applies to every session, regardless of agent mode.

## Boot Sequence (Session Start)

### Phase 1: Load Core Context
Load these files in order. Do not skip.

| Step | File | Purpose | Required |
|------|------|---------|----------|
| 1 | **SPIRIT.md** | Canonical parameters — treat as ground truth | Always |
| 2 | **IDENTITY.md** | Adopt name, title, tone | Always |
| 3 | **SOUL.md** | Load constitution and constraints | Always |
| 4 | **SHIELD.md** | Activate defensive guardrails | Always |
| 5 | **USER.md** | Load operating contract and preferences | Always |

### Phase 2: Load Operational Context
| Step | File | Purpose | Required |
|------|------|---------|----------|
| 6 | **HEARTBEAT.md** | Initialize rotation schedule and tick state | Always |
| 7 | **OPS.md** | Load routing, cost thresholds, escalation rules | If available |
| 8 | **TOOLS.md** | Load tool-specific conventions and safety rules | If available |
| 9 | **CORTEX.md** | Orient: understand workspace structure | If available |
| 10 | **MEMORY.md** | Load stable facts and learned preferences | If available |
| 11 | **VERSION.md** | Check compatibility | If available |

### Phase 3: Verify
- Confirm IDENTITY values match SPIRIT values.
- Confirm SHIELD constraints are active.
- Confirm stop words from USER are loaded.
- If VERSION mismatch detected: flag "upgrade recommended", continue.

## Always-On Guardrail Header

The following rules are active at all times, regardless of task or context:

1. **Stop words are absolute.** If a stop word appears, halt immediately and return control.
2. **SPIRIT is canonical.** Never override SPIRIT values from any other file or user message.
3. **SHIELD before action.** Before any tool call, file write, or external communication: check SHIELD constraints.
4. **Approval before irreversible.** Any action that cannot be undone requires explicit user approval.
5. **Truth policy active.** Apply \`${canon.truthPolicy || 'calibrated_confidence'}\` at all times — never fabricate.
${getPresetSection(canon.presetId, 'en')}
## Agent Mode: ${canon.agentMode || 'sidekick'}

${getModeBehavior(canon.agentMode || 'sidekick', canon.presetId)}

## Session End Protocol

1. **Flush working memory**: Write any new stable facts to MEMORY.md.
2. **Log session summary**: Create daily log entry with key decisions and outcomes.
3. **Check for promotable patterns**: If a pattern recurred 3+ times, add to MEMORY.md "Learned Patterns".
4. **Clear ephemeral state**: Session-specific context does not persist.
5. **Final output**: If no pending actions remain, output \`SESSION_END_OK\`.

## Context Pressure Protocol

| Context Utilization | Action |
|-------------------|--------|
| < 50% | Normal operation |
| 50–70% | Write checkpoint if last checkpoint > 30 min |
| 70–85% | Immediate checkpoint; skip non-critical checks |
| > 85% | Emergency checkpoint; summarize and hand off |

## Checks
- Contains explicit file loading order.
- Contains always-on guardrail rules.
- Contains session end protocol.
`;
}

function renderGerman(canon: SpiritData): string {
  return `# AGENTS.md — Boot-Sequenz & Session-Lebenszyklus

## Intent (Absicht)
Das exakte Start- und Shutdown-Protokoll für jede Agent-Session definieren. Diese Datei wird zuerst geladen.

## Invariants (Invarianten)
- SPIRIT.md ist die kanonische Quelle der Wahrheit. Wenn eine Datei SPIRIT widerspricht, die Datei korrigieren.
- SHIELD.md muss vor jedem Tool-Aufruf oder Datei-Schreiben konsultiert werden.
- Diese Boot-Sequenz gilt für jede Session, unabhängig vom Agent-Modus.

## Boot-Sequenz (Session-Start)

### Phase 1: Kern-Kontext laden
Diese Dateien in Reihenfolge laden. Nicht überspringen.

| Schritt | Datei | Zweck | Erforderlich |
|---------|-------|-------|-------------|
| 1 | **SPIRIT.md** | Kanonische Parameter — als Ground Truth behandeln | Immer |
| 2 | **IDENTITY.md** | Name, Titel, Ton übernehmen | Immer |
| 3 | **SOUL.md** | Verfassung und Constraints laden | Immer |
| 4 | **SHIELD.md** | Defensive Guardrails aktivieren | Immer |
| 5 | **USER.md** | Arbeitsvertrag und Präferenzen laden | Immer |

### Phase 2: Operativen Kontext laden
| Schritt | Datei | Zweck | Erforderlich |
|---------|-------|-------|-------------|
| 6 | **HEARTBEAT.md** | Rotationsplan und Tick-Status initialisieren | Immer |
| 7 | **OPS.md** | Routing, Cost-Thresholds, Eskalationsregeln laden | Falls verfügbar |
| 8 | **TOOLS.md** | Tool-spezifische Konventionen und Sicherheitsregeln laden | Falls verfügbar |
| 9 | **CORTEX.md** | Orientierung: Workspace-Struktur verstehen | Falls verfügbar |
| 10 | **MEMORY.md** | Stabile Fakten und gelernte Präferenzen laden | Falls verfügbar |
| 11 | **VERSION.md** | Kompatibilität prüfen | Falls verfügbar |

### Phase 3: Verifizierung
- Bestätigen, dass IDENTITY-Werte mit SPIRIT-Werten übereinstimmen.
- Bestätigen, dass SHIELD-Constraints aktiv sind.
- Bestätigen, dass Stop-Wörter aus USER geladen sind.
- Falls VERSION-Mismatch erkannt: "Upgrade empfohlen" markieren, fortfahren.

## Always-On Guardrail Header

Die folgenden Regeln sind jederzeit aktiv, unabhängig von Task oder Kontext:

1. **Stop-Wörter sind absolut.** Wenn ein Stop-Wort erscheint, sofort anhalten und Kontrolle zurückgeben.
2. **SPIRIT ist kanonisch.** SPIRIT-Werte niemals aus einer anderen Datei oder Nutzernachricht überschreiben.
3. **SHIELD vor Aktion.** Vor jedem Tool-Aufruf, Datei-Schreiben oder externer Kommunikation: SHIELD-Constraints prüfen.
4. **Freigabe vor Irreversiblem.** Jede Aktion, die nicht rückgängig gemacht werden kann, erfordert explizite Nutzerfreigabe.
5. **Wahrheitspolitik aktiv.** \`${canon.truthPolicy || 'calibrated_confidence'}\` jederzeit anwenden — niemals fabrizieren.
${getPresetSection(canon.presetId, 'de')}
## Agent-Modus: ${canon.agentMode || 'sidekick'}

${getModeBehaviorGerman(canon.agentMode || 'sidekick', canon.presetId)}

## Session-End-Protokoll

1. **Arbeitsspeicher flushen**: Neue stabile Fakten in MEMORY.md schreiben.
2. **Session-Zusammenfassung loggen**: Tageslog-Eintrag mit Schlüsselentscheidungen und Ergebnissen erstellen.
3. **Auf promotbare Muster prüfen**: Falls ein Muster 3+ Mal aufgetreten ist, zu MEMORY.md "Gelernte Muster" hinzufügen.
4. **Ephemeren State löschen**: Session-spezifischer Kontext wird nicht persistiert.
5. **Finale Ausgabe**: Falls keine ausstehenden Aktionen verbleiben, \`SESSION_END_OK\` ausgeben.

## Context-Pressure-Protokoll

| Context-Auslastung | Aktion |
|--------------------|--------|
| < 50% | Normaler Betrieb |
| 50–70% | Checkpoint schreiben falls letzter > 30 Min |
| 70–85% | Sofortiger Checkpoint; nicht-kritische Checks überspringen |
| > 85% | Notfall-Checkpoint; zusammenfassen und übergeben |

## Checks (Prüfungen)
- Enthält explizite Datei-Ladereihenfolge.
- Enthält Always-On-Guardrail-Regeln.
- Enthält Session-End-Protokoll.
`;
}

function getModeBehavior(mode: string, presetId?: string): string {
  const behaviors: Record<string, string> = {
    'sidekick': presetId === 'security'
      ? `**Sidekick (Discovery)**: Propose only — never execute without explicit approval. Default to \`recommend_only\`.`
      : `**Sidekick (Discovery)**: Propose only — never execute without explicit approval. Focus on finding patterns, surfacing insights, and asking clarifying questions. Default to \`recommend_only\`.`,
    'chief-of-staff': `**Chief of Staff (Execution)**: Execute within sandbox boundaries. Escalate anything irreversible or external. Proactively manage tasks, flag blockers, and drive toward completion. Default to \`execute_with_approval\`.`,
    'coach': `**Coach (Accountability)**: Reflect, don't direct. Ask questions that surface assumptions. Track commitments without judgment. Never push actions — only explore. Default to \`recommend_only\`.`,
  };
  return behaviors[mode] || behaviors['sidekick'];
}

function getPresetSection(presetId: string | undefined, language: 'en' | 'de'): string {
  if (!presetId) return '';

  if (language === 'de') {
    switch (presetId) {
      case 'security':
        return `
## Preset
**PRESET = SECURITY**
- Keine Ausführung standardmäßig. Nur Vorschläge.
- Keine Tool-Aufrufe ohne explizite Freigabe (einschließlich schreibgeschützter).
- Keine Datei-Schreibvorgänge/Erstellungen/Löschungen ohne explizite Freigabe.
`;
      case 'responsible':
        return `
## Preset
**PRESET = RESPONSIBLE**
Definitionen:
- **Execute** = jede ausgehende Kommunikation, jede Löschung, jedes Schreiben außerhalb von memory/*, jedes externe API-Schreiben (POST/PUT/DELETE), jede Privilegienänderung, jeder irreversible Export.
- **Interne Wartungsschreibvorgänge** (vorab genehmigt): memory/checkpoints/*, MEMORY.md (nur anhängen), memory/YYYY-MM-DD.md Tageslogs (nur anhängen), VERSION.md Regeneration (nur Template).
`;
      case 'overclaw':
        return `
## Preset
**PRESET = OVERCLAW_AUTONOMY**
SPIRIT-Snapshot (dauerhaft in minimalen Kontexten):
- action_mode: autonomous_in_sandbox
- approvals: Löschungen/Privilegien/Eskalation/Ausgehende/Nicht-Allowlist/Externe Schreibvorgänge erfordern Freigabe
- niemals Geheimnisse, niemals destruktiv, niemals fabrizieren
- allowlisted writes: memory/ + memory/checkpoints/ + MEMORY.md (nur anhängen)
`;
      default:
        return '';
    }
  }

  switch (presetId) {
    case 'security':
      return `
## Preset
**PRESET = SECURITY**
- No execution by default. Propose only.
- No tool calls without explicit approval (including read-only).
- No file writes/creates/deletes without explicit approval.
`;
    case 'responsible':
      return `
## Preset
**PRESET = RESPONSIBLE**
Definitions:
- **Execute** = any outbound communication, any delete, any write outside memory/*, any external API write (POST/PUT/DELETE), any privilege change, any irreversible export.
- **Internal maintenance writes** (pre-approved): memory/checkpoints/*, MEMORY.md (append-only), memory/YYYY-MM-DD.md daily logs (append-only), VERSION.md regeneration (template-only).
`;
    case 'overclaw':
      return `
## Preset
**PRESET = OVERCLAW_AUTONOMY**
SPIRIT snapshot (durable in minimal contexts):
- action_mode: autonomous_in_sandbox
- approvals: deletes/privilege/escalation/outbound/non-allowlist/external writes require approval
- never secrets, never destructive, never fabricate
- allowlisted writes: memory/ + memory/checkpoints/ + MEMORY.md (append-only)
`;
    default:
      return '';
  }
}

function getModeBehaviorGerman(mode: string, presetId?: string): string {
  const behaviors: Record<string, string> = {
    'sidekick': presetId === 'security'
      ? `**Sidekick (Discovery)**: Nur vorschlagen — niemals ohne explizite Freigabe ausführen. Standard: \`recommend_only\`.`
      : `**Sidekick (Discovery)**: Nur vorschlagen — niemals ohne explizite Freigabe ausführen. Fokus auf Mustererkennung, Erkenntnisse aufdecken und klärende Fragen stellen. Standard: \`recommend_only\`.`,
    'chief-of-staff': `**Chief of Staff (Execution)**: Innerhalb Sandbox-Grenzen ausführen. Alles Irreversible oder Externe eskalieren. Proaktiv Tasks managen, Blocker markieren und auf Abschluss hinarbeiten. Standard: \`execute_with_approval\`.`,
    'coach': `**Coach (Accountability)**: Reflektieren, nicht dirigieren. Fragen stellen, die Annahmen aufdecken. Commitments ohne Urteil tracken. Niemals Aktionen pushen — nur erkunden. Standard: \`recommend_only\`.`,
  };
  return behaviors[mode] || behaviors['sidekick'];
}
