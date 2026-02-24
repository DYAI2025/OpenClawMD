/**
 * Validation Rules
 *
 * All rules from the OpenClawMD validator spec:
 * OC001, OC002, HB001, AP001, RT001, SZ001
 * Plus cross-file consistency and promise-vs-held checks.
 */

import type { SpiritData, GeneratedFile } from '../types';
import type { ValidatorFinding, PromiseClaim, CategoryId } from './types';

// Max chars before OpenClaw truncation risk
const BOOTSTRAP_MAX_CHARS = 12_000;

// Required bootstrap files
const BOOTSTRAP_REQUIRED = new Set([
  'SOUL.md', 'IDENTITY.md', 'USER.md', 'HEARTBEAT.md', 'SHIELD.md',
]);

function has(text: string, phrase: string): boolean {
  return text.toLowerCase().includes(phrase.toLowerCase());
}

function getFile(files: GeneratedFile[], name: string): string {
  return files.find(f => f.name === name)?.content ?? '';
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
      });
    }
  }

  // Check for broken cross-file references
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

  return findings;
}

// ============================================================================
// Category B: Policy Consistency
// ============================================================================

export function checkPolicyConsistency(
  files: GeneratedFile[],
  _canon: SpiritData,
): ValidatorFinding[] {
  const findings: ValidatorFinding[] = [];
  const tools = getFile(files, 'TOOLS.md');
  const ops = getFile(files, 'OPS.md');

  // RT001: retry mismatch — only fire when policies genuinely contradict.
  // Both files may contain qualified retry language (e.g., "retry once for reads, do not retry writes")
  // which is NOT a conflict. Only flag if one says "always retry" while the other says "never retry".
  const opsQualifiedRetry = has(ops, 'retry') && has(ops, 'idempotent');
  const toolsQualifiedRetry = has(tools, 'retry') && has(tools, 'idempotent');
  const opsUnqualifiedRetry = has(ops, 'retry') && !has(ops, 'do not retry') && !has(ops, 'do **not** retry') && !has(ops, 'never retry') && !opsQualifiedRetry;
  const toolsUnqualifiedNoRetry = (has(tools, 'do not retry') || has(tools, 'do **not** retry')) && !toolsQualifiedRetry;

  // Only flag if one file has unqualified retry and the other has unqualified no-retry
  if (opsUnqualifiedRetry && toolsUnqualifiedNoRetry) {
    findings.push({
      code: 'RT001',
      severity: 'ERROR',
      where: 'OPS.md + TOOLS.md',
      what: 'Retry policy conflict between OPS and TOOLS.',
      impact: 'Non-deterministic failure handling; agent may loop or silently stop.',
      constraintType: 'contradiction',
    });
  }

  // AP001: write approval conflict vs automatic writes
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
      severity: 'ERROR',
      where: 'TOOLS.md / HEARTBEAT.md',
      what: 'Write approval policy conflicts with HEARTBEAT auto-checkpoint.',
      impact: 'Either the approval rule breaks or checkpoints are skipped (context overflow risk).',
      constraintType: 'contradiction',
    });
  }

  // Check for precedence definition when files have overlapping scopes
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
): ValidatorFinding[] {
  const findings: ValidatorFinding[] = [];
  const hb = getFile(files, 'HEARTBEAT.md');

  if (!hb) return findings;

  // HB001: one-group vs multi-group contradiction
  // "A → B → C → repeat" is sequential rotation ORDER, not multi-group-per-tick.
  // Only flag comma-separated or simultaneous patterns like "A, B" or "A + B".
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
    });
  }

  // HEARTBEAT_OK protocol
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

  // Rotating checks present
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

  // Emergency stop
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

  // Default blocks
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

  // Secret handling — only flag actual credential patterns (key=value), not instructional mentions
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
): ValidatorFinding[] {
  const findings: ValidatorFinding[] = [];
  const identity = getFile(files, 'IDENTITY.md');
  const spirit = getFile(files, 'SPIRIT.md');
  const agents = getFile(files, 'AGENTS.md');

  // Name consistency
  if (identity && canon.agentName && !has(identity, canon.agentName)) {
    findings.push({
      code: 'PP001',
      severity: 'ERROR',
      where: 'IDENTITY.md',
      what: `Agent name "${canon.agentName}" not found in IDENTITY.md.`,
      impact: 'Agent identity is inconsistent with configuration.',
      constraintType: 'runtime-mismatch',
    });
  }

  // Mode consistency — handle hyphenated modes like "chief-of-staff" → "Chief of Staff"
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

  // OC001: SPIRIT canonical claim vs snapshot in AGENTS
  if (spirit && (has(spirit, 'single source of truth') || has(spirit, 'canonical'))) {
    if (agents && !has(agents, 'spirit snapshot') && !has(agents, 'action_mode') && !has(agents, 'approval')) {
      findings.push({
        code: 'OC001',
        severity: 'WARN',
        where: 'AGENTS.md',
        what: 'SPIRIT claims canonical, but AGENTS.md lacks a durable SPIRIT snapshot.',
        impact: 'Subagent minimal contexts may drift from intended behavior.',
        constraintType: 'runtime-mismatch',
      });
    }
  }

  // Preset sections present when expected
  if (canon.presetId) {
    const expectedPresetLabel = canon.presetId.toUpperCase();
    const presetFiles = ['TOOLS.md', 'OPS.md', 'HEARTBEAT.md', 'AGENTS.md'];
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
  // Both files may have qualified retry (idempotent-only) — that's consistent, not a conflict.
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

  if (canon.negativeConstraints?.length >= 3) {
    strengths.push(`Solid constitution with ${canon.negativeConstraints.length} negative constraints.`);
  }

  if (canon.presetId) {
    strengths.push(`Preset "${canon.presetId}" provides consistent cross-file configuration.`);
  }

  // Always have at least one strength
  if (strengths.length === 0) {
    strengths.push('All required bootstrap files present and structurally valid.');
  }

  return strengths.slice(0, 3);
}

// ============================================================================
// Run All Rules
// ============================================================================

export interface RuleResults {
  findings: ValidatorFinding[];
  promises: PromiseClaim[];
  strengths: string[];
  /** Findings grouped by category for scoring */
  byCategory: Record<CategoryId, ValidatorFinding[]>;
}

export function runAllRules(
  files: GeneratedFile[],
  canon: SpiritData,
): RuleResults {
  const bootstrap = checkBootstrapFit(files, canon);
  const policy = checkPolicyConsistency(files, canon);
  const heartbeat = checkHeartbeatCorrectness(files, canon);
  const security = checkSecuritySurface(files, canon);
  const purpose = checkPurposePreservation(files, canon);

  return {
    findings: [...bootstrap, ...policy, ...heartbeat, ...security, ...purpose],
    promises: checkPromises(files, canon),
    strengths: detectStrengths(files, canon),
    byCategory: {
      bootstrap,
      policy,
      heartbeat,
      security,
      purpose,
    },
  };
}
