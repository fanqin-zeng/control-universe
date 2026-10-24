export type CaseParams={m:number;k:number;q:number};
export const caseDefault:CaseParams={m:.5,k:10,q:1};
export function caseReadings(p:CaseParams){
 const {m,k,q}=p,a4=m,a3=.5+.7*m,a2=(1+m)*k+.1,a1=.2*k+.5*q,a0=q*k;
 const d2=a3*a2-a4*a1,d3=d2*a1-a3*a3*a0;
 return {den:[a4,a3,a2,a1,a0],d2,d3,stable:q>0&&d2>0&&d3>0,wn:Math.sqrt(k*(1+m)/m),dcError:q>0?0:null};
}
export function caseFrequency(p:CaseParams,w:number){
 const {m,k,q}=p,dr=m*w**4-((1+m)*k+.1)*w*w,di=-(.5+.7*m)*w**3+.2*k*w;
 const nr=k,ni=.5*w,cr=dr+q*nr,ci=di+q*ni,mag=Math.hypot(cr,ci);
 return {S:Math.hypot(dr,di)/mag,T:q*Math.hypot(nr,ni)/mag,KS:q*Math.hypot(dr,di)/mag};
}
export function caseTrace(p:CaseParams,end=60,step=.01){
 const n=Math.ceil(end/step),h=end/n,x=[0,0,0,0],time:number[]=[],y:number[]=[],force:number[]=[];
 const f=(z:number[])=>[z[2],z[3],p.q*(1-z[1])-.7*z[2]+.5*z[3]-p.k*(z[0]-z[1]),(.5*(z[2]-z[3])+p.k*(z[0]-z[1]))/p.m];
 for(let i=0;i<=n;i++){
  if(i%4===0||i===n){time.push(i*h);y.push(x[1]);force.push(p.q*(1-x[1]));}
  if(i===n)break;
  const a=f(x),b=f(x.map((v,j)=>v+h*a[j]/2)),c=f(x.map((v,j)=>v+h*b[j]/2)),d=f(x.map((v,j)=>v+h*c[j]));
  for(let j=0;j<4;j++)x[j]+=h*(a[j]+2*b[j]+2*c[j]+d[j])/6;
 }
 return {time,y,force,step:h};
}
