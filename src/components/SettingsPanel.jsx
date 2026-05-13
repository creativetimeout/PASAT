import React, { useMemo } from 'react';
import { groupVoicesByLang } from '../lib/speechVoices.js';

export default function SettingsPanel({ settings, voices, onChange, onClose }) {
  const grouped = useMemo(() => groupVoicesByLang(voices), [voices]);
  const langKeys = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  const update = (patch) => onChange({ ...settings, ...patch });

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-semibold mb-6">Einstellungen</h2>

      <div className="space-y-5">
        <Field label="Sprache">
          <select
            value={settings.lang}
            onChange={(e) => update({ lang: e.target.value, voiceURI: null })}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            {langKeys.length === 0 && <option value={settings.lang}>{settings.lang}</option>}
            {langKeys.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </Field>

        <Field label="Stimme">
          <select
            value={settings.voiceURI ?? ''}
            onChange={(e) => update({ voiceURI: e.target.value || null })}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value="">— Standardstimme der Sprache —</option>
            {(grouped[settings.lang] || []).map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} {v.default ? '(Standard)' : ''}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Stimmen-Auswahl ist browserabhängig.
          </p>
        </Field>

        <Field label={`Sprechgeschwindigkeit (${settings.rate.toFixed(2)}×)`}>
          <input
            type="range" min="0.8" max="1.2" step="0.05"
            value={settings.rate}
            onChange={(e) => update({ rate: parseFloat(e.target.value) })}
            className="w-full"
          />
        </Field>

        <Field label={`Lautstärke (${Math.round(settings.volume * 100)}%)`}>
          <input
            type="range" min="0" max="1" step="0.05"
            value={settings.volume}
            onChange={(e) => update({ volume: parseFloat(e.target.value) })}
            className="w-full"
          />
        </Field>

        <Field label="Test-Länge">
          <select
            value={settings.testLength}
            onChange={(e) => update({ testLength: parseInt(e.target.value, 10) })}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value={61}>61 Zahlen (Standard, 60 Antworten)</option>
            <option value={31}>31 Zahlen (Kurzversion, 30 Antworten)</option>
          </select>
        </Field>

        <Field label="Intervall zwischen Zahlen">
          <select
            value={settings.intervalMs}
            onChange={(e) => update({ intervalMs: parseInt(e.target.value, 10) })}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value={3000}>3,0 s (PASAT-3, Standard)</option>
            <option value={2000}>2,0 s (PASAT-2, fortgeschritten)</option>
          </select>
        </Field>

        <Field label="Eingabe-Modus">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.showTouchButtons}
              onChange={(e) => update({ showTouchButtons: e.target.checked })}
            />
            Touch-Buttons 0–18 anzeigen (für Mobile)
          </label>
        </Field>

        <Field label="Darstellung">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => update({ darkMode: e.target.checked })}
            />
            Dark Mode
          </label>
        </Field>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Zurück
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">{label}</span>
      {children}
    </label>
  );
}
