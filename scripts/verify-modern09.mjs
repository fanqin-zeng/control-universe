import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash,randomUUID} from 'node:crypto';import assert from 'node:assert/strict';import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';import {renderedHeadings} from './rendered-headings.mjs';import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const dir='.agent/semester-03/modern-09/',source=readFileSync('content/modern/modern-case-study.mdx','utf8');
assert(![...source].some(c=>c.charCodeAt(0)<32&&!['\n','\r','\t'].includes(c)));
const actual={};new Function('exports',ts.transpileModule(readFileSync('lib/cart-pole-case-model.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(actual);
assert(readFileSync('components/wiki/cart-pole-noise-explorer.tsx','utf8').includes('useMemo(()=>simulateCartPoleNoise(w,v)'));
const cases=[];function run(w,v,seed){const d=actual.simulateCartPoleNoise(w,v,seed);assert.equal(d.points.length,301);for(const p of d.points)assert(Math.abs(p.x)<=2&&Math.abs(p.xhat)<=2&&Math.abs(p.theta)<=1&&Math.abs(p.thetaHat)<=1&&Math.abs(p.u)<=51,'axis clipping');cases.push({params:[w,v,seed],points:d.points.map(p=>[p.t,p.x,p.xhat,p.theta,p.thetaHat,p.u]),rmse:[d.rmseX,d.rmseTheta],peak:d.peakForce});}
for(let i=0;i<=10;i++)for(let j=0;j<=10;j++)run(i*.002,j*.002,7);run(.004,.01,23);run(.004,.01,101);assert.equal(cases.length,123);for(const p of [[-.1,0],[0,.1],[NaN,0]])assert.throws(()=>actual.simulateCartPoleNoise(...p));
const path='logs/modern09-actual.json';let reference;try{writeFileSync(path,JSON.stringify({design:actual.cartPoleDesign,cases}));reference=JSON.parse(execFileSync('python',[dir+'reference.py',path],{encoding:'utf8',maxBuffer:16*1024*1024}));}finally{try{unlinkSync(path);}catch{}}
function diff(a,b,tol=1e-8){if(Array.isArray(a)){assert.equal(a.length,b.length);return Math.max(...a.map((v,i)=>diff(v,b[i],tol)));}assert(Number.isFinite(a)&&Number.isFinite(b));const d=Math.abs(a-b);assert(d<tol,`${a} vs ${b}`);return d;}
const report={sourceHash:createHash('sha256').update(source.replace(/\r\n/g,'\n')).digest('hex'),component:{cases:123,uiPairs:121,nodes:301,integrationSteps:3001,maxError:reference.maxError,design:actual.cartPoleDesign,default:{...actual.simulateCartPoleNoise(),points:undefined}},notebooks:[],maxNotebookResponseError:0};
const text=out=>out.filter(o=>o.type==='stream'||o.type==='text').map(o=>o.text??'').join('');
for(const [i,nb]of extractNotebooks(source).entries()){
 const id='modern09-'+randomUUID();try{assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);const execute=async code=>requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code}),'source execution');await execute(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await execute(c.value));report.notebooks.push({title:nb.title,cells:nb.cells.length,pass:true,outputs:outputs.map(o=>o.type==='image'?{type:'image',length:o.data?.length}:o)});
 const query=async expr=>JSON.parse(text(await execute('import json\nprint(json.dumps('+expr+'))')));
 if(i===1)report.feedback=await query('feedback_records');
 if(i===3){const got=await query('noise_records');assert.equal(got.length,123);for(let k=0;k<got.length;k++)for(const f of ['params','points','rmse','peak'])report.maxNotebookResponseError=Math.max(report.maxNotebookResponseError,diff(got[k][f],reference.records[k][f]));}
 if(i===5){report.parameters=await query('parameter_records');report.nonlinear=await query('nonlinear_records');}
 }finally{await directHttp(8891,`/api/notebook/${id}`,'DELETE');}
}
const h=await renderedHeadings(source,'modern/modern-case-study'),old=JSON.parse(readFileSync(dir+'baseline-source.json','utf8'));assert.equal(h.h2.length,12);assert.equal(new Set(h.ids).size,h.ids.length);for(const id of old.ids)assert(h.ids.includes(id)||source.includes(`id="${id}"`),id);
report.oldIds=old.ids.length;report.pass=true;writeFileSync(dir+'headings.json',JSON.stringify(h,null,2)+'\n');writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,component:{...report.component,design:undefined},notebooks:report.notebooks.map(n=>({title:n.title,cells:n.cells,pass:n.pass}))}));
