export type NmpcConfig={theta:number;N:number;Q:number;limit:number;iterations:number};
type State=[number,number];
export function pendulumStep(x:State,u:number,linear=false):State{
 const f=(z:State):State=>[z[1],-9.81*(linear?z[0]:Math.sin(z[0]))+u];
 const add=(a:State,b:State,s:number):State=>[a[0]+s*b[0],a[1]+s*b[1]];
 const a=f(x),b=f(add(x,a,.05)),c=f(add(x,b,.05)),d=f(add(x,c,.1));
 return [x[0]+.1*(a[0]+2*b[0]+2*c[0]+d[0])/6,x[1]+.1*(a[1]+2*b[1]+2*c[1]+d[1])/6];
}
export function shooting(theta:number,u:number,N=8,Q=10,linear=false,omega=0){
 let x:State=[theta,omega];const trajectory:State[]=[x],residual:number[]=[];
 for(let k=0;k<N;k++){x=pendulumStep(x,u,linear);trajectory.push(x);residual.push(Math.sqrt(Q)*x[0],Math.sqrt(.1)*x[1],Math.sqrt(.1)*u);}
 return {trajectory,residual,cost:residual.reduce((s,v)=>s+v*v,0)};
}
/** A scalar constant-input shooting restriction, not a full RTI implementation. */
export function solveNmpc(c:NmpcConfig,initial=0,linear=false,omega=0){
 if(![c.theta,c.N,c.Q,c.limit,c.iterations,initial,omega].every(Number.isFinite)||c.N<4||c.N>16||!Number.isInteger(c.N)||c.Q<1||c.Q>20||c.limit<1||c.limit>8||c.iterations<1||c.iterations>60||!Number.isInteger(c.iterations))throw new RangeError('Invalid teaching contract');
 const clip=(u:number)=>Math.max(-c.limit,Math.min(c.limit,u));let u=clip(initial),used=0;const history:number[]=[];
 const differential=(v:number)=>{const r=shooting(c.theta,v,c.N,c.Q,linear,omega),h=1e-5,plus=shooting(c.theta,v+h,c.N,c.Q,linear,omega).residual,minus=shooting(c.theta,v-h,c.N,c.Q,linear,omega).residual;const jac=plus.map((z,i)=>(z-minus[i])/(2*h));return {...r,g:2*jac.reduce((s,z,i)=>s+z*r.residual[i],0),H:2*jac.reduce((s,z)=>s+z*z,0)+1e-8};};
 for(let k=0;k<c.iterations;k++){
  const a=differential(u);history.push(a.cost);if(Math.abs(u-clip(u-a.g))<1e-6)break;
  const step=clip(u-a.g/a.H)-u;let alpha=1,accepted=false;
  for(let j=0;j<20;j++){const trial=u+alpha*step;if(shooting(c.theta,trial,c.N,c.Q,linear,omega).cost<=a.cost+1e-4*alpha*a.g*step){u=trial;accepted=true;break;}alpha*=.5;}
  used++;if(!accepted)break;
 }
 const final=differential(u),projectedGradient=Math.abs(u-clip(u-final.g));
 return {u,cost:final.cost,trajectory:final.trajectory,gradient:final.g,projectedGradient,used,converged:projectedGradient<1e-6,history};
}
