/**
 * SoulForge Generator Tests
 * 
 * Positive tests for the SoulForge file generation system
 */

import { describe, it, expect } from 'vitest';
import { generateSoulForgeFiles, generateBasePack, generateAdvancedPack, BASE_FILES, ADVANCED_FILES } from '../generator';
import { createEmptySpirit, mergeWithDefaults, SOULFORGE_VERSION } from '../canon';
import type { SpiritData } from '../types';

describe('SoulForge Generator', () => {
  
  describe('generateSoulForgeFiles', () => {
    it('should generate all 9 files with Advanced Pack enabled', () => {
      // Arrange
      const canon = mergeWithDefaults({
        agentName: 'Test Agent',
        agentTitle: 'Principal Test Architect',
        agentMode: 'sidekick',
      }) as SpiritData;
      
      const options = {
        includeAdvancedPack: true,
        language: 'en' as const,
      };
      
      // Act
      const result = generateSoulForgeFiles(canon, options);
      
      // Assert
      expect(result.files).toHaveLength(9);
      expect(result.canon).toBe(canon);
      expect(result.options).toBe(options);
      expect(result.generatedAt).toBeDefined();
      
      // Check all expected files are present
      const fileNames = result.files.map(f => f.name);
      expect(fileNames).toContain('SOUL.md');
      expect(fileNames).toContain('IDENTITY.md');
      expect(fileNames).toContain('USER.md');
      expect(fileNames).toContain('HEARTBEAT.md');
      expect(fileNames).toContain('SHIELD.md');
      expect(fileNames).toContain('CANON.md');
      expect(fileNames).toContain('INDEX.md');
      expect(fileNames).toContain('MEMORY.md');
      expect(fileNames).toContain('VERSION.md');
    });
    
    it('should generate only 5 files with Advanced Pack disabled', () => {
      // Arrange
      const canon = mergeWithDefaults({
        agentName: 'Test Agent',
        agentTitle: 'Principal Test Architect',
        agentMode: 'chief-of-staff',
      }) as SpiritData;
      
      const options = {
        includeAdvancedPack: false,
        language: 'en' as const,
      };
      
      // Act
      const result = generateSoulForgeFiles(canon, options);
      
      // Assert
      expect(result.files).toHaveLength(5);
      
      // Check only base files are present
      const fileNames = result.files.map(f => f.name);
      expect(fileNames).toContain('SOUL.md');
      expect(fileNames).toContain('IDENTITY.md');
      expect(fileNames).toContain('USER.md');
      expect(fileNames).toContain('HEARTBEAT.md');
      expect(fileNames).toContain('SHIELD.md');
      expect(fileNames).not.toContain('CANON.md');
    });
    
    it('should generate files with German language content', () => {
      // Arrange
      const canon = mergeWithDefaults({
        agentName: 'Test Agent',
        agentTitle: 'Principal Test Architect',
        agentMode: 'coach',
      }) as SpiritData;
      
      const options = {
        includeAdvancedPack: false,
        language: 'de' as const,
      };
      
      // Act
      const result = generateSoulForgeFiles(canon, options);
      const soulFile = result.files.find(f => f.name === 'SOUL.md');
      
      // Assert
      expect(soulFile).toBeDefined();
      expect(soulFile!.content).toContain('Verfassung');
      expect(soulFile!.content).toContain('Wahrheitspolitik');
      expect(soulFile!.content).toContain('NIEMALS');
    });
    
    it('should include Canon data in generated files', () => {
      // Arrange
      const canon = mergeWithDefaults({
        agentName: 'OpenClaw Soulforge — Engineering',
        agentTitle: 'Principal Discovery Architect',
        agentMode: 'sidekick',
        tone: {
          precision: 'minimalist',
          method: 'socratic',
          directness: 'direct',
        },
      }) as SpiritData;
      
      const options = {
        includeAdvancedPack: true,
        language: 'en' as const,
      };
      
      // Act
      const result = generateSoulForgeFiles(canon, options);
      const identityFile = result.files.find(f => f.name === 'IDENTITY.md');
      
      // Assert
      expect(identityFile).toBeDefined();
      expect(identityFile!.content).toContain('OpenClaw Soulforge — Engineering');
      expect(identityFile!.content).toContain('Principal Discovery Architect');
      expect(identityFile!.content).toContain('minimalist');
      expect(identityFile!.content).toContain('socratic');
    });
    
    it('should include Resonance Anchor in CANON.md', () => {
      // Arrange
      const canon = mergeWithDefaults({
        agentName: 'Test Agent',
        agentTitle: 'Test Title',
        agentMode: 'sidekick',
        truthPolicy: 'calibrated_confidence',
        autonomy: {
          actionMode: 'recommend_only',
          approvalThreshold: 'Test threshold',
        },
      }) as SpiritData;
      
      const options = {
        includeAdvancedPack: true,
        language: 'en' as const,
      };
      
      // Act
      const result = generateSoulForgeFiles(canon, options);
      const canonFile = result.files.find(f => f.name === 'CANON.md');
      
      // Assert
      expect(canonFile).toBeDefined();
      expect(canonFile!.content).toContain('Resonance Anchor');
      expect(canonFile!.content).toContain('Single Source of Truth');
      expect(canonFile!.content).toContain('Test Agent');
      expect(canonFile!.content).toContain('calibrated_confidence');
    });
  });
  
  describe('generateBasePack', () => {
    it('should generate exactly 5 base files', () => {
      // Arrange
      const canon = mergeWithDefaults({}) as SpiritData;
      
      // Act
      const files = generateBasePack(canon, 'en');
      
      // Assert
      expect(files).toHaveLength(5);
      expect(files.every(f => f.section === 'base')).toBe(true);
      expect(files.map(f => f.name).sort()).toEqual([...BASE_FILES].sort());
    });
    
    it('should generate valid SOUL.md with required sections', () => {
      // Arrange
      const canon = mergeWithDefaults({}) as SpiritData;
      
      // Act
      const files = generateBasePack(canon, 'en');
      const soul = files.find(f => f.name === 'SOUL.md');
      
      // Assert
      expect(soul).toBeDefined();
      expect(soul!.content).toContain('## Intent');
      expect(soul!.content).toContain('## Invariants');
      expect(soul!.content).toContain('## Truth Policy');
      expect(soul!.content).toContain('## Negative Constraints');
      expect(soul!.content).toContain('## Interfaces');
      expect(soul!.content).toContain('## Checks');
    });
    
    it('should generate valid IDENTITY.md with required sections', () => {
      // Arrange
      const canon = mergeWithDefaults({
        agentName: 'Test',
        agentTitle: 'Test Title',
      }) as SpiritData;
      
      // Act
      const files = generateBasePack(canon, 'en');
      const identity = files.find(f => f.name === 'IDENTITY.md');
      
      // Assert
      expect(identity).toBeDefined();
      expect(identity!.content).toContain('## Intent');
      expect(identity!.content).toContain('## Name');
      expect(identity!.content).toContain('## Professional Title');
      expect(identity!.content).toContain('## Tone');
      expect(identity!.content).toContain('Test');
    });
  });
  
  describe('generateAdvancedPack', () => {
    it('should generate exactly 4 advanced files', () => {
      // Arrange
      const canon = mergeWithDefaults({}) as SpiritData;
      
      // Act
      const files = generateAdvancedPack(canon, 'en');
      
      // Assert
      expect(files).toHaveLength(4);
      expect(files.every(f => f.section === 'advanced')).toBe(true);
      expect(files.map(f => f.name).sort()).toEqual([...ADVANCED_FILES].sort());
    });
    
    it('should include version info in VERSION.md', () => {
      // Arrange
      const canon = mergeWithDefaults({}) as SpiritData;
      
      // Act
      const files = generateAdvancedPack(canon, 'en');
      const version = files.find(f => f.name === 'VERSION.md');
      
      // Assert
      expect(version).toBeDefined();
      expect(version!.content).toContain(SOULFORGE_VERSION);
      expect(version!.content).toContain('Resonance Layer');
    });
    
    it('should generate INDEX.md with file structure', () => {
      // Arrange
      const canon = mergeWithDefaults({}) as SpiritData;
      
      // Act
      const files = generateAdvancedPack(canon, 'en');
      const index = files.find(f => f.name === 'INDEX.md');
      
      // Assert
      expect(index).toBeDefined();
      expect(index!.content).toContain('Core Config Files');
      expect(index!.content).toContain('SOUL.md');
      expect(index!.content).toContain('Directories');
      expect(index!.content).toContain('Naming conventions');
    });
  });
  
  describe('Resonance (cross-file consistency)', () => {
    it('should have consistent agent name across all files', () => {
      // Arrange
      const agentName = 'Consistent Test Agent';
      const canon = mergeWithDefaults({
        agentName,
        agentTitle: 'Test Title',
      }) as SpiritData;
      
      // Act
      const result = generateSoulForgeFiles(canon, { includeAdvancedPack: true, language: 'en' });
      
      // Assert
      const identity = result.files.find(f => f.name === 'IDENTITY.md');
      const canonFile = result.files.find(f => f.name === 'CANON.md');
      const memory = result.files.find(f => f.name === 'MEMORY.md');
      
      expect(identity!.content).toContain(agentName);
      expect(canonFile!.content).toContain(agentName);
      expect(memory!.content).toContain(agentName);
    });
    
    it('should have consistent autonomy settings across USER, HEARTBEAT, and SHIELD', () => {
      // Arrange
      const canon = mergeWithDefaults({
        autonomy: {
          actionMode: 'execute_with_approval',
          approvalThreshold: 'Custom threshold for testing',
        },
      }) as SpiritData;
      
      // Act
      const result = generateSoulForgeFiles(canon, { includeAdvancedPack: false, language: 'en' });
      
      // Assert
      const user = result.files.find(f => f.name === 'USER.md');
      const shield = result.files.find(f => f.name === 'SHIELD.md');
      
      expect(user!.content).toContain('execute_with_approval');
      expect(shield!.content).toContain('execute_with_approval');
    });
  });
  
  describe('Edge Cases', () => {
    it('should handle empty negative constraints gracefully', () => {
      // Arrange
      const canon = mergeWithDefaults({
        negativeConstraints: [],
      }) as SpiritData;
      
      // Act
      const result = generateSoulForgeFiles(canon, { includeAdvancedPack: false, language: 'en' });
      const soul = result.files.find(f => f.name === 'SOUL.md');
      
      // Assert
      expect(soul).toBeDefined();
      expect(soul!.content).toContain('Negative Constraints');
    });
    
    it('should handle custom stop words', () => {
      // Arrange
      const canon = mergeWithDefaults({
        stopWords: ['HALT', 'STOP', 'ABORT', 'CUSTOM'],
      }) as SpiritData;
      
      // Act
      const result = generateSoulForgeFiles(canon, { includeAdvancedPack: false, language: 'en' });
      const user = result.files.find(f => f.name === 'USER.md');
      const shield = result.files.find(f => f.name === 'SHIELD.md');
      
      // Assert
      expect(user!.content).toContain('CUSTOM');
      expect(shield!.content).toContain('CUSTOM');
    });
  });
});
