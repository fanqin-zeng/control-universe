type Region={id:string;name:string;A:number[][];b:number[];gain:[number,number];offset:number;polygon:number[][];color:string};
export const explicitRegions:Region[]=[
 {id:'R0',name:'中央区',A:[[-1,1],[1,-1],[1,1],[-1,-1]],b:[2,2,4,4],gain:[-.5,.5],offset:0,polygon:[[-3,-1],[-1,-3],[3,1],[1,3]],color:'#93c5fd'},
 {id:'R1',name:'输入上界',A:[[1,-1],[1,0]],b:[-2,1],gain:[0,0],offset:1,polygon:[[-3,-1],[1,3],[-3,3]],color:'#86efac'},
 {id:'R2',name:'输入下界',A:[[-1,1],[-1,0]],b:[-2,1],gain:[0,0],offset:-1,polygon:[[-1,-3],[3,-3],[3,1]],color:'#fcd34d'},
 {id:'R3',name:'下一状态上界',A:[[-1,-1],[-1,0]],b:[-4,-1],gain:[-1,0],offset:2,polygon:[[1,3],[3,1],[3,3]],color:'#fca5a5'},
 {id:'R4',name:'下一状态下界',A:[[1,1],[1,0]],b:[-4,-1],gain:[-1,0],offset:-2,polygon:[[-3,-3],[-1,-3],[-3,-1]],color:'#c4b5fd'}
];
export function scalarQp(x:number,reference:number){
 if(![x,reference].every(Number.isFinite))throw new RangeError('Finite parameters required');
 const lower=Math.max(-1,-2-x),upper=Math.min(1,2-x);
 if(lower>upper)return {feasible:false as const,lower,upper};
 const u=Math.max(lower,Math.min(upper,(reference-x)/2));
 return {feasible:true as const,lower,upper,u,next:x+u,cost:(x+u-reference)**2+u*u};
}
/** This exported lookup evaluates only the fixed offline partition, never the QP. */
export function lookupExplicit(x=2,reference=-1,tolerance=0){
 if(![x,reference,tolerance].every(Number.isFinite)||tolerance<0||tolerance>.05)throw new RangeError('Invalid lookup contract');
 if(Math.abs(x)>3||Math.abs(reference)>3)return {inDomain:false as const};
 const hits=explicitRegions.filter(p=>p.A.every((row,i)=>row[0]*x+row[1]*reference<=p.b[i]+tolerance));
 if(!hits.length)return {inDomain:true as const,found:false as const};
 const p=hits[0],u=p.gain[0]*x+p.gain[1]*reference+p.offset;
 const lambda=[0,0,0,0];
 if(p.id==='R1')lambda[0]=2*(reference-x-2);
 if(p.id==='R2')lambda[1]=2*(x-reference-2);
 if(p.id==='R3')lambda[2]=2*(x+reference-4);
 if(p.id==='R4')lambda[3]=-2*(x+reference+4);
 const slack=[1-u,1+u,2-x-u,2+x+u];
 const violation=Math.max(0,...slack.map(v=>-v));
 const residual=Math.max(violation,...lambda.map(v=>-v),Math.abs(4*u+2*(x-reference)+lambda[0]-lambda[1]+lambda[2]-lambda[3]),...lambda.map((v,i)=>Math.abs(v*slack[i])));
 return {inDomain:true as const,found:true as const,region:p.id,hits:hits.map(v=>v.id),u,next:x+u,cost:(x+u-reference)**2+u*u,lambda,slack,violation,residual};
}
