import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const dir='.agent/semester-03/ml-01/';
const m={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/learning-generalization.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m);
const records=[];
let min=Infinity,max=-Infinity;
for(const degree of [0,1,4])for(let ai=0;ai<=8;ai++)for(let di=0;di<=10;di++){
  const noise=ai/20,shift=di/10,result=m.experiment(degree,noise,shift);
  records.push({degree,noise,shift,result});
  for(let i=0;i<=100;i++){
    const x=-1+i/50;
    for(const y of [m.predict(result.c,x),m.truth(x),m.truth(x,shift)]){min=Math.min(min,y);max=Math.max(max,y);assert(y>=-2&&y<=5);}
  }
}
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(records,null,2));
const independent=JSON.parse(execFileSync('python',[dir+'reference.py',dir+'actual-ts.json'],{encoding:'utf8'}));
const source=fs.readFileSync('content/machine-learning/learning-problem.mdx','utf8');
const headings=await renderedHeadings(source,'machine-learning/learning-problem');
assert.equal(headings.h2.length,8);assert.equal(new Set(headings.ids).size,headings.ids.length);
const report={pass:true,independent,axis:{min,max,configs:records.length,points:records.length*101*3},headings};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
