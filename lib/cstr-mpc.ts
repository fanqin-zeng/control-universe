export type CstrConfig={N:number;q:number;r:number;step:number;rate:number;feed:number};
export const cstrDefaults:CstrConfig={N:10,q:1,r:1,step:2,rate:2,feed:.9};
export const cstrAd=[[.7807024019761188,-.004040807882208126],[23.67000433092622,1.5025022769017635]],cstrBd=[[.00044686801752120536,-.0004055039101539901],[.005677054742155856,.25940826227788566]];
const mv=(A:number[][],x:number[])=>A.map(r=>r[0]*x[0]+r[1]*x[1]);const mm=(A:number[][],B:number[][])=>A.map(r=>[r[0]*B[0][0]+r[1]*B[1][0],r[0]*B[0][1]+r[1]*B[1][1]]);const dot=(a:number[],b:number[])=>a[0]*b[0]+a[1]*b[1];
function solve(A:number[][],b:number[]){const det=A[0][0]*A[1][1]-A[0][1]*A[1][0];if(Math.abs(det)<1e-14)return undefined;return [(b[0]*A[1][1]-A[0][1]*b[1])/det,(A[0][0]*b[1]-b[0]*A[1][0])/det];}
export function cstrDerivative(x:number[],u:number[],feed=1){const [ca,T]=x,[F,Tc]=u,k=Math.exp(25-8750/T);return [F/100*(feed-ca)-k*ca,F/100*(350-T)+50000/239*k*ca-50000/23900*(T-Tc)];}
export function cstrStep(x:number[],u:number[],feed:number){let z=[...x];const h=.0025;for(let i=0;i<40;i++){const a=cstrDerivative(z,u,feed),b=cstrDerivative(z.map((v,j)=>v+h*a[j]/2),u,feed),c=cstrDerivative(z.map((v,j)=>v+h*b[j]/2),u,feed),d=cstrDerivative(z.map((v,j)=>v+h*c[j]),u,feed);z=z.map((v,j)=>v+h*(a[j]+2*b[j]+2*c[j]+d[j])/6);}return z;}
export function planCstr(x:number[],previous:number[],c:CstrConfig=cstrDefaults){
 if(!Object.values(c).every(Number.isFinite)||!Number.isInteger(c.N)||c.N<1||c.N>20||c.q<=0||c.r<=0||c.rate<=0||c.feed<=0||![...x,...previous].every(Number.isFinite))throw new RangeError('Invalid CSTR teaching contract');
 let A=[[1,0],[0,1]],S=[[0,0],[0,0]];const base:number[][]=[],gain:number[][][]=[],du=[previous[0]-100,previous[1]-300],dx=[x[0]-.5,x[1]-350];
 for(let j=0;j<c.N;j++){A=mm(cstrAd,A);S=mm(cstrAd,S).map((row,i)=>row.map((v,l)=>v+cstrBd[i][l]));const a=mv(A,dx),b=mv(S,du);base.push(a.map((v,i)=>v+b[i]));gain.push(S);}
 const H=[[.02*c.r,0],[0,.08*c.r]],f=[0,0],Q=[400*c.q,.04*c.q];for(let n=0;n<c.N;n++)for(let k=0;k<2;k++){const error=base[n][k]-(k===1?c.step:0);for(let i=0;i<2;i++){f[i]+=2*gain[n][k][i]*Q[k]*error;for(let j=0;j<2;j++)H[i][j]+=2*gain[n][k][i]*Q[k]*gain[n][k][j];}}
 const lower=[80,280].map((v,i)=>Math.max(v-previous[i],-c.rate)),upper=[120,320].map((v,i)=>Math.min(v-previous[i],c.rate));
 const G=[[1,0],[0,1],[-1,0],[0,-1],...gain.map(a=>a[1])],h=[...upper,...lower.map(v=>-v),...base.map(a=>5-a[1])];
 const objective=(v:number[])=>base.reduce((s,a,n)=>s+a.reduce((ss,b,k)=>ss+Q[k]*(b+dot(gain[n][k],v)-(k===1?c.step:0))**2,0),0)+.01*c.r*v[0]**2+.04*c.r*v[1]**2;
 const candidates:number[][]=[];const free=solve(H,f.map(v=>-v));if(free)candidates.push(free);
 for(let i=0;i<G.length;i++){const normal=solve(H,G[i]);if(free&&normal){const denominator=dot(G[i],normal);if(denominator>1e-14){const l=(dot(G[i],free)-h[i])/denominator;candidates.push(free.map((v,j)=>v-l*normal[j]));}}
  for(let j=0;j<i;j++){const v=solve([G[i],G[j]],[h[i],h[j]]);if(v)candidates.push(v);}}
 const feasible=candidates.filter(v=>G.every((row,i)=>dot(row,v)<=h[i]+1e-8));if(!feasible.length)return {feasible:false as const,reason:'名义预测QP不可行，停止批准新动作',G,h,H,f,base,gain};
 const v=feasible.reduce((best,a)=>objective(a)<objective(best)?a:best),gradient=mv(H,v).map((a,i)=>a+f[i]),active=G.map((row,i)=>Math.abs(dot(row,v)-h[i])<1e-6?i:-1).filter(i=>i>=0);
 let residual=Math.max(...G.map((row,i)=>Math.max(0,dot(row,v)-h[i])),Math.hypot(...gradient));const inspect=(ids:number[],multipliers:number[])=>{if(multipliers.some(a=>a< -1e-8))return;const station=[...gradient];ids.forEach((id,j)=>station.forEach((_,i)=>station[i]+=G[id][i]*multipliers[j]));residual=Math.min(residual,Math.max(Math.hypot(...station),...G.map((row,i)=>Math.max(0,dot(row,v)-h[i])),...multipliers.map(a=>Math.max(0,-a))));};
 for(const i of active){inspect([i],[-dot(G[i],gradient)/dot(G[i],G[i])]);for(const j of active.filter(j=>j<i)){const l=solve([[G[i][0],G[j][0]],[G[i][1],G[j][1]]],gradient.map(a=>-a));if(l)inspect([i,j],l);}}
 return {feasible:true as const,v,u:previous.map((a,i)=>a+v[i]),cost:objective(v),pred:base.map((a,n)=>a.map((b,i)=>b+dot(gain[n][i],v)+(i===0?.5:350))),residual,G,h,H,f,base,gain};
}
export function simulateCstr(c:CstrConfig=cstrDefaults){let x=[.5,350],previous=[100,300];const states=[x],controls:number[][]=[],predictions:number[][]=[],costs:number[]=[],residuals:number[]=[];let stopped:number|null=null;for(let k=0;k<40;k++){const p=planCstr(x,previous,c);if(!p.feasible){stopped=k;break;}const next=cstrStep(x,p.u,k>=20?c.feed:1);if(!next.every(Number.isFinite)||next[0]<0||next[1]<=0){stopped=k;break;}x=next;previous=p.u;states.push(x);controls.push(previous);predictions.push(p.pred[0]);costs.push(p.cost);residuals.push(p.residual);}return {states,controls,predictions,costs,residuals,stopped,peak:Math.max(...states.map(x=>x[1])),temperatureSSE:states.slice(1).reduce((s,x)=>s+.1*(x[1]-350-c.step)**2,0)};}
