export function diophantine(a:number[],horizon:number){
 if(a.length<2||a[0]!==1||!a.every(Number.isFinite)||!Number.isInteger(horizon)||horizon<1||horizon>60)throw new RangeError('Invalid monic polynomial');
 const degree=a.length-1;let f=Array(degree).fill(0);f[0]=1;const e:number[]=[],result:{E:number[];F:number[]}[]=[];
 for(let j=1;j<=horizon;j++){const next=f[0];e.push(next);f=Array.from({length:degree},(_,i)=>(f[i+1]??0)-next*a[i+1]);result.push({E:[...e],F:[...f]});}
 return result;
}
function positiveSolve(a:number[][],b:number[]){
 const n=b.length,l=Array.from({length:n},()=>Array(n).fill(0));const scale=Math.max(1,...a.map((r,i)=>r[i]));
 for(let i=0;i<n;i++)for(let j=0;j<=i;j++){let s=a[i][j];for(let k=0;k<j;k++)s-=l[i][k]*l[j][k];if(i===j){if(s<=1e-12*scale)return null;l[i][j]=Math.sqrt(s);}else l[i][j]=s/l[j][j];}
 const y=Array(n).fill(0),x=Array(n).fill(0);for(let i=0;i<n;i++)y[i]=(b[i]-l[i].slice(0,i).reduce((s,v,j)=>s+v*y[j],0))/l[i][i];
 for(let i=n-1;i>=0;i--){let s=y[i];for(let j=i+1;j<n;j++)s-=l[j][i]*x[j];x[i]=s/l[i][i];}return x;
}
export interface GpcOptions{N1?:number;N2?:number;Nu?:number;lambda?:number;delay?:number;a?:number;b?:number;y?:number;previousY?:number;pastInputs?:number[]}
export function gpcPlan(options:GpcOptions={}){
 const {N1=3,N2=10,Nu=3,lambda=.1,delay=3,a=.9048,b=.0952,y=0,previousY=0,pastInputs=Array(6).fill(0)}=options;
 if(![N1,N2,Nu,delay].every(Number.isInteger)||N1<1||N1>5||N2<5||N2>30||N1>N2||Nu<1||Nu>10||delay<1||delay>6||![lambda,a,b,y,previousY,...pastInputs].every(Number.isFinite)||lambda<0||lambda>10||Math.abs(a)>2||b<=0||b>1||pastInputs.length<delay)throw new RangeError('Outside GPC teaching contract');
 const polys=diophantine([1,-(1+a),a],N2),free:number[]=[],fullG:number[][]=[];
 for(let j=1;j<=N2;j++){
  const p=polys[j-1];let fj=p.F[0]*y+p.F[1]*previousY;
  for(let r=j+1;r<=j-1+delay;r++){const coefficient=p.E[r-delay]??0,lag=r-j;fj+=b*coefficient*(pastInputs[lag-1]-pastInputs[lag]);}
  free.push(fj);fullG.push(Array.from({length:Nu},(_,m)=>j-m>=delay?b*(p.E[j-m-delay]??0):0));
 }
 const G=fullG.slice(N1-1),f=free.slice(N1-1),normal=Array.from({length:Nu},(_,i)=>Array.from({length:Nu},(_,j)=>G.reduce((s,g)=>s+g[i]*g[j],0)+(i===j?lambda:0))),rhs=Array.from({length:Nu},(_,i)=>G.reduce((s,g,k)=>s+g[i]*(1-f[k]),0));
 const du=positiveSolve(normal,rhs),contract={N1,N2,Nu,lambda,delay,a,b,y,previousY,pastInputs,polys,free,fullG,G,f,normal,rhs};
 if(!du)return {...contract,solved:false as const};
 const prediction=fullG.map((g,j)=>free[j]+g.reduce((s,v,i)=>s+v*du[i],0));let current=pastInputs[0];
 const inputs=Array.from({length:N2},(_,i)=>{current+=du[i]??0;return current;});
 const cost=prediction.slice(N1-1).reduce((s,v)=>s+(v-1)**2,0)+lambda*du.reduce((s,v)=>s+v*v,0),residual=Math.max(...normal.map((g,j)=>Math.abs(2*(g.reduce((s,v,i)=>s+v*du[i],0)-rhs[j]))));
 return {...contract,solved:true as const,du,prediction,inputs,cost,residual};
}
