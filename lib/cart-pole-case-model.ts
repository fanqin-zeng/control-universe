export type Matrix=number[][];
const tr=(a:Matrix):Matrix=>a[0].map((_,j)=>a.map(r=>r[j]));
const mul=(a:Matrix,b:Matrix):Matrix=>a.map(r=>b[0].map((_,j)=>r.reduce((s,v,k)=>s+v*b[k][j],0)));
const add=(a:Matrix,b:Matrix,scale=1):Matrix=>a.map((r,i)=>r.map((v,j)=>v+scale*b[i][j]));
const eye=(n:number):Matrix=>Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>+(i===j)));
const scale=(a:Matrix,s:number)=>a.map(r=>r.map(v=>v*s));
function solve(a:Matrix,b:Matrix):Matrix {
 const n=a.length,m=b[0].length,w=a.map((r,i)=>[...r,...b[i]]);
 for(let k=0;k<n;k++){let p=k;for(let i=k+1;i<n;i++)if(Math.abs(w[i][k])>Math.abs(w[p][k]))p=i;
 if(Math.abs(w[p][k])<1e-14)throw new Error('singular linear system');[w[p],w[k]]=[w[k],w[p]];
 const pivot=w[k][k];for(let j=k;j<n+m;j++)w[k][j]/=pivot;
 for(let i=0;i<n;i++)if(i!==k){const v=w[i][k];for(let j=k;j<n+m;j++)w[i][j]-=v*w[k][j];}}
 return w.map(r=>r.slice(n));
}
function lyapunov(f:Matrix,q:Matrix):Matrix {
 const n=f.length,a:Array<number[]>=[],b:Matrix=[];
 for(let i=0;i<n;i++)for(let j=0;j<n;j++){const row=Array(n*n).fill(0);for(let k=0;k<n;k++){row[k*n+j]+=f[k][i];row[i*n+k]+=f[k][j];}a.push(row);b.push([-q[i][j]]);}
 const v=solve(a,b);return Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>v[i*n+j][0]));
}
function care(a:Matrix,b:Matrix,q:Matrix,r:Matrix,initial:Matrix){
 let k=initial,p=eye(a.length),iterations=0;
 for(;iterations<100;iterations++){const f=add(a,mul(b,k),-1);p=lyapunov(f,add(q,mul(tr(k),mul(r,k))));
 const next=solve(r,mul(tr(b),p)),error=Math.max(...next.flatMap((row,i)=>row.map((v,j)=>Math.abs(v-k[i][j]))));k=next;if(error<1e-11)break;}
 if(iterations===100)throw new Error('CARE iteration did not converge');
 const residual=add(add(mul(tr(a),p),mul(p,a)),add(q,mul(p,mul(b,k)),-1));
 if(Math.max(...residual.flat().map(Math.abs))>1e-8)throw new Error('CARE residual');
 return {P:p,K:k,iterations};
}
export function cartPoleModel(M=1,m=.1,l=.5,g=9.81){
 const h=[[M+m,m*l],[m*l,4*m*l*l/3]],v=solve(h,[[0,1],[m*g*l,0]]);
 return {A:[[0,1,0,0],[0,0,v[0][0],0],[0,0,0,1],[0,0,v[1][0],0]],B:[[0],[v[0][1]],[0],[v[1][1]]],C:[[1,0,0,0],[0,0,1,0]],H:h};
}
function design(){
 const {A,B,C}=cartPoleModel(),ab=[B];for(let i=1;i<4;i++)ab.push(mul(A,ab[i-1]));
 const ctrb=A.map((_,i)=>ab.map(b=>b[i][0]));let phi=eye(4),power=eye(4);phi=scale(phi,120);
 for(const coefficient of [154,71,14,1]){power=mul(power,A);phi=add(phi,scale(power,coefficient));}
 const last=tr(solve(tr(ctrb),[[0],[0],[0],[1]]));const poleK=mul(last,phi);
 const control=care(A,B,[[1,0,0,0],[0,1,0,0],[0,0,10,0],[0,0,0,10]],[[.1]],poleK);
 const initialL=[[6,0],[9,A[1][2]],[0,6],[0,A[3][2]+9]];
 const estimate=care(tr(A),tr(C),scale(eye(4),.004**2),scale(eye(2),.01**2),tr(initialL));
 const N=-1/mul([[1,0,0,0]],solve(add(A,mul(B,control.K),-1),B))[0][0];
 return {A,B,C,K:control.K,L:tr(estimate.K),P:control.P,Pe:estimate.P,N,poleK};
}
export const cartPoleDesign=design();
export function caseNormals(seed:number){let state=seed>>>0;return ()=>{const result:number[]=[];for(let i=0;i<3;i++){state=(Math.imul(1664525,state)+1013904223)>>>0;const u=(state+.5)/4294967296;state=(Math.imul(1664525,state)+1013904223)>>>0;const v=(state+.5)/4294967296;const r=Math.sqrt(-2*Math.log(u));result.push(r*Math.cos(2*Math.PI*v),r*Math.sin(2*Math.PI*v));}return result;};}
export function simulateCartPoleNoise(sigmaW=.004,sigmaV=.01,seed=7){
 if(![sigmaW,sigmaV].every(v=>Number.isFinite(v)&&v>=0&&v<=.02)||!Number.isInteger(seed))throw new RangeError('noise domain');
 const {A,B,K,L,N}=cartPoleDesign,normal=caseNormals(seed),dt=.002,root=Math.sqrt(dt);let x=[0,0,.05,0],hat=[0,0,0,0],sumX=0,sumTheta=0,count=0,peakForce=0;
 const points:{t:number;x:number;xhat:number;theta:number;thetaHat:number;u:number}[]=[];
 for(let i=0;i<=3000;i++){
  const command=-K[0].reduce((s,v,j)=>s+v*hat[j],0)+N*.1,u=Math.max(-50,Math.min(50,command));peakForce=Math.max(peakForce,Math.abs(u));
  if(i>=1500){sumX+=(x[0]-hat[0])**2;sumTheta+=(x[2]-hat[2])**2;count++;}
  if(i%10===0)points.push({t:i*dt,x:x[0],xhat:hat[0],theta:x[2],thetaHat:hat[2],u});
  if(i===3000)break;
  const noise=normal(),innovation=[(x[0]-hat[0])*dt+sigmaV*root*noise[4],(x[2]-hat[2])*dt+sigmaV*root*noise[5]];
  const nx=x.map((v,j)=>v+dt*(A[j].reduce((s,a,k)=>s+a*x[k],0)+B[j][0]*u)+sigmaW*root*noise[j]);
  const nh=hat.map((v,j)=>v+dt*(A[j].reduce((s,a,k)=>s+a*hat[k],0)+B[j][0]*u)+L[j][0]*innovation[0]+L[j][1]*innovation[1]);
  x=nx;hat=nh;
 }
 if(points.some(p=>!Object.values(p).every(Number.isFinite)))throw new Error('nonfinite simulation');
 return {points,rmseX:Math.sqrt(sumX/count),rmseTheta:Math.sqrt(sumTheta/count),peakForce};
}
