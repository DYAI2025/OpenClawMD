import type { OpenClawConfigType, DimensionConfigType, PresetIdType } from './schema';

// Preset Definitions
export interface PresetDefinition {
  id: PresetIdType;
  name: string;
  tagline: string;
  description: string;
  color: 'peach' | 'mint' | 'coral' | 'sage';
  dimensions: DimensionConfigType;
  metadata: {
    riskProfile: 'low' | 'medium' | 'high';
    autonomyLevel: 'minimal' | 'moderate' | 'maximum';
    useCases: string[];
  };
}

// SECURITY Preset - Maximum safety
const SECURITY_PRESET: PresetDefinition = {
  id: 'security',
  name: 'SECURITY',
  tagline: 'Maximum safety. Minimal risk. Human in control.',
  description: 'The SECURITY preset prioritizes safety above all else. Every action requires explicit approval, and the system operates with minimal autonomy. Ideal for sensitive environments where human oversight is paramount.',
  color: 'peach',
  dimensions: {
    riskTolerance: 1,
    approvalThreshold: 5,
    heartbeatAggressiveness: 2,
    strategicInitiative: 1,
    dataAccessScope: 2,
    communicationAuthority: 1,
    uncertaintyHandling: 1,
    executionScope: 1,
  },
  metadata: {
    riskProfile: 'low',
    autonomyLevel: 'minimal',
    useCases: [
      'Production systems with sensitive data',
      'Regulated industries (finance, healthcare)',
      'High-stakes decision environments',
      'New team members or untrusted contexts',
    ],
  },
};

// OPEN Preset - Balanced growth
const OPEN_PRESET: PresetDefinition = {
  id: 'open',
  name: 'OPEN',
  tagline: 'Careful growth. Iterative evolution. Shared reflection.',
  description: 'The OPEN preset strikes a balance between autonomy and oversight. The system can propose initiatives and handle moderate uncertainty, but key decisions still involve human collaboration.',
  color: 'mint',
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
    riskProfile: 'medium',
    autonomyLevel: 'moderate',
    useCases: [
      'General development workflows',
      'Research and exploration projects',
      'Team collaboration environments',
      'Iterative improvement processes',
    ],
  },
};

// CRAZY (Overclaw) Preset - Maximum speed
const CRAZY_PRESET: PresetDefinition = {
  id: 'crazy',
  name: 'CRAZY',
  tagline: 'Speed. Strategy. Emergence.',
  description: 'The CRAZY preset (also known as Overclaw) unleashes maximum autonomy. The system can act strategically, handle high uncertainty, and execute with minimal human intervention. Use with caution and clear monitoring.',
  color: 'coral',
  dimensions: {
    riskTolerance: 5,
    approvalThreshold: 3,  // was 2 — raised to satisfy LEGAL_BOUNDARY_001 (Risk 5 + Approval ≤2 blocked)
    heartbeatAggressiveness: 5,
    strategicInitiative: 5,
    dataAccessScope: 5,
    communicationAuthority: 4,
    uncertaintyHandling: 4,
    executionScope: 4,
  },
  metadata: {
    riskProfile: 'high',
    autonomyLevel: 'maximum',
    useCases: [
      'Rapid prototyping and experimentation',
      'Well-monitored sandbox environments',
      'Trusted autonomous agents',
      'High-velocity startup contexts',
    ],
  },
};

// Preset Registry
export const PRESETS: Record<PresetIdType, PresetDefinition> = {
  security: SECURITY_PRESET,
  open: OPEN_PRESET,
  crazy: CRAZY_PRESET,
  custom: {
    id: 'custom',
    name: 'CUSTOM',
    tagline: 'Your configuration. Your rules.',
    description: 'A custom configuration built from the 8 dimensions. Fine-tune each parameter to match your exact requirements.',
    color: 'sage',
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
      riskProfile: 'medium',
      autonomyLevel: 'moderate',
      useCases: ['Custom tailored scenarios'],
    },
  },
};

// Helper functions
export function getPresetById(id: PresetIdType): PresetDefinition {
  return PRESETS[id] || PRESETS.open;
}

export function getAllPresets(): PresetDefinition[] {
  return [SECURITY_PRESET, OPEN_PRESET, CRAZY_PRESET];
}

export function createConfigFromPreset(presetId: PresetIdType): OpenClawConfigType {
  const preset = getPresetById(presetId);
  return {
    presetId,
    dimensions: { ...preset.dimensions },
    metadata: {
      name: preset.name,
      description: preset.description,
      version: '1.0.0',
    },
  };
}

export function detectPresetFromDimensions(dimensions: DimensionConfigType): PresetIdType {
  const presets = getAllPresets();
  
  for (const preset of presets) {
    const dims = preset.dimensions;
    const matches = 
      dims.riskTolerance === dimensions.riskTolerance &&
      dims.approvalThreshold === dimensions.approvalThreshold &&
      dims.heartbeatAggressiveness === dimensions.heartbeatAggressiveness &&
      dims.strategicInitiative === dimensions.strategicInitiative &&
      dims.dataAccessScope === dimensions.dataAccessScope &&
      dims.communicationAuthority === dimensions.communicationAuthority &&
      dims.uncertaintyHandling === dimensions.uncertaintyHandling &&
      dims.executionScope === dimensions.executionScope;
    
    if (matches) {
      return preset.id;
    }
  }
  
  return 'custom';
}

// Risk profile badge colors
export function getRiskProfileColor(profile: 'low' | 'medium' | 'high'): string {
  switch (profile) {
    case 'low':
      return 'bg-clay-peach text-clay-charcoal';
    case 'medium':
      return 'bg-clay-mint text-clay-charcoal';
    case 'high':
      return 'bg-clay-coral text-white';
    default:
      return 'bg-clay-stone text-clay-charcoal';
  }
}

// Autonomy level badge colors
export function getAutonomyLevelColor(level: 'minimal' | 'moderate' | 'maximum'): string {
  switch (level) {
    case 'minimal':
      return 'bg-clay-sand text-clay-charcoal';
    case 'moderate':
      return 'bg-clay-sage text-clay-charcoal';
    case 'maximum':
      return 'bg-clay-coral text-white';
    default:
      return 'bg-clay-stone text-clay-charcoal';
  }
}
