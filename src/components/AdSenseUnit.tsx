import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const ADSENSE_CLIENT = 'ca-pub-1712273263687132';

export const AD_SLOTS = {
  LANDING_MID: '3642158968',
  ARTICLE_TOP: '3642158968',
  ARTICLE_BOTTOM: '3642158968',
  HOW_IT_WORKS_MID: '3642158968',
} as const;

/** Desktop: fluid in-feed */
const DESKTOP_SLOT       = '3642158968';
const DESKTOP_LAYOUT_KEY = '-ff+f-h-50+aq';

/** Mobile: fluid in-article */
const MOBILE_SLOT        = '2021450953';

interface AdSenseUnitProps {
  slot?: string; // ignored — slot is chosen automatically based on viewport
  className?: string;
}

export function AdSenseUnit({ className = '' }: AdSenseUnitProps) {
  const isMobile = useIsMobile();
  const pushed = useRef(false);

  // Check for advertising consent
  const hasConsent = (() => {
    try {
      const consent = JSON.parse(localStorage.getItem('animae_agentis_cookie_consent') || '{}');
      return !!consent.advertising;
    } catch {
      return false;
    }
  })();

  // Reset push flag when viewport type changes so the correct unit can initialise
  useEffect(() => {
    pushed.current = false;
  }, [isMobile]);

  useEffect(() => {
    if (!hasConsent || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.warn('AdSense push error:', err);
    }
  }, [isMobile, hasConsent]);

  if (import.meta.env.DEV) {
    return (
      <div
        className={`flex items-center justify-center bg-clay-stone/10 border border-dashed border-clay-stone/30 rounded-xl text-clay-charcoal/30 text-xs py-8 px-4 my-4 select-none ${className}`}
        aria-hidden="true"
      >
        📣 AdSense — {isMobile ? `Mobile in-article (${MOBILE_SLOT})` : `Desktop in-feed (${DESKTOP_SLOT})`}
        {!hasConsent && " (Waiting for Consent)"}
      </div>
    );
  }

  // Do not render anything if no consent is given
  if (!hasConsent) return null;

  if (isMobile) {
    return (
      <div className={`overflow-hidden my-4 ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={MOBILE_SLOT}
        />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key={DESKTOP_LAYOUT_KEY}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={DESKTOP_SLOT}
      />
    </div>
  );
}
