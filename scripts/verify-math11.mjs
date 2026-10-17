/** Actual TS export against independent projection/reconstruction; original notebook contracts. */
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const path='components/wiki/bayes-window-explorer.tsx',source=readFileSync(path,'utf8');
const ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const f=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='calculateBayesWindow');assert(f);
const exported={};new Function('exports',ts.transpileModule(f.getText(ast),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(exported);
const reference=JSON.parse(execFileSync('python',['.agent/semester-03/math-11/reference.py'],{encoding:'utf8',maxBuffer:32*1024*1024}));
const near=(a,b)=>{if(Array.isArray(b)){assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));}else assert(Math.abs(a-b)<1e-10,`${a} != ${b}`);};
const component=reference.cases.map(r=>{
 const actual=exported.calculateBayesWindow(...r.parameters);
 for(const k of Object.keys(actual)){if(actual[k]===null)assert.equal(r[k],null);else near(actual[k],r[k]);}
 return {parameters:r.parameters,...actual};
});
for(const p of [[-.01,.9,.05],[.51,.9,.05],[.01,-.1,.05],[.01,1.1,.05],[.01,.9,-.1],[.01,.9,1.1],[NaN,.9,.05],[.01,Infinity,.05]])assert.throws(()=>exported.calculateBayesWindow(...p));
const mdx=readFileSync('content/math/probability-basics.mdx','utf8');
assert.equal((mdx.match(/<JupyterNotebook\b/g)||[]).length,7);
const contracts=["assert sum(joint)==1 and [v*10000 for v in joint]==[90,10,495,9405]; assert bell==sp.Rational(117,2000) and joint[0]/bell==sp.Rational(2,13); assert p+bell-joint[0]==sp.Rational(119,2000); assert p2*t/(p2*t+(1-p2)*f)==sp.Rational(2,3); assert p*bell==sp.Rational(117,200000)", "assert sum(weights)==1 and weights[1]==sp.Rational(1,2); assert [sum(w for v,w in zip(values,weights) if v<=b) for b in [-2,-1,-.5,0,.5,1,2]]==[0,sp.Rational(1,4),sp.Rational(1,4),sp.Rational(3,4),sp.Rational(3,4),1,1]; assert sp.integrate(2,(x,0,sp.Rational(1,2)))==1 and sp.integrate(2,(x,0,sp.Rational(1,4)))==sp.Rational(1,2)", "assert mu==0 and second==variance==sp.Rational(1,2); assert my==3 and sum((v-my)**2*p for v,p in zip(y,probs))==2; assert EU==EUV==cov==0 and EV==sp.Rational(2,3); assert sum(v*v for v in u)/sp.Integer(3)==sp.Rational(2,3) and sum(v**4 for v in u)/sp.Integer(3)-EV**2==sp.Rational(2,9)", "assert pmf==[sp.Rational(k,3125) for k in [1024,1280,640,160,20,1]]; assert sum(pmf)==1 and 1-pmf[0]==sp.Rational(2101,3125); assert sum(k*v for k,v in enumerate(pmf))==1 and sum((k-1)**2*v for k,v in enumerate(pmf))==sp.Rational(4,5); assert abs(pdf(0)-.19947114020071635)<1e-12 and abs(area-.6826894921370859)<1e-12", "assert n==4 and mean==0 and ss==2 and ss/(n-1)==sp.Rational(2,3) and ss/n==sp.Rational(1,2)", "assert len(rows)==32 and sum(means)==0 and sum(v*v for v in means)/len(rows)==sp.Rational(5,4); assert sum(r[0]**2 for r,_ in rows)/len(rows)==2 and sum(r[0]*r[1] for r,_ in rows)/len(rows)==1; assert sp.Rational(1,2)/(100*sp.Rational(1,2)**2)==sp.Rational(1,50)", "assert bell==sp.Rational(117,2000) and p*t/bell==sp.Rational(2,13); assert 1-sp.Rational(4,5)**5==sp.Rational(2101,3125); assert abs(pdf(0)-.19947114020071635)<1e-12 and abs(quad(pdf,-2,2,epsabs=1e-12,epsrel=1e-12)[0]-.6826894921370859)<1e-12"];
const report={date:new Date().toISOString(),sourceHash:createHash('sha256').update(mdx.replace(/\r\n/g,'\n')).digest('hex'),tolerance:1e-10,referenceVersions:reference.versions,normal:reference.normal,binomial:reference.binomial,enumeration:{sampleCount:reference.sampleCount,expectedSampleVariance:reference.expectedSampleVariance,sampleMeanVariance:reference.sampleMeanVariance,commonCount:reference.commonCount,commonVariance:reference.commonVariance},component,notebooks:[]};
const notebooks=extractNotebooks(mdx);assert.equal(notebooks.length,contracts.length);
for(const [index,nb]of notebooks.entries()){
 const id='s3math11-'+randomUUID();
 try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  const run=async code=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code}),'course cell');
  const environment=await run('import sys,sympy,numpy; print(sys.version); print(sympy.__version__,numpy.__version__)');
  await run(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await run(c.value));
  await run(contracts[index]);report.notebooks.push({index,title:nb.title,environment,outputs,contract:contracts[index],pass:true});
 }finally{assert.equal((await directHttp(8891,'/api/notebook/'+id,'DELETE')).status,200);}
}
report.pass=true;writeFileSync('.agent/semester-03/math-11/reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(`PASS ${component.length} actual TS / exact latent-tree cases; 256 elementary sample configurations; 32 common-error configurations; independent normal integrals; 7 original notebooks with exact contracts`);
