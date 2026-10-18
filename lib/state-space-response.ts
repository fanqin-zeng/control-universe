/** Exact displacement response for m=250, c=500, k=16000, F=1000, v(0)=0. */
export function stateSpaceResponse(x0: number, t: number) {
  if (!Number.isFinite(x0) || x0 < 0 || x0 > 0.2 || !Number.isFinite(t) || t < 0) {
    throw new RangeError("Expected 0 <= initial displacement <= 0.2 and t >= 0");
  }
  const m = 250, c = 500, k = 16000, force = 1000;
  const wn = Math.sqrt(k / m), alpha = c / (2 * m), zeta = alpha / wn;
  const wd = Math.sqrt(wn * wn - alpha * alpha), limit = force / k;
  const g = Math.exp(-alpha * t) * (Math.cos(wd * t) + alpha / wd * Math.sin(wd * t));
  const dg = -wn * wn / wd * Math.exp(-alpha * t) * Math.sin(wd * t);
  const free = x0 * g, step = limit * (1 - g);
  return {free, step, total: free + step, velocity: (x0 - limit) * dg, wn, zeta, wd, limit};
}
