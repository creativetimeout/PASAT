/**
 * Computes the expected answers (sum of last two numbers) for a PASAT sequence.
 * @param {number[]} sequence
 * @returns {number[]} array of length sequence.length - 1
 */
export function computeExpected(sequence) {
  const out = [];
  for (let i = 1; i < sequence.length; i++) {
    out.push(sequence[i] + sequence[i - 1]);
  }
  return out;
}

/**
 * Evaluates user answers against expected ones.
 * @param {number[]} sequence
 * @param {(number|null)[]} userAnswers  parallel to expected; null = missed
 * @param {(number|null)[]} reactionsMs  parallel; ms from number onset to submit; null if missed
 * @returns {{
 *   totalCorrect: number,
 *   accuracy: number,
 *   avgReactionMs: number|null,
 *   perItem: Array<{
 *     index: number,
 *     pair: [number, number],
 *     expected: number,
 *     given: number|null,
 *     status: 'correct'|'wrong'|'missed',
 *     reactionMs: number|null,
 *     chunkingError: boolean
 *   }>
 * }}
 */
export function evaluateAnswers(sequence, userAnswers, reactionsMs) {
  const expected = computeExpected(sequence);
  const perItem = [];
  let correct = 0;
  let rtSum = 0;
  let rtCount = 0;
  let lastGiven = null;

  for (let i = 0; i < expected.length; i++) {
    const given = userAnswers[i];
    const exp = expected[i];
    const reactionMs = reactionsMs[i] ?? null;
    let status;
    let chunkingError = false;

    if (given == null || Number.isNaN(given)) {
      status = 'missed';
    } else if (given === exp) {
      status = 'correct';
      correct++;
    } else {
      status = 'wrong';
      // Chunking: user added previous given answer to current spoken number.
      const currentNumber = sequence[i + 1];
      if (lastGiven != null && given === lastGiven + currentNumber) {
        chunkingError = true;
      }
    }

    if (reactionMs != null) {
      rtSum += reactionMs;
      rtCount++;
    }

    perItem.push({
      index: i,
      pair: [sequence[i], sequence[i + 1]],
      expected: exp,
      given: given ?? null,
      status,
      reactionMs,
      chunkingError,
    });

    lastGiven = given ?? null;
  }

  return {
    totalCorrect: correct,
    accuracy: expected.length ? (correct / expected.length) * 100 : 0,
    avgReactionMs: rtCount ? Math.round(rtSum / rtCount) : null,
    perItem,
  };
}
