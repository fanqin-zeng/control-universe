export type FilterParameters = { a: number; gain: number; q: number; r: number };
export const filterDefault: FilterParameters = { a: -1, gain: 4, q: 1, r: .25 };
export function filterReadings(p: FilterParameters) {
  const rate = p.gain - p.a, strength = p.q + p.r * p.gain * p.gain;
  const stable = rate > 0, kalmanGain = p.a + Math.sqrt(p.a * p.a + p.q / p.r);
  return { rate, strength, stable, peak: stable ? Math.sqrt(strength) / rate : null,
    variance: stable ? strength / (2 * rate) : null, kalmanGain,
    hinfGain: p.a < 0 ? -p.q / (p.r * p.a) : null,
    bestPeak: p.a < 0 ? Math.sqrt(p.q * p.r / (p.q + p.r * p.a * p.a)) : Math.sqrt(p.r),
    finiteOptimum: p.a < 0, eulerLimit: stable ? 2 / rate : null };
}
export function filterFrequency(p: FilterParameters, frequency: number) {
  const v = filterReadings(p);
  return v.stable ? Math.sqrt(v.strength) / Math.hypot(v.rate, frequency) : null;
}
export function filterPulseRatio(p: FilterParameters, duration: number) {
  const v = filterReadings(p);
  if (!v.stable || v.peak === null) return null;
  const x = v.rate * duration;
  return v.peak * Math.sqrt(1 + Math.expm1(-x) / x);
}
