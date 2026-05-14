import { useTranslation } from '../hooks/useTranslation.js';

export default function ResultScreen({ result, isPractice, onRestart, onOpenSettings, onHome }) {
  const t = useTranslation();
  if (!result) return null;
  const { totalCorrect, accuracy, avgReactionMs, perItem } = result;
  const total = perItem.length;
  const missed = perItem.filter((p) => p.status === 'missed').length;
  const wrong = perItem.filter((p) => p.status === 'wrong').length;
  const chunking = perItem.filter((p) => p.chunkingError).length;

  return (
    <div className="mx-auto w-full max-w-md px-5 pt-10 pb-10">
      <header className="text-center mb-8">
        <h2 className="text-[28px] font-bold tracking-tight text-gray-900 dark:text-white">
          {isPractice ? t('practiceComplete') : t('testComplete')}
        </h2>
        <p className="mt-1 text-[15px] text-gray-600 dark:text-gray-300" aria-live="polite">
          {isPractice ? t('practiceSubtitle') : t('testSubtitle')}
        </p>
      </header>

      <div className="rounded-ios-lg bg-white dark:bg-ios-dark-surface shadow-ios px-6 py-7 text-center mb-4">
        <div className="text-[13px] uppercase tracking-wider text-gray-600 dark:text-gray-300">
          {t('statCorrect')}
        </div>
        <div className="mt-1 text-[56px] font-bold tabular-nums text-ios-blue dark:text-ios-blue-dark leading-none">
          {totalCorrect}
          <span className="text-gray-500 dark:text-gray-400 font-medium text-[28px]"> / {total}</span>
        </div>
        <div className="mt-2 text-[17px] font-medium text-gray-700 dark:text-gray-200">
          {t('accuracyLabel', { value: accuracy.toFixed(1) })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <Stat label={t('statReaction')} value={avgReactionMs != null ? `${avgReactionMs}` : '—'} unit="ms" />
        <Stat label={t('statMissed')} value={`${missed}`} />
        <Stat label={t('statWrong')} value={`${wrong}`} />
      </div>

      {chunking > 0 && (
        <div className="mb-5 rounded-ios bg-ios-orange/10 dark:bg-ios-orange/15 px-4 py-3 text-[13px] leading-relaxed text-amber-900 dark:text-amber-200">
          {t('chunkingNote', { count: chunking })}
        </div>
      )}

      <p className="mb-6 text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed text-center">
        {t('learningNote')}
      </p>

      <details className="mb-8 rounded-ios-lg bg-white dark:bg-ios-dark-surface shadow-ios overflow-hidden">
        <summary className="cursor-pointer px-5 py-4 text-[15px] font-medium text-ios-blue dark:text-ios-blue-dark list-none flex items-center justify-between">
          {t('detailsToggle', { count: total })}
          <span className="text-gray-500 dark:text-gray-400 text-[13px]">›</span>
        </summary>
        <div className="border-t border-ios-fill-2 dark:border-ios-dark-border overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="text-left bg-ios-fill-1 dark:bg-ios-dark-surface-2 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="py-2 px-3 font-medium">{t('colNum')}</th>
                <th className="py-2 px-2 font-medium">{t('colPair')}</th>
                <th className="py-2 px-2 font-medium">{t('colExpected')}</th>
                <th className="py-2 px-2 font-medium">{t('colGiven')}</th>
                <th className="py-2 px-2 font-medium">{t('colStatus')}</th>
                <th className="py-2 px-2 font-medium">{t('colMs')}</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {perItem.map((p) => (
                <tr
                  key={p.index}
                  className="border-t border-ios-fill-2 dark:border-ios-dark-border"
                >
                  <td className="py-2 px-3 text-gray-500 dark:text-gray-400">{p.index + 1}</td>
                  <td className="py-2 px-2">{p.pair[0]}+{p.pair[1]}</td>
                  <td className="py-2 px-2 font-medium">{p.expected}</td>
                  <td className="py-2 px-2">{p.given ?? '—'}</td>
                  <td className="py-2 px-2">
                    {p.status === 'correct' && <span className="text-ios-green">✓</span>}
                    {p.status === 'wrong' && <span className="text-ios-red">✗</span>}
                    {p.status === 'missed' && <span className="text-gray-500 dark:text-gray-400">–</span>}
                    {p.chunkingError && <span className="ml-1 text-ios-orange text-[11px]">{t('chunkLabel')}</span>}
                  </td>
                  <td className="py-2 px-2 text-gray-500 dark:text-gray-400">{p.reactionMs != null ? p.reactionMs : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onRestart}
          className="w-full px-6 py-4 rounded-ios-lg bg-ios-blue dark:bg-ios-blue-dark text-white text-[17px] font-semibold shadow-ios active:opacity-80 transition focus:outline-none focus:ring-4 focus:ring-ios-blue/30"
        >
          {t('newTest')}
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onOpenSettings}
            className="px-4 py-3.5 rounded-ios-lg bg-white dark:bg-ios-dark-surface text-ios-blue dark:text-ios-blue-dark text-[15px] font-medium shadow-ios active:opacity-70 transition"
          >
            {t('settings')}
          </button>
          <button
            type="button"
            onClick={onHome}
            className="px-4 py-3.5 rounded-ios-lg bg-white dark:bg-ios-dark-surface text-ios-blue dark:text-ios-blue-dark text-[15px] font-medium shadow-ios active:opacity-70 transition"
          >
            {t('home')}
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, unit }) {
  return (
    <div className="rounded-ios bg-white dark:bg-ios-dark-surface shadow-ios px-3 py-4 text-center">
      <div className="text-[11px] uppercase tracking-wider text-gray-600 dark:text-gray-300">
        {label}
      </div>
      <div className="mt-1 text-[22px] font-semibold tabular-nums text-gray-900 dark:text-white leading-none">
        {value}
        {unit && <span className="text-[13px] font-normal text-gray-500 dark:text-gray-400 ml-0.5">{unit}</span>}
      </div>
    </div>
  );
}
