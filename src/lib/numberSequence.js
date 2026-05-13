/**
 * Generates a random PASAT number sequence using single digits 1–9.
 * Constraint: no three identical numbers in a row.
 * @param {number} length total count of numbers in the sequence (default 61)
 * @returns {number[]}
 */
export function generateSequence(length = 61) {
  const seq = [];
  while (seq.length < length) {
    const n = 1 + Math.floor(Math.random() * 9);
    const len = seq.length;
    if (len >= 2 && seq[len - 1] === n && seq[len - 2] === n) {
      continue;
    }
    seq.push(n);
  }
  return seq;
}
