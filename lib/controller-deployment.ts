export type DeploymentSignal = 'step' | 'pulse' | 'decay';
export const deploymentSignals: DeploymentSignal[] = ['step', 'pulse', 'decay'];
/** Round to nearest; exact half ties go away from zero. */
export function roundAway(x: number) { return Math.sign(x) * Math.floor(Math.abs(x) + .5); }
export function signedWord(x: number, F: number) {
  return Math.min(32767, Math.max(-32768, roundAway(x * 2 ** F)));
}
export function deploymentExperiment(Ts = .02, F = 8, signal: DeploymentSignal = 'step') {
  if (!Number.isFinite(Ts) || Ts < .01 || Ts > .1 || !Number.isInteger(F) || F < 4 || F > 12 || !deploymentSignals.includes(signal)) throw new RangeError('Ts [.01,.1], F integer [4,12], known signal');
  const a = (.4 - Ts) / (.4 + Ts), b = 2 * Ts / (.4 + Ts), scale = 2 ** F;
  const A = signedWord(a, F), B = signedWord(b, F), aq = A / scale, bq = B / scale;
  let previous = signal === 'decay' ? .25 : 0, word = signedWord(previous, F), previousInput = 0;
  let maxError = 0, clipped = 0; const points = [];
  for (let k = 0; k < 80; k++) {
    const input = signal === 'decay' ? 0 : signal === 'step' ? 1 : k < 20 ? 1 : k < 40 ? -1 : 0;
    const floating = a * previous + b * (input + previousInput);
    // Each product has scale^2. Round the wide accumulator once to stored scale.
    const accumulator = A * word + B * signedWord(input, F) + B * signedWord(previousInput, F);
    const rounded = roundAway(accumulator / scale), next = Math.min(32767, Math.max(-32768, rounded));
    if (next !== rounded) clipped++;
    const fixed = next / scale;
    maxError = Math.max(maxError, Math.abs(fixed - floating));
    points.push({t: k * Ts, input, floating, fixed, word: next});
    previous = floating; word = next; previousInput = input;
  }
  return {Ts, F, signal, a, b, A, B, aq, bq, scale, first: points[0].floating,
    fixedFirst: points[0].fixed, finalFloat: previous, finalFixed: word / scale,
    maxError, clipped, deadbandBound: 1 / scale / (2 * (1 - Math.abs(aq))), points};
}
