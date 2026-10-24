export type DelayParameters = { a: number; k: number; tau: number };
export const delayDefault: DelayParameters = { a: 1, k: 2, tau: .5 };
export function delayReadings(p: DelayParameters) {
  const {a,k,tau}=p, omega=k>a?Math.sqrt(k*k-a*a):null;
  const exactMargin=omega===null?null:Math.acos(-a/k)/omega;
  const sgMargin=k>a?2/Math.sqrt(4*k*k-(a+k)*(a+k)):null;
  const padeMargin=k>a?2/(k-a):null;
  const sgPeak=2*k*tau/Math.hypot(2,(a+k)*tau);
  const distance=exactMargin===null?null:tau-exactMargin;
  const state=distance===null||distance < -1e-10?'stable':Math.abs(distance)<=1e-10?'critical':'unstable';
  let padeAlpha=-a-k;
  if(tau>0){const A=tau/2,B=1+(a-k)*tau/2,C=a+k;const disc=B*B-4*A*C;padeAlpha=(-B+Math.sqrt(Math.max(0,disc)))/(2*A);}
  let halanayRate:number|null=null;
  if(a>k){let lo=0,hi=a-k;for(let i=0;i<70;i++){const mid=(lo+hi)/2;if(a-k*Math.exp(mid*tau)-mid>0)lo=mid;else hi=mid;}halanayRate=(lo+hi)/2;}
  return {omega,exactMargin,sgMargin,padeMargin,sgPeak,state,padeAlpha,halanayRate,certified:sgPeak<1-1e-12};
}
export function delayFrequency(p: DelayParameters, frequency: number) {
  const t=p.k/Math.hypot(frequency,p.a+p.k);
  return {actual:t*2*Math.abs(Math.sin(frequency*p.tau/2)),upper:t*Math.min(frequency*p.tau,2)};
}
/** Method of steps: true retarded equation, constant history 1, no forcing.
 * RK4 stages query a linear interpolant of completed history only (h <= tau/4).
 * The Padé auxiliary state starts at 1 to match the constant prehistory memory. */
export function delayTrace(p: DelayParameters, horizon=12, requestedStep=.005) {
  const step=p.tau>0?Math.min(requestedStep,p.tau/4):requestedStep;
  const count=Math.ceil(horizon/step),h=horizon/count,x=[1],pade=[1],time=[0];let v=1;
  const past=(t:number)=>{if(t<=0)return 1;const f=t/h,i=Math.floor(f);if(i>=x.length-1)return x[x.length-1];return x[i]+(x[i+1]-x[i])*(f-i);};
  for(let n=0;n<count;n++){
    const t=n*h,u=x[n];time.push((n+1)*h);
    if(p.tau===0){const value=Math.exp(-(p.a+p.k)*(n+1)*h);x.push(value);pade.push(value);continue;}
    const f=(at:number,state:number)=>-p.a*state-p.k*past(at-p.tau);
    const b1=f(t,u),b2=f(t+h/2,u+h*b1/2),b3=f(t+h/2,u+h*b2/2),b4=f(t+h,u+h*b3);
    x.push(u+h*(b1+2*b2+2*b3+b4)/6);
    const ode=(xx:number,vv:number)=>[(p.k-p.a)*xx-2*p.k*vv,2*(xx-vv)/p.tau];
    const z=pade[n],r1=ode(z,v),r2=ode(z+h*r1[0]/2,v+h*r1[1]/2),r3=ode(z+h*r2[0]/2,v+h*r2[1]/2),r4=ode(z+h*r3[0],v+h*r3[1]);
    pade.push(z+h*(r1[0]+2*r2[0]+2*r3[0]+r4[0])/6);v+=h*(r1[1]+2*r2[1]+2*r3[1]+r4[1])/6;
  }
  return {time,x,pade,step:h};
}
