/**
 * Validator Tests
 *
 * Tests the validation rules, scoring, traffic light, and repair engine.
 * Architecture tests validate template structure only when relevant.
 */

import { describe, it, expect } from 'vitest';
import type { SpiritData, GeneratedFile } from '../types';
import { generateAnimaeAgentisFiles } from '../generator';
import { runFullValidation, repairFiles } from '../validation';
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
  it('should generate exactly 12 files with advanced pack', () => {
    const spirit = makeSpirit();
    const files = generateFiles(spirit);
    expect(files).toHaveLength(12);
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
