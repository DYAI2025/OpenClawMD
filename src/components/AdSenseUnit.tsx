import { useEffect, useRef } from 'react';

export const ADSENSE_CLIENT = 'ca-pub-1712273263687132';

export const AD_SLOTS = {
  /** Landing page – between file tiles and Animae Verba section */
  LANDING_MID: '3642158968',
  /** Article detail view – below the article header */
  ARTICLE_TOP: '3642158968',
  /** Article detail view – after article content */
  ARTICLE_BOTTOM: '3642158968',
  /** How It Works page – mid content */
  HOW_IT_WORKS_MID: '3642158968',
} as const;

/** Layout key for fluid in-feed format */
const AD_LAYOUT_KEY = '-ff+f-h-50+aq';

interface AdSenseUnitProps {
  slot: string;
  className?: string;
}

export function AdSenseUnit({ slot, className = '' }: AdSenseUnitProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.warn('AdSense push error:', err);
    }
  }, [slot]);

  if (import.meta.env.DEV) {
    return (
      <div
        className={`flex items-center justify-center bg-clay-stone/10 border border-dashed border-clay-stone/30 rounded-xl text-clay-charcoal/30 text-xs py-8 px-4 my-4 select-none ${className}`}
        aria-hidden="true"
      >
        📣 AdSense Fluid Ad — slot {slot}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key={AD_LAYOUT_KEY}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      />
    </div>
  );
}
