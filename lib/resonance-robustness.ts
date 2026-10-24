/** Frequency observations only: finite grids do not certify an H-infinity bound. */
export function resonancePoint(wn:number,zeta:number,w:number){
  const numerator=Math.hypot(10-.5*w*w,50*w);
  const denominator=Math.hypot(10-.6*w*w,50*w-.01*w*w*w);
  const t=numerator/denominator;
  const delta=w*Math.hypot(w,2*zeta*wn)/Math.hypot(wn*wn-w*w,2*zeta*wn*w);
  return {w,t,delta,product:t*delta};
}
export function resonanceGrid(wn:number,zeta:number){
  const data=Array.from({length:1601},(_,i)=>resonancePoint(wn,zeta,10**(-2+6*i/1600)));
  const max=(key:'t'|'delta'|'product')=>Math.max(...data.map(p=>p[key]));
  return {data,tMax:max('t'),deltaMax:max('delta'),productMax:max('product')};
}
