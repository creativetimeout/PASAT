import React, { useEffect, useRef, useState } from 'react';

/**
 * Self-contained input: holds its own value to avoid re-rendering
 * the whole engine tree on every keystroke.
 *
 * - `onPendingChange(value)` is called on every change so the engine
 *   can persist the latest value into its ref (deadline-commit needs it).
 * - `onSubmit(value)` commits on Enter or button press.
 * - `clearSignal` (any value) triggers a local reset whenever it changes.
 */
export default function AnswerInput({
  onPendingChange,
  onSubmit,
  showTouchButtons,
  disabled,
  clearSignal,
}) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  // Reset on each commit signal (Enter or deadline).
  useEffect(() => {
    setValue('');
    onPendingChange('');
    if (!disabled) inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearSignal]);

  // Re-focus when enabled flips.
  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const change = (v) => {
    setValue(v);
    onPendingChange(v);
  };

  const submit = (v) => {
    onSubmit(v);
    // Local clear is also handled by clearSignal, but do it immediately
    // for snappier feel.
    setValue('');
    onPendingChange('');
    if (!disabled) inputRef.current?.focus();
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
        inputMode="numeric"
        autoComplete="off"
        autoFocus
        disabled={disabled}
        value={value}
        onChange={(e) => change(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Antwort eingeben und mit Enter bestätigen"
        className="w-full max-w-xs mx-auto block text-center text-6xl py-4 px-6 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {showTouchButtons && (
        <div className="mt-6 grid grid-cols-5 gap-2 max-w-md mx-auto">
          {Array.from({ length: 19 }, (_, n) => (
            <button
              key={n}
              type="button"
              disabled={disabled}
              onClick={() => submit(String(n))}
              className="py-3 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={`Antwort ${n}`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={disabled}
            onClick={() => change('')}
            className="col-span-5 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-sm"
          >
            Eingabe löschen
          </button>
        </div>
      )}
    </div>
  );
}
