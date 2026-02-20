import { z } from 'zod';

// Dimension Levels (1-5 scale)
export const DimensionLevel = z.number().int().min(1).max(5);

// Dimension Names
export const DimensionNames = [
  'riskTolerance',
  'approvalThreshold',
  'heartbeatAggressiveness',
  'strategicInitiative',
  'dataAccessScope',
  'communicationAuthority',
  'uncertaintyHandling',
  'executionScope',
] as const;

export type DimensionName = typeof DimensionNames[number];

// Preset IDs
export const PresetId = z.enum(['security', 'open', 'crazy', 'custom']);
export type PresetIdType = z.infer<typeof PresetId>;

// Dimension Configuration
export const DimensionConfig = z.object({
  riskTolerance: DimensionLevel,
  approvalThreshold: DimensionLevel,
  heartbeatAggressiveness: DimensionLevel,
  strategicInitiative: DimensionLevel,
  dataAccessScope: DimensionLevel,
  communicationAuthority: DimensionLevel,
  uncertaintyHandling: DimensionLevel,
  executionScope: DimensionLevel,
});

export type DimensionConfigType = z.infer<typeof DimensionConfig>;

// Complete Configuration
export const OpenClawConfig = z.object({
  presetId: PresetId,
  dimensions: DimensionConfig,
  metadata: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    createdAt: z.string().datetime().optional(),
    version: z.string().default('1.0.0'),
  }),
});

export type OpenClawConfigType = z.infer<typeof OpenClawConfig>;

// Legal Boundary Validation
export interface LegalValidationResult {
  valid: boolean;
  violations: LegalViolation[];
}

export interface LegalViolation {
  code: string;
  message: string;
  field?: DimensionName;
  severity: 'error' | 'warning';
}

// Hard Policy Gates - These are NON-NEGOTIABLE
const HARD_POLICY_RULES = [
  {
    code: 'LEGAL_BOUNDARY_001',
    message: 'Configuration cannot bypass security controls or legal requirements',
    check: (config: DimensionConfigType): boolean => {
      // Risk tolerance 5 with low approval is a red flag
      if (config.riskTolerance === 5 && config.approvalThreshold <= 2) {
        return false;
      }
      return true;
    },
  },
  {
    code: 'LEGAL_BOUNDARY_002',
    message: 'Maximum autonomy requires explicit human oversight mechanisms',
    check: (config: DimensionConfigType): boolean => {
      // High execution scope with low approval threshold
      if (config.executionScope >= 4 && config.approvalThreshold <= 2) {
        return false;
      }
      return true;
    },
  },
  {
    code: 'LEGAL_BOUNDARY_003',
    message: 'Data access scope must align with communication authority',
    check: (config: DimensionConfigType): boolean => {
      // High data access with low communication authority is inconsistent
      if (config.dataAccessScope >= 4 && config.communicationAuthority <= 2) {
        return false;
      }
      return true;
    },
  },
  {
    code: 'LEGAL_BOUNDARY_004',
    message: 'Destructive operations require explicit approval mechanisms',
    check: (config: DimensionConfigType): boolean => {
      // High risk + high execution without proper approval
      if (config.riskTolerance >= 4 && 
          config.executionScope >= 4 && 
          config.approvalThreshold <= 2) {
        return false;
      }
      return true;
    },
  },
];

export function validateLegalBoundaries(config: DimensionConfigType): LegalValidationResult {
  const violations: LegalViolation[] = [];

  for (const rule of HARD_POLICY_RULES) {
    if (!rule.check(config)) {
      violations.push({
        code: rule.code,
        message: rule.message,
        severity: 'error',
      });
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

export function validateConfig(config: unknown): { success: boolean; errors?: z.ZodError; legal?: LegalValidationResult } {
  const parsed = OpenClawConfig.safeParse(config);
  
  if (!parsed.success) {
    return { success: false, errors: parsed.error };
  }

  const legal = validateLegalBoundaries(parsed.data.dimensions);
  
  return {
    success: legal.valid,
    legal,
  };
}

// Dimension Labels and Descriptions
export const DimensionInfo: Record<DimensionName, { label: string; description: string; lowLabel: string; highLabel: string }> = {
  riskTolerance: {
    label: 'Risk Tolerance',
    description: 'How much uncertainty and potential downside the system accepts',
    lowLabel: 'Conservative',
    highLabel: 'Aggressive',
  },
  approvalThreshold: {
    label: 'Approval Threshold',
    description: 'Level of human oversight required before action',
    lowLabel: 'Autonomous',
    highLabel: 'Always Ask',
  },
  heartbeatAggressiveness: {
    label: 'Heartbeat Aggressiveness',
    description: 'Frequency and proactivity of system check-ins',
    lowLabel: 'Passive',
    highLabel: 'Proactive',
  },
  strategicInitiative: {
    label: 'Strategic Initiative',
    description: 'Ability to propose and pursue long-term goals',
    lowLabel: 'Reactive',
    highLabel: 'Strategic',
  },
  dataAccessScope: {
    label: 'Data Access Scope',
    description: 'Breadth of data the system can access and analyze',
    lowLabel: 'Minimal',
    highLabel: 'Comprehensive',
  },
  communicationAuthority: {
    label: 'Communication Authority',
    description: 'Autonomy in external communications',
    lowLabel: 'Restricted',
    highLabel: 'Authorized',
  },
  uncertaintyHandling: {
    label: 'Uncertainty Handling',
    description: 'How the system behaves when confidence is low',
    lowLabel: 'Halt & Ask',
    highLabel: 'Best Effort',
  },
  executionScope: {
    label: 'Execution Scope',
    description: 'Range of actions the system can perform independently',
    lowLabel: 'Read-Only',
    highLabel: 'Full Control',
  },
};

// Default empty config
export const createEmptyConfig = (): OpenClawConfigType => ({
  presetId: 'custom',
  dimensions: {
    riskTolerance: 3,
    approvalThreshold: 3,
    heartbeatAggressiveness: 3,
    strategicInitiative: 3,
    dataAccessScope: 3,
    communicationAuthority: 3,
    uncertaintyHandling: 3,
    executionScope: 3,
  },
  metadata: {
    name: 'Custom Configuration',
    description: '',
    version: '1.0.0',
  },
});
