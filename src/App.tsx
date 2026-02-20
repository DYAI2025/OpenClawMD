import { useState, useCallback } from 'react';
import './App.css';
import { LandingPage } from './pages/LandingPage';
import { PresetsPage } from './pages/PresetsPage';
import { InterviewPage } from './pages/InterviewPage';
import { BuilderPage } from './pages/BuilderPage';
import { ExportPage } from './pages/ExportPage';
import type { OpenClawConfigType, PresetIdType } from './lib/openclaw/schema';
import { createEmptyConfig } from './lib/openclaw/schema';
import { createConfigFromPreset } from './lib/openclaw/presets';
import { ConfigModeOverlay } from './components/ConfigModeOverlay';
import { Toaster } from '@/components/ui/sonner';

export type AppView = 'landing' | 'presets' | 'interview' | 'builder' | 'export';

interface AppState {
  view: AppView;
  config: OpenClawConfigType | null;
}

function App() {
  const [state, setState] = useState<AppState>({
    view: 'landing',
    config: null,
  });
  
  const [configModeOpen, setConfigModeOpen] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  // Hidden config mode activation (7 taps within 3 seconds)
  const handleLogoTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapTime > 3000) {
      setTapCount(1);
    } else {
      const newCount = tapCount + 1;
      if (newCount >= 7) {
        setConfigModeOpen(true);
        setTapCount(0);
      } else {
        setTapCount(newCount);
      }
    }
    setLastTapTime(now);
  }, [tapCount, lastTapTime]);

  // Navigation handlers
  const navigateTo = useCallback((view: AppView) => {
    setState(prev => ({ ...prev, view }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectPreset = useCallback((presetId: PresetIdType) => {
    const config = createConfigFromPreset(presetId);
    setState({ view: 'export', config });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const startInterview = useCallback(() => {
    setState({ view: 'interview', config: createEmptyConfig() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const startBuilder = useCallback((basePreset?: PresetIdType) => {
    const config = basePreset ? createConfigFromPreset(basePreset) : createEmptyConfig();
    setState({ view: 'builder', config });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const finishInterview = useCallback((config: OpenClawConfigType) => {
    setState({ view: 'export', config });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const finishBuilder = useCallback((config: OpenClawConfigType) => {
    setState({ view: 'export', config });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      switch (prev.view) {
        case 'presets':
        case 'interview':
        case 'builder':
          return { ...prev, view: 'landing' };
        case 'export':
          return { ...prev, view: 'landing' };
        default:
          return prev;
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Render current view
  const renderView = () => {
    switch (state.view) {
      case 'landing':
        return (
          <LandingPage
            onSelectPreset={() => navigateTo('presets')}
            onStartInterview={startInterview}
            onOpenBuilder={() => startBuilder()}
            onLogoTap={handleLogoTap}
          />
        );
      
      case 'presets':
        return (
          <PresetsPage
            onSelectPreset={selectPreset}
            onCustomize={startBuilder}
            onBack={goBack}
          />
        );
      
      case 'interview':
        return (
          <InterviewPage
            initialConfig={state.config || createEmptyConfig()}
            onComplete={finishInterview}
            onBack={goBack}
          />
        );
      
      case 'builder':
        return (
          <BuilderPage
            initialConfig={state.config || createEmptyConfig()}
            onComplete={finishBuilder}
            onBack={goBack}
          />
        );
      
      case 'export':
        return (
          <ExportPage
            config={state.config || createEmptyConfig()}
            onBack={goBack}
            onNewConfig={() => navigateTo('landing')}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-clay-base relative overflow-x-hidden">
      {/* Background blobs */}
      <div className="blob-bg blob-1" />
      <div className="blob-bg blob-2" />
      <div className="blob-bg blob-3" />
      
      {/* Main content */}
      <main className="relative z-10">
        {renderView()}
      </main>
      
      {/* Config Mode Overlay */}
      <ConfigModeOverlay 
        isOpen={configModeOpen} 
        onClose={() => setConfigModeOpen(false)} 
      />
      
      {/* Toast notifications */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#F5F0E8',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 2px 4px rgba(61, 58, 54, 0.04), 0 4px 8px rgba(61, 58, 54, 0.03), 0 8px 16px rgba(61, 58, 54, 0.02), 0 1px 2px rgba(61, 58, 54, 0.08)',
            borderRadius: '1rem',
          },
        }}
      />
    </div>
  );
}

export default App;
