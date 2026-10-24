/** Continuous scalar model: a=-1, c=1, actual process/observation intensities=1. */
export function kalmanNoise(qAssumed: number, rAssumed: number) {
  if (!(qAssumed > 0 && rAssumed > 0)) throw new Error('Positive noise intensities required');
  const gain = Math.sqrt(1 + qAssumed / rAssumed) - 1;
  const nominal = rAssumed * gain;
  const actual = (1 + gain * gain) / (2 * (1 + gain));
  const optimal = Math.SQRT2 - 1;
  const curve = Array.from({ length: 101 }, (_, i) => {
    const time = i / 20;
    return [time, actual + (1 - actual) * Math.exp(-2 * (1 + gain) * time)];
  });
  return { gain, nominal, actual, optimal, pole: -1 - gain, curve };
}
