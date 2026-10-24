export type MheConfig={mean:number;P:number;Q:number;R:number;capacity:number;spike:number};
export const mheDefaults:MheConfig={mean:.5,P:1,Q:.25,R:.25,capacity:1,spike:0};
function solve(A:number[][],b:number[]){const n=b.length,a=A.map((r,i)=>[...r,b[i]]);for(let k=0;k<n;k++){let pivot=k;for(let i=k+1;i<n;i++)if(Math.abs(a[i][k])>Math.abs(a[pivot][k]))pivot=i;[a[k],a[pivot]]=[a[pivot],a[k]];if(Math.abs(a[k][k])<1e-14)throw Error('Singular teaching system');for(let i=k+1;i<n;i++){const v=a[i][k]/a[k][k];for(let j=k;j<=n;j++)a[i][j]-=v*a[k][j];}}const x=Array(n).fill(0);for(let i=n-1;i>=0;i--){let v=a[i][n];for(let j=i+1;j<n;j++)v-=a[i][j]*x[j];x[i]=v/a[i][i];}return x;}
export function estimateMhe(c:MheConfig=mheDefaults){
 if(!Object.values(c).every(Number.isFinite)||c.P<=0||c.Q<=0||c.R<=0||c.capacity<0)throw new RangeError('Invalid MHE teaching contract');
 const y=[.2,1.4+c.spike,1.1],d=[.5,0],H=[[1/c.P+1/c.Q+1/c.R,-1/c.Q,0],[-1/c.Q,2/c.Q+1/c.R,-1/c.Q],[0,-1/c.Q,1/c.Q+1/c.R]];
 const b=[c.mean/c.P+y[0]/c.R-d[0]/c.Q,y[1]/c.R+(d[0]-d[1])/c.Q,y[2]/c.R+d[1]/c.Q];
 const objective=(x:number[])=>.5*((x[0]-c.mean)**2/c.P+x.reduce((s,v,i)=>s+(y[i]-v)**2/c.R,0)+d.reduce((s,v,i)=>s+(x[i+1]-x[i]-v)**2/c.Q,0));
 const unconstrained=solve(H,b);let best:number[]|undefined,bestCost=Infinity;
 for(let code=0;code<27;code++){let t=code;const active:number[]=[],x=[0,0,0],free:number[]=[];for(let i=0;i<3;i++){active[i]=t%3;t=Math.floor(t/3);if(active[i]===0)free.push(i);else x[i]=active[i]===1?0:c.capacity;}
  const z=solve(free.map(i=>free.map(j=>H[i][j])),free.map(i=>b[i]-x.reduce((s,v,j)=>s+(active[j]!==0?H[i][j]*v:0),0)));free.forEach((j,i)=>x[j]=z[i]);
  if(x.some(v=>v< -1e-10||v>c.capacity+1e-10))continue;const g=H.map((r,i)=>r.reduce((s,v,j)=>s+v*x[j],-b[i]));
  if(c.capacity>0&&g.some((v,i)=>active[i]===0?Math.abs(v)>1e-8:active[i]===1?v< -1e-8:v>1e-8))continue;
  const value=objective(x);if(value<bestCost){best=x.map(v=>Math.max(0,Math.min(c.capacity,v)));bestCost=value;}}
 if(!best)throw Error('No certified box minimizer');const x=best,g=H.map((r,i)=>r.reduce((s,v,j)=>s+v*x[j],-b[i]));
 const residual=Math.max(...g.map((v,i)=>c.capacity===0?0:x[i]<1e-9?Math.max(0,-v):x[i]>c.capacity-1e-9?Math.max(0,v):Math.abs(v)));
 return {x,cost:objective(x),unconstrained,unconstrainedCost:objective(unconstrained),y,process:d.map((v,i)=>x[i+1]-x[i]-v),measurement:y.map((v,i)=>v-x[i]),gradient:g,residual};
}
