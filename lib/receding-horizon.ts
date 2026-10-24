/** Teaching QP: one input increment, then hold absolute u for Np steps. */
export function holdPlan(x:number,previous:number,np:number,bound:number){
  if(![x,previous,bound].every(Number.isFinite)||Math.abs(previous)>2||bound<.25||bound>1||!Number.isInteger(np)||np<1||np>8)throw new RangeError('Invalid horizon contract');
  const free:number[]=[],gain:number[]=[];
  for(let j=1;j<=np;j++){const power=.8**j;free.push(power*x+(1-power)*previous);gain.push(1-power);}
  const denominator=.1+gain.reduce((s,g)=>s+g*g,0),numerator=gain.reduce((s,g,i)=>s+g*(1-free[i]),0);
  const low=Math.max(-bound,-2-previous),high=Math.min(bound,2-previous),unconstrained=numerator/denominator;
  const delta=Math.max(low,Math.min(high,unconstrained)),u=previous+delta;
  const prediction=free.map((v,i)=>v+gain[i]*delta);
  const gradient=2*(denominator*delta-numerator);
  const residual=Math.abs(delta-Math.max(low,Math.min(high,delta-gradient)));
  return {delta,u,unconstrained,prediction,free,gain,H:2*denominator,f:-2*numerator,cost:prediction.reduce((s,v)=>s+(v-1)**2,0)+.1*delta**2,residual};
}
export function recedingExample(np=4,bound=1,shock=.4){
  if(!Number.isFinite(shock)||Math.abs(shock)>.4)throw new RangeError('Invalid state deviation');
  const initial=holdPlan(0,0,np,bound),measured=initial.prediction[0]+shock;
  const revised=holdPlan(measured,initial.u,np,bound);
  const held=Array.from({length:np},(_,i)=>.8**(i+1)*measured+(1-.8**(i+1))*initial.u);
  return {initial,measured,revised,held};
}
