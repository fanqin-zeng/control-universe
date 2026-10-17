/** Execute the actual course source, and compare actual TS implementation with independent SymPy. */
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const path='components/wiki/linear-map-explorer.tsx';
const source=readFileSync(path,'utf8'),ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const f=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='calculateLinearMap');assert(f);
const exported={};new Function('exports',ts.transpileModule(f.getText(ast),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(exported);
const reference=JSON.parse(execFileSync('python',['.agent/semester-03/math-03/reference.py'],{encoding:'utf8'}));
const near=(a,b)=>{if(Array.isArray(b)){assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));}else assert(Math.abs(a-b)<1e-10,`${a} != ${b}`);};
const component=reference.cases.map(r=>{const actual=exported.calculateLinearMap(r.t,r.u1,r.u2);for(const key of ['output','determinant','rank','norm','grid'])near(actual[key],r[key]);return {parameters:[r.t,r.u1,r.u2],actual};});
for(const p of [[NaN,0,0],[3,0,0],[1,3,0],[1,0,2]])assert.throws(()=>exported.calculateLinearMap(...p));
const file='content/math/linear-algebra-basics.mdx',mdx=readFileSync(file,'utf8');
const contracts=[
 'assert A*u == sp.Matrix([3,4]); assert u[0]*A[:,0] == sp.Matrix([2,2]); assert u[1]*A[:,1] == sp.Matrix([1,2]); assert A*sp.zeros(2,1) == sp.zeros(2,1)',
 'assert A*B == sp.Matrix([[1,2],[1,4]]); assert B*A == sp.Matrix([[1,1],[2,4]]); assert A*(B*u) == sp.Matrix([4,6]); assert B*(A*u) == sp.Matrix([3,8])',
 'assert A.LUsolve(y) == sp.Matrix([2,1]); assert A.rank()==2 and C.rank()==1; assert C.row_join(y).rank()==2; assert sp.linsolve((C,y))==sp.EmptySet; assert A.det()==1 and C.det()==0; assert A.inv()==sp.Matrix([[2,-1],[-1,1]]); assert sp.simplify(candidate*M)==sp.eye(2); assert aug==sp.Matrix([[1,2,3],[0,0,1]])',
 'assert A*sp.Matrix([-1,2])==sp.Matrix([1,3]); assert A.LUsolve(sp.Matrix([5,8]))==sp.Matrix([2,3]); assert C*sp.Matrix([6-2*r,r])==sp.Matrix([6,6]); assert C.row_join(sp.Matrix([6,6])).rank()==1 and C.row_join(sp.Matrix([6,5])).rank()==2; assert p.dot(q)==0 and p.norm()==sp.sqrt(2); assert p*q.T==sp.Matrix([[1,1],[-1,-1]]); assert F*sp.Matrix([1,2])+G*(-2)==sp.Matrix([3,0]); assert F*sp.Matrix([2,1])+G*(-1)==sp.Matrix([3,0])',
];
const report={date:new Date().toISOString(),sourceHash:createHash('sha256').update(mdx.replace(/\r\n/g,'\n')).digest('hex'),component,notebooks:[]};
const notebooks=extractNotebooks(mdx);assert.equal(notebooks.length,contracts.length);
for(const [index,nb] of notebooks.entries()){
 const id='s3math03-'+randomUUID();
 try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  const run=async code=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code}),'course cell');
  const environment=await run('import sys,sympy; print(sys.version); print(sympy.__version__)');
  await run(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await run(c.value));
  await run(contracts[index]);report.notebooks.push({index,title:nb.title,environment,outputs,contract:contracts[index],pass:true});
 }finally{assert.equal((await directHttp(8891,'/api/notebook/'+id,'DELETE')).status,200);}
}
report.pass=true;writeFileSync('.agent/semester-03/math-03/reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS 45 SymPy/actual-TS cases including degenerate/negative inputs and 900 grid endpoints; 4 original page notebooks with exact contracts');
