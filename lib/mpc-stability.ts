const dot=(a:number[],b:number[])=>a.reduce((s,v,i)=>s+v*b[i],0);
function solve2(a:number[][],b:number[]){const d=a[0][0]*a[1][1]-a[0][1]*a[1][0];return Math.abs(d)<1e-12?null:[(a[1][1]*b[0]-a[0][1]*b[1])/d,(-a[1][0]*b[0]+a[0][0]*b[1])/d];}
/** Bounded, positive definite 2-variable QP; no general solver claims. */
export function stabilityPlan(x=2,radius=1){
 if(![x,radius].every(Number.isFinite)||Math.abs(x)>3||radius<.5||radius>1.5)throw new RangeError('Outside teaching contract');
 const P=17/8,free=[1.2*x,1.44*x];
 const H=[[2*(2+P*1.44),2*P*1.2],[2*P*1.2,2*(1+P)]],f=[2*(free[0]+P*1.2*free[1]),2*P*free[1]];
 const A=[[1,0],[-1,0],[0,1],[0,-1],[1,0],[-1,0],[1.2,1],[-1.2,-1]],b=[1,1,1,1,3-free[0],3+free[0],radius-free[1],radius+free[1]];
 const center=solve2(H,f.map(v=>-v))!;
 const candidates:{u:number[];lambda:number[]}[]=[];
 const accept=(u:number[],v:number[],rows:number[])=>{if(v.some(t=>t< -1e-8)||A.some((a,i)=>dot(a,u)>b[i]+1e-8))return;const lambda=Array(8).fill(0);rows.forEach((i,j)=>lambda[i]=v[j]);candidates.push({u,lambda});};
 accept(center,[],[]);
 for(let i=0;i<8;i++){
  const hi=solve2(H,A[i])!,v=(dot(A[i],center)-b[i])/dot(A[i],hi);accept(center.map((t,j)=>t-hi[j]*v),[v],[i]);
  for(let j=i+1;j<8;j++){const u=solve2([A[i],A[j]],[b[i],b[j]]);if(!u)continue;const grad=H.map((h,k)=>dot(h,u)+f[k]),lam=solve2([[A[i][0],A[j][0]],[A[i][1],A[j][1]]],grad.map(v=>-v));if(lam)accept(u,lam,[i,j]);}
 }
 const objective=(u:number[])=>x*x+u[0]**2+(free[0]+u[0])**2+u[1]**2+P*(free[1]+1.2*u[0]+u[1])**2;
 const best=candidates.reduce<typeof candidates[number]|null>((a,v)=>!a||objective(v.u)<objective(a.u)?v:a,null);
 const bound=(radius+2.2)/1.44;
 if(!best)return {feasible:false as const,x,radius,bound,H,f,A,b};
 const states=[x,free[0]+best.u[0],free[1]+1.2*best.u[0]+best.u[1]],slack=A.map((a,i)=>b[i]-dot(a,best.u));
 const residual=Math.max(0,...slack.map(v=>-v),...best.lambda.map(v=>-v),...H.map((h,j)=>Math.abs(dot(h,best.u)+f[j]+A.reduce((s,a,i)=>s+a[j]*best.lambda[i],0))),...slack.map((v,i)=>Math.abs(v*best.lambda[i])));
 return {feasible:true as const,x,radius,bound,H,f,A,b,...best,states,cost:objective(best.u),residual};
}
export function stabilityExperiment(x=2,radius=1,disturbance=0){
 if(!Number.isFinite(disturbance)||Math.abs(disturbance)>.75)throw new RangeError('Outside disturbance illustration');
 const plan=stabilityPlan(x,radius);if(!plan.feasible)return {plan};
 const tail=-.6*plan.states[2],shift=[plan.u[1],tail],measured=plan.states[1]+disturbance;
 const candidateStates=[measured,1.2*measured+shift[0],1.2*(1.2*measured+shift[0])+shift[1]];
 const violation=Math.max(0,...candidateStates.map(v=>Math.abs(v)-3),...shift.map(v=>Math.abs(v)-1),Math.abs(candidateStates[2])-radius);
 const candidateCost=candidateStates[0]**2+shift[0]**2+candidateStates[1]**2+shift[1]**2+17/8*candidateStates[2]**2;
 const next=Math.abs(measured)<=3?stabilityPlan(measured,radius):null;
 return {plan,tail,shift,measured,candidateStates,violation,candidateCost,next,stage:x*x+plan.u[0]**2};
}
