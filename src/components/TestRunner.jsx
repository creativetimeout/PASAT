import React, { useState } from 'react';
import AnswerInput from './AnswerInput.jsx';
import NumberDisplay from './NumberDisplay.jsx';
import IntervalProgress from './IntervalProgress.jsx';

export default function TestRunner({
  state,
  showTouchButtons,
  onPendingChange,
  onSubmit,
  onAbort,
  isPractice,
}) {
  const [confirmAbort, setConfirmAbort] = useState(false);
  const totalAnswers = Math.max(0, state.sequence.length - 1);
  const answeredCount = state.answers.filter((a) => a != null).length;
  const displayCurrent = Math.max(0, state.currentIndex + 1);

  return (
    <div className="mx-auto max-w-xl px-6 py-12 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6 text-sm">
        <span aria-live="polite">
          {isPractice ? 'Übung' : 'Test'} läuft · {displayCurrent} / {state.sequence.length}
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {answeredCount} / {totalAnswers} beantwortet
        </span>
      </div>

      <NumberDisplay currentIndex={state.currentIndex} />

      <div className="mt-4">
        <IntervalProgress
          tick={state.intervalTick}
          durationMs={state.intervalDurationMs}
        />
      </div>

      <div className="mt-6">
        <AnswerInput
          onPendingChange={onPendingChange}
          onSubmit={onSubmit}
          showTouchButtons={showTouchButtons}
          disabled={state.currentIndex < 1}
          clearSignal={state.commitCount}
        />
      </div>

      {state.currentIndex < 1 && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Erste Zahl wird gesprochen — warte auf die zweite, dann addiere.
        </p>
      )}

      {state.ttsWarning && (
        <p className="mt-4 text-sm text-amber-600 dark:text-amber-400 text-center">
          {state.ttsWarning}
        </p>
      )}

      <div className="mt-10 text-center">
        {!confirmAbort ? (
          <button
            type="button"
            onClick={() => setConfirmAbort(true)}
            className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Abbrechen
          </button>
        ) : (
          <div className="inline-flex gap-2">
            <button
              type="button"
              onClick={onAbort}
              className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
            >
              Wirklich abbrechen
            </button>
            <button
              type="button"
              onClick={() => setConfirmAbort(false)}
              className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Weiter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
