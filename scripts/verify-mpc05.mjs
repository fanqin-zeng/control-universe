import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {renderedHeadings} from './rendered-headings.mjs';
const dir='.agent/semester-03/mpc-05/',key='mpc/mpc-stability';
const notebooks=JSON.parse(fs.readFileSync(dir+'extracted.json','utf8')).notebooks;
assert.equal(notebooks.length,2);assert(notebooks.every(n=>n.setupCode&&n.cells.length===2));
const heads=await renderedHeadings(fs.readFileSync('content/'+key+'.mdx','utf8'),key);assert.equal(heads.h2.length,10);assert.equal(new Set(heads.ids).size,heads.ids.length);fs.writeFileSync(dir+'headings.json',JSON.stringify(heads,null,2));
const exports={};new Function('exports',ts.transpileModule(fs.readFileSync('lib/mpc-stability.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(exports);
const cases=[];for(let i=0;i<=100;i++)for(let j=2;j<=6;j++)for(let k=-3;k<=3;k++){const x=-2.5+i*.05,radius=j*.25,w=k*.25;cases.push({x,radius,w,result:exports.stabilityExperiment(x,radius,w)});}
for(const a of [[NaN,1],[4,1],[0,2]])assert.throws(()=>exports.stabilityPlan(...a),RangeError);
for(const w of [NaN,1])assert.throws(()=>exports.stabilityExperiment(2,1,w),RangeError);
assert.equal(exports.stabilityPlan(2.5).feasible,false);assert.equal(exports.stabilityExperiment(2.2,1,.75).next.feasible,false);
const boundary=exports.stabilityPlan(20/9);assert(boundary.feasible);cases.push({x:20/9,radius:1,w:0,result:exports.stabilityExperiment(20/9,1,0)});
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(cases));
const out=execFileSync('python',[dir+'reference.py'],{encoding:'utf8',env:{...process.env,MPLBACKEND:'Agg',PYTHONIOENCODING:'utf-8'}});fs.writeFileSync(dir+'reconciliation.log',out);console.log(out);
