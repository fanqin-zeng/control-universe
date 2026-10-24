/** Teaching model only: ideal velocity interface, sampled observations, ZOH commands. */
export type EmbodiedParams = { delay: number; hold: number; gain: number; body: number };
export const embodiedDefaults: EmbodiedParams = { delay: 0, hold: 1, gain: 2, body: 1 };
export function simulateEmbodied(p: EmbodiedParams) {
  const {delay, hold, gain, body} = p;
  if (!Number.isInteger(delay) || delay < 0 || delay > 4 || !Number.isInteger(hold) || hold < 1 || hold > 5 || gain < .5 || gain > 3 || body < .5 || body > 1.5 || !Number.isFinite(gain + body)) throw new Error('参数超出教学范围');
  const x = [0], y: number[] = [], u: number[] = [];
  let command = 0, updates = 0;
  for (let k = 0; k < 60; k++) {
    y.push(x[Math.max(0, k - delay)]);
    if (k % hold === 0) {
      command = Math.max(-1, Math.min(1, gain * (1 - y[k])));
      updates++;
    }
    u.push(command);
    x.push(x[k] + .1 * body * command + (k === 20 ? -.2 : 0));
  }
  return {x, y, u, updates, final: x[60], error: Math.abs(1-x[60]), peak: Math.max(...x), times: x.map((_, k)=>k*.1)};
}
