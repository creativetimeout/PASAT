/**
 * Loads available speech synthesis voices, awaiting the async onvoiceschanged event if needed.
 * @returns {Promise<SpeechSynthesisVoice[]>}
 */
export function loadVoices() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }
    const existing = window.speechSynthesis.getVoices();
    if (existing && existing.length) {
      resolve(existing);
      return;
    }
    const handler = () => {
      const voices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(voices || []);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    // Safety timeout
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length) {
        window.speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve(voices);
      }
    }, 1000);
  });
}

/**
 * Groups voices by their primary language tag (e.g. "de-DE").
 * @param {SpeechSynthesisVoice[]} voices
 * @returns {Record<string, SpeechSynthesisVoice[]>}
 */
export function groupVoicesByLang(voices) {
  const groups = {};
  for (const v of voices) {
    const key = v.lang || 'unknown';
    if (!groups[key]) groups[key] = [];
    groups[key].push(v);
  }
  return groups;
}

/**
 * Picks a sensible default voice for the given BCP-47 lang tag.
 * Prefers exact match, then language prefix, then any default voice.
 * @param {SpeechSynthesisVoice[]} voices
 * @param {string} lang  e.g. "de-DE"
 * @returns {SpeechSynthesisVoice|null}
 */
export function pickDefaultVoice(voices, lang) {
  if (!voices || !voices.length) return null;
  const prefix = (lang || '').split('-')[0].toLowerCase();
  const exact = voices.find((v) => v.lang?.toLowerCase() === lang?.toLowerCase());
  if (exact) return exact;
  const prefixed = voices.find((v) => v.lang?.toLowerCase().startsWith(prefix));
  if (prefixed) return prefixed;
  const def = voices.find((v) => v.default);
  return def || voices[0];
}
