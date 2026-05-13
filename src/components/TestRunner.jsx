import React, { useState } from 'react';
import AnswerInput from './AnswerInput.jsx';
import NumberDisplay from './NumberDisplay.jsx';
import IntervalProgress from './IntervalProgress.jsx';
import { useTranslation } from '../hooks/useTranslation.js';

export default function TestRunner({
  state,
  showTouchButtons,
  onPendingChange,
  onSubmit,
  onAbort,
  isPractice,
}) {
  const t = useTranslation();
  const [confirmAbort, setConfirmAbort] = useState(false);
  const totalAnswers = Math.max(0, state.sequence.length - 1);
  const answeredCount = state.answers.filter((a) => a != null).length;
  const displayCurrent = Math.max(0, state.currentIndex + 1);
  const progressPct = totalAnswers > 0 ? (answeredCount / totalAnswers) * 100 : 0;

  return (
    <div className="mx-auto w-full max-w-md px-5 pt-8 pb-10">
      <div className="flex items-center justify-between mb-4">
        <span
          aria-live="polite"
          className="text-[13px] font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300"
        >
          {isPractice ? t('modeLabel_practice') : t('modeLabel_test')}
        </span>
        <span className="text-[13px] tabular-nums text-gray-600 dark:text-gray-300">
          {answeredCount} / {totalAnswers}
        </span>
      </div>

      <div className="h-1.5 w-full bg-ios-fill-2 dark:bg-ios-dark-surface-2 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-ios-blue dark:bg-ios-blue-dark rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="rounded-ios-lg bg-white dark:bg-ios-dark-surface shadow-ios px-5 pt-6 pb-7">
        <div className="grid grid-cols-3 items-center">
          <div />
          <span className="justify-self-center text-[28px] font-semibold tabular-nums text-gray-900 dark:text-white">
            {displayCurrent} <span className="text-gray-500 dark:text-gray-400 font-normal">/ {state.sequence.length}</span>
          </span>
          <div className="justify-self-end">
            <IntervalProgress
              tick={state.intervalTick}
              durationMs={state.intervalDurationMs}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <NumberDisplay currentIndex={state.currentIndex} />
        </div>

        <div className="mt-8">
          <AnswerInput
            onPendingChange={onPendingChange}
            onSubmit={onSubmit}
            showTouchButtons={showTouchButtons}
            clearSignal={state.currentIndex}
            locked={state.isSpeaking}
          />
        </div>

        {state.currentIndex < 1 && (
          <p className="text-center text-[13px] text-gray-600 dark:text-gray-300 mt-5">
            {t('firstNumberHint')}
          </p>
        )}

        {state.ttsWarning && (
          <p className="mt-4 text-[13px] text-ios-orange text-center">
            {state.ttsWarning}
          </p>
        )}
      </div>

      <div className="mt-8 text-center">
        {!confirmAbort ? (
          <button
            type="button"
            onClick={() => setConfirmAbort(true)}
            className="px-5 py-2.5 text-[15px] font-medium rounded-full text-ios-red active:opacity-60 transition"
          >
            {t('abort')}
          </button>
        ) : (
          <div className="inline-flex gap-2">
            <button
              type="button"
              onClick={onAbort}
              className="px-5 py-2.5 text-[15px] font-semibold rounded-full bg-ios-red text-white active:opacity-80 transition"
            >
              {t('abortConfirm')}
            </button>
            <button
              type="button"
              onClick={() => setConfirmAbort(false)}
              className="px-5 py-2.5 text-[15px] font-medium rounded-full bg-white dark:bg-ios-dark-surface text-gray-900 dark:text-gray-100 shadow-ios active:opacity-70 transition"
            >
              {t('abortCancel')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
