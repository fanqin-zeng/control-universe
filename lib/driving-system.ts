export interface StoppingBudget { speed: number; delay: number; deceleration: number; gap: number }

/** Synthetic stationary-obstacle model; distances in metres, times in seconds. */
export function stoppingBudget({ speed, delay, deceleration, gap }: StoppingBudget) {
  if (![speed, delay, deceleration, gap].every(Number.isFinite) || speed < 0 || delay < 0 || deceleration <= 0 || gap < 0) {
    throw new RangeError('Invalid stopping model parameters');
  }
  const reaction = speed * delay;
  const braking = speed * speed / (2 * deceleration);
  const required = reaction + braking + 2;
  return { reaction, braking, travel: reaction + braking, required, reserve: gap - required };
}
