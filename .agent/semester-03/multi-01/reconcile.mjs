import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const dir='.agent/semester-03/multi-01/';
const exports={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/multi-agent-overview.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(exports);
const records=[];let min=Infinity,max=-Infinity;
for(const topology of ['chain','split','directed'])for(const alpha of [...Array.from({length:14},(_,i)=>(i+1)/20),2/3])for(const selected of [0,1,20]){
 const result=exports.multiAgentExperiment(topology,alpha,selected);records.push({topology,alpha,selected,result});
 for(const row of result.states)for(const v of row){min=Math.min(min,v);max=Math.max(max,v);assert(v>=-6&&v<=9);}
}
for(const args of [['invalid',.25,1],['chain',NaN,1],['chain',0,1],['chain',.71,1],['chain',.25,21]])assert.throws(()=>exports.multiAgentExperiment(...args));
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify(records));
const independent=JSON.parse(execFileSync('python',[dir+'reference.py',dir+'actual-ts.json'],{encoding:'utf8'}));
const headings=await renderedHeadings(fs.readFileSync('content/multi-agent/multi-agent-overview.mdx','utf8'),'multi-agent/multi-agent-overview');
assert.equal(headings.h2.length,8);assert.equal(new Set(headings.ids).size,headings.ids.length);
const report={pass:true,independent,configs:records.length,axis:{min,max,range:[-6,9]},headings,defaults:exports.multiAgentExperiment('chain',.25,1)};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
