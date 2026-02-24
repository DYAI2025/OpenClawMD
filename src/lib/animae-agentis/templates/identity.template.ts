/**
 * IDENTITY.md Template
 * 
 * Mask (Name, Role, Tone)
 * - Name
 * - Professional Title
 * - Tone (precision, method, directness)
 * - Optional Avatar
 * 
 * INVARIANT: No process rules, no tool instructions, no scheduling, no format mandates
 */

import type { SpiritData } from '../types';

export function renderIdentityMd(canon: SpiritData, language: 'en' | 'de' = 'en'): string {
  const tonePrecision = getToneLabel(canon.tone.precision || 'minimalist', 'precision', language);
  const toneMethod = getToneLabel(canon.tone.method || 'socratic', 'method', language);
  const toneDirectness = getToneLabel(canon.tone.directness || 'direct', 'directness', language);

  if (language === 'de') {
    return renderGerman(canon, tonePrecision, toneMethod, toneDirectness);
  }

  return renderEnglish(canon, tonePrecision, toneMethod, toneDirectness);
}

function renderEnglish(
  canon: SpiritData,
  tonePrecision: string,
  toneMethod: string,
  toneDirectness: string
): string {
  return `# IDENTITY.md — Mask (Name, Role, Tone)

## Intent
Declare the agent's identity signals: name, professional specialization, tone.

## Invariants
- No process rules, no tool instructions, no scheduling, no format mandates.

## Name
${canon.agentName || 'Unnamed Agent'}

## Professional Title
${canon.agentTitle || 'General Assistant'}

## Tone
- **Precision**: ${tonePrecision}
- **Method**: ${toneMethod}
- **Directness**: ${toneDirectness}

## Avatar (optional)
${generateAvatarDescription(canon)}

## Interfaces
- Must match SPIRIT.md (if present).
- Must align with USER.md output preferences (style/verbosity), without containing them.

## Checks
- Contains no scheduling, tooling, or process-specification content.
`;
}

function renderGerman(
  canon: SpiritData,
  tonePrecision: string,
  toneMethod: string,
  toneDirectness: string
): string {
  return `# IDENTITY.md — Maske (Name, Rolle, Ton)

## Intent (Absicht)
Die Identity-Signale des Agenten deklarieren: Name, professionelle Spezialisierung, Ton.

## Invariants (Invarianten)
- Keine Prozessregeln, keine Tool-Anweisungen, keine Zeitplanung, keine Formatvorgaben.

## Name
${canon.agentName || 'Unbenannter Agent'}

## Professional Title (Professioneller Titel)
${canon.agentTitle || 'Allgemeiner Assistent'}

## Tone (Ton)
- **Precision (Präzision)**: ${tonePrecision}
- **Method (Methode)**: ${toneMethod}
- **Directness (Direktheit)**: ${toneDirectness}

## Avatar (optional)
${generateAvatarDescription(canon)}

## Interfaces (Schnittstellen)
- Muss mit SPIRIT.md übereinstimmen (falls vorhanden).
- Muss mit USER.md Output-Präferenzen (Stil/Ausführlichkeit) harmonieren, ohne sie zu enthalten.

## Checks (Prüfungen)
- Enthält keine Zeitplanungs-, Tooling- oder Prozess-Spezifikationsinhalte.
`;
}

function getToneLabel(
  value: string, 
  dimension: 'precision' | 'method' | 'directness',
  language: 'en' | 'de'
): string {
  const labels: Record<string, Record<string, Record<string, string>>> = {
    en: {
      precision: {
        minimalist: 'Minimalist — Essential information only',
        explanatory: 'Explanatory — Context and reasoning provided',
      },
      method: {
        socratic: 'Socratic — Questions to guide discovery',
        instructional: 'Instructional — Clear directions and steps',
      },
      directness: {
        direct: 'Direct — Straight to the point',
        gentle: 'Gentle — Considerate, softer approach',
      },
    },
    de: {
      precision: {
        minimalist: 'Minimalistisch — Nur wesentliche Information',
        explanatory: 'Erklärend — Kontext und Begründung',
      },
      method: {
        socratic: 'Sokratisch — Fragen zur Führung der Entdeckung',
        instructional: 'Instruktional — Klare Richtungen und Schritte',
      },
      directness: {
        direct: 'Direkt — Geradlinig zum Punkt',
        gentle: 'Sanft — Rücksichtsvoller, weicherer Ansatz',
      },
    },
  };

  return labels[language]?.[dimension]?.[value] || value;
}

function generateAvatarDescription(canon: SpiritData): string {
  // Generate a simple avatar description based on mode and domain
  const modeImages: Record<string, string> = {
    'sidekick': 'A schematic compass over a map grid',
    'chief-of-staff': 'A precise clockwork mechanism',
    'coach': 'A calm, reflective mirror surface',
  };

  return modeImages[canon.agentMode] || 'A clean, minimal geometric pattern';
}
