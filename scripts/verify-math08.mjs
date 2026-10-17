/** Actual TS export vs independent quadrature; original MDX kernels + symbolic contracts. */
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const path='components/wiki/laplace-weight-explorer.tsx',source=readFileSync(path,'utf8');
const ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const func=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='calculateLaplaceWeight');assert(func);
const exported={};new Function('exports',ts.transpileModule(func.getText(ast),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(exported);
const reference=JSON.parse(execFileSync('python',['.agent/semester-03/math-08/reference.py'],{encoding:'utf8',maxBuffer:32*1024*1024}));
const near=(a,b,relative=false)=>{if(Array.isArray(b)){assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));}else if(b===null||typeof b==='boolean')assert.equal(a,b);else assert(Math.abs(a-b)<=1e-10+(relative?1e-12*Math.abs(b):0),`${a} != ${b}`);};
const component=reference.cases.map(r=>{
 const actual=exported.calculateLaplaceWeight(r.a,r.sigma,r.cutoff);
 for(const k of Object.keys(actual))near(actual[k],r[k],k==='total'||k==='tail');
 assert(actual.samples.every(p=>p[1]>0&&p[1]<8));
 if(!actual.converges)assert.equal(actual.total,actual.tail);
 const maxSampleError=Math.max(...actual.samples.flatMap((p,i)=>p.map((v,j)=>Math.abs(v-r.samples[i][j]))));
 const {samples,shaded,...readings}=actual;return {parameters:[r.a,r.sigma,r.cutoff],actual:readings,areaAbsoluteError:Math.abs(actual.area-r.area),maxSampleError,sampleCount:samples.length,shadedCount:shaded.length};
});
for(const p of [[0,0,1],[3,0,1],[1,-1,1],[1,3,1],[1,0,-1],[1,0,9],[NaN,0,1],[1,Infinity,1],[1,0,NaN]])assert.throws(()=>exported.calculateLaplaceWeight(...p));
const mdx=readFileSync('content/math/laplace-transform.mdx','utf8');
const contracts=[
 'assert finite==1-sp.exp(-4) and tail==sp.exp(-4); assert sp.simplify(finite+tail)==1; assert sp.simplify(negative-4*(sp.E-1))==0; assert sp.laplace_transform(sp.exp(-t),t,s)==(1/(s+1),-1,True); assert sp.laplace_transform(t**2,t,s)==(2/s**3,0,True); assert sp.laplace_transform(sp.sin(w*t),t,s)==(w/(s*s+w*w),0,True); assert sp.laplace_transform(sp.cos(w*t),t,s)==(s/(s*s+w*w),0,True)',
 'assert shifted==(1/(s+1)**2,-1,True); assert sp.simplify(first-(s*F-1))==0; assert sp.limit(f,t,0,dir="+")==0; assert sp.limit(sp.diff(f,t),t,0,dir="+")==1; assert sp.simplify(direct-rule)==0',
 'assert sp.simplify(y0-(1-sp.exp(-t)))==0; assert sp.limit(y0,t,0,dir="+")==0 and sp.simplify(sp.diff(y0,t)+y0-1)==0; assert sp.simplify(y2-(1+sp.exp(-t)))==0; assert sp.simplify(y2.subs(t,sp.log(2)))==sp.Rational(3,2); assert sp.simplify(ysecond-(1-(1+t)*sp.exp(-t)))==0; assert sp.simplify(sp.diff(ysecond,t,2)+2*sp.diff(ysecond,t)+ysecond-1)==0; assert sp.limit(ysecond,t,0,dir="+")==0 and sp.limit(sp.diff(ysecond,t),t,0,dir="+")==0; assert sp.simplify(ysecond.subs(t,sp.log(2))-(1-sp.log(2))/2)==0; assert sp.inverse_laplace_transform(2/(s*s+4),s,t)==sp.sin(2*t)',
 'assert sp.simplify(base-1/(s*(s+1)))==0 and roc==0 and condition==True; assert sp.simplify(delayed-sp.exp(-2*s)/(s*(s+1)))==0; assert g.subs(t,1)==0 and g.subs(t,2)==0 and g.subs(t,3)==1-1/sp.E',
 'assert sp.simplify(same-t*sp.exp(-t))==0 and sp.simplify(step-(1-sp.exp(-t)))==0; assert sp.laplace_transform(same,t,s)==(1/(s+1)**2,-1,True); assert sp.simplify(sp.laplace_transform(step,t,s,noconds=True)-1/(s*(s+1)))==0',
 'assert sp.simplify(y-(2+sp.exp(-t)))==0 and sp.simplify(y.subs(t,sp.log(2)))==sp.Rational(5,2); assert sp.limit(y,t,0,dir="+")==3 and sp.simplify(sp.diff(y,t)+y-2)==0; assert sp.limit(s*Ystep,s,sp.oo)==0 and sp.limit(s*Ystep,s,0,dir="+")==1; assert set(sp.solve(s*s+1,s))=={-sp.I,sp.I}; assert sp.laplace_transform(sp.exp(t),t,s)==(1/(s-1),1,True); assert sp.limit(s/(s*s+1),s,0)==0 and sp.limit(s/(s-1),s,0)==0',
 'assert sp.laplace_transform(t*sp.exp(-2*t),t,s)==(1/(s+2)**2,-2,True); assert sp.simplify(y3-(1+sp.exp(-t)))==0 and sp.simplify(y3.subs(t,sp.log(2)))==sp.Rational(3,2); assert sp.simplify(y4-(1-(1+t)*sp.exp(-t)))==0; assert sp.simplify(c-t*sp.exp(-t))==0; assert [sp.limit(sp.cancel(s*F),s,0,dir="+") for F in [1/(s*(s+1)),1/(s*s+1),1/(s-1)]]==[1,0,0]',
];
const report={date:new Date().toISOString(),sourceHash:createHash('sha256').update(mdx.replace(/\r\n/g,'\n')).digest('hex'),absoluteTolerance:1e-10,totalTailRelativeTolerance:1e-12,referenceVersions:reference.versions,complexChecks:reference.complexChecks,component,notebooks:[]};
const notebooks=extractNotebooks(mdx);assert.equal(notebooks.length,contracts.length);
for(const [index,nb]of notebooks.entries()){
 const id='s3math08-'+randomUUID();
 try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  const run=async code=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code}),'course cell');
  const environment=await run('import sys,sympy; print(sys.version); print(sympy.__version__)');
  await run(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await run(c.value));
  await run(contracts[index]);report.notebooks.push({index,title:nb.title,environment,outputs,contract:contracts[index],pass:true});
 }finally{assert.equal((await directHttp(8891,'/api/notebook/'+id,'DELETE')).status,200);}
}
report.pass=true;writeFileSync('.agent/semester-03/math-08/reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(`PASS ${component.length} actual TS / quadrature cases; ${component.length*161} samples; ${reference.complexChecks.length} complex integral checks; 7 original notebooks with exact contracts`);
