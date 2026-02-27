import { useEffect } from 'react';
import type { AppView } from '../App';

/**
 * Content pages where AdSense ads are allowed.
 * Tool/app screens (interview, builder, export, presets) are excluded
 * to comply with AdSense policy: no ads on screens without publisher content.
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
    const adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle = adsbygoogle;

    if (CONTENT_VIEWS.includes(currentView)) {
      adsbygoogle.pauseAdRequests = 0;
    } else {
      adsbygoogle.pauseAdRequests = 1;
    }
  }, [currentView]);
}
