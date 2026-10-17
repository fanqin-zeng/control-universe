/** I04：真实内核/实际TS算法/页面与失败样本的两轮可复现实验。只删除本工具的内核。 */
import {readFileSync,writeFileSync} from 'node:fs';
import {request} from 'node:http';
import {createHash,randomUUID} from 'node:crypto';
import {spawnSync,execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {extractNotebooks} from './lib-mdx.mjs';
import {parseCatalog} from './lib-catalog.mjs';

const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');
export function directHttp(port,path,method='GET',body){
  return new Promise((resolve,reject)=>{
    const data=body===undefined?null:Buffer.from(JSON.stringify(body));
    // node:http不采用HTTP_PROXY等系统代理变量；Python客户端应使用ProxyHandler({})。
    const req=request({hostname:'127.0.0.1',port,path,method,headers:data?{'Content-Type':'application/json','Content-Length':data.length}:{}},res=>{
      let text='';res.setEncoding('utf8');res.on('data',c=>text+=c);res.on('end',()=>{let json;try{json=JSON.parse(text);}catch{}resolve({status:res.statusCode,headers:res.headers,text,json});});
    });
    req.setTimeout(60000,()=>req.destroy(new Error('HTTP timeout')));req.on('error',reject);if(data)req.write(data);req.end();
  });
}
export function requireSuccess(response,label){
  const error=response.json?.outputs?.find(o=>o.type==='error');
  if(response.status!==200||error)throw Error(label+': '+(error?error.ename+': '+error.evalue:'HTTP '+response.status));
  if(!Array.isArray(response.json?.outputs))throw Error(label+': 缺outputs');
  return response.json.outputs;
}
export function maximumError(a,b){
  if(a.length!==b.length)throw Error('数值数组长度不同');let result=0;
  for(let i=0;i<a.length;i++){
    if(Array.isArray(a[i]))result=Math.max(result,maximumError(a[i],b[i]));
    else {if(!Number.isFinite(a[i])||!Number.isFinite(b[i]))throw Error('非有限数值');result=Math.max(result,Math.abs(a[i]-b[i]));}
  }
  return result;
}
export function pageMetrics(html){return {h1:(html.match(/<h1[ >]/g)||[]).length,h2:(html.match(/<h2[ >]/g)||[]).length,katexElements:(html.match(/class="katex-error"/g)||[]).length};}
const textOf=outputs=>outputs.filter(o=>o.type==='stream'||o.type==='text').map(o=>o.text??'').join('');
function jsonOf(outputs){const line=textOf(outputs).split(/\r?\n/).find(l=>l.startsWith('I04_JSON:'));if(!line)throw Error('缺数值JSON输出');return JSON.parse(line.slice(9));}
function actualSimulator(source){
  const ast=ts.createSourceFile('mimo.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const fn=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='simulateMimo');
  if(!fn)throw Error('找不到实际simulateMimo导出');
  const js=ts.transpileModule(fn.getText(ast),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  const exports={};new Function('exports',js)(exports);return exports.simulateMimo;
}
const environmentCode=`import json, sys, os, platform
import numpy, scipy, sympy, matplotlib, jupyter_client, ipykernel
print("I04_JSON:"+json.dumps({"python":sys.version,"executable":sys.executable,"platform":platform.platform(),"pid":os.getpid(),"versions":{m.__name__:m.__version__ for m in [numpy,scipy,sympy,matplotlib,jupyter_client,ipykernel]},"clean": "I04_MARKER" not in globals()}))`;
const referenceCode=`from scipy.linalg import expm
reference_cases=[]
for k1,k2 in [(2.,2.),(.5,5.),(5.,.5)]:
    aa=np.diag([-1.,-3.,-2.,-1.])
    bb=np.array([[1.,0.],[0.,.5],[.3,0.],[0.,1.]])
    cc=np.array([[1.,1.,0.,0.],[0.,0.,1.,1.]])
    gain=np.diag([k1,k2]); rr=np.array([1.,0.]); closed=aa-bb@gain@cc
    xinf=np.linalg.solve(-closed,bb@gain@rr)
    times=np.linspace(0,10,501)
    states=np.array([(np.eye(4)-expm(closed*t))@xinf for t in times])
    outputs=states@cc.T; controls=(rr-outputs)@gain.T
    reference_cases.append({"kp":[k1,k2],"y":outputs.tolist(),"u":controls.tolist(),"steady":(cc@xinf).tolist()})
print("I04_JSON:"+json.dumps(reference_cases))`;

export async function verifyReproducibility(){
  const report={date:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),node:process.version,checks:[],rounds:[],pages:[],commands:[]};
  const check=(value,label,data={})=>{report.checks.push({label,pass:Boolean(value),...data});if(!value)throw Error(label);};
  const prefix='i04-'+randomUUID(),owned=new Set();
  const kernel=(path,method='GET',body)=>directHttp(8891,path,method,body);
  const create=async(id,setup='')=>{owned.add(id);const r=await kernel('/api/notebook','POST',{notebook_id:id,setup_code:setup});check(r.status===200,'create '+id,{http:r.status});};
  const execute=async(id,code)=>requireSuccess(await kernel('/api/notebook/'+id+'/execute','POST',{code}),'execute');
  const remove=async id=>{const r=await kernel('/api/notebook/'+id,'DELETE');check(r.status===200,'delete own kernel',{http:r.status});owned.delete(id);};
  const command=(args,expected,pattern)=>{
    const run=spawnSync(process.execPath,args,{encoding:'utf8',timeout:120000,maxBuffer:4*1024*1024});
    const output=(run.stdout??'')+(run.stderr??'');
    report.commands.push({args,exitCode:run.status,output});
    check(!run.error&&run.status===expected&&(!pattern||pattern.test(output)),'CLI '+args.join(' '),{exitCode:run.status,expected});
  };
  try{
    const before=await kernel('/health');check(before.status===200&&before.json?.status==='ok','gateway health');
    report.healthBefore=before.json;
    const a=prefix+'-a',b=prefix+'-b';await create(a);await create(b);
    await execute(a,'I04_MARKER = 123');
    check(textOf(await execute(b,'print("I04_MARKER" in globals())')).trim()==='False','isolated namespaces');
    await create(a);
    check(textOf(await execute(a,'print("I04_MARKER" in globals())')).trim()==='False','same ID recreates clean kernel');
    const failure=await kernel('/api/notebook/'+a+'/execute','POST',{code:'raise ValueError("I04_CELL_SENTINEL")'});
    check(failure.status===200&&failure.json?.outputs?.some(o=>o.type==='error'&&o.ename==='ValueError'),'cell error is output error, not HTTP success');
    await remove(a);await remove(b);
    check((await kernel('/api/notebook/'+a+'/execute','POST',{code:'print(1)'})).status===404,'deleted kernel returns 404');
    const bad=prefix+'-bad';owned.add(bad);
    const setupFailure=await kernel('/api/notebook','POST',{notebook_id:bad,setup_code:'raise RuntimeError("I04_SETUP_SENTINEL")'});
    check(setupFailure.status===422&&setupFailure.json?.error?.includes('I04_SETUP_SENTINEL'),'setup failure is HTTP422');
    check((await kernel('/api/notebook/'+bad+'/execute','POST',{code:'print(1)'})).status===404,'setup failure cleans kernel');owned.delete(bad);

    const mdx=readFileSync('content/modern/multivariable-systems.mdx','utf8');
    const component=readFileSync('components/wiki/mimo-proportional-explorer.tsx','utf8');
    const notebook=extractNotebooks(mdx)[0],simulate=actualSimulator(component);
    report.sourceHashes={mdx:hash(mdx),component:hash(component),nbCells:hash(readFileSync('scripts/nb-cells.mjs','utf8')),gateway:hash(readFileSync('scripts/jupyter_server.py','utf8')),driver:hash(readFileSync('scripts/verify-reproducibility.mjs','utf8'))};
    const catalog=parseCatalog(readFileSync('content/catalog.ts','utf8'));
    const lesson=catalog.find(c=>c.slug==='modern').lessons.find(l=>l.slug==='multivariable-systems');
    for(let round=1;round<=2;round++){
      const id=prefix+'-round'+round;await create(id);
      const environment=jsonOf(await execute(id,environmentCode));check(environment.clean,'round starts clean');
      await execute(id,'I04_MARKER = '+round);
      const setupOutputs=await execute(id,notebook.setup.value),cells=[];
      for(const cell of notebook.cells){const outputs=await execute(id,cell.value);cells.push({stream:textOf(outputs),images:outputs.filter(o=>o.type==='image').length});}
      const measured=jsonOf(await execute(id,'print("I04_JSON:"+json.dumps({"y":yy.T.tolist(),"u":uu.T.tolist(),"steady":yinf.tolist()}))'));
      const references=jsonOf(await execute(id,referenceCode)),errors=[];
      for(const reference of references){
        const actual=simulate(...reference.kp);
        const outputError=maximumError(actual.points.map(p=>[p.y1,p.y2]),reference.y),inputError=maximumError(actual.points.map(p=>[p.u1,p.u2]),reference.u);
        const steadyError=maximumError([actual.steady1,actual.steady2],reference.steady);
        check(outputError<=1e-8&&inputError<=1e-8&&steadyError<=1e-10,'TS versus independent expm '+reference.kp,{outputError,inputError,steadyError});
        errors.push({kp:reference.kp,outputError,inputError,steadyError});
      }
      const actual=simulate(2,2);
      const notebookError=Math.max(maximumError(measured.y,actual.points.map(p=>[p.y1,p.y2])),maximumError(measured.u,actual.points.map(p=>[p.u1,p.u2])),maximumError(measured.steady,[actual.steady1,actual.steady2]));
      check(notebookError<=1e-8,'actual notebook default versus actual TS',{notebookError});
      const last=actual.points.at(-1),rounded=[actual.steady1,actual.steady2,1-actual.steady1,Math.abs(actual.peak2.y2),last.u1,last.u2].map(x=>x.toFixed(6));
      check(rounded.every(s=>mdx.includes(s)),'rounded measured values occur in lesson assertions',{rounded});
      report.rounds.push({round,environment,setupStream:textOf(setupOutputs),cells,errors,notebookError,default:{rounded,peakTime:actual.peak2.t,points:actual.points.length}});
      await remove(id);
      const page=await directHttp(8080,'/modern/multivariable-systems');const metrics=pageMetrics(page.text);
      check(page.status===200&&metrics.h1===1&&metrics.h2===lesson.subsections.length&&metrics.katexElements===0,'normal page round '+round,{http:page.status,...metrics});
      check(rounded.every(s=>page.text.includes(s)),'SSR default numbers round '+round);
      report.pages.push({round,path:'modern/multivariable-systems',http:page.status,...metrics});
      for(const path of ['mpc/mpc-principle','mpc/receding-horizon']){
        const r=await directHttp(8080,'/'+path),metrics=pageMetrics(r.text),expected=path.endsWith('mpc-principle')?8:11;
        check(r.status===200&&metrics.h2<expected&&metrics.katexElements>0,'known W05 failure reproduced '+path);
        report.pages.push({round,path,http:r.status,...metrics,knownFailure:'W05; not a passed lesson'});
      }
      command(['scripts/nb-cells.mjs','verify','modern/multivariable-systems','--require-kernel'],0,/S6 实跑无 error/);
      command(['scripts/verify-lesson.mjs','modern/multivariable-systems','--quiet'],0,/FAIL 0/);
      command(['scripts/nb-cells.mjs','verify','scripts/fixtures/reproducibility/setup-error.mdx','--require-kernel'],1,/I04_SETUP_SENTINEL/);
      command(['scripts/nb-cells.mjs','verify','scripts/fixtures/reproducibility/cell-error.mdx','--require-kernel'],1,/I04_CELL_SENTINEL/);
    }
    check(report.rounds[0].environment.pid!==report.rounds[1].environment.pid,'rounds use different Python processes');
    check(JSON.stringify(report.rounds[0].environment.versions)===JSON.stringify(report.rounds[1].environment.versions),'library versions identical');
    check(JSON.stringify(report.rounds[0].cells.map(c=>c.stream))===JSON.stringify(report.rounds[1].cells.map(c=>c.stream)),'actual cell streams identical across clean runs');
    command(['scripts/nb-cells.mjs','verify','modern/multivariable-systems','--require-kernel','--port','1'],1,/FAIL 严格模式/);
    const placeholder=await directHttp(8080,'/math/linear-algebra-basics'),missing=await directHttp(8080,'/modern/i04-not-in-catalog'),redirect=await directHttp(8080,'/modern/linear-system-theory');
    check(placeholder.status===200&&placeholder.text.includes('本课尚未编写'),'empty placeholder');check(missing.status===404,'unknown page 404');
    check(redirect.status===308&&redirect.headers.location?.endsWith('/modern/lyapunov-modern'),'legacy URL 308');
    report.routes={placeholder:placeholder.status,unknown:missing.status,redirect:redirect.status,location:redirect.headers.location};
  }catch(error){report.failure=error.message;}
  finally{
    for(const id of owned){try{await kernel('/api/notebook/'+id,'DELETE');}catch(error){report.failure??='cleanup: '+error.message;}}
    try{
      const health=await kernel('/health');report.healthAfter=health.json;
      if(health.status!==200||Object.keys(health.json?.idle_seconds??{}).some(id=>id.startsWith(prefix)))report.failure??='leaked own kernel';
    }catch(error){report.failure??='final health: '+error.message;}
  }
  report.pass=!report.failure;return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const report=await verifyReproducibility();
  const out=process.argv.indexOf('--out');if(out>=0)writeFileSync(process.argv[out+1],JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({pass:report.pass,checks:report.checks.length,rounds:report.rounds.length,commands:report.commands.length,failure:report.failure,report:out>=0?process.argv[out+1]:undefined},null,2));
  process.exitCode=report.pass?0:1;
}
