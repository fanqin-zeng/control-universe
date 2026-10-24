import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const dir='.agent/semester-03/est-03/',mod={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/kalman-noise.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(mod);
const rows=[];
for(const q of [.01,.1,1,10,100])for(const r of [.25,1,4]){
 const result=mod.kalmanNoise(q,r);
 for(const [t,p]of result.curve)assert(t>=0&&t<=5&&p>=0&&p<=10);
 rows.push({q,r,...result});
}
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(rows));
const reference=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8',env:{...process.env,PYTHONIOENCODING:'utf-8'}}));
const headings=await renderedHeadings(fs.readFileSync('content/estimation/kalman-filter.mdx','utf8'),'estimation/kalman-filter');
assert.equal(headings.h2.length,12);assert.equal(headings.ids.length,new Set(headings.ids).size);
const report={pass:true,configurations:15,curvePoints:1515,reference,headings};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
