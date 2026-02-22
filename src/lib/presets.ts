import type { SpiritData } from './soulforge/types';

export interface PresetDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  color: 'peach' | 'mint' | 'coral' | 'sage';
  spirit: Partial<SpiritData>;
  metadata: {
    riskProfile: 'low' | 'medium' | 'high';
    autonomyLevel: 'minimal' | 'moderate' | 'maximum';
    useCases: string[];
  };
}

const SECURITY_PRESET: PresetDefinition = {
  id: 'security',
  name: 'SECURITY',
  tagline: 'Maximum safety. Minimal risk. Human in control.',
  description: 'The SECURITY preset prioritizes safety above all else. Every action requires explicit approval, and the system operates with minimal autonomy. Ideal for sensitive environments where human oversight is paramount.',
  color: 'peach',
  spirit: {
    agentMode: 'sidekick',
    tone: { precision: 'explanatory', method: 'instructional', directness: 'gentle' },
    autonomy: {
      actionMode: 'recommend_only',
      approvalThreshold: 'ALL actions require explicit approval.',
    },
    surprise: { appetite: 'low', cadence: 'trigger', boundaries: 'No surprises; proposals only, no irreversible actions.' },
    truthPolicy: 'mark_uncertainty',
    output: { format: 'options_tradeoffs', explanations: 'detailed_by_default', confidenceDisplay: 'calibrated' },
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

const RESPONSIBLE_PRESET: PresetDefinition = {
  id: 'responsible',
  name: 'Responsible',
  tagline: 'Careful growth. Iterative evolution. Shared reflection.',
  description: 'The Responsible preset strikes a balance between autonomy and oversight. The system can propose initiatives and handle moderate uncertainty, but key decisions still involve human collaboration.',
  color: 'mint',
  spirit: {
    agentMode: 'sidekick',
    tone: { precision: 'minimalist', method: 'socratic', directness: 'direct' },
    autonomy: {
      actionMode: 'execute_with_approval',
      approvalThreshold: 'Significant actions require approval.',
    },
    surprise: { appetite: 'medium', cadence: 'weekly_deep', boundaries: 'No personal data, no outreach, no destructive actions.' },
    truthPolicy: 'calibrated_confidence',
    output: { format: 'result_plus_plan', explanations: 'brief_by_default', confidenceDisplay: 'low_med_high' },
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

const OVERCLAW_PRESET: PresetDefinition = {
  id: 'overclaw',
  name: 'OverClaw',
  tagline: 'Speed. Strategy. Emergence.',
  description: 'The OverClaw preset unleashes maximum autonomy. The system can act strategically, handle high uncertainty, and execute with minimal human intervention. Use with caution and clear monitoring.',
  color: 'coral',
  spirit: {
    agentMode: 'chief-of-staff',
    tone: { precision: 'minimalist', method: 'instructional', directness: 'direct' },
    autonomy: {
      actionMode: 'autonomous_in_sandbox',
      approvalThreshold: 'Any external communication, upload, deletion, or privilege change requires approval.',
    },
    surprise: { appetite: 'high', cadence: 'daily_micro', boundaries: 'Surprise must be operationally relevant; no outreach; propose smallest next step.' },
    truthPolicy: 'calibrated_confidence',
    output: { format: 'result_plus_plan', explanations: 'on_request_only', confidenceDisplay: 'calibrated' },
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

export const PRESETS: PresetDefinition[] = [SECURITY_PRESET, RESPONSIBLE_PRESET, OVERCLAW_PRESET];

export function getPresetById(id: string): PresetDefinition | undefined {
  return PRESETS.find(p => p.id === id);
}

export function getAllPresets(): PresetDefinition[] {
  return PRESETS;
}

export function getRiskProfileColor(profile: 'low' | 'medium' | 'high'): string {
  switch (profile) {
    case 'low': return 'bg-clay-peach text-clay-charcoal';
    case 'medium': return 'bg-clay-mint text-clay-charcoal';
    case 'high': return 'bg-clay-coral text-white';
    default: return 'bg-clay-stone text-clay-charcoal';
  }
}

export function getAutonomyLevelColor(level: 'minimal' | 'moderate' | 'maximum'): string {
  switch (level) {
    case 'minimal': return 'bg-clay-sand text-clay-charcoal';
    case 'moderate': return 'bg-clay-sage text-clay-charcoal';
    case 'maximum': return 'bg-clay-coral text-white';
    default: return 'bg-clay-stone text-clay-charcoal';
  }
}
