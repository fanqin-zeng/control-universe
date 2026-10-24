import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const dir='.agent/semester-03/est-02/';
const mod={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/statistical-estimation.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(mod);
const rows=[];let min=Infinity,max=-Infinity;
for(const r1 of [.25,1,4,9,16])for(const r2 of [.25,1,4,9,16])for(const p of [1,4,16]){
 const result=mod.statisticalEstimate(r1,r2,p);
 const dataMin=mod.statisticalObjectives(result.weighted,r1,r2,p).data;
 const posteriorMin=mod.statisticalObjectives(result.posterior,r1,r2,p).posterior;
 const points=[];
 for(let i=0;i<=120;i++){
  const theta=16+i/10,raw=mod.statisticalObjectives(theta,r1,r2,p);
  const data=Math.max(0,raw.data-dataMin),posterior=Math.max(0,raw.posterior-posteriorMin);
  for(const v of [data,posterior]){min=Math.min(min,v);max=Math.max(max,v);assert(v>=0&&v<=220);}
  points.push({theta,data,posterior});
 }
 rows.push({r1,r2,p,result,dataMin,posteriorMin,points});
}
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(rows));
const reference=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8',env:{...process.env,PYTHONIOENCODING:'utf-8'}}));
const headings=await renderedHeadings(fs.readFileSync('content/estimation/least-squares-ml.mdx','utf8'),'estimation/least-squares-ml');
assert.equal(headings.h2.length,10);assert.equal(headings.ids.length,new Set(headings.ids).size);
const report={pass:true,configurations:rows.length,axis:{x:[16,28],y:[0,220],measuredMin:min,measuredMax:max,points:rows.length*121},reference,headings};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
