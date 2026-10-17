/** MATH-02 actual TS versus independent Python; raw page notebook execution. */
import {readFileSync,writeFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {randomUUID,createHash} from 'node:crypto';import assert from 'node:assert/strict';import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
function load(path,name){const source=readFileSync(path,'utf8');const ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const f=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text===name);assert(f);const exports={};new Function('exports',ts.transpileModule(f.getText(ast),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(exports);return exports[name];}
const complex=load('components/wiki/complex-polar-explorer.tsx','calculateComplex'),motion=load('components/wiki/motion-intro-explorer.tsx','calculateMotion');
const reference=JSON.parse(execFileSync('python',['.agent/semester-03/math-02/reference.py'],{encoding:'utf8'}));const close=(a,b)=>assert(Math.abs(a-b)<1e-10,`${a} != ${b}`);const report={date:new Date().toISOString(),reference,complex:[],motion:[],notebooks:[]};
for(const r of reference.cases){const actual=complex(r.a,r.b);close(actual.r,r.r);if(r.angle===null)assert.equal(actual.degrees,null);else close(actual.degrees,r.angle);if(r.b<0&&r.a>=0)assert(actual.arc.at(-1)[1]<0);report.complex.push(actual);}
assert.equal(complex(-1,-0).degrees,180);for(const r of reference.motion){const a=motion(r.t);close(a.position,r.position);close(a.speed,r.speed);report.motion.push({t:a.t,position:a.position,speed:a.speed});}
for(const args of [[NaN,0],[6,0],[0,Infinity]])assert.throws(()=>complex(...args));for(const t of [-1,5,NaN])assert.throws(()=>motion(t));
for(const lesson of ['complex-numbers','calculus-basics']){
 const source=readFileSync('content/math/'+lesson+'.mdx','utf8');const rows=[];
 for(const nb of extractNotebooks(source)){
  const id='s3math02-'+randomUUID();try{
   assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
   const run=async code=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code}),'page notebook');
   const environment=await run('import sys,sympy;print(sys.version);print(sympy.__version__)');await run(nb.setup.value);const outputs=[];
   for(const c of nb.cells)outputs.push(...await run(c.value));rows.push({environment,outputs,stream:outputs.filter(o=>o.type==='stream').map(o=>o.text).join('')});
  }finally{assert.equal((await directHttp(8891,'/api/notebook/'+id,'DELETE')).status,200);}
 }
 const joined=rows.map(r=>r.stream).join('\n');if(lesson==='complex-numbers')for(const value of ['加法: 4 + 2*I','乘法: -5 + 10*I','除法: 11/5 - 2*I/5','126.86989764584402','乘回验证: 0','题5: 6*I','题6: -4 + 3*I 5'])assert(joined.includes(value),value+' missing');else assert(joined.includes('几何级数极限: 2')&&joined.includes('指数近似/真值/误差: 1.105'));
 report.notebooks.push({lesson,sha256:createHash('sha256').update(source.replace(/\r\n/g,'\n')).digest('hex'),rows});
}
report.pass=true;writeFileSync('.agent/semester-03/math-02/reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log('PASS actual Complex/Motion TS against independent Python; all 9 page notebooks clean kernel execution');
