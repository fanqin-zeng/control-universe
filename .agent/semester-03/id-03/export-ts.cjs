const fs=require('node:fs'),ts=require('typescript'),assert=require('node:assert/strict');
const compiled=ts.transpileModule(fs.readFileSync('lib/rls-identification.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const api={};new Function('exports',compiled)(api);
const cases=[];let values=0;
for(let l=90;l<=100;l++)for(let d=0;d<=12;d+=2)for(const scenario of ['steady','jump','quiet']){
 const result=api.rlsIdentification(l/100,d/100,scenario);
 assert.equal(result.rows.length,33);
 for(const r of result.rows){assert(r.estimate>=0&&r.estimate<=.7);assert(r.informationInverse>=.01&&r.informationInverse<=100);}
 cases.push({lambda:l/100,disturbance:d/100,scenario,rows:result.rows.map(r=>[r.truth,r.estimate,r.informationInverse,r.input,r.level,r.residual])});values+=result.rows.length*6;
}
for(const args of [[.89,0,'steady'],[1.01,0,'steady'],[1,-.01,'steady'],[1,.13,'steady'],[NaN,0,'steady'],[1,0,'other']])assert.throws(()=>api.rlsIdentification(...args),RangeError);
const defaults=api.rlsIdentification();assert(Math.abs(defaults.final.estimate-.192)<1e-12);assert(Math.abs(defaults.final.informationInverse-.04)<1e-12);
fs.writeFileSync('.agent/semester-03/id-03/actual-ts.json',JSON.stringify({cases,values,defaults}));
console.log(JSON.stringify({pass:true,cases:cases.length,values,defaultB:defaults.final.estimate,defaultP:defaults.final.informationInverse,axesWithinBounds:true,invalidInputs:6}));
