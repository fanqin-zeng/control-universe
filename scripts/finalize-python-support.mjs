import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {pythonInventory} from './python-inventory.mjs';
import {pythonReleaseDecision} from './python-release-decision.mjs';
const inputPath=process.argv[2] || 'docs/deployment/python-expansion-local.json';
let report=JSON.parse(readFileSync(inputPath,'utf8'));
assert(report.complete,'Incomplete browser audit');
if(process.argv.includes('--merge')){
 const previous=JSON.parse(readFileSync('docs/deployment/python-expansion-local.json','utf8'));
 assert(previous.complete);assert.equal(previous.workerHash,report.workerHash,'Worker changes require a full audit');
 const records=new Map(previous.lessons.map(l=>[l.key,l]));
 for(const lesson of report.lessons)records.set(lesson.key,lesson);
 report={...report,scope:'merged-complete-inventory',lessons:[...records.values()],provenance:[...(previous.provenance||[{testedAt:previous.testedAt,url:previous.url}]),{testedAt:report.testedAt,url:report.url,inputPath}]};
 report.totals={lessons:report.lessons.length,notebooks:report.lessons.reduce((n,l)=>n+l.notebooks.length,0),enabled:report.lessons.reduce((n,l)=>n+l.notebooks.filter(b=>b.status==='passed').length,0),codeOnly:report.lessons.reduce((n,l)=>n+l.notebooks.filter(b=>b.status==='code').length,0)};
}
const inventory=pythonInventory();
assert(report.complete,'Incomplete browser audit');
assert.equal(report.lessons.length,inventory.length);
const lessons={},pending=[];
for(const lesson of inventory){
 const actual=report.lessons.find(l=>l.key===lesson.key);assert(actual,lesson.key);assert.equal(actual.sourceHash,lesson.sourceHash);assert.equal(actual.notebooks.length,lesson.notebooks.length);
 const notebooks=lesson.notebooks.map(nb=>{
  const result=actual.notebooks.find(b=>b.id===nb.id);assert(result,nb.id);assert.equal(result.cellCount,nb.cells.length);
  if(result.status==='passed'){assert.equal(result.cells.length,nb.cells.length);assert(result.cells.every(c=>c.status==='passed'&&!c.outputs.some(o=>o.type==='error')),nb.id);}
  else {assert.equal(result.status,'code');assert(result.reason,nb.id);}
  const decision=pythonReleaseDecision(result);
  if(decision.status==='code')pending.push({lesson:lesson.key,title:lesson.title,id:nb.id,index:nb.index,line:nb.line,notebook:nb.title,reason:decision.reason,cellCount:nb.cells.length,executedCells:result.cells.length});
  return {id:nb.id,title:nb.title,...decision,cells:nb.cells.length};
 });
 lessons[lesson.key]={sourceHash:lesson.sourceHash,notebooks};
}
const workerHash=createHash('sha256').update(readFileSync('public/python-worker.js','utf8').replace(/\r\n/g,'\n')).digest('hex');
assert.equal(report.workerHash,workerHash,'Worker changed since audit started');
const policy={runtime:'Pyodide 0.27.7 / control 0.10.2',workerHash,lessons};
writeFileSync('lib/python-support.json',JSON.stringify(policy,null,2)+'\n');
writeFileSync('docs/deployment/python-expansion-pending.json',JSON.stringify(pending,null,2)+'\n');
report.releaseTotals={lessons:inventory.length,notebooks:inventory.reduce((n,l)=>n+l.notebooks.length,0),enabled:inventory.reduce((n,l)=>n+lessons[l.key].notebooks.filter(b=>b.status==='enabled').length,0),codeOnly:pending.length};
if(process.argv.includes('--merge'))writeFileSync('docs/deployment/python-expansion-local.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.releaseTotals));
