const A = -2.0;
const B = 3.0;
const AM = -5.0;
const BM = 5.0;
const K1S = (AM - A) / B;
const K2S = BM / B;
const W1 = 3.0;
const W2 = 20.0;
const TAU_N = 0.01;
const T = 40;
const DT = 1e-3;
const STRIDE = 25;
const PE_STRIDE = 2;
const PE_TW = 2 * Math.PI;

export type RefKind = "step" | "sine" | "multi";

function refSignal(kind: RefKind, t: number): number {
  if (kind === "step") return 1.0;
  if (kind === "sine") return Math.sin(t);
  return 1.0 + 0.5 * Math.sin(2 * t) + 0.3 * Math.sin(5 * t);
}

function manifoldK2(k1: number): number {
  return ((BM / AM) * (A + B * k1)) / B;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SimResult {
  t: number[];
  xp: number[];
  xm: number[];
  r: number[];
  e: number[];
  traj: [number, number][];
  k1End: number;
  k2End: number;
  rmsE: number;
  maxU: number;
  divT: number | null;
  peLmin: number | null;
  endTime: number;
  distIdeal: number;
  distManifold: number;
}

export function simulateMrac(
  kind: RefKind,
  gamma: number,
  sigma: number,
  noiseStd: number,
  unmodeled: boolean,
  seed = 20260924
): SimResult {
  const steps = Math.round(T / DT);
  const rnd = mulberry32(seed);
  let spare: number | null = null;
  const gauss = (): number => {
    if (spare !== null) {
      const v = spare;
      spare = null;
      return v;
    }
    let u = 0;
    let v = 0;
    while (u === 0) u = rnd();
    while (v === 0) v = rnd();
    const mag = Math.sqrt(-2 * Math.log(u));
    spare = mag * Math.sin(2 * Math.PI * v);
    return mag * Math.cos(2 * Math.PI * v);
  };

  const nAmp = noiseStd * Math.sqrt((2 * TAU_N) / DT);
  let xp = 0;
  let xm = 0;
  let k1 = 0;
  let k2 = 0;
  let v1 = 0;
  let v2 = 0;
  let n = 0;

  const t: number[] = [];
  const xps: number[] = [];
  const xms: number[] = [];
  const rs: number[] = [];
  const es: number[] = [];
  const traj: [number, number][] = [];
  const peR: [number, number][] = [];

  let divT: number | null = null;
  let maxU = 0;
  let sq = 0;
  let cnt = 0;

  const deriv = (
    px: number,
    pm: number,
    p1: number,
    p2: number,
    pv1: number,
    pv2: number,
    pn: number,
    r: number,
    xi: number
  ): number[] => {
    const xpn = px + pn;
    const e = xpn - pm;
    const u = p1 * xpn + p2 * r;
    const d1 = -gamma * e * xpn - sigma * gamma * p1;
    const d2 = -gamma * e * r - sigma * gamma * p2;
    if (unmodeled) {
      return [
        A * px + B * pv2,
        AM * pm + BM * r,
        d1,
        d2,
        W1 * (u - pv1),
        W2 * (pv1 - pv2),
        (-pn + xi) / TAU_N,
      ];
    }
    return [A * px + B * u, AM * pm + BM * r, d1, d2, 0, 0, (-pn + xi) / TAU_N];
  };

  for (let i = 0; i <= steps; i++) {
    const time = i * DT;
    const r = refSignal(kind, time);
    const xi = noiseStd > 0 ? gauss() * nAmp : 0;

    if (i % PE_STRIDE === 0) peR.push([xp, r]);
    if (i % STRIDE === 0) {
      t.push(time);
      xps.push(xp);
      xms.push(xm);
      rs.push(r);
      es.push(xp - xm);
      traj.push([k1, k2]);
    }
    if (time > 0.8 * T) {
      const ee = xp - xm;
      sq += ee * ee;
      cnt += 1;
    }
    const uu = k1 * (xp + n) + k2 * r;
    if (Math.abs(uu) > maxU) maxU = Math.abs(uu);
    if (i === steps) break;

    const s1 = deriv(xp, xm, k1, k2, v1, v2, n, r, xi);
    const s2 = deriv(
      xp + 0.5 * DT * s1[0], xm + 0.5 * DT * s1[1], k1 + 0.5 * DT * s1[2],
      k2 + 0.5 * DT * s1[3], v1 + 0.5 * DT * s1[4], v2 + 0.5 * DT * s1[5],
      n + 0.5 * DT * s1[6], refSignal(kind, time + .5 * DT), xi
    );
    const s3 = deriv(
      xp + 0.5 * DT * s2[0], xm + 0.5 * DT * s2[1], k1 + 0.5 * DT * s2[2],
      k2 + 0.5 * DT * s2[3], v1 + 0.5 * DT * s2[4], v2 + 0.5 * DT * s2[5],
      n + 0.5 * DT * s2[6], refSignal(kind, time + .5 * DT), xi
    );
    const rNext = refSignal(kind, time + DT);
    const s4 = deriv(
      xp + DT * s3[0], xm + DT * s3[1], k1 + DT * s3[2],
      k2 + DT * s3[3], v1 + DT * s3[4], v2 + DT * s3[5],
      n + DT * s3[6], rNext, xi
    );
    xp += (DT / 6) * (s1[0] + 2 * s2[0] + 2 * s3[0] + s4[0]);
    xm += (DT / 6) * (s1[1] + 2 * s2[1] + 2 * s3[1] + s4[1]);
    k1 += (DT / 6) * (s1[2] + 2 * s2[2] + 2 * s3[2] + s4[2]);
    k2 += (DT / 6) * (s1[3] + 2 * s2[3] + 2 * s3[3] + s4[3]);
    v1 += (DT / 6) * (s1[4] + 2 * s2[4] + 2 * s3[4] + s4[4]);
    v2 += (DT / 6) * (s1[5] + 2 * s2[5] + 2 * s3[5] + s4[5]);
    n += (DT / 6) * (s1[6] + 2 * s2[6] + 2 * s3[6] + s4[6]);

    if (![xp, xm, k1, k2, v1, v2, n].every(Number.isFinite) || Math.abs(xp) > 1e3 || Math.abs(k1) > 1e4) {
      divT = time + DT;
      if ([xp, xm, k1, k2].every(Number.isFinite)) {
        t.push(divT); xps.push(xp); xms.push(xm); rs.push(refSignal(kind, divT)); es.push(xp-xm); traj.push([k1,k2]);
      }
      break;
    }
  }

  const dtw = PE_STRIDE * DT;
  const nw = Math.round(PE_TW / dtw);
  let peLmin = Infinity;
  for (let j = 0; j < 20; j++) {
    const i0 = Math.round(j / dtw);
    let g00 = 0;
    let g01 = 0;
    let g11 = 0;
    for (let p = 0; p < nw; p++) {
      const idx = i0 + p;
      if (idx >= peR.length) break;
      const a = peR[idx][0];
      const b = peR[idx][1];
      g00 += a * a;
      g01 += a * b;
      g11 += b * b;
    }
    g00 *= dtw;
    g01 *= dtw;
    g11 *= dtw;
    const tr = g00 + g11;
    const det = g00 * g11 - g01 * g01;
    const lam = tr / 2 - Math.sqrt(Math.max(0, (tr * tr) / 4 - det));
    if (lam < peLmin) peLmin = lam;
  }
  const completePE = peR.length >= Math.round(19 / dtw) + nw;

  const distManifold = Math.abs(k2 - manifoldK2(k1));
  return {
    t,
    xp: xps,
    xm: xms,
    r: rs,
    e: es,
    traj,
    k1End: k1,
    k2End: k2,
    rmsE: cnt > 0 ? Math.sqrt(sq / cnt) : NaN,
    maxU,
    divT,
    peLmin: completePE && Number.isFinite(peLmin) ? Math.max(peLmin, 0) : null,
    endTime: divT ?? T,
    distIdeal: Math.hypot(k1 - K1S, k2 - K2S),
    distManifold,
  };
}

