export type Pole = [number, number];
export function loopPoles(K:number):Pole[]{
  // s=z-1 reduces s^3+3s^2+2s+K to z^3-z+K; K>=0.5 on this lesson's controls.
  const d=K*K/4-1/27;
  if(d<0) throw new Error('This lesson evaluates K >= 0.5');
  const u=Math.cbrt(-K/2+Math.sqrt(d)),v=Math.cbrt(-K/2-Math.sqrt(d));
  return [[u+v-1,0],[-(u+v)/2-1,Math.sqrt(3)*(u-v)/2],[-(u+v)/2-1,-Math.sqrt(3)*(u-v)/2]];
}
function eigenSymmetric(a:number,c:number,d:number):[number,number]{
  const mid=(a+d)/2,r=Math.hypot(a-d,2*c)/2;return [mid-r,mid+r];
}
export function robustStabilityPoint(K:number,b:number,N:number){
  const poles=loopPoles(K),alpha=Math.max(...poles.map(p=>p[0]));
  const a=Math.sqrt(.75)+b*b/2,r=b/2;
  const pMin=eigenSymmetric(a,r,1)[0];
  const qMax=Math.max(...[.5,1.5].map(k=>eigenSymmetric(-2*k*r,a-b*r-k,2*r-2*b)[1]));
  const critical=Math.sqrt(1.5)-Math.sqrt(.5);
  const quadratic=b>critical+1e-10?'strict':b<critical-1e-10?'none':'boundary';
  return {K,b,N,poles,alpha,gm:6/K,gmDB:20*Math.log10(6/K),critical,pMin,qMax,quadratic,zeroUpper:-Math.expm1(Math.log(.001)/N)};
}
