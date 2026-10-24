import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {extractNotebooks} from '../../../scripts/lib-mdx.mjs';
const dir='.agent/semester-03/rlearn-01/',key='robot-learning/robot-data';
const source=fs.readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n');
const books=extractNotebooks(source);
const reference=JSON.parse(execFileSync('python',[dir+'examples.py'],{encoding:'utf8'}));
const outputs=books.map(nb=>execFileSync('python',['-c',[nb.setup?.value||'',...nb.cells.map(c=>c.value)].join('\n')],{encoding:'utf8'}).replace(/\r\n/g,'\n').trim());
const tokens=[['selected_capture_ms: [0, 80, 120, None]','age_ms: [50, 20, 30, None]','accepted: 3','visible_at_50ms: [0]','displacement_m: [0.005, 0.01]'],['frame_counts: 12 12','frame_split_overlap: 1.0','none 0.0','partial 0.5','all 1.0','global_windows/cross_episode/valid: 22 6 16'],['train_mean/scale: 3.0 2.236068','test_z: [3.130495, 4.024922]','leaked_mean: 5.666667','constant_scale_fallback: 1.0','success_only/all_attempts: 1.0 0.5']];
for(let i=0;i<tokens.length;i++)for(const text of tokens[i])assert(outputs[i].includes(text),text);
assert.equal(reference.alignment.accepted,3);assert.equal(reference.splitting.cross_episode_windows,6);assert(Math.abs(reference.normalization.train_scale-Math.sqrt(5))<1e-12);
const proof=JSON.parse(fs.readFileSync(dir+'pyodide.json','utf8'));assert(proof.complete);const lesson=proof.lessons.find(l=>l.key===key);
assert.equal(lesson.sourceHash,createHash('sha256').update(source).digest('hex'));
for(let i=0;i<books.length;i++){
 const actual=lesson.notebooks[i].cells.flatMap(c=>c.outputs).map(o=>o.text||'').join('').trim();
 assert.equal(actual,outputs[i]);
}
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify({pass:true,sourceHash:lesson.sourceHash,reference,outputs,pyodideIdentical:true},null,2)+'\n');
console.log('PASS 3 clean native Python processes; original MDX setup/cell outputs identical to browser Pyodide; independent reference and all textbook/answer tokens reconciled.');
