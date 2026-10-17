import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pythonInventory} from './python-inventory.mjs';
import {pythonReleaseDecision} from './python-release-decision.mjs';
const policy=JSON.parse(readFileSync('lib/python-support.json','utf8'));
const inventory=pythonInventory();
const report=JSON.parse(readFileSync('docs/deployment/python-expansion-local.json','utf8'));
assert(report.complete);
assert.equal(report.workerHash,policy.workerHash);
assert.equal(policy.workerHash,createHash('sha256').update(readFileSync('public/python-worker.js','utf8').replace(/\r\n/g,'\n')).digest('hex'),'Worker changed; repeat browser audit');
assert.deepEqual(Object.keys(policy.lessons).sort(),inventory.map(l=>l.key).sort());
let enabled=0,code=0;
for(const lesson of inventory){
 const entry=policy.lessons[lesson.key];assert.equal(entry.sourceHash,lesson.sourceHash,'Python source changed: rerun browser acceptance for '+lesson.key);
 assert.equal(entry.notebooks.length,lesson.notebooks.length);
 const proof=report.lessons.find(l=>l.key===lesson.key);assert(proof);assert.equal(proof.sourceHash,lesson.sourceHash);assert.equal(proof.notebooks.length,lesson.notebooks.length);
 for(const [i,nb]of lesson.notebooks.entries()){
  const p=entry.notebooks[i],r=proof.notebooks.find(b=>b.id===nb.id);assert(r);assert.equal(p.id,nb.id);assert.equal(p.cells,nb.cells.length);assert(['enabled','code'].includes(p.status));
  const decision=pythonReleaseDecision(r);assert.equal(p.status,decision.status);assert.equal(p.reason,decision.reason);
  if(p.status==='enabled'){assert(!nb.preflight,nb.id);assert.equal(r.status,'passed');assert.equal(r.cells.length,nb.cells.length);assert(r.cells.every(c=>c.status==='passed'&&!c.outputs.some(o=>o.type==='error')));enabled++;}
  else{assert(p.reason,nb.id);code++;}
 }
}
console.log(JSON.stringify({pass:true,lessons:inventory.length,enabled,codeOnly:code}));
