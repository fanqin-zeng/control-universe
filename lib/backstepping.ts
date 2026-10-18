const A_TRUE = 3.0;
const B_TRUE = 1.0;
const W_AMP = 0.3;
const W_FRQ = 5.0;
const G1 = 1.0;
const DT = 5e-4;
const T_STEP = 10;
const T_SINE = 12;
const SINE_AMP = 0.5;
const SINE_FRQ = 2.0;
const ZETA_TARGET = 0.7;

export type RefKind = "step" | "sine";
export type Law = "bs" | "fl" | "fl7";

export const LAW_LABEL: Record<Law, string> = {
  bs: "反步 (k1,k2)",
  fl: "反馈线性化（同增益）",
  fl7: "反馈线性化（ζ=0.7 目标）",
};

export function refSignal(kind: RefKind, t: number): [number, number, number] {
  if (kind === "step") return [1.0, 0.0, 0.0];
  return [
    SINE_AMP * Math.sin(SINE_FRQ * t),
    SINE_AMP * SINE_FRQ * Math.cos(SINE_FRQ * t),
    -SINE_AMP * SINE_FRQ * SINE_FRQ * Math.sin(SINE_FRQ * t),
  ];
}

function plant(x1: number, x2: number, u: number, t: number): [number, number] {
  return [x2, -A_TRUE * Math.sin(x1) - B_TRUE * x2 + u + W_AMP * Math.sin(W_FRQ * t)];
}

export interface SimResult {
  t: number[];
  x1: number[];
  e: number[];
  u: number[];
  maxU: number;
  rmsE: number;
  overshoot: number;
  diverged: boolean;
  lastTime: number;
  equivalenceResidual: number;
}

export function simulateBackstepping(
  law: Law,
  kind: RefKind,
  k1: number,
  k2: number,
  m: number
): SimResult {
  if(![k1,k2,m].every(Number.isFinite)||k1<=0||k2<=0||m<=0)throw new RangeError("Invalid backstepping parameters");
  const T = kind === "step" ? T_STEP : T_SINE;
  const steps = Math.round(T / DT);
  const ah = m * A_TRUE;
  const bh = m * B_TRUE;
  const Kp = G1 + k1 * k2;
  const Kv = k1 + k2;
  const Kp7 = Kp;
  const Kv7 = 2 * ZETA_TARGET * Math.sqrt(Kp7);

  let x1 = kind === "step" ? 0.0 : refSignal(kind, 0)[0];
  let x2 = kind === "step" ? 0.0 : refSignal(kind, 0)[1];

  const control = (t: number, xa: number, xb: number): number => {
    const [xd, xdd, xddd] = refSignal(kind, t);
    const e = xa - xd;
    const ed = xb - xdd;
    const f2h = -ah * Math.sin(xa) - bh * xb;
    if (law === "fl") return -f2h + xddd - Kp * e - Kv * ed;
    if (law === "fl7") return -f2h + xddd - Kp7 * e - Kv7 * ed;
    const z1 = e;
    const a1 = xdd - k1 * z1;
    const z2 = xb - a1;
    const a1d = xddd + k1 * k1 * z1 - k1 * z2;
    return -z1 - f2h + a1d - k2 * z2;
  };

  const t: number[] = [];
  const xs: number[] = [];
  const es: number[] = [];
  const us: number[] = [];
  let maxU = 0;
  let diverged = false;
  const stride = 4;
  const tailStart = kind === "step" ? 4 : 0.6 * T;
  let sq = 0;
  let cnt = 0;
  let peak = 0;
  let lastTime=0, equivalenceResidual=0;

  for (let i = 0; i <= steps; i++) {
    const time = i * DT;
    const u = control(time, x1, x2);
    const [xd] = refSignal(kind, time);
    const e = x1 - xd;
    if (![x1,x2,u].every(Number.isFinite)) {diverged=true;break;}
    lastTime=time;
    const [,rd,rdd]=refSignal(kind,time);
    const ua=ah*Math.sin(x1)+bh*x2+rdd-(1+k1*k2)*e-(k1+k2)*(x2-rd);
    const z2=x2-rd+k1*e;
    const ub=ah*Math.sin(x1)+bh*x2+rdd+k1*k1*e-(k1+k2)*z2-e;
    equivalenceResidual=Math.max(equivalenceResidual,Math.abs(ua-ub));
    if (i % stride === 0 || i===steps) {
      t.push(time);
      xs.push(x1);
      es.push(e);
      us.push(u);
    }
    if (time > tailStart) {
      sq += e * e;
      cnt += 1;
    }
    if (Math.abs(u) > maxU) maxU = Math.abs(u);
    if (x1 > peak) peak = x1;

    if(i===steps) break;
    const k1a = plant(x1, x2, u, time);
    const k2a = plant(x1 + 0.5 * DT * k1a[0], x2 + 0.5 * DT * k1a[1], u, time + 0.5 * DT);
    const k3a = plant(x1 + 0.5 * DT * k2a[0], x2 + 0.5 * DT * k2a[1], u, time + 0.5 * DT);
    const k4a = plant(x1 + DT * k3a[0], x2 + DT * k3a[1], u, time + DT);
    x1 = x1 + (DT / 6) * (k1a[0] + 2 * k2a[0] + 2 * k3a[0] + k4a[0]);
    x2 = x2 + (DT / 6) * (k1a[1] + 2 * k2a[1] + 2 * k3a[1] + k4a[1]);
    if (!Number.isFinite(x1) || !Number.isFinite(x2) || Math.abs(x1) > 1e3) {
      diverged = true;
      break;
    }
  }

  const base = kind === "step" ? 1.0 : 0.0;
  return {
    t,
    x1: xs,
    e: es,
    u: us,
    maxU,
    rmsE: cnt > 0 ? Math.sqrt(sq / cnt) : NaN,
    overshoot: kind === "step" ? Math.max(0, (peak - base) * 100) : NaN,
    diverged,
    lastTime, equivalenceResidual,
  };
}
