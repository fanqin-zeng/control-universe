import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const dir='.agent/semester-03/rl-01/';
const m={};new Function('exports',ts.transpileModule(fs.readFileSync('lib/rl-problem.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m);
const rows=[];
for(const p of [0,.2,.6,.84,.9,1])for(let gi=0;gi<=100;gi++)for(let ai=0;ai<=100;ai++){
 const gamma=gi/100,alpha=ai/100,result=m.rlProblem(p,gamma,alpha);
 for(const v of [result.direct,result.charge,result.expected])assert(v>=-4-1e-12&&v<=6+1e-12);
 assert(result.success>=0&&result.success<=1);assert(result.steps>=1&&result.steps<=2);
 rows.push({params:[p,gamma,alpha],result});
}
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(rows));
const independent=JSON.parse(execFileSync('python',[dir+'reference.py',dir+'actual-ts.json'],{encoding:'utf8'}));
const headings=await renderedHeadings(fs.readFileSync('content/rl-control/rl-basics.mdx','utf8'),'rl-control/rl-basics');
assert.equal(headings.h2.length,9);assert.equal(new Set(headings.ids).size,headings.ids.length);
const report={pass:true,independent,headings,defaults:m.rlProblem(),presets:[m.rlProblem(.6,.2),m.rlProblem(.9,.9),m.rlProblem(.84,.9)],axes:{x:[0,1],y:[-4,6]}};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2));
// Retain the compact report; full grid is deterministically reproduced by this script.
fs.unlinkSync(dir+'actual-ts.json');
console.log(JSON.stringify(report));
