/**
 * VERSION.md Template
 * 
 * Version & Migration Marker
 * - Skill Version
 * - Template Pack Version
 * - Resonance Layer
 */

import type { SpiritData } from '../types';
import { ANIMAE_AGENTIS_VERSION, TEMPLATE_PACK_VERSION, RESONANCE_LAYER } from '../spirit';

export function renderVersionMd(_canon: SpiritData, language: 'en' | 'de' = 'en'): string {
  if (language === 'de') {
    return renderGerman();
  }
  return renderEnglish();
}

function renderEnglish(): string {
  return `# VERSION.md

OpenClaw Animae Agentis Skill Version: ${ANIMAE_AGENTIS_VERSION}
Template Pack Version: ${TEMPLATE_PACK_VERSION}
Resonance Layer: ${RESONANCE_LAYER}

## Version History

<!-- Update this section when upgrading -->

### Current
- Skill: ${ANIMAE_AGENTIS_VERSION}
- Templates: ${TEMPLATE_PACK_VERSION}
- Resonance: ${RESONANCE_LAYER}

### Check Compatibility

To check if your workspace is compatible:

1. Compare Skill Version: Should match exactly for full compatibility
2. Compare Template Pack: Updates recommended but not required
3. Compare Resonance Layer: Must match for cross-file consistency

### Upgrade Notes

<!-- Add notes here when upgrading -->

_No upgrades recorded yet._

---
Generated: ${new Date().toISOString()}
`;
}

function renderGerman(): string {
  return `# VERSION.md

OpenClaw Animae Agentis Skill Version: ${ANIMAE_AGENTIS_VERSION}
Template Pack Version: ${TEMPLATE_PACK_VERSION}
Resonance Layer: ${RESONANCE_LAYER}

## Versions-Historie

<!-- Diesen Abschnitt bei Updaten aktualisieren -->

### Aktuell
- Skill: ${ANIMAE_AGENTIS_VERSION}
- Templates: ${TEMPLATE_PACK_VERSION}
- Resonance: ${RESONANCE_LAYER}

### Kompatibilität prüfen

Um zu prüfen, ob dein Workspace kompatibel ist:

1. Skill-Version vergleichen: Sollte exakt übereinstimmen für volle Kompatibilität
2. Template Pack vergleichen: Updates empfohlen aber nicht erforderlich
3. Resonance Layer vergleichen: Muss übereinstimmen für Cross-File-Konsistenz

### Upgrade-Hinweise

<!-- Hinweise hier hinzufügen beim Upgraden -->

_Noch keine Upgrades aufgezeichnet._

---
Generiert: ${new Date().toISOString()}
`;
}
