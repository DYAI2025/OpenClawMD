/**
 * Interview State Machine
 * 
 * Manages the flow through interview phases
 * Phases: HANDSHAKE → DISCOVERY → VIBECODING → CONSTITUTION → PULSE → GENERATION
 */

import type { InterviewPhase, InterviewState, InterviewTurn, CanonData } from '../types';

export const PHASE_ORDER: InterviewPhase[] = [
  'handshake',
  'discovery',
  'vibecoding',
  'constitution',
  'pulse',
  'generation',
];

export interface StateMachine {
  currentPhase: InterviewPhase;
  canProceed: boolean;
  canGoBack: boolean;
  progress: number;
}

/**
 * Get the next phase
 */
export function getNextPhase(current: InterviewPhase): InterviewPhase | null {
  const index = PHASE_ORDER.indexOf(current);
  if (index === -1 || index >= PHASE_ORDER.length - 1) {
    return null;
  }
  return PHASE_ORDER[index + 1];
}

/**
 * Get the previous phase
 */
export function getPreviousPhase(current: InterviewPhase): InterviewPhase | null {
  const index = PHASE_ORDER.indexOf(current);
  if (index <= 0) {
    return null;
  }
  return PHASE_ORDER[index - 1];
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(phase: InterviewPhase): number {
  const index = PHASE_ORDER.indexOf(phase);
  return Math.round((index / (PHASE_ORDER.length - 1)) * 100);
}

/**
 * Check if we can proceed from current phase
 */
export function canProceedFromPhase(
  phase: InterviewPhase,
  canon: Partial<CanonData>
): boolean {
  switch (phase) {
    case 'handshake':
      return !!canon.agentName || true; // Always can proceed from start
    case 'discovery':
      return !!canon.agentMode && !!canon.problemStatement;
    case 'vibecoding':
      return !!canon.agentTitle && !!canon.tone?.method;
    case 'constitution':
      return canon.negativeConstraints !== undefined && canon.negativeConstraints.length > 0;
    case 'pulse':
      return !!canon.autonomy?.actionMode && !!canon.surprise?.appetite;
    case 'generation':
      return true; // Always can proceed (or complete)
    default:
      return false;
  }
}

/**
 * Get phase display info
 */
export function getPhaseInfo(phase: InterviewPhase): {
  label: string;
  description: string;
  stepNumber: number;
} {
  const info: Record<InterviewPhase, { label: string; description: string }> = {
    handshake: {
      label: 'Start',
      description: 'Configuration options',
    },
    discovery: {
      label: 'Discovery',
      description: 'Your goals and context',
    },
    vibecoding: {
      label: 'Identity',
      description: 'Role and communication style',
    },
    constitution: {
      label: 'Principles',
      description: 'Hard boundaries',
    },
    pulse: {
      label: 'Operations',
      description: 'How you work together',
    },
    generation: {
      label: 'Review',
      description: 'Generate files',
    },
    validation: {
      label: 'Validation',
      description: 'Check consistency',
    },
    output: {
      label: 'Complete',
      description: 'Download configuration',
    },
  };

  const index = PHASE_ORDER.indexOf(phase);
  return {
    ...info[phase],
    stepNumber: index + 1,
  };
}

/**
 * Create initial interview state
 */
export function createInitialState(): InterviewState {
  const now = new Date().toISOString();
  return {
    phase: 'handshake',
    canon: {},
    history: [],
    startedAt: now,
    updatedAt: now,
  };
}

/**
 * Add a turn to history
 */
export function addTurn(
  state: InterviewState,
  question: string,
  answer: string
): InterviewState {
  const turn: InterviewTurn = {
    phase: state.phase,
    question,
    answer,
    timestamp: new Date().toISOString(),
  };

  return {
    ...state,
    history: [...state.history, turn],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Advance to next phase
 */
export function advancePhase(state: InterviewState): InterviewState {
  const next = getNextPhase(state.phase);
  if (!next) return state;

  return {
    ...state,
    phase: next,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Go back to previous phase
 */
export function goBackPhase(state: InterviewState): InterviewState {
  const prev = getPreviousPhase(state.phase);
  if (!prev) return state;

  return {
    ...state,
    phase: prev,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Update canon data
 */
export function updateCanon(
  state: InterviewState,
  updates: Partial<CanonData>
): InterviewState {
  return {
    ...state,
    canon: {
      ...state.canon,
      ...updates,
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Serialize state for storage
 */
export function serializeState(state: InterviewState): string {
  return JSON.stringify(state);
}

/**
 * Deserialize state from storage
 */
export function deserializeState(serialized: string): InterviewState | null {
  try {
    const parsed = JSON.parse(serialized);
    // Basic validation
    if (parsed.phase && parsed.canon !== undefined) {
      return parsed as InterviewState;
    }
    return null;
  } catch {
    return null;
  }
}
