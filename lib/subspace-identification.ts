/** Small symmetric Hankel ERA teaching implementation; not general N4SID. */
export interface SubspaceConfig { amplitude:number; pole:number; noise:number; tolerance:number; order:number }
export const subspaceDefaults:SubspaceConfig={amplitude:.5,pole:.3,noise:0,tolerance:1e-8,order:2};
function symmetricEigen(input:number[][]){
 const a=input.map(r=>r.slice()),v=Array.from({length:4},(_,i)=>Array.from({length:4},(_,j)=>i===j?1:0) as number[]);
 for(let sweep=0;sweep<120;sweep++){let p=0,q=1;for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)if(Math.abs(a[i][j])>Math.abs(a[p][q])){p=i;q=j;}if(Math.abs(a[p][q])<1e-14)break;
  const angle=.5*Math.atan2(2*a[p][q],a[q][q]-a[p][p]),c=Math.cos(angle),s=Math.sin(angle),app=a[p][p],aqq=a[q][q],apq=a[p][q];
  for(let k=0;k<4;k++)if(k!==p&&k!==q){const x=a[k][p],y=a[k][q];a[k][p]=a[p][k]=c*x-s*y;a[k][q]=a[q][k]=s*x+c*y;}
  a[p][p]=c*c*app-2*s*c*apq+s*s*aqq;a[q][q]=s*s*app+2*s*c*apq+c*c*aqq;a[p][q]=a[q][p]=0;
  for(let k=0;k<4;k++){const x=v[k][p],y=v[k][q];v[k][p]=c*x-s*y;v[k][q]=s*x+c*y;}
 }
 return Array.from({length:4},(_,i)=>({value:a[i][i],vector:v.map(r=>r[i])})).sort((x,y)=>Math.abs(y.value)-Math.abs(x.value));
}
export function subspaceExperiment(c:SubspaceConfig=subspaceDefaults){
 if(![0,.05,.5,1].includes(c.amplitude)||![.3,.8,.95].includes(c.pole)||![0,.001,.02].includes(c.noise)||![1e-8,.02,.1,.4].includes(c.tolerance)||![1,2].includes(c.order))throw new RangeError('Unsupported subspace experiment');
 let state=20261024;const perturb=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return Math.sqrt(12)*(state/4294967296-.5);};
 const truth=Array.from({length:20},(_,i)=>.8**i+c.amplitude*c.pole**i),measured=truth.slice(0,8).map(h=>h+c.noise*perturb());
 const H=Array.from({length:4},(_,i)=>Array.from({length:4},(_,j)=>measured[i+j])),shift=Array.from({length:4},(_,i)=>Array.from({length:4},(_,j)=>measured[i+j+1]));
 const e=symmetricEigen(H),singular=e.map(x=>Math.abs(x.value)),rank=singular.filter(s=>s>c.tolerance*singular[0]).length;
 if(c.order>rank)return {singular,rank,truth,measured,prediction:null,rmse:null,poles:null,model:null};
 const n=c.order,U=e.slice(0,n).map(x=>x.vector),V=e.slice(0,n).map(x=>x.vector.map(v=>v*(x.value<0?-1:1)));
 const A=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>U[i].reduce((sum,u,r)=>sum+u*shift[r].reduce((t,h,k)=>t+h*V[j][k],0),0)/Math.sqrt(singular[i]*singular[j])));
 const B=V.map((v,i)=>v[0]*Math.sqrt(singular[i])),C=U.map((u,i)=>u[0]*Math.sqrt(singular[i]));let x=B.slice();
 const prediction=truth.map(()=>{const y=C.reduce((sum,v,i)=>sum+v*x[i],0);x=A.map(row=>row.reduce((sum,v,j)=>sum+v*x[j],0));return y;});
 const trace=A[0][0]+(n===2?A[1][1]:0),det=n===2?A[0][0]*A[1][1]-A[0][1]*A[1][0]:0,disc=trace*trace-4*det;
 const poles=n===1?[{re:trace,im:0}]:disc>=0?[{re:(trace-Math.sqrt(disc))/2,im:0},{re:(trace+Math.sqrt(disc))/2,im:0}]:[{re:trace/2,im:-Math.sqrt(-disc)/2},{re:trace/2,im:Math.sqrt(-disc)/2}];
 return {singular,rank,truth,measured,prediction,rmse:Math.sqrt(prediction.reduce((sum,y,i)=>sum+(y-truth[i])**2,0)/20),poles,model:{A,B,C,D:0}};
}
