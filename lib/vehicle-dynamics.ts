export const vehicle = { mass: 1600, inertia: 2500, front: 1.4, rear: 1.4, cf: 80000, cr: 80000 };

export function rearAxleArc(speed: number, steer: number, time: number) {
  if (![speed, steer, time].every(Number.isFinite) || speed < 0 || time < 0 || Math.abs(steer) >= Math.PI / 2) throw new RangeError('Invalid geometry inputs');
  const curvature = Math.tan(steer) / (vehicle.front + vehicle.rear);
  const yaw = speed * curvature * time;
  if (Math.abs(curvature) < 1e-12) return { X: speed * time, Y: 0, yaw, yawRate: speed * curvature };
  return { X: Math.sin(yaw) / curvature, Y: (1 - Math.cos(yaw)) / curvature, yaw, yawRate: speed * curvature };
}

export function lateralResponse(speed: number, steer: number, mu: number) {
  if (![speed, steer, mu].every(Number.isFinite) || speed < 5 || speed > 25 || Math.abs(steer) > 0.080000001 || mu < 0.2 || mu > 1) throw new RangeError('Teaching dynamic model requires 5 <= speed <= 25 m/s');
  const { mass: m, inertia: iz, front: a, rear: b, cf, cr } = vehicle;
  const A = [-(cf + cr) / (m * speed), -speed - (a * cf - b * cr) / (m * speed), -(a * cf - b * cr) / (iz * speed), -(a * a * cf + b * b * cr) / (iz * speed)];
  const B = [cf / m, a * cf / iz];
  const determinant = A[0] * A[3] - A[1] * A[2];
  const vySteady = -(A[3] * B[0] - A[1] * B[1]) * steer / determinant;
  const rSteady = -(-A[2] * B[0] + A[0] * B[1]) * steer / determinant;
  const derivative = (vy: number, r: number) => [A[0] * vy + A[1] * r + B[0] * steer, A[2] * vy + A[3] * r + B[1] * steer];
  let vy = 0, r = 0;
  const h = 0.002, points: number[][] = [[0, 0, 0]];
  for (let i = 1; i <= 1000; i++) {
    const k1 = derivative(vy, r), k2 = derivative(vy + h * k1[0] / 2, r + h * k1[1] / 2);
    const k3 = derivative(vy + h * k2[0] / 2, r + h * k2[1] / 2), k4 = derivative(vy + h * k3[0], r + h * k3[1]);
    vy += h * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) / 6;
    r += h * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) / 6;
    if (i % 5 === 0) points.push([i * h, vy, r]);
  }
  const ay = speed * rSteady;
  return { points, vySteady, rSteady, ay, usage: Math.abs(ay) / (mu * 9.81), frontSlip: steer - (vySteady + a * rSteady) / speed, rearSlip: -(vySteady - b * rSteady) / speed };
}
