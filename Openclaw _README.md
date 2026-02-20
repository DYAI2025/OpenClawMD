# Openclaw – Governance Config Pack (README)

**Autonomy level:** {{AUTONOMY_LEVEL}}  
**Generated:** {{DATE}}  
**Openclaw version:** {{OPENCLAW_VERSION}}

## DE – Bitte zuerst lesen

### Was ist das?

Dieser Download enthält **Konfigurationsdateien (Markdown)** für autonome KI-Agenten.  
Openclaw ist **nur ein Generator**: Openclaw betreibt keinen Agenten und führt keine Aktionen
in deinem Namen aus.

### Enthaltene Dateien

- **SOUL.md** – Ethische Grenzen / Constitution
- **IDENTITY.md** – Identität und Rolle des Agenten
- **USER.md** – Operative Regeln „Nutzer ↔ Agent“
- **HEARTBEAT.md** – Monitoring- und Intervall-Logik
- **SHIELD.md** – Sicherheits- und Schutzmechanismen

### Wichtiger Hinweis (keine Validierung)

Openclaw **validiert** diese Konfiguration nicht gegen dein konkretes System.  
Die Dateien sind **Vorlagen**. Du musst sie vor Einsatz **prüfen, testen und überwachen**.

**Du bist allein verantwortlich für:**

- Integration in dein Agenten-/Automationssystem
- Monitoring, Zugriffskontrollen, Freigaben, Fail-safes
- Externe Kommunikation und alle daraus entstehenden Folgen

### Quick Start

1. **Dateien lesen** (insb. USER.md und SHIELD.md).
2. Scope/No-go-Aktionen prüfen (was darf nie passieren?).
3. In dein Agentensystem einbinden.
4. Erst in **Testumgebung** laufen lassen.
5. Monitoring + Notfall-Stop (Kill-Switch) aktivieren.
6. Erst dann produktiv schalten.

### Overclaw: Hochrisiko-Hinweis (falls aktiviert)

Bei **Overclaw** kann dein Agent (je nach Scope) **ohne Vorabfreigabe** Initiativen ergreifen und
**extern kommunizieren**. Fehlkonfigurationen können Reputations-, Vertrags- oder Vermögensschäden
verursachen. Nutze Overclaw nur mit engem Scope, Monitoring und Notfall-Stop.

### Empfohlene Schutzmaßnahmen (max. 6 Punkte)

#### Security Preset

1. Nur **read-only** Zugriffe, keine Schreib-/Adminrechte.
2. Externe Kommunikation **deaktiviert** oder nur manuell freigegeben.
3. Strikte **Allowlist** für Tools/Actions (minimale Fläche).
4. Logging: Inputs/Outputs + Tool-Aufrufe vollständig protokollieren.
5. Timeouts/Rate-Limits gegen Endlosschleifen.
6. Notfall-Stop (Kill-Switch) verfügbar und getestet.

#### Open Preset

1. Scope schriftlich definieren: Ziele, Grenzen, **No-go-Aktionen**.
2. Externe Kommunikation nur für definierte Kanäle + Empfänger/Domain-Allowlist.
3. Eskalation: Unklare/irreversible Aktionen → **menschliche Freigabe**.
4. Rollback/Undo wo möglich (z. B. Draft statt Publish).
5. Monitoring: Alerts bei externen Calls, ungewöhnlichen Aktionen, Kosten-Spikes.
6. Secrets/Keys minimal, rotierbar, getrennt nach Umgebungen.

#### Overclaw Preset

1. **Sehr enger Scope** + harte Grenzen (never-do list).
2. Externe Kommunikation nur mit Channel-Allowlist + Inhalts-/Empfänger-Checks.
3. Two-step für riskante Aktionen: Draft → Review → Send/Execute.
4. Kontingente: Budget-/Rate-Caps, Tageslimits, Kommunikationslimits.
5. Echtzeit-Observability: Live-Logs, Alerts, Audit-Trail; regelmäßige Reviews.
6. Notfall-Stop + automatische Safe-Mode-Eskalation bei Anomalien.

### Support / Feedback

- Website: {{WEBSITE_URL}}
- Kontakt: {{CONTACT_EMAIL}}
- Sicherheitsmeldungen: {{SECURITY_EMAIL}}

---

## EN – Please read first

### What is this?

This download contains **Markdown configuration files** for autonomous AI agents.  
Openclaw is **a generator only**: it does not operate any agent and does not take actions
on your behalf.

### Included files

- **SOUL.md** – Ethical boundaries / constitution
- **IDENTITY.md** – Agent identity and role
- **USER.md** – Operational rules “User ↔ Agent”
- **HEARTBEAT.md** – Monitoring and interval logic
- **SHIELD.md** – Safety and protection mechanisms

### Important notice (no validation)

Openclaw does **not validate** this configuration against your specific system.  
These files are **templates**. You must **review, test, and monitor** before use.

**You are solely responsible for:**

- integrating into your agent/automation system
- monitoring, access controls, approvals, and fail-safes
- any external communications and consequences

### Quick Start

1. **Read the files** (especially USER.md and SHIELD.md).
2. Review scope/no-go actions (what must never happen?).
3. Integrate into your agent system.
4. Run in a **test environment** first.
5. Enable monitoring + emergency stop (kill switch).
6. Only then deploy to production.

### Overclaw: High-risk notice (if enabled)

With **Overclaw**, your agent may (depending on scope) take initiative **without prior approval**
and **communicate externally**. Misconfiguration can cause reputational, contractual, or financial harm.
Use Overclaw only with tight scope, monitoring, and an emergency stop.

### Recommended safeguards (max 6)

#### Security preset

1. **Read-only** access only; no write/admin privileges.
2. External communication **disabled** or manual approval only.
3. Strict **allowlist** for tools/actions (minimal surface).
4. Log prompts/outputs + tool calls end-to-end.
5. Timeouts/rate limits to prevent loops.
6. Emergency stop (kill switch) available and tested.

#### Open preset

1. Define scope in writing: goals, boundaries, **no-go actions**.
2. External comms only for defined channels + recipient/domain allowlist.
3. Escalation: unclear/irreversible actions → **human approval**.
4. Rollback/undo where possible (e.g., draft mode vs publish).
5. Monitoring: alerts for external calls, unusual actions, cost spikes.
6. Keep secrets/keys minimal, rotatable, environment-separated.

#### Overclaw preset

1. **Very tight scope** + hard boundaries (never-do list).
2. External comms with channel allowlist + content/recipient checks.
3. Two-step for risky actions: draft → review → send/execute.
4. Quotas: budget/rate caps, daily limits, communication limits.
5. Real-time observability: live logs, alerts, audit trail; regular reviews.
6. Emergency stop + automatic safe-mode escalation on anomalies.

### Support / Feedback

- Website: {{WEBSITE_URL}}
- Contact: {{CONTACT_EMAIL}}
- Security reports: {{SECURITY_EMAIL}}
