import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.agent/semester-03/ml-02/',key='machine-learning/supervised-learning';
const proof=JSON.parse(fs.readFileSync(dir+'pyodide.json','utf8'));
const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8'));
const report=JSON.parse(fs.readFileSync('docs/deployment/python-expansion-local.json','utf8'));
const lesson=proof.lessons.find(l=>l.key===key);
assert(proof.complete&&lesson&&proof.workerHash===policy.workerHash);
assert.equal(lesson.sourceHash,createHash('sha256').update(fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n')).digest('hex'));
for(const nb of lesson.notebooks){assert.equal(nb.status,'passed');assert.equal(nb.cells.length,nb.cellCount);assert(nb.cells.every(c=>c.status==='passed'&&!c.outputs.some(o=>o.type==='error')));}
policy.lessons[key]={sourceHash:lesson.sourceHash,notebooks:lesson.notebooks.map(n=>({id:n.id,title:n.title,status:'enabled',reason:'',cells:n.cellCount}))};
report.lessons=report.lessons.filter(l=>l.key!==key).concat(lesson);
report.provenance=[...(report.provenance||[]),{testedAt:proof.testedAt,url:proof.url,inputPath:dir+'pyodide.json'}];
report.totals={lessons:report.lessons.length,notebooks:report.lessons.reduce((s,l)=>s+l.notebooks.length,0),enabled:report.lessons.reduce((s,l)=>s+l.notebooks.filter(n=>n.status==='passed').length,0),codeOnly:report.lessons.reduce((s,l)=>s+l.notebooks.filter(n=>n.status==='code').length,0)};
report.releaseTotals={lessons:Object.keys(policy.lessons).length,notebooks:Object.values(policy.lessons).reduce((s,l)=>s+l.notebooks.length,0),enabled:Object.values(policy.lessons).reduce((s,l)=>s+l.notebooks.filter(n=>n.status==='enabled').length,0),codeOnly:Object.values(policy.lessons).reduce((s,l)=>s+l.notebooks.filter(n=>n.status==='code').length,0)};
fs.writeFileSync('lib/python-support.json',JSON.stringify(policy,null,2)+'\n');
fs.writeFileSync('docs/deployment/python-expansion-local.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:true,key,sourceHash:lesson.sourceHash,enabled:lesson.notebooks.length,pendingPreserved:true}));
