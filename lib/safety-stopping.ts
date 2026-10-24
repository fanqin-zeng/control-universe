/** Straight-line teaching model: coast through delay, then brake to rest. */
export function stoppingBudget(v: number, delay: number, brake: number, gap: number, error = 0.1) {
  if (![v, delay, brake, gap, error].every(Number.isFinite) || v < 0 || delay < 0 || brake <= 0 || gap < 0 || error < 0) {
    throw new RangeError('Invalid stopping-model parameters');
  }
  const delayDistance = v * delay;
  const brakingDistance = v * v / (2 * brake);
  const distance = delayDistance + brakingDistance;
  const available = gap - error;
  const margin = available - distance;
  const stopTime = v === 0 ? 0 : delay + v / brake;
  const curve: [number, number][] = Array.from({ length: 401 }, (_, i) => {
    const t = i / 40;
    const s = Math.min(Math.max(t - delay, 0), v / brake);
    return [t, v * Math.min(t, delay) + v * s - brake * s * s / 2];
  });
  return { delayDistance, brakingDistance, distance, available, margin, stopTime, curve };
}
