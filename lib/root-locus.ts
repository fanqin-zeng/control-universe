/** CLASSIC-06: actual characteristic roots and the full third-order response. */
export type Pole = [number, number];
export const BREAK_GAIN = 16 * Math.sqrt(3) / 9;
export const DEFAULT_GAIN = 224 / 27;
export function cubicRoots(a: number, b: number, c: number): Pole[] {
  if (![a, b, c].every(Number.isFinite)) throw new RangeError('finite coefficients required');
  const p = b - a * a / 3, q = 2 * a ** 3 / 27 - a * b / 3 + c;
  const delta = q * q / 4 + p ** 3 / 27;
  const tolerance = 1e-13 * Math.max(1, q * q / 4, Math.abs(p ** 3 / 27));
  let roots: Pole[];
  if (delta > tolerance) {
    const u = Math.cbrt(-q / 2 + Math.sqrt(delta)), v = Math.cbrt(-q / 2 - Math.sqrt(delta));
    roots = [[u + v - a / 3, 0], [-(u + v) / 2 - a / 3, Math.sqrt(3) * (u - v) / 2], [-(u + v) / 2 - a / 3, -Math.sqrt(3) * (u - v) / 2]];
  } else if (delta >= -tolerance) {
    const u = Math.cbrt(-q / 2);
    roots = [[2 * u - a / 3, 0], [-u - a / 3, 0], [-u - a / 3, 0]];
  } else {
    const radius = 2 * Math.sqrt(-p / 3);
    const theta = Math.acos(Math.max(-1, Math.min(1, -q / (2 * Math.sqrt(-(p ** 3) / 27))))) / 3;
    roots = [0, 1, 2].map(i => [radius * Math.cos(theta - 2 * Math.PI * i / 3) - a / 3, 0]);
  }
  return roots.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
}
export function rootLocusExample(k: number) {
  if (!Number.isFinite(k) || k < 0 || k > 60) throw new RangeError('0 <= K <= 60');
  const poles = cubicRoots(6, 8, k), steps: [number, number][] = [[0, 0]];
  let y = 0, v = 0, acc = 0;
  const dt = .001;
  const f = (x: number, z: number, w: number) => [z, w, k - k * x - 8 * z - 6 * w];
  for (let i = 1; i <= 10000; i++) {
    const a = f(y, v, acc);
    const b = f(y + dt * a[0] / 2, v + dt * a[1] / 2, acc + dt * a[2] / 2);
    const c = f(y + dt * b[0] / 2, v + dt * b[1] / 2, acc + dt * b[2] / 2);
    const d = f(y + dt * c[0], v + dt * c[1], acc + dt * c[2]);
    y += dt * (a[0] + 2 * b[0] + 2 * c[0] + d[0]) / 6;
    v += dt * (a[1] + 2 * b[1] + 2 * c[1] + d[1]) / 6;
    acc += dt * (a[2] + 2 * b[2] + 2 * c[2] + d[2]) / 6;
    if (i % 20 === 0) steps.push([i * dt, y]);
  }
  const status = k === 0 ? 'K=0：含零特征根，不渐近稳定；该输入输出通道为零' : k === 48 ? '虚轴边界：不渐近稳定，不BIBO稳定' : k < 48 ? '严格稳定' : '两个右半平面根，不稳定';
  return {k, poles, steps, status, last: steps[steps.length - 1][1]};
}
export function rootLocusBackground(): Pole[] {
  return Array.from({length: 601}, (_, i) => cubicRoots(6, 8, i / 10)).flat();
}
