import React from 'react';

export default function StartScreen({ onStartPractice, onStartTest, onOpenSettings }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-semibold mb-4">PASAT-3 Selbsttest</h1>
      <p className="mb-6 leading-relaxed">
        Beim <strong>Paced Auditory Serial Addition Test</strong> hörst du eine Folge
        einstelliger Zahlen. Deine Aufgabe: addiere immer die <strong>zuletzt</strong> mit
        der <strong>vorletzten</strong> gehörten Zahl — nicht die laufende Summe.
      </p>
      <p className="mb-6 leading-relaxed">
        Beispiel: Hörst du <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">2, 5, 3, 8</code>,
        gib nacheinander <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">7, 8, 11</code> ein.
      </p>

      <div
        role="note"
        className="mb-8 p-4 rounded border border-amber-400 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-600 text-sm leading-relaxed"
      >
        <strong>Hinweis:</strong> Diese Anwendung dient ausschließlich der persönlichen
        Übung und Selbsteinschätzung. Sie ist <strong>kein</strong> medizinisches Diagnose-
        oder Messinstrument und ersetzt keine ärztliche Untersuchung. Ergebnisse sind
        nicht klinisch validiert.
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onStartTest}
          className="px-6 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Test starten
        </button>
        <button
          type="button"
          onClick={onStartPractice}
          className="px-6 py-3 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Übung starten (10 Zahlen)
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="px-6 py-3 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Einstellungen
        </button>
      </div>
    </div>
  );
}
