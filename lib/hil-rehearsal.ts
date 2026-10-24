/** Virtual-clock software rehearsal; NOT measured timing or physical HIL. */
export type HilMode='clean'|'edge'|'burst'|'overload';
export type HilPolicy='hold'|'zero3';
export const hilModes:{id:HilMode;name:string}[]=[{id:'clean',name:'成本可调'},{id:'edge',name:'恰好20ms'},{id:'burst',name:'连续10次超期'},{id:'overload',name:'全部超期'}];
export const hilSteps=[1,2,5,10,20];
export function hilExperiment(steps=10,mode:HilMode='clean',policy:HilPolicy='zero3',costMs=4){
 if(!hilSteps.includes(steps)||!hilModes.some(q=>q.id===mode)||!['hold','zero3'].includes(policy)||!Number.isInteger(costMs)||costMs<1||costMs>30)throw new RangeError('Unsupported rehearsal parameters');
 let x=0,exact=0,u=0,failures=0,pending:{onTime:boolean;command:number}|null=null;
 const points:{k:number;x:number;exact:number;u?:number;failures?:number;zero?:boolean}[]=[],jobs:{k:number;command:number;costMs:number;onTime:boolean;deadlineMs:number;completeMs:number}[]=[];
 for(let k=0;k<100;k++){
  if(pending){if(pending.onTime){u=pending.command;failures=0;}else failures++;}
  const zero=policy==='zero3'&&failures>=3;if(zero)u=0;
  points.push({k,x,exact,u,failures,zero});
  const command=Math.max(0,Math.min(2,2*(1-x))),cost=mode==='clean'?costMs:mode==='edge'?20:mode==='overload'||(k>=20&&k<=29)?25:4;
  pending={onTime:cost<=20,command};jobs.push({k,command,costMs:cost,onTime:cost<=20,deadlineMs:(k+1)*20,completeMs:k*20+cost});
  const h=.02/steps;for(let j=0;j<steps;j++)x+=h*(u-x)/.5;
  exact=Math.exp(-.04)*exact+(1-Math.exp(-.04))*u;
 }
 points.push({k:100,x,exact});
 return {steps,mode,policy,costMs,points,jobs,final:x,iae:.02*points.slice(0,100).reduce((a,p)=>a+Math.abs(1-p.x),0),maxError:Math.max(...points.map(p=>Math.abs(p.x-p.exact))),misses:jobs.filter(p=>!p.onTime).length,zeroFrames:points.slice(0,100).filter(p=>p.zero).length};
}
