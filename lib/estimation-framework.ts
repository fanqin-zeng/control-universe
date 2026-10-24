/** One scalar correction; risk is over the calibrated, independent zero-mean error ensemble. */
export function estimationCorrection(priorVariance: number, sensorVariance: number, gain: number) {
  const priorMean = 20;
  const measurement = 23;
  return {
    priorMean, measurement,
    innovation: measurement - priorMean,
    estimate: priorMean + gain * (measurement - priorMean),
    risk: (1 - gain) ** 2 * priorVariance + gain ** 2 * sensorVariance,
    optimalGain: priorVariance / (priorVariance + sensorVariance),
    optimalRisk: priorVariance * sensorVariance / (priorVariance + sensorVariance),
  };
}
