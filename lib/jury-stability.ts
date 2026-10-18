/** Monic real second-order recurrence y[k+2] = -a1*y[k+1] - a2*y[k]. */
export function juryStability(a1 = -1.5, a2 = 0.7) {
  if (![a1, a2].every(Number.isFinite) || a1 < -3 || a1 > 3 || a2 < -1.5 || a2 > 1.5) throw new RangeError('Outside lesson domain');
  const discriminant = a1*a1-4*a2;
  const roots = discriminant >= 0
    ? [[(-a1+Math.sqrt(discriminant))/2,0], [(-a1-Math.sqrt(discriminant))/2,0]]
    : [[-a1/2,Math.sqrt(-discriminant)/2], [-a1/2,-Math.sqrt(-discriminant)/2]];
  const conditions = [1+a1+a2,1-a1+a2,1-Math.abs(a2)];
  const radius = Math.max(...roots.map(([r,i])=>Math.hypot(r,i)));
  const strict = conditions.every(v=>v>1e-12);
  const onBoundary = !strict && Math.abs(radius-1)<=1e-10;
  const samples: number[][] = [[0,1],[1,0]];
  for(let k=2;k<=50;k++) samples.push([k,-a1*samples[k-1][1]-a2*samples[k-2][1]]);
  return {a1,a2,roots,conditions,radius,strict,onBoundary,samples};
}
