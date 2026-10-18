import{readFileSync,writeFileSync}from'node:fs';import{execFileSync}from'node:child_process';import{createHash,randomUUID}from'node:crypto';import assert from'node:assert/strict';import ts from'typescript';import{extractNotebooks}from'./lib-mdx.mjs';import{directHttp,requireSuccess}from'./verify-reproducibility.mjs';import{renderedHeadings}from'./rendered-headings.mjs';
const dir='.agent/semester-03/classic-02/',out={};
for(const file of ['components/wiki/step-bode-explorer.tsx','components/wiki/pole-zero-explorer.tsx']){
 const source=readFileSync(file,'utf8'),ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const declarations=ast.statements.filter(n=>ts.isFunctionDeclaration(n)&&['computeStepResponse','computeBodeMagnitude','calculatePoles'].includes(n.name?.text));
 assert(declarations.length);const code='const NUM_POINTS=400;\n'+declarations.map(n=>n.getText(ast)).join('\n');
 new Function('exports',ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(out);
}
const ref=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8',maxBuffer:16*1024*1024}));let maxStepError=0,maxBodeError=0,maxPoleError=0;
const cases=[];
for(const r of ref.cases){
 const actual=out.computeStepResponse(r.zeta,r.wn,3);assert.equal(actual.length,401);
 for(let i=0;i<401;i++){assert(Math.abs(actual[i][0]-r.step[i][0])<1e-12);const e=Math.abs(actual[i][1]-r.step[i][1]);maxStepError=Math.max(maxStepError,e);assert(e<1e-8);}
 const p=out.calculatePoles(r.zeta,r.wn).poles,sort=x=>x.toSorted((a,b)=>a[0]-b[0]||a[1]-b[1]);
 sort(p).forEach((v,i)=>v.forEach((a,j)=>{const e=Math.abs(a-sort(r.poles)[i][j]);maxPoleError=Math.max(maxPoleError,e);assert(e<1e-6);}));
 if(r.bode){const b=out.computeBodeMagnitude(r.zeta,r.wn);assert.equal(b.length,401);b.forEach((v,i)=>{assert(Math.abs(v[0]-r.bode[i][0])<1e-10);maxBodeError=Math.max(maxBodeError,Math.abs(v[1]-r.bode[i][1]));assert(Math.abs(v[1]-r.bode[i][1])<1e-8);});}
 cases.push({zeta:r.zeta,wn:r.wn,poles:p,maxSample:Math.max(...actual.map(p=>p[1])),end:actual.at(-1),at1:out.computeStepResponse(r.zeta,r.wn,1).at(-1)});
}
for(const args of [[-1,8,3],[.5,0,3],[NaN,8,3],[.5,8,-1]])assert.throws(()=>out.computeStepResponse(...args));
assert.throws(()=>out.computeBodeMagnitude(0,8));assert.throws(()=>out.calculatePoles(-1,8));
const mdx=readFileSync('content/classic/transfer-function.mdx','utf8'),nbs=extractNotebooks(mdx);assert.equal(nbs.length,5);assert.equal((mdx.match(/<JupyterNotebook\b/g)||[]).length,5);
const contracts=[
 "assert len(pairs)==6;assert sp.expand(motor).coeff(s,2)==L*J;assert sp.expand(motor).coeff(s,1)==L*B+R*J",
 "assert np.allclose(motor.den[0][0],[.0001,.01001,.011]);assert np.allclose(closed.den[0][0],[.0001,.01001,1.011]);assert np.max(np.real(poles(motor)))<0;assert np.max(np.real(poles(closed)))<0",
 "assert abs(wn-8)<1e-12;assert abs(zeta-.5)<1e-12;assert abs(wr-5.656854249492381)<1e-12;assert abs(wc-10.176157196112552)<1e-12;assert abs(overshoot-.16303353482158048)<1e-12",
 "assert np.allclose(np.sort(np.linalg.eigvals(A)),[-2,1]);assert np.allclose(poles(Ga),[-2]);assert np.allclose(poles(Gb),[1]);assert abs((np.linalg.solve(A,expm(A)-np.eye(2))@Bd)[1]-np.expm1(1))<1e-12",
 "print('题1附加中间值2sqrt(mk):',2*np.sqrt(500*20000));g,l=sp.symbols('g l',positive=True);assert sp.simplify((sp.I*sp.sqrt(g/l))**2+g/l)==0;assert sp.simplify(sp.sqrt(g/l)**2-g/l)==0;assert abs(tau-.20011945343929166)<1e-10;assert abs(dcgain(series)-2.5)<1e-12;assert sp.simplify(g8-2+5/(s+3))==0;assert abs(100*np.exp(-np.pi/np.sqrt(19))-48.639667507071096)<1e-7"
];
const report={sourceHash:createHash('sha256').update(mdx.replace(/\r\n/g,'\n')).digest('hex'),versions:ref.versions,maxStepError,maxBodeError,maxPoleError,cases,notebooks:[]};
for(const[i,nb]of nbs.entries()){const id='classic02-'+randomUUID();try{assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);const run=async c=>requireSuccess(await directHttp(8891,'/api/notebook/'+id+'/execute','POST',{code:c}),'original cell');await run(nb.setup.value);const outputs=[];for(const c of nb.cells)outputs.push(...await run(c.value));console.log("contract",i+1,JSON.stringify(outputs));const contractOutputs=await run(contracts[i]);report.notebooks.push({index:i+1,title:nb.title,outputs,contract:contracts[i],contractOutputs,pass:true});}finally{await directHttp(8891,'/api/notebook/'+id,'DELETE');}}
const headings=await renderedHeadings(mdx,'classic/transfer-function');const old=JSON.parse(readFileSync(dir+'baseline-source.json','utf8'));for(const h of old.headings)assert(headings.ids.includes(h.id),h.id);assert.equal(new Set(headings.ids).size,headings.ids.length);writeFileSync(dir+'headings.json',JSON.stringify(headings,null,2));
report.pass=true;writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');console.log(`PASS actual TS vs independent scipy state-space: ${cases.length} cases x 401 points; step ${maxStepError}, magnitude ${maxBodeError}, poles ${maxPoleError}; five original notebook contracts; all ${old.headings.length} old IDs`);
