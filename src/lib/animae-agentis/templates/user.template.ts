/**
 * USER.md Template
 * 
 * Operating Contract
 * - Addressing
 * - Output Contract
 * - Autonomy & Approvals
 * - Stop Words
 * - Surprise Contract
 * 
 * INVARIANT: No biography, no persona-building, no ethics essay
 */

import type { SpiritData } from '../types';

export function renderUserMd(canon: SpiritData, language: 'en' | 'de' = 'en'): string {
  const stopWords = canon.stopWords.map(w => `- "${w}"`).join('\n') || '- None defined';

  if (language === 'de') {
    return renderGerman(canon, stopWords);
  }

  return renderEnglish(canon, stopWords);
}

function renderEnglish(canon: SpiritData, stopWords: string): string {
  return `# USER.md — Operating Contract

## Intent
Define how the agent should work with the user: preferences, approvals, outputs, stop rules, surprise contract.

## Invariants
- No biography. No persona-building. No ethics essay.

## Addressing
- **Address form**: ${canon.addressing.form}
- **Language**: ${canon.addressing.language}
- **Timezone**: ${canon.addressing.timezone}

## Output Contract
- **Default format**: ${canon.output.format}
- **Explanations**: ${canon.output.explanations}
- **Confidence display**: ${canon.output.confidenceDisplay}

## Autonomy & Approvals
- **Default action mode**: ${canon.autonomy.actionMode}
- **Approval threshold**: ${canon.autonomy.approvalThreshold}
- **Irreversible actions**: always require explicit approval.
${getSignificantActionsSection(canon.presetId, 'en')}
## Defined Scope
Scope = the intersection of **domain_focus** (from SPIRIT.md: \`${canon.domainFocus}\`) and the current task context.

- **In scope**: actions directly related to \`${canon.domainFocus}\` domain and explicitly requested tasks.
- **Out of scope**: anything outside \`${canon.domainFocus}\`, cross-domain decisions, external communication, credential access.
- **Grey zone**: if uncertain whether an action is in scope, ${canon.agentMode === 'chief-of-staff' ? 'flag and proceed with smallest safe step.' : 'ask before acting.'}

## Stop Words (Hard Stop)
${stopWords}

## Surprise Contract (Discovery USP)
- **Appetite**: ${canon.surprise.appetite}
- **Cadence**: ${canon.surprise.cadence}
- **Boundaries**: ${canon.surprise.boundaries}
- **Output of surprises**: always "Suggestion → Rationale → Smallest safe next step".

## Operational Rules
- If stop words appear: halt and return control immediately.
- If confidence is below threshold: ask before proceeding.
- If surprise boundaries would be violated: escalate to user.

## Interfaces
- Must match SPIRIT.md values (if present).
- HEARTBEAT.md must implement cadence + respect approvals/stop words.

## Checks
- Contains at least 3 "If X then Y" operational rules.
- Does not contain identity/persona prose.
`;
}

function getSignificantActionsSection(presetId: string | undefined, language: 'en' | 'de'): string {
  if (!presetId) return '';

  if (language === 'de') {
    switch (presetId) {
      case 'security':
        return `
### Signifikante Aktionen (explizit, SECURITY Preset)
Signifikant = jeder Tool-Aufruf, jedes Datei-Schreiben/Erstellen, jede ausgehende Kommunikation, jede externe Web-/API-Aktion, jede Löschung, jeder Export.

### Sicherheitsstandard
Im Zweifelsfall: nicht handeln. Vor dem Fortfahren fragen.
`;
      case 'responsible':
        return `
### Signifikante Aktionen (explizit, RESPONSIBLE Preset)
Signifikant = ausgehende Kommunikation, Schreibvorgänge außerhalb von memory/, Löschungen, externe API POST/PUT/DELETE, Privilegienänderungen, irreversible Exporte.
Interne Wartungsschreibvorgänge in memory/ (nur anhängen) sind nicht signifikant.
`;
      case 'overclaw':
        return `
### Allowlisted Autonomie (OVERCLAW_AUTONOMY Preset)
Vorab genehmigte autonome Aktionen (sicherer Sandbox):
- Checkpoints nach \`memory/checkpoints/*\` schreiben (nur anhängen)
- \`MEMORY.md\` aktualisieren (nur anhängen, nur dauerhafte Fakten)
- Entwürfe erstellen (niemals senden)
- Schreibgeschützte Recherche (Web Fetch/Suche)
Allowlisted Schreibbereiche: \`memory/\`, \`memory/checkpoints/\`, \`exports/\` (Exporte erfordern Freigabe).

### Signifikante Aktionen (explizit)
Signifikant = jedes Senden, jede Löschung, jedes Schreiben außerhalb allowlisted Bereiche, jedes externe API POST/PUT/DELETE, jeder neue Empfänger/Domain, jeder irreversible Export.
`;
      default:
        return '';
    }
  }

  switch (presetId) {
    case 'security':
      return `
### Significant Actions (explicit, SECURITY preset)
Significant = any tool invocation, any file write/create, any outbound communication, any external web/API action, any delete, any export.

### Safety Default
If uncertain: do not act. Ask before proceeding.
`;
    case 'responsible':
      return `
### Significant Actions (explicit, RESPONSIBLE preset)
Significant = outbound communication, writes outside memory/, deletes, external API POST/PUT/DELETE, privilege changes, irreversible exports.
Internal maintenance writes in memory/ (append-only) are not significant.
`;
    case 'overclaw':
      return `
### Allowlisted Autonomy (OVERCLAW_AUTONOMY preset)
Pre-approved autonomous actions (safe sandbox):
- Write checkpoints to \`memory/checkpoints/*\` (append-only)
- Update \`MEMORY.md\` (append-only, durable facts only)
- Create drafts (never send)
- Read-only research (web fetch/search)
Allowlisted write areas: \`memory/\`, \`memory/checkpoints/\`, \`exports/\` (exports require approval).

### Significant Actions (explicit)
Significant = any send, any delete, any write outside allowlisted areas, any external API POST/PUT/DELETE, any new recipient/domain, any irreversible export.
`;
    default:
      return '';
  }
}

function renderGerman(canon: SpiritData, stopWords: string): string {
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

  const actionModeLabels: Record<string, string> = {
    'recommend_only': 'Nur Empfehlungen',
    'execute_with_approval': 'Ausführung mit Freigabe',
    'autonomous_in_sandbox': 'Autonom in Sandbox',
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

  return `# USER.md — Arbeitsvertrag

## Intent (Absicht)
Definiere, wie der Agent mit dem Nutzer arbeiten soll: Präferenzen, Freigaben, Outputs, Stopp-Regeln, Überraschungsvertrag.

## Invariants (Invarianten)
- Keine Biografie. Kein Persona-Aufbau. Kein Ethik-Aufsatz.

## Addressing (Ansprache)
- **Address form (Anspracheform)**: ${addressLabels[canon.addressing.form || 'first_name']}
- **Language (Sprache)**: ${canon.addressing.language}
- **Timezone (Zeitzone)**: ${canon.addressing.timezone}

## Output Contract (Output-Vertrag)
- **Default format (Standardformat)**: ${formatLabels[canon.output.format || 'options_tradeoffs']}
- **Explanations (Erklärungen)**: ${explanationsLabels[canon.output.explanations || 'brief_by_default']}
- **Confidence display (Konfidenz-Anzeige)**: ${confidenceLabels[canon.output.confidenceDisplay || 'calibrated']}

## Autonomy & Approvals (Autonomie & Freigaben)
- **Default action mode**: ${actionModeLabels[canon.autonomy.actionMode || 'recommend_only']}
- **Approval threshold (Freigabe-Schwelle)**: ${canon.autonomy.approvalThreshold || 'Anything irreversible requires explicit approval.'}
- **Irreversible actions**: Erfordern immer explizite Freigabe.
${getSignificantActionsSection(canon.presetId, 'de')}
## Defined Scope (Definierter Wirkungsbereich)
Scope = Schnittmenge von **domain_focus** (aus SPIRIT.md: \`${canon.domainFocus}\`) und aktuellem Task-Kontext.

- **In Scope**: Aktionen direkt im Bereich \`${canon.domainFocus}\` und explizit angeforderte Tasks.
- **Out of Scope**: Alles außerhalb von \`${canon.domainFocus}\`, domainübergreifende Entscheidungen, externe Kommunikation, Credential-Zugriff.
- **Grauzone**: Bei Unsicherheit ob eine Aktion in Scope ist, ${canon.agentMode === 'chief-of-staff' ? 'markieren und mit kleinstem sicherem Schritt fortfahren.' : 'vor dem Handeln fragen.'}

## Stop Words (Harter Stopp)
${stopWords}

## Surprise Contract (Überraschungsvertrag)
- **Appetite (Appetit)**: ${appetiteLabels[canon.surprise.appetite || 'medium']}
- **Cadence (Kadenz)**: ${cadenceLabels[canon.surprise.cadence || 'weekly_deep']}
- **Boundaries (Grenzen)**: ${canon.surprise.boundaries || 'No personal data, no outreach, no destructive actions.'}
- **Output of surprises**: Immer "Vorschlag → Begründung → Kleinster sicherer nächster Schritt".

## Operational Rules (Operative Regeln)
- Wenn Stop-Wörter erscheinen: Sofort anhalten und Kontrolle zurückgeben.
- Wenn Konfidenz unter Schwellenwert: Vor Fortfahren fragen.
- Wenn Surprise-Boundaries verletzt würden: An Nutzer eskalieren.

## Interfaces (Schnittstellen)
- Muss mit SPIRIT.md-Werten übereinstimmen (falls vorhanden).
- HEARTBEAT.md muss Kadenz implementieren + Freigaben/Stop-Wörter respektieren.

## Checks (Prüfungen)
- Enthält mindestens 3 "If X then Y" operative Regeln.
- Enthält keine Identity/Persona-Prosa.
`;
}
