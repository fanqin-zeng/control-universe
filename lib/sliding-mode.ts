export type SlidingLaw="sgn"|"sat"|"tanh"|"sta";
export function simulateSliding(lam=3,K=2,phi=.05,D=.3,law:SlidingLaw="sat",dt=2e-4){
 if(![lam,K,phi,D,dt].every(Number.isFinite)||lam<=0||K<=0||phi<=0||D<0||dt<=0||dt>.001)throw new RangeError("Invalid sliding parameters");
 const n=Math.round(6/dt),alpha=1.5*Math.sqrt(Math.max(5*D,.5)),beta=1.1*Math.max(5*D,.5);
 let x=1.5,velocity=0,v=0,hold=0,reach:number|null=null,band=0,squares=0,count=0,tv=0,previous:number|null=null;
 const rows:{t:number,x:number,velocity:number,s:number,u:number}[]=[];
 for(let i=0;i<=n;i++){
  const t=i*dt,s=velocity+lam*x,sign=Math.sign(s);
  const robust=law==="sgn"?-K*sign:law==="sat"?-K*Math.max(-1,Math.min(1,s/phi)):law==="tanh"?-K*Math.tanh(s/phi):-alpha*Math.sqrt(Math.abs(s))*sign+v;
  const u=(2-lam)*velocity+Math.sin(x)+robust;
  if(![x,velocity,s,u,v].every(Number.isFinite))throw new Error("Nonfinite trajectory");
  hold=Math.abs(s)<.02?hold+1:0;
  if(reach===null&&hold>=Math.round(.2/dt))reach=(i-hold+1)*dt;
  if(t>4){band=Math.max(band,Math.abs(s));if(previous!==null)tv+=Math.abs(u-previous);previous=u;}
  if(t>5){squares+=x*x;count++;}
  if(i%20===0||i===n)rows.push({t,x,velocity,s,u});
  if(i===n)break;
  velocity+=dt*(-lam*velocity+robust+D*Math.sin(5*t));x+=dt*velocity;
  if(law==="sta")v-=dt*beta*sign;
 }
 return {rows,reach,band,rms:Math.sqrt(squares/count),tv,lastTime:n*dt,steps:n,alpha,beta};
}
