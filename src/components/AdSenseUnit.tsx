import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const ADSENSE_CLIENT = 'ca-pub-1712273263687132';

export const AD_SLOTS = {
  LANDING_MID: '3642158968',
  ARTICLE_TOP: '3642158968',
  ARTICLE_BOTTOM: '3642158968',
  ARTICLE_IN_FEED: '3642158968', // Specific slot for grid integration
  HOW_IT_WORKS_MID: '3642158968',
} as const;

interface AdSenseUnitProps {
  slot?: string;
  className?: string;
  type?: 'fluid' | 'in-article' | 'in-feed' | 'multiplex';
}

export function AdSenseUnit({ className = '', slot = DESKTOP_SLOT, type = 'fluid' }: AdSenseUnitProps) {
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
        className={`flex items-center justify-center bg-clay-stone/10 border border-dashed border-clay-stone/30 rounded-2xl text-clay-charcoal/30 text-[10px] font-black uppercase tracking-widest py-12 px-4 my-6 select-none ${className}`}
        aria-hidden="true"
      >
        📣 AdSense — {type} ({slot})
        {!hasConsent && " (Waiting for Consent)"}
      </div>
    );
  }

  // Do not render anything if no consent is given
  if (!hasConsent) return null;

  // Manual configuration for different ad types
  const adProps: any = {
    'data-ad-client': ADSENSE_CLIENT,
    'data-ad-slot': slot,
  };

  if (type === 'in-article') {
    adProps['data-ad-layout'] = 'in-article';
    adProps['data-ad-format'] = 'fluid';
  } else if (type === 'in-feed') {
    adProps['data-ad-format'] = 'fluid';
    adProps['data-ad-layout-key'] = DESKTOP_LAYOUT_KEY;
  } else if (type === 'multiplex') {
    adProps['data-ad-format'] = 'autorelaxed';
  } else {
    adProps['data-ad-format'] = 'auto';
    adProps['data-responsive'] = 'true';
  }

  return (
    <div className={`overflow-hidden my-6 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '250px' }}
        {...adProps}
      />
    </div>
  );
}
