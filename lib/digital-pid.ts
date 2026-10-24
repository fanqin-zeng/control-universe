/** One sample, units: time s, N and Kb 1/s. I is known before output. */
export function digitalPidSample(N = 10, c = 0, kb = 2) {
  if (!Number.isFinite(N) || N < 1 || N > 50 || !Number.isFinite(c) || c < 0 || c > 1 || !Number.isFinite(kb) || kb < 0 || kb > 25) {
    throw new RangeError('N in [1,50], c in [0,1], kb in [0,25]');
  }
  const Ts = 0.1, kd = 0.5, alpha = 1 / (1 + N * Ts);
  const derivative = (1 - alpha) * kd * c / Ts;
  // A second, deliberately separate PI snapshot: P=2,I=1,e=1,Ki=1.
  const raw = 3, actual = 1, integralNext = 1 + Ts * (1 + kb * (actual - raw));
  const pole = 1 - kb * Ts;
  const response = Array.from({length: 21}, (_, k) => ({time: k * Ts,
    derivative: derivative * alpha ** k}));
  return {Ts, alpha, derivative, raw, actual, integralNext, pole,
    trackingStable: Math.abs(pole) < 1, response};
}
