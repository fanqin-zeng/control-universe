import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {execFileSync} from 'node:child_process';
import {renderedHeadings} from './rendered-headings.mjs';
const dir='.agent/semester-03/mpc-06/',key='mpc/generalized-predictive-control';
const n=JSON.parse(fs.readFileSync(dir+'extracted.json','utf8')).notebooks;
assert.equal(n.length,3);assert(n.every(nb=>nb.setupCode&&nb.cells.length===2));
const source=fs.readFileSync('content/'+key+'.mdx','utf8'),heads=await renderedHeadings(source,key),old=JSON.parse(fs.readFileSync(dir+'headings-before.json','utf8'));
assert.deepEqual(heads.headings,old.headings);assert.equal(new Set(heads.ids).size,heads.ids.length);assert.deepEqual(heads.ids,old.ids);
fs.writeFileSync(dir+'headings.json',JSON.stringify(heads,null,2));
const exports={};new Function('exports',ts.transpileModule(fs.readFileSync('lib/gpc.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(exports);
const cases=[];for(const N1 of [1,3,5])for(const N2 of [5,10,15,30])for(const Nu of [1,3,5,10])for(const lambda of [.001,.01,.1,1,10])for(const delay of [1,3,6])for(const history of [false,true]){
 const options={N1,N2,Nu,lambda,delay,...(history?{y:.4,previousY:.35,pastInputs:[.2,.15,.1,.05,0,-.05]}:{})};cases.push({options,result:exports.gpcPlan(options)});
}
for(const options of [{lambda:0},{lambda:0,Nu:10},{lambda:0,delay:6,N2:5},{lambda:0,N1:5,delay:1,Nu:3}])cases.push({options,result:exports.gpcPlan(options)});
for(const options of [{N2:NaN},{Nu:0},{lambda:-1},{delay:0},{pastInputs:[1]},{a:Infinity}])assert.throws(()=>exports.gpcPlan(options),RangeError);
const polys=[[1,-1.2,.4],[1,-1.9048,.9048],[1,-.8],[1,-1.8,.8]].map(a=>({a,result:exports.diophantine(a,8)}));
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify({cases,polys}));
const out=execFileSync('python',[dir+'reference.py'],{encoding:'utf8',env:{...process.env,MPLBACKEND:'Agg',PYTHONIOENCODING:'utf-8'}});fs.writeFileSync(dir+'reconciliation.log',out);console.log(out);
