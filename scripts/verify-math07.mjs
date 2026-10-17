/** Calls actual exported TS computation; reference uses general SciPy expm/ODE. */
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const path='components/wiki/cascade-exponential-explorer.tsx',source=readFileSync(path,'utf8');
const ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const func=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='calculateCascadeExponential');assert(func);
const exported={};new Function('exports',ts.transpileModule(func.getText(ast),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(exported);
const reference=JSON.parse(execFileSync('python',['.agent/semester-03/math-07/reference.py'],{encoding:'utf8',maxBuffer:32*1024*1024}));
const near=(a,b)=>{if(Array.isArray(b)){assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));}else assert(Math.abs(a-b)<1e-10,`${a} != ${b}`);};
const component=reference.cases.map(r=>{
 const actual=exported.calculateCascadeExponential(r.a,r.b,r.time);
 for(const k of Object.keys(actual))near(actual[k],r[k]);
 assert(actual.samples.every(p=>p[1]>=0&&p[1]<=1&&p[2]>=0&&p[2]<=1));
 const maxSampleError=Math.max(...actual.samples.flatMap((p,i)=>p.map((v,j)=>Math.abs(v-r.samples[i][j]))));
 const {samples,...readings}=actual;return {parameters:[r.a,r.b,r.time],actual:readings,maxSampleError,sampleCount:samples.length};
});
for(const p of [[0,1,1],[2.1,1,1],[1,.2,1],[1,3,1],[1,1,-1],[1,1,9],[NaN,1,1],[1,Infinity,1],[1,1,NaN]])assert.throws(()=>exported.calculateCascadeExponential(...p));
const mdx=readFileSync('content/math/ode-matrix-exponential.mdx','utf8');
const contracts=[
 'assert T.subs(t,0)==80; assert sp.simplify(sp.diff(T,t)+(T-20)/2)==0; assert abs(float(T.subs(t,2))-42.07276647028654)<1e-10; assert sp.simplify(z-(2-sp.exp(-t)))==0; assert sp.simplify(z.subs(t,sp.log(2)))==sp.Rational(3,2)',
 'assert A*A==-sp.eye(2); assert sp.simplify(R.diff(t)-A*R)==sp.zeros(2); assert R.subs(t,0)==sp.eye(2); assert sp.simplify(R.subs(t,sp.pi/2)*sp.Matrix([1,0]))==sp.Matrix([0,-1]); assert N**3==sp.zeros(3); assert EN.subs(t,2)==sp.Matrix([[1,2,2],[0,1,2],[0,0,1]]); assert sp.simplify((N*t).exp()-EN)==sp.zeros(3)',
 'assert B==P*L*P.inv(); assert sp.simplify(EB-(B*t).exp())==sp.zeros(2); assert sp.simplify(EB.subs(t,sp.log(2)))==sp.Matrix([[sp.Rational(1,2),sp.Rational(1,4)],[0,sp.Rational(1,4)]]); assert U.exp()*V.exp()==sp.Matrix([[2,1],[1,1]]); assert U*V-V*U==sp.diag(1,-1); assert (U+V).exp()[0,0]==(U+V).exp()[1,1]; assert sp.zeros(2).exp()==sp.eye(2); assert sp.zeros(2).applyfunc(sp.exp)==sp.ones(2)',
 'assert x==sp.Matrix([sp.exp(-t),t*sp.exp(-t)]); assert x.subs(t,0)==sp.Matrix([1,0]); assert sp.simplify(x.diff(t)-A*x)==sp.zeros(2,1); assert sp.simplify(sp.limit(other,b,a)-a*t*sp.exp(-a*t))==0; assert len(A.eigenvects())==1 and len(A.eigenvects()[0][2])==1; assert sp.simplify(sp.diff(x[1],t)-sp.exp(-t)*(1-t))==0; assert sp.limit(x[0],t,sp.oo)==0 and sp.limit(x[1],t,sp.oo)==0; assert abs(float(other.subs({a:1,b:2,t:1}))-.4650883158696593)<1e-10',
 'assert sp.simplify(y-sp.Matrix([1-sp.exp(-t),1-(1+t)*sp.exp(-t)]))==sp.zeros(2,1); assert y.subs(t,0)==sp.zeros(2,1); assert sp.simplify(y.diff(t)-A*y-f)==sp.zeros(2,1); assert sp.simplify(y.subs(t,sp.log(2)))==sp.Matrix([sp.Rational(1,2),(1-sp.log(2))/2]); assert z==sp.Matrix([t,2*t]); assert z.subs(t,2)==sp.Matrix([2,4])',
 'assert branch.subs(t,0)==0 and branch.subs(t,1)==sp.Rational(1,4); assert sp.simplify(sp.diff(branch,t)-sp.sqrt(sp.Abs(branch)))==0; assert sp.limit(sp.sqrt(x)/x,x,0,dir="+")==sp.oo; assert blow.subs(t,0)==1 and sp.simplify(sp.diff(blow,t)-blow**2)==0; assert sp.limit(blow,t,1,dir="-")==sp.oo',
 'assert E2==sp.Matrix([[1,2,2],[0,1,2],[0,0,1]]); assert E2*sp.Matrix([0,0,1])==sp.Matrix([2,2,1]); assert EB*sp.Matrix([0,1])==sp.Matrix([sp.Rational(1,4),sp.Rational(1,4)]); assert wash==sp.Matrix([sp.exp(-2),2*sp.exp(-2)]); assert feed==sp.Matrix([sp.Rational(1,2),(1-sp.log(2))/2]); assert sp.simplify(sp.diff(branch,t)-sp.sqrt(branch))==0',
];
const report={date:new Date().toISOString(),sourceHash:createHash('sha256').update(mdx.replace(/\r\n/g,'\n')).digest('hex'),tolerance:1e-10,referenceVersions:reference.versions,nearReference:reference.nearReference,ode:reference.ode,component,notebooks:[]};
const notebooks=extractNotebooks(mdx);assert.equal(notebooks.length,contracts.length);
for(const [index,nb]of notebooks.entries()){
 const id='s3math07-'+randomUUID();
 try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  const run=async code=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code}),'course cell');
  const environment=await run('import sys,sympy; print(sys.version); print(sympy.__version__)');
  await run(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await run(c.value));
  await run(contracts[index]);report.notebooks.push({index,title:nb.title,environment,outputs,contract:contracts[index],pass:true});
 }finally{assert.equal((await directHttp(8891,'/api/notebook/'+id,'DELETE')).status,200);}
}
report.pass=true;writeFileSync('.agent/semester-03/math-07/reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(`PASS ${component.length} actual TS / independent SciPy expm cases; ${component.length*161} samples; ${reference.ode.length} adaptive ODE cases; 7 original notebooks with exact contracts`);
