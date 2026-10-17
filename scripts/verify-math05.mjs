/** Actual TS exported model vs independent NumPy SVD; original MDX notebooks + exact contracts. */
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const path='components/wiki/svd-sensitivity-explorer.tsx',source=readFileSync(path,'utf8');
const ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const f=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='calculateSvdSensitivity');assert(f);
const exported={};new Function('exports',ts.transpileModule(f.getText(ast),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(exported);
const reference=JSON.parse(execFileSync('python',['.agent/semester-03/math-05/reference.py'],{encoding:'utf8',maxBuffer:16*1024*1024}));
const near=(a,b)=>{if(b===null){assert.equal(a,null);return;}if(Array.isArray(b)){assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));}else assert(Math.abs(a-b)<1e-9,`${a} != ${b}`);};
const component=reference.cases.map(r=>{
 const actual=exported.calculateSvdSensitivity(r.s,r.delta,r.angle,r.tau);
 for(const key of Object.keys(actual))near(actual[key],r[key]);
 const ellipseMaxError=Math.max(...actual.ellipse.flatMap((v,i)=>v.map((n,j)=>Math.abs(n-r.ellipse[i][j]))));
 const {ellipse,...readings}=actual;
 return {parameters:[r.s,r.delta,r.angle,r.tau],actual:readings,ellipseMaxError,ellipseSamples:ellipse.length};
});
for(const p of [[NaN,0,0,0],[-1,0,0,0],[2,0,0,0],[.1,.1,0,0],[.1,0,91,0],[.1,0,0,-1],[.1,0,0,.3]])assert.throws(()=>exported.calculateSvdSensitivity(...p));
const file='content/math/matrix-decomposition.mdx',mdx=readFileSync(file,'utf8');
const contracts=[
 'assert c==sp.sqrt(2); assert q*c==sp.Matrix([1,1]); assert b-q*c==sp.Matrix([1,-1]); assert L*U==M; assert w==sp.ones(2,1); assert U.inv()*w==sp.Matrix([0,1]); assert P*N==sp.Matrix([[1,1],[0,1]]); assert N.det()==-1',
 'assert Q.T*Q==sp.eye(2); assert Q*R==A; assert sp.simplify(Q.T*b-sp.Matrix([3/sp.sqrt(2),5/sp.sqrt(6)]))==sp.zeros(2,1); assert x==sp.Matrix([sp.Rational(2,3),sp.Rational(5,3)]); assert A*x==sp.Matrix([sp.Rational(2,3),sp.Rational(7,3),sp.Rational(5,3)]); assert r==sp.Matrix([sp.Rational(1,3),-sp.Rational(1,3),sp.Rational(1,3)]); assert r.dot(r)==sp.Rational(1,3); assert A.T*r==sp.zeros(2,1); assert Q[:,1]==sp.Matrix([-1,1,2])/sp.sqrt(6); assert Q*Q.T==sp.Matrix([[2,1,-1],[1,2,1],[-1,1,2]])/3',
 'assert G==sp.Matrix([[2,1],[1,2]]); assert C==sp.Matrix([[sp.sqrt(2),0],[1/sp.sqrt(2),sp.sqrt(6)/2]]); assert C*C.T==G; assert (z.T*S*z)[0]==0; assert S.det()==0',
 'assert sp.simplify(U.T*U)==sp.eye(3) and sp.simplify(V.T*V)==sp.eye(2); assert sp.simplify(U*Sigma*V.T)==A; assert set(A.singular_values())=={sp.sqrt(3),sp.Integer(1)}; assert A.pinv()==sp.Matrix([[2,1,-1],[-1,1,2]])/3; assert A.pinv()*b==sp.Matrix([sp.Rational(2,3),sp.Rational(5,3)]); assert B.pinv()==B; assert B.pinv()*y==sp.Matrix([1,0]); assert (y-B*x).dot(y-B*x)==4 and x.dot(x)==1+t*t',
 'assert np.allclose(np.linalg.pinv(A)@b,[1,1.1]); assert abs(np.linalg.cond(A)-10)<1e-12; assert abs(np.linalg.cond(A.T@A)-100)<1e-10; assert np.allclose(x,[1,0]); assert abs(np.linalg.norm(x-x_true)-1)<1e-12; assert abs(np.linalg.norm(y-A@x)-.1)<1e-12',
 'assert w==sp.Matrix([3,1]); assert U.inv()*w==sp.ones(2,1); assert q.dot(b)==2*sp.sqrt(2); assert q*q.dot(b)==sp.Matrix([2,2]); assert b-q*q.dot(b)==sp.Matrix([1,-1]); assert r.dot(r)==sp.Rational(1,3); assert G.cholesky()==sp.Matrix([[2,0],[1,sp.sqrt(2)]]); assert B.singular_values()==[2,0]; assert B.pinv()==sp.diag(sp.Rational(1,2),0); assert B.pinv()*sp.Matrix([4,3])==sp.Matrix([2,0]); assert exact==sp.Matrix([1,sp.Rational(4,5)]); assert (exact-real_x).norm()==sp.Rational(1,5); assert S.condition_number()==10 and (S.T*S).condition_number()==100; assert (y-S*truncated).norm()==sp.Rational(2,25); assert (truncated-real_x).norm()==1',
];
const report={date:new Date().toISOString(),sourceHash:createHash('sha256').update(mdx.replace(/\r\n/g,'\n')).digest('hex'),tolerance:1e-9,component,notebooks:[]};
const notebooks=extractNotebooks(mdx);assert.equal(notebooks.length,contracts.length);
for(const [index,nb] of notebooks.entries()){
 const id='s3math05-'+randomUUID();
 try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  const run=async code=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code}),'course cell');
  const environment=await run('import sys,sympy,numpy; print(sys.version); print(sympy.__version__,numpy.__version__)');
  await run(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await run(c.value));
  await run(contracts[index]);report.notebooks.push({index,title:nb.title,environment,outputs,contract:contracts[index],pass:true});
 }finally{assert.equal((await directHttp(8891,'/api/notebook/'+id,'DELETE')).status,200);}
}
report.pass=true;writeFileSync('.agent/semester-03/math-05/reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(`PASS ${component.length} actual TS / independent NumPy SVD cases; ${component.length*121} ellipse points; zero/equal-threshold/negative-noise/rotation; 6 original notebooks with exact contracts`);
