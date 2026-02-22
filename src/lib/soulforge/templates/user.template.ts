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
