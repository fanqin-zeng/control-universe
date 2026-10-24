import {readFileSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {extractNotebooks} from './lib-mdx.mjs';
import {renderedHeadings} from './rendered-headings.mjs';
const require=createRequire(import.meta.url),ts=require('typescript');
const dir='.agent/semester-03/intel-02/', key='intelligent/fuzzy-controller-design';
const source=readFileSync('lib/fuzzy-controller.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const exports={};new Function('exports',js)(exports);
let seed=207;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
const staticCases=[];
for(const n of [3,5,7,9])for(const design of ['legacy','coverage','repaired'])for(const mode of ['PD','P','D']) {
 const points=[[0,0],[.25,0],[.37,-.12],[1,-1],[-1.3,.8],[.1,0],...Array.from({length:5},()=>[2.6*random()-1.3,2.6*random()-1.3])];
 for(const [e,de] of points){const input={e,de,n,design,mode};staticCases.push({input,result:exports.infer(e,de,n,design,mode)});}
}
const dynamics=[{params:exports.DEFAULT_TUNING,scenario:{}},
 {params:{n:7,Ge:3,Gce:.25,Gu:12,design:'repaired'},scenario:{angle:35,gravity:23.52}},
 {params:{n:3,Ge:.5,Gce:2,Gu:30,design:'repaired'},scenario:{angle:10,disturbance:1}}]
 .map(c=>({...c,result:exports.simulateFuzzy(c.params,c.scenario)}));
for(const c of dynamics) {delete c.result.time;delete c.result.theta;delete c.result.u;}
writeFileSync(dir+'actual-ts.json',JSON.stringify({static:staticCases,dynamics},null,2));
const measurements=[];
const measure=(label,params={},scenario={},pid)=>{
 const r=exports.simulateFuzzy({...exports.DEFAULT_TUNING,...params},scenario,pid);
 const {time,theta,u,...metrics}=r;measurements.push({label,metrics});
};
for(const [name,values]of [['Ge',[1,2,3]],['Gce',[.2,.5,.8]],['Gu',[8,12,20]]])for(const v of values)measure(name+'='+v,{[name]:v});
for(const design of ['legacy','coverage','repaired'])measure(design,{design});
for(const dt of [.004,.002,.001])measure('sample='+dt,{}, {dt});
for(const Ki of [0,2,8])measure('Ki='+Ki,{Ki},{disturbance:1});
for(const mode of ['PD','P','D'])measure('mode='+mode,{mode});
for(const [name,s] of [['zero',{angle:0}],['small',{angle:10}],['large',{angle:35}],['gravity',{gravity:23.52}],['load',{disturbance:1}]]){
 measure('TEST '+name+' fuzzy',{Ge:3,Gce:.25,Gu:12},s);
 measure('TEST '+name+' PID',{},s,[60,10,6]);
}
writeFileSync(dir+'component-measurements.json',JSON.stringify(measurements,null,2));
const original=readFileSync(dir+'baseline-source.mdx.txt','utf8'),current=readFileSync('content/'+key+'.mdx','utf8');
const old=await renderedHeadings(original,key),now=await renderedHeadings(current,key);
const aliases=[...current.matchAll(/<span id="([^"]+)"/g)].map(m=>m[1]);
const missing=old.ids.filter(id=>!now.ids.includes(id)&&!aliases.includes(id));
if(missing.length)throw Error('Missing old anchors: '+missing.join(','));
writeFileSync(dir+'headings.json',JSON.stringify({old,current:now,explicitAliases:aliases,missing},null,2));
console.log(JSON.stringify({actualStatic:staticCases.length,dynamics:dynamics.length,oldIds:old.ids.length,missing,h2:now.h2.length}));
if(process.argv.includes('--kernel')) {
 const request=async(path,data,method='POST')=>{const r=await fetch('http://127.0.0.1:9007'+path,{method,headers:{'Content-Type':'application/json'},body:method==='DELETE'?undefined:JSON.stringify(data)});if(!r.ok)throw Error(r.status+' '+path);return r.json();};
 const notebooks=extractNotebooks(current),results=[];
 for(const nb of notebooks){const id='intel02-proof-'+nb.index+'-'+Date.now();await request('/api/notebook',{notebook_id:id,setup_code:''});
  const blocks=[nb.setup.value,...nb.cells.map(c=>c.value)],outputs=[];
  try{for(const code of blocks){const out=await request('/api/notebook/'+id+'/execute',{code});if(out.outputs.some(x=>x.type==='error'))throw Error(JSON.stringify(out));outputs.push(out);}}
  finally{await request('/api/notebook/'+id,undefined,'DELETE');}
  results.push({index:nb.index,title:nb.title,outputs});
 }
 writeFileSync(dir+'native-outputs.json',JSON.stringify(results,null,2));console.log('Raw native setup/cell outputs saved for all 6 notebooks');
}
