/**
 * Validation Rules v2.2
 *
 * All rules from the OpenClawMD validator spec:
 * OC001-003, SZ001, RT001, AP001, HB001-003, SC001-003, PP001-003, SK001, PC001
 * Plus semantic consistency, SKILL kernel rules, strict mode, evidence lines.
 *
 * New spec codes: SP-CANON-001, AP-HB-001, HB-EXT-001, RT-CONFLICT-001,
 * RT-BUDGET-001, TRUTH-DRIFT-001, STOPWORDS-DRIFT-001, CANON-REF-001,
 * SKILL-KERNEL-001, SKILL-MAINT-001, SKILL-PRESET-001, SKILL-ASSUME-001
 */

import type { SpiritData, GeneratedFile } from '../types';
import type { ValidatorFinding, PromiseClaim, CategoryId, ValidatorOptions, EvidenceLine } from './types';
import { extractPolicies, findEvidence } from './extractor';
import type { ExtractedPolicies } from './extractor';

// ============================================================================
// Constants
// ============================================================================

const BOOTSTRAP_MAX_CHARS = 12_000;

const BOOTSTRAP_REQUIRED = new Set([
  'SOUL.md', 'IDENTITY.md', 'USER.md', 'HEARTBEAT.md', 'SHIELD.md',
]);

/** Codes promoted from WARN to ERROR in strict mode */
const STRICT_PROMOTIONS = new Set([
  'OC001', 'TRUTH-DRIFT-001', 'STOPWORDS-DRIFT-001', 'HB-EXT-001', 'SKILL-MAINT-001',
]);

/** Mapping from internal codes to spec-level aliases */
export const CODE_ALIASES: Record<string, string> = {
  'OC001': 'SP-CANON-001',
  'AP001': 'AP-HB-001',
  'RT001': 'RT-CONFLICT-001',
};

// ============================================================================
// Helpers
// ============================================================================

function has(text: string, phrase: string): boolean {
  return text.toLowerCase().includes(phrase.toLowerCase());
}

function getFile(files: GeneratedFile[], name: string): string {
  return files.find(f => f.name === name)?.content ?? '';
}

function makeEvidence(fileName: string, content: string, phrase: string): EvidenceLine[] {
  if (!content) return [];
  const ev = findEvidence(fileName, content, phrase);
  return ev.line > 0 ? [ev] : [];
}

// ============================================================================
// Category A: Bootstrap / Runtime Fit
// ============================================================================

export function checkBootstrapFit(
  files: GeneratedFile[],
  _canon: SpiritData,
): ValidatorFinding[] {
  const findings: ValidatorFinding[] = [];
  const names = new Set(files.map(f => f.name));

  // OC002: missing required bootstrap files
  for (const req of BOOTSTRAP_REQUIRED) {
    if (!names.has(req)) {
      findings.push({
        code: 'OC002',
        severity: 'ERROR',
        where: 'Workspace',
        what: `Missing required bootstrap file: ${req}`,
        impact: 'OpenClaw cannot initialize the agent without this file.',
        constraintType: 'broken-ref',
      });
    }
  }

  // SZ001: file size over bootstrap limit
  for (const file of files) {
    if (file.content.length > BOOTSTRAP_MAX_CHARS) {
      findings.push({
        code: 'SZ001',
        severity: 'WARN',
        where: file.name,
        what: `File is ${file.content.length} chars (limit ~${BOOTSTRAP_MAX_CHARS}).`,
        impact: 'OpenClaw may truncate this file, losing content at the end.',
        constraintType: 'size-risk',
        evidence: [{ file: file.name, line: 1, text: `${file.content.length} characters total` }],
      });
    }
  }

  // OC003: broken cross-file references
  const allContent = files.map(f => f.content).join('\n');
  const refPattern = /(?:see|refer to|defined in|per)\s+(\w+\.md)/gi;
  let match: RegExpExecArray | null;
  while ((match = refPattern.exec(allContent)) !== null) {
    const referenced = match[1];
    if (!names.has(referenced) && BOOTSTRAP_REQUIRED.has(referenced)) {
      findings.push({
        code: 'OC003',
        severity: 'WARN',
        where: 'Cross-file reference',
        what: `References ${referenced} but file is not in the workspace.`,
        impact: 'Agent may not find the referenced file at runtime.',
        constraintType: 'broken-ref',
      });
    }
  }

  // CANON-REF-001: references to CANON.md (deprecated name → should be SPIRIT.md)
  for (const file of files) {
    if (has(file.content, 'CANON.md')) {
      findings.push({
        code: 'CANON-REF-001',
        severity: 'ERROR',
        where: file.name,
        what: `References deprecated "CANON.md" — should reference SPIRIT.md instead.`,
        impact: 'Agent will fail to resolve CANON.md at runtime; data lives in SPIRIT.md.',
        constraintType: 'broken-ref',
        evidence: makeEvidence(file.name, file.content, 'CANON.md'),
      });
    }
  }

  return findings;
}

// ============================================================================
// Category B: Policy Consistency
// ============================================================================

export function checkPolicyConsistency(
  files: GeneratedFile[],
  canon: SpiritData,
  extracted: ExtractedPolicies,
): ValidatorFinding[] {
  const findings: ValidatorFinding[] = [];
  const tools = getFile(files, 'TOOLS.md');
  const ops = getFile(files, 'OPS.md');

  // RT001 / RT-CONFLICT-001: retry mismatch
  const opsQualifiedRetry = has(ops, 'retry') && has(ops, 'idempotent');
  const toolsQualifiedRetry = has(tools, 'retry') && has(tools, 'idempotent');
  const opsUnqualifiedRetry = has(ops, 'retry') && !has(ops, 'do not retry') && !has(ops, 'do **not** retry') && !has(ops, 'never retry') && !opsQualifiedRetry;
  const toolsUnqualifiedNoRetry = (has(tools, 'do not retry') || has(tools, 'do **not** retry')) && !toolsQualifiedRetry;

  if (opsUnqualifiedRetry && toolsUnqualifiedNoRetry) {
    const retryEvidence = extracted.retries
      .filter(r => r.file === 'OPS.md' || r.file === 'TOOLS.md')
      .map(r => r.evidence);
    findings.push({
      code: 'RT001',
      specCode: 'RT-CONFLICT-001',
      severity: 'ERROR',
      where: 'OPS.md + TOOLS.md',
      what: 'Retry policy conflict between OPS and TOOLS.',
      impact: 'Non-deterministic failure handling; agent may loop or silently stop.',
      constraintType: 'contradiction',
      evidence: retryEvidence.length > 0 ? retryEvidence : undefined,
    });
  }

  // RT-BUDGET-001: retry budget inconsistency
  const opsRetries = extracted.retries.filter(r => r.file === 'OPS.md');
  const toolsRetries = extracted.retries.filter(r => r.file === 'TOOLS.md');
  if (opsRetries.length > 0 && toolsRetries.length > 0) {
    const opsHasNoRetry = opsRetries.some(r => r.policy === 'no-retry');
    const toolsHasRetry = toolsRetries.some(r => r.policy === 'retry-once' || r.policy === 'retry-with-backoff');
    const toolsHasNoRetry = toolsRetries.some(r => r.policy === 'no-retry');
    const opsHasRetry = opsRetries.some(r => r.policy === 'retry-once' || r.policy === 'retry-with-backoff');

    if ((opsHasNoRetry && toolsHasRetry) || (toolsHasNoRetry && opsHasRetry)) {
      const bothQualified = opsRetries.some(r => r.policy === 'qualified-retry')
        && toolsRetries.some(r => r.policy === 'qualified-retry');
      if (!bothQualified) {
        findings.push({
          code: 'RT-BUDGET-001',
          severity: 'WARN',
          where: 'OPS.md + TOOLS.md',
          what: 'Retry handling vs retry budgets inconsistent across files.',
          impact: 'Agent may retry actions beyond budget or skip allowed retries.',
          constraintType: 'drift',
          evidence: [...opsRetries.map(r => r.evidence), ...toolsRetries.map(r => r.evidence)],
        });
      }
    }
  }

  // AP001 / AP-HB-001: write approval conflict vs automatic writes
  const user = getFile(files, 'USER.md');
  const hb = getFile(files, 'HEARTBEAT.md');
  const writeApproval = (has(tools, 'require') && has(tools, 'approval') && has(tools, 'write'))
    || (has(user, 'significant') && has(user, 'approval'));
  const autoWrite = has(hb, 'write checkpoint') || has(hb, 'create checkpoint');
  const hasCarveOut = has(tools, 'pre-approved') || has(ops, 'pre-approved')
    || has(tools, 'internal maintenance') || has(ops, 'internal maintenance')
    || has(hb, 'pre-approved');

  if (writeApproval && autoWrite && !hasCarveOut) {
    findings.push({
      code: 'AP001',
      specCode: 'AP-HB-001',
      severity: 'ERROR',
      where: 'TOOLS.md / HEARTBEAT.md',
      what: 'Write approval policy conflicts with HEARTBEAT auto-checkpoint.',
      impact: 'Either the approval rule breaks or checkpoints are skipped (context overflow risk).',
      constraintType: 'contradiction',
      evidence: [
        ...makeEvidence('HEARTBEAT.md', hb, 'checkpoint'),
        ...makeEvidence('TOOLS.md', tools, 'approval'),
      ],
    });
  }

  // SK001: SKILL.md action_mode must match Spirit autonomy mode
  const skill = getFile(files, 'SKILL.md');
  const expectedMode = canon.autonomy.actionMode || 'recommend_only';
  if (skill && !has(skill, expectedMode.replace(/_/g, ' ')) && !has(skill, expectedMode)) {
    findings.push({
      code: 'SK001',
      severity: 'ERROR',
      where: 'SKILL.md',
      what: 'Action gating in SKILL.md does not match Spirit autonomy mode.',
      impact: 'Agent may gate actions incorrectly.',
      constraintType: 'contradiction',
      evidence: makeEvidence('SKILL.md', skill, 'action gating'),
    });
  }

  // PC001: precedence definition
  const agents = getFile(files, 'AGENTS.md');
  const hasPrecedence = has(agents, 'precedence') || has(ops, 'precedence')
    || has(tools, 'overrides') || has(agents, 'conflict');
  if (!hasPrecedence && tools && ops) {
    findings.push({
      code: 'PC001',
      severity: 'INFO',
      where: 'AGENTS.md / OPS.md',
      what: 'No explicit precedence rule found for overlapping policies.',
      impact: 'Minor: agent may struggle with conflicting instructions from different files.',
      constraintType: 'ambiguity',
    });
  }

  return findings;
}

// ============================================================================
// Category C: Heartbeat Correctness
// ============================================================================

export function checkHeartbeatCorrectness(
  files: GeneratedFile[],
  _canon: SpiritData,
  extracted: ExtractedPolicies,
): ValidatorFinding[] {
  const findings: ValidatorFinding[] = [];
  const hb = getFile(files, 'HEARTBEAT.md');

  if (!hb) return findings;

  // HB001: one-group vs multi-group contradiction
  const claimsOneGroup = has(hb, 'only 1 group') || has(hb, 'one group per tick');
  const hasMultiGroup = /[AB],\s*[BC]/i.test(hb) || /[AB]\s*[+&]\s*[BC]/i.test(hb);
  if (claimsOneGroup && hasMultiGroup) {
    findings.push({
      code: 'HB001',
      severity: 'ERROR',
      where: 'HEARTBEAT.md',
      what: 'Claims 1 group per tick but defines multi-group rotation.',
      impact: 'Cost spikes or unexpected spam from running too many checks.',
      constraintType: 'contradiction',
      evidence: makeEvidence('HEARTBEAT.md', hb, 'group'),
    });
  }

  // HB002: HEARTBEAT_OK protocol
  if (!has(hb, 'HEARTBEAT_OK')) {
    findings.push({
      code: 'HB002',
      severity: 'WARN',
      where: 'HEARTBEAT.md',
      what: 'Missing HEARTBEAT_OK silent protocol.',
      impact: 'Agent may produce unnecessary output on idle ticks.',
      constraintType: 'runtime-mismatch',
    });
  }

  // HB003: rotating checks
  if (!has(hb, 'rotating') && !has(hb, 'rotation')) {
    findings.push({
      code: 'HB003',
      severity: 'WARN',
      where: 'HEARTBEAT.md',
      what: 'No rotating checks section found.',
      impact: 'Agent may run all checks every tick, increasing cost.',
      constraintType: 'ambiguity',
    });
  }

  // HB-EXT-001: auto-close/external state change without scope
  const unscopedActions = extracted.heartbeatActions.filter(
    a => (a.action === 'auto-close' || a.action === 'external state change'
      || a.action === 'push notification' || a.action === 'send alert')
      && !a.scope,
  );
  if (unscopedActions.length > 0) {
    findings.push({
      code: 'HB-EXT-001',
      severity: 'WARN',
      where: 'HEARTBEAT.md',
      what: `Auto-close or external state change without scope/allowlist: ${unscopedActions.map(a => a.action).join(', ')}.`,
      impact: 'Agent may auto-close tasks or trigger external changes beyond intended scope.',
      constraintType: 'ambiguity',
      evidence: unscopedActions.map(a => a.evidence),
    });
  }

  return findings;
}

// ============================================================================
// Category D: Security Surface
// ============================================================================

export function checkSecuritySurface(
  files: GeneratedFile[],
  _canon: SpiritData,
): ValidatorFinding[] {
  const findings: ValidatorFinding[] = [];
  const shield = getFile(files, 'SHIELD.md');

  if (!shield) return findings;

  if (!has(shield, 'emergency') && !has(shield, 'stop')) {
    findings.push({
      code: 'SC001',
      severity: 'WARN',
      where: 'SHIELD.md',
      what: 'No emergency stop mechanism found.',
      impact: 'No clear way to halt agent in case of runaway behavior.',
      constraintType: 'runtime-mismatch',
    });
  }

  if (!has(shield, 'default block') && !has(shield, 'Default Blocks')) {
    findings.push({
      code: 'SC002',
      severity: 'WARN',
      where: 'SHIELD.md',
      what: 'No default blocks section found.',
      impact: 'Agent may lack baseline protective guardrails.',
      constraintType: 'ambiguity',
    });
  }

  const allContent = files.map(f => f.content).join('\n');
  const secretPatterns = [
    /(?:api[_-]?key|secret[_-]?key|password)\s*[=:]\s*["']?[A-Za-z0-9+/]{16,}/i,
    /(?:Bearer|Basic)\s+[A-Za-z0-9+/=]{20,}/,
    /sk-[a-zA-Z0-9]{20,}/,
  ];
  if (secretPatterns.some(p => p.test(allContent))) {
    findings.push({
      code: 'SC003',
      severity: 'ERROR',
      where: 'Multiple files',
      what: 'Potential plaintext secrets detected in generated files.',
      impact: 'Credential leak risk if files are shared or committed.',
      constraintType: 'runtime-mismatch',
    });
  }

  return findings;
}

// ============================================================================
// Category E: Purpose Preservation
// ============================================================================

export function checkPurposePreservation(
  files: GeneratedFile[],
  canon: SpiritData,
  extracted: ExtractedPolicies,
): ValidatorFinding[] {
  const findings: ValidatorFinding[] = [];
  const identity = getFile(files, 'IDENTITY.md');
  const spirit = getFile(files, 'SPIRIT.md');
  const agents = getFile(files, 'AGENTS.md');

  // PP001: name consistency
  if (identity && canon.agentName && !has(identity, canon.agentName)) {
    findings.push({
      code: 'PP001',
      severity: 'ERROR',
      where: 'IDENTITY.md',
      what: `Agent name "${canon.agentName}" not found in IDENTITY.md.`,
      impact: 'Agent identity is inconsistent with configuration.',
      constraintType: 'runtime-mismatch',
      evidence: makeEvidence('IDENTITY.md', identity, 'name'),
    });
  }

  // PP002: mode consistency
  const modeVariants = canon.agentMode
    ? [canon.agentMode, canon.agentMode.replace(/-/g, ' ')]
    : [];
  if (identity && canon.agentMode && !modeVariants.some(v => has(identity, v))) {
    findings.push({
      code: 'PP002',
      severity: 'WARN',
      where: 'IDENTITY.md',
      what: `Agent mode "${canon.agentMode}" not reflected in IDENTITY.md.`,
      impact: 'Agent may not behave according to its designated mode.',
      constraintType: 'runtime-mismatch',
    });
  }

  // OC001 / SP-CANON-001: SPIRIT canonical claim vs snapshot in AGENTS
  if (spirit && (has(spirit, 'single source of truth') || has(spirit, 'canonical'))) {
    if (agents && !has(agents, 'spirit snapshot') && !has(agents, 'action_mode') && !has(agents, 'approval')) {
      const canonEvidence = extracted.canonicalClaims
        .filter(c => c.file === 'SPIRIT.md')
        .map(c => c.evidence);
      findings.push({
        code: 'OC001',
        specCode: 'SP-CANON-001',
        severity: 'WARN',
        where: 'AGENTS.md',
        what: 'SPIRIT claims canonical, but AGENTS.md lacks a durable SPIRIT snapshot.',
        impact: 'Subagent minimal contexts may drift from intended behavior.',
        constraintType: 'drift',
        evidence: canonEvidence.length > 0 ? canonEvidence : undefined,
      });
    }
  }

  // PP003: preset sections present when expected
  if (canon.presetId) {
    const expectedPresetLabel = canon.presetId.toUpperCase();
    const presetFiles = ['TOOLS.md', 'OPS.md', 'HEARTBEAT.md', 'AGENTS.md', 'SKILL.md'];
    for (const fname of presetFiles) {
      const content = getFile(files, fname);
      if (content && !has(content, expectedPresetLabel) && !has(content, canon.presetId)) {
        findings.push({
          code: 'PP003',
          severity: 'INFO',
          where: fname,
          what: `Preset "${canon.presetId}" not labeled in ${fname}.`,
          impact: 'Minor: preset identity not visible in file for debugging.',
          constraintType: 'ambiguity',
        });
      }
    }
  }

  // TRUTH-DRIFT-001: truth policy drift across files
  if (canon.truthPolicy) {
    const canonPolicy = canon.truthPolicy;
    for (const tp of extracted.truthPolicy) {
      if (tp.policy !== canonPolicy) {
        findings.push({
          code: 'TRUTH-DRIFT-001',
          severity: 'WARN',
          where: tp.file,
          what: `Truth policy in ${tp.file} ("${tp.policy}") drifts from canonical ("${canonPolicy}").`,
          impact: 'Agent may apply inconsistent truth-handling depending on which file it consults.',
          constraintType: 'drift',
          evidence: [tp.evidence],
        });
      }
    }
  }

  // STOPWORDS-DRIFT-001: stop words drift
  if (canon.stopWords?.length) {
    for (const sw of extracted.stopWords) {
      const missingFromFile = canon.stopWords.filter(
        w => !sw.words.some(fw => fw.toLowerCase() === w.toLowerCase()),
      );
      if (missingFromFile.length > 0) {
        findings.push({
          code: 'STOPWORDS-DRIFT-001',
          severity: 'WARN',
          where: sw.file,
          what: `${sw.file} missing stop words: ${missingFromFile.join(', ')}.`,
          impact: 'Agent may not halt on all expected stop words when consulting this file.',
          constraintType: 'drift',
          evidence: [sw.evidence],
        });
      }
    }
  }

  return findings;
}

// ============================================================================
// Category F: Skill Kernel Integrity
// ============================================================================

export function checkSkillIntegrity(
  files: GeneratedFile[],
  canon: SpiritData,
  extracted: ExtractedPolicies,
): ValidatorFinding[] {
  const findings: ValidatorFinding[] = [];
  const skill = getFile(files, 'SKILL.md');

  // If SKILL.md is not present (base-only pack), skip all checks
  if (!skill) return findings;

  // SKILL-KERNEL-001: missing kernel sections
  if (extracted.skillKernelSections.missing.length > 0) {
    findings.push({
      code: 'SKILL-KERNEL-001',
      severity: 'ERROR',
      where: 'SKILL.md',
      what: `Missing kernel sections: ${extracted.skillKernelSections.missing.join(', ')}.`,
      impact: 'Agent operational kernel is incomplete — critical behavioral gaps.',
      constraintType: 'missing-section',
      evidence: extracted.skillKernelSections.evidence,
    });
  }

  // SKILL-MAINT-001: maintenance write policy ambiguity
  const skillMaint = extracted.maintenancePolicy.filter(m => m.file === 'SKILL.md');
  if (skillMaint.length > 0) {
    const ambiguous = skillMaint.filter(m => m.isAmbiguous);
    if (ambiguous.length > 0) {
      findings.push({
        code: 'SKILL-MAINT-001',
        severity: 'WARN',
        where: 'SKILL.md',
        what: 'Maintenance write policy is ambiguous (mentions writes without clear scope).',
        impact: 'Agent may apply overly broad maintenance writes without proper gating.',
        constraintType: 'ambiguity',
        evidence: ambiguous.map(a => a.evidence),
      });
    }
  }

  // SKILL-PRESET-001: preset snapshot missing from skill kernel
  if (canon.presetId && !extracted.skillKernelSections.hasPresetSnapshot) {
    findings.push({
      code: 'SKILL-PRESET-001',
      severity: 'WARN',
      where: 'SKILL.md',
      what: 'No "Preset Snapshot (ACTIVE)" in skill kernel.',
      impact: 'Preset configuration not durable in SKILL.md for quick reference.',
      constraintType: 'ambiguity',
    });
  }

  // SKILL-ASSUME-001: runtime assumptions missing
  if (extracted.runtimeAssumptions.length === 0
    && (canon.agentMode === 'chief-of-staff' || canon.presetId === 'overclaw')) {
    findings.push({
      code: 'SKILL-ASSUME-001',
      severity: 'WARN',
      where: 'SKILL.md',
      what: 'Runtime assumptions section missing for complex agent mode.',
      impact: 'Agent lacks guardrails for runtime edge cases (tool outputs, degradation triggers).',
      constraintType: 'ambiguity',
    });
  }

  return findings;
}

// ============================================================================
// Promise vs Held
// ============================================================================

export function checkPromises(
  files: GeneratedFile[],
  canon: SpiritData,
): PromiseClaim[] {
  const claims: PromiseClaim[] = [];
  const hb = getFile(files, 'HEARTBEAT.md');
  const tools = getFile(files, 'TOOLS.md');
  const ops = getFile(files, 'OPS.md');
  const user = getFile(files, 'USER.md');
  const shield = getFile(files, 'SHIELD.md');

  // "Each tick runs only 1 group"
  if (has(hb, 'only 1 group') || has(hb, 'one group per tick')) {
    const multiGroup = /[AB],\s*[BC]/i.test(hb) || /[AB]\s*[+&]\s*[BC]/i.test(hb);
    claims.push({
      claim: 'Each tick runs only 1 group',
      status: multiGroup ? 'not-held' : 'held',
      detail: multiGroup
        ? 'Rotation text implies multiple groups per tick.'
        : 'Rotation correctly limits to one group per tick.',
    });
  }

  // "No automatic retries"
  const noRetryTools = has(tools, 'do not retry') || has(tools, 'do **not** retry');
  const retryOps = has(ops, 'retry once') || has(ops, 'retry **once**');
  const bothQualified = has(ops, 'idempotent') && has(tools, 'idempotent');
  if (noRetryTools || retryOps) {
    const isConflict = retryOps && noRetryTools && !bothQualified;
    claims.push({
      claim: 'No automatic retries',
      status: isConflict ? 'not-held' : 'held',
      detail: isConflict
        ? 'OPS says retry once, TOOLS says do not retry.'
        : 'Retry policy is consistent across files (qualified for idempotent reads only).',
    });
  }

  // "Significant actions require approval"
  if (has(user, 'significant') || has(user, 'approval')) {
    const hasApproval = has(tools, 'approval') || has(ops, 'approval');
    claims.push({
      claim: 'Significant actions require approval',
      status: hasApproval ? 'held' : 'partially-held',
      detail: hasApproval
        ? 'Approval requirements defined in TOOLS and/or OPS.'
        : 'USER mentions approval but TOOLS/OPS lack enforcement.',
    });
  }

  // "Stop words halt execution"
  if (canon.stopWords?.length) {
    const stopInShield = canon.stopWords.some(w => has(shield, w));
    claims.push({
      claim: 'Stop words halt execution',
      status: stopInShield ? 'held' : 'partially-held',
      detail: stopInShield
        ? 'Stop words referenced in SHIELD.md.'
        : 'Stop words defined in Spirit but not found in SHIELD.md.',
    });
  }

  return claims;
}

// ============================================================================
// Strengths Detection
// ============================================================================

export function detectStrengths(
  files: GeneratedFile[],
  canon: SpiritData,
): string[] {
  const strengths: string[] = [];
  const shield = getFile(files, 'SHIELD.md');
  const hb = getFile(files, 'HEARTBEAT.md');
  const agents = getFile(files, 'AGENTS.md');
  const tools = getFile(files, 'TOOLS.md');
  const skill = getFile(files, 'SKILL.md');

  if (has(shield, 'Default Blocks') && has(shield, 'Policy Gates') && has(shield, 'Emergency')) {
    strengths.push('Strong defensive guardrails (SHIELD covers blocks, gates, and emergency stop).');
  }

  if (has(hb, 'HEARTBEAT_OK') && has(hb, 'rotat')) {
    strengths.push('Proactive heartbeat with delta-only reporting and rotation.');
  }

  if (has(agents, 'boot') || has(agents, 'Boot')) {
    strengths.push('Clear boot sequence and session lifecycle defined in AGENTS.');
  }

  if (has(tools, 'approval') || has(tools, 'Approval')) {
    strengths.push('Explicit approval baseline for tool usage.');
  }

  if (skill && has(skill, 'Hard Stops') && has(skill, 'Boot Sequence') && has(skill, 'Action Gating')) {
    strengths.push('Complete operational kernel in SKILL.md with all critical sections.');
  }

  if (canon.negativeConstraints?.length >= 3) {
    strengths.push(`Solid constitution with ${canon.negativeConstraints.length} negative constraints.`);
  }

  if (canon.presetId) {
    strengths.push(`Preset "${canon.presetId}" provides consistent cross-file configuration.`);
  }

  if (strengths.length === 0) {
    strengths.push('All required bootstrap files present and structurally valid.');
  }

  return strengths.slice(0, 4);
}

// ============================================================================
// Run All Rules
// ============================================================================

export interface RuleResults {
  findings: ValidatorFinding[];
  promises: PromiseClaim[];
  strengths: string[];
  byCategory: Record<CategoryId, ValidatorFinding[]>;
}

export function runAllRules(
  files: GeneratedFile[],
  canon: SpiritData,
  options?: ValidatorOptions,
): RuleResults {
  // Extract structured policies once for all rules
  const extracted = extractPolicies(files, canon);

  const bootstrap = checkBootstrapFit(files, canon);
  const policy = checkPolicyConsistency(files, canon, extracted);
  const heartbeat = checkHeartbeatCorrectness(files, canon, extracted);
  const security = checkSecuritySurface(files, canon);
  const purpose = checkPurposePreservation(files, canon, extracted);
  const skill = checkSkillIntegrity(files, canon, extracted);

  let allFindings = [...bootstrap, ...policy, ...heartbeat, ...security, ...purpose, ...skill];

  // Strict mode: promote certain WARNs to ERRORs
  if (options?.strict) {
    allFindings = allFindings.map(f => {
      if (f.severity === 'WARN' && STRICT_PROMOTIONS.has(f.code)) {
        return { ...f, severity: 'ERROR' as const };
      }
      return f;
    });
  }

  return {
    findings: allFindings,
    promises: checkPromises(files, canon),
    strengths: detectStrengths(files, canon),
    byCategory: {
      bootstrap,
      policy,
      heartbeat,
      security,
      purpose,
      skill,
    },
  };
}
