import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {parseCatalog} from '../../../scripts/lib-catalog.mjs';
const dir='.agent/semester-03/rlearn-01/',info=JSON.parse(fs.readFileSync(dir+'commit-projection.json','utf8')),key='robot-learning/robot-data';
const base=p=>execFileSync('git',['-C','D:/Workspace/control-universe','show',info.base+':'+p],{encoding:'utf8',maxBuffer:32*1024*1024}).replace(/\r\n/g,'\n');
const read=p=>fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
const withoutTarget=cat=>cat.map(c=>({...c,lessons:c.lessons.filter(l=>c.slug+'/'+l.slug!==key)}));
assert.deepEqual(withoutTarget(parseCatalog(read('content/catalog.ts'))),withoutTarget(parseCatalog(base('content/catalog.ts'))));
for(const p of ['.agent/semester-03-plan.md','.agent/semester-03-checklist.md']){
 const strip=s=>s.split('\n').filter(l=>!l.startsWith('| RLEARN-01 |')).join('\n');assert.equal(strip(read(p)),strip(base(p)),p);
}
const stripTracker=s=>s.split('\n').filter(l=>!l.includes('机器人数据 (robot-data)')&&!l.includes('**统计**')).join('\n');assert.equal(stripTracker(read('.agent/delivery-tracker.md')),stripTracker(base('.agent/delivery-tracker.md')));
const before=JSON.parse(base('lib/python-support.json')),after=JSON.parse(read('lib/python-support.json'));delete before.lessons[key];delete after.lessons[key];assert.deepEqual(after,before);
const rb=JSON.parse(base('docs/deployment/python-expansion-local.json')),ra=JSON.parse(read('docs/deployment/python-expansion-local.json'));
assert.deepEqual(ra.lessons.filter(l=>l.key!==key),rb.lessons.filter(l=>l.key!==key));assert.deepEqual(ra.provenance.slice(0,-1),rb.provenance);
assert.equal(ra.lessons.find(l=>l.key===key).sourceHash,'38c11fff4929e9564448a77280cb2aa280967f2f6b20b344a404a0c875f8280d');
console.log('PASS scoped projection on '+info.base+': every other catalog lesson, plan/checklist row, tracker row, policy entry and browser proof preserved.');
