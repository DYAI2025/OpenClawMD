## 1) „No endorsement / No validation“-Hinweis im Download-Bereich

### DE (kurz, UI-ready)

**Titel (optional):** Wichtiger Hinweis

**Text:**

Openclaw **prüft oder validiert** deine Konfiguration nicht gegen dein konkretes System.

Die Dateien sind **Vorlagen** und müssen vor Einsatz von dir geprüft, getestet und überwacht werden.

**Optional (kleiner Zusatz für Overclaw-Downloads):**

Bei Overclaw können Fehlkonfigurationen zu **externer Kommunikation** und **Schäden** führen. Nutze Overclaw nur mit Monitoring und Notfall-Stop.

### EN (short, UI-ready)

**Optional title:** Important notice

**Text:**

Openclaw does **not validate** your configuration against your specific system.

The files are **templates** and must be reviewed, tested, and monitored by you before use.

**Optional (for Overclaw downloads):**

With Overclaw, misconfiguration may lead to **external communications** and **harm**. Use only with monitoring and an emergency stop.

---

## 2) „Recommended safeguards“-Liste je Preset (max. 6 Punkte)

Ziel: kurz, nicht überfrachtet, aber klar. Kann als „Recommended safeguards“ im UI oder in einer README erscheinen.

### Security Preset

**DE**

Nur **read-only** Zugriffe, keine Schreib-/Adminrechte.

Externe Kommunikation **deaktiviert** oder nur manuell freigegeben.

Strikte **Allowlist** für Tools/Actions (minimale Fläche).

Logging: Eingaben/Outputs + Tool-Aufrufe vollständig protokollieren.

Timeouts/Rate-Limits, um Endlosschleifen zu verhindern.

Notfall-Stop (Kill-Switch) verfügbar und getestet.

**EN**

**Read-only** access only; no write/admin privileges.

External communication **disabled** or manual approval only.

Strict **allowlist** for tools/actions (minimal surface).

Log all prompts/outputs + tool calls end-to-end.

Timeouts/rate limits to prevent loops.

Emergency stop (kill switch) available and tested.

---

### Open Preset

**DE**

Scope schriftlich definieren: Ziele, Grenzen, **No-go-Aktionen**.

Externe Kommunikation nur für definierte Kanäle + Domain/Empfänger-Allowlist.

Eskalation: Unklare/irreversible Aktionen → **menschliche Freigabe**.

Rollback/Undo wo möglich (z. B. Draft-Modus statt Publish).

Monitoring: Alerts bei externen Calls, ungewöhnlichen Aktionen, Kosten-Spikes.

Secrets/Keys minimal, rotierbar, getrennt nach Umgebungen.

**EN**

Define scope in writing: goals, boundaries, **no-go actions**.

External comms only for defined channels + recipient/domain allowlist.

Escalation: unclear/irreversible actions → **human approval**.

Rollback/undo where possible (e.g., draft mode vs publish).

Monitoring: alerts for external calls, unusual actions, cost spikes.

Keep secrets/keys minimal, rotatable, environment-separated.

---

### Overclaw Preset (High autonomy)

**DE**

**Sehr enger Scope** + harte Grenzen (was nie passieren darf).

Externe Kommunikation nur mit: Channel-Allowlist + Inhalts-/Empfänger-Checks.

„Two-step“ für riskante Aktionen: Draft → Review → Send/Execute.

Kontingente: Budget-/Rate-Caps, Tageslimits, Kommunikationslimits.

Echtzeit-Observability: Live-Logs, Alerts, Audit-Trail; regelmäßige Reviews.

Notfall-Stop + automatische Safe-Mode-Eskalation bei Anomalien.

**EN**

**Very tight scope** + hard boundaries (never-do list).

External comms with channel allowlist + content/recipient checks.

Two-step for risky actions: draft → review → send/execute.

Quotas: budget/rate caps, daily limits, communication limits.

Real-time observability: live logs, alerts, audit trail; regular reviews.

Emergency stop + automatic safe-mode escalation on anomalies.

---

## Optional: ultrakurzer Footer für jede Preset-Seite (DE/EN)

**DE:**

Empfehlung: Starte mit „Security“ oder „Open“. Nutze „Overclaw“ nur mit Monitoring und Notfall-Stop.

**EN:**

Recommendation: start with “Security” or “Open”. Use “Overclaw” only with monitoring and an emergency stop.
