/** Scalar-loop teaching implementation; every mask entry is a visibility decision. */
export function maskedSoftmax(scores:number[],visible:boolean[]):number[]{
 if(scores.length===0||scores.length!==visible.length||scores.some(v=>!Number.isFinite(v))||!visible.some(Boolean))throw new RangeError('invalid or fully masked row');
 const max=Math.max(...scores.filter((_,j)=>visible[j]));const e=scores.map((v,j)=>visible[j]?Math.exp(v-max):0),sum=e.reduce((a,b)=>a+b,0);return e.map(v=>v/sum);
}
export function attend(q:number[][],k:number[][],v:number[][],visible:boolean[][],temperature=1){
 const d=q[0]?.length,dv=v[0]?.length;
 if(!d||!dv||!k.length||v.length!==k.length||visible.length!==q.length||!Number.isFinite(temperature)||temperature<=0||q.some(r=>r.length!==d)||k.some(r=>r.length!==d)||v.some(r=>r.length!==dv)||visible.some(r=>r.length!==k.length)||[...q,...k,...v].some(r=>r.some(x=>!Number.isFinite(x))))throw new RangeError('attention shape/value contract');
 const scores=q.map(row=>k.map(key=>row.reduce((s,x,j)=>s+x*key[j],0)/Math.sqrt(d)/temperature));
 const weights=scores.map((row,i)=>maskedSoftmax(row,visible[i]));
 const output=weights.map(row=>Array.from({length:dv},(_,c)=>row.reduce((s,w,j)=>s+w*v[j][c],0)));
 return {scores,weights,output};
}
export const temperatures=[.25,1,4],deltas=[0,5,10];
export function attentionExperiment(temperature=1,delta=0,causal=true){
 if(!temperatures.includes(temperature)||!deltas.includes(delta))throw new RangeError('experiment domain');
 const q=[[1,0],[0,1],[1,1]],k=q.map(r=>[...r]),v=[[1],[2],[3+delta]],visible=q.map((_,i)=>k.map((_,j)=>!causal||j<=i));
 return attend(q,k,v,visible,temperature);
}
