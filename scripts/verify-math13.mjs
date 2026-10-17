import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const path='components/wiki/power-allocation-explorer.tsx',source=readFileSync(path,'utf8');
const ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const f=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='calculatePowerAllocation');assert(f);
const exported={};new Function('exports',ts.transpileModule(f.getText(ast),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(exported);
const ref=JSON.parse(execFileSync('python',['.agent/semester-03/math-13/reference.py'],{encoding:'utf8',maxBuffer:32*1024*1024}));
let maxError=0;
function near(a,b){if(Array.isArray(b)){assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));}else{maxError=Math.max(maxError,Math.abs(a-b));assert(Math.abs(a-b)<1e-9,`${a} != ${b}`);}}
const cases=ref.cases.map(r=>{const d=exported.calculatePowerAllocation(...r.parameters);for(const k of Object.keys(r).filter(k=>k!=='parameters'))near(d[k],r[k]);
 near(d.dual,d.optimalValue);assert(d.lambda>=-1e-9&&d.mu.every(x=>x>=-1e-9));d.optimum.forEach((x,i)=>near(x-r.parameters[i]+d.lambda-d.mu[i],0));near(d.lambda*(d.optimum[0]+d.optimum[1]-r.parameters[2]),0);d.mu.forEach((m,i)=>near(m*d.optimum[i],0));return {parameters:r.parameters,optimum:d.optimum,value:d.optimalValue,residual:d.residual};});
for(const p of [[-1,1,2,.5],[4,1,2,.5],[2,NaN,2,.5],[2,1,-1,.5],[2,1,5,.5],[2,1,2,0],[2,1,2,3]])assert.throws(()=>exported.calculatePowerAllocation(...p));
const mdx=readFileSync('content/math/convex-optimization.mdx','utf8');const nbs=extractNotebooks(mdx);assert.equal((mdx.match(/<JupyterNotebook\b/g)||[]).length,6);assert.equal(nbs.length,6);assert(!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(mdx));
const contracts=["assert sp.diff(x**4,x,2).subs(x,0)==0; assert sp.limit(sp.exp(x),x,-sp.oo)==0", "assert np.allclose(solve([2,1],2)[0],[1.5,.5]); assert abs(solve([2,1],2)[1]-.25)<1e-9; assert np.allclose(solve([3,0],1)[0],[1,0]); assert np.allclose(solve([2,1],0)[0],[0,0]); assert np.allclose(solve([2,1],4)[0],[2,1])", "assert primal==dual==sp.Rational(1,4); assert u-r+v==sp.zeros(2,1); assert v0.dot(r)-v0.dot(v0)/2==sp.Rational(5,2); assert sp.limit(-1/(4*l),l,sp.oo)==0", "assert np.allclose(rows[1][1],[1,.5]); assert np.allclose(rows[2][1],[11/8,5/8]); assert np.allclose(rows[3][1],[23/16,9/16]); assert abs(rows[1][2]-5/8)<1e-12 and abs(rows[2][2]-17/64)<1e-12 and abs(rows[3][2]-65/256)<1e-12; assert np.allclose(iterate([1,1],4,2)[18][1],[0,0]); assert np.allclose(project([1.5,.75],2),[11/8,5/8])", "assert np.allclose(s.x,[5/3,1/3]); assert abs(s.fun-1/3)<1e-9; assert H*(u-R)+l*sp.ones(2,1)==sp.zeros(2,1)","assert (u-r).dot(u-r)/2==sp.Rational(1,4); assert (a-r).dot(a-r)/2==sp.Rational(5,8); assert (b-r).dot(b-r)/2==sp.Rational(17,64); assert ((w-r).T*H*(w-r))[0]/2==sp.Rational(1,3)"];
const report={sourceHash:createHash('sha256').update(mdx.replace(/\r\n/g,'\n')).digest('hex'),tolerance:1e-9,versions:ref.versions,cases,maxError,notebooks:[]};
for(const [index,nb]of nbs.entries()){
 const id='s3math13-'+randomUUID();try{
 assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
 const run=async code=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code}),'original course cell');
 await run(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await run(c.value));await run(contracts[index]);report.notebooks.push({index,title:nb.title,outputs,contract:contracts[index],pass:true});
 }finally{assert.equal((await directHttp(8891,'/api/notebook/'+id,'DELETE')).status,200);}
}
report.pass=true;writeFileSync('.agent/semester-03/math-13/reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(`PASS ${cases.length} actual TS / independent active-set KKT cases, max error ${maxError}; 6 original notebooks with exact contracts`);
