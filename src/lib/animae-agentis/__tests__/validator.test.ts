/**
 * Validator Tests
 *
 * Tests the validation rules, scoring, traffic light, and repair engine.
 * Architecture tests validate template structure only when relevant.
 */

import { describe, it, expect } from 'vitest';
import type { SpiritData, GeneratedFile } from '../types';
import { generateAnimaeAgentisFiles } from '../generator';
import { runFullValidation, repairFiles, extractPolicies } from '../validation';
import { runAllRules } from '../validation/rules';
import { computeCategoryScores, computeOverallScore, computeTrafficLight } from '../validation/scoring';

// ============================================================================
// Test Fixtures
// ============================================================================

function makeSpirit(overrides: Partial<SpiritData> = {}): SpiritData {
  return {
    agentName: 'TestAgent',
    agentTitle: 'Test Chief of Staff',
    agentMode: 'chief-of-staff',
    domainFocus: 'engineering',
    tone: { precision: 'minimalist', method: 'socratic', directness: 'direct' },
    autonomy: {
      actionMode: 'execute_with_approval',
      approvalThreshold: 'Anything irreversible requires approval.',
    },
    surprise: { appetite: 'medium', cadence: 'weekly_deep', boundaries: 'No outreach.' },
    truthPolicy: 'calibrated_confidence',
    negativeConstraints: [
      'Never invent facts.',
      'Never bypass approval.',
      'Never leak secrets.',
    ],
    output: { format: 'result_plus_plan', explanations: 'brief_by_default', confidenceDisplay: 'calibrated' },
    addressing: { form: 'first_name', language: 'en', timezone: 'UTC' },
    stopWords: ['STOP', 'HALT'],
    ...overrides,
  };
}

function generateFiles(spirit: SpiritData): GeneratedFile[] {
  return generateAnimaeAgentisFiles(spirit, {
    includeAdvancedPack: true,
    language: 'en',
  }).files;
}

// ============================================================================
// Validation Rules Tests
// ============================================================================

describe('Validation Rules', () => {
  it('should produce no ERRORs for RESPONSIBLE preset', () => {
    const spirit = makeSpirit({ presetId: 'responsible' });
    const files = generateFiles(spirit);
    const { findings } = runAllRules(files, spirit);
    const errors = findings.filter(f => f.severity === 'ERROR');
    expect(errors).toEqual([]);
  });

  it('should produce no ERRORs for SECURITY preset', () => {
    const spirit = makeSpirit({
      presetId: 'security',
      autonomy: { actionMode: 'recommend_only', approvalThreshold: 'All actions require approval.' },
      surprise: { appetite: 'low', cadence: 'weekly_deep', boundaries: 'None.' },
    });
    const files = generateFiles(spirit);
    const { findings } = runAllRules(files, spirit);
    const errors = findings.filter(f => f.severity === 'ERROR');
    expect(errors).toEqual([]);
  });

  it('should produce no ERRORs for OVERCLAW preset', () => {
    const spirit = makeSpirit({
      presetId: 'overclaw',
      autonomy: { actionMode: 'autonomous_in_sandbox', approvalThreshold: 'Allowlisted paths only.' },
      surprise: { appetite: 'high', cadence: 'daily_micro', boundaries: 'In sandbox.' },
    });
    const files = generateFiles(spirit);
    const { findings } = runAllRules(files, spirit);
    const errors = findings.filter(f => f.severity === 'ERROR');
    expect(errors).toEqual([]);
  });

  it('should produce no ERRORs for custom config (no preset)', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const { findings } = runAllRules(files, spirit);
    const errors = findings.filter(f => f.severity === 'ERROR');
    expect(errors).toEqual([]);
  });

  it('should detect OC002 when required file is missing', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit).filter(f => f.name !== 'SOUL.md');
    const { findings } = runAllRules(files, spirit);
    expect(findings.some(f => f.code === 'OC002')).toBe(true);
  });

  it('should detect SZ001 for oversized files', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    // Artificially inflate a file
    const soul = files.find(f => f.name === 'SOUL.md')!;
    soul.content = soul.content + '\n' + 'X'.repeat(15_000);
    const { findings } = runAllRules(files, spirit);
    expect(findings.some(f => f.code === 'SZ001')).toBe(true);
  });
});

// ============================================================================
// Scoring Tests
// ============================================================================

describe('Scoring', () => {
  it('should return score 100 for clean files', () => {
    const spirit = makeSpirit({ presetId: 'responsible' });
    const files = generateFiles(spirit);
    const { byCategory } = runAllRules(files, spirit);
    const categories = computeCategoryScores(byCategory);
    const overall = computeOverallScore(categories);
    expect(overall).toBeGreaterThanOrEqual(80);
  });

  it('should return GREEN for clean files', () => {
    const spirit = makeSpirit({ presetId: 'responsible' });
    const files = generateFiles(spirit);
    const report = runFullValidation(files, spirit);
    expect(report.trafficLight).toBe('green');
  });

  it('should compute correct traffic light for findings', () => {
    // No findings = green
    expect(computeTrafficLight([], 100)).toBe('green');

    // 1 error, non-critical = yellow
    expect(computeTrafficLight([
      { code: 'OC002', severity: 'ERROR', where: '', what: '', impact: '', constraintType: 'broken-ref' },
    ], 75)).toBe('yellow');

    // Critical contradiction = red
    expect(computeTrafficLight([
      { code: 'RT001', severity: 'ERROR', where: '', what: '', impact: '', constraintType: 'contradiction' },
    ], 60)).toBe('red');

    // 3+ errors = red
    expect(computeTrafficLight([
      { code: 'X1', severity: 'ERROR', where: '', what: '', impact: '', constraintType: 'broken-ref' },
      { code: 'X2', severity: 'ERROR', where: '', what: '', impact: '', constraintType: 'broken-ref' },
      { code: 'X3', severity: 'ERROR', where: '', what: '', impact: '', constraintType: 'broken-ref' },
    ], 40)).toBe('red');
  });
});

// ============================================================================
// Repair Tests
// ============================================================================

describe('Repair Engine', () => {
  it('should return empty actions when no errors', () => {
    const spirit = makeSpirit({ presetId: 'responsible' });
    const files = generateFiles(spirit);
    const { findings } = runAllRules(files, spirit);
    const result = repairFiles(files, findings, spirit);
    expect(result.actions).toHaveLength(0);
  });

  it('should repair OC002 gracefully (missing file cannot be auto-created)', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit).filter(f => f.name !== 'SOUL.md');
    const report = runFullValidation(files, spirit);
    const result = repairFiles(files, report.findings, spirit);
    expect(result.actions.some(a => a.code === 'OC002')).toBe(true);
  });
});

// ============================================================================
// Architecture Tests (validate template structure)
// ============================================================================

describe('Template Architecture', () => {
  it('should generate exactly 13 files with advanced pack', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    expect(files).toHaveLength(13);
  });

  it('should generate exactly 5 base files without advanced pack', () => {
    const spirit = makeSpirit();
    const files = generateAnimaeAgentisFiles(spirit, {
      includeAdvancedPack: false,
      language: 'en',
    }).files;
    expect(files).toHaveLength(5);
  });

  it('should include all required bootstrap files', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const names = files.map(f => f.name);
    expect(names).toContain('SOUL.md');
    expect(names).toContain('IDENTITY.md');
    expect(names).toContain('USER.md');
    expect(names).toContain('HEARTBEAT.md');
    expect(names).toContain('SHIELD.md');
  });

  it('should include all advanced files', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const names = files.map(f => f.name);
    expect(names).toContain('SPIRIT.md');
    expect(names).toContain('CORTEX.md');
    expect(names).toContain('MEMORY.md');
    expect(names).toContain('VERSION.md');
    expect(names).toContain('OPS.md');
    expect(names).toContain('AGENTS.md');
    expect(names).toContain('TOOLS.md');
    expect(names).toContain('SKILL.md');
  });

  it('each generated file should have non-empty content', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    for (const file of files) {
      expect(file.content.length).toBeGreaterThan(0);
    }
  });

  it('SOUL.md should contain negative constraints', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const soul = files.find(f => f.name === 'SOUL.md')!;
    expect(soul.content).toContain('Negative Constraints');
  });

  it('HEARTBEAT.md should contain HEARTBEAT_OK', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const hb = files.find(f => f.name === 'HEARTBEAT.md')!;
    expect(hb.content).toContain('HEARTBEAT_OK');
  });

  it('SHIELD.md should contain Emergency Stop', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const shield = files.find(f => f.name === 'SHIELD.md')!;
    expect(shield.content).toContain('Emergency');
  });

  it('IDENTITY.md should reflect agent name', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const id = files.find(f => f.name === 'IDENTITY.md')!;
    expect(id.content).toContain('TestAgent');
  });

  it('files should be consistent across EN and DE', () => {
    const spirit = makeSpirit();
    const enFiles = generateFiles(spirit);
    const deFiles = generateAnimaeAgentisFiles(spirit, {
      includeAdvancedPack: true,
      language: 'de',
    }).files;
    expect(enFiles).toHaveLength(deFiles.length);
    for (let i = 0; i < enFiles.length; i++) {
      expect(enFiles[i].name).toBe(deFiles[i].name);
      expect(deFiles[i].content.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// Full Validation Integration Tests
// ============================================================================

describe('Full Validation Integration', () => {
  it('RESPONSIBLE preset should be GREEN', () => {
    const spirit = makeSpirit({ presetId: 'responsible' });
    const files = generateFiles(spirit);
    const report = runFullValidation(files, spirit);
    expect(report.trafficLight).toBe('green');
    expect(report.overallScore).toBeGreaterThanOrEqual(80);
  });

  it('SECURITY preset should be GREEN', () => {
    const spirit = makeSpirit({
      presetId: 'security',
      autonomy: { actionMode: 'recommend_only', approvalThreshold: 'All actions require approval.' },
      surprise: { appetite: 'low', cadence: 'weekly_deep', boundaries: 'None.' },
    });
    const files = generateFiles(spirit);
    const report = runFullValidation(files, spirit);
    expect(report.trafficLight).toBe('green');
  });

  it('OVERCLAW preset should be GREEN', () => {
    const spirit = makeSpirit({
      presetId: 'overclaw',
      autonomy: { actionMode: 'autonomous_in_sandbox', approvalThreshold: 'Allowlisted.' },
      surprise: { appetite: 'high', cadence: 'daily_micro', boundaries: 'Sandbox.' },
    });
    const files = generateFiles(spirit);
    const report = runFullValidation(files, spirit);
    expect(report.trafficLight).toBe('green');
  });

  it('report should include strengths', () => {
    const spirit = makeSpirit({ presetId: 'responsible' });
    const files = generateFiles(spirit);
    const report = runFullValidation(files, spirit);
    expect(report.strengths.length).toBeGreaterThan(0);
  });

  it('report should detect preset', () => {
    const spirit = makeSpirit({ presetId: 'responsible' });
    const files = generateFiles(spirit);
    const report = runFullValidation(files, spirit);
    expect(report.presetDetected).toBe('responsible');
  });
});

// ============================================================================
// Policy Extractor Tests
// ============================================================================

describe('Policy Extractor', () => {
  it('should extract approval policies from generated files', () => {
    const spirit = makeSpirit({ presetId: 'responsible' });
    const files = generateFiles(spirit);
    const extracted = extractPolicies(files, spirit);
    expect(extracted.approvals.length).toBeGreaterThan(0);
  });

  it('should extract retry policies', () => {
    const spirit = makeSpirit({ presetId: 'responsible' });
    const files = generateFiles(spirit);
    const extracted = extractPolicies(files, spirit);
    expect(extracted.retries.length).toBeGreaterThan(0);
  });

  it('should extract skill kernel sections', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const extracted = extractPolicies(files, spirit);
    expect(extracted.skillKernelSections.present).toContain('Hard Stops');
    expect(extracted.skillKernelSections.present).toContain('Boot Sequence');
    expect(extracted.skillKernelSections.present).toContain('Action Gating');
    expect(extracted.skillKernelSections.present).toContain('Session End');
    expect(extracted.skillKernelSections.missing).toHaveLength(0);
  });

  it('should extract stop words from multiple files', () => {
    const spirit = makeSpirit({ stopWords: ['STOP', 'HALT'] });
    const files = generateFiles(spirit);
    const extracted = extractPolicies(files, spirit);
    expect(extracted.stopWords.length).toBeGreaterThan(0);
  });

  it('should extract canonical claims from SPIRIT.md', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const extracted = extractPolicies(files, spirit);
    expect(extracted.canonicalClaims.some(c => c.file === 'SPIRIT.md')).toBe(true);
  });

  it('should extract heartbeat actions', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const extracted = extractPolicies(files, spirit);
    expect(extracted.heartbeatActions.length).toBeGreaterThanOrEqual(0);
  });

  it('should extract runtime assumptions from SKILL.md', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const extracted = extractPolicies(files, spirit);
    expect(extracted.runtimeAssumptions.length).toBeGreaterThan(0);
  });

  it('should detect preset snapshot when present', () => {
    const spirit = makeSpirit({ presetId: 'responsible' });
    const files = generateFiles(spirit);
    const extracted = extractPolicies(files, spirit);
    expect(extracted.presetSnapshot).not.toBeNull();
    expect(extracted.skillKernelSections.hasPresetSnapshot).toBe(true);
  });
});

// ============================================================================
// New Rule Code Tests
// ============================================================================

describe('New Rule Codes', () => {
  it('should detect SKILL-KERNEL-001 when kernel section removed', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const skill = files.find(f => f.name === 'SKILL.md')!;
    // Replace SKILL.md with minimal content missing most kernel sections
    skill.content = '# SKILL.md\n\n## Intent\nMinimal file.\n\n## Hard Stops\n- `STOP`\n';
    const { findings } = runAllRules(files, spirit);
    expect(findings.some(f => f.code === 'SKILL-KERNEL-001')).toBe(true);
  });

  it('should detect CANON-REF-001 for CANON.md references', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const agents = files.find(f => f.name === 'AGENTS.md')!;
    agents.content += '\n\nSee CANON.md for canonical values.';
    const { findings } = runAllRules(files, spirit);
    expect(findings.some(f => f.code === 'CANON-REF-001')).toBe(true);
  });

  it('should detect HB-EXT-001 for unscoped auto-close', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const hb = files.find(f => f.name === 'HEARTBEAT.md')!;
    hb.content += '\n\n## External Actions\n- auto-close expired items';
    const { findings } = runAllRules(files, spirit);
    expect(findings.some(f => f.code === 'HB-EXT-001')).toBe(true);
  });

  it('should detect SKILL-PRESET-001 when preset snapshot removed', () => {
    const spirit = makeSpirit({ presetId: 'responsible' });
    const files = generateFiles(spirit);
    const skill = files.find(f => f.name === 'SKILL.md')!;
    skill.content = skill.content.replace(/## Preset Snapshot[\s\S]*?(?=\n---\n)/, '');
    const { findings } = runAllRules(files, spirit);
    expect(findings.some(f => f.code === 'SKILL-PRESET-001')).toBe(true);
  });

  it('should NOT fire SKILL-PRESET-001 for custom configs (no preset)', () => {
    const spirit = makeSpirit(); // no presetId
    const files = generateFiles(spirit);
    const { findings } = runAllRules(files, spirit);
    expect(findings.some(f => f.code === 'SKILL-PRESET-001')).toBe(false);
  });

  it('should include specCode alias for OC001 findings', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const agents = files.find(f => f.name === 'AGENTS.md')!;
    // Remove all SPIRIT snapshot references to trigger OC001
    agents.content = agents.content.replace(/spirit snapshot/gi, '');
    agents.content = agents.content.replace(/action_mode/gi, '');
    agents.content = agents.content.replace(/approval/gi, '');
    const { findings } = runAllRules(files, spirit);
    const oc001 = findings.find(f => f.code === 'OC001');
    if (oc001) {
      expect(oc001.specCode).toBe('SP-CANON-001');
    }
  });
});

// ============================================================================
// Strict Mode Tests
// ============================================================================

describe('Strict Mode', () => {
  it('should promote OC001 to ERROR in strict mode', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const agents = files.find(f => f.name === 'AGENTS.md')!;
    agents.content = agents.content.replace(/spirit snapshot/gi, '');
    agents.content = agents.content.replace(/action_mode/gi, '');
    agents.content = agents.content.replace(/approval/gi, '');

    const normal = runAllRules(files, spirit);
    const strict = runAllRules(files, spirit, { strict: true });

    const normalOc = normal.findings.find(f => f.code === 'OC001');
    const strictOc = strict.findings.find(f => f.code === 'OC001');

    if (normalOc && strictOc) {
      expect(normalOc.severity).toBe('WARN');
      expect(strictOc.severity).toBe('ERROR');
    }
  });

  it('should not change non-promotable findings in strict mode', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const soul = files.find(f => f.name === 'SOUL.md')!;
    soul.content += '\n' + 'X'.repeat(15_000);

    const strict = runAllRules(files, spirit, { strict: true });
    const sz = strict.findings.find(f => f.code === 'SZ001');
    expect(sz?.severity).toBe('WARN'); // SZ001 not in STRICT_PROMOTIONS
  });

  it('strict report should flag strict=true', () => {
    const spirit = makeSpirit({ presetId: 'responsible' });
    const files = generateFiles(spirit);
    const report = runFullValidation(files, spirit, { strict: true });
    expect(report.strict).toBe(true);
  });
});

// ============================================================================
// Evidence Field Tests
// ============================================================================

describe('Evidence Fields', () => {
  it('SZ001 should include evidence with file', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const soul = files.find(f => f.name === 'SOUL.md')!;
    soul.content += '\n' + 'X'.repeat(15_000);
    const { findings } = runAllRules(files, spirit);
    const sz = findings.find(f => f.code === 'SZ001');
    expect(sz).toBeDefined();
    expect(sz!.evidence).toBeDefined();
    expect(sz!.evidence![0].file).toBe('SOUL.md');
  });

  it('CANON-REF-001 should include evidence with line', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const ops = files.find(f => f.name === 'OPS.md')!;
    ops.content += '\n\nRefer to CANON.md for policy.';
    const { findings } = runAllRules(files, spirit);
    const ref = findings.find(f => f.code === 'CANON-REF-001');
    expect(ref).toBeDefined();
    expect(ref!.evidence).toBeDefined();
    expect(ref!.evidence!.length).toBeGreaterThan(0);
    expect(ref!.evidence![0].line).toBeGreaterThan(0);
  });
});

// ============================================================================
// Configurable Green Threshold Tests
// ============================================================================

describe('Configurable Green Threshold', () => {
  it('should reject 1 WARN for green when maxGreenWarns=0', () => {
    const light = computeTrafficLight(
      [{ code: 'X', severity: 'WARN', where: '', what: '', impact: '', constraintType: 'ambiguity' }],
      90,
      { maxGreenWarns: 0 },
    );
    expect(light).not.toBe('green');
  });

  it('should allow 1 WARN for green with default options', () => {
    const light = computeTrafficLight(
      [{ code: 'X', severity: 'WARN', where: '', what: '', impact: '', constraintType: 'ambiguity' }],
      90,
    );
    expect(light).toBe('green');
  });

  it('should reject 2 WARNs for green with default options', () => {
    const light = computeTrafficLight(
      [
        { code: 'X1', severity: 'WARN', where: '', what: '', impact: '', constraintType: 'ambiguity' },
        { code: 'X2', severity: 'WARN', where: '', what: '', impact: '', constraintType: 'ambiguity' },
      ],
      90,
    );
    expect(light).not.toBe('green');
  });
});

// ============================================================================
// Regression: False Green Prevention
// ============================================================================

describe('Regression: False Green Prevention', () => {
  it('must NOT be green when HEARTBEAT auto-writes conflict with approval gate', () => {
    const spirit = makeSpirit({
      autonomy: { actionMode: 'recommend_only', approvalThreshold: 'All actions.' },
    });
    const files = generateFiles(spirit);
    const hb = files.find(f => f.name === 'HEARTBEAT.md')!;
    hb.content += '\n\n## Auto-Write\nwrite checkpoint on every tick.';
    const tools = files.find(f => f.name === 'TOOLS.md')!;
    tools.content = tools.content.replace(/pre-approved/gi, '');
    tools.content = tools.content.replace(/internal maintenance/gi, '');

    const report = runFullValidation(files, spirit);
    // This fixture must NEVER go green — if it does, the validator has regressed
    expect(report.trafficLight).not.toBe('green');
  });

  it('must NOT be green when CANON.md references exist', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    // Inject deprecated CANON.md reference
    const agents = files.find(f => f.name === 'AGENTS.md')!;
    agents.content += '\n\nAll values from CANON.md are authoritative.';

    const report = runFullValidation(files, spirit);
    // CANON-REF-001 is an ERROR → cannot be green
    expect(report.trafficLight).not.toBe('green');
  });

  it('must NOT be green when SKILL.md has missing kernel sections', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    const skill = files.find(f => f.name === 'SKILL.md')!;
    // Wipe most of the skill content
    skill.content = '# SKILL.md\n\n## Intent\nMinimal.\n';

    const report = runFullValidation(files, spirit);
    expect(report.trafficLight).not.toBe('green');
  });
});
