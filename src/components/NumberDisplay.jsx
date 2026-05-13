import React, { useEffect, useState } from 'react';

/**
 * Subtle visual pulse on each number onset — does NOT display the number
 * (would trivialize the test).
 */
export default function NumberDisplay({ currentIndex }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (currentIndex < 0) return;
    setPulse(true);
    const id = setTimeout(() => setPulse(false), 300);
    return () => clearTimeout(id);
  }, [currentIndex]);

  return (
    <div className="flex justify-center my-4" aria-hidden="true">
      <div
        className={`w-4 h-4 rounded-full transition-all duration-300 ${
          pulse ? 'bg-blue-500 scale-150' : 'bg-gray-300 dark:bg-gray-600 scale-100'
        }`}
      />
    </div>
  );
}
