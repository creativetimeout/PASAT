import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation.js';

/**
 * Self-contained input: holds its own value to avoid re-rendering
 * the whole engine tree on every keystroke.
 *
 * - `onPendingChange(value)` is called on every change so the engine
 *   can persist the latest value into its ref (deadline-commit needs it).
 * - `onSubmit(value)` commits on Enter or button press.
 * - `clearSignal` (any value) triggers a local reset whenever it changes.
 * - `locked` blocks all input while TTS is speaking the next number, so
 *   late keystrokes from the previous challenge don't carry over.
 *
 * The input is never disabled — focus is held from the moment the test starts
 * so no layout shift (soft keyboard appearing) interferes with the first tap.
 * The engine itself ignores submissions before the first answerable position.
 */
export default function AnswerInput({
  onPendingChange,
  onSubmit,
  showTouchButtons,
  clearSignal,
  locked,
}) {
  const t = useTranslation();
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const lockedRef = useRef(locked);
  lockedRef.current = locked;

  useEffect(() => {
    setValue('');
    onPendingChange('');
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearSignal]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Hard-reset the value the moment TTS starts speaking the next number,
  // so any stray keystroke that lands in this window cannot fill the field.
  useEffect(() => {
    if (locked) {
      setValue('');
      onPendingChange('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked]);

  const change = (v) => {
    if (lockedRef.current) return;
    setValue(v);
    onPendingChange(v);
  };

  const submit = (v) => {
    if (lockedRef.current) return;
    onSubmit(v);
    setValue('');
    onPendingChange('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit(value);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="number"
        inputMode={showTouchButtons ? 'none' : 'numeric'}
        autoComplete="off"
        autoFocus
        readOnly={locked}
        value={value}
        onChange={(e) => change(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label={t('answerAriaLabel')}
        className={`w-full max-w-[16rem] mx-auto block text-center text-6xl sm:text-7xl font-semibold tabular-nums py-4 rounded-ios-lg bg-ios-fill-1 dark:bg-ios-dark-surface-2 text-gray-900 dark:text-white placeholder-ios-gray/40 border-0 caret-transparent focus:outline-none transition ${
          showTouchButtons ? '' : 'focus:ring-4 focus:ring-ios-blue/30'
        }`}
        placeholder="–"
      />

      {showTouchButtons && (
        <div className="mt-6 grid grid-cols-5 gap-2 max-w-md mx-auto">
          {Array.from({ length: 19 }, (_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => change(String(n))}
              className="py-3 rounded-ios bg-ios-fill-1 dark:bg-ios-dark-surface-2 text-gray-900 dark:text-gray-100 text-[17px] font-medium active:bg-ios-fill-2 dark:active:bg-ios-dark-border transition"
              aria-label={t('answerButtonAriaLabel', { n })}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => change('')}
            className="col-span-5 py-2.5 rounded-ios bg-ios-fill-2 dark:bg-ios-dark-border text-[13px] font-medium text-gray-700 dark:text-gray-200 active:opacity-70 transition"
          >
            {t('clearInput')}
          </button>
        </div>
      )}
    </div>
  );
}
