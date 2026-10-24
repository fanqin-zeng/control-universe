/** INTEL-02: exact centroid of a min/max envelope of clipped triangles. */
export type Design = "legacy" | "coverage" | "repaired";
export type RuleMode = "PD" | "P" | "D";
export interface Tuning { n: number; Ge: number; Gce: number; Gu: number; design: Design; mode?: RuleMode; Ki?: number }
export const DEFAULT_TUNING: Tuning = { n: 5, Ge: 2, Gce: .5, Gu: 12, design: "repaired" };
export function roundEven(x: number) {
  const a = Math.floor(x), f = x - a;
  return f === .5 ? a + (a % 2) : Math.round(x);
}
export function ruleIndex(i: number, j: number, n: number, design: Design, mode: RuleMode = "PD") {
  return mode === "P" ? i : mode === "D" ? j : design === "repaired"
    ? Math.max(0, Math.min(n - 1, i + j - (n - 1) / 2)) : roundEven((i + j) / 2);
}
function membership(x: number, i: number, n: number, legacy: boolean) {
  const c = -1 + 2 * i / (n - 1), h = (legacy ? 1 : 2) / (n - 1);
  if (i === 0 && x <= -1 || i === n - 1 && x >= 1) return 1;
  return Math.max(0, 1 - Math.abs(x - c) / h);
}
export function infer(e: number, de: number, n = 5, design: Design = "repaired", mode: RuleMode = "PD") {
  const heights = Array(n).fill(0) as number[], old = design === "legacy";
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const w = Math.min(membership(e, i, n, old), membership(de, j, n, old));
    const k = ruleIndex(i, j, n, design, mode);
    heights[k] = Math.max(heights[k], w);
  }
  const active = heights.map((h, i) => ({ h, i })).filter(v => v.h > 1e-14);
  if (!active.length) return { value: 0, area: 0, uncovered: true };
  const width = (old ? 1 : 2) / (n - 1);
  const knots = [-1, 1];
  for (const {h, i} of active) {
    const c = -1 + 2 * i / (n - 1);
    for (const x of [c - width, c - width * (1 - h), c, c + width * (1 - h), c + width])
      if (x > -1 && x < 1) knots.push(x);
  }
  const base = Array.from(new Set(knots)).sort((a,b) => a-b);
  const f = (x: number, a: {h:number;i:number}) => Math.min(a.h, membership(x, a.i, n, old));
  // All candidates are affine within each interval. Add pairwise crossings.
  for (let z = 1; z < base.length; z++) {
    const a = base[z-1], b = base[z];
    for (let i = 0; i < active.length; i++) for (let j = i+1; j < active.length; j++) {
      const da = f(a, active[i])-f(a, active[j]), db = f(b, active[i])-f(b, active[j]);
      if (da * db < -1e-24) knots.push(a + (b-a) * da / (da-db));
    }
  }
  const xs = Array.from(new Set(knots)).sort((a,b)=>a-b);
  let area=0, moment=0;
  const envelope = (x:number) => Math.max(...active.map(a=>f(x,a)));
  for (let z=1; z<xs.length; z++) {
    const a=xs[z-1], b=xs[z], fa=envelope(a), fb=envelope(b), dx=b-a;
    area += dx*(fa+fb)/2;
    moment += dx*((2*a+b)*fa+(a+2*b)*fb)/6;
  }
  return { value: area > 1e-14 ? moment/area : 0, area, uncovered: area <= 1e-14 };
}
export interface Scenario { angle?: number; omega?: number; gravity?: number; disturbance?: number; T?: number; dt?: number }
export function simulateFuzzy(p: Tuning = DEFAULT_TUNING, s: Scenario = {}, pid?: [number,number,number]) {
  const dt=s.dt ?? .002, T=s.T ?? 6, N=Math.round(T/dt), gravity=s.gravity ?? 19.6, disturbance=s.disturbance ?? 0;
  let th=(s.angle ?? 20)*Math.PI/180, om=s.omega ?? 0, integral=0, gaps=0, saturated=0;
  const theta=[th], time=[0], u:number[]=[];
  const clip=(v:number)=>Math.max(-15,Math.min(15,v));
  for(let k=0;k<N;k++) {
    const e=-th, de=-om, Ki=pid?.[1] ?? p.Ki ?? 0;
    const v=infer(e*p.Ge,de*p.Gce,p.n,p.design,p.mode);
    if(!pid && v.uncovered) gaps++;
    const base=pid ? pid[0]*e+pid[2]*de : p.Gu*v.value;
    const candidate=integral+e*dt, raw=base+Ki*candidate;
    // Conditional integration: block only motion further into saturation.
    if(Math.abs(raw)<=15 || raw*Ki*e<=0) integral=candidate;
    const torque=clip(base+Ki*integral);
    if(Math.abs(base+Ki*integral)>=15) saturated++;
    const accel=(x:number)=>gravity*Math.sin(x)+4*(torque+disturbance);
    const a1=om,b1=accel(th),a2=om+dt*b1/2,b2=accel(th+dt*a1/2);
    const a3=om+dt*b2/2,b3=accel(th+dt*a2/2),a4=om+dt*b3,b4=accel(th+dt*a3);
    th+=dt*(a1+2*a2+2*a3+a4)/6; om+=dt*(b1+2*b2+2*b3+b4)/6;
    theta.push(th); time.push((k+1)*dt); u.push(torque);
  }
  const deg=180/Math.PI;
  return {time,theta:theta.map(v=>v*deg),u,rms:Math.sqrt(theta.reduce((a,v)=>a+v*v,0)/theta.length)*deg,
    final:th*deg,tail:Math.max(...theta.slice(Math.round(Math.max(0,T-1)/dt)).map(v=>Math.abs(v)*deg)),
    tv:u.slice(1).reduce((a,v,i)=>a+Math.abs(v-u[i]),0),maxU:Math.max(...u.map(Math.abs)),gaps,saturation:saturated/N};
}
