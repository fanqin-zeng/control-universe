import fs from 'node:fs';import ts from 'typescript';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {request} from 'node:http';import {randomUUID,createHash} from 'node:crypto';import {extractNotebooks} from '../../../scripts/lib-mdx.mjs';
const dir='.agent/semester-03/ml-07/',m={};new Function('exports',ts.transpileModule(fs.readFileSync('lib/representation-basics.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m);
const data={runs:[],extraPca:[],contrastive:[],notebooks:[]};let plotted=0;
for(const a of m.amplitudes)for(const b of m.signals)for(const standardized of [false,true]){
 const config={a,b,standardized},result=m.study(a,b,standardized);data.runs.push({config,result,audit:m.audit(a,b,standardized)});
 const rows=['train','validation','test'].flatMap(split=>m.records(a,b,split));assert.equal(new Set(rows.map(r=>r.id)).size,12);assert.equal(new Set(rows.map(r=>JSON.stringify(r.x))).size,12);
 assert.equal(result.selected.angle,90);
 for(const row of result.points)for(const v of row.x){assert(v>=-4.5&&v<=4.5);plotted++;}
 for(const row of [result.pca,...result.candidates]){assert(Math.abs(row.w.reduce((s,v)=>s+v*v,0)-1)<1e-12);for(const v of [...row.projected.flat(),...row.w.map(v=>-4*v),...row.w.map(v=>4*v)]){assert(v>=-4.5&&v<=4.5);plotted++;}}
}
const sourcePoints=m.records(2,.5,'train').map(r=>r.x);
for(const deg of [15,30,60]){const t=deg*Math.PI/180,points=sourcePoints.map(([x,y])=>[x*Math.cos(t)-y*Math.sin(t),x*Math.sin(t)+y*Math.cos(t)]);data.extraPca.push({points,result:m.fitPca(points)});}
for(const points of [sourcePoints.map(([x,y])=>[x+3,y-2]),Array.from({length:4},()=>[0,0])])data.extraPca.push({points,result:m.fitPca(points)});
for(const a of m.amplitudes)for(const b of m.signals)for(const temperature of [.1,.5,1])data.contrastive.push({config:{a,b,temperature},result:m.contrastive(a,b,temperature)});
assert.throws(()=>m.study(0,.5,false),RangeError);assert.throws(()=>m.fitPca([[1],[2]]),RangeError);assert.throws(()=>m.unit(99),RangeError);assert.throws(()=>m.contrastive(2,.5,0),RangeError);
assert.deepEqual(m.fitPreprocess(Array.from({length:4},(_,i)=>({id:String(i),x:[0,0],y:1})),true),{mean:[0,0],scale:[1,1],constant:[true,true]});
const source=fs.readFileSync('content/machine-learning/representation-learning.mdx','utf8').replace(/\r\n/g,'\n'),notebooks=extractNotebooks(source);assert.equal(notebooks.length,2);
for(const n of notebooks){const output=execFileSync('python',['-c',n.setup.value+'\n'+n.cells.map(c=>c.value).join('\n')],{encoding:'utf8'});data.notebooks.push(output.trim().split(/\r?\n/).map(s=>JSON.parse(s)));}
fs.writeFileSync(dir+'ts-cases.json',JSON.stringify(data));const ref=JSON.parse(execFileSync('python',[dir+'reference.py',dir+'ts-cases.json'],{encoding:'utf8'}));fs.writeFileSync(dir+'reference.json',JSON.stringify({...ref,runs:data.runs.length,plotted},null,2));fs.writeFileSync(dir+'raw-python.json',JSON.stringify(data.notebooks,null,2));
function http(path,method,body){return new Promise((resolve,reject)=>{const raw=body?JSON.stringify(body):null;const req=request({hostname:'127.0.0.1',port:8992,path,method,headers:raw?{'Content-Type':'application/json','Content-Length':Buffer.byteLength(raw)}:{}},res=>{let s='';res.on('data',v=>s+=v);res.on('end',()=>{try{assert.equal(res.statusCode,200,s);resolve(JSON.parse(s));}catch(e){reject(e);}})});req.on('error',reject);req.setTimeout(60000,()=>req.destroy(Error('timeout')));if(raw)req.write(raw);req.end();});}
const native=[];
for(const[i,n]of notebooks.entries()){const id='ml07-'+randomUUID();try{await http('/api/notebook','POST',{notebook_id:id,setup_code:''});const outputs=[];let combined='';for(const code of [n.setup.value,...n.cells.map(c=>c.value)]){const r=await http('/api/notebook/'+id+'/execute','POST',{code});assert(!r.outputs.some(o=>o.type==='error'));outputs.push(r);combined+=r.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('');}const values=combined.trim().split(/\r?\n/).map(s=>JSON.parse(s));assert.deepEqual(values,data.notebooks[i]);native.push({title:n.title,outputs,values});}finally{await http('/api/notebook/'+id,'DELETE');}}
fs.writeFileSync(dir+'native.json',JSON.stringify({pass:true,sourceHash:createHash('sha256').update(source).digest('hex'),notebooks:native},null,2));console.log(JSON.stringify({pass:true,runs:data.runs.length,quantities:ref.quantities,maxError:ref.max_error,plotted}));
