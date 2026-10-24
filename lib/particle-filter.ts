export type ParticleMode = "discrete" | "gaussian";
export function normalizeLogWeights(logs: number[]) {
  if (!logs.length || logs.some(x => Number.isNaN(x) || x === Infinity)) throw new Error("Invalid log weights");
  const shift = Math.max(...logs);
  if (!Number.isFinite(shift)) throw new Error("No finite particle likelihood; inspect proposal support");
  const values = logs.map(x => Math.exp(x - shift)), total = values.reduce((a, b) => a + b, 0);
  return values.map(x => x / total);
}
/** One uniform offset, half-open CDF intervals; duplicates are ancestors, not new evidence. */
export function systematicAncestors(weights: number[], offset: number) {
  const n = weights.length, sum = weights.reduce((a, b) => a + b, 0);
  if (!n || weights.some(x => !Number.isFinite(x) || x < 0) || Math.abs(sum - 1) > 1e-10 || !(offset >= 0 && offset < 1 / n)) throw new Error("Invalid resampling inputs");
  const ancestors: number[] = []; let j = 0, cumulative = weights[0];
  for (let i = 0; i < n; i++) {
    const target = offset + i / n;
    while (j < n - 1 && target >= cumulative) cumulative += weights[++j];
    ancestors.push(j);
  }
  return ancestors;
}
function generator(seed: number) {
  if (!(Number.isInteger(seed) && seed > 0 && seed <= 0xffffffff)) throw new Error("Nonzero uint32 seed required");
  let state = seed >>> 0;
  return () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; state >>>= 0; return (state + .5) / 4294967296; };
}
function moments(x: number[], w: number[]) {
  const mean = x.reduce((s, v, i) => s + w[i] * v, 0);
  return { mean, variance: x.reduce((s, v, i) => s + w[i] * (v - mean) ** 2, 0), negativeMass: x.reduce((s, v, i) => s + (v < 0 ? w[i] : 0), 0), ess: 1 / w.reduce((s, v) => s + v * v, 0) };
}
export function empiricalCdf(x: number[], w: number[]) {
  const ordered = x.map((v, i) => ({ x: v, weight: w[i] })).sort((a, b) => a.x - b.x);
  let cumulative = 0; const curve: [number, number][] = [];
  for (let i = 0; i < ordered.length; i++) { const p = ordered[i]; cumulative += p.weight; if ((i === ordered.length - 1 || ordered[i + 1].x !== p.x) && p.x >= -6 && p.x <= 6) curve.push([p.x, cumulative]); }
  const below = x.reduce((s, v, i) => s + (v <= -6 ? w[i] : 0), 0), end = x.reduce((s, v, i) => s + (v <= 6 ? w[i] : 0), 0);
  return [[-6, below], ...curve, [6, end]] as [number, number][];
}
/** Finite-interval Simpson reference is a teaching benchmark, not a particle-filter operation. */
export function continuousReference(mu: number, noise: number, observation: number) {
  const steps = 4800, dx = 24 / steps;
  const logs = Array.from({ length: steps + 1 }, (_, i) => { const x = -12 + i * dx; return -((x - mu) ** 2) / 2 - (observation - x * x) ** 2 / (2 * noise); });
  const shift = Math.max(...logs), density = logs.map(v => Math.exp(v - shift)), cumulative = Array(steps + 1).fill(0);
  let first = 0, second = 0;
  for (let i = 0; i <= steps; i++) { const x = -12 + i * dx, a = (i === 0 || i === steps ? 1 : i % 2 ? 4 : 2) * dx / 3 * density[i]; first += a * x; second += a * x * x; }
  for (let i = 2; i <= steps; i += 2) cumulative[i] = cumulative[i - 2] + dx / 3 * (density[i - 2] + 4 * density[i - 1] + density[i]);
  const mass = cumulative[steps], mean = first / mass;
  return { mean, variance: second / mass - mean * mean, negativeMass: cumulative[2400] / mass, curve: Array.from({ length: 241 }, (_, i) => [-6 + i / 20, cumulative[1200 + i * 10] / mass] as [number, number]) };
}
export function particleExperiment(mode: ParticleMode, count: number, mu: number, noise: number, observation: number, seed: number) {
  if (![mu, noise, observation].every(Number.isFinite) || !(noise > 0) || ![64, 256, 1024].includes(count) || !["discrete", "gaussian"].includes(mode)) throw new Error("Invalid teaching experiment");
  const random = generator(seed);
  const particles = mode === "discrete" ? [-2, -1, 1, 2] : Array.from({ length: count }, () => mu + Math.sqrt(-2 * Math.log(random())) * Math.cos(2 * Math.PI * random()));
  const n = particles.length, logs = particles.map(x => -((observation - x * x) ** 2) / (2 * noise));
  const weights = normalizeLogWeights(logs), offset = mode === "discrete" ? 1 / (2 * n) : random() / n;
  const ancestors = systematicAncestors(weights, offset), resampled = ancestors.map(i => particles[i]), uniform = Array(n).fill(1 / n);
  const before = moments(particles, weights), after = moments(resampled, uniform);
  const reference = mode === "discrete" ? { ...before, curve: empiricalCdf(particles, weights) } : continuousReference(mu, noise, observation);
  return { mode, count: n, mu: mode === "discrete" ? 0 : mu, noise, observation, seed, particles, weights, offset, ancestors, resampled, before, after, uniqueAncestors: new Set(ancestors).size, reference, weightedCurve: empiricalCdf(particles, weights), resampledCurve: empiricalCdf(resampled, uniform) };
}
