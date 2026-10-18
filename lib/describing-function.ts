/** Sinusoidal-input describing functions; input is A sin(theta). */
export type DFType = "relay"|"saturation"|"deadzone"|"hysteresis"|"backlash";
export function describingN(type:DFType,A:number,k:number,a:number) {
  if(![A,k,a].every(Number.isFinite)||A<=0||k<=0||a<0) throw new RangeError("Invalid describing-function parameters");
  let re=0,im=0;
  if(type==="relay") re=4*k/(Math.PI*A);
  else if(type==="saturation"||type==="deadzone") {
    const alpha=Math.asin(Math.min(a/A,1));
    const sat=2*k/Math.PI*(alpha+Math.sin(alpha)*Math.cos(alpha));
    re=type==="saturation"?sat:k-sat;
  } else if(A>a) {
    if(type==="hysteresis") {re=4*k/(Math.PI*A)*Math.sqrt(1-(a/A)**2);im=-4*k*a/(Math.PI*A*A);}
    else {const beta=Math.asin(1-2*a/A);re=k/Math.PI*(Math.PI/2+beta+Math.sin(beta)*Math.cos(beta));im=-4*k/Math.PI*(a/A)*(1-a/A);}
  }
  return {re,im,mag:Math.hypot(re,im),switches:!(type==="hysteresis"||type==="backlash")||A>a};
}
/** G=K/[s(s+a)(T s+1)], a is a rate, not a time constant. */
export function describingG(w:number,K:number,a:number,T:number) {
  if(![w,K,a,T].every(Number.isFinite)||Math.min(w,K,a,T)<=0)throw new RangeError("Positive parameters required");
  const re=-(1+a*T)*w*w,im=w*(a-T*w*w),den=re*re+im*im;
  return {re:K*re/den,im:-K*im/den};
}
export function harmonicCandidate(type:"relay"|"saturation",K:number,a:number,T:number) {
  describingG(1,K,a,T);
  const omega=Math.sqrt(a/T),real=-K*T/(a*(1+a*T)),target=-1/real;
  if(type==="relay")return {status:"candidate" as const,amplitude:4/(Math.PI*target),omega,real,target};
  if(Math.abs(target-1)<1e-12)return {status:"critical" as const,amplitude:null,omega,real,target};
  if(target>1)return {status:"none" as const,amplitude:null,omega,real,target};
  let lo=1,hi=2;
  while(describingN("saturation",hi,1,1).re>target)hi*=2;
  for(let i=0;i<70;i++){const mid=(lo+hi)/2;if(describingN("saturation",mid,1,1).re>target)lo=mid;else hi=mid;}
  return {status:"candidate" as const,amplitude:(lo+hi)/2,omega,real,target};
}
