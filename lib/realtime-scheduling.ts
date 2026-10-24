export type SchedulingTask={period:number;cost:number};
export type SchedulingPolicy='RMS'|'EDF';
export type SchedulingJob={task:number;release:number;deadline:number;remaining:number;finish:number|null;miss:boolean};
export const schedulingCases=[
  {name:'默认三任务',tasks:[{period:5,cost:1},{period:10,cost:2},{period:20,cost:3}]},
  {name:'充分界未通过仍可调度',tasks:[{period:4,cost:2},{period:6,cost:2}]},
  {name:'RMS失期，EDF通过',tasks:[{period:5,cost:2},{period:7,cost:4}]},
  {name:'两者过载',tasks:[{period:4,cost:3},{period:6,cost:3}]}
];
export function responseTimes(tasks:SchedulingTask[]){
  return tasks.map((task,i)=>{
    const higher=tasks.map((v,j)=>({...v,id:j})).filter(v=>v.period<task.period||(v.period===task.period&&v.id<i));
    let r=task.cost;const iter=[r];let pass=false;
    for(let k=0;k<100;k++){
      const next=task.cost+higher.reduce((sum,v)=>sum+Math.ceil(r/v.period)*v.cost,0);iter.push(next);
      if(next===r){pass=next<=task.period;break;}
      r=next;if(r>task.period)break;
    }
    return {response:iter[iter.length-1],pass,iterations:iter};
  });
}
/** Single CPU, synchronous periodic jobs, implicit deadlines, zero overhead.
 * All releases and costs align to 0.5 ms. Tardy jobs remain in the queue. */
export function scheduleTasks(tasks:SchedulingTask[],policy:SchedulingPolicy='RMS',horizon=60){
  if(!['RMS','EDF'].includes(policy)||tasks.length<1||tasks.length>5||!Number.isFinite(horizon)||horizon<=0||horizon>100||!Number.isInteger(horizon*2)||tasks.some(t=>!Number.isFinite(t.period)||!Number.isFinite(t.cost)||t.period<=0||t.cost<=0||!Number.isInteger(t.period*2)||!Number.isInteger(t.cost*2)))throw new RangeError('Positive half-ms tasks and horizon <=100, 1..5 tasks required');
  const jobs:SchedulingJob[]=[],trace:number[]=[];const dt=.5;
  for(let tick=0;tick<=horizon*2;tick++){
    const t=tick*dt;
    for(const j of jobs)if(j.remaining>0&&j.deadline<=t)j.miss=true;
    if(t===horizon)break;
    tasks.forEach((task,i)=>{if(tick%(task.period*2)===0)jobs.push({task:i,release:t,deadline:t+task.period,remaining:task.cost,finish:null,miss:false});});
    const ready=jobs.filter(j=>j.remaining>0).sort((a,b)=>{
      const priority=policy==='RMS'?tasks[a.task].period-tasks[b.task].period:a.deadline-b.deadline;
      return priority||tasks[a.task].period-tasks[b.task].period||a.task-b.task||a.release-b.release;
    });
    const j=ready[0];trace.push(j?j.task:-1);
    if(j){j.remaining-=dt;if(j.remaining===0)j.finish=t+dt;}
  }
  const utilization=tasks.reduce((s,t)=>s+t.cost/t.period,0),bound=tasks.length*(2**(1/tasks.length)-1);
  const due=jobs.filter(j=>j.deadline<=horizon),misses=due.filter(j=>j.miss).length;
  const first=tasks.map((_,i)=>jobs.find(j=>j.task===i)!.finish);
  return {tasks,policy,horizon,utilization,bound,first,misses,due:due.length,pending:jobs.filter(j=>j.remaining>0).length,work:jobs.reduce((s,j)=>s+tasks[j.task].cost-j.remaining,0),trace,jobs,response:responseTimes(tasks)};
}
export function schedulingExperiment(caseId=0,c3=3,policy:SchedulingPolicy='RMS'){
  if(!Number.isInteger(caseId)||caseId<0||caseId>=schedulingCases.length||!Number.isInteger(c3)||c3<1||c3>14)throw new RangeError('case 0..3, integer C3 1..14 required');
  const tasks=schedulingCases[caseId].tasks.map(t=>({...t}));if(caseId===0)tasks[2].cost=c3;
  return scheduleTasks(tasks,policy);
}
