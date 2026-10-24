import fs from 'node:fs';import ts from 'typescript';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const dir='.agent/semester-03/rl-02/',m={};
const impl=fs.readFileSync('lib/bellman-values.ts','utf8');new Function('exports',ts.transpileModule(impl,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m);
const rows=[];for(const optimal of [false,true])for(const p of [.4,.6,.8,12/19])for(const g of [.5,.7,.9])for(const a of optimal?[.25]:[0,.25,.5,1])for(const n of [0,1,2,3,20,80])rows.push({params:[p,g,a,n,optimal],result:m.bellmanExperiment(p,g,a,n,optimal)});
for(const [p,g,a,n,opt]of [[0,0,.25,3,false],[1,0,1,3,true],[0,.95,0,20,false],[1,.95,1,20,true]])rows.push({params:[p,g,a,n,opt],result:m.bellmanExperiment(p,g,a,n,opt)});
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(rows));const independent=JSON.parse(execFileSync('python',[dir+'reference.py',dir+'actual-ts.json'],{encoding:'utf8'}));
let min=Infinity,max=-Infinity,configs=0;
for(let pi=40;pi<=80;pi++)for(let gi=50;gi<=90;gi++)for(let ai=0;ai<=20;ai++)for(const opt of [false,true]){
 const r=m.bellmanExperiment(pi/100,gi/100,ai/20,80,opt);configs++;
 for(const v of [...r.history,r.exact,r.q,r.exactQ])for(const x of v){min=Math.min(min,x);max=Math.max(max,x);assert(x>=-5&&x<=45);}
 assert(r.error<=r.bound+1e-9);
}
const source=fs.readFileSync('content/rl-control/dynamic-programming.mdx','utf8'),headings=await renderedHeadings(source,'rl-control/dynamic-programming');assert.equal(headings.h2.length,10);assert.equal(new Set(headings.ids).size,headings.ids.length);
const report={pass:true,independent,axis:{configs,min,max,x:[0,80],y:[-5,45]},defaults:m.bellmanExperiment(),optimal20:m.bellmanExperiment(.6,.9,.25,20,true),headings,implementationHash:createHash('sha256').update(impl).digest('hex')};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2));fs.unlinkSync(dir+'actual-ts.json');console.log(JSON.stringify({pass:true,independent,axis:report.axis,defaults:{v:report.defaults.v,exact:report.defaults.exact,residual:report.defaults.residual,bound:report.defaults.bound}}));
