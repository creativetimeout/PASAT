import React, { useEffect, useRef, useState } from 'react';

/**
 * Circular interval-countdown gauge. Restarts whenever `tick` changes, runs a
 * CSS stroke-dashoffset transition from full → empty over `durationMs`. Pure CSS
 * animation → no per-frame React re-renders.
 */
export default function IntervalProgress({ tick, durationMs, size = 32, stroke = 3.5 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!tick || !durationMs) {
      setOffset(circumference);
      return;
    }
    // Reset to full (no transition), then on next frame transition to empty.
    setOffset(0);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        setOffset(circumference);
      });
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick, durationMs, circumference]);

  const active = tick > 0;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
      aria-hidden="true"
    >
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        strokeWidth={stroke}
        className="stroke-ios-fill-2 dark:stroke-ios-dark-border"
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        className="stroke-ios-blue dark:stroke-ios-blue-dark"
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          transition:
            active && offset === circumference
              ? `stroke-dashoffset ${durationMs}ms linear`
              : 'none',
        }}
      />
    </svg>
  );
}
