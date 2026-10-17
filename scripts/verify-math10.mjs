/** Actual TS export against independent projection/reconstruction; original notebook contracts. */
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const path='components/wiki/z-sequence-explorer.tsx',source=readFileSync(path,'utf8');
const ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const f=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='calculateZSequence');assert(f);
const exported={};new Function('exports',ts.transpileModule(f.getText(ast),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(exported);
const reference=JSON.parse(execFileSync('python',['.agent/semester-03/math-10/reference.py'],{encoding:'utf8',maxBuffer:32*1024*1024}));
const near=(a,b)=>{if(Array.isArray(b)){assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));}else assert(Math.abs(a-b)<1e-10,`${a} != ${b}`);};
const component=reference.cases.map(r=>{
 const actual=exported.calculateZSequence(r.a,r.r,r.n);
 for(const k of Object.keys(actual)){
  if(actual[k]===null||typeof actual[k]==='boolean')assert.equal(actual[k],r[k]);else near(actual[k],r[k]);
 }
 return {parameters:[r.a,r.r,r.n],partial:actual.partial,infinite:actual.infinite,tail:actual.tail,maxSampleError:Math.max(...actual.samples.map((v,i)=>Math.abs(v[1]-r.samples[i][1])))};
});
for(const p of [[-1.1,1,8],[1.1,1,8],[.5,.25,8],[.5,2.1,8],[.5,1,-1],[.5,1,13],[.5,1,1.5],[NaN,1,8],[.5,Infinity,8]])assert.throws(()=>exported.calculateZSequence(...p));
const mdx=readFileSync('content/math/z-transform.mdx','utf8');
const contracts=["assert partial==sp.Rational(511,256) and X.subs(z,1)==2 and 2-partial==sp.Rational(1,256); assert [a**i for i in range(4)]==[1,sp.Rational(1,2),sp.Rational(1,4),sp.Rational(1,8)]", "assert sp.simplify(right-left)==0 and right.subs(z,1)==2 and left.subs(z,sp.Rational(1,4))==-1; assert [-a**i for i in [-1,-2,-3]]==[-2,-4,-8]; assert sp.simplify(-sum(sp.Rational(1,2)**i for i in range(1,81))+1)==sp.Rational(1,2)**80", "assert [q*a**(i+1) for i in range(4)]==[2,1,sp.Rational(1,2),sp.Rational(1,4)]; assert sp.simplify(left-(q+Y0/z))==0; assert sp.simplify(Y-parts)==0; assert [2-a**i for i in range(4)]==[1,sp.Rational(3,2),sp.Rational(7,4),sp.Rational(15,8)]; assert 0<float((left-right).subs(z,2))<1e-9", "assert y==conv and y[8]==sp.Rational(511,256); assert sp.limit(Y,z,sp.oo)==1 and sp.limit((1-1/z)*Y,z,1)==2; assert 1/(1-abs(a))==2; assert sp.limit((1-1/z)*alt,z,1)==0 and [(-1)**i for i in range(5)]==[1,-1,1,-1,1]", "assert H.subs(theta,0)==2; assert sp.simplify(H.subs(theta,sp.pi))==sp.Rational(2,3); assert sp.simplify(H.subs(theta,sp.pi/2)-(4-2*sp.I)/5)==0; assert sp.simplify(sp.Abs(H.subs(theta,sp.pi/2))-2/sp.sqrt(5))==0; assert sp.simplify(H.subs(theta,theta+2*sp.pi)-H)==0", "assert sum(a**i for i in range(9))==sp.Rational(511,256); assert 4*a==2; assert abs(np.exp(-1)-.36787944117144233)<1e-12; assert abs(np.exp(-.5)-.6065306597126334)<1e-12; assert sp.limit((1-1/z)/(1+1/z),z,1)==0"];
const report={date:new Date().toISOString(),sourceHash:createHash('sha256').update(mdx.replace(/\r\n/g,'\n')).digest('hex'),tolerance:1e-10,referenceVersions:reference.versions,transformChecks:reference.checks,inverseChecks:reference.inverse,component,notebooks:[]};
const notebooks=extractNotebooks(mdx);assert.equal(notebooks.length,contracts.length);
for(const [index,nb]of notebooks.entries()){
 const id='s3math10-'+randomUUID();
 try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  const run=async code=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code}),'course cell');
  const environment=await run('import sys,sympy,numpy; print(sys.version); print(sympy.__version__,numpy.__version__)');
  await run(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await run(c.value));
  await run(contracts[index]);report.notebooks.push({index,title:nb.title,environment,outputs,contract:contracts[index],pass:true});
 }finally{assert.equal((await directHttp(8891,'/api/notebook/'+id,'DELETE')).status,200);}
}
report.pass=true;writeFileSync('.agent/semester-03/math-10/reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(`PASS ${component.length} actual TS / high-precision recurrence cases; ${component.length*13} samples; ${reference.checks.length} complex sums; ${reference.inverse.length} contour inversions; 6 original notebooks with exact contracts`);
