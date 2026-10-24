/** Analytic one-dimensional Gaussian teaching oracle; no fitted neural model. */
export interface GenerativeConfig { m: number; s: number; a: number; t: number; n: number; sign: number }
export const GENERATIVE_DEFAULT: GenerativeConfig = {m:2,s:.5,a:.5,t:.5,n:8,sign:1};
export function diffusion(m=2,s=.5,a=.5,y=1) {
  const variance=a*s*s+1-a, mean=Math.sqrt(a)*m;
  const noise=Math.sqrt(1-a)*(y-mean)/variance, score=-(y-mean)/variance;
  return {mean,variance,noise,score,estimate:(y-Math.sqrt(1-a)*noise)/Math.sqrt(a),
    posteriorVariance:s*s*(1-a)/variance,estimateVariance:a*s**4/variance,noiseRisk:a*s*s/variance};
}
export function velocity(t:number,x:number,m=2,s=.5) {
  const v=(1-t)**2+(t*s)**2;
  return m+(t*s*s-(1-t))/v*(x-t*m);
}
export function flow(m=2,s=.5,n=8,sign=1) {
  let particles=[-1,0,1];
  const history=[{t:0,mean:0,std:1,exactMean:0,exactStd:1}];
  for(let k=0;k<n;k++) {
    const t=k/n; particles=particles.map(x=>x+sign*velocity(t,x,m,s)/n);
    const q=(k+1)/n;
    history.push({t:q,mean:particles[1],std:Math.abs(particles[2]-particles[0])/2,exactMean:q*m,exactStd:Math.sqrt((1-q)**2+(q*s)**2)});
  }
  const end=history[history.length-1];
  return {mean:end.mean,std:end.std,w2:Math.hypot(end.mean-m,end.std-s),history};
}
export function generativeSnapshot(c:GenerativeConfig=GENERATIVE_DEFAULT) {
  if(![c.m,c.s,c.a,c.t,c.n,c.sign].every(Number.isFinite)||c.s<=0||c.a<=0||c.a>=1||c.t<0||c.t>1||!Number.isInteger(c.n)||c.n<1||c.n>256||![-1,1].includes(c.sign)) throw new Error('Invalid Gaussian teaching configuration');
  const v=(1-c.t)**2+(c.t*c.s)**2;
  return {diffusion:diffusion(c.m,c.s,c.a),field:{t:c.t,variance:v,slope:(c.t*c.s*c.s-(1-c.t))/v,velocity:velocity(c.t,1,c.m,c.s),risk:c.s*c.s/v},flow:flow(c.m,c.s,c.n,c.sign)};
}
