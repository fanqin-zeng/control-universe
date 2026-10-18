import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash,randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';
import {extractNotebooks} from './lib-mdx.mjs';
import {renderedHeadings} from './rendered-headings.mjs';
import {directHttp,requireSuccess} from './verify-reproducibility.mjs';
const dir='.agent/semester-03/modern-03/';
const source=readFileSync('content/modern/lyapunov-modern.mdx','utf8');
assert(![...source].some(c=>c.charCodeAt(0)<32&&!['\n','\r','\t'].includes(c)),'Control escape in MDX');
const ref=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8',maxBuffer:16*1024*1024}));
const textOf=outputs=>outputs.filter(o=>o.type==='stream'||o.type==='text').map(o=>o.text??'').join('');
function compare(a,b,tol=1e-10){if(Array.isArray(a)){assert.equal(a.length,b.length);return Math.max(...a.map((x,i)=>compare(x,b[i],tol)));}const e=Math.abs(a-b);assert(e<=tol*(1+Math.abs(b)),`${a} vs ${b}`);return e;}
const report={sourceHash:createHash('sha256').update(source.replace(/\r\n/g,'\n')).digest('hex'),notebooks:[],maxMotionError:0,maxCertificateError:0};
for(const [i,nb]of extractNotebooks(source).entries()){
 const id='modern03-'+randomUUID();
 try{
  assert.equal((await directHttp(8891,'/api/notebook','POST',{notebook_id:id,setup_code:''})).status,200);
  const execute=async code=>requireSuccess(await directHttp(8891,`/api/notebook/${id}/execute`,'POST',{code}),'original source execution');
  await execute(nb.setup.value);const outputs=[];for(const cell of nb.cells)outputs.push(...await execute(cell.value));
  report.notebooks.push({title:nb.title,cells:nb.cells.length,outputs:outputs.map(o=>o.type==='image'?{type:'image',length:o.data?.length}:o),pass:true});
  const query=async expression=>JSON.parse(textOf(await execute('import json\nprint(json.dumps('+expression+'))')));
  if(i===0){const actual=await query('motion_records');for(let c=0;c<3;c++)for(const key of ['states','E'])report.maxMotionError=Math.max(report.maxMotionError,compare(actual[c][key],ref.cases[c][key]));report.motion=actual.map(c=>({c:c.c,endState:c.states.at(-1),endEnergy:c.E.at(-1)}));}
  if(i===1){const actual=await query('{"records":cert_records,"beta":float(beta),"prefactor":float(prefactor)}');for(let c=0;c<16;c++)for(const key of ['norm','V','bound'])report.maxCertificateError=Math.max(report.maxCertificateError,compare(actual.records[c][key],ref.cert[c][key]));compare(actual.beta,ref.beta);compare(actual.prefactor,ref.prefactor);report.certificate={directions:16,nodes:301,beta:actual.beta,prefactor:actual.prefactor};}
  if(i===2){const actual=await query('xx.tolist()');for(let k=0;k<=300;k++)compare(actual[k],[Math.exp(k/100),Math.exp(-k/100)]);}
  if(i===4){const actual=await query('{"P":P.tolist(),"K":K.tolist(),"L":L.tolist(),"Pcl":Pcl.tolist(),"Pobs":Pobs.tolist(),"return_difference":return_difference,"gains":gain_records}');for(const key of ['P','K','L','Pcl','Pobs','return_difference'])compare(actual[key],ref[key]);for(const g of actual.gains){const expected=[-Math.sqrt(3)*g.alpha, g.alpha];const roots=g.roots.map(([r,im])=>({r,im}));compare(roots.reduce((s,v)=>s+v.r,0),expected[0]);compare(roots[0].r*roots[1].r-roots[0].im*roots[1].im,expected[1]);}report.lqr={...actual,return_difference:undefined,frequencyNodes:401};}
 }finally{await directHttp(8891,`/api/notebook/${id}`,'DELETE');}
}
const headings=await renderedHeadings(source,'modern/lyapunov-modern');
const old=JSON.parse(readFileSync(dir+'baseline-source.json','utf8'));
for(const id of old.ids)assert(headings.ids.includes(id)||source.includes(`id="${id}"`));
assert.equal(headings.h2.length,9);assert.equal(new Set(headings.ids).size,headings.ids.length);
writeFileSync(dir+'headings.json',JSON.stringify(headings,null,2));
const legacy=await directHttp(8080,'/modern/linear-system-theory');assert.equal(legacy.status,308);report.legacy={status:legacy.status,location:legacy.headers.location};
report.oldIds=old.ids.length;report.pass=true;writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:true,notebooks:report.notebooks.length,cells:report.notebooks.reduce((s,n)=>s+n.cells,0),oldIds:report.oldIds,maxMotionError:report.maxMotionError,maxCertificateError:report.maxCertificateError,certificate:report.certificate,legacy:report.legacy}));
