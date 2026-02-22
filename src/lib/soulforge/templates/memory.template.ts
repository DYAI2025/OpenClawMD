/**
 * MEMORY.md Template
 * 
 * Stable Facts (Small, Curated)
 * - Stable Preferences
 * - Operating Boundaries
 * - Decisions & Rationale (durable)
 * 
 * INVARIANT: Keep small. Prefer "what remains true" over "what happened".
 */

import type { SpiritData } from '../types';

export function renderMemoryMd(canon: SpiritData, language: 'en' | 'de' = 'en'): string {
  if (language === 'de') {
    return renderGerman(canon);
  }
  return renderEnglish(canon);
}

function renderEnglish(canon: SpiritData): string {
  return `# MEMORY.md — Stable Facts (Small, Curated)

## Intent
Store only durable, high-signal facts and preferences. Not a diary.

## Invariants
- Keep small.
- Prefer "what remains true" over "what happened".

## Stable Preferences

### Addressing
- **Form**: ${canon.addressing.form}
- **Language**: ${canon.addressing.language}

### Output
- **Format**: ${canon.output.format}
- **Explanations**: ${canon.output.explanations}
- **Confidence**: ${canon.output.confidenceDisplay}

### Stop Words
${canon.stopWords.map(w => `- "${w}"`).join('\n') || '- None defined'}

## Operating Boundaries

### Autonomy
- **Action mode**: ${canon.autonomy.actionMode || 'recommend_only'}
- **Approval threshold**: ${canon.autonomy.approvalThreshold || 'Anything irreversible requires explicit approval.'}

### Surprise
- **Appetite**: ${canon.surprise.appetite}
- **Cadence**: ${canon.surprise.cadence}
- **Boundaries**: ${canon.surprise.boundaries || 'No personal data, no outreach, no destructive actions.'}

### Forbidden Zones (summary)
${canon.negativeConstraints.slice(0, 3).map(c => `- ${c}`).join('\n') || '- No constraints recorded'}

## Decisions & Rationale (durable)

<!-- Add durable decisions here as they are made -->
<!-- Format: - [YYYY-MM-DD] Decision: Rationale -->

*No durable decisions recorded yet.*

## Flush Protocol

### Compaction Triggers
- Daily log exceeds 20,000 tokens → distill durable facts to this file
- Memory directory exceeds 100MB → archive oldest quarter
- Checkpoint count exceeds 10 → prune to 5 most recent

### Cache TTL
| Memory Type | TTL | Eviction |
|------------|-----|----------|
| Session context | End of session | Auto-flush |
| Task working memory | Task completion + 5 min | Auto-flush |
| Stable facts (this file) | Indefinite | Manual review |
| Daily logs | 90 days | Archive to quarterly ZIP |

### Session-to-Daily Migration
1. At session end: flush working memory, write any new stable facts here
2. At session start: check yesterday's log for promotable facts
3. Quarterly: compress daily logs older than 90 days into archive

## Learned Patterns

<!-- Add recurring patterns as they are identified -->
<!-- Format: - Pattern: When X, prefer Y -->

*No patterns recorded yet.*

## Checks
- If this exceeds 50KB: archive older/obsolete entries into memory/archive/.
- Review monthly: remove items that are no longer true or relevant.
- Before adding: ask "will this still matter in 3 months?"
`;
}

function renderGerman(canon: SpiritData): string {
  const formatLabels: Record<string, string> = {
    'result_only': 'Nur Ergebnis',
    'result_plus_plan': 'Ergebnis plus Plan',
    'options_tradeoffs': 'Optionen mit Abwägungen',
  };

  const explanationsLabels: Record<string, string> = {
    'on_request_only': 'Nur auf Anfrage',
    'brief_by_default': 'Standardmäßig kurz',
    'detailed_by_default': 'Standardmäßig detailliert',
  };

  const confidenceLabels: Record<string, string> = {
    'off': 'Aus',
    'low_med_high': 'Niedrig/Mittel/Hoch',
    'calibrated': 'Kalibriert',
  };

  const appetiteLabels: Record<string, string> = {
    'low': 'Niedrig',
    'medium': 'Mittel',
    'high': 'Hoch',
  };

  const cadenceLabels: Record<string, string> = {
    'daily_micro': 'Täglich (Micro)',
    'weekly_deep': 'Wöchentlich (Deep)',
    'trigger': 'Trigger-basiert',
  };

  const addressLabels: Record<string, string> = {
    'formal': 'Formell',
    'first_name': 'Vorname',
    'username': 'Username',
  };

  return `# MEMORY.md — Stable Facts (Klein, Kuratiert)

## Intent (Absicht)
Nur dauerhafte, hoch-signifikante Fakten und Präferenzen speichern. Kein Tagebuch.

## Invariants (Invarianten)
- Klein halten.
- Bevorzuge "was wahr bleibt" gegenüber "was passiert ist".

## Stable Preferences (Stabile Präferenzen)

### Addressing (Ansprache)
- **Form**: ${addressLabels[canon.addressing.form || 'first_name']}
- **Language**: ${canon.addressing.language}

### Output
- **Format**: ${formatLabels[canon.output.format || 'options_tradeoffs']}
- **Explanations**: ${explanationsLabels[canon.output.explanations || 'brief_by_default']}
- **Confidence**: ${confidenceLabels[canon.output.confidenceDisplay || 'calibrated']}

### Stop Words
${canon.stopWords.map(w => `- "${w}"`).join('\n') || '- Keine definiert'}

## Operating Boundaries (Betriebsgrenzen)

### Autonomy (Autonomie)
- **Action mode**: ${canon.autonomy.actionMode}
- **Approval threshold**: ${canon.autonomy.approvalThreshold}

### Surprise (Überraschung)
- **Appetite**: ${appetiteLabels[canon.surprise.appetite || 'medium']}
- **Cadence**: ${cadenceLabels[canon.surprise.cadence || 'weekly_deep']}
- **Boundaries**: ${canon.surprise.boundaries}

### Forbidden Zones (Verbotene Zonen - Zusammenfassung)
${canon.negativeConstraints.slice(0, 3).map(c => `- ${c}`).join('\n') || '- Keine Constraints aufgezeichnet'}

## Decisions & Rationale (Entscheidungen & Begründungen - dauerhaft)

<!-- Dauerhafte Entscheidungen hier hinzufügen, sobald getroffen -->
<!-- Format: - [YYYY-MM-DD] Entscheidung: Begründung -->

*Noch keine dauerhaften Entscheidungen aufgezeichnet.*

## Flush-Protokoll

### Compaction-Trigger
- Tageslog überschreitet 20.000 Tokens → dauerhafte Fakten in diese Datei verdichten
- Memory-Verzeichnis überschreitet 100MB → ältestes Quartal archivieren
- Checkpoint-Anzahl überschreitet 10 → auf 5 aktuellste kürzen

### Cache-TTL
| Speicher-Typ | TTL | Eviction |
|-------------|-----|----------|
| Session-Kontext | Session-Ende | Auto-Flush |
| Task-Arbeitsspeicher | Task-Abschluss + 5 Min | Auto-Flush |
| Stabile Fakten (diese Datei) | Unbegrenzt | Manuelles Review |
| Tageslogs | 90 Tage | Archivierung in Quartals-ZIP |

### Session-zu-Daily-Migration
1. Bei Session-Ende: Arbeitsspeicher flushen, neue stabile Fakten hier schreiben
2. Bei Session-Start: gestrigen Log auf promotbare Fakten prüfen
3. Quartalsweise: Tageslogs älter als 90 Tage in Archiv komprimieren

## Learned Patterns (Gelernte Muster)

<!-- Wiederkehrende Muster hier hinzufügen, sobald identifiziert -->
<!-- Format: - Muster: Wenn X, dann Y bevorzugen -->

*Noch keine Muster aufgezeichnet.*

## Checks (Prüfungen)
- Falls dies 50KB überschreitet: Ältere/obsolete Einträge nach memory/archive/ archivieren.
- Monatlich reviewen: Entferne Einträge, die nicht mehr wahr oder relevant sind.
- Vor dem Hinzufügen: Fragen "Wird das in 3 Monaten noch wichtig sein?"
`;
}
