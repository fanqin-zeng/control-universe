/** Known independent Gaussian observation variances; Gaussian prior N(20, p). */
export function statisticalEstimate(r1: number, r2: number, p: number) {
  const precision = 1 / r1 + 1 / r2;
  const weighted = (22 / r1 + 24 / r2) / precision;
  const posterior = (20 / p + 22 / r1 + 24 / r2) / (precision + 1 / p);
  return { ordinary: 23, weighted, weightedVariance: 1 / precision, posterior, posteriorVariance: 1 / (precision + 1 / p) };
}

export function statisticalObjectives(theta: number, r1: number, r2: number, p: number) {
  const data = ((theta - 22) ** 2 / r1 + (theta - 24) ** 2 / r2) / 2;
  return { data, posterior: data + (theta - 20) ** 2 / (2 * p) };
}
