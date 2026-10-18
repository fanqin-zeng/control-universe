import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {extractNotebooks} from '../../../../../scripts/lib-mdx.mjs';
const dir='.agent/semester-03/zh-lang-edit/merges/d05e876/';const r=JSON.parse(fs.readFileSync(dir+'review.json','utf8'));assert(r.pass&&r.working);
const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8')),report=JSON.parse(fs.readFileSync('docs/deployment/python-expansion-local.json','utf8'));
const hash=s=>createHash('sha256').update(s).digest('hex');let count=0;
for(const row of r.rows){
 const source=fs.readFileSync(row.path,'utf8').replace(/\r\n/g,'\n'),key=row.path.slice(8,-4);assert.equal(hash(source),row.sourceAfter);
 const a=extractNotebooks(source).map(n=>({title:n.title,setup:n.setup?.value||'',cells:n.cells.map(c=>c.value)}));assert.equal(hash(JSON.stringify(a)),row.pythonPayloadHash);
 if(!a.length)continue;
 const entry=policy.lessons[key],proof=report.lessons.find(l=>l.key===key);assert.equal(entry.sourceHash,row.sourceBefore);assert.equal(proof.sourceHash,row.sourceBefore);
 proof.executedSourceHash=proof.executedSourceHash||proof.sourceHash;proof.sourceHash=row.sourceAfter;proof.sourceReview={review:dir+'review.json',payloadHash:row.pythonPayloadHash,executedAgain:false,reason:'Setup, cell and title payloads exactly unchanged; prose/alias-only merge review.'};entry.sourceHash=row.sourceAfter;
 count+=a.length;
}
report.provenance=[...(report.provenance||[]),{type:'payload-equivalent-prose-review',branch:r.sha,review:dir+'review.json',executedAgain:false,notebooks:count}];
fs.writeFileSync('lib/python-support.json',JSON.stringify(policy,null,2)+'\n');fs.writeFileSync('docs/deployment/python-expansion-local.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({pass:true,notebooks:count,executedAgain:false}));
