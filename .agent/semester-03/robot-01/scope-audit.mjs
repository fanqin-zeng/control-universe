import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {parseCatalog} from '../../../scripts/lib-catalog.mjs';
const dir='.agent/semester-03/robot-01/',commit=readFileSync(dir+'commit.txt','utf8').trim();
const get=(rev,path)=>execFileSync('git',['show',rev+':'+path],{encoding:'utf8'}).replace(/\r\n/g,'\n');
const withoutOwn=catalog=>catalog.map(ch=>({...ch,lessons:ch.lessons.filter(l=>ch.slug!=='robotics'||l.slug!=='robot-models')}));
assert.deepEqual(withoutOwn(parseCatalog(get(commit,'content/catalog.ts'))),withoutOwn(parseCatalog(get(commit+'^','content/catalog.ts'))));
for(const path of ['.agent/delivery-tracker.md','.agent/semester-03-checklist.md']){
 const strip=text=>text.split('\n').filter(l=>!l.includes('| ROBOT-01 |')&&!l.includes('机器人系统 (robot-models)')&&!l.startsWith('**统计**：')).join('\n').trim();
 assert.equal(strip(get(commit,path)),strip(get(commit+'^',path)));
}
const planStrip=text=>text.replace(/^\| ROBOT-01 \| .*rank11.*\n/gm,'').replace(/\n+### ROBOT-01 执行回执[\s\S]*?(?=\n### |$)/,'').trim();
assert.equal(planStrip(get(commit,'.agent/semester-03-plan.md')),planStrip(get(commit+'^','.agent/semester-03-plan.md')));
const prior=JSON.parse(readFileSync(dir+'scope-proof.json','utf8'));
writeFileSync(dir+'scope-proof.json',JSON.stringify({...prior,catalog:'All other chapters and lessons identical to parent',progress:'All other tracker/checklist rows and plan sections identical to parent'},null,2)+'\n');
console.log('PASS scoped catalog, plan, tracker and checklist; no other lesson changed');
