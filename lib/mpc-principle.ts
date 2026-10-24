/** Two-variable strictly convex QP; enumerate stationary point and box faces. */
export function mpcTwoStep(x = 4, r = 1, limit = 1) {
  if (![x,r,limit].every(Number.isFinite) || r < 0 || limit <= 0) throw new RangeError('Invalid MPC parameters');
  const a = 1.25+r, b = .5, c = 1+r;
  const d = .625*x, e = .25*x, det = a*c-b*b;
  const clip = (v:number) => Math.max(-limit,Math.min(limit,v));
  const candidates:number[][] = [[(-c*d+b*e)/det,(b*d-a*e)/det]];
  for (const v of [-limit,limit]) {
    candidates.push([v,clip(-(b*v+e)/c)]);
    candidates.push([clip(-(b*v+d)/a),v]);
  }
  const cost = (u:number[]) => (.5*x+u[0])**2+(.25*x+.5*u[0]+u[1])**2+r*(u[0]**2+u[1]**2);
  const feasible = candidates.filter(u=>u.every(v=>Math.abs(v)<=limit+1e-12));
  const u=feasible.reduce((best,next)=>cost(next)<cost(best)?next:best);
  return {u, states:[.5*x+u[0],.25*x+.5*u[0]+u[1]], cost:cost(u)};
}
