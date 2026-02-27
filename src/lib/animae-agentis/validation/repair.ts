/**
 * Repair Engine v2.2
 *
 * Auto-repairs RED validation results without changing design intent.
 * Purpose-preserving: "Nicht glätten, sondern arrangieren".
 *
 * Transforms:
 *   - Precedence injection
 *   - Carve-outs (maintenance writes)
 *   - Modality rewrites (propose vs execute)
 *   - Scope gating (sandbox / allowlist)
 *   - Retry specialization (reads vs writes)
 */

import type { SpiritData, GeneratedFile } from '../types';
import type { ValidatorFinding, RepairAction, RepairResult } from './types';
import { runFullValidation } from './validator';

type RepairFn = (
  files: Map<string, string>,
  finding: ValidatorFinding,
  canon: SpiritData,
) => RepairAction | null;

// ============================================================================
// Individual Repair Functions
// ============================================================================

function repairRT001(
  files: Map<string, string>,
  _finding: ValidatorFinding,
  canon: SpiritData,
): RepairAction | null {
  const ops = files.get('OPS.md');
  const tools = files.get('TOOLS.md');
  if (!ops || !tools) return null;

  const isSecurityPreset = canon.presetId === 'security';
  const specializedRetry = isSecurityPreset
    ? 'Do **not** retry any failed tool call. Log and report immediately.'
    : 'Retry **once** only for idempotent read-only calls. Never retry writes. Log all failures.';

  const opsPatched = ops.replace(
    /[-•]\s*(?:Do\s+\*\*not\*\*\s+retry|Retry\s+(?:\*\*)?once(?:\*\*)?).*?(?:\.|\n)/i,
    `- ${specializedRetry}`,
  );
  const toolsPatched = tools.replace(
    /\d+\.\s*(?:Do\s+\*\*not\*\*\s+retry|Retry\s+(?:\*\*)?once(?:\*\*)?).*?(?:\.|\n)/i,
    `1. ${specializedRetry}`,
  );

  if (opsPatched !== ops) files.set('OPS.md', opsPatched);
  if (toolsPatched !== tools) files.set('TOOLS.md', toolsPatched);

  return {
    code: 'RT001',
    file: 'OPS.md + TOOLS.md',
    description: 'Specialized retry policy: reads may retry once, writes never retry.',
    before: 'Conflicting retry policies in OPS.md and TOOLS.md.',
    after: `Unified retry policy: "${specializedRetry}"`,
  };
}

function repairAP001(
  files: Map<string, string>,
  _finding: ValidatorFinding,
  canon: SpiritData,
): RepairAction | null {
  const tools = files.get('TOOLS.md');
  const hb = files.get('HEARTBEAT.md');
  if (!tools && !hb) return null;

  const carveOut = canon.presetId === 'security'
    ? '\n\n> **Maintenance carve-out:** Internal checkpoint writes to `memory/checkpoints/*` are pre-approved (propose-only for security preset).'
    : '\n\n> **Maintenance carve-out:** Internal checkpoint writes to `memory/checkpoints/*` and `MEMORY.md` append-only are pre-approved.';

  if (tools && !tools.includes('pre-approved') && !tools.includes('internal maintenance')) {
    const approvalMatch = tools.match(/(## Approval Baseline.*?\n(?:.*?\n)*?)(\n## )/s);
    if (approvalMatch) {
      const patchedTools = tools.replace(
        approvalMatch[1],
        approvalMatch[1] + carveOut + '\n',
      );
      files.set('TOOLS.md', patchedTools);
    } else {
      files.set('TOOLS.md', tools + carveOut);
    }
  }

  return {
    code: 'AP001',
    file: 'TOOLS.md',
    description: 'Added maintenance carve-out for internal checkpoint writes.',
    before: 'Write approval conflicts with HEARTBEAT auto-checkpoint (no carve-out).',
    after: 'Maintenance writes (memory/checkpoints) are pre-approved. User-facing writes still require approval.',
  };
}

function repairHB001(
  files: Map<string, string>,
  _finding: ValidatorFinding,
  _canon: SpiritData,
): RepairAction | null {
  const hb = files.get('HEARTBEAT.md');
  if (!hb) return null;

  const patched = hb
    .replace(
      /(?:A\s*[,→+&]\s*B\s*[,→+&]?\s*C?)/gi,
      'A → B → C → repeat (one group per tick)',
    )
    .replace(
      /(?:only 1 group.*?per tick)/gi,
      'Exactly 1 group per tick: A → B → C → repeat',
    );

  if (patched === hb) return null;
  files.set('HEARTBEAT.md', patched);

  return {
    code: 'HB001',
    file: 'HEARTBEAT.md',
    description: 'Made rotation unambiguous: strictly one group per tick.',
    before: 'Rotation text implied multiple groups per tick.',
    after: 'Rotation is now: A → B → C → repeat (exactly 1 group per tick).',
  };
}

function repairOC001(
  files: Map<string, string>,
  _finding: ValidatorFinding,
  canon: SpiritData,
): RepairAction | null {
  const agents = files.get('AGENTS.md');
  if (!agents) return null;

  const snapshot = `
## SPIRIT Snapshot (durable reference for minimal contexts)

- **action_mode:** ${canon.autonomy?.actionMode ?? 'recommend_only'}
- **approval_threshold:** ${canon.autonomy?.approvalThreshold ?? 'Anything irreversible requires approval.'}
- **surprise_appetite:** ${canon.surprise?.appetite ?? 'medium'}
- **truth_policy:** ${canon.truthPolicy ?? 'calibrated_confidence'}
- **preset:** ${canon.presetId ?? 'custom'}
`;

  const firstHeadingEnd = agents.indexOf('\n', agents.indexOf('# '));
  if (firstHeadingEnd === -1) return null;

  const patched = agents.slice(0, firstHeadingEnd + 1) + snapshot + agents.slice(firstHeadingEnd + 1);
  files.set('AGENTS.md', patched);

  return {
    code: 'OC001',
    file: 'AGENTS.md',
    description: 'Added SPIRIT snapshot to AGENTS.md for subagent minimal contexts.',
    before: 'SPIRIT claims canonical but AGENTS lacks durable snapshot.',
    after: 'AGENTS.md now contains a SPIRIT snapshot with key configuration values.',
  };
}

function repairOC002(
  _files: Map<string, string>,
  finding: ValidatorFinding,
  _canon: SpiritData,
): RepairAction | null {
  return {
    code: 'OC002',
    file: finding.where,
    description: 'Missing required bootstrap file. Cannot auto-fix — file must be regenerated.',
    before: finding.what,
    after: 'Regenerate with all required files enabled.',
  };
}

function repairCanonRef001(
  files: Map<string, string>,
  finding: ValidatorFinding,
  _canon: SpiritData,
): RepairAction | null {
  const fileName = finding.where;
  const content = files.get(fileName);
  if (!content) return null;

  const patched = content.replace(/CANON\.md/g, 'SPIRIT.md');
  if (patched === content) return null;
  files.set(fileName, patched);

  return {
    code: 'CANON-REF-001',
    file: fileName,
    description: 'Replaced deprecated "CANON.md" references with "SPIRIT.md".',
    before: 'File references deprecated CANON.md.',
    after: 'All references now point to SPIRIT.md.',
  };
}

function repairSkillKernel001(
  _files: Map<string, string>,
  finding: ValidatorFinding,
  _canon: SpiritData,
): RepairAction | null {
  return {
    code: 'SKILL-KERNEL-001',
    file: 'SKILL.md',
    description: 'Missing kernel sections. Cannot auto-fix — SKILL.md must be regenerated.',
    before: finding.what,
    after: 'Regenerate SKILL.md with all kernel sections.',
  };
}

function repairHBExt001(
  files: Map<string, string>,
  finding: ValidatorFinding,
  _canon: SpiritData,
): RepairAction | null {
  const hb = files.get('HEARTBEAT.md');
  if (!hb) return null;

  const scopeNote = '\n\n> **Scope**: Auto-close applies only to tasks in the local task queue. External state changes require explicit user approval.\n';

  if (hb.includes('Scope') && hb.includes('auto-close')) return null;

  files.set('HEARTBEAT.md', hb + scopeNote);

  return {
    code: 'HB-EXT-001',
    file: 'HEARTBEAT.md',
    description: 'Added scope restriction to auto-close/external actions.',
    before: finding.what,
    after: 'Auto-close scoped to local task queue. External changes require approval.',
  };
}

// ============================================================================
// Repair Registry
// ============================================================================

const REPAIR_REGISTRY: Record<string, RepairFn> = {
  'RT001': repairRT001,
  'AP001': repairAP001,
  'HB001': repairHB001,
  'OC001': repairOC001,
  'OC002': repairOC002,
  'CANON-REF-001': repairCanonRef001,
  'SKILL-KERNEL-001': repairSkillKernel001,
  'HB-EXT-001': repairHBExt001,
};

// ============================================================================
// Public API
// ============================================================================

export function repairFiles(
  files: GeneratedFile[],
  findings: ValidatorFinding[],
  canon: SpiritData,
): RepairResult {
  const fileMap = new Map<string, string>();
  for (const f of files) {
    fileMap.set(f.name, f.content);
  }

  const actions: RepairAction[] = [];

  const errors = findings.filter(f => f.severity === 'ERROR');
  for (const finding of errors) {
    const repairFn = REPAIR_REGISTRY[finding.code];
    if (repairFn) {
      const action = repairFn(fileMap, finding, canon);
      if (action) {
        actions.push(action);
      }
    }
  }

  const repairedFiles: GeneratedFile[] = files.map(f => ({
    ...f,
    content: fileMap.get(f.name) ?? f.content,
  }));

  const reportAfter = runFullValidation(repairedFiles, canon);

  return {
    repairedFiles,
    actions,
    reportAfter,
  };
}
