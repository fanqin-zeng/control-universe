import { ekfPosterior, type MeasurementKind } from "./extended-kalman";
export type { MeasurementKind } from "./extended-kalman";
/** Scalar scaled UT. These deterministic quadrature nodes are not random particles. */
export function unscentedTransform(mu: number, variance: number, fn: (x: number) => number, alpha = 1, beta = 2, kappa = 0) {
  if (![mu, variance, alpha, beta, kappa].every(Number.isFinite) || !(variance > 0 && alpha > 0 && 1 + kappa > 0)) throw new Error("Invalid sigma-point parameters");
  const c = alpha * alpha * (1 + kappa), lambda = c - 1;
  const points = [mu, mu + Math.sqrt(c * variance), mu - Math.sqrt(c * variance)];
  const wm = [lambda / c, 1 / (2 * c), 1 / (2 * c)], wc = [wm[0] + 1 - alpha * alpha + beta, wm[1], wm[2]];
  const values = points.map(fn), mean = values.reduce((s, v, i) => s + wm[i] * v, 0);
  const outputVariance = values.reduce((s, v, i) => s + wc[i] * (v - mean) ** 2, 0);
  const cross = values.reduce((s, v, i) => s + wc[i] * (points[i] - mu) * (v - mean), 0);
  if (![...values, mean, outputVariance, cross].every(Number.isFinite)) throw new Error("Non-finite transform");
  return { points, wm, wc, values, mean, variance: outputVariance, cross };
}
/** One additive-noise measurement update, deliberately limited to scalar teaching models. */
export function ukfPosterior(mu: number, variance: number, noise: number, observation: number, kind: MeasurementKind) {
  if (![noise, observation].every(Number.isFinite) || !(noise > 0)) throw new Error("Positive finite measurement variance required");
  const transformed = unscentedTransform(mu, variance, x => kind === "square" ? x * x : x);
  const innovationVariance = transformed.variance + noise, gain = transformed.cross / innovationVariance;
  const mean = mu + gain * (observation - transformed.mean), posteriorVariance = variance - gain * innovationVariance * gain;
  if (!(innovationVariance > 0 && posteriorVariance > 0)) throw new Error("Invalid approximate covariance; inspect model and weights");
  const ekf = ekfPosterior(mu, variance, noise, observation, kind);
  const curve = ekf.curve.map(point => ({ ...point, ekf: point.approximate, approximate: Math.exp(-((point.x - mean) ** 2) / (2 * posteriorVariance)) / Math.sqrt(2 * Math.PI * posteriorVariance) }));
  return { predictedObservation: transformed.mean, innovation: observation - transformed.mean, innovationVariance, cross: transformed.cross, gain, mean, variance: posteriorVariance, referenceMean: ekf.referenceMean, referenceVariance: ekf.referenceVariance, ekfMean: ekf.mean, ekfVariance: ekf.variance, transformed, curve };
}
