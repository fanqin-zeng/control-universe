/** Exact flow of x'=-x+u with u[k]=-2x[k], fixed-period ZOH, x(0)=1. */
export function sampledData(T=.5){
 if(!Number.isFinite(T)||T<.1||T>1.5)throw new RangeError('T must be in [0.1, 1.5] seconds');
 const phi=Math.exp(-T),gamma=-Math.expm1(-T),p=phi-2*gamma;
 const N=Math.floor(6/T+1e-10),samples:number[][]=[],curve:number[][]=[],held:number[][]=[];
 let x=1;
 for(let k=0;k<=N;k++){
  samples.push([k*T,x]);held.push([k*T,-2*x]);
  if(k<N)for(let j=0;j<100;j++){const tau=j*T/100;curve.push([k*T+tau,(3*Math.exp(-tau)-2)*x]);}
  if(k===N)curve.push([k*T,x]);else x*=p;
 }
 return {T,phi,gamma,p,critical:Math.log(3),nearBoundary:Math.abs(Math.abs(p)-1)<1e-12,stable:Math.abs(p)<1,samples,curve,held,firstMid:3*Math.exp(-T/2)-2};
}
