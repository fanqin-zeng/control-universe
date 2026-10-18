export type NlType =
  | "saturation"
  | "deadzone"
  | "relay"
  | "cubic"
  | "hysteresis"
  | "backlash";

// dir = +1 输入上升, -1 输入下降, 0 保持
function apply(type: NlType, u: number, p: number, prevY: number, dir: number): number {
  if (type === "hysteresis") {
    return u + p * (dir === 0 ? 1 : dir);
  }
  if (type === "backlash") {
    if (dir > 0) return Math.max(prevY, u - p);
    if (dir < 0) return Math.min(prevY, u + p);
    return prevY;
  }
  if (type === "saturation") return Math.min(Math.max(u, -p), p);
  if (type === "deadzone") return u > p ? u - p : u < -p ? u + p : 0;
  if (type === "relay") return u >= 0 ? p : -p;
  return u + p * u * u * u;
}

export const N_BRANCH = 1024;
const N_TIME = 2048;
const N_HARM = 25;

export function analyse(type: NlType, A: number, p: number) {
  // 先跑 3 个周期让有记忆非线性进入周期轨道；相位停在 theta=-pi/2（u=-A），
  // 与上升支扫描的起点重合，否则 prevY 会带着下降支的残留污染上升支
  let prevY = -A;
  for (let i = 1; i <= 3 * N_TIME; i++) {
    const t = -Math.PI / 2 + (2 * Math.PI * i) / N_TIME;
    const u = A * Math.sin(t);
    prevY = apply(type, u, p, prevY, Math.cos(t) > 0 ? 1 : -1);
  }

  // 上升支 theta = asin(u/A)，下降支 theta = pi - asin(u/A)，共用同一组 u 网格
  const uGrid: number[] = [];
  const yRise: number[] = [];
  const yFall: number[] = [];
  let yR = prevY;
  for (let i = 0; i <= N_BRANCH; i++) {
    const u = -A + (2 * A * i) / N_BRANCH;
    uGrid.push(u);
    yR = apply(type, u, p, yR, 1);
    yRise.push(yR);
  }
  let yF = yR;
  for (let i = N_BRANCH; i >= 0; i--) {
    yF = apply(type, uGrid[i], p, yF, -1);
    yFall[i] = yF;
  }

  // 环面积 = | ∮ y du | = | ∫ (y_rise − y_fall) du |
  let area = 0;
  for (let i = 0; i < N_BRANCH; i++) {
    const d = yRise[i] - yFall[i] + (yRise[i + 1] - yFall[i + 1]);
    area += 0.5 * d * (uGrid[i + 1] - uGrid[i]);
  }
  area = Math.abs(area);

  // 稳态周期波形，从 u = −A（theta = −pi/2）开始
  const th: number[] = [];
  const uu: number[] = [];
  const yy: number[] = [];
  let yT = yF;
  for (let i = 0; i <= N_TIME; i++) {
    const t = -Math.PI / 2 + (2 * Math.PI * i) / N_TIME;
    const u = A * Math.sin(t);
    const c = Math.cos(t);
    yT = apply(type, u, p, yT, c > 1e-9 ? 1 : c < -1e-9 ? -1 : 0);
    th.push(t + Math.PI / 2);
    uu.push(u);
    yy.push(yT);
  }

  // 整周期傅里叶投影，1..N_HARM 次
  const amps: number[] = [];
  for (let n = 1; n <= N_HARM; n++) {
    let ca = 0;
    let sa = 0;
    for (let i = 0; i < N_TIME; i++) {
      const ang = (2 * Math.PI * n * i) / N_TIME;
      ca += yy[i] * Math.cos(ang);
      sa += yy[i] * Math.sin(ang);
    }
    amps.push((2 / N_TIME) * Math.hypot(ca, sa));
  }
  const b1 = amps[0];
  const b3 = amps[2];
  let tail = 0;
  for (let n = 1; n < amps.length; n++) tail += amps[n] * amps[n];
  const thd = b1 > 1e-12 ? (Math.sqrt(tail) / b1) * 100 : 0;

  let maxDev = 0;
  for (let i = 0; i <= N_TIME; i++) {
    maxDev = Math.max(maxDev, Math.abs(yy[i] - uu[i]));
  }

  return { uGrid, yRise, yFall, th, uu, yy, area, b1, b3, thd, maxDev };
}

