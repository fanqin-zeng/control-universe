/** Homogeneous real mode x'=-a*x: numerical update multipliers, no input model. */
export function discretizationMode(a=10,Ts=.01){
 if(![a,Ts].every(Number.isFinite)||a<1||a>20||Ts<.005||Ts>.25)throw new RangeError('Outside lesson domain');
 const h=a*Ts;
 const multipliers=[1-h,1/(1+h),(1-h/2)/(1+h/2),Math.exp(-h)];
 return {a,Ts,h,multipliers,stable:multipliers.map(p=>Math.abs(p)<1),samples:multipliers.map(p=>Array.from({length:21},(_,k)=>[k,Math.pow(p,k)]))};
}
