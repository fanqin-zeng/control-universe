import fs from 'node:fs';import ts from 'typescript';import assert from 'node:assert/strict';import {execFileSync}from'node:child_process';
const dir='.agent/semester-03/est-05/',cache={};
function load(name){if(cache[name])return cache[name];const mod={};cache[name]=mod;new Function('exports','require',ts.transpileModule(fs.readFileSync('lib/'+name+'.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(mod,p=>load(p.replace('./','')));return mod;}
const mod=load('unscented-kalman'),rows=[];let maximumDensity=0;
for(const kind of ['linear','square'])for(const mu of [-2,0,2])for(const variance of [.25,1])for(const noise of [.25,1,4])for(const observation of [4,5]){
 const result=mod.ukfPosterior(mu,variance,noise,observation,kind);
 for(const p of result.curve){assert(p.x>=-6&&p.x<=6);for(const v of [p.approximate,p.ekf,p.reference]){assert(Number.isFinite(v)&&v>=0&&v<=8);maximumDensity=Math.max(maximumDensity,v);}}
 rows.push({kind,mu,priorVariance:variance,noise,observation,...result});
}
const other={prediction:mod.unscentedTransform(2,.25,x=>x+.1*x*x),cube:mod.unscentedTransform(0,1,x=>x**3),smallAlpha:mod.unscentedTransform(0,1,x=>x**3,.001),invalid:0};
for(const args of [[0,0,x=>x],[0,-1,x=>x],[0,1,x=>x,0],[0,1,x=>x,1,2,-1],[NaN,1,x=>x]]){assert.throws(()=>mod.unscentedTransform(...args));other.invalid++;}
assert.throws(()=>mod.ukfPosterior(2,.25,-1,5,'square'));other.invalid++;
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify({rows,other}));
const reference=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8',env:{...process.env,PYTHONIOENCODING:'utf-8'}}));
const report={pass:true,configurations:rows.length,curvePoints:rows.length*241,maximumDensity,reference,default:rows.find(r=>r.kind==='square'&&r.mu===2&&r.priorVariance===.25&&r.noise===1&&r.observation===5),other};
const {renderedHeadings}=await import('../../../scripts/rendered-headings.mjs');report.headings=await renderedHeadings(fs.readFileSync('content/estimation/unscented-kalman-filter.mdx','utf8'),'estimation/unscented-kalman-filter');assert.equal(report.headings.h2.length,10);
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2));console.log(JSON.stringify({pass:true,configurations:rows.length,curvePoints:report.curvePoints,maximumDensity,reference,default:{...report.default,curve:undefined},other}));
