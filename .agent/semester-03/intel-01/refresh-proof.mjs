import fs from 'node:fs';
import assert from 'node:assert/strict';
import {pythonInventory} from '../../../scripts/python-inventory.mjs';
import {pythonReleaseDecision} from '../../../scripts/python-release-decision.mjs';
const dir='.agent/semester-03/intel-01/',key='intelligent/fuzzy-control-basics';
const raw=JSON.parse(fs.readFileSync(dir+'pyodide-download.json','utf8'));
assert(raw.complete);assert.equal(raw.lessons.length,1);
const fixture=JSON.parse(fs.readFileSync('public/python-expansion.json','utf8')).lessons.find(l=>l.key===key);
const current=pythonInventory().find(l=>l.key===key),record=raw.lessons[0];
assert.equal(record.sourceHash,fixture.sourceHash);
assert.equal(current.notebooks.length,record.notebooks.length);
for(const[i,nb]of current.notebooks.entries()){
 const before=fixture.notebooks[i],r=record.notebooks[i];
 assert.equal(nb.setup,before.setup);assert.deepEqual(nb.cells,before.cells);
 assert.equal(r.cellCount,nb.cells.length);assert.equal(r.status,'passed');
 assert.equal(r.cells.length,nb.cells.length);assert.equal(pythonReleaseDecision(r).status,'enabled');
 r.line=nb.line;
}
const proof=structuredClone(raw);
proof.sourceReconciliation={method:'Exact setup and cell strings equal browser fixture; only prose changed after fixture creation',testedSourceHash:record.sourceHash,currentSourceHash:current.sourceHash};
proof.lessons[0].sourceHash=current.sourceHash;
fs.writeFileSync(dir+'pyodide.json',JSON.stringify(proof,null,2)+'\n');
const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8'));
assert.equal(policy.workerHash,proof.workerHash);
policy.lessons[key]={sourceHash:current.sourceHash,notebooks:current.notebooks.map((nb,i)=>({id:nb.id,title:nb.title,...pythonReleaseDecision(record.notebooks[i]),cells:nb.cells.length}))};
fs.writeFileSync('lib/python-support.json',JSON.stringify(policy,null,2)+'\n');
const full=JSON.parse(fs.readFileSync('docs/deployment/python-expansion-local.json','utf8'));
const idx=full.lessons.findIndex(l=>l.key===key);assert(idx>=0);
full.lessons[idx]=proof.lessons[0];
full.provenance=[...(full.provenance||[]),{inputPath:dir+'pyodide.json',testedAt:proof.testedAt,scope:key,sourceReconciliation:proof.sourceReconciliation}];
for(const field of ['totals','releaseTotals'])if(full[field]){
 full[field].notebooks=full.lessons.reduce((n,l)=>n+l.notebooks.length,0);
 full[field].enabled=full.lessons.reduce((n,l)=>n+l.notebooks.filter(b=>pythonReleaseDecision(b).status==='enabled').length,0);
 full[field].codeOnly=full.lessons.reduce((n,l)=>n+l.notebooks.filter(b=>pythonReleaseDecision(b).status==='code').length,0);
}
fs.writeFileSync('docs/deployment/python-expansion-local.json',JSON.stringify(full,null,2)+'\n');
console.log(JSON.stringify({pass:true,notebooks:current.notebooks.length,cells:current.notebooks.reduce((n,b)=>n+b.cells.length,0),sourceHash:current.sourceHash}));
