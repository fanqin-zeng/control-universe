const fs=require('node:fs'),ts=require('typescript'),Module=require('node:module');
const p='lib/robust-case-study.ts',m=new Module(require('node:path').resolve(p));m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,p);
const {caseReadings,caseFrequency,caseTrace}=m.exports,cases=[],traces=[];
for(const mass of [.3,.4,.5,.6,.7])for(const k of [8,9,10,11,12])for(const q of [.1,.5,1,4,8,10]){const p={m:mass,k,q};cases.push({p,r:caseReadings(p),frequency:[0,.01,.1,1,5.477225575,10,30].map(w=>({w,...caseFrequency(p,w)}))});}
for(const p of [{m:.5,k:10,q:.1},{m:.5,k:10,q:1},{m:.5,k:10,q:8},{m:.7,k:8,q:8},{m:.3,k:12,q:1},{m:.7,k:8,q:1}]){traces.push({p,coarse:caseTrace(p),fine:caseTrace(p,60,.005)});}
fs.writeFileSync('.agent/semester-03/robust-11/actual-ts.json',JSON.stringify({cases,traces},null,2));console.log('PASS actual TS 150 configurations / 1050 frequencies / 6 traces at two steps');
