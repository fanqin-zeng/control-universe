const fs=require('node:fs'),ts=require('typescript'),assert=require('node:assert/strict');
const compiled=ts.transpileModule(fs.readFileSync('lib/persistent-excitation.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const api={};new Function('exports',compiled)(api);const cases=[];
for(let a=0;a<=10;a++)for(const window of [4,8,12,16])for(let l=90;l<=100;l+=2)for(const mode of ['periodic','constant','alternating','burst']){
 const result=api.excitationExperiment(a/10,window,l/100,mode);
 for(const r of result.rows){assert(Math.abs(r.first)<=.7&&Math.abs(r.second)<=.7);assert(r.minEigen===null||r.minEigen>=0&&r.minEigen<=8);}
 cases.push({amplitude:a/10,window,forgetting:l/100,mode,minimum:result.observedMinimum,rows:result.rows.map(r=>[r.first,r.second,r.p11,r.p12,r.p22,r.minEigen,r.input])});
}
const invalid=[[NaN,8,1,'periodic'],[-.1,8,1,'periodic'],[1.1,8,1,'periodic'],[1,3,1,'periodic'],[1,8,.89,'periodic'],[1,8,1.01,'periodic'],[1,8,1,'missing']];for(const args of invalid)assert.throws(()=>api.excitationExperiment(...args),RangeError);
fs.writeFileSync('.agent/semester-03/id-04/actual-ts.json',JSON.stringify({cases,defaults:api.excitationExperiment()}));console.log(JSON.stringify({pass:true,configurations:cases.length,invalidInputs:invalid.length,fixedAxes:true,default:api.excitationExperiment().rows.at(-1)}));
