/** Actual TS computation vs independent symbolic derivatives and numerical substitution. */
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const path='components/wiki/hill-gradient-explorer.tsx',source=readFileSync(path,'utf8');
const ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const f=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='calculateHillGradient');assert(f);
const exported={};new Function('exports',ts.transpileModule(f.getText(ast),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(exported);
const reference=JSON.parse(execFileSync('python',['.agent/semester-03/math-06/reference.py'],{encoding:'utf8',maxBuffer:32*1024*1024}));
const near=(a,b)=>{if(Array.isArray(b)){assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));}else if(typeof b==='object'){for(const k of Object.keys(b))near(a[k],b[k]);}else assert(Math.abs(a-b)<1e-9,`${a} != ${b}`);};
const component=reference.cases.map(r=>{const actual=exported.calculateHillGradient(r.x,r.y,r.angle,r.step);
 for(const k of Object.keys(actual))near(actual[k],k==='contours'?reference.contours:r[k]);
 const profileMaxError=Math.max(...actual.profile.flatMap((p,i)=>p.map((n,j)=>Math.abs(n-r.profile[i][j]))));
 const {profile,contours,...readings}=actual;
 return {parameters:[r.x,r.y,r.angle,r.step],actual:readings,profileMaxError,profileSamples:profile.length,contourPoints:contours.reduce((n,c)=>n+c.points.length,0)};
});
for(const p of [[NaN,0,0,0],[2,0,0,0],[0,-2,0,0],[0,0,-1,0],[0,0,361,0],[0,0,0,-1],[0,0,0,.6]])assert.throws(()=>exported.calculateHillGradient(...p));
const file='content/math/multivariable-calculus.mdx',mdx=readFileSync(file,'utf8');
const contracts=[
 'assert h.subs({x:1,y:1})==7; assert sp.diff(h,x)==-2*x and sp.diff(h,y)==-4*y; assert h.subs({x:sp.Rational(11,10),y:1})==sp.Rational(679,100); assert sp.limit(F.subs(y,0),x,0)==0; assert sp.limit(F.subs(y,x),x,0)==sp.Rational(1,2)',
 'assert g==sp.Matrix([-2,-4]); assert predicted==sp.Rational(36,5) and actual==sp.Rational(717,100); assert actual-predicted==-sp.Rational(3,100); assert g.dot(d)==-sp.Rational(22,5); assert g.norm()==2*sp.sqrt(5); assert sp.simplify(g/g.norm()-sp.Matrix([-1,-2])/sp.sqrt(5))==sp.zeros(2,1); assert g.dot(tangent)==0',
 'assert sp.simplify(direct-chain)==0; assert direct.subs(t,sp.pi/4)==-1; assert J==sp.Matrix([[-2,-4],[1,1]]); assert J*shift==sp.Matrix([-sp.Rational(1,5),sp.Rational(1,10)]); assert actual==sp.Matrix([-sp.Rational(21,100),sp.Rational(1,10)])',
 'assert H==sp.diag(-2,-4) and H.det()==8; assert (d.T*H*d)[0]/2==-dx**2-2*dy**2; assert sp.hessian(x*x-y*y,(x,y)).det()==-4; assert sp.hessian(x**4+y**4,(x,y)).subs({x:0,y:0})==sp.zeros(2)',
 'assert sp.integrate(h,(y,0,1),(x,0,1))==9; assert total==sp.Rational(3601,400); assert sum(h.subs({x:sp.Rational(2*i+1,4),y:sp.Rational(2*j+1,4)}) for i in range(2) for j in range(2))/4==sp.Rational(145,16)',
 'assert pred==sp.Rational(36,5); assert actual==sp.Rational(717,100); assert g.dot(sp.Matrix([3,4])/5)==-sp.Rational(22,5); assert J==sp.Matrix([[-2,-4],[1,1]]); assert heights==[sp.Rational(157,16),sp.Rational(141,16),sp.Rational(149,16),sp.Rational(133,16)]; assert sum(heights)/4==sp.Rational(145,16); assert sum(heights)/4-9==sp.Rational(1,16)',
];
const report={date:new Date().toISOString(),sourceHash:createHash('sha256').update(mdx.replace(/\r\n/g,'\n')).digest('hex'),tolerance:1e-9,component,notebooks:[]};
const notebooks=extractNotebooks(mdx);assert.equal(notebooks.length,contracts.length);
for(const [index,nb]of notebooks.entries()){
 const id='s3math06-'+randomUUID();
 try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  const run=async code=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code}),'course cell');
  const environment=await run('import sys,sympy,numpy; print(sys.version); print(sympy.__version__,numpy.__version__)');
  await run(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await run(c.value));
  await run(contracts[index]);report.notebooks.push({index,title:nb.title,environment,outputs,contract:contracts[index],pass:true});
 }finally{assert.equal((await directHttp(8891,'/api/notebook/'+id,'DELETE')).status,200);}
}
report.pass=true;writeFileSync('.agent/semester-03/math-06/reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(`PASS ${component.length} actual TS / symbolic-derivative reference cases; ${component.length*41} profile / ${component.length*363} contour points; 6 original notebooks with exact contracts`);
