import { useEffect, useState } from 'react';

/**
 * Subtle visual pulse on each number onset — does NOT display the number
 * (would trivialize the test).
 */
export default function NumberDisplay({ currentIndex }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (currentIndex < 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPulse(true);
    const id = setTimeout(() => setPulse(false), 350);
    return () => clearTimeout(id);
  }, [currentIndex]);

  return (
    <div className="flex justify-center" aria-hidden="true">
      <div
        className={`w-3 h-3 rounded-full transition-all duration-300 ease-out ${
          pulse
            ? 'bg-ios-blue dark:bg-ios-blue-dark scale-[2] opacity-100'
            : 'bg-ios-fill-3 dark:bg-ios-dark-border scale-100 opacity-70'
        }`}
      />
    </div>
  );
}
