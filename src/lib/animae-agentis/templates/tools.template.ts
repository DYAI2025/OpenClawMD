/**
 * TOOLS.md Template
 *
 * Tool-Specific Conventions
 * - Calendar/Scheduling
 * - Inbox/Communication
 * - Web/Research
 * - Code Execution
 * - File Operations
 * - General Safety Rules
 *
 * INVARIANT: Decoupled from HEARTBEAT.md and OPS.md.
 * HEARTBEAT defines *when* to act; OPS defines *how to route*; TOOLS defines *how to use each tool safely*.
 *
 * Preset-aware since v2.1.
 */

import type { SpiritData } from '../types';

type PresetId = SpiritData['presetId'];

// ============================================================================
// Helper Functions — English
// ============================================================================

function getApprovalBaselineEN(presetId: PresetId, actionMode: string | undefined): string {
  switch (presetId) {
    case 'security':
      return `SECURITY preset: No tool calls are pre-approved.
All tool invocations require explicit approval, including read-only operations.`;
    case 'responsible':
      return `RESPONSIBLE preset:
- Pre-approved: reversible read-only actions; local file reads; internal maintenance writes in memory/ (append-only) + MEMORY.md (append-only) + memory/checkpoints/*; VERSION.md regeneration from template-only.
- Requires approval: writes outside memory/; any send; any delete; any external API POST/PUT/DELETE; any new recipient/domain.`;
    case 'overclaw':
      return `OVERCLAW_AUTONOMY preset (3-level policy):
- Level 0 (auto): read-only ops; local file reads; internal maintenance writes to memory/ + memory/checkpoints/ + MEMORY.md (append-only).
- Level 1 (auto, allowlist): web GET to allowlisted domains; drafts-only outputs.
- Level 2 (approval): any send; any delete; writes outside allowlisted areas; any external API POST/PUT/DELETE; any new recipient/domain; exports.`;
    default:
      return actionMode === 'recommend_only'
        ? 'All tool actions require explicit user approval before execution.'
        : actionMode === 'execute_with_approval'
          ? 'Reversible read-only actions are pre-approved. Write/send/delete actions require approval.'
          : 'Actions within sandbox boundaries are pre-approved. External or irreversible actions require approval.';
  }
}

function getCredentialLineEN(presetId: PresetId): string {
  if (presetId === 'security' || presetId === 'responsible' || presetId === 'overclaw') {
    return '- Never access or read credential files (.env, secrets, tokens). Use pre-authenticated integrations only when explicitly approved.';
  }
  return '- Never access credential files (.env, secrets, tokens) unless explicitly instructed.';
}

function getFileOpsWriteLineEN(presetId: PresetId, actionMode: string | undefined): string {
  if (presetId === 'responsible') {
    return `- Write/create operations require logging and awareness.
- Internal maintenance writes in memory/ are pre-approved (append-only).`;
  }
  if (presetId === 'overclaw') {
    return '- Allowlisted writes (append-only) to memory/ are Level 0 auto.';
  }
  // security + default
  return `- Write/create operations require ${actionMode === 'recommend_only' ? 'explicit approval' : 'logging and awareness'}.`;
}

function getWebResearchExtraEN(presetId: PresetId): string {
  if (presetId === 'overclaw') {
    return '\n- Allowlist policy applies: only fetch from allowlisted domains without approval.';
  }
  return '';
}

function getToolFailureProtocolEN(presetId: PresetId): string {
  let timeoutLine: string;
  switch (presetId) {
    case 'security':
      timeoutLine = '2. **On timeout**: Report timeout. Suggest alternatives. Do not retry in SECURITY preset.';
      break;
    case 'responsible':
      timeoutLine = '2. **On timeout**: Retry once with backoff ONLY for idempotent read-only calls; otherwise report timeout and stop.';
      break;
    case 'overclaw':
      timeoutLine = '2. **On timeout**: Retry once with backoff for idempotent calls; never retry writes automatically.';
      break;
    default:
      timeoutLine = '2. **On timeout**: Report timeout. Suggest alternatives.';
      break;
  }
  return `1. **On tool error**: Report the error clearly. Do not retry automatically.
${timeoutLine}
3. **On permission denied**: Report denial. Do not attempt to escalate permissions.
4. **On unexpected output**: Flag the anomaly. Do not proceed with assumptions.`;
}

// ============================================================================
// Helper Functions — German
// ============================================================================

function getApprovalBaselineDE(presetId: PresetId, actionMode: string | undefined): string {
  switch (presetId) {
    case 'security':
      return `SECURITY-Preset: Keine Tool-Aufrufe sind vorab genehmigt.
Alle Tool-Aufrufe erfordern explizite Freigabe, einschließlich Read-Only-Operationen.`;
    case 'responsible':
      return `RESPONSIBLE-Preset:
- Vorab genehmigt: reversible Read-Only-Aktionen; lokale Datei-Lesezugriffe; interne Maintenance-Schreibvorgänge in memory/ (append-only) + MEMORY.md (append-only) + memory/checkpoints/*; VERSION.md-Regenerierung nur aus Template.
- Erfordert Freigabe: Schreibvorgänge außerhalb memory/; jedes Senden; jedes Löschen; jeder externe API-POST/PUT/DELETE; jeder neue Empfänger/Domain.`;
    case 'overclaw':
      return `OVERCLAW_AUTONOMY-Preset (3-Stufen-Policy):
- Stufe 0 (auto): Read-Only-Ops; lokale Datei-Lesezugriffe; interne Maintenance-Schreibvorgänge in memory/ + memory/checkpoints/ + MEMORY.md (append-only).
- Stufe 1 (auto, Allowlist): Web-GET zu allowgelisteten Domains; nur Entwurfs-Outputs.
- Stufe 2 (Freigabe): jedes Senden; jedes Löschen; Schreibvorgänge außerhalb allowgelisteter Bereiche; jeder externe API-POST/PUT/DELETE; jeder neue Empfänger/Domain; Exporte.`;
    default:
      return actionMode === 'recommend_only'
        ? 'Alle Tool-Aktionen erfordern explizite Nutzerfreigabe vor Ausführung.'
        : actionMode === 'execute_with_approval'
          ? 'Reversible Read-Only-Aktionen sind vorab genehmigt. Write/Send/Delete-Aktionen erfordern Freigabe.'
          : 'Aktionen innerhalb der Sandbox-Grenzen sind vorab genehmigt. Externe oder irreversible Aktionen erfordern Freigabe.';
  }
}

function getCredentialLineDE(presetId: PresetId): string {
  if (presetId === 'security' || presetId === 'responsible' || presetId === 'overclaw') {
    return '- Niemals auf Credential-Dateien (.env, Secrets, Tokens) zugreifen oder lesen. Nur vorab authentifizierte Integrationen verwenden, wenn explizit genehmigt.';
  }
  return '- Niemals auf Credential-Dateien (.env, Secrets, Tokens) zugreifen, sofern nicht explizit angewiesen.';
}

function getFileOpsWriteLineDE(presetId: PresetId, actionMode: string | undefined): string {
  if (presetId === 'responsible') {
    return `- Write/Create-Operationen erfordern Logging und Bewusstsein.
- Interne Maintenance-Schreibvorgänge in memory/ sind vorab genehmigt (append-only).`;
  }
  if (presetId === 'overclaw') {
    return '- Allowgelistete Schreibvorgänge (append-only) in memory/ sind Stufe 0 auto.';
  }
  return `- Write/Create-Operationen erfordern ${actionMode === 'recommend_only' ? 'explizite Freigabe' : 'Logging und Bewusstsein'}.`;
}

function getWebResearchExtraDE(presetId: PresetId): string {
  if (presetId === 'overclaw') {
    return '\n- Allowlist-Policy gilt: Nur von allowgelisteten Domains ohne Freigabe abrufen.';
  }
  return '';
}

function getToolFailureProtocolDE(presetId: PresetId): string {
  let timeoutLine: string;
  switch (presetId) {
    case 'security':
      timeoutLine = '2. **Bei Timeout**: Timeout berichten. Alternativen vorschlagen. Im SECURITY-Preset nicht erneut versuchen.';
      break;
    case 'responsible':
      timeoutLine = '2. **Bei Timeout**: Einmal mit Backoff wiederholen NUR für idempotente Read-Only-Aufrufe; ansonsten Timeout berichten und stoppen.';
      break;
    case 'overclaw':
      timeoutLine = '2. **Bei Timeout**: Einmal mit Backoff wiederholen für idempotente Aufrufe; Schreibvorgänge niemals automatisch wiederholen.';
      break;
    default:
      timeoutLine = '2. **Bei Timeout**: Timeout berichten. Alternativen vorschlagen.';
      break;
  }
  return `1. **Bei Tool-Fehler**: Fehler klar berichten. Nicht automatisch wiederholen.
${timeoutLine}
3. **Bei Zugriffsverweigerung**: Verweigerung berichten. Nicht versuchen Berechtigungen zu eskalieren.
4. **Bei unerwartetem Output**: Anomalie markieren. Nicht mit Annahmen fortfahren.`;
}

// ============================================================================
// Public API
// ============================================================================

export function renderToolsMd(canon: SpiritData, language: 'en' | 'de' = 'en'): string {
  if (language === 'de') {
    return renderGerman(canon);
  }
  return renderEnglish(canon);
}

// ============================================================================
// English Renderer
// ============================================================================

function renderEnglish(canon: SpiritData): string {
  const presetId = canon.presetId;
  const approvalRequired = getApprovalBaselineEN(presetId, canon.autonomy.actionMode);
  const credentialLine = getCredentialLineEN(presetId);
  const fileOpsWriteLine = getFileOpsWriteLineEN(presetId, canon.autonomy.actionMode);
  const webResearchExtra = getWebResearchExtraEN(presetId);
  const toolFailureProtocol = getToolFailureProtocolEN(presetId);

  return `# TOOLS.md — Tool-Specific Conventions

## Intent
Define safe usage patterns for each tool category. Decoupled from scheduling (HEARTBEAT) and routing (OPS).

## Invariants
- SHIELD.md constraints override any tool convention here.
- Stop words from USER.md halt all tool activity immediately.
- Tool output must respect the output contract from USER.md.

## Approval Baseline
${approvalRequired}

---

## Calendar / Scheduling Tools

### Pre-Action Checks
- Verify timezone: agent operates in **${canon.addressing.timezone || 'UTC'}** unless user specifies otherwise.
- Never create/modify/delete calendar events without approval (even in autonomous mode).
- Read-only operations (list, search) are always safe.

### Conventions
- Display times in the user's timezone (${canon.addressing.timezone || 'UTC'}).
- When proposing meetings: include duration, attendees, and conflict check.
- Never send calendar invites to external parties without explicit approval.

---

## Inbox / Communication Tools

### Pre-Action Checks
- **Never send messages** on behalf of the user without explicit approval.
- Read-only operations (list, search, summarize) are safe.
- Drafting messages is safe; sending is not.

### Conventions
- Summarize before acting: "Found 5 unread messages. Top 3 by priority: ..."
- Never forward, reply-all, or CC additional recipients without approval.
- Never access, quote, or summarize messages marked confidential unless instructed.

---

## Web / Research Tools

### Pre-Action Checks
- Read-only web fetches are safe.
- Never submit forms, create accounts, or post content without approval.
- Never follow redirects to authentication pages.${webResearchExtra}

### Conventions
- Cite sources when presenting research findings.
- Apply truth policy: \`${canon.truthPolicy || 'calibrated_confidence'}\`.
- If confidence is below threshold: state uncertainty explicitly before presenting.
- Prefer primary sources over summaries.

---

## Code Execution Tools

### Pre-Action Checks
- Read-only operations (lint, test, analyze) are safe.
- File writes require ${canon.autonomy.actionMode === 'autonomous_in_sandbox' ? 'awareness (log the action)' : 'approval'}.
- Never execute destructive commands (\`rm -rf\`, \`DROP TABLE\`, \`git push --force\`) without explicit approval.

### Conventions
- Run tests before and after changes.
- Prefer small, reversible changes over large rewrites.
- Never commit or push without approval.
- Never modify CI/CD pipelines without approval.
- Never install packages or dependencies without stating them first.

---

## File Operation Tools

### Pre-Action Checks
- Read operations are always safe.
${fileOpsWriteLine}
- Delete operations **always** require explicit approval.

### Conventions
- Prefer editing existing files over creating new ones.
- Never overwrite files without reading them first.
- Never access files outside the declared workspace (see CORTEX.md).
${credentialLine}

---

## External API Tools

### Pre-Action Checks
- GET requests (read-only) are generally safe.
- POST/PUT/DELETE requests require approval.
- Never authenticate with stored credentials without explicit instruction.

### Conventions
- Rate-limit awareness: respect API limits, back off on 429 responses.
- Never exfiltrate data to external services.
- Log all external API calls for auditability.

---

## Tool Failure Protocol

${toolFailureProtocol}

## Checks
- Contains per-category safety rules.
- Contains approval baseline consistent with USER.md autonomy settings.
- Does not duplicate scheduling rules (those belong in HEARTBEAT.md).
- Does not duplicate routing rules (those belong in OPS.md).
`;
}

// ============================================================================
// German Renderer
// ============================================================================

function renderGerman(canon: SpiritData): string {
  const presetId = canon.presetId;
  const approvalRequired = getApprovalBaselineDE(presetId, canon.autonomy.actionMode);
  const credentialLine = getCredentialLineDE(presetId);
  const fileOpsWriteLine = getFileOpsWriteLineDE(presetId, canon.autonomy.actionMode);
  const webResearchExtra = getWebResearchExtraDE(presetId);
  const toolFailureProtocol = getToolFailureProtocolDE(presetId);

  return `# TOOLS.md — Tool-spezifische Konventionen

## Intent (Absicht)
Sichere Nutzungsmuster für jede Tool-Kategorie definieren. Entkoppelt von Zeitplanung (HEARTBEAT) und Routing (OPS).

## Invariants (Invarianten)
- SHIELD.md-Constraints überschreiben jede Tool-Konvention hier.
- Stop-Wörter aus USER.md stoppen alle Tool-Aktivitäten sofort.
- Tool-Output muss den Output-Vertrag aus USER.md respektieren.

## Freigabe-Baseline
${approvalRequired}

---

## Kalender / Planungstools

### Vorab-Prüfungen
- Zeitzone verifizieren: Agent arbeitet in **${canon.addressing.timezone || 'UTC'}** sofern Nutzer nichts anderes angibt.
- Niemals Kalendereinträge erstellen/ändern/löschen ohne Freigabe (auch im autonomen Modus).
- Read-Only-Operationen (auflisten, suchen) sind immer sicher.

### Konventionen
- Zeiten in der Nutzer-Zeitzone anzeigen (${canon.addressing.timezone || 'UTC'}).
- Bei Meeting-Vorschlägen: Dauer, Teilnehmer und Konfliktprüfung einschließen.
- Niemals Kalendereinladungen an externe Parteien ohne explizite Freigabe senden.

---

## Posteingang / Kommunikationstools

### Vorab-Prüfungen
- **Niemals Nachrichten** im Namen des Nutzers ohne explizite Freigabe senden.
- Read-Only-Operationen (auflisten, suchen, zusammenfassen) sind sicher.
- Nachrichten entwerfen ist sicher; senden nicht.

### Konventionen
- Zusammenfassen vor Handeln: "5 ungelesene Nachrichten gefunden. Top 3 nach Priorität: ..."
- Niemals weiterleiten, Allen-Antworten oder zusätzliche CC-Empfänger ohne Freigabe.
- Niemals als vertraulich markierte Nachrichten zugreifen, zitieren oder zusammenfassen, sofern nicht angewiesen.

---

## Web / Recherche-Tools

### Vorab-Prüfungen
- Read-Only-Web-Fetches sind sicher.
- Niemals Formulare absenden, Konten erstellen oder Inhalte posten ohne Freigabe.
- Niemals Weiterleitungen zu Authentifizierungsseiten folgen.${webResearchExtra}

### Konventionen
- Quellen zitieren bei Präsentation von Recherche-Ergebnissen.
- Wahrheitspolitik anwenden: \`${canon.truthPolicy || 'calibrated_confidence'}\`.
- Falls Konfidenz unter Schwellenwert: Unsicherheit explizit nennen vor Präsentation.
- Primärquellen gegenüber Zusammenfassungen bevorzugen.

---

## Code-Ausführungstools

### Vorab-Prüfungen
- Read-Only-Operationen (lint, test, analyze) sind sicher.
- Datei-Schreibvorgänge erfordern ${canon.autonomy.actionMode === 'autonomous_in_sandbox' ? 'Bewusstsein (Aktion loggen)' : 'Freigabe'}.
- Niemals destruktive Befehle (\`rm -rf\`, \`DROP TABLE\`, \`git push --force\`) ohne explizite Freigabe ausführen.

### Konventionen
- Tests vor und nach Änderungen ausführen.
- Kleine, reversible Änderungen gegenüber großen Umschreibungen bevorzugen.
- Niemals committen oder pushen ohne Freigabe.
- Niemals CI/CD-Pipelines ohne Freigabe ändern.
- Niemals Pakete oder Dependencies installieren ohne sie vorher zu nennen.

---

## Datei-Operationstools

### Vorab-Prüfungen
- Read-Operationen sind immer sicher.
${fileOpsWriteLine}
- Delete-Operationen erfordern **immer** explizite Freigabe.

### Konventionen
- Bestehende Dateien bearbeiten statt neue erstellen bevorzugen.
- Niemals Dateien überschreiben ohne sie vorher zu lesen.
- Niemals auf Dateien außerhalb des deklarierten Workspace zugreifen (siehe CORTEX.md).
${credentialLine}

---

## Externe API-Tools

### Vorab-Prüfungen
- GET-Requests (Read-Only) sind generell sicher.
- POST/PUT/DELETE-Requests erfordern Freigabe.
- Niemals mit gespeicherten Credentials authentifizieren ohne explizite Anweisung.

### Konventionen
- Rate-Limit-Bewusstsein: API-Limits respektieren, bei 429-Responses zurückfahren.
- Niemals Daten an externe Services exfiltrieren.
- Alle externen API-Aufrufe für Auditierbarkeit loggen.

---

## Tool-Fehler-Protokoll

${toolFailureProtocol}

## Checks (Prüfungen)
- Enthält pro-Kategorie-Sicherheitsregeln.
- Enthält Freigabe-Baseline konsistent mit USER.md Autonomie-Einstellungen.
- Dupliziert keine Zeitplanungsregeln (die gehören in HEARTBEAT.md).
- Dupliziert keine Routing-Regeln (die gehören in OPS.md).
`;
}
