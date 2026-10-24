const fs=require('node:fs'),ts=require('typescript'),assert=require('node:assert/strict');
const compiled=ts.transpileModule(fs.readFileSync('lib/closed-loop-identification.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const api={};new Function('exports',compiled)(api);const cases=[],curves=[];
for(const feedback of [0,.5,.8])for(const amplitude of [0,.5,1])for(let i=0;i<=80;i++)for(const instrument of ['reference','input']){
 const color=i/100,result=api.closedLoopMoments(feedback,color,amplitude,instrument);
 for(const v of [result.lsTarget,result.ivTarget])assert(v===null||Number.isFinite(v)&&v>=-1.5&&v<=1.5);
 for(const v of [result.covarianceUV,result.momentZV,result.momentZU])assert(v>=-1&&v<=3);
 cases.push({feedback,color,amplitude,instrument,result});
}
for(const f of [0,.5,.8])for(const a of [0,.5,1])for(const z of ['reference','input'])curves.push({feedback:f,amplitude:a,instrument:z,rows:api.closedLoopCurve(f,a,z)});
const invalid=[[.1,.5,.5,'reference'],[.5,-.1,.5,'reference'],[.5,.81,.5,'reference'],[.5,NaN,.5,'reference'],[.5,.5,.1,'reference'],[.5,.5,.5,'bad']];for(const args of invalid)assert.throws(()=>api.closedLoopMoments(...args),RangeError);
fs.writeFileSync('.agent/semester-03/id-05/actual-ts.json',JSON.stringify({cases,curves,defaults:api.closedLoopMoments()}));console.log(JSON.stringify({pass:true,cases:cases.length,curveConfigurations:curves.length,invalidInputs:invalid.length,axesWithinBounds:true,defaults:api.closedLoopMoments()}));
