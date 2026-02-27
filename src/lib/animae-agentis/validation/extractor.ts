/**
 * Policy Extraction Layer
 *
 * Parses generated file content into structured, queryable data.
 * Each extraction carries evidence (file + line) for rule diagnostics.
 */

import type { SpiritData, GeneratedFile } from '../types';
import type { EvidenceLine } from './types';

// ============================================================================
// Extraction Result Types
// ============================================================================

export interface ApprovalExtraction {
  file: string;
  type: 'auto-approved' | 'requires-approval' | 'blocked';
  scope: string;
  evidence: EvidenceLine;
}

export interface RetryExtraction {
  file: string;
  policy: 'retry-once' | 'no-retry' | 'retry-with-backoff' | 'qualified-retry';
  qualifier?: string;
  evidence: EvidenceLine;
}

export interface TruthPolicyExtraction {
  file: string;
  policy: string;
  evidence: EvidenceLine;
}

export interface StopWordExtraction {
  file: string;
  words: string[];
  evidence: EvidenceLine;
}

export interface HeartbeatActionExtraction {
  action: string;
  isAutomatic: boolean;
  scope?: string;
  evidence: EvidenceLine;
}

export interface CanonicalClaimExtraction {
  file: string;
  claim: string;
  evidence: EvidenceLine;
}

export interface SkillKernelExtraction {
  present: string[];
  missing: string[];
  hasPresetSnapshot: boolean;
  hasRuntimeAssumptions: boolean;
  evidence: EvidenceLine[];
}

export interface PresetSnapshotExtraction {
  file: string;
  isActive: boolean;
  evidence: EvidenceLine;
}

export interface MaintenancePolicyExtraction {
  file: string;
  isAmbiguous: boolean;
  writePaths: string[];
  evidence: EvidenceLine;
}

export interface RuntimeAssumptionExtraction {
  file: string;
  assumption: string;
  evidence: EvidenceLine;
}

export interface ExtractedPolicies {
  approvals: ApprovalExtraction[];
  retries: RetryExtraction[];
  truthPolicy: TruthPolicyExtraction[];
  stopWords: StopWordExtraction[];
  heartbeatActions: HeartbeatActionExtraction[];
  canonicalClaims: CanonicalClaimExtraction[];
  skillKernelSections: SkillKernelExtraction;
  presetSnapshot: PresetSnapshotExtraction | null;
  maintenancePolicy: MaintenancePolicyExtraction[];
  runtimeAssumptions: RuntimeAssumptionExtraction[];
}

// ============================================================================
// Helpers
// ============================================================================

function getFile(files: GeneratedFile[], name: string): string {
  return files.find(f => f.name === name)?.content ?? '';
}

export function findEvidence(fileName: string, content: string, phrase: string): EvidenceLine {
  if (!content) return { file: fileName, line: 0, text: '' };
  const lines = content.split('\n');
  const idx = lines.findIndex(l => l.toLowerCase().includes(phrase.toLowerCase()));
  return {
    file: fileName,
    line: idx >= 0 ? idx + 1 : 0,
    text: idx >= 0 ? lines[idx].trim() : '',
  };
}

export function findAllEvidence(fileName: string, content: string, phrase: string): EvidenceLine[] {
  if (!content) return [];
  const results: EvidenceLine[] = [];
  const lines = content.split('\n');
  const lower = phrase.toLowerCase();
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes(lower)) {
      results.push({ file: fileName, line: i + 1, text: lines[i].trim() });
    }
  }
  return results;
}

// ============================================================================
// Approval Extraction
// ============================================================================

function extractApprovals(files: GeneratedFile[]): ApprovalExtraction[] {
  const results: ApprovalExtraction[] = [];
  const approvalPatterns: Array<{ pattern: RegExp; type: ApprovalExtraction['type'] }> = [
    { pattern: /auto[- ]?approved/i, type: 'auto-approved' },
    { pattern: /pre[- ]?approved/i, type: 'auto-approved' },
    { pattern: /approval required/i, type: 'requires-approval' },
    { pattern: /freigabe erforderlich/i, type: 'requires-approval' },
    { pattern: /blocked/i, type: 'blocked' },
  ];

  for (const file of files) {
    if (!['TOOLS.md', 'OPS.md', 'USER.md', 'SKILL.md'].includes(file.name)) continue;
    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      for (const { pattern, type } of approvalPatterns) {
        if (pattern.test(lines[i])) {
          results.push({
            file: file.name,
            type,
            scope: lines[i].trim(),
            evidence: { file: file.name, line: i + 1, text: lines[i].trim() },
          });
        }
      }
    }
  }

  return results;
}

// ============================================================================
// Retry Extraction
// ============================================================================

function extractRetries(files: GeneratedFile[]): RetryExtraction[] {
  const results: RetryExtraction[] = [];

  for (const file of files) {
    if (!['TOOLS.md', 'OPS.md', 'SKILL.md'].includes(file.name)) continue;
    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lower = line.toLowerCase();
      if (!lower.includes('retry') && !lower.includes('wiederhol')) continue;

      const ev: EvidenceLine = { file: file.name, line: i + 1, text: line.trim() };

      if ((lower.includes('do not retry') || lower.includes('do **not** retry')
        || lower.includes('keine wiederholung') || lower.includes('no retries'))) {
        results.push({ file: file.name, policy: 'no-retry', evidence: ev });
      } else if (lower.includes('idempotent') || lower.includes('read-only') || lower.includes('read only')) {
        results.push({
          file: file.name,
          policy: 'qualified-retry',
          qualifier: 'idempotent reads only',
          evidence: ev,
        });
      } else if (lower.includes('retry once') || lower.includes('retry **once**')
        || lower.includes('einmal')) {
        results.push({ file: file.name, policy: 'retry-once', evidence: ev });
      } else if (lower.includes('backoff')) {
        results.push({ file: file.name, policy: 'retry-with-backoff', evidence: ev });
      }
    }
  }

  return results;
}

// ============================================================================
// Truth Policy Extraction
// ============================================================================

function extractTruthPolicy(files: GeneratedFile[]): TruthPolicyExtraction[] {
  const results: TruthPolicyExtraction[] = [];

  // Only extract from explicit policy declarations, not casual mentions.
  // Look for "Policy: <name>" or YAML front matter "truth_policy: <name>" or
  // section headings like "## Truth Policy" followed by a policy descriptor.
  const policyPatterns: Array<{ pattern: RegExp; normalized: string }> = [
    { pattern: /policy:\s*mark[_ ]uncertainty/i, normalized: 'mark_uncertainty' },
    { pattern: /policy:\s*calibrated[_ ]confidence/i, normalized: 'calibrated_confidence' },
    { pattern: /policy:\s*confident[_ ]only/i, normalized: 'confident_only' },
    { pattern: /truth_policy:\s*"?mark_uncertainty"?/i, normalized: 'mark_uncertainty' },
    { pattern: /truth_policy:\s*"?calibrated_confidence"?/i, normalized: 'calibrated_confidence' },
    { pattern: /truth_policy:\s*"?confident_only"?/i, normalized: 'confident_only' },
    { pattern: /policy:\s*unsicherheit markieren/i, normalized: 'mark_uncertainty' },
    { pattern: /policy:\s*kalibrierte konfidenz/i, normalized: 'calibrated_confidence' },
    { pattern: /policy:\s*nur bei sicherheit/i, normalized: 'confident_only' },
  ];

  for (const file of files) {
    if (!['SPIRIT.md', 'SOUL.md', 'SKILL.md'].includes(file.name)) continue;
    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      for (const { pattern, normalized } of policyPatterns) {
        if (pattern.test(lines[i])) {
          results.push({
            file: file.name,
            policy: normalized,
            evidence: { file: file.name, line: i + 1, text: lines[i].trim() },
          });
          break;
        }
      }
    }
  }

  return results;
}

// ============================================================================
// Stop Words Extraction
// ============================================================================

function extractStopWords(files: GeneratedFile[], canon: SpiritData): StopWordExtraction[] {
  const results: StopWordExtraction[] = [];

  for (const file of files) {
    if (!['SHIELD.md', 'SKILL.md', 'USER.md', 'SPIRIT.md'].includes(file.name)) continue;
    const lines = file.content.split('\n');

    // Find stop words as list items (backtick or plain)
    const words: string[] = [];
    let evidenceLine: EvidenceLine | null = null;
    let inStopSection = false;
    for (let i = 0; i < lines.length; i++) {
      const lower = lines[i].toLowerCase();

      // Track whether we're inside a stop-word-related section
      if (lower.includes('stop word') || lower.includes('stop-wort')
        || lower.includes('hard stop') || lower.includes('### stop')) {
        inStopSection = true;
      }
      // Exit section on next heading
      if (inStopSection && i > 0 && /^#+\s/.test(lines[i]) && !lower.includes('stop')) {
        inStopSection = false;
      }

      // Match backtick items: - `STOP`
      const backtickMatch = lines[i].match(/^-\s*`([^`]+)`/);
      if (backtickMatch && canon.stopWords?.some(w => w.toLowerCase() === backtickMatch[1].toLowerCase())) {
        words.push(backtickMatch[1]);
        if (!evidenceLine) {
          evidenceLine = { file: file.name, line: i + 1, text: lines[i].trim() };
        }
        continue;
      }

      // Match plain list items in stop-word sections: - STOP
      if (inStopSection) {
        const plainMatch = lines[i].match(/^-\s+(\S+)\s*$/);
        if (plainMatch && canon.stopWords?.some(w => w.toLowerCase() === plainMatch[1].toLowerCase())) {
          words.push(plainMatch[1]);
          if (!evidenceLine) {
            evidenceLine = { file: file.name, line: i + 1, text: lines[i].trim() };
          }
        }
      }
    }

    // Fallback: check for inline stop word mentions
    if (words.length === 0) {
      for (let i = 0; i < lines.length; i++) {
        const lower = lines[i].toLowerCase();
        if (lower.includes('stop word') || lower.includes('stop-wort') || lower.includes('hard stop')) {
          const found = (canon.stopWords ?? []).filter(w => lower.includes(w.toLowerCase()));
          if (found.length > 0) {
            words.push(...found);
            evidenceLine = { file: file.name, line: i + 1, text: lines[i].trim() };
          }
        }
      }
    }

    if (words.length > 0 && evidenceLine) {
      results.push({ file: file.name, words, evidence: evidenceLine });
    }
  }

  return results;
}

// ============================================================================
// Heartbeat Action Extraction
// ============================================================================

function extractHeartbeatActions(files: GeneratedFile[]): HeartbeatActionExtraction[] {
  const results: HeartbeatActionExtraction[] = [];
  const hb = getFile(files, 'HEARTBEAT.md');
  if (!hb) return results;

  const lines = hb.split('\n');
  const autoPatterns = [
    { pattern: /write checkpoint/i, action: 'write checkpoint' },
    { pattern: /create checkpoint/i, action: 'create checkpoint' },
    { pattern: /auto[- ]?close/i, action: 'auto-close' },
    { pattern: /auto[- ]?write/i, action: 'auto-write' },
    { pattern: /external state/i, action: 'external state change' },
    { pattern: /push notification/i, action: 'push notification' },
    { pattern: /send alert/i, action: 'send alert' },
  ];

  for (let i = 0; i < lines.length; i++) {
    for (const { pattern, action } of autoPatterns) {
      if (pattern.test(lines[i])) {
        const lower = lines[i].toLowerCase();
        // Check for scope — either in the same line or in adjacent context
        const contextWindow = lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 3)).join(' ').toLowerCase();
        const hasScope = lower.includes('allowlist') || lower.includes('scope')
          || lower.includes('only') || lower.includes('sandbox')
          || lower.includes('pre-approved') || lower.includes('internal')
          || lower.includes('complete') || lower.includes('summary')
          || lower.includes('surfaced') || lower.includes('user')
          || contextWindow.includes('complete') || contextWindow.includes('if task');
        results.push({
          action,
          isAutomatic: true,
          scope: hasScope ? lines[i].trim() : undefined,
          evidence: { file: 'HEARTBEAT.md', line: i + 1, text: lines[i].trim() },
        });
      }
    }
  }

  return results;
}

// ============================================================================
// Canonical Claims Extraction
// ============================================================================

function extractCanonicalClaims(files: GeneratedFile[]): CanonicalClaimExtraction[] {
  const results: CanonicalClaimExtraction[] = [];

  for (const file of files) {
    if (!['SPIRIT.md', 'AGENTS.md', 'SKILL.md'].includes(file.name)) continue;
    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const lower = lines[i].toLowerCase();
      if (lower.includes('single source of truth') || lower.includes('canonical')
        || lower.includes('spirit snapshot') || lower.includes('kanonisch')) {
        results.push({
          file: file.name,
          claim: lines[i].trim(),
          evidence: { file: file.name, line: i + 1, text: lines[i].trim() },
        });
      }
    }
  }

  return results;
}

// ============================================================================
// Skill Kernel Section Extraction
// ============================================================================

const REQUIRED_KERNEL_SECTIONS = [
  'Hard Stops',
  'Boot Sequence',
  'Intake',
  'Action Gating',
  'Tool Invocation',
  'Truth Policy',
  'Heartbeat',
  'Session End',
];

function extractSkillKernelSections(files: GeneratedFile[]): SkillKernelExtraction {
  const skill = getFile(files, 'SKILL.md');
  if (!skill) {
    return {
      present: [],
      missing: [...REQUIRED_KERNEL_SECTIONS],
      hasPresetSnapshot: false,
      hasRuntimeAssumptions: false,
      evidence: [],
    };
  }

  const present: string[] = [];
  const missing: string[] = [];
  const evidence: EvidenceLine[] = [];
  const lines = skill.split('\n');

  for (const section of REQUIRED_KERNEL_SECTIONS) {
    const idx = lines.findIndex(l => l.toLowerCase().includes(section.toLowerCase()));
    if (idx >= 0) {
      present.push(section);
      evidence.push({ file: 'SKILL.md', line: idx + 1, text: lines[idx].trim() });
    } else {
      missing.push(section);
    }
  }

  const hasPresetSnapshot = skill.toLowerCase().includes('preset snapshot');
  const hasRuntimeAssumptions = skill.toLowerCase().includes('runtime assumption')
    || skill.toLowerCase().includes('laufzeit-annahme');

  return { present, missing, hasPresetSnapshot, hasRuntimeAssumptions, evidence };
}

// ============================================================================
// Preset Snapshot Extraction
// ============================================================================

function extractPresetSnapshot(files: GeneratedFile[]): PresetSnapshotExtraction | null {
  for (const file of files) {
    if (!['SKILL.md', 'AGENTS.md'].includes(file.name)) continue;
    const ev = findEvidence(file.name, file.content, 'preset snapshot');
    if (ev.line > 0) {
      return {
        file: file.name,
        isActive: ev.text.toLowerCase().includes('(active)') || ev.text.toLowerCase().includes('(aktiv)'),
        evidence: ev,
      };
    }
  }
  return null;
}

// ============================================================================
// Maintenance Policy Extraction
// ============================================================================

function extractMaintenancePolicy(files: GeneratedFile[]): MaintenancePolicyExtraction[] {
  const results: MaintenancePolicyExtraction[] = [];

  for (const file of files) {
    if (!['TOOLS.md', 'OPS.md', 'SKILL.md'].includes(file.name)) continue;
    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const lower = lines[i].toLowerCase();
      if (lower.includes('maintenance') || lower.includes('carve-out') || lower.includes('wartung')) {
        const hasScope = lower.includes('checkpoint') || lower.includes('memory/')
          || lower.includes('append-only') || lower.includes('internal');
        const ambiguous = lower.includes('write') && !hasScope;
        const paths: string[] = [];
        const pathMatch = lines[i].match(/`([^`]*\/[^`]*)`/g);
        if (pathMatch) {
          paths.push(...pathMatch.map(p => p.replace(/`/g, '')));
        }
        results.push({
          file: file.name,
          isAmbiguous: ambiguous,
          writePaths: paths,
          evidence: { file: file.name, line: i + 1, text: lines[i].trim() },
        });
      }
    }
  }

  return results;
}

// ============================================================================
// Runtime Assumptions Extraction
// ============================================================================

function extractRuntimeAssumptions(files: GeneratedFile[]): RuntimeAssumptionExtraction[] {
  const results: RuntimeAssumptionExtraction[] = [];
  const skill = getFile(files, 'SKILL.md');
  if (!skill) return results;

  const lines = skill.split('\n');
  const assumptionPatterns = [
    /tool outputs are data/i,
    /skill always[- ]?on/i,
    /degrade trigger/i,
    /runtime assumption/i,
    /laufzeit/i,
  ];

  for (let i = 0; i < lines.length; i++) {
    for (const pattern of assumptionPatterns) {
      if (pattern.test(lines[i])) {
        results.push({
          file: 'SKILL.md',
          assumption: lines[i].trim(),
          evidence: { file: 'SKILL.md', line: i + 1, text: lines[i].trim() },
        });
        break;
      }
    }
  }

  return results;
}

// ============================================================================
// Public API
// ============================================================================

export function extractPolicies(
  files: GeneratedFile[],
  canon: SpiritData,
): ExtractedPolicies {
  return {
    approvals: extractApprovals(files),
    retries: extractRetries(files),
    truthPolicy: extractTruthPolicy(files),
    stopWords: extractStopWords(files, canon),
    heartbeatActions: extractHeartbeatActions(files),
    canonicalClaims: extractCanonicalClaims(files),
    skillKernelSections: extractSkillKernelSections(files),
    presetSnapshot: extractPresetSnapshot(files),
    maintenancePolicy: extractMaintenancePolicy(files),
    runtimeAssumptions: extractRuntimeAssumptions(files),
  };
}
