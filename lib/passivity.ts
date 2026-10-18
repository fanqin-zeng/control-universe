/** Fully actuated cubic spring, collocated force/velocity. RK4, all-node balance. */
export function simulatePassivity(c = .8, b = .2, shaped = true, dt = .002) {
  const T = 10, n = Math.round(T / dt), rows: number[][] = [];
  const energy = (q: number, v: number) => shaped ? .5*v*v+(q-1)**2+.25*(q-1)**4 : .5*v*v+q*q+.25*q**4;
  const force = (q: number, v: number) => (shaped ? 2*q+q**3-2*(q-1)-(q-1)**3 : 0)-c*v;
  const f = (z: number[]) => {const [q,v] = z; return [v,force(q,v)-b*v-2*q-q**3,(b+c)*v*v];};
  let z = [0,0,0], maxBalance = 0;
  // Unshaped comparison starts from same q=0,v=0; it stays at its original equilibrium.
  const initial = energy(z[0],z[1]);
  for(let i=0;i<=n;i++) {
    const h = energy(z[0],z[1]); maxBalance=Math.max(maxBalance,Math.abs(h+z[2]-initial));
    if(i%10===0||i===n) rows.push([i*dt,z[0],z[1],h,z[2],force(z[0],z[1])]);
    if(i===n) break;
    const a=f(z), bb=f(z.map((x,j)=>x+dt*a[j]/2)), cc=f(z.map((x,j)=>x+dt*bb[j]/2)), d=f(z.map((x,j)=>x+dt*cc[j]));
    z=z.map((x,j)=>x+dt*(a[j]+2*bb[j]+2*cc[j]+d[j])/6);
  }
  return {rows,initial,final:rows[rows.length-1],maxBalance};
}
