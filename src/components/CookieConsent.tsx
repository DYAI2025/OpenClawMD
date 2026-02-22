import { useState } from 'react';
import { ClayCard, ClayButton } from './clay';
import { ShieldCheck } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(() => {
    return !localStorage.getItem('animae_agentis_cookie_consent');
  });

  const handleAccept = () => {
    localStorage.setItem('animae_agentis_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] animate-slide-up">
      <ClayCard className="max-w-2xl mx-auto p-6 md:p-8 border-clay-coral/20 shadow-clay-lifted bg-white/90 dark:bg-clay-base/90 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-clay-mint/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-clay-mint" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-clay-charcoal mb-2">Cookie Privacy</h3>
            <p className="text-sm text-clay-charcoal/60 leading-relaxed">
              We use cookies to improve your experience and show personalized ads via Google AdSense. 
              By continuing to use Animae Agentis, you agree to our use of cookies and our privacy policy.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <ClayButton size="sm" color="sand" onClick={handleAccept}>
              Settings
            </ClayButton>
            <ClayButton size="sm" color="coral" onClick={handleAccept}>
              Accept All
            </ClayButton>
          </div>
        </div>
      </ClayCard>
    </div>
  );
}
