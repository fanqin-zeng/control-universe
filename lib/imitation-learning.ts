export interface ImitationParameters { k: number; b: number; x0: number; horizon?: number }
export const imitationDefaults: ImitationParameters = { k: 0, b: 0.01, x0: 0.1, horizon: 20 };

export function imitationRollout({ k, b, x0, horizon = 20 }: ImitationParameters) {
  if (![k, b, x0].every(Number.isFinite) || k < -0.2 || k > 1.5 || Math.abs(b) > 0.02 || Math.abs(x0) > 0.5 || !Number.isInteger(horizon) || horizon < 1 || horizon > 20) throw new RangeError("超出教学模型参数范围");
  const points: [number, number][] = [[0, x0]];
  for (let step = 1; step <= horizon; step++) {
    const previous = points[points.length - 1][1];
    const next = previous + (-k * previous + b);
    points.push([step, next]);
    if (Math.abs(next) > 1) break;
  }
  const expert: [number, number][] = Array.from({ length: horizon + 1 }, (_, step) => [step, x0 * 0.5 ** step]);
  const trainMSE = [-0.02, 0, 0.02].reduce((sum, x) => sum + ((0.5 - k) * x + b) ** 2, 0) / 3;
  return { points, expert, trainMSE, finalX: points[points.length - 1][1], lastStep: points[points.length - 1][0], exited: Math.abs(points[points.length - 1][1]) > 1, expertFinal: expert[horizon][1] };
}
