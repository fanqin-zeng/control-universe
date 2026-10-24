import fixture from "./estimation-case-data.json";
export type CaseScenario = "clean" | "dropout" | "spike";
type Event = { sensor: number; reading: number; innovation: number; S: number; nis: number; accepted: boolean };
type Step = { step: number; truth: number[]; mean: number[]; covariance: number[]; error: number; sigma: number; events: Event[]; predictionOnly: boolean };
const data = fixture as Record<string, { initial: number[]; draws: number[][] }>;
function run(scenario: CaseScenario, qscale: number, gate: boolean, seed: number, single: boolean) {
  const input=data[String(seed)];let tp=input.initial[0],tv=1+input.initial[1],p=0,v=1,a=1,b=0,c=1;const history:Step[]=[];
  input.draws.forEach(([na,n1,n2],index)=>{
    const step=index+1;tp+=tv+.1*na;tv+=.2*na;p+=v;const nextA=a+2*b+c+.01*qscale; b+=c+.02*qscale;c+=.04*qscale;a=nextA;
    const readings=[tp+n1+(scenario==="spike"&&step===6?8:0),tp+2*n2];
    const available=[!(scenario==="dropout"&&step>=5&&step<=8),!single&&!(scenario==="dropout"&&step>=6&&step<=8)];const events:Event[]=[];
    for(let sensor=0;sensor<2;sensor++){
      if(!available[sensor])continue;const r=sensor===0?1:4,innovation=readings[sensor]-p,S=a+r,nis=innovation*innovation/S,accepted=!gate||nis<=9;
      events.push({sensor:sensor+1,reading:readings[sensor],innovation,S,nis,accepted});
      if(accepted){const k0=a/S,k1=b/S,oldA=a,oldB=b,oldC=c;p+=k0*innovation;v+=k1*innovation;a=(1-k0)**2*oldA+k0*k0*r;b=(1-k0)*(oldB-k1*oldA)+k0*k1*r;c=oldC-2*k1*oldB+k1*k1*oldA+k1*k1*r;}
    }
    history.push({step,truth:[tp,tv],mean:[p,v],covariance:[a,b,c],error:p-tp,sigma:Math.sqrt(a),events,predictionOnly:!events.some(e=>e.accepted)});
  });
  return {history,rmse:Math.sqrt(history.reduce((sum,h)=>sum+h.error*h.error,0)/12),coverage:history.filter(h=>Math.abs(h.error)<=2*h.sigma).length,rejected:history.reduce((sum,h)=>sum+h.events.filter(e=>!e.accepted).length,0),predictionOnly:history.filter(h=>h.predictionOnly).length,peakNis:Math.max(...history.flatMap(h=>h.events.map(e=>e.nis)))};
}
/** Same fixed timestamp, independent position measurements, one common prediction per step. */
export function estimationCase(scenario:CaseScenario="clean",qscale=1,gate=false,seed=7){
  if(!["clean","dropout","spike"].includes(scenario)||![.25,1,4].includes(qscale)||typeof gate!=="boolean"||!Number.isInteger(seed)||!Object.hasOwn(data,String(seed)))throw new Error("Invalid estimation case contract");
  const result=run(scenario,qscale,gate,seed,false),single=run(scenario,qscale,gate,seed,true);
  return {...result,singleHistory:single.history,singleRmse:single.rmse,scenario,qscale,gate,seed};
}
