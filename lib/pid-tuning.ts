/** Fixed teaching experiment: deviations, seconds, exact ZOH, integer delay. */
export type TuningScenario = 'nominal' | 'delay' | 'unreachable' | 'noise';
export const tuningScenarios: TuningScenario[] = ['nominal', 'delay', 'unreachable', 'noise'];
export function tunePi(lambda = 1) {
  if (!Number.isFinite(lambda) || lambda < .25 || lambda > 3) throw new RangeError('lambda in [.25,3] s');
  const Kp = 4 / (2 * (lambda + .5)), Ti = Math.min(4, 4 * (lambda + .5));
  return {Kp, Ti, Ki: Kp / Ti};
}
export function tuningExperiment(lambda = 1, scenario: TuningScenario = 'nominal') {
  if (!tuningScenarios.includes(scenario)) throw new RangeError('unknown scenario');
  const gains = tunePi(lambda), dt = .05, count = 600;
  const delay = scenario === 'delay' ? 30 : 10, r = scenario === 'unreachable' ? 3 : 1;
  const a = Math.exp(-dt / 4), history: number[] = [], points = [];
  let y = 0, I = 0, previous = 0, iae = 0, tv = 0, saturated = 0, peak = 0;
  for (let k = 0; k <= count; k++) {
    const t = k * dt, noise = scenario === 'noise' ? .02 * Math.sin(8 * t) : 0;
    const e = r - y - noise, raw = gains.Kp * e + I, u = Math.max(0, Math.min(1, raw));
    points.push({t, y, u, r}); peak = Math.max(peak, y);
    if (k === count) break; // endpoint has no following hold interval
    history.push(u); iae += Math.abs(r - y) * dt; tv += Math.abs(u - previous); previous = u;
    if (raw <= 0 || raw >= 1) saturated++;
    // Hold I only when its increment would push farther into the active limit.
    if (!((raw >= 1 && e > 0) || (raw <= 0 && e < 0))) I += gains.Ki * dt * e;
    const delayed = k >= delay ? history[k - delay] : 0;
    const load = scenario === 'noise' && k >= 300 ? -.2 : 0;
    y = a * y + (1 - a) * 2 * (delayed + load);
  }
  return {...gains, lambda, scenario, dt, points, metrics: {
    iae, overshoot: 100 * Math.max(0, peak - r) / r, tv, saturated, finalError: r - y
  }};
}
