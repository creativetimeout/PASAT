import React from 'react';

export default function ResultScreen({ result, isPractice, onRestart, onOpenSettings, onHome }) {
  if (!result) return null;
  const { totalCorrect, accuracy, avgReactionMs, perItem } = result;
  const total = perItem.length;
  const missed = perItem.filter((p) => p.status === 'missed').length;
  const wrong = perItem.filter((p) => p.status === 'wrong').length;
  const chunking = perItem.filter((p) => p.chunkingError).length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 text-gray-900 dark:text-gray-100">
      <h2 className="text-3xl font-semibold mb-2">
        {isPractice ? 'Übung beendet' : 'Test beendet'}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-live="polite">
        {isPractice ? 'Bereit für den eigentlichen Test?' : 'Hier sind deine Ergebnisse.'}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Stat label="Richtig" value={`${totalCorrect} / ${total}`} />
        <Stat label="Genauigkeit" value={`${accuracy.toFixed(1)}%`} />
        <Stat label="⌀ Reaktion" value={avgReactionMs != null ? `${avgReactionMs} ms` : '—'} />
        <Stat label="Verpasst / Falsch" value={`${missed} / ${wrong}`} />
      </div>

      {chunking > 0 && (
        <p className="mb-6 text-sm text-amber-700 dark:text-amber-400">
          Bei <strong>{chunking}</strong> Antwort(en) wurde ein typisches „Chunking"-Muster
          erkannt: Du hast deine vorige Antwort statt der vorgegebenen Zahl addiert.
        </p>
      )}

      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        Bei wiederholter Durchführung verbessern sich die meisten Menschen — das ist normal
        und kein klinischer Befund. Diese Anwendung ist <strong>kein</strong> medizinisches
        Diagnoseinstrument.
      </p>

      <details className="mb-8">
        <summary className="cursor-pointer text-sm font-medium mb-2">
          Detailansicht ({total} Antworten)
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left border-b border-gray-300 dark:border-gray-700">
              <tr>
                <th className="py-2 pr-2">#</th>
                <th className="py-2 pr-2">Paar</th>
                <th className="py-2 pr-2">Erwartet</th>
                <th className="py-2 pr-2">Gegeben</th>
                <th className="py-2 pr-2">Status</th>
                <th className="py-2 pr-2">Reaktion</th>
                <th className="py-2 pr-2">Hinweis</th>
              </tr>
            </thead>
            <tbody>
              {perItem.map((p) => (
                <tr key={p.index} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-1 pr-2">{p.index + 1}</td>
                  <td className="py-1 pr-2">{p.pair[0]} + {p.pair[1]}</td>
                  <td className="py-1 pr-2">{p.expected}</td>
                  <td className="py-1 pr-2">{p.given ?? '—'}</td>
                  <td className="py-1 pr-2">
                    {p.status === 'correct' && <span className="text-green-600">✓</span>}
                    {p.status === 'wrong' && <span className="text-red-600">✗</span>}
                    {p.status === 'missed' && <span className="text-gray-500">–</span>}
                  </td>
                  <td className="py-1 pr-2">{p.reactionMs != null ? `${p.reactionMs} ms` : '—'}</td>
                  <td className="py-1 pr-2">{p.chunkingError ? 'Chunking' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="px-6 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Neuer Test
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="px-6 py-3 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-medium"
        >
          Einstellungen
        </button>
        <button
          type="button"
          onClick={onHome}
          className="px-6 py-3 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-medium"
        >
          Zurück zum Start
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded border border-gray-200 dark:border-gray-700 p-4 text-center">
      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
