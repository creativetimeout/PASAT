import { useCallback, useEffect, useReducer, useRef } from 'react';
import { generateSequence } from '../lib/numberSequence.js';
import { evaluateAnswers } from '../lib/scoring.js';
import { useSpeech } from './useSpeech.js';

export const PHASES = {
  IDLE: 'IDLE',
  SETTINGS: 'SETTINGS',
  PRACTICE: 'PRACTICE',
  READY: 'READY',
  RUNNING: 'RUNNING',
  COMPLETE: 'COMPLETE',
  ABORTED: 'ABORTED',
};

const initialState = {
  phase: PHASES.IDLE,
  mode: 'test', // 'test' | 'practice'
  sequence: [],
  currentIndex: -1, // index of the most recently spoken seq element
  answers: [],
  reactionsMs: [],
  commitCount: 0, // increments on every committed answer (used as clear signal)
  intervalTick: 0, // increments each time a new answer-interval starts (onend → next onset)
  intervalDurationMs: 0, // duration of the currently running answer-interval
  isSpeaking: false, // true between TTS onStart and onEnd of the current number
  result: null,
  ttsWarning: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'GOTO':
      return { ...state, phase: action.phase };
    case 'START_RUN': {
      const exp = Math.max(0, action.sequence.length - 1);
      return {
        ...initialState,
        phase: PHASES.RUNNING,
        mode: action.mode,
        sequence: action.sequence,
        currentIndex: -1,
        answers: Array(exp).fill(null),
        reactionsMs: Array(exp).fill(null),
        commitCount: 0,
        result: null,
        ttsWarning: null,
      };
    }
    case 'ONSET': {
      return { ...state, currentIndex: action.index };
    }
    case 'SET_SPEAKING': {
      return { ...state, isSpeaking: action.value };
    }
    case 'INTERVAL_START': {
      return {
        ...state,
        intervalTick: state.intervalTick + 1,
        intervalDurationMs: action.durationMs,
      };
    }
    case 'COMMIT_ANSWER': {
      const i = action.index;
      if (i < 0 || i >= state.answers.length) return state;
      if (state.answers[i] != null) return state; // already committed
      const answers = state.answers.slice();
      const reactionsMs = state.reactionsMs.slice();
      const parsed = action.value === '' || action.value == null
        ? null
        : Number(action.value);
      answers[i] = Number.isFinite(parsed) ? parsed : null;
      reactionsMs[i] = action.reactionMs ?? null;
      return { ...state, answers, reactionsMs, commitCount: state.commitCount + 1 };
    }
    case 'COMPLETE': {
      const result = evaluateAnswers(state.sequence, state.answers, state.reactionsMs);
      return { ...state, phase: PHASES.COMPLETE, result };
    }
    case 'ABORT':
      return { ...state, phase: PHASES.ABORTED };
    case 'RESET':
      return { ...initialState };
    case 'TTS_WARNING':
      return { ...state, ttsWarning: action.message };
    default:
      return state;
  }
}

/**
 * PASAT test engine hook.
 * @param {{
 *   testLength: number,
 *   intervalMs: number,
 *   lang: string,
 *   voice: SpeechSynthesisVoice|null,
 *   rate: number,
 *   volume: number,
 * }} settings
 */
export function usePasatEngine(settings) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { voices, speak, cancel, supported } = useSpeech();

  const timerRef = useRef(null);
  const onsetTsRef = useRef([]); // ms timestamp per spoken number
  const lastSpeakCalledAtRef = useRef(0);
  const pendingValueRef = useRef('');
  const pendingInputAtRef = useRef(null); // performance.now() when user last changed the input
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const speakIndex = useCallback(
    (sequence, index) => {
      const s = settingsRef.current;
      lastSpeakCalledAtRef.current = performance.now();
      speak({
        text: String(sequence[index]),
        lang: s.lang,
        voice: s.voice,
        rate: s.rate,
        volume: s.volume,
        onStart: () => {
          const now = performance.now();
          onsetTsRef.current[index] = now;
          // Drift warning: time between speak() call and actual onset.
          const drift = now - lastSpeakCalledAtRef.current;
          if (drift > 500) {
            dispatch({
              type: 'TTS_WARNING',
              message: `TTS-Startverzögerung ${Math.round(drift)} ms — Timing kann ungenau sein.`,
            });
          }
          // Deadline-commit for previous answer.
          // answer[i] becomes answerable at onset[i+1] and its deadline is onset[i+2].
          // So at onset of seq[index] (index >= 2), the deadline for answer[index-2] has arrived.
          if (index >= 2) {
            const answerIndex = index - 2;
            const onsetTs = onsetTsRef.current[index - 1];
            const inputTs = pendingInputAtRef.current;
            const reactionMs =
              inputTs != null && onsetTs != null
                ? Math.max(0, Math.round(inputTs - onsetTs))
                : null;
            dispatch({
              type: 'COMMIT_ANSWER',
              index: answerIndex,
              value: pendingValueRef.current,
              reactionMs,
            });
            pendingValueRef.current = '';
            pendingInputAtRef.current = null;
          }
          dispatch({ type: 'ONSET', index });
          dispatch({ type: 'SET_SPEAKING', value: true });
        },
        onEnd: () => {
          dispatch({ type: 'SET_SPEAKING', value: false });
          // Interval starts only AFTER the number was fully spoken,
          // so the user gets the full intervalMs as response time.
          const isLast = index === sequence.length - 1;
          const intervalMs = settingsRef.current.intervalMs;
          dispatch({ type: 'INTERVAL_START', durationMs: intervalMs });
          clearTimer();
          timerRef.current = setTimeout(() => {
            if (isLast) {
              // Final commit window has elapsed for the last answer.
              const lastOnsetTs = onsetTsRef.current[sequence.length - 1];
              const lastInputTs = pendingInputAtRef.current;
              const lastReactionMs =
                lastInputTs != null && lastOnsetTs != null
                  ? Math.max(0, Math.round(lastInputTs - lastOnsetTs))
                  : null;
              dispatch({
                type: 'COMMIT_ANSWER',
                index: sequence.length - 2,
                value: pendingValueRef.current,
                reactionMs: lastReactionMs,
              });
              dispatch({ type: 'COMPLETE' });
              clearTimer();
            } else {
              speakIndex(sequence, index + 1);
            }
          }, intervalMs);
        },
      });
    },
    [speak]
  );

  const startRun = useCallback(
    (mode) => {
      const length = mode === 'practice' ? 10 : settingsRef.current.testLength;
      const seq = generateSequence(length);
      onsetTsRef.current = [];
      pendingValueRef.current = '';
      pendingInputAtRef.current = null;
      dispatch({ type: 'START_RUN', sequence: seq, mode });
      // Kick off first utterance on next tick to ensure state has updated.
      setTimeout(() => speakIndex(seq, 0), 50);
    },
    [speakIndex]
  );

  const submitAnswer = useCallback((value) => {
    const i = state.currentIndex - 1;
    if (i < 0 || i >= state.answers.length) return;
    if (state.answers[i] != null) return;
    const onset = onsetTsRef.current[state.currentIndex] || performance.now();
    const reactionMs = Math.max(0, Math.round(performance.now() - onset));
    pendingValueRef.current = '';
    dispatch({
      type: 'COMMIT_ANSWER',
      index: i,
      value,
      reactionMs,
    });
  }, [state.currentIndex, state.answers]);

  // Updates pending value ref only — no React state change, no re-render.
  // Also records the timestamp for reaction-time calculation on deadline-commit.
  const updatePending = useCallback((value) => {
    pendingValueRef.current = value;
    pendingInputAtRef.current = value !== '' ? performance.now() : null;
  }, []);

  const abort = useCallback(() => {
    clearTimer();
    cancel();
    pendingValueRef.current = '';
    pendingInputAtRef.current = null;
    onsetTsRef.current = [];
    dispatch({ type: 'RESET' });
  }, [cancel]);

  const reset = useCallback(() => {
    clearTimer();
    cancel();
    pendingValueRef.current = '';
    pendingInputAtRef.current = null;
    onsetTsRef.current = [];
    dispatch({ type: 'RESET' });
  }, [cancel]);

  const goto = useCallback((phase) => dispatch({ type: 'GOTO', phase }), []);

  useEffect(() => {
    return () => {
      clearTimer();
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  return {
    state,
    voices,
    supported,
    startRun,
    submitAnswer,
    updatePending,
    abort,
    reset,
    goto,
  };
}
