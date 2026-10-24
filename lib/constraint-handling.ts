type Point=[number,number];
const dot=(a:number[],b:number[])=>a.reduce((s,v,i)=>s+v*b[i],0);
function solve2(a:number[][],b:number[]):Point|null{
  const det=a[0][0]*a[1][1]-a[0][1]*a[1][0];
  if(Math.abs(det)<1e-12)return null;
  return [(a[1][1]*b[0]-a[0][1]*b[1])/det,(-a[1][0]*b[0]+a[0][0]*b[1])/det];
}
function clip(poly:Point[],a:number[],b:number):Point[]{
  const out:Point[]=[];if(!poly.length)return out;
  for(let i=0;i<poly.length;i++){
    const p=poly[i],q=poly[(i+1)%poly.length],fp=dot(a,p)-b,fq=dot(a,q)-b;
    if(fp<=1e-10)out.push(p);
    if((fp<0&&fq>0)||(fp>0&&fq<0)){const t=fp/(fp-fq);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}
  }
  return out.filter((p,i)=>!out.slice(0,i).some(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<1e-9));
}
/** Exact candidate enumeration for this strictly convex, bounded 2-variable QP. */
export function constraintExample(position=4,rate=1,limit=5){
  if(![position,rate,limit].every(Number.isFinite)||position<0||position>8||rate<.25||rate>2||limit<2||limit>8)throw new RangeError('Invalid constraint contract');
  // Last input u2=u1 after Nu=2, rather than u2=0.
  const G=[[.5,0],[1.5,.5],[2.5,2]],free=[position+1,position+2,position+3];
  const H=Array.from({length:2},(_,i)=>Array.from({length:2},(_,j)=>2*(G.reduce((s,g)=>s+g[i]*g[j],0)+(i===j?.1:0))));
  const f=[0,1].map(i=>2*G.reduce((s,g,j)=>s+g[i]*free[j],0));
  const A:number[][]=[[1,0],[0,1],[-1,0],[0,-1],[1,0],[-1,1],[-1,0],[1,-1],...G,...G.map(g=>g.map(v=>-v))];
  const b=[2,2,2,2,rate+.5,rate,rate-.5,rate,...free.map(v=>limit-v),...free.map(v=>limit+v)];
  const unconstrained=solve2(H,f.map(v=>-v))!;
  const candidates:{u:Point;lambda:number[];working:number[]}[]=[];
  const consider=(u:Point,values:number[],working:number[])=>{
    if(values.some(v=>v< -1e-8)||A.some((a,i)=>dot(a,u)>b[i]+1e-8))return;
    const lambda=Array(A.length).fill(0);working.forEach((i,j)=>lambda[i]=values[j]);candidates.push({u,lambda,working});
  };
  consider(unconstrained,[],[]);
  for(let i=0;i<A.length;i++){
    const hi=solve2(H,A[i])!,den=dot(A[i],hi),lambda=(dot(A[i],unconstrained)-b[i])/den;
    consider([unconstrained[0]-hi[0]*lambda,unconstrained[1]-hi[1]*lambda],[lambda],[i]);
    for(let j=i+1;j<A.length;j++){
      const u=solve2([A[i],A[j]],[b[i],b[j]]);if(!u)continue;
      const grad=H.map((h,k)=>dot(h,u)+f[k]);
      const multipliers=solve2([[A[i][0],A[j][0]],[A[i][1],A[j][1]]],grad.map(v=>-v));
      if(multipliers)consider(u,multipliers,[i,j]);
    }
  }
  const objective=(u:number[])=>.5*dot(u,H.map(h=>dot(h,u)))+dot(f,u);
  const best=candidates.reduce<typeof candidates[number]|null>((current,next)=>!current||objective(next.u)<objective(current.u)?next:current,null);
  let inputPolygon:Point[]=[[-2,-2],[2,-2],[2,2],[-2,2]];
  for(let i=4;i<8;i++)inputPolygon=clip(inputPolygon,A[i],b[i]);
  let hardPolygon=inputPolygon;
  for(let i=8;i<A.length;i++)hardPolygon=clip(hardPolygon,A[i],b[i]);
  if(!best)return {feasible:false as const,position,rate,limit,H,f,A,b,G,free,unconstrained,inputPolygon,hardPolygon};
  const prediction=G.map((g,i)=>free[i]+dot(g,best.u)),slack=A.map((a,i)=>b[i]-dot(a,best.u));
  const stationarity=H.map((h,j)=>dot(h,best.u)+f[j]+A.reduce((s,a,i)=>s+a[j]*best.lambda[i],0));
  const residual=Math.max(0,...slack.map(v=>-v),...best.lambda.map(v=>-v),...stationarity.map(Math.abs),...slack.map((v,i)=>Math.abs(v*best.lambda[i])));
  return {feasible:true as const,position,rate,limit,H,f,A,b,G,free,unconstrained,inputPolygon,hardPolygon,...best,prediction,slack,active:slack.flatMap((v,i)=>Math.abs(v)<1e-7?[i]:[]),cost:dot(prediction,prediction)+.1*dot(best.u,best.u),residual};
}
export function quadraticSlack(weight=10){
  if(!Number.isFinite(weight)||weight<1||weight>100)throw new RangeError('Invalid penalty');
  const epsilon=1/(1+weight),u=1+epsilon;
  return {weight,u,epsilon,cost:(u-2)**2+weight*epsilon**2};
}
