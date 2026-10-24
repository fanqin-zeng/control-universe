import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {parseCatalog} from '../../../scripts/lib-catalog.mjs';
const dir='.agent/semester-03/rlearn-02/',info=JSON.parse(fs.readFileSync(dir+'projection.json','utf8')),key=info.key;
const base=p=>execFileSync('git',['-C','D:/Workspace/control-universe','show',info.base+':'+p],{encoding:'utf8',maxBuffer:32*1024*1024}).replace(/\r\n/g,'\n');
const read=p=>fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
const without=cat=>cat.map(c=>({...c,lessons:c.lessons.filter(l=>c.slug+'/'+l.slug!==key)}));
assert.deepEqual(without(parseCatalog(read('content/catalog.ts'))),without(parseCatalog(base('content/catalog.ts'))));
for(const p of ['.agent/semester-03-plan.md','.agent/semester-03-checklist.md']){
 const strip=s=>s.split('\n').filter(l=>!l.startsWith('| RLEARN-02 |')).join('\n');assert.equal(strip(read(p)),strip(base(p)),p);
}
const stripTracker=s=>s.split('\n').filter(l=>!l.includes('模仿学习 (imitation-learning)')&&!l.includes('**统计**')).join('\n');
assert.equal(stripTracker(read('.agent/delivery-tracker.md')),stripTracker(base('.agent/delivery-tracker.md')));
const stripRegistry=s=>s.split('\n').filter(l=>!l.includes('ImitationLearningExplorer')).join('\n');
assert.equal(stripRegistry(read('lib/wiki-components.ts')),stripRegistry(base('lib/wiki-components.ts')));
const stripGlossary=s=>s.split('\n').filter(l=>!/^\| (模仿学习|行为克隆|数据集聚合) \|/.test(l)).join('\n');
assert.equal(stripGlossary(read('docs/semester-02/03-glossary.md')),stripGlossary(base('docs/semester-02/03-glossary.md')));
const before=JSON.parse(base('lib/python-support.json')),after=JSON.parse(read('lib/python-support.json'));delete before.lessons[key];delete after.lessons[key];assert.deepEqual(after,before);
const rb=JSON.parse(base('docs/deployment/python-expansion-local.json')),ra=JSON.parse(read('docs/deployment/python-expansion-local.json'));
assert.deepEqual(ra.lessons.filter(l=>l.key!==key),rb.lessons.filter(l=>l.key!==key));
const stripProvenance=a=>(a||[]).filter(p=>p.inputPath!==dir+'pyodide.json');assert.deepEqual(stripProvenance(ra.provenance),stripProvenance(rb.provenance));
const proof=JSON.parse(read(dir+'pyodide.json')).lessons.find(l=>l.key===key);
assert.equal(ra.lessons.find(l=>l.key===key).sourceHash,proof.sourceHash);
assert.equal(JSON.parse(read('lib/python-support.json')).lessons[key].sourceHash,proof.sourceHash);
console.log('PASS scoped projection on '+info.base+': other lessons, registry entries, glossary rows, progress, policies and browser proofs preserved.');
