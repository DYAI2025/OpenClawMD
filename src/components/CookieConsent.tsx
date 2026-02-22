import { useState } from 'react';
import { ClayCard, ClayButton } from './clay';
import { ShieldCheck } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
}

function CookieToggle({ label, description, checked, disabled, onChange }: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <label className={`flex items-center justify-between gap-4 py-3 ${disabled ? 'opacity-60' : 'cursor-pointer'}`}>
      <div>
        <span className="text-sm font-medium text-clay-charcoal">{label}</span>
        <p className="text-xs text-clay-charcoal/50 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`
          relative w-10 h-6 rounded-full transition-colors shrink-0
          ${checked ? 'bg-clay-mint' : 'bg-clay-stone/40'}
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className={`
          absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-clay transition-transform
          ${checked ? 'translate-x-4' : 'translate-x-0'}
        `} />
      </button>
    </label>
  );
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(() => {
    return !localStorage.getItem('animae_agentis_cookie_consent');
  });
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    advertising: true,
  });

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('animae_agentis_cookie_consent', JSON.stringify(prefs));
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    savePreferences({ essential: true, analytics: true, advertising: true });
  };

  const handleSaveSettings = () => {
    savePreferences(preferences);
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
          {!showSettings && (
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <ClayButton size="sm" color="sand" onClick={() => setShowSettings(true)}>
                Settings
              </ClayButton>
              <ClayButton size="sm" color="coral" onClick={handleAcceptAll}>
                Accept All
              </ClayButton>
            </div>
          )}
        </div>

        {showSettings && (
          <div className="mt-6 pt-6 border-t border-clay-stone/20">
            <div className="divide-y divide-clay-stone/10">
              <CookieToggle
                label="Essential"
                description="Required for the site to function correctly"
                checked={true}
                disabled
              />
              <CookieToggle
                label="Analytics"
                description="Helps us understand how visitors use the site"
                checked={preferences.analytics}
                onChange={(v) => setPreferences(p => ({ ...p, analytics: v }))}
              />
              <CookieToggle
                label="Advertising"
                description="Google AdSense personalized ads"
                checked={preferences.advertising}
                onChange={(v) => setPreferences(p => ({ ...p, advertising: v }))}
              />
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <ClayButton size="sm" color="sand" onClick={handleSaveSettings}>
                Save Preferences
              </ClayButton>
              <ClayButton size="sm" color="coral" onClick={handleAcceptAll}>
                Accept All
              </ClayButton>
            </div>
          </div>
        )}
      </ClayCard>
    </div>
  );
}
