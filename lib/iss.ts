/** Normalized two-state ISS teaching system; continuous feedback RK4. */
export function simulateIss(g = .5, D = .2, opposite = false, dt = .002) {
  const T=8, n=Math.round(T/dt), rows:number[][]=[];
  const sign=opposite?-1:1;
  const f=([x,z]:number[])=>[-x+g*z+D,-z+sign*g*x];
  const certified=g<1, stable=opposite||g<1;
  const envelope=(t:number)=>certified?Math.exp(-(1-g)*t)+D/(1-g)*(-Math.expm1(-(1-g)*t)):NaN;
  let state=[1,0], maxViolation=0;
  for(let i=0;i<=n;i++) {
    const t=i*dt, bound=envelope(t);
    if(certified) maxViolation=Math.max(maxViolation,Math.max(Math.abs(state[0]),Math.abs(state[1]))-bound);
    if(i%10===0||i===n) rows.push([t,...state,certified?bound:NaN]);
    if(i===n)break;
    const a=f(state),b=f(state.map((x,j)=>x+dt*a[j]/2)),c=f(state.map((x,j)=>x+dt*b[j]/2)),d=f(state.map((x,j)=>x+dt*c[j]));
    state=state.map((x,j)=>x+dt*(a[j]+2*b[j]+2*c[j]+d[j])/6);
  }
  return {rows,final:state,certified,maxViolation,maxReal:opposite?-1:-1+g,
    ultimateBound:certified?D/(1-g):null,
    steady:stable?[D/(1-sign*g*g),sign*g*D/(1-sign*g*g)]:null};
}
