import {readFileSync,writeFileSync} from 'node:fs';
import {extractNotebooks} from '../../../scripts/lib-mdx.mjs';
const post=async(path,body)=>{const r=await fetch('http://127.0.0.1:8891'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const j=await r.json();if(!r.ok||j.outputs?.some(o=>o.type==='error'))throw Error(JSON.stringify(j));return j;};
const results=[];
for(const key of ['math/linear-algebra-basics','math/eigen-decomposition']){
const nb=extractNotebooks(readFileSync(`content/${key}.mdx`,'utf8'))[0];const id='intro-proof-'+Date.now();
try{await post('/api/notebook',{notebook_id:id,setup_code:''});await post(`/api/notebook/${id}/execute`,{code:nb.setup.value});const cells=[];for(const c of nb.cells)cells.push(await post(`/api/notebook/${id}/execute`,{code:c.value}));results.push({key,title:nb.title,cells});}
finally{await fetch(`http://127.0.0.1:8891/api/notebook/${id}`,{method:'DELETE'});}
}
writeFileSync('.agent/semester-03/intro-proofreading/intro-original-output.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
