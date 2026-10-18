export function lqrModel(q1: number, q2: number, r: number, gain = 1) {
  if (![q1,q2,r,gain].every(Number.isFinite)||q1<.1||q1>20||q2<.1||q2>20||r<.1||r>32||gain<.1||gain>3) throw Error('LQR component domain');
  const k1 = Math.sqrt(q1 / r);
  const k2 = Math.sqrt(2 * k1 + q2 / r);
  const a = gain * k2 / 2, b = gain * k1;
  const delta = a * a - b;
  const pole = delta >= 0
    ? `${(-a + Math.sqrt(delta)).toFixed(4)}, ${(-a - Math.sqrt(delta)).toFixed(4)}`
    : `${(-a).toFixed(4)} ± ${Math.sqrt(-delta).toFixed(4)}j`;
  const points = Array.from({ length: 601 }, (_, i) => {
    const t = 15 * i / 600; // T/(len-1), no subsampling time conversion.
    let x: number, v: number;
    if (Math.abs(delta) < 1e-10) {
      x = Math.exp(-a * t) * (1 + a * t);
      v = -b * t * Math.exp(-a * t);
    } else if (delta < 0) {
      const w = Math.sqrt(-delta);
      x = Math.exp(-a * t) * (Math.cos(w * t) + a / w * Math.sin(w * t));
      v = -b / w * Math.exp(-a * t) * Math.sin(w * t);
    } else {
      const d = Math.sqrt(delta), p = -a + d, m = -a - d;
      x = (-m * Math.exp(p * t) + p * Math.exp(m * t)) / (2 * d);
      v = b * (Math.exp(m * t) - Math.exp(p * t)) / (2 * d);
    }
    return { t, x, v, u: -gain * (k1 * x + k2 * v) };
  });
  return { k1, k2, p11: r * k1 * k2, p12: r * k1, p22: r * k2, pole, points };
}
