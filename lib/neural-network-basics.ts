/** ML-03: deterministic forward inference only; parameters are constructed, not trained. */
export type Activation = 'relu' | 'linear' | 'tanh';
export const centers = [-1, -.5, 0, .5, 1];
export const gains = [0, .5, 1, 2];
export const hiddenOffsets = [-3, -1, 0, 1];
export function activate(z: number, kind: Activation): number {
  return kind === 'relu' ? Math.max(0, z) : kind === 'tanh' ? Math.tanh(z) : z;
}
export function forward(x: number, c = 0, gain = 1, offset = 0, kind: Activation = 'relu') {
  const z = [x - c + offset, -x + c + offset];
  const h = z.map(v => activate(v, kind));
  return {z, h, output: gain * (h[0] + h[1])};
}
export function losses(c = 0, gain = 1, offset = 0, kind: Activation = 'relu') {
  const mse = (xs: number[]) => xs.reduce((s, x) => s + (forward(x, c, gain, offset, kind).output - Math.abs(x)) ** 2, 0) / xs.length;
  return {training: mse([-1, 0, 1]), validation: mse([-.5, .5]), test: mse([-.75, .75])};
}
export function xorForward(x1: number, x2: number) {
  const h1 = Math.max(0, x1 + x2), h2 = Math.max(0, x1 + x2 - 1);
  return {h: [h1, h2], output: h1 - 2 * h2};
}
