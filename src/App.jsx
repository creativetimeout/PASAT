import React, { useEffect, useMemo, useState } from 'react';
import StartScreen from './components/StartScreen.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import TestRunner from './components/TestRunner.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import { usePasatEngine, PHASES } from './hooks/usePasatEngine.js';
import { pickDefaultVoice } from './lib/speechVoices.js';

const SETTINGS_KEY = 'pasat-settings';

function getDefaultSettings() {
  const browserLang = typeof navigator !== 'undefined' ? navigator.language || 'de-DE' : 'de-DE';
  return {
    lang: browserLang,
    voiceURI: null,
    rate: 1.0,
    volume: 1.0,
    testLength: 61,
    intervalMs: 3000,
    showTouchButtons: false,
    darkMode: false,
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
  } else if (phase === PHASES.ABORTED) {
    content = (
      <div className="mx-auto max-w-2xl px-6 py-12 text-center text-gray-900 dark:text-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Test abgebrochen</h2>
        <button
          type="button"
          onClick={engine.reset}
          className="px-6 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Zurück zum Start
        </button>
      </div>
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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {content}
      {!engine.supported && (
        <div className="fixed bottom-4 left-4 right-4 p-3 rounded bg-red-100 text-red-800 text-sm text-center">
          Dein Browser unterstützt die Web Speech API nicht. Der Test funktioniert nicht.
        </div>
      )}
    </div>
  );
}
