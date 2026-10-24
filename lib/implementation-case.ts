/** Synthetic discrete thermal plant. No hardware, scheduler or protocol is simulated. */
export type CaseMode = 'nominal' | 'load' | 'drop' | 'late' | 'capacity';
export type CasePath = 'guarded' | 'naive';
export const caseModes: {id: CaseMode; name: string}[] = [
  {id:'nominal',name:'正常跟踪'}, {id:'load',name:'负载变化'},
  {id:'drop',name:'15次数据无效'}, {id:'late',name:'全部超期'}, {id:'capacity',name:'目标不可达'},
];
export const caseBits = [4,8,12];
export function implementationCase(bits=8, mode:CaseMode='nominal', path:CasePath='guarded', costMs=4) {
  if (!caseBits.includes(bits) || !caseModes.some(q=>q.id===mode) || !['guarded','naive'].includes(path)
    || !Number.isInteger(costMs) || costMs<1 || costMs>120) throw new RangeError('Unsupported case parameters');
  const levels=2**bits-1, target=mode==='capacity'?3:1;
  let y=0, integralTicks=0, measuredCode=0, u=0, stale=0;
  const points: {k:number;y:number;measured:number;integral:number;u:number;valid:boolean;stale:number;degraded:boolean;saturated:boolean}[]=[];
  for(let k=0;k<300;k++) {
    const cost=mode==='late'?101:costMs;
    const valid=cost<=100 && !(mode==='drop' && k>=100 && k<=114);
    stale=valid?0:stale+1;
    if(valid) measuredCode=Math.floor(Math.max(0,Math.min(4,y))/4*levels+.5);
    const measured=4*measuredCode/levels;
    const degraded=path==='guarded' && stale>=3;
    let saturated=false;
    if(valid || path==='naive') {
      const errorCode=target*levels-4*measuredCode, candidate=integralTicks+errorCode;
      const rawTicks=20*errorCode+candidate;
      if(!((rawTicks>20*levels && errorCode>0) || (rawTicks<0 && errorCode<0))) integralTicks=candidate;
      const commandTicks=20*errorCode+integralTicks;
      saturated=commandTicks<0 || commandTicks>20*levels;
      u=Math.floor(Math.max(0,Math.min(20*levels,commandTicks))/20+.5)/levels;
    } else if(degraded) u=0;
    points.push({k,y,measured,integral:integralTicks/(20*levels),u,valid,stale,degraded,saturated});
    y=.95*y+.1*u-.05*(mode==='load' && k>=150?.3:0);
  }
  const states=[...points.map(p=>p.y),y];
  const lastError=Math.max(...states.slice(251).map(x=>Math.abs(target-x)));
  const overshoot=Math.max(0,...states.map(x=>x-target));
  const invalid=points.filter(p=>!p.valid).length;
  const tracking=lastError<=.05, peakOk=overshoot<=.1, freshness=invalid===0;
  return {bits,mode,path,costMs,target,levels,points,final:y,
    iae:.1*points.reduce((sum,p)=>sum+Math.abs(target-p.y),0),lastError,overshoot,invalid,
    degraded:points.filter(p=>p.degraded).length,saturated:points.filter(p=>p.saturated).length,
    tracking,peakOk,freshness,accepted:tracking&&peakOk&&freshness};
}
