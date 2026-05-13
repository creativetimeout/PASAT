/** @type {Record<string, Record<string, string>>} */
const translations = {
  de: {
    // StartScreen
    subtitle: 'Selbsttest',
    instructionPre: 'Addiere jede gehörte Zahl mit der ',
    instructionEm: 'vorherigen',
    instructionPost: ' — nicht die laufende Summe.',
    example: 'Beispiel',
    disclaimer: 'Nur zur persönlichen Übung. Kein medizinisches Diagnoseinstrument.',
    startTest: 'Test starten',
    startPractice: 'Übung (10 Zahlen)',
    openSettings: 'Einstellungen',

    // SettingsPanel
    settings: 'Einstellungen',
    done: 'Fertig',
    groupAudio: 'Audio',
    labelVoiceLang: 'Sprache',
    labelVoice: 'Stimme',
    voiceDefault: 'Standard',
    voiceDefaultSuffix: ' (Std.)',
    labelRate: 'Sprechgeschwindigkeit',
    labelVolume: 'Lautstärke',
    voiceNote: 'Stimmen-Auswahl ist browserabhängig.',
    groupTest: 'Test',
    labelLength: 'Länge',
    length61: '61 (60 Antw.)',
    length31: '31 (30 Antw.)',
    labelInterval: 'Intervall',
    interval3000: '3,0 s (PASAT-3)',
    interval2000: '2,0 s (PASAT-2)',
    groupDisplay: 'Darstellung',
    labelTouchButtons: 'Touch-Buttons 0–18',
    labelDarkMode: 'Dark Mode',
    labelUiLang: 'App-Sprache',
    uiLangDe: 'Deutsch',
    uiLangEn: 'English',

    // TestRunner
    modeLabel_practice: 'Übung',
    modeLabel_test: 'Test',
    firstNumberHint: 'Erste Zahl wird gesprochen — warte auf die zweite, dann addiere.',
    abort: 'Abbrechen',
    abortConfirm: 'Wirklich abbrechen',
    abortCancel: 'Weiter',

    // ResultScreen
    practiceComplete: 'Übung beendet',
    testComplete: 'Test beendet',
    practiceSubtitle: 'Bereit für den echten Test?',
    testSubtitle: 'Deine Ergebnisse',
    statCorrect: 'Richtig',
    accuracyLabel: '{value}% Genauigkeit',
    statReaction: '⌀ Reaktion',
    statMissed: 'Verpasst',
    statWrong: 'Falsch',
    chunkingNote:
      'Bei {count} Antwort(en) wurde ein typisches „Chunking"-Muster erkannt: Du hast deine vorige Antwort statt der vorgegebenen Zahl addiert.',
    learningNote:
      'Bei wiederholter Durchführung verbessern sich die meisten Menschen — das ist normal und kein klinischer Befund.',
    detailsToggle: 'Detailansicht ({count})',
    colNum: '#',
    colPair: 'Paar',
    colExpected: 'Erw.',
    colGiven: 'Geg.',
    colStatus: 'Status',
    colMs: 'ms',
    chunkLabel: 'Chunk',
    newTest: 'Neuer Test',
    home: 'Startseite',

    // AnswerInput
    answerAriaLabel: 'Antwort eingeben und mit Enter bestätigen',
    answerButtonAriaLabel: 'Antwort {n} eintragen',
    clearInput: 'Eingabe löschen',

    // App
    noSpeechApi:
      'Dein Browser unterstützt die Web Speech API nicht. Der Test funktioniert nicht.',
  },

  en: {
    // StartScreen
    subtitle: 'Self-test',
    instructionPre: 'Add each heard number to the ',
    instructionEm: 'previous',
    instructionPost: ' one — not the running total.',
    example: 'Example',
    disclaimer: 'For personal practice only. Not a medical diagnostic instrument.',
    startTest: 'Start test',
    startPractice: 'Practice (10 numbers)',
    openSettings: 'Settings',

    // SettingsPanel
    settings: 'Settings',
    done: 'Done',
    groupAudio: 'Audio',
    labelVoiceLang: 'Language',
    labelVoice: 'Voice',
    voiceDefault: 'Default',
    voiceDefaultSuffix: ' (Def.)',
    labelRate: 'Speech rate',
    labelVolume: 'Volume',
    voiceNote: 'Voice selection depends on the browser.',
    groupTest: 'Test',
    labelLength: 'Length',
    length61: '61 (60 ans.)',
    length31: '31 (30 ans.)',
    labelInterval: 'Interval',
    interval3000: '3.0 s (PASAT-3)',
    interval2000: '2.0 s (PASAT-2)',
    groupDisplay: 'Display',
    labelTouchButtons: 'Touch buttons 0–18',
    labelDarkMode: 'Dark mode',
    labelUiLang: 'App language',
    uiLangDe: 'Deutsch',
    uiLangEn: 'English',

    // TestRunner
    modeLabel_practice: 'Practice',
    modeLabel_test: 'Test',
    firstNumberHint: 'First number is spoken — wait for the second, then add.',
    abort: 'Cancel',
    abortConfirm: 'Really cancel',
    abortCancel: 'Continue',

    // ResultScreen
    practiceComplete: 'Practice done',
    testComplete: 'Test done',
    practiceSubtitle: 'Ready for the real test?',
    testSubtitle: 'Your results',
    statCorrect: 'Correct',
    accuracyLabel: '{value}% accuracy',
    statReaction: '⌀ Reaction',
    statMissed: 'Missed',
    statWrong: 'Wrong',
    chunkingNote:
      '{count} answer(s) showed a typical "chunking" pattern: you added your previous answer instead of the given number.',
    learningNote:
      'Most people improve with repeated practice — this is normal and not a clinical finding.',
    detailsToggle: 'Details ({count})',
    colNum: '#',
    colPair: 'Pair',
    colExpected: 'Exp.',
    colGiven: 'Giv.',
    colStatus: 'Status',
    colMs: 'ms',
    chunkLabel: 'Chunk',
    newTest: 'New test',
    home: 'Home',

    // AnswerInput
    answerAriaLabel: 'Enter answer and confirm with Enter',
    answerButtonAriaLabel: 'Enter answer {n}',
    clearInput: 'Clear input',

    // App
    noSpeechApi: 'Your browser does not support the Web Speech API. The test will not work.',
  },
};

/**
 * Returns a translation function `t(key, vars?)` for the given language.
 * Falls back to German for unknown languages or missing keys.
 * Variables are interpolated as `{key}` placeholders.
 * @param {string} lang
 * @returns {(key: string, vars?: Record<string, string|number>) => string}
 */
export function getT(lang) {
  const primary = translations[lang] ?? translations.de;
  const fallback = translations.de;
  return (key, vars) => {
    let str = primary[key] ?? fallback[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return str;
  };
}

export const SUPPORTED_UI_LANGS = ['de', 'en'];
