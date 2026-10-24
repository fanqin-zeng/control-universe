import fs from 'node:fs';import ts from 'typescript';import assert from 'node:assert/strict';import {execFileSync}from'node:child_process';
const dir='.agent/semester-03/est-04/',mod={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/extended-kalman.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(mod);
const rows=[];let maximumDensity=0;
for(const kind of ['linear','square'])for(const mu of [-2,0,2])for(const variance of [.25,1])for(const noise of [.25,1,4])for(const observation of [4,5]){
 const result=mod.ekfPosterior(mu,variance,noise,observation,kind);
 for(const p of result.curve){assert(p.x>=-6&&p.x<=6);for(const v of [p.approximate,p.reference]){assert(Number.isFinite(v)&&v>=0&&v<=8);maximumDensity=Math.max(maximumDensity,v);}}
 rows.push({kind,mu,priorVariance:variance,noise,observation,...result});
}
const other={prediction:mod.nonlinearPrediction(2,.25,.04),radar:mod.radarJacobian(3,4),singular:mod.radarJacobian(0,0),wrap:[-358,358,180,-180,0].map(d=>({degrees:d,value:mod.wrapInnovation(d*Math.PI/180)}))};
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify({rows,other}));
const reference=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8',env:{...process.env,PYTHONIOENCODING:'utf-8'}}));
const report={pass:true,configurations:rows.length,curvePoints:rows.length*241,maximumDensity,reference,default:rows.find(r=>r.kind==='square'&&r.mu===2&&r.priorVariance===.25&&r.noise===1&&r.observation===5),other};
if(fs.existsSync('content/estimation/extended-kalman-filter.mdx')){
 const {renderedHeadings}=await import('../../../scripts/rendered-headings.mjs');report.headings=await renderedHeadings(fs.readFileSync('content/estimation/extended-kalman-filter.mdx','utf8'),'estimation/extended-kalman-filter');assert.equal(report.headings.h2.length,10);
}
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2));console.log(JSON.stringify({pass:true,configurations:rows.length,curvePoints:report.curvePoints,maximumDensity,reference,default:{...report.default,curve:undefined},other}));
