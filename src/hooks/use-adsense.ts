import { useEffect } from 'react';
import type { AppView } from '../App';

/**
 * Content pages where AdSense ads are allowed.
 * Tool/app screens (interview, builder, export, presets) are excluded
 * to comply with AdSense policy: no ads on screens without substantial publisher content.
 */
const CONTENT_VIEWS: AppView[] = [
  'landing',
  'animae-verba',
  'usus',
  'how-it-works',
  'legal-impressum',
  'legal-privacy',
  'legal-tos',
];

export function useAdSense(currentView: AppView) {
  useEffect(() => {
    // Ensure adsbygoogle is initialised as an array (AdSense requirement)
    if (!Array.isArray(window.adsbygoogle)) {
      window.adsbygoogle = [];
    }

    if (CONTENT_VIEWS.includes(currentView)) {
      // Resume ad serving on content pages
      (window.adsbygoogle as unknown as Record<string, number>).pauseAdRequests = 0;
    } else {
      // Pause ads on tool/generator screens — no publisher content present
      (window.adsbygoogle as unknown as Record<string, number>).pauseAdRequests = 1;
    }
  }, [currentView]);
}

export { CONTENT_VIEWS };
