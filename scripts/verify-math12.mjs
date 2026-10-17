/** Actual TS export against independent projection/reconstruction; original notebook contracts. */
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const path='components/wiki/ar-process-explorer.tsx',source=readFileSync(path,'utf8');
const ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const f=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='calculateARProcess');assert(f);
const exported={};new Function('exports',ts.transpileModule(f.getText(ast),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(exported);
const reference=JSON.parse(execFileSync('python',['.agent/semester-03/math-12/reference.py'],{encoding:'utf8',maxBuffer:32*1024*1024}));
const near=(a,b)=>{if(Array.isArray(b)){assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));}else assert(Math.abs(a-b)<1e-10,`${a} != ${b}`);};
const component=reference.cases.map(r=>{
 const actual=exported.calculateARProcess(...r.parameters);
 for(const k of Object.keys(actual))near(actual[k],r[k]);
 return {parameters:r.parameters,variance:actual.variance,limit:actual.limit,maxPathError:Math.max(...actual.paths.flatMap((p,i)=>p.map((v,k)=>Math.abs(v[1]-r.paths[i][k][1])))),maxVarianceError:Math.max(...actual.variances.map((v,k)=>Math.abs(v[1]-r.variances[k][1])))};
});
for(const p of [[-.9,.75,false,3],[.9,.75,false,3],[.5,.1,false,3],[.5,1.1,false,3],[.5,.75,false,-1],[.5,.75,false,13],[.5,.75,false,1.5],[NaN,.75,false,3],[.5,.75,'false',3]])assert.throws(()=>exported.calculateARProcess(...p));
const mdx=readFileSync('content/math/stochastic-processes.mdx','utf8');
assert.equal((mdx.match(/<JupyterNotebook\b/g)||[]).length,7);
const contracts=["assert mx==2 and r0==5 and r0-mx**2==1 and r1==4 and r1-mx**2==0; assert len(rows)==8; assert sp.Rational(sum(x for x,y in rows),8)==0 and sp.Rational(sum(x*x for x,y in rows),8)==sp.Rational(5,2) and sum(x*y for x,y in rows)==0; assert joint==sp.Rational(1,2) and margin**2==sp.Rational(1,4)", "assert P[:4]==[0,sp.Rational(3,4),sp.Rational(15,16),sp.Rational(63,64)] and steady==1; assert P[12]==1-sp.Rational(1,4)**12 and steady-P[12]==sp.Rational(1,4)**12; assert a**2*P[1]==sp.Rational(3,16) and a**2*P[0]==0; assert [steady*a**l for l in range(4)]==[1,sp.Rational(1,2),sp.Rational(1,4),sp.Rational(1,8)]", "assert v==sp.Rational(33,64); assert abs(spectrum(0)-3)<1e-12 and abs(spectrum(math.pi/2)-.6)<1e-12 and abs(spectrum(math.pi)-1/3)<1e-12; assert abs(quad(spectrum,-math.pi,math.pi,epsabs=1e-12,epsrel=1e-12)[0]/(2*math.pi)-1)<1e-12; assert [sp.simplify((4+2*sum((4-l)*b**l for l in range(1,4)))/16) for b in [sp.Rational(-1,2),sp.Integer(0),sp.Rational(1,2)]]==[sp.Rational(7,64),sp.Rational(1,4),sp.Rational(33,64)]", "assert p*T==sp.Matrix([[sp.Rational(4,5),sp.Rational(1,5)]]) and p*T*T==sp.Matrix([[sp.Rational(7,10),sp.Rational(3,10)]]); assert pi*T==pi and sum(pi)==1; assert (p*T**4)[1]==sp.Rational(3,8); assert p*flip**2==p and p*flip!=p", "assert P1==Q and P2==sp.Matrix([[sp.Rational(15,16),sp.Rational(9,32)],[sp.Rational(9,32),sp.Rational(255,256)]]); assert Q.det()==sp.Rational(41,64) and Ps.det()==sp.Rational(45,49); assert Ps-A*Ps*A.T-Q==sp.zeros(2)", "assert len(paths)==16; assert [sp.Rational(sum(sum(p[:k])**2 for p in paths),16) for k in range(5)]==[0,1,2,3,4]; assert sp.Rational(sum(sum(p[:4])*sum(p[:2]) for p in paths),16)==2; assert C==sp.Matrix([[1,1,1],[1,2,2],[1,2,4]]) and D*C*D.T==sp.diag(1,1,2)", "assert p*T==sp.Matrix([[sp.Rational(4,5),sp.Rational(1,5)]]); assert Ps-A*Ps*A.T-Q==sp.zeros(2); assert A*Q*A.T+Q==sp.Matrix([[sp.Rational(15,16),sp.Rational(9,32)],[sp.Rational(9,32),sp.Rational(255,256)]])"];
const report={date:new Date().toISOString(),sourceHash:createHash('sha256').update(mdx.replace(/\r\n/g,'\n')).digest('hex'),tolerance:1e-10,referenceVersions:reference.versions,spectra:reference.spectra,vector:reference.vector,brownian:reference.brownian,component,notebooks:[]};
const notebooks=extractNotebooks(mdx);assert.equal(notebooks.length,contracts.length);
for(const [index,nb]of notebooks.entries()){
 const id='s3math12-'+randomUUID();
 try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  const run=async code=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code}),'course cell');
  const environment=await run('import sys,sympy,numpy; print(sys.version); print(sympy.__version__,numpy.__version__)');
  await run(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await run(c.value));
  await run(contracts[index]);report.notebooks.push({index,title:nb.title,environment,outputs,contract:contracts[index],pass:true});
 }finally{assert.equal((await directHttp(8891,'/api/notebook/'+id,'DELETE')).status,200);}
}
report.pass=true;writeFileSync('.agent/semester-03/math-12/reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(`PASS ${component.length} actual TS / covariance-matrix cases; 4 x 13 path samples per case; independent covariance-Fourier spectra and Kronecker solve; 7 original notebooks with exact contracts`);
