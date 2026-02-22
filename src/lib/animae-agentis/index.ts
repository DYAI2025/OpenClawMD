/**
 * Animae Agentis 1.2 Public API
 *
 * Main entry point for the Animae Agentis system.
 * Export all types, defaults, and utilities.
 */

// Types
export type {
  // Core Enums
  AgentMode,
  DomainFocus,
  TonePrecision,
  ToneMethod,
  ToneDirectness,
  ActionMode,
  SurpriseAppetite,
  SurpriseCadence,
  TruthPolicy,
  OutputFormat,
  ExplanationsPolicy,
  ConfidenceDisplay,
  AddressForm,
  
  // Interview
  InterviewPhase,
  InterviewTurn,
  InterviewState,
  
  // Spirit
  SpiritData,
  SpiritTone,
  SpiritAutonomy,
  SpiritSurprise,
  SpiritOutput,
  SpiritAddressing,
  
  // Generation
  GenerationOptions,
  GeneratedFile,
  AnimaeAgentisOutput,
  
  // Validation
  GateSeverity,
  GateIssue,
  ValidationReport,
  
  // Roles
  VibeCodingRole,
  
  // Preset
  PresetSpiritMapping,
  
  // Export/Import
  AnimaeAgentisExport,
  
  // Utilities
  FileName,
  BaseFileName,
  AdvancedFileName,
  TemplateVariables,
} from './types';

// Spirit defaults and utilities
export {
  ANIMAE_AGENTIS_VERSION,
  TEMPLATE_PACK_VERSION,
  RESONANCE_LAYER,
  
  DEFAULT_TONE,
  DEFAULT_ADDRESSING,
  DEFAULT_OUTPUT,
  
  SIDEKICK_DEFAULTS,
  CHIEF_OF_STAFF_DEFAULTS,
  COACH_DEFAULTS,
  
  VIBECODING_ROLES,
  DOMAIN_SUFFIXES,
  
  createEmptySpirit,
  getDefaultsForMode,
  getRolesForMode,
  generateAgentName,
  isSpiritComplete,
  mergeWithDefaults,
} from './spirit';

// Generator
export {
  generateAnimaeAgentisFiles,
  generateBasePack,
  generateAdvancedPack,
  generateSingleFile,
  getFileList,
  countFiles,
  calculateTotalSize,
  formatFileList,
  BASE_FILES,
  ADVANCED_FILES,
} from './generator';

// Validation
export {
  runQualityGates,
  validateFileCount,
  runResonanceGates,
  calculateResonanceScore,
} from './validation';

// Export
export {
  createZipBlob,
  createSimpleArchive,
  downloadIndividualFiles,
  downloadZip,
  exportToJson,
  parseJsonExport,
  validateExport,
  downloadJsonExport,
  readJsonFile,
  createShareableExport,
} from './export';

// Interview
export {
  getQuestionsForPhase,
  getVibeCodingQuestion,
  HANDSHAKE_QUESTIONS,
  DISCOVERY_QUESTIONS,
  TONE_QUESTIONS,
  CONSTITUTION_QUESTIONS,
  PULSE_QUESTIONS,
  GENERATION_QUESTIONS,
} from './interview/questions';

export {
  createInitialState,
  advancePhase,
  goBackPhase,
  updateCanon,
  addTurn,
  getNextPhase,
  getPreviousPhase,
  calculateProgress,
  canProceedFromPhase,
  getPhaseInfo,
  serializeState,
  deserializeState,
  PHASE_ORDER,
} from './interview/stateMachine';
