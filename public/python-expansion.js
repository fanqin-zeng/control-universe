import {pythonReleaseDecision} from './python-release-decision.mjs';
let worker,current,sequence=0,report,stopped=false;
const status=document.getElementById('status'),progress=document.getElementById('progress');
function startWorker(){worker=new Worker('./python-worker.js?v='+report.workerHash);worker.onmessage=({data})=>{if(current?.id!==data.id)return;clearTimeout(current.timer);data.error?current.reject(Error(data.error)):current.resolve(data.outputs);};worker.onerror=e=>current?.reject(Error(e.message));}
function request(nb,code,action='execute'){return new Promise((resolve,reject)=>{const id=++sequence;const timer=setTimeout(()=>{worker.terminate();reject(Error('180 秒超时，内核已终止'));},180000);current={id,timer,resolve,reject};worker.postMessage({id,namespace:nb.id,setup:nb.setup,code,action});});}
function compact(outputs){return outputs.map(o=>o.type==='image'?{type:'image',mime:o.mime,base64Length:o.data.length}:o.type==='stream'&&o.text.length>24000?{...o,text:o.text.slice(0,24000),truncated:true}:o);}
document.getElementById('run').onclick=async()=>{
 document.getElementById('run').disabled=true;document.getElementById('stop').disabled=false;document.getElementById('save').disabled=true;progress.textContent='';stopped=false;
 report={testedAt:new Date().toISOString(),url:location.href,userAgent:navigator.userAgent,lessons:[]};
 try{const fixture=await(await fetch('./python-expansion.json')).json();report.workerHash=fixture.workerHash;const selected=new URLSearchParams(location.search).get('lesson');const lessons=selected?fixture.lessons.filter(l=>l.key===selected):fixture.lessons;if(!lessons.length)throw Error('未知课程');report.scope=selected||'all';
 for(const lesson of lessons){if(stopped)break;startWorker();const record={key:lesson.key,title:lesson.title,sourceHash:lesson.sourceHash,notebooks:[]};report.lessons.push(record);
  for(const nb of lesson.notebooks){if(stopped)break;const result={id:nb.id,title:nb.title,index:nb.index,line:nb.line,cellCount:nb.cells.length,status:nb.preflight?'code':'passed',reason:nb.preflight,cells:[]};record.notebooks.push(result);
   if(nb.preflight)continue;
   for(let i=0;i<nb.cells.length;i++){status.textContent=`${lesson.key} / 实验 ${nb.index} / 单元格 ${i+1}`;
    try{const begin=performance.now();const outputs=await request(nb,nb.cells[i]);const errors=outputs.filter(o=>o.type==='error');result.cells.push({index:i+1,milliseconds:Math.round(performance.now()-begin),status:errors.length?'error':'passed',outputs:compact(outputs)});const image=outputs.findLast(o=>o.type==='image');if(image)document.getElementById('preview').src='data:image/png;base64,'+image.data;
     if(errors.length){result.status='code';result.reason=errors.map(o=>o.ename+': '+o.evalue).join('; ');break;}
    }catch(error){result.status='code';result.reason=String(error);worker.terminate();if(!stopped)startWorker();break;}
   }
   if(result.status==='passed')await request(nb,'','reset');
  }
  worker.terminate();const passed=record.notebooks.filter(b=>pythonReleaseDecision(b).status==='enabled').length;progress.textContent+=`${lesson.key}: ${passed}/${record.notebooks.length} 可运行\n`;document.getElementById('results').textContent=JSON.stringify(report,null,2);
 }
 report.complete=!stopped&&report.lessons.length===lessons.length;
 report.totals={lessons:report.lessons.length,notebooks:report.lessons.reduce((n,l)=>n+l.notebooks.length,0),enabled:report.lessons.reduce((n,l)=>n+l.notebooks.filter(b=>b.status==='passed').length,0),codeOnly:report.lessons.reduce((n,l)=>n+l.notebooks.filter(b=>b.status==='code').length,0)};
 report.releaseTotals={enabled:report.lessons.reduce((n,l)=>n+l.notebooks.filter(b=>pythonReleaseDecision(b).status==='enabled').length,0),codeOnly:report.lessons.reduce((n,l)=>n+l.notebooks.filter(b=>pythonReleaseDecision(b).status==='code').length,0)};
 status.textContent=`${report.complete?'验收完成':'验收中止'}：${report.totals.lessons} 课，${report.totals.enabled} 个实验执行成功；${report.releaseTotals.enabled} 个放行，${report.releaseTotals.codeOnly} 个保留代码`;
 }catch(error){report.complete=false;report.error=String(error);status.textContent='验收中止：'+error;}
 finally{worker?.terminate();document.getElementById('results').textContent=JSON.stringify(report,null,2);document.getElementById('run').disabled=false;document.getElementById('stop').disabled=true;document.getElementById('save').disabled=false;}
};
document.getElementById('stop').onclick=()=>{stopped=true;worker?.terminate();if(current){clearTimeout(current.timer);current.reject(Error('用户停止'));}};
document.getElementById('save').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='python-expansion-results.json';a.click();URL.revokeObjectURL(url);};
