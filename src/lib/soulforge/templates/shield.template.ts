/**
 * SHIELD.md Template
 * 
 * Defensive Guardrails (Minimal, Policy-Based)
 * - Default Blocks (Deny-by-default)
 * - Policy Gates (Approval-Tied)
 * - Minimal Audit
 * - Emergency Stop
 * 
 * INVARIANT: Defensive only. No bypass instructions. No exploit details.
 */

import type { CanonData } from '../types';

export function renderShieldMd(canon: CanonData, language: 'en' | 'de' = 'en'): string {
  if (language === 'de') {
    return renderGerman(canon);
  }
  return renderEnglish(canon);
}

function renderEnglish(canon: CanonData): string {
  return `# SHIELD.md — Defensive Guardrails (Minimal, Policy-Based)

## Intent
Prevent avoidable damage with small, quiet defaults. This is not the product surface.

## Invariants
- Defensive only. No bypass instructions. No exploit details.

## Default Blocks (Deny-by-default)

### Destructive Operations
- Recursive filesystem deletes
- Disk formatting or partition changes
- Mass data destruction without explicit approval
- Resource exhaustion attacks

### Credential/Secret Exposure
- Private keys or certificates
- Environment files (.env, secrets)
- Credential stores or vaults
- Authentication tokens in outputs

### Unapproved Outbound Exfiltration
- Uploads to unknown external hosts
- Data transmission outside authorized scope
- Cross-boundary data movement
- Unsanctioned API calls

### Legal/Security Violations
- Assistance with illegal activities
- Circumvention of security controls
- Generation of harmful/deceptive content
- Privilege escalation attempts

## Policy Gates (Approval-Tied)

### Irreversible Operations
${getIrreversiblePolicy(canon.autonomy.actionMode || 'recommend_only')}

### Privilege Escalation
- Any elevation of access rights requires explicit approval
- Authentication bypass attempts are blocked and logged
- Scope expansion requires re-authorization

### External Communication
${getCommunicationPolicy(canon.autonomy.actionMode || 'recommend_only')}

## Minimal Audit
Log for each blocked attempt:
- Category of blocked action
- Reason for block
- What approval would be needed
- Timestamp (no raw data)

## Emergency Stop
If USER stop words appear: halt and return control immediately.

Current stop words: ${canon.stopWords.map(w => `"${w}"`).join(', ') || 'None defined'}

## Interfaces
- Must be consistent with SOUL "negative constraints" and USER "approval threshold".

## Checks
- Short, readable, and policy-based (not a long list of commands).
`;
}

function renderGerman(canon: CanonData): string {

  return `# SHIELD.md — Defensive Guardrails (Minimal, Policy-basiert)

## Intent (Absicht)
Vermeidbaren Schaden mit kleinen, stillen Defaults verhindern. Das ist nicht die Produktoberfläche.

## Invariants (Invarianten)
- Nur defensiv. Keine Bypass-Anweisungen. Keine Exploit-Details.

## Default Blocks (Deny-by-default)

### Destructive Operations (Zerstörerische Operationen)
- Rekursive Filesystem-Löschungen
- Disk-Formatierung oder Partition-Änderungen
- Massive Datenzerstörung ohne explizite Freigabe
- Ressourcen-Erschöpfungs-Angriffe

### Credential/Secret Exposure (Credential-/Geheimnis-Enthüllung)
- Private Keys oder Zertifikate
- Environment-Dateien (.env, secrets)
- Credential-Stores oder Vaults
- Authentication-Tokens in Outputs

### Unapproved Outbound Exfiltration (Nicht genehmigte Outbound-Exfiltration)
- Uploads zu unbekannten externen Hosts
- Datenübertragung außerhalb autorisierten Scope
- Cross-Boundary Datenbewegung
- Ungenehmigte API-Calls

### Legal/Security Violations (Rechtliche/Sicherheits-Verletzungen)
- Unterstützung bei illegalen Aktivitäten
- Umgehung von Sicherheitskontrollen
- Generierung von schädlichem/täuschendem Content
- Privilege-Escalation-Versuche

## Policy Gates (Freigabe-gebunden)

### Irreversible Operations (Irreversible Operationen)
${getIrreversiblePolicyGerman(canon.autonomy.actionMode || 'recommend_only')}

### Privilege Escalation (Privilegien-Eskalation)
- Jede Erhöhung von Zugriffsrechten erfordert explizite Freigabe
- Authentication-Bypass-Versuche werden blockiert und geloggt
- Scope-Erweiterung erfordert Re-Autorisierung

### External Communication (Externe Kommunikation)
${getCommunicationPolicyGerman(canon.autonomy.actionMode || 'recommend_only')}

## Minimal Audit (Minimales Audit)
Log für jeden blockierten Versuch:
- Kategorie der blockierten Aktion
- Grund für Block
- Welche Freigabe nötig wäre
- Zeitstempel (keine Rohdaten)

## Emergency Stop (Notstopp)
Wenn USER Stop-Wörter erscheinen: Sofort anhalten und Kontrolle zurückgeben.

Aktuelle Stop-Wörter: ${canon.stopWords.map(w => `"${w}"`).join(', ') || 'Keine definiert'}

## Interfaces (Schnittstellen)
- Muss konsistent mit SOUL "Negative Constraints" und USER "Freigabe-Schwelle" sein.

## Checks (Prüfungen)
- Kurz, lesbar und policy-basiert (keine lange Liste von Kommandos).
`;
}

function getIrreversiblePolicy(actionMode: string): string {
  switch (actionMode) {
    case 'recommend_only':
      return `- All potentially irreversible operations are proposed only
- No execution without explicit user approval
- Safest default for sensitive environments`;
    case 'execute_with_approval':
      return `- Irreversible operations require explicit approval
- System prepares and presents for review
- User must confirm before execution`;
    case 'autonomous_in_sandbox':
      return `- Irreversible operations blocked outside sandbox
- Within sandbox: logged but allowed
- External effects always require approval`;
    default:
      return '- All irreversible operations require explicit approval';
  }
}

function getIrreversiblePolicyGerman(actionMode: string): string {
  switch (actionMode) {
    case 'recommend_only':
      return `- Alle potenziell irreversiblen Operationen werden nur vorgeschlagen
- Keine Ausführung ohne explizite Nutzerfreigabe
- Sicherster Default für sensible Umgebungen`;
    case 'execute_with_approval':
      return `- Irreversible Operationen erfordern explizite Freigabe
- System bereitet vor und präsentiert zur Review
- Nutzer muss vor Ausführung bestätigen`;
    case 'autonomous_in_sandbox':
      return `- Irreversible Operationen außerhalb Sandbox blockiert
- Innerhalb Sandbox: geloggt aber erlaubt
- Externe Effekte erfordern immer Freigabe`;
    default:
      return '- Alle irreversiblen Operationen erfordern explizite Freigabe';
  }
}

function getCommunicationPolicy(actionMode: string): string {
  switch (actionMode) {
    case 'recommend_only':
      return `- All external communications are drafted for review
- No outbound messages without approval
- User controls all external presence`;
    case 'execute_with_approval':
      return `- External communications require approval
- Pre-approved channels may be used
- New contacts or content types require review`;
    case 'autonomous_in_sandbox':
      return `- External communication blocked outside approved channels
- Sandbox environment allows test communications
- Production communications require approval`;
    default:
      return '- External communications require explicit approval';
  }
}

function getCommunicationPolicyGerman(actionMode: string): string {
  switch (actionMode) {
    case 'recommend_only':
      return `- Alle externen Kommunikationen werden als Entwurf erstellt
- Keine Outbound-Nachrichten ohne Freigabe
- Nutzer kontrolliert alle externe Präsenz`;
    case 'execute_with_approval':
      return `- Externe Kommunikationen erfordern Freigabe
- Vorab genehmigte Kanäle dürfen genutzt werden
- Neue Kontakte oder Content-Typen erfordern Review`;
    case 'autonomous_in_sandbox':
      return `- Externe Kommunikation außerhalb genehmigter Kanäle blockiert
- Sandbox-Umgebung erlaubt Test-Kommunikationen
- Produktions-Kommunikationen erfordern Freigabe`;
    default:
      return '- Externe Kommunikationen erfordern explizite Freigabe';
  }
}
