export interface SimPoint {
  t: number;
  y: number;
}

export function stepResponseSecondOrder(
  zeta: number,
  omega: number,
  tEnd = 20,
  dt = 0.02
): SimPoint[] {
  // State-space form of standard second-order system:
  // x1 = y, x2 = y'
  // A = [[0, 1], [-omega^2, -2*zeta*omega]], B = [0, omega^2], u = 1
  const A = [
    [0, 1],
    [-omega * omega, -2 * zeta * omega],
  ];
  const B = [0, omega * omega];
  let x = [0, 0];
  const out: SimPoint[] = [];

  for (let t = 0; t <= tEnd; t += dt) {
    out.push({ t, y: x[0] });
    const k1 = f(x, A, B, 1);
    const k2 = f(add(x, scale(k1, dt / 2)), A, B, 1);
    const k3 = f(add(x, scale(k2, dt / 2)), A, B, 1);
    const k4 = f(add(x, scale(k3, dt)), A, B, 1);
    x = add(
      x,
      scale(add(add(k1, scale(k2, 2)), add(scale(k3, 2), k4)), dt / 6)
    );
  }
  return out;
}

function f(x: number[], A: number[][], B: number[], u: number) {
  return [
    A[0][0] * x[0] + A[0][1] * x[1] + B[0] * u,
    A[1][0] * x[0] + A[1][1] * x[1] + B[1] * u,
  ];
}

function add(a: number[], b: number[]) {
  return a.map((v, i) => v + b[i]);
}

function scale(a: number[], s: number) {
  return a.map((v) => v * s);
}
