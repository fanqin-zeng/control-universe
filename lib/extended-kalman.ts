export type MeasurementKind = "linear" | "square";
export function ekfUpdate(mu: number, variance: number, noise: number, observation: number, kind: MeasurementKind) {
  if (!(variance > 0 && noise > 0)) throw new Error("Positive variances required");
  const predictedObservation = kind === "square" ? mu * mu : mu;
  const jacobian = kind === "square" ? 2 * mu : 1;
  const innovation = observation - predictedObservation;
  const innovationVariance = jacobian * jacobian * variance + noise;
  const gain = variance * jacobian / innovationVariance;
  const mean = mu + gain * innovation;
  const posteriorVariance = (1 - gain * jacobian) ** 2 * variance + gain * gain * noise;
  return { predictedObservation, jacobian, innovation, innovationVariance, gain, mean, variance: posteriorVariance };
}
/** Deterministic one-dimensional teaching reference, not an EKF recursion. */
export function ekfPosterior(mu: number, variance: number, noise: number, observation: number, kind: MeasurementKind) {
  const ekf = ekfUpdate(mu, variance, noise, observation, kind);
  const steps = 4800, dx = 24 / steps;
  const logDensity = (x: number) => -((x - mu) ** 2) / (2 * variance) - (observation - (kind === "square" ? x * x : x)) ** 2 / (2 * noise);
  const logs = Array.from({ length: steps + 1 }, (_, i) => logDensity(-12 + i * dx));
  const shift = Math.max(...logs);
  let mass = 0, first = 0, second = 0;
  for (let i = 0; i <= steps; i++) {
    const x = -12 + i * dx, weight = (i === 0 || i === steps ? 1 : i % 2 === 0 ? 2 : 4) * Math.exp(logs[i] - shift) * dx / 3;
    mass += weight; first += weight * x; second += weight * x * x;
  }
  const referenceMean = first / mass, referenceVariance = second / mass - referenceMean * referenceMean;
  const curve = Array.from({ length: 241 }, (_, i) => {
    const x = -6 + i / 20;
    return { x, approximate: Math.exp(-((x - ekf.mean) ** 2) / (2 * ekf.variance)) / Math.sqrt(2 * Math.PI * ekf.variance), reference: Math.exp(logDensity(x) - shift) / mass };
  });
  return { ...ekf, referenceMean, referenceVariance, conditionalRisk: referenceVariance + (ekf.mean - referenceMean) ** 2, curve };
}
export function nonlinearPrediction(mu: number, variance: number, processVariance: number) {
  const jacobian = 1 + .2 * mu;
  return { jacobian, mean: mu + .1 * mu * mu, variance: jacobian * jacobian * variance + processVariance };
}
export function radarJacobian(x: number, y: number) {
  const squared = x * x + y * y;
  if (squared === 0) return null;
  const range = Math.sqrt(squared);
  return { range, bearing: Math.atan2(y, x), jacobian: [[x / range, y / range], [-y / squared, x / squared]] };
}
export function wrapInnovation(angle: number) { return Math.atan2(Math.sin(angle), Math.cos(angle)); }
