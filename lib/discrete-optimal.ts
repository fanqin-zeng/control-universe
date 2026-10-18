/** Finite-horizon scalar LQR, x[k+1]=x[k]+u[k], q=r=1. */
export function discreteOptimal(N=3,s=1){
 if(!Number.isInteger(N)||N<1||N>12||!Number.isFinite(s)||s<0||s>8)throw new RangeError('N=1..12 integer, s=0..8');
 const P=Array<number>(N+1).fill(0),K=Array<number>(N).fill(0);P[N]=s;
 for(let k=N-1;k>=0;k--){K[k]=P[k+1]/(1+P[k+1]);P[k]=1+P[k+1]/(1+P[k+1]);}
 const x=[1],u:number[]=[],stage:number[]=[];
 for(let k=0;k<N;k++){u.push(-K[k]*x[k]);stage.push(x[k]**2+u[k]**2);x.push(x[k]+u[k]);}
 const terminal=s*x[N]**2,J=stage.reduce((a,b)=>a+b,terminal);
 return{N,s,P,K,x,u,stage,terminal,J};
}
