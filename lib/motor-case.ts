/** Exact zero-state P loop of the physical DC motor used in CLASSIC-11. */
export function motorP(k: number, t: number) {
  if (!(k > 0 && k <= 100) || t < 0) throw new RangeError('K in (0,100], t >= 0');
  const sigma=50.05, wn=Math.sqrt(110+1000*k), delta=sigma*sigma-wn*wn, dc=1000*k/(110+1000*k);
  let tail:number;
  if(Math.abs(delta)<1e-8) tail=Math.exp(-sigma*t)*(1+sigma*t);
  else if(delta>0){const q=Math.sqrt(delta);tail=((sigma+q)*Math.exp((-sigma+q)*t)-(sigma-q)*Math.exp((-sigma-q)*t))/(2*q);}
  else {const q=Math.sqrt(-delta);tail=Math.exp(-sigma*t)*(Math.cos(q*t)+sigma/q*Math.sin(q*t));}
  const zeta=sigma/wn,mpFinal=zeta>=1?0:100*Math.exp(-Math.PI*zeta/Math.sqrt(1-zeta*zeta));
  return {y:dc*(1-tail),dc,ess:1-dc,zeta,wn,mpFinal,peakTarget:Math.max(0,100*(dc*(1+mpFinal/100)-1)),initialU:k};
}
export const motorPCritical=(50.05*50.05-110)/1000;
