/** Finite deterministic teaching domain. h[0] is the supplied boundary state. */
export const coefficients = [0, .5, 1, 1.5];
export const horizons = [4, 8, 16];
export function inputs(kind: string, n: number): number[] {
  if (!['impulse', 'constant', 'alternating'].includes(kind) || !horizons.includes(n)) throw new RangeError('input domain');
  return Array.from({length:n},(_,i)=>kind==='impulse'?(i===0?1:0):kind==='constant'?1:(i%2===0?1:-1));
}
export function sequence(a: number, n: number, kind: string, initial: number, k: number) {
  if (!coefficients.includes(a) || ![0,.25].includes(initial) || !Number.isInteger(k) || k<1 || k>n) throw new RangeError('parameter domain');
  const x=inputs(kind,n), h=[initial], sensitivity=[1];
  for(let i=0;i<n;i++){h.push(a*h[i]+x[i]);sensitivity.push(a*sensitivity[i]);}
  let adj=h[n], full=0, truncated=0;
  const contributions=Array<number>(n).fill(0);
  for(let t=n;t>=1;t--){contributions[t-1]=adj*h[t-1];full+=contributions[t-1];if(t>n-k)truncated+=contributions[t-1];adj*=a;}
  return {x,h,sensitivity,loss:.5*h[n]**2,full,truncated,contributions};
}
/** Same observed cooling record, two explicitly different information protocols. */
export function cooling(a: number) {
  if (![.5,.8,1.1].includes(a)) throw new RangeError('cooling coefficient');
  const truth=[1],oneStep:number[]=[],rollout:number[]=[];
  for(let t=0;t<4;t++){truth.push(.8*truth[t]);oneStep.push(a*truth[t]);rollout.push(a*(t===0?1:rollout[t-1]));}
  const mse=(ys:number[])=>ys.reduce((s,y,i)=>s+(y-truth[i+1])**2,0)/4;
  return {a,truth:truth.slice(1),oneStep,rollout,oneMSE:mse(oneStep),rolloutMSE:mse(rollout)};
}
