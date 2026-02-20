# OPENCLAW – WEBSITE & SYSTEM REQUIREMENTS SPEC

---

# 1️⃣ Grundarchitektur der Website

## 1.1 Produktpositionierung

Openclaw ist:

A governance configuration generator for autonomous AI agents.

Openclaw ist nicht:

Ein autonomer Agent

Eine ausführende KI

Ein System mit Zugriff auf Nutzer-Infrastruktur

Openclaw generiert ausschließlich Konfigurationsdateien (.md).

---

# 2️⃣ Preset-Flow (Security / Open / Overclaw)

## 2.1 Preset-Auswahlseite

UI-Komponenten:

🔐 Security

⚖️ Open

🚀 Overclaw

🧩 Custom

Jede Option zeigt:

Autonomy Level

External Communication Status

Approval Threshold

Risk Classification (Low / Moderate / High)

---

# 3️⃣ Overclaw – High-Risk Governance Flow

Overclaw darf nicht “still” aktiviert werden.

## 3.1 Visuelle Kennzeichnung

Permanenter roter Banner:

HIGH AUTONOMY CONFIGURATION ENABLED

Risk badge: 🔥 High Operational Risk

---

## 3.2 Mandatory Risk Modal (Popup)

Beim Klick auf Overclaw:

### Modal Title:

⚠️ High Autonomy Activation Required

### Text (English, verpflichtend):

You are enabling the Overclaw profile.

This configuration allows:

Autonomous external communication

Strategic initiative without prior approval

Execution authority within defined scope

This may result in:

External communications being sent without review

Strategic or business-impacting decisions

Reputational or contractual consequences

Openclaw does not monitor, intercept, or control your deployed agent.

You assume full responsibility for all outcomes.

Checkbox (required):

[ ] I understand and accept the operational risks.

Without checkbox → cannot proceed.

---

## 3.3 Download Confirmation Step

Before final download:

Second confirmation:

I confirm that I have reviewed the generated configuration files and accept full responsibility for their deployment and effects.

Timestamp + Preset Version logged (if account system enabled).

---

# 4️⃣ Custom Preset Definition

## 4.1 Custom = Structured Autonomy Configuration

Custom means:

User selects parameters via:

Risk Tolerance Slider

Approval Threshold

External Communication Authority

Strategic Initiative Level

Heartbeat Aggressiveness

Shield Scope

Uncertainty Handling

Custom does NOT mean:

Freeform unvalidated text injection into system behavior

Optional:

Structured additional constraints via guided input

(e.g. “Add a negative constraint”)

---

# 5️⃣ MD File Offering Logic

## 5.1 Presets (Security / Open / Overclaw)

Pre-validated

Versioned

Static base architecture

Downloadable instantly

No API call required.

---

## 5.2 Custom Configuration

Flow:

User selections → JSON → Generation Service

Now critical part:

---

# 6️⃣ API Invocation Strategy

## 6.1 When API is NOT called

If:

User selects pure preset

No structural modifications

No freeform constraint text

→ Deliver static version.

---

## 6.2 When API IS called

API call required if:

Custom preset selected

User modifies structural dimensions

User adds custom constraints

User modifies role/title dynamically

User changes uncertainty handling logic

User adds additional Shield categories

Flow:

Frontend → Generate structured JSON

→ Backend `/generate` endpoint

→ LLM synthesis layer

→ Validation layer

→ Output 5 MD files

→ Return ZIP

---

## 6.3 Mandatory Validation Layer

Before returning MD files:

Automated validation checks:

SOUL contains ≥5 negative constraints

No operational content inside IDENTITY

No persona content inside SHIELD

HEARTBEAT contains:

Silent Protocol

Rotation groups A/B/C

Cheap checks first

Compaction rule

SHIELD contains:

Destructive blocklist

Credential blocklist

Exfiltration blocklist

Default policy

If validation fails:

→ Auto-repair pass

→ If still fails → deterministic fallback renderer

User must never receive invalid structure.

---

# 7️⃣ Banner & Legal Visibility Requirements

### Permanent Footer Link:

Terms of Service

Privacy Policy

Risk Policy

### Contextual Risk Banners:

ContextBanner

Overclaw selectionRed persistent banner

Custom High RiskOrange warning bar

External communication enabledWarning icon next to setting

Download pageResponsibility confirmation

---

# 8️⃣ Logging Requirements (If Account System Enabled)

For Overclaw:

Timestamp

Preset version

Risk level

Confirmation checkbox status

IP (optional, jurisdiction dependent)

This protects you legally.

---

# 9️⃣ Fine-Tuning Question

Now the strategic part.

You asked:

Would it make sense to fine-tune an OpenAI model specifically for agentic MD-structure knowledge?

Short answer:

Not yet.

Long answer:

Fine-tuning helps when:

You need domain-specific vocabulary

You need style consistency

You need subtle reasoning patterns

But in your case:

You need:

Structural correctness

Deterministic architecture

Separation-of-concern purity

Strict validation

That is better solved by:

Template system

Validation gates

Controlled prompting

Possibly system-level structured output constraints

Fine-tuning won’t solve structural violations.

It might:

Drift

Become harder to control

Introduce regression risk

---

# When Fine-Tuning WOULD make sense

Later, if:

You collect 500+ high-quality agent configs

You want Overclaw-level strategic tone to feel unique

You want linguistic excellence across thousands of generations

Then maybe.

But for v1–v2:

Better approach:

Use strong system prompts

Use structured JSON output

Use post-validation

Keep deterministic fallback

That will be safer and more controllable.

---

# Final Strategic Recommendation

Architecture:

Preset (static)

Custom (LLM + validation + fallback)

Overclaw (account + double confirmation + logging)

No fine-tuning initially.

High-quality prompt engineering + validators instead.

---
