import React, { useEffect, useMemo, useState } from 'react';
import StartScreen from './components/StartScreen.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import TestRunner from './components/TestRunner.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import { usePasatEngine, PHASES } from './hooks/usePasatEngine.js';
import { pickDefaultVoice } from './lib/speechVoices.js';
import { getT } from './lib/i18n.js';
import { I18nContext } from './hooks/useTranslation.js';

const SETTINGS_KEY = 'pasat-settings';

function getDefaultSettings() {
  const browserLang = typeof navigator !== 'undefined' ? navigator.language || 'de-DE' : 'de-DE';
  const uiLang = browserLang.startsWith('en') ? 'en' : 'de';
  return {
    lang: browserLang,
    voiceURI: null,
    rate: 1.0,
    volume: 1.0,
    testLength: 61,
    intervalMs: 3000,
    showTouchButtons: false,
    darkMode: false,
    uiLang,
  };
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return getDefaultSettings();
    return { ...getDefaultSettings(), ...JSON.parse(raw) };
  } catch {
    return getDefaultSettings();
  }
}

export default function App() {
  const [settings, setSettings] = useState(loadSettings);
  const t = useMemo(() => getT(settings.uiLang), [settings.uiLang]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [settings.darkMode]);

  // Resolve voice object from URI + voice list.
  // The engine takes a full settings object — we adapt here.
  const engineSettings = useMemo(() => {
    return {
      ...settings,
      voice: null, // filled in just before run start; updated below
    };
  }, [settings]);

  const engine = usePasatEngine(engineSettings);

  // After voices load, resolve the selected voice each render.
  const resolvedVoice = useMemo(() => {
    if (!engine.voices?.length) return null;
    if (settings.voiceURI) {
      const found = engine.voices.find((v) => v.voiceURI === settings.voiceURI);
      if (found) return found;
    }
    return pickDefaultVoice(engine.voices, settings.lang);
  }, [engine.voices, settings.voiceURI, settings.lang]);

  // Patch the engine's settings ref via re-rendering by passing a new object.
  // We rely on the engine internally reading settingsRef.current at speak-time,
  // so simply updating engineSettings's voice each render is enough.
  engineSettings.voice = resolvedVoice;

  const phase = engine.state.phase;

  let content;
  if (phase === PHASES.SETTINGS) {
    content = (
      <SettingsPanel
        settings={settings}
        voices={engine.voices}
        onChange={setSettings}
        onClose={() => engine.goto(PHASES.IDLE)}
      />
    );
  } else if (phase === PHASES.RUNNING) {
    content = (
      <TestRunner
        state={engine.state}
        showTouchButtons={settings.showTouchButtons}
        onPendingChange={engine.updatePending}
        onSubmit={engine.submitAnswer}
        onAbort={engine.abort}
        isPractice={engine.state.mode === 'practice'}
      />
    );
  } else if (phase === PHASES.COMPLETE) {
    content = (
      <ResultScreen
        result={engine.state.result}
        isPractice={engine.state.mode === 'practice'}
        onRestart={() => engine.startRun(engine.state.mode)}
        onOpenSettings={() => engine.goto(PHASES.SETTINGS)}
        onHome={engine.reset}
      />
    );
  } else {
    content = (
      <StartScreen
        onStartPractice={() => engine.startRun('practice')}
        onStartTest={() => engine.startRun('test')}
        onOpenSettings={() => engine.goto(PHASES.SETTINGS)}
      />
    );
  }

  return (
    <I18nContext.Provider value={t}>
      <div
        className="min-h-screen bg-ios-fill-1 dark:bg-ios-dark-bg text-gray-900 dark:text-gray-100 font-sans antialiased transition-colors"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        {content}
        {!engine.supported && (
          <div
            className="fixed left-3 right-3 p-4 rounded-ios bg-ios-red/95 text-white text-[15px] text-center shadow-ios backdrop-blur-md"
            style={{ bottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
          >
            {t('noSpeechApi')}
          </div>
        )}
      </div>
    </I18nContext.Provider>
  );
}
