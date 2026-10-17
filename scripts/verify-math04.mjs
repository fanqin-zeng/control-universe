/** Original page notebooks + actual exported TS computation vs independent matrix powers. */
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const path='components/wiki/eigen-iteration-explorer.tsx';
const source=readFileSync(path,'utf8'),ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const f=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='calculateEigenIteration');assert(f);
const exported={};new Function('exports',ts.transpileModule(f.getText(ast),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(exported);
const reference=JSON.parse(execFileSync('python',['.agent/semester-03/math-04/reference.py'],{encoding:'utf8'}));
const near=(a,b)=>{if(Array.isArray(b)){assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));}else if(typeof b==='object'){for(const key of Object.keys(b))near(a[key],b[key]);}else assert(Math.abs(a-b)<1e-10,`${a} != ${b}`);};
const component=reference.cases.map(r=>{const actual=exported.calculateEigenIteration(r.p,r.q,r.k);for(const key of ['matrix','eigenvalues','state','modes','trajectory'])near(actual[key],r[key]);return {parameters:[r.p,r.q,r.k],actual};});
for(const p of [[NaN,0,0],[2,0,0],[1,1,0],[1,0,.5],[1,0,-1],[1,0,9]])assert.throws(()=>exported.calculateEigenIteration(...p));
const file='content/math/eigen-decomposition.mdx',mdx=readFileSync(file,'utf8');
const contracts=[
 'assert [list(A**k*x0) for k in range(4)]==[[2,0],[sp.Rational(3,2),sp.Rational(1,2)],[sp.Rational(5,4),sp.Rational(3,4)],[sp.Rational(9,8),sp.Rational(7,8)]]; assert all(sum(A**k*x0)==2 for k in range(5))',
 'assert sp.factor((A-lam*sp.eye(2)).det())==(lam-1)*(2*lam-1)/2; assert A*v1==v1; assert A*v2==sp.Rational(1,2)*v2; assert (A-sp.eye(2)).nullspace()==[sp.Matrix([1,1])]; assert len((A-sp.Rational(1,2)*sp.eye(2)).nullspace())==1',
 'assert P.det()==-2; assert P.inv()==P/2; assert P.inv()*x0==sp.Matrix([1,1]); assert P.inv()*A*P==D; assert A==P*D*P.inv(); assert A**3*x0==sp.Matrix([sp.Rational(9,8),sp.Rational(7,8)]); assert A**8*x0==sp.Matrix([sp.Rational(257,256),sp.Rational(255,256)])',
 'assert J.eigenvals()=={sp.Integer(1):2}; assert (J-sp.eye(2)).nullspace()==[sp.Matrix([1,0])]; assert J**3*sp.Matrix([0,1])==sp.Matrix([3,1]); assert J**8*sp.Matrix([0,1])==sp.Matrix([8,1]); assert R**4==sp.eye(2); assert R*sp.Matrix([1,-sp.I])==sp.I*sp.Matrix([1,-sp.I]); assert R.eigenvals()=={-sp.I:1,sp.I:1}',
 'assert B==sp.diag(2,-1,0); assert H*P2==P2*D2 and P2.det()==1; assert P.inv()*sp.Matrix([3,1])==sp.Matrix([2,1]); assert A**2*sp.Matrix([3,1])==sp.Matrix([sp.Rational(9,4),sp.Rational(7,4)]); assert len((sp.eye(2)-sp.eye(2)).nullspace())==2; assert J**3*sp.Matrix([1,0])==sp.Matrix([1,0]); assert C*sp.Matrix([2,0])==sp.Matrix([sp.Rational(1,4),sp.Rational(5,4)]); assert C**2*sp.Matrix([2,0])==sp.Matrix([sp.Rational(13,16),sp.Rational(5,16)]); assert G*sp.Matrix([1,-1])==sp.Matrix([sp.Rational(1,2),-sp.Rational(1,2)]); assert G*sp.Matrix([1,1])==sp.Matrix([sp.Rational(5,4),sp.Rational(5,4)])',
];
const report={date:new Date().toISOString(),sourceHash:createHash('sha256').update(mdx.replace(/\r\n/g,'\n')).digest('hex'),tolerance:1e-10,component,notebooks:[]};
const notebooks=extractNotebooks(mdx);assert.equal(notebooks.length,contracts.length);
for(const [index,nb] of notebooks.entries()){
 const id='s3math04-'+randomUUID();
 try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  const run=async code=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code}),'course cell');
  const environment=await run('import sys,sympy; print(sys.version); print(sympy.__version__)');
  await run(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await run(c.value));
  await run(contracts[index]);report.notebooks.push({index,title:nb.title,environment,outputs,contract:contracts[index],pass:true});
 }finally{assert.equal((await directHttp(8891,'/api/notebook/'+id,'DELETE')).status,200);}
}
report.pass=true;writeFileSync('.agent/semester-03/math-04/reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS 180 actual TS / independent SymPy matrix-power cases (9-step trajectories, negative/zero/repeated/decay/growth); 5 original page notebooks with exact contracts');
