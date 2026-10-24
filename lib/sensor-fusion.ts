export function whitenedPair(prior: number, r1: number, r2: number, cross: number, z1: number, z2: number) {
  if (![prior, r1, r2, cross, z1, z2].every(Number.isFinite) || !(prior > 0 && r1 > 0 && r2 > 0 && r1 * r2 > cross * cross)) throw new Error("Positive definite joint noise covariance required");
  const firstVariance = prior * r1 / (prior + r1), firstMean = prior / (prior + r1) * z1;
  const secondH = 1 - cross / r1, secondReading = z2 - cross / r1 * z1, secondNoise = r2 - cross * cross / r1;
  const gain = firstVariance * secondH / (secondH * secondH * firstVariance + secondNoise);
  return { mean: firstMean + gain * (secondReading - secondH * firstMean), variance: (1 - gain * secondH) ** 2 * firstVariance + gain * gain * secondNoise, secondH, secondReading, secondNoise };
}
export function covarianceIntersection(m1: number, p1: number, m2: number, p2: number, omega: number) {
  if (![m1, p1, m2, p2, omega].every(Number.isFinite) || !(p1 > 0 && p2 > 0 && omega >= 0 && omega <= 1)) throw new Error("Invalid covariance-intersection inputs");
  const variance = 1 / (omega / p1 + (1 - omega) / p2), a = variance * omega / p1, b = variance * (1 - omega) / p2;
  return { mean: a * m1 + b * m2, variance, a, b, worstMse: (a * Math.sqrt(p1) + b * Math.sqrt(p2)) ** 2 };
}
/** Same-time scalar Gaussian measurements, prior independent of the full measurement-noise vector. */
export function fusionExperiment(prior: number, secondVariance: number, correlation: number, firstReading: number, secondReading: number) {
  if (![prior, secondVariance, correlation, firstReading, secondReading].every(Number.isFinite) || !(prior > 0 && secondVariance > 0 && Math.abs(correlation) < 1)) throw new Error("Invalid Gaussian fusion contract");
  const cross = correlation * Math.sqrt(secondVariance), determinant = secondVariance - cross * cross;
  const variance = 1 / (1 / prior + (secondVariance + 1 - 2 * cross) / determinant);
  const firstWeight = variance * (secondVariance - cross) / determinant, secondWeight = variance * (1 - cross) / determinant, priorWeight = variance / prior;
  const mean = firstWeight * firstReading + secondWeight * secondReading;
  const actualMse = priorWeight * priorWeight * prior + firstWeight ** 2 + secondWeight ** 2 * secondVariance + 2 * firstWeight * secondWeight * cross;
  const naiveVariance = 1 / (1 / prior + 1 + 1 / secondVariance), naiveFirst = naiveVariance, naiveSecond = naiveVariance / secondVariance;
  const naiveMean = naiveFirst * firstReading + naiveSecond * secondReading;
  const naiveActualMse = (naiveVariance / prior) ** 2 * prior + naiveFirst ** 2 + naiveSecond ** 2 * secondVariance + 2 * naiveFirst * naiveSecond * cross;
  const singleVariance = prior / (prior + 1), singleMean = singleVariance * firstReading;
  const density = (x: number, m: number, p: number) => Math.exp(-((x - m) ** 2) / (2 * p)) / Math.sqrt(2 * Math.PI * p);
  const curve = Array.from({ length: 241 }, (_, i) => { const x = -4 + i / 24; return { x, joint: density(x, mean, variance), naive: density(x, naiveMean, naiveVariance), single: density(x, singleMean, singleVariance) }; });
  return { prior, secondVariance, correlation, firstReading, secondReading, cross, determinant, mean, variance, firstWeight, secondWeight, priorWeight, actualMse, naiveMean, naiveVariance, naiveActualMse, singleMean, singleVariance, whitened: whitenedPair(prior, 1, secondVariance, cross, firstReading, secondReading), reversed: whitenedPair(prior, secondVariance, 1, cross, secondReading, firstReading), curve };
}
