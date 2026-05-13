import React, { useEffect, useRef, useState } from 'react';

/**
 * Visualises the remaining time of the current answer-interval.
 * Restarts whenever `tick` changes, runs a CSS width transition from 100% to 0%
 * over `durationMs`. Pure CSS animation → no per-frame React re-renders.
 */
export default function IntervalProgress({ tick, durationMs }) {
  const [progress, setProgress] = useState(0); // 0..100, 100 = full, 0 = elapsed
  const rafRef = useRef(null);

  useEffect(() => {
    if (!tick || !durationMs) {
      setProgress(0);
      return;
    }
    // Reset to 100% (no transition), then on next frame transition to 0%.
    setProgress(100);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        setProgress(0);
      });
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick, durationMs]);

  const active = tick > 0;

  return (
    <div
      className="h-2 w-full max-w-xs mx-auto bg-gray-200 dark:bg-gray-700 rounded overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="h-full bg-blue-500 dark:bg-blue-400 rounded"
        style={{
          width: `${progress}%`,
          transition: active && progress === 0 ? `width ${durationMs}ms linear` : 'none',
        }}
      />
    </div>
  );
}
