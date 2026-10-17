/** MATH-01: 页面原始 notebook + 独立有理数/SymPy + 实际 TS 导出；只清理本次内核。 */
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const source=readFileSync('components/wiki/calculus-explorer.tsx','utf8');
const mdx=readFileSync('content/math/calculus-basics.mdx','utf8');
const ast=ts.createSourceFile('calculus.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const fn=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='calculateCalculus');
assert(fn,'actual TS export');const exports={};
new Function('exports',ts.transpileModule(fn.getText(ast),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(exports);
const calc=exports.calculateCalculus;
const reference=JSON.parse(execFileSync('python',['.agent/semester-03/math-01/minimal-experiment.py'],{encoding:'utf8'}));
const rational=s=>{const [a,b='1']=s.split('/').map(Number);return a/b;};
const close=(a,b)=>assert(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const report={date:new Date().toISOString(),node:process.version,hashes:Object.fromEntries([['mdx',mdx],['component',source]].map(([k,v])=>[k,createHash('sha256').update(v.replace(/\r\n/g,'\n')).digest('hex')])),reference,cases:[],notebooks:[]};
for(const r of reference.derivatives){const a=calc(rational(r.h),4);close(a.secant,rational(r.secant));close(a.derivative,rational(r.exact_derivative));report.cases.push({h:r.h,secant:a.secant});}
for(const r of reference.rectangles){const a=calc(.5,r.n);close(a.rightSum,rational(r.right_sum));close(a.exactIntegral,rational(reference.integral));}
for(let n=1;n<=16;n++){const a=calc(0,n);assert.equal(a.secant,null);close(a.rightSum,4+4/n);assert.equal(a.rectangles.length,n);close(a.rectangles.at(-1).end,2);for(const r of a.rectangles)close(r.height,2*r.end);assert.equal(a.curve.length,201);assert.deepEqual(a.curve[0],[0,0]);assert.deepEqual(a.curve.at(-1),[4,16]);}
for(const [h,n]of [[NaN,4],[Infinity,4],[1.1,4],[0,0],[0,17],[0,1.5]])assert.throws(()=>calc(h,n));
report.default=calc(.5,4);delete report.default.curve;
const expected=[['区间平均速度: 3 5','导数: 2*t t=2时: 4','切线预测/真值/误差: 22/5 441/100 1/100'],['常数/幂函数/乘积: 0 2*t 3*t**2','多项式导数与点值: 6*t - 2 10','复合函数导数与点值: 8*t + 4 12'],['符号积分: 4','两段位移/净位移/路程: -1 1 0 2'],['准确/扰动差商= 4.1 4.2','准确/扰动差商= 4.01 5.01','累积函数及导数: h**2 2*h','幂函数原函数: t**3/3','常数信息: [2*t, 2*t, 2*t]'],['题1: 4 2 6','题2: 7/2 4','题3: 22/5 441/100 1/100','题4: 12','题5: 5 4 1','题6: [-1, 1] 0 2','题7: [-1, 1]','题8: [1/10, 1]']];
const notebooks=extractNotebooks(mdx);assert.equal(notebooks.length,5);
for(let i=0;i<notebooks.length;i++){
 const id='math01-'+randomUUID();const nb=notebooks[i];
 try{
  const created=await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''});assert.equal(created.status,200);
  const run=async code=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code}),'notebook '+i);
  const environment=await run('import sys, sympy; print(sys.version); print(sympy.__version__)');
  await run(nb.setup.value);const cells=[];
  for(const cell of nb.cells){const outputs=await run(cell.value);cells.push({sha256:createHash('sha256').update(cell.value).digest('hex'),outputs});}
  const stream=cells.flatMap(c=>c.outputs).filter(o=>o.type==='stream'||o.type==='text').map(o=>o.text??'').join('');
  for(const text of expected[i])assert(stream.includes(text),'missing '+text+' in '+stream);
  report.notebooks.push({index:i+1,environment,cells,stream});
 } finally {const removed=await directHttp(8891,'/api/notebook/'+id,'DELETE');assert.equal(removed.status,200);}
}
report.pass=true;writeFileSync('.agent/semester-03/math-01/reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS MATH-01: actual TS / independent Fraction+SymPy / 5 clean page notebooks; all 16 N, h=0, boundary and invalid input checks');
