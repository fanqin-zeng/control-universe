import fs from 'node:fs';
import {extractNotebooks} from '../../../scripts/lib-mdx.mjs';
import {randomUUID,createHash} from 'node:crypto';
const dir='.agent/semester-03/impl-02/';
const source=fs.readFileSync(dir+'source-before.mdx','utf8').replace(/\r\n/g,'\n');
const report={sourceHash:createHash('sha256').update(source).digest('hex'),notebooks:[]};
async function api(path,method,body){const res=await fetch('http://127.0.0.1:8991'+path,{method,...(body?{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{})});if(!res.ok)throw Error(await res.text());return res.json();}
for(const nb of extractNotebooks(source)){
 const id='impl02-source-'+randomUUID();const rows=[];
 try{await api('/api/notebook','POST',{notebook_id:id,setup_code:''});
  for(const code of [nb.setup.value,...nb.cells.map(c=>c.value)]){
   const r=await api('/api/notebook/'+id+'/execute','POST',{code});rows.push(r.outputs.map(o=>o.type==='image'?{type:'image',omitted:true}:o));
  }
  report.notebooks.push({cells:nb.cells.length,outputs:rows});
 }finally{await api('/api/notebook/'+id,'DELETE');}
}
fs.writeFileSync(dir+'source-runtime.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({notebooks:report.notebooks.length,cells:report.notebooks.reduce((n,b)=>n+b.cells,0),sourceHash:report.sourceHash}));
