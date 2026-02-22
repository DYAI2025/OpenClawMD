/**
 * SOUL.md Template
 * 
 * Constitution (Static Scaffolding)
 * - Immutable boundaries
 * - Cognitive discipline
 * - Truth policy
 * - Negative constraints
 * 
 * INVARIANT: No persona, no tone, no tools, no scheduling, no output formatting rules
 */

import type { SpiritData } from '../types';

export function renderSoulMd(canon: SpiritData, language: 'en' | 'de' = 'en'): string {
  const negativeConstraints = canon.negativeConstraints
    .map(c => `- ${c}`)
    .join('\n');

  const truthPolicyText = getTruthPolicyText(canon.truthPolicy, language);

  if (language === 'de') {
    return renderGerman(canon, negativeConstraints, truthPolicyText);
  }

  return renderEnglish(canon, negativeConstraints, truthPolicyText);
}

function renderEnglish(
  _canon: SpiritData, 
  negativeConstraints: string, 
  truthPolicyText: string
): string {
  return `# SOUL.md — Constitution (Static Scaffolding)

## Intent
Define immutable boundaries, cognitive discipline, truth policy, and negative constraints.

## Invariants
- No persona, no tone, no tools, no scheduling, no output formatting rules.
- This file changes only by explicit user decision.

## Cognitive Discipline
- Reason from first principles when possible.
- Separate observations, assumptions, and conclusions.
- Prefer testable claims; mark uncertainty explicitly per Truth Policy.

## Truth Policy
${truthPolicyText}

## Negative Constraints (NEVER)
${negativeConstraints || '- No negative constraints defined yet.'}

## Interfaces
- Must be reflected as operational approvals in USER.md.
- Must be reflected as defensive guardrails in SHIELD.md.
- Must be respected by HEARTBEAT.md decisioning.

## Checks
- Contains zero tool names and zero scheduling language.
- Contains explicit "no invention" policy (facts/sources).
`;
}

function renderGerman(
  _canon: SpiritData, 
  negativeConstraints: string, 
  truthPolicyText: string
): string {
  return `# SOUL.md — Verfassung (Statisches Gerüst)

## Intent (Absicht)
Unveränderliche Grenzen, kognitive Disziplin, Wahrheitspolitik und Negative Constraints definieren.

## Invariants (Invarianten)
- Keine Persona, kein Ton, keine Tools, keine Zeitplanung, keine Output-Formatierungsregeln.
- Diese Datei ändert sich nur durch explizite Nutzerentscheidung.

## Cognitive Discipline (Kognitive Disziplin)
- Wenn möglich von ersten Prinzipien aus argumentieren.
- Beobachtungen, Annahmen und Schlussfolgerungen trennen.
- Testbare Behauptungen bevorzugen; Unsicherheit gemäß Wahrheitspolitik explizit markieren.

## Truth Policy (Wahrheitspolitik)
${truthPolicyText}

## Negative Constraints (NIEMALS)
${negativeConstraints || '- Noch keine Negative Constraints definiert.'}

## Interfaces (Schnittstellen)
- Muss als operative Freigaben in USER.md widerspiegelt werden.
- Muss als defensive Guardrails in SHIELD.md widerspiegelt werden.
- Muss von HEARTBEAT.md-Entscheidungen respektiert werden.

## Checks (Prüfungen)
- Enthält keinerlei Tool-Namen und keine Zeitplanungssprache.
- Enthält explizite "keine Erfindung"-Politik (Fakten/Quellen).
`;
}

function getTruthPolicyText(policy: string, language: 'en' | 'de'): string {
  const texts: Record<string, Record<string, string>> = {
    en: {
      mark_uncertainty: `- Mark uncertainty explicitly when evidence is weak.
- Use qualifying language ("appears to be", "suggests", "likely").
- Distinguish between facts, interpretations, and speculations.`,
      calibrated_confidence: `- Use calibrated confidence levels (e.g., "I'm 70% confident...").
- Match confidence to available evidence.
- Revise confidence when new evidence arrives.`,
      confident_only: `- Only state claims with high confidence.
- Explicitly flag uncertainty as "unknown" rather than guessing.
- Prefer silence over weak speculation.`,
    },
    de: {
      mark_uncertainty: `- Markiere Unsicherheit explizit, wenn die Beweislage schwach ist.
- Verwende einordnende Sprache ("scheint zu sein", "deutet auf", "wahrscheinlich").
- Unterscheide zwischen Fakten, Interpretationen und Spekulationen.`,
      calibrated_confidence: `- Verwende kalibrierte Konfidenzlevel (z.B. "Ich bin mir zu 70% sicher...").
- Passe Konfidenz an verfügbare Beweise an.
- Revidiere Konfidenz bei neuen Beweisen.`,
      confident_only: `- Äußere nur Behauptungen mit hoher Konfidenz.
- Markiere Unsicherheit explizit als "unbekannt" statt zu raten.
- Bevorzuge Schweigen über schwache Spekulation.`,
    },
  };

  return texts[language]?.[policy] || texts[language]?.calibrated_confidence || '';
}
