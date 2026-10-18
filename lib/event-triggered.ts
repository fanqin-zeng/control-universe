export const eventCheckSteps=[.05,.1,.2,.5,1.2];
/** Periodic event detection; exact ZOH trajectory, no numerical deadband. */
export function eventTriggered(h=.05,sigma=.25,x0=1){
 if(!eventCheckSteps.includes(h)||!Number.isFinite(sigma)||sigma<.1||sigma>2||!Number.isFinite(x0)||Math.abs(x0)>1)throw new RangeError('invalid check period, relative threshold or initial state');
 const N=Math.round(6/h),a=Math.exp(-h),samples:number[][]=[],baselineSamples:number[][]=[],curve:number[][]=[],baselineCurve:number[][]=[],events:number[][]=[];
 let x=x0,base=x0,held=x0;
 for(let k=0;k<=N;k++){
  samples.push([k*h,x]);baselineSamples.push([k*h,base]);
  if(k===N)break;
  const e=held-x;
  if(k===0||(Math.abs(e)>0&&Math.abs(e)>=sigma*Math.abs(x))){held=x;events.push([k*h,x]);}
  for(let j=0;j<20;j++){
   const tau=j*h/20,decay=Math.exp(-tau);
   curve.push([k*h+tau,decay*x-2*(1-decay)*held]);
   baselineCurve.push([k*h+tau,(3*decay-2)*base]);
  }
  x=a*x-2*(1-a)*held;base=(3*a-2)*base;
 }
 curve.push([6,x]);baselineCurve.push([6,base]);
 return {h,sigma,x0,samples,baselineSamples,curve,baselineCurve,events,count:events.length,baselineCount:N,terminal:x,baselineTerminal:base};
}
