export type Kind = "lead" | "lag" | "combined";
export const LEAD_T = 1/(Math.sqrt((-25+Math.sqrt(625+4*500**2*6.5))/2)*Math.sqrt(6.5));
export const COMBINED_T1 = 1/(3*Math.sqrt(12));
const targetAttenuation = 1/(1000/(3*Math.sqrt(10)*Math.sqrt(109))*Math.sqrt(12));
export const COMBINED_BETA = 3/(.3*Math.sqrt(101/targetAttenuation**2-1));
export const COMBINED_T2 = 1/(.3*COMBINED_BETA);
export function convolution(a:number[],b:number[]) {const c=Array(a.length+b.length-1).fill(0);a.forEach((x,i)=>b.forEach((y,j)=>c[i+j]+=x*y));return c;}
function add(a:number[],b:number[]) {const c=Array(Math.max(a.length,b.length)).fill(0);a.forEach((x,i)=>c[c.length-a.length+i]+=x);b.forEach((x,i)=>c[c.length-b.length+i]+=x);return c;}
export function configuration(kind:Kind,k:number,corrected=true) {
  if(!Number.isFinite(k)||k<=0)throw new RangeError("positive gain required");
  const plant=kind==="lead"?[1,5,0]:kind==="lag"?[1,3,2,0]:[1,11,10,0];
  const stages=corrected?(kind==="lead"?[[6.5,LEAD_T]]:kind==="lag"?[[.0215,846]]:[[12,COMBINED_T1],[COMBINED_BETA,COMBINED_T2]]):[];
  let num=[k],den=plant;for(const[a,t]of stages){num=convolution(num,[a*t,1]);den=convolution(den,[t,1]);}
  return {num,den,closedDen:add(den,num),stages,poles:kind==="lead"?[5]:kind==="lag"?[1,2]:[1,10]};
}
export function frequency(kind:Kind,k:number,w:number,corrected=true) {
  if(!(w>0&&Number.isFinite(w)))throw new RangeError("positive frequency required");
  const c=configuration(kind,k,corrected);let log=Math.log(k)-Math.log(w),phase=-Math.PI/2;
  for(const p of c.poles){log-=Math.log(Math.hypot(w,p));phase-=Math.atan2(w,p);}
  for(const[a,t]of c.stages){log+=Math.log(Math.hypot(1,a*t*w))-Math.log(Math.hypot(1,t*w));phase+=Math.atan(a*t*w)-Math.atan(t*w);}
  return {db:20*log/Math.LN10,phase:phase*180/Math.PI};
}
/** These three positive-gain loop families have strictly decreasing magnitude,
 * hence exactly one positive gain crossover. No finite plotting grid is used. */
export function crossover(kind:Kind,k:number,corrected=true) {
  let lo=-20,hi=20;for(let i=0;i<100;i++){const mid=(lo+hi)/2;if(frequency(kind,k,Math.exp(mid),corrected).db>0)lo=mid;else hi=mid;}
  const wc=Math.exp((lo+hi)/2);return {wc,pm:180+frequency(kind,k,wc,corrected).phase};
}
export function stability(den:number[]) {
  const n=den.length-1,m=Math.ceil((n+1)/2),r=Array.from({length:n+1},()=>Array(m).fill(0));
  for(let j=0;j<m;j++){r[0][j]=den[2*j]||0;r[1][j]=den[2*j+1]||0;}
  for(let i=2;i<=n;i++){if(Math.abs(r[i-1][0])<1e-10)return "边界或退化，需核特征根";for(let j=0;j<m-1;j++)r[i][j]=(r[i-1][0]*r[i-2][j+1]-r[i-2][0]*r[i-1][j+1])/r[i-1][0];}
  const col=r.map(x=>x[0]);return col.every(x=>x>1e-10)?"渐近稳定":col.some(x=>x<0)?"不稳定":"边界或退化，需核特征根";
}
export function rk4(x:number[],dt:number,f:(v:number[])=>number[]) {
  const a=f(x),b=f(x.map((v,i)=>v+dt*a[i]/2)),c=f(x.map((v,i)=>v+dt*b[i]/2)),d=f(x.map((v,i)=>v+dt*c[i]));return x.map((v,i)=>v+dt*(a[i]+2*b[i]+2*c[i]+d[i])/6);
}
export function response(kind:Kind,k:number,corrected=true) {
  const c=configuration(kind,k,corrected),den=c.closedDen.map(x=>x/c.closedDen[0]),num=c.num.map(x=>x/c.closedDen[0]),n=den.length-1,weights=Array(n).fill(0);
  num.forEach((v,i)=>weights[num.length-1-i]=v);let x=Array(n).fill(0);const points:[number,number][]=[];
  const f=(v:number[])=>[...v.slice(1),1-v.reduce((s,z,i)=>s+den[n-i]*z,0)];
  for(let i=0;i<=50000;i++){if(i%100===0)points.push([i*.0001,x.reduce((s,v,j)=>s+weights[j]*v,0)]);if(i<50000)x=rk4(x,.0001,f);}
  return points;
}
/** Plant y''+2y'=u; PI uses integral OUTPUT state. */
export function antiWindup(limit:number,reference=1,dt=.001) {
  if(!(limit>0&&Number.isFinite(limit)&&dt>0&&dt<=.001))throw new RangeError("invalid simulation contract");
  const modes=["ideal","plain","back"] as const;
  return modes.map(mode=>{let x=[0,0,0];const points:{t:number;y:number;u:number;integral:number}[]=[];
    const control=(v:number[])=>{const raw=5*(reference-v[0])+v[2];return {raw,u:mode==="ideal"?raw:Math.max(-limit,Math.min(limit,raw))};};
    const f=(v:number[])=>{const {raw,u}=control(v);return[v[1],u-2*v[1],2*(reference-v[0])+(mode==="back"?u-raw:0)];};
    const count=Math.round(10/dt),keep=Math.round(.02/dt);for(let i=0;i<=count;i++){if(i%keep===0)points.push({t:i*dt,y:x[0],u:control(x).u,integral:x[2]});if(i<count)x=rk4(x,dt,f);}
    return {mode,points};
  });
}
