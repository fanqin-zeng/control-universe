// Shared production calculation used by FuzzyExplorer; independent reference lives in INTEL-01 evidence.
const U_LO=-15, U_HI=15, GRID_N=601, IDEAL_GAIN=-0.5;
export type Triple = [number, number, number];
export function partition(lo: number, hi: number, n: number, hs: number): Triple[] {
  const ctr: number[] = [];
  for (let i = 0; i < n; i++) ctr.push(lo + ((hi - lo) * i) / (n - 1));
  const s = ctr[1] - ctr[0];
  const h = hs * s;
  const out: Triple[] = [];
  for (let i = 0; i < n; i++) {
    out.push([i > 0 ? ctr[i] - h : lo, ctr[i], i < n - 1 ? ctr[i] + h : hi]);
  }
  return out;
}

export function trimf(x: number, a: number, b: number, c: number): number {
  if (x <= a) return a === b ? 1 : 0;
  if (x >= c) return b === c ? 1 : 0;
  return x <= b ? (x - a) / (b - a) : (c - x) / (c - b);
}

export function buildUG(): number[] {
  const ug = new Array<number>(GRID_N);
  for (let k = 0; k < GRID_N; k++) ug[k] = U_LO + ((U_HI - U_LO) * k) / (GRID_N - 1);
  return ug;
}

interface Infer {
  cog: number;
  bis: number;
  mom: number;
  mu: number[];
  parts: number[][];
  alphas: number[];
}

export function inferOne(x: number, PX: Triple[], ug: number[], PUg: number[][], ruleOf: number[]): Infer {
  const n = PX.length;
  const alphas: number[] = [];
  for (let i = 0; i < n; i++) alphas.push(trimf(x, PX[i][0], PX[i][1], PX[i][2]));

  const parts: number[][] = [];
  const mu = new Array<number>(ug.length).fill(0);
  for (let i = 0; i < n; i++) {
    if (alphas[i] <= 0) continue;
    const base = PUg[ruleOf[i]];
    const clipped = new Array<number>(ug.length);
    for (let k = 0; k < ug.length; k++) {
      clipped[k] = Math.min(alphas[i], base[k]);
      if (clipped[k] > mu[k]) mu[k] = clipped[k];
    }
    parts.push(clipped);
  }

  let num = 0;
  let den = 0;
  const cum = new Array<number>(ug.length).fill(0);
  for (let k = 1; k < ug.length; k++) {
    const du = ug[k] - ug[k - 1];
    num += 0.5 * (ug[k] * mu[k] + ug[k - 1] * mu[k - 1]) * du;
    den += 0.5 * (mu[k] + mu[k - 1]) * du;
    cum[k] = den;
  }
  const cog = den > 1e-14 ? num / den : 0;

  let bis = 0;
  if (den > 1e-14) {
    const half = den / 2;
    for (let k = 1; k < ug.length; k++) {
      if (cum[k] >= half) {
        const f = cum[k] === cum[k - 1] ? 0 : (half - cum[k - 1]) / (cum[k] - cum[k - 1]);
        bis = ug[k - 1] + f * (ug[k] - ug[k - 1]);
        break;
      }
    }
  }

  let mmax = 0;
  for (let k = 0; k < ug.length; k++) {
    if (mu[k] > mmax) mmax = mu[k];
  }
  const maxima = ug.filter((_, k) => mmax > 0 && mu[k] >= mmax - 1e-12);
  const mom = maxima.length ? maxima.reduce((a, b) => a + b, 0) / maxima.length : 0;

  return { cog, bis, mom, mu, parts, alphas };
}

export function maxSlope(y: number[], xs: number[]): number {
  let m = 0;
  for (let i = 1; i < y.length; i++) {
    const d = Math.abs(y[i] - y[i - 1]) / Math.abs(xs[i] - xs[i - 1]);
    if (d > m) m = d;
  }
  return m;
}

export function rmsDev(y: number[], xs: number[]): number {
  let s = 0;
  for (let i = 0; i < y.length; i++) {
    const d = y[i] - IDEAL_GAIN * xs[i];
    s += d * d;
  }
  return Math.sqrt(s / y.length);
}

