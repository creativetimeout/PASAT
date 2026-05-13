import React, { useMemo } from 'react';
import { groupVoicesByLang } from '../lib/speechVoices.js';

export default function SettingsPanel({ settings, voices, onChange, onClose }) {
  const grouped = useMemo(() => groupVoicesByLang(voices), [voices]);
  const langKeys = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  const update = (patch) => onChange({ ...settings, ...patch });

  return (
    <div className="mx-auto w-full max-w-md px-5 pt-10 pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[28px] font-bold tracking-tight text-gray-900 dark:text-white">
          Einstellungen
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-ios-blue dark:text-ios-blue-dark text-[17px] font-semibold active:opacity-60 transition"
        >
          Fertig
        </button>
      </div>

      <Group title="Audio">
        <Row label="Sprache">
          <Select
            value={settings.lang}
            onChange={(v) => update({ lang: v, voiceURI: null })}
            options={
              langKeys.length === 0
                ? [{ value: settings.lang, label: settings.lang }]
                : langKeys.map((k) => ({ value: k, label: k }))
            }
          />
        </Row>
        <Row label="Stimme">
          <Select
            value={settings.voiceURI ?? ''}
            onChange={(v) => update({ voiceURI: v || null })}
            options={[
              { value: '', label: 'Standard' },
              ...(grouped[settings.lang] || []).map((v) => ({
                value: v.voiceURI,
                label: `${v.name}${v.default ? ' (Std.)' : ''}`,
              })),
            ]}
          />
        </Row>
        <RowStack label="Sprechgeschwindigkeit" value={`${settings.rate.toFixed(2)}×`}>
          <input
            type="range"
            min="0.8"
            max="1.2"
            step="0.05"
            value={settings.rate}
            onChange={(e) => update({ rate: parseFloat(e.target.value) })}
          />
        </RowStack>
        <RowStack label="Lautstärke" value={`${Math.round(settings.volume * 100)}%`} last>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.volume}
            onChange={(e) => update({ volume: parseFloat(e.target.value) })}
          />
        </RowStack>
      </Group>

      <p className="px-4 -mt-3 mb-5 text-[12px] text-gray-600 dark:text-gray-300">
        Stimmen-Auswahl ist browserabhängig.
      </p>

      <Group title="Test">
        <Row label="Länge">
          <Select
            value={String(settings.testLength)}
            onChange={(v) => update({ testLength: parseInt(v, 10) })}
            options={[
              { value: '61', label: '61 (60 Antw.)' },
              { value: '31', label: '31 (30 Antw.)' },
            ]}
          />
        </Row>
        <Row label="Intervall" last>
          <Select
            value={String(settings.intervalMs)}
            onChange={(v) => update({ intervalMs: parseInt(v, 10) })}
            options={[
              { value: '3000', label: '3,0 s (PASAT-3)' },
              { value: '2000', label: '2,0 s (PASAT-2)' },
            ]}
          />
        </Row>
      </Group>

      <Group title="Darstellung">
        <ToggleRow
          label="Touch-Buttons 0–18"
          checked={settings.showTouchButtons}
          onChange={(v) => update({ showTouchButtons: v })}
        />
        <ToggleRow
          label="Dark Mode"
          checked={settings.darkMode}
          onChange={(v) => update({ darkMode: v })}
          last
        />
      </Group>
    </div>
  );
}

function Group({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="px-4 mb-1.5 text-[13px] uppercase tracking-wider text-gray-600 dark:text-gray-300 font-semibold">
        {title}
      </h3>
      <div className="rounded-ios-lg bg-white dark:bg-ios-dark-surface shadow-ios overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Row({ label, children, last }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-3 ${
        last ? '' : 'border-b border-ios-fill-2 dark:border-ios-dark-border'
      }`}
    >
      <span className="text-[15px] text-gray-900 dark:text-gray-100 shrink-0">{label}</span>
      <div className="flex-1 min-w-0 flex justify-end">{children}</div>
    </div>
  );
}

function RowStack({ label, value, children, last }) {
  return (
    <div
      className={`px-4 py-3 ${
        last ? '' : 'border-b border-ios-fill-2 dark:border-ios-dark-border'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[15px] text-gray-900 dark:text-gray-100">{label}</span>
        <span className="text-[13px] tabular-nums font-medium text-gray-700 dark:text-gray-200">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-transparent text-[15px] text-gray-700 dark:text-gray-200 text-right pr-5 py-1 -mr-1 focus:outline-none truncate max-w-[60vw]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='14' viewBox='0 0 10 14'><path fill='%236B7280' d='M5 0l5 5H0zM5 14l-5-5h10z'/></svg>\")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0 center',
        backgroundSize: '7px 10px',
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function ToggleRow({ label, checked, onChange, last }) {
  return (
    <label
      className={`flex items-center justify-between gap-3 px-4 py-3 cursor-pointer ${
        last ? '' : 'border-b border-ios-fill-2 dark:border-ios-dark-border'
      }`}
    >
      <span className="text-[15px] text-gray-900 dark:text-gray-100">{label}</span>
      <span className="relative inline-block">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <span className="block w-[51px] h-[31px] rounded-full bg-ios-fill-3 dark:bg-ios-dark-border peer-checked:bg-ios-green transition-colors" />
        <span className="absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md peer-checked:translate-x-[20px] transition-transform" />
      </span>
    </label>
  );
}
