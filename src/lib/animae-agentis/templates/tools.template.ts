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
 */

import type { SpiritData } from '../types';

export function renderToolsMd(canon: SpiritData, language: 'en' | 'de' = 'en'): string {
  if (language === 'de') {
    return renderGerman(canon);
  }
  return renderEnglish(canon);
}

function renderEnglish(canon: SpiritData): string {
  const approvalRequired = canon.autonomy.actionMode === 'recommend_only'
    ? 'All tool actions require explicit user approval before execution.'
    : canon.autonomy.actionMode === 'execute_with_approval'
      ? 'Reversible read-only actions are pre-approved. Write/send/delete actions require approval.'
      : 'Actions within sandbox boundaries are pre-approved. External or irreversible actions require approval.';

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
- Never follow redirects to authentication pages.

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
- Write/create operations require ${canon.autonomy.actionMode === 'recommend_only' ? 'explicit approval' : 'logging and awareness'}.
- Delete operations **always** require explicit approval.

### Conventions
- Prefer editing existing files over creating new ones.
- Never overwrite files without reading them first.
- Never access files outside the declared workspace (see CORTEX.md).
- Never access credential files (.env, secrets, tokens) unless explicitly instructed.

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

1. **On tool error**: Report the error clearly. Do not retry automatically.
2. **On timeout**: Report timeout. Suggest alternatives.
3. **On permission denied**: Report denial. Do not attempt to escalate permissions.
4. **On unexpected output**: Flag the anomaly. Do not proceed with assumptions.

## Checks
- Contains per-category safety rules.
- Contains approval baseline consistent with USER.md autonomy settings.
- Does not duplicate scheduling rules (those belong in HEARTBEAT.md).
- Does not duplicate routing rules (those belong in OPS.md).
`;
}

function renderGerman(canon: SpiritData): string {
  const approvalRequired = canon.autonomy.actionMode === 'recommend_only'
    ? 'Alle Tool-Aktionen erfordern explizite Nutzerfreigabe vor Ausführung.'
    : canon.autonomy.actionMode === 'execute_with_approval'
      ? 'Reversible Read-Only-Aktionen sind vorab genehmigt. Write/Send/Delete-Aktionen erfordern Freigabe.'
      : 'Aktionen innerhalb der Sandbox-Grenzen sind vorab genehmigt. Externe oder irreversible Aktionen erfordern Freigabe.';

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
- Niemals Weiterleitungen zu Authentifizierungsseiten folgen.

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
- Write/Create-Operationen erfordern ${canon.autonomy.actionMode === 'recommend_only' ? 'explizite Freigabe' : 'Logging und Bewusstsein'}.
- Delete-Operationen erfordern **immer** explizite Freigabe.

### Konventionen
- Bestehende Dateien bearbeiten statt neue erstellen bevorzugen.
- Niemals Dateien überschreiben ohne sie vorher zu lesen.
- Niemals auf Dateien außerhalb des deklarierten Workspace zugreifen (siehe CORTEX.md).
- Niemals auf Credential-Dateien (.env, Secrets, Tokens) zugreifen, sofern nicht explizit angewiesen.

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

1. **Bei Tool-Fehler**: Fehler klar berichten. Nicht automatisch wiederholen.
2. **Bei Timeout**: Timeout berichten. Alternativen vorschlagen.
3. **Bei Zugriffsverweigerung**: Verweigerung berichten. Nicht versuchen Berechtigungen zu eskalieren.
4. **Bei unerwartetem Output**: Anomalie markieren. Nicht mit Annahmen fortfahren.

## Checks (Prüfungen)
- Enthält pro-Kategorie-Sicherheitsregeln.
- Enthält Freigabe-Baseline konsistent mit USER.md Autonomie-Einstellungen.
- Dupliziert keine Zeitplanungsregeln (die gehören in HEARTBEAT.md).
- Dupliziert keine Routing-Regeln (die gehören in OPS.md).
`;
}
