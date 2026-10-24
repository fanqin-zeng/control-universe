/** Teaching model: sensor path only; sample -> arrivals -> control -> plant. */
export type NetworkMode = 'clean'|'delay'|'reorder'|'burst';
export type ReceivePolicy = 'fresh'|'arrival';
export const networkModes: {id:NetworkMode;name:string}[]=[{id:'clean',name:'即时'},{id:'delay',name:'恒一拍时延'},{id:'reorder',name:'交替时延与乱序'},{id:'burst',name:'连续丢三包'}];
export function networkExperiment(K=4,mode:NetworkMode='clean',policy:ReceivePolicy='fresh'){
 if(!Number.isInteger(K)||K<1||K>12||!networkModes.some(m=>m.id===mode)||!['fresh','arrival'].includes(policy))throw new RangeError('Unsupported teaching parameters');
 let x=1,held=0,seq:number|null=null,rejected=0;
 const queue:{seq:number;arrival:number;value:number}[]=[];
 const points:{k:number;x:number;held?:number;u?:number;age?:number|null;seq?:number|null}[]=[];
 for(let k=0;k<40;k++){
  const delay=mode==='delay'?1:mode==='reorder'?(k%2===0?2:0):0;
  if(!(mode==='burst'&&k%10>=3&&k%10<=5))queue.push({seq:k,arrival:k+delay,value:x});
  const arrivals=queue.filter(p=>p.arrival===k).sort((a,b)=>a.seq-b.seq);
  for(const p of arrivals){if(policy==='arrival'||seq===null||p.seq>seq){held=p.value;seq=p.seq;}else rejected++;}
  const u=-K*held;points.push({k,x,held,u,age:seq===null?null:(k-seq)*.1,seq});x=1.1*x+.1*u;
 }
 points.push({k:40,x});
 return {K,mode,policy,points,final:x,peak:Math.max(...points.map(p=>Math.abs(p.x))),energy:points.slice(0,40).reduce((s,p)=>s+p.x*p.x,0),maxAge:Math.max(...points.slice(0,40).map(p=>p.age??0)),rejected};
}
export function networkPoles(K:number){
 const disc=1.21-.4*K;
 return {clean:1.1-.1*K,rho:disc>=0?Math.max(Math.abs((1.1+Math.sqrt(disc))/2),Math.abs((1.1-Math.sqrt(disc))/2)):Math.sqrt(.1*K)};
}
