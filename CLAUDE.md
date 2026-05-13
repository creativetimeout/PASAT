# CLAUDE.md — PASAT-3 Selbsttest-App

## Projektziel

Eine browserbasierte Web-App, mit der Nutzer den **Paced Auditory Serial Addition Test (PASAT-3)** als Selbsttest durchführen können. Fokus liegt auf Übung und Selbsteinschätzung — **keine** klinische Verwendung, **keine** Datenspeicherung über die laufende Session hinaus.

## Disclaimer (im UI sichtbar zeigen)

> Diese Anwendung dient ausschließlich der persönlichen Übung und Selbsteinschätzung. Sie ist **kein** medizinisches Diagnose- oder Messinstrument und ersetzt keine ärztliche Untersuchung. Ergebnisse sind nicht klinisch validiert.

## Tech-Stack

- **Build:** Vite
- **Framework:** React 18 (JavaScript, kein TypeScript)
- **Styling:** Tailwind CSS
- **Audio:** Web Speech API (`SpeechSynthesisUtterance`)
- **State:** React Hooks (`useState`, `useEffect`, `useRef`, `useReducer` für Test-State-Machine)
- **Routing:** nicht nötig (Single-Page-Flow)
- **Persistenz:** keine. Optional `localStorage` für Einstellungen (Stimme, Sprache, Lautstärke).

## Projektstruktur

```
src/
  components/
    StartScreen.jsx        # Einführung, Disclaimer, Start-Button
    SettingsPanel.jsx      # Sprache, Stimme, Test-Länge, Interval
    PracticeMode.jsx       # 10-Zahlen-Übungsdurchlauf vor dem echten Test
    TestRunner.jsx         # Hauptkomponente: spielt Zahlen ab, nimmt Antworten entgegen
    NumberDisplay.jsx      # Optional: visuelles Feedback während TTS
    AnswerInput.jsx        # Eingabefeld (Tastatur) + optionale Buttons 0-18
    ResultScreen.jsx       # Score, Genauigkeit, Verlauf der Antworten
  hooks/
    useSpeech.js           # Web Speech API Wrapper
    usePasatEngine.js      # Test-Logik: Sequenz, Timing, Scoring
  lib/
    numberSequence.js      # Generiert valide Zahlenfolgen (1–9)
    scoring.js             # Berechnet Score & Statistiken
    speechVoices.js        # Verfügbare Stimmen pro Sprache filtern
  App.jsx
  main.jsx
  index.css                # Tailwind directives
```

## Test-Spezifikation (PASAT-3)

### Standard-Parameter

- **Anzahl Zahlen:** 61 (ergibt 60 Antworten)
- **Intervall:** 3,0 Sekunden zwischen Zahlen-Onsets (PASAT-3)
- **Zahlenbereich:** zufällige Einzelziffern 1–9 (kein 0)
- **Aufgabe:** Nutzer addiert immer die **letzte** mit der **vorletzten** Zahl. **Nicht** die laufende Summe.
- **Beispiel:** Zahlen `2, 5, 3, 8` → erwartete Antworten `7, 8, 11`

### Sequenz-Generierung (`lib/numberSequence.js`)

- Zufallsfolge, aber: keine drei identischen Zahlen in Folge (Anti-Pattern).
- Optional: vordefinierte Standard-Sequenz (Form A) als Auswahl anbieten, damit Wiederholbarkeit für den Nutzer möglich ist.

### Scoring (`lib/scoring.js`)

- **Total Correct:** Anzahl richtiger Antworten (0–60)
- **Accuracy:** Prozent
- **Reaction Pattern:** durchschnittliche Antwortzeit (vom Zahlen-Onset bis Antwort-Submit)
- **Fehler-Typen:**
  - _Verpasst_ (keine Antwort innerhalb des Intervalls)
  - _Falsch_ (Antwort gegeben, aber inkorrekt)
  - _Häufiger Fehler:_ "Chunking" — Nutzer addiert eigene Antwort statt vorgegebene Zahl. Erkennen wenn `userAnswer == lastUserAnswer + currentNumber`.

## Audio (Web Speech API)

### Wrapper `hooks/useSpeech.js`

- Initialisierung: `speechSynthesis.getVoices()` (mit `onvoiceschanged`-Listener, da Stimmen async geladen werden).
- Funktion `speak(text, { lang, voice, rate, volume })`.
- Wichtig: vor jedem `speak()` ein `speechSynthesis.cancel()` aufrufen, damit überlappende Utterances nicht queuen.
- `rate: 1.0` als Default, aber konfigurierbar.

### Stimmen / Sprachen

- Default: Browser-Sprache erkennen (`navigator.language`), passende Stimme wählen.
- UI: Dropdown mit allen verfügbaren Stimmen, gruppiert nach Sprache (de-DE, en-US, en-GB, …).
- Hinweis im UI: "Stimmen-Auswahl ist browserabhängig" — manche Browser haben nur eine Stimme pro Sprache.

### Timing-Genauigkeit

- Web Speech API ist **nicht** für millisekunden-genaues Timing ausgelegt.
- Lösung: das **Intervall** (3 s) startet beim **Onset** der TTS-Ausgabe (`utterance.onstart`), nicht beim `speak()`-Aufruf.
- `setTimeout` für die nächste Zahl wird von `onstart` getriggert.
- Auf langsamen Geräten: wenn `onstart` länger als z. B. 500 ms braucht, Warnung anzeigen.

## Test-Flow (State Machine)

```
IDLE → SETTINGS → PRACTICE → READY → RUNNING → COMPLETE → IDLE
                     ↓                   ↓
                  (skip)              ABORTED
```

States in `usePasatEngine.js` mit `useReducer`:

- `IDLE`: Startbildschirm
- `SETTINGS`: Einstellungen
- `PRACTICE`: 10-Zahlen-Übung (optional überspringbar)
- `READY`: 3-2-1-Countdown
- `RUNNING`: Test läuft
- `COMPLETE`: Ergebnis-Screen
- `ABORTED`: Abbruch-Bestätigung

## Eingabe-Modus

- **Primär:** numerisches Eingabefeld + Enter (für Desktop / Tastatur).
- **Sekundär:** Touch-Buttons 0–18 (für Mobile / Touchscreen) — toggleable.
- Antwort gilt als "abgegeben" bei Enter oder beim Onset der nächsten Zahl.
- Wenn vor nächster Zahl nichts eingegeben → als _verpasst_ werten.

## UI / UX

- **Minimalistisch:** während des Tests nur die nötigsten Elemente (Eingabefeld, optional aktueller Zahlenindex z. B. "12 / 60", Abbrechen-Button).
- **Keine** Anzeige der gesprochenen Zahl während des Tests (würde den Test trivialisieren).
- Großer Kontrast, große Schrift, ruhiger Hintergrund.
- Tailwind: dark mode supporten (`dark:` Variants), zentriertes Layout, max-width auf `prose`-Container für Erklärtexte.

## Barrierefreiheit

- Tastatur-Navigation für alle Aktionen.
- `aria-live="polite"` für Status-Meldungen (z. B. "Test läuft").
- `aria-label` für Buttons.
- Wichtig: Audio-Inhalt **darf nicht** parallel via Screenreader vorgelesen werden — Test-Zahlen nicht in den DOM schreiben, solange Test läuft.

## Einstellungen (persistiert in `localStorage`)

- Sprache der Stimme
- gewählte Stimme
- Sprechgeschwindigkeit (rate: 0.8–1.2)
- Lautstärke
- Test-Länge (Standard 60, alternativ 30 für Kurzversion)
- Intervall (Standard 3.0 s, alternativ 2.0 s = PASAT-2 für Fortgeschrittene)
- Dark mode

## Ergebnis-Screen

- Großer Score (`X / 60 richtig`)
- Genauigkeit in %
- Liste aller Zahlen-Paare mit: erwartete Antwort, gegebene Antwort, Status (✓/✗/–)
- Hinweis auf Lerneffekt: "Bei wiederholter Durchführung verbessern sich die meisten Menschen — das ist normal und kein klinischer Befund."
- Button: "Neuer Test" / "Einstellungen ändern"

## Was NICHT gebaut wird (Scope-Grenzen)

- Keine Benutzerkonten, kein Backend, keine Cloud-Speicherung.
- Keine Verlaufshistorie über Sessions hinweg (Privacy + Scope).
- Keine Vergleichswerte mit Normpopulation (das wäre klinische Interpretation).
- Kein Datenexport (CSV/PDF) — bei Bedarf später als Feature.
- Kein MSFC-Gesamt-Score (PASAT ist nur eine Komponente).
- Keine vorab aufgenommenen Audio-Dateien (Scope: nur Web Speech API).

## Entwicklungs-Konventionen

- Funktionale React-Komponenten, keine Klassen.
- JSDoc-Kommentare an Hooks und lib-Funktionen.
- Dateinamen: Komponenten `PascalCase.jsx`, Hooks `useCamelCase.js`, lib `camelCase.js`.
- Keine externen UI-Libraries — Tailwind reicht.
- ESLint mit Standard-Vite-React-Config.
- Prettier mit 2-Space-Indentation, single quotes.

## Setup-Befehle

```bash
npm create vite@latest pasat-app -- --template react
cd pasat-app
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# tailwind.config.js content: ["./index.html", "./src/**/*.{js,jsx}"]
# index.css: @tailwind base; @tailwind components; @tailwind utilities;
npm run dev
```

## Testing (optional, falls erwünscht)

- Vitest für lib-Funktionen (`numberSequence`, `scoring`).
- Manuelle Tests für TTS-Timing in verschiedenen Browsern (Chrome, Firefox, Safari).
- Keine E2E-Tests im initialen Scope.

## Browser-Support

- Chrome / Edge: voll unterstützt.
- Firefox: Web Speech API funktioniert, aber Stimmenauswahl begrenzt.
- Safari: funktioniert, aber Stimmen-Loading-Verhalten anders — testen.
- Mobile Safari: User-Gesture notwendig vor erstem `speak()` — Start-Button erfüllt das.

## Hinweise an Claude (Coding-Agent)

- Beim Implementieren von TTS: immer den `onstart`-Callback als Timing-Anker nutzen, nie `setTimeout` direkt nach `speak()`.
- Vor Code-Änderungen kurz Plan skizzieren, dann implementieren.
- Bei Unklarheit zur Test-Mechanik: Quelle ist Gronwall (1977) bzw. die NMSS-Task-Force-Beschreibung (1999).
- Keine Library für Audio hinzufügen — Web Speech API reicht.
- Bei UI-Entscheidungen: im Zweifel weniger / minimalistischer.
