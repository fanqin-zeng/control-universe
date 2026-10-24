import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const dir='.agent/semester-03/est-01/';
const mod={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/estimation-framework.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(mod);
const records=[];
for(const p of [1,4,9])for(const r of [0,1,4,9])for(let i=0;i<=100;i++){
 const k=i/100,result=mod.estimationCorrection(p,r,k);
 assert(result.risk>=0&&result.risk<=10);records.push({p,r,k,result});
}
for(const [p,r] of [[4,1],[1,4],[4,4],[4,0]])records.push({p,r,k:p/(p+r),result:mod.estimationCorrection(p,r,p/(p+r))});
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(records));
const reference=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8'}).trim().split('\n').at(-1));
const headings=await renderedHeadings(fs.readFileSync('content/estimation/estimation-problem.mdx','utf8'),'estimation/estimation-problem');
assert.equal(headings.h2.length,9);assert.equal(headings.ids.length,new Set(headings.ids).size);
const report={pass:true,configs:records.length,axis:{x:[0,1],y:[0,10]},reference,headings};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
