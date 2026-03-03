import { useEffect, useRef } from 'react';

/**
 * AdSenseUnit — renders a Google AdSense ad slot.
 *
 * ⚠️  Replace the placeholder slot IDs in AD_SLOTS below with real slot IDs
 *     from your AdSense dashboard before deploying:
 *     https://www.google.com/adsense/new/u/0/pub-1712273263687132/myads/units
 */

export const ADSENSE_CLIENT = 'ca-pub-1712273263687132';

export const AD_SLOTS = {
  /** Landing page – between file tiles and Animae Verba section */
  LANDING_MID: '2954253435',
  /** Article detail view – below the article header */
  ARTICLE_TOP: '2954253435',
  /** Article detail view – after article content */
  ARTICLE_BOTTOM: '2954253435',
  /** How It Works page – mid content */
  HOW_IT_WORKS_MID: '2954253435',
} as const;

interface AdSenseUnitProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export function AdSenseUnit({ slot, format = 'auto', className = '' }: AdSenseUnitProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (slot === 'REPLACE_WITH_SLOT_ID') return;
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.warn('AdSense push error:', err);
    }
  }, [slot]);

  // In DEV with placeholder: show a visible placeholder so developers know where ads will appear
  if (slot === 'REPLACE_WITH_SLOT_ID') {
    if (import.meta.env.DEV) {
      return (
        <div
          className={`flex items-center justify-center bg-clay-stone/10 border border-dashed border-clay-stone/30 rounded-xl text-clay-charcoal/30 text-xs py-8 px-4 my-4 select-none ${className}`}
          aria-hidden="true"
        >
          📣 Ad slot — add real slot ID in <code className="ml-1 font-mono">AdSenseUnit.tsx</code>
        </div>
      );
    }
    // In production, render nothing until slot IDs are configured
    return null;
  }

  return (
    <div className={`overflow-hidden my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
