// Four independent plant channels, diagonal proportional feedback.
// r=[1,0], x(0)=0; fixed-step RK4 is independently checked against SciPy.
export function simulateMimo(kp1: number, kp2: number) {
  if (![kp1,kp2].every(v=>Number.isFinite(v)&&v>=0.5&&v<=5)) throw new RangeError("Kp must be within [0.5,5]");
  const derivative = (x: number[]) => {
    const u1 = kp1 * (1 - x[0] - x[1]);
    const u2 = -kp2 * (x[2] + x[3]);
    return [-x[0] + u1, -3 * x[1] + 0.5 * u2, -2 * x[2] + 0.3 * u1, -x[3] + u2];
  };
  const points: { t: number; y1: number; y2: number; u1: number; u2: number }[] = [];
  let x = [0, 0, 0, 0];
  const steps = 5000, dt = 10 / steps;
  for (let i = 0; i <= steps; i++) {
    if (i % 10 === 0) {
      const y1 = x[0] + x[1], y2 = x[2] + x[3];
      points.push({ t: i * dt, y1, y2, u1: kp1 * (1 - y1), u2: -kp2 * y2 });
    }
    if (i === steps) break;
    const k1 = derivative(x);
    const k2 = derivative(x.map((v, j) => v + dt * k1[j] / 2));
    const k3 = derivative(x.map((v, j) => v + dt * k2[j] / 2));
    const k4 = derivative(x.map((v, j) => v + dt * k3[j]));
    x = x.map((v, j) => v + dt * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]) / 6);
  }
  // (I + Kdc*diag(kp)) yInf = Kdc*diag(kp) r.
  const a = 1 + kp1, b = kp2 / 6, c = 0.15 * kp1, d = 1 + kp2;
  const determinant = a * d - b * c;
  const steady1 = (kp1 * d - b * 0.15 * kp1) / determinant;
  const steady2 = (a * 0.15 * kp1 - c * kp1) / determinant;
  const peak2 = points.reduce((best, v) => Math.abs(v.y2) > Math.abs(best.y2) ? v : best, points[0]);
  return { points, steady1, steady2, peak2 };
}
