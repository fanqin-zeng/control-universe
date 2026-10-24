/** Exact, restricted D/K example. Not a general musyn or dynamic D fitting solver. */
export type DkParameters = { k: number; d: number; frequency: number };
export const dkDefault: DkParameters = { k: .5, d: 1, frequency: 0 };
export function dkReadings(p: DkParameters) {
  const b = 2 - 1.5 * p.k, c = .125 + .675 * p.k;
  const attenuation = Math.hypot(1, p.frequency);
  const mu = Math.sqrt(b * c), upper = Math.max(p.d * b, c / p.d);
  return { b, c, mu, upper, singleMu: mu / attenuation, singleUpper: upper / attenuation,
    optimalD: Math.sqrt(c / b), radius: 1 / mu };
}
export function dkKStep(d: number) {
  // Decreasing db(k), increasing c(k)/d: the crossing or closest endpoint.
  return Math.min(1, Math.max(0, (2 * d * d - .125) / (1.5 * d * d + .675)));
}
export function dkTrace(initialD: number, rounds = 4) {
  let k = .5, d = initialD;
  const rows = [{ step: '初始', k, d, ...dkReadings({ k, d, frequency: 0 }) }];
  for (let i = 1; i <= rounds; i++) {
    k = dkKStep(d); rows.push({ step: `K${i}`, k, d, ...dkReadings({ k, d, frequency: 0 }) });
    d = dkReadings({ k, d, frequency: 0 }).optimalD;
    rows.push({ step: `D${i}`, k, d, ...dkReadings({ k, d, frequency: 0 }) });
  }
  return rows;
}
