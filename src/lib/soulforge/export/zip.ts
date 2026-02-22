/**
 * ZIP Export
 * 
 * Creates ZIP archives of generated SoulForge files
 */

import type { GeneratedFile } from '../types';

/**
 * Create a ZIP file from generated files
 * Note: In browser environment, we use JSZip or similar library
 * This is a wrapper interface
 */
export interface ZipEntry {
  name: string;
  content: string;
}

/**
 * Create ZIP blob from files
 * Requires JSZip library in the browser
 */
export async function createZipBlob(files: GeneratedFile[]): Promise<Blob> {
  // Dynamically import JSZip (assuming it's installed)
  const JSZip = await import('jszip').then(m => m.default);
  const zip = new JSZip();
  
  // Add files to ZIP
  for (const file of files) {
    zip.file(file.name, file.content);
  }
  
  // Add README
  zip.file('README.txt', generateReadme(files));
  
  // Generate ZIP
  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}

/**
 * Generate ZIP using native browser APIs (fallback)
 * Creates a simple tar-like structure
 */
export function createSimpleArchive(files: GeneratedFile[]): string {
  // Simple concatenation format for fallback
  let archive = '# SoulForge Archive\n\n';
  
  for (const file of files) {
    archive += `## FILE: ${file.name}\n`;
    archive += '```markdown\n';
    archive += file.content;
    archive += '\n```\n\n';
  }
  
  return archive;
}

/**
 * Download files as individual downloads
 */
export function downloadIndividualFiles(
  files: GeneratedFile[],
  onDownload?: (fileName: string) => void
): void {
  files.forEach((file, index) => {
    setTimeout(() => {
      const blob = new Blob([file.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onDownload?.(file.name);
    }, index * 200);
  });
}

/**
 * Generate README for ZIP
 */
function generateReadme(files: GeneratedFile[]): string {
  const baseFiles = files.filter(f => f.section === 'base');
  const advancedFiles = files.filter(f => f.section === 'advanced');
  
  return `# OpenClaw SoulForge Configuration

Generated: ${new Date().toLocaleString()}

## Files Included

### Base Pack
${baseFiles.map(f => `- ${f.name}`).join('\n')}

${advancedFiles.length > 0 ? `### Advanced Pack
${advancedFiles.map(f => `- ${f.name}`).join('\n')}
` : ''}
## Usage

1. Extract all files to your agent workspace
2. Read SOUL.md first to understand core principles
3. Customize USER.md with your preferences
4. Start the agent with these configuration files

## Structure

- SOUL.md - Constitution (unchanging principles)
- IDENTITY.md - Who the agent is
- USER.md - How to work together
- HEARTBEAT.md - Operational rhythm
- SHIELD.md - Safety boundaries
${advancedFiles.length > 0 ? '- SPIRIT.md - Source of truth\n- CORTEX.md - Workspace map\n- MEMORY.md - Stable facts\n- VERSION.md - Version marker' : ''}

## Support

Visit https://openclaw.io for documentation and updates.
`;
}

/**
 * Trigger ZIP download
 */
export function downloadZip(blob: Blob, fileName?: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || `openclaw-soulforge-${Date.now()}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
