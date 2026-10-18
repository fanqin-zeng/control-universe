/** Ideal solution in (x1,y); avoid subtracting huge hidden states to compute y. */
export function zeroDynamics(a:number,t:number,x10=1,y0=1){
 if(![a,t,x10,y0].every(Number.isFinite)||a===0||t<0)throw new RangeError('Nonzero finite a and nonnegative time required');
 const y=y0*Math.exp(-2*t),q=1/a-2;
 const x1=Math.exp(-t/a)*(x10+(Math.abs(q)<1e-12?y0*t/a:y0*Math.expm1(q*t)/(a*q)));
 const x2=(y-x1)/a,u=(-2*y-x2-a*x1*x2)/a;
 return {t,y,x1,x2,u,lambda:-1/a};
}
export function zeroDynamicsSeries(a:number){
 if(a===0)return [];
 return Array.from({length:501},(_,i)=>zeroDynamics(a,i/50));
}
