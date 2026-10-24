/** Deterministic evaluation laboratory. Scores are not calibrated probabilities. */
export type EvaluationScenario='nominal'|'drift'|'tie';
export type EvaluationPolicy='validation'|'0.3'|'0.5'|'0.7';
export interface EvaluationConfig {cfn:number;scenario:EvaluationScenario;policy:EvaluationPolicy}
export const EVALUATION_DEFAULT:EvaluationConfig={cfn:5,scenario:'nominal',policy:'validation'};
export const thresholds=[.7,.5,.3];
export interface EvaluationRow {id:string;group:string;time:number;x:number;y:number}
export function fitEvaluation(){const rows=[0,.2,.8,1].map((x,i)=>({id:'T'+i,group:'train-'+Math.floor(i/2),time:i,x,y:+(i>=2)}));const means=[0,1].map(y=>{const a=rows.filter(r=>r.y===y);return a.reduce((s,r)=>s+r.x,0)/a.length;});return {negative:means[0],positive:means[1],rows};}
export function evaluationRecords(split='validation',scenario:EvaluationScenario='nominal'):EvaluationRow[]{
 let scores=split==='validation'?[.6,.4,.8,.5,.3,.2,.1,0]:[.9,.4,.8,.7,.6,.3,.25,.2,.18,.16,.14,.12,.1,.08,.06,.04,.03,.02,.01,0];
 if(split!=='validation'&&scenario!=='nominal'){scores[0]=.2;scores[1]=.1;if(scenario==='tie')scores=scores.map(v=>Math.min(v,.29));}
 return scores.map((v,i)=>({id:split+'-'+i,group:split+'-'+Math.floor(i/(split==='validation'?4:5)),time:(split==='validation'?4:12)+i,x:.1+.8*v,y:+(i<2)}));
}
export function evaluationScore(x:number,model:ReturnType<typeof fitEvaluation>){return Math.min(1,Math.max(0,(x-model.negative)/(model.positive-model.negative)));}
export function evaluationMetrics(rows:EvaluationRow[],model:ReturnType<typeof fitEvaluation>,threshold:number|null,cfn=5){
 if(!rows.length)throw new Error('Metrics require a nonempty evaluation set');
 const predictions=rows.map(r=>threshold===null?0:+(evaluationScore(r.x,model)>=threshold-1e-12));
 const tp=rows.filter((r,i)=>r.y===1&&predictions[i]===1).length,fp=rows.filter((r,i)=>r.y===0&&predictions[i]===1).length,fn=rows.filter((r,i)=>r.y===1&&predictions[i]===0).length,tn=rows.length-tp-fp-fn;
 const ratio=(a:number,b:number)=>b?a/b:null,recall=ratio(tp,tp+fn),specificity=ratio(tn,tn+fp);
 const losses=rows.map((r,i)=>r.y===1&&predictions[i]===0?cfn:+(r.y===0&&predictions[i]===1));const cost=losses.reduce((s,v)=>s+v,0);
 return {n:rows.length,tp,fp,fn,tn,accuracy:(tp+tn)/rows.length,precision:ratio(tp,tp+fp),recall,specificity,f1:ratio(2*tp,2*tp+fp+fn),balancedAccuracy:recall===null||specificity===null?null:(recall+specificity)/2,cost,risk:cost/rows.length,predictions,losses};
}
export function evaluationBootstrap(differences:number[]){
 if(differences.length!==4||!differences.every(Number.isFinite))throw new Error("This exact bootstrap laboratory requires four finite batch differences");
 const distribution:number[]=[];function append(sum:number,depth:number){if(depth===differences.length){distribution.push(sum/differences.length);return;}for(const v of differences)append(sum+v,depth+1);}append(0,0);distribution.sort((a,b)=>a-b);
 return {count:distribution.length,mean:differences.reduce((a,b)=>a+b,0)/differences.length,lower:distribution[Math.ceil(.025*distribution.length)-1],upper:distribution[Math.ceil(.975*distribution.length)-1],distribution};
}
export function evaluationStudy(c:EvaluationConfig=EVALUATION_DEFAULT){
 if(![1,5,10].includes(c.cfn)||!['nominal','drift','tie'].includes(c.scenario)||!['validation','0.3','0.5','0.7'].includes(c.policy))throw new Error('Invalid evaluation configuration');
 const model=fitEvaluation(),val=evaluationRecords(),candidates=thresholds.map(threshold=>({threshold,metrics:evaluationMetrics(val,model,threshold,c.cfn)}));
 const selected=candidates.reduce((a,b)=>b.metrics.cost<a.metrics.cost?b:a),threshold=c.policy==='validation'?selected.threshold:+c.policy;
 const test=evaluationMetrics(evaluationRecords('test',c.scenario),model,threshold,c.cfn),baseline=evaluationMetrics(evaluationRecords('test',c.scenario),model,null,c.cfn);
 const batches=Array.from({length:4},(_,k)=>test.losses.slice(k*5,k*5+5).reduce((s,v,i)=>s+v-baseline.losses[k*5+i],0)/5);
 return {model,candidates,selectedThreshold:selected.threshold,usedThreshold:threshold,validationBaseline:evaluationMetrics(val,model,null,c.cfn),test,baseline,batches,bootstrap:evaluationBootstrap(batches)};
}
