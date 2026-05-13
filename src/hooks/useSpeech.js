import { useCallback, useEffect, useRef, useState } from 'react';
import { loadVoices } from '../lib/speechVoices.js';

/**
 * Wrapper around the Web Speech API.
 * Returns { voices, speak, cancel, supported }.
 * Always cancels any pending utterance before speaking a new one.
 */
export function useSpeech() {
  const [voices, setVoices] = useState([]);
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;
  const currentUtteranceRef = useRef(null);

  useEffect(() => {
    if (!supported) return;
    let cancelled = false;
    loadVoices().then((v) => {
      if (!cancelled) setVoices(v);
    });
    return () => {
      cancelled = true;
    };
  }, [supported]);

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    currentUtteranceRef.current = null;
  }, [supported]);

  /**
   * @param {object} opts
   * @param {string} opts.text
   * @param {string} [opts.lang]
   * @param {SpeechSynthesisVoice|null} [opts.voice]
   * @param {number} [opts.rate]    0.1 - 10 (typ. 0.8 - 1.2)
   * @param {number} [opts.volume]  0 - 1
   * @param {() => void} [opts.onStart]
   * @param {() => void} [opts.onEnd]
   */
  const speak = useCallback(
    ({ text, lang, voice, rate = 1.0, volume = 1.0, onStart, onEnd }) => {
      if (!supported) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      if (lang) u.lang = lang;
      if (voice) u.voice = voice;
      u.rate = rate;
      u.volume = volume;
      if (onStart) u.onstart = onStart;
      if (onEnd) u.onend = onEnd;
      currentUtteranceRef.current = u;
      window.speechSynthesis.speak(u);
    },
    [supported]
  );

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  return { voices, speak, cancel, supported };
}
