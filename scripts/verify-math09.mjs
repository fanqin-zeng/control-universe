/** Actual TS export against independent projection/reconstruction; original notebook contracts. */
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const path='components/wiki/fourier-synthesis-explorer.tsx',source=readFileSync(path,'utf8');
const ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const f=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='calculateFourierSynthesis');assert(f);
const exported={};new Function('exports',ts.transpileModule(f.getText(ast),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(exported);
const reference=JSON.parse(execFileSync('python',['.agent/semester-03/math-09/reference.py'],{encoding:'utf8',maxBuffer:32*1024*1024}));
const near=(a,b)=>{if(Array.isArray(b)){assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));}else assert(Math.abs(a-b)<1e-10,`${a} != ${b}`);};
const component=reference.cases.map(r=>{
 const actual=exported.calculateFourierSynthesis(r.mode,r.amplitude,r.phase,r.terms,r.time);
 for(const k of Object.keys(actual))near(actual[k],r[k]);
 const maxSampleError=Math.max(...actual.samples.flatMap((p,i)=>p.map((v,j)=>Math.abs(v-r.samples[i][j]))));
 const {samples,...readings}=actual;return {parameters:[r.mode,r.amplitude,r.phase,r.terms,r.time],actual:readings,maxSampleError,sampleCount:samples.length};
});
for(const p of [['bad',.5,0,3,0],['vibration',-1,0,3,0],['vibration',2,0,3,0],['vibration',.5,181,3,0],['vibration',.5,-181,3,0],['square',.5,0,0,0],['square',.5,0,16,0],['square',.5,0,2.5,0],['square',.5,0,3,-1],['square',.5,0,3,2],['vibration',NaN,0,3,0]])assert.throws(()=>exported.calculateFourierSynthesis(...p));
const mdx=readFileSync('content/math/fourier-analysis.mdx','utf8');
const contracts=[
 'assert sp.integrate(x,(t,0,1))==0; assert sp.integrate(2*x*sp.cos(2*sp.pi*t),(t,0,1))==1; assert sp.integrate(2*x*sp.cos(6*sp.pi*t),(t,0,1))==sp.Rational(1,2); assert ms==sp.Rational(5,8) and phase_ms==ms; assert phase_signal.subs(t,0)==1 and x.subs(t,0)==sp.Rational(3,2); assert sp.integrate(-2*phase_signal*sp.sin(6*sp.pi*t),(t,0,1))/(-1)==-sp.Rational(1,2)',
 'assert sp.simplify(4/sp.pi*(1-sp.Rational(1,3)+sp.Rational(1,5))-52/(15*sp.pi))==0; assert abs(float(52/(15*sp.pi))-1.1034742721038078)<1e-10; assert sp.simplify(sum(8/(sp.pi**2*(2*k-1)**2) for k in range(1,4)))<1; assert abs(values[0])<1e-12 and abs(values[10000])<1e-12',
 'assert absolute_bound==2 and sp.simplify(X-2/(1+w*w))==0; assert X.subs(w,0)==2 and X.subs(w,1)==1; assert sp.integrate(2/(1+w*w),(w,-sp.oo,sp.oo))/(2*sp.pi)==1; assert sp.limit(2*sp.sin(w)/w,w,0)==2; assert sp.simplify(box.subs(w,sp.pi))==0',
 'assert sp.simplify(H-1/(1+sp.I*w))==0; assert sp.simplify(continuous-1/(1+sp.I*w)**2)==0; assert sp.simplify(derivative-sp.I*w*continuous)==0; assert sp.simplify(conv-t*sp.exp(-t))==0; assert H1==(1-sp.I)/2 and sp.Abs(H1)==sp.sqrt(2)/2 and sp.arg(H1)==-sp.pi/4; assert abs(float(sp.Abs(H.subs(w,2*sp.pi)))-.15717672547758985)<1e-10',
 'assert np.allclose(np.abs(X[[1,3,63,61]]),[32,16,32,16],atol=1e-10,rtol=0); assert np.allclose(2*np.abs(X[[1,3]])/N,[1,.5],atol=1e-10,rtol=0); assert abs(np.mean(x*x)-.625)<1e-12 and abs(np.sum(np.abs(X)**2)/N**2-.625)<1e-12; explicit=np.exp(-2j*np.pi*np.outer(np.arange(N),np.arange(N))/N)@x; assert np.max(np.abs(explicit-X))<1e-10; assert np.max(np.abs(np.fft.ifft(X).real-x))<1e-12',
 'assert np.max(np.abs(a-b))<1e-10; assert np.max(np.abs(np.sin(np.pi*n)))<1e-10; L=np.fft.rfft(np.cos(2*np.pi*3.5*n/N)); assert np.allclose(2*np.abs(L[[3,4]])/N,[.5900225320985808,.6777190914745921],atol=1e-8,rtol=0); assert abs(np.abs(np.fft.rfft(np.full(N,2.0))[0])/N-2)<1e-12; assert abs(np.abs(np.fft.rfft(np.cos(np.pi*n))[-1])/N-1)<1e-12',
 'assert sp.integrate(p*p,(t,0,1))==sp.Rational(5,8) and p.subs(t,0)==1; assert np.allclose(np.abs(D[[1,3]]),[32,16],atol=1e-10,rtol=0); assert np.allclose(2*np.abs(leak[[3,4]])/64,[.5900225320985808,.6777190914745921],atol=1e-8,rtol=0); assert X.subs(w,0)==2 and X.subs(w,1)==1',
];
const report={date:new Date().toISOString(),sourceHash:createHash('sha256').update(mdx.replace(/\r\n/g,'\n')).digest('hex'),tolerance:1e-10,referenceVersions:reference.versions,transformChecks:reference.transformChecks,inverseAtZero:reference.inverseAtZero,component,notebooks:[]};
const notebooks=extractNotebooks(mdx);assert.equal(notebooks.length,contracts.length);
for(const [index,nb]of notebooks.entries()){
 const id='s3math09-'+randomUUID();
 try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  const run=async code=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code}),'course cell');
  const environment=await run('import sys,sympy,numpy; print(sys.version); print(sympy.__version__,numpy.__version__)');
  await run(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await run(c.value));
  await run(contracts[index]);report.notebooks.push({index,title:nb.title,environment,outputs,contract:contracts[index],pass:true});
 }finally{assert.equal((await directHttp(8891,'/api/notebook/'+id,'DELETE')).status,200);}
}
report.pass=true;writeFileSync('.agent/semester-03/math-09/reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(`PASS ${component.length} actual TS / quadrature-coefficient cases; ${component.length*601} samples; ${reference.transformChecks.length} complex transform checks; 7 original notebooks with exact contracts`);
