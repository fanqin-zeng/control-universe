import fs from 'node:fs';import assert from 'node:assert/strict';import {extractNotebooks} from '../../../../../scripts/lib-mdx.mjs';import {createHash} from 'node:crypto';
const dir='.agent/semester-03/zh-lang-edit/merges/e6b985f/',r=JSON.parse(fs.readFileSync(dir+'review.json','utf8'));assert(r.pass);
const policy=JSON.parse(fs.readFileSync('lib/python-support.json','utf8')),report=JSON.parse(fs.readFileSync('docs/deployment/python-expansion-local.json','utf8'));let notebooks=0;
for(const row of r.rows.filter(x=>x.changed)){
 const p=policy.lessons[row.key],proof=report.lessons.find(x=>x.key===row.key);assert.equal(p.sourceHash,row.sourceBefore);assert.equal(proof.sourceHash,row.sourceBefore);
 const nbs=extractNotebooks(fs.readFileSync(row.path,'utf8').replace(/\r\n/g,'\n')),code=nbs.map(n=>({setup:n.setup?.value||'',cells:n.cells.map(c=>c.value)}));assert.equal(createHash('sha256').update(JSON.stringify(code)).digest('hex'),row.codeHash);
 proof.executedSourceHash=proof.executedSourceHash||proof.sourceHash;proof.sourceHash=p.sourceHash=row.sourceAfter;proof.sourceReview={review:dir+'review.json',codeHash:row.codeHash,executedAgain:false,reason:'Setup/cell bytes identical; one adaptive experiment title typo corrected, no numerical change.'};
 nbs.forEach((nb,i)=>{p.notebooks[i].title=nb.title;proof.notebooks[i].title=nb.title;});notebooks+=nbs.length;
}
report.provenance.push({type:'code-equivalent-prose-review',branch:r.branch,review:dir+'review.json',executedAgain:false,notebooks});
fs.writeFileSync('lib/python-support.json',JSON.stringify(policy,null,2)+'\n');fs.writeFileSync('docs/deployment/python-expansion-local.json',JSON.stringify(report,null,2)+'\n');
const path='docs/deployment/pyodide-math-reference-meta.json',meta=JSON.parse(fs.readFileSync(path,'utf8')),row=r.rows.find(x=>x.key==='math/calculus-basics');assert.equal(meta.sourceHashes[row.key],row.sourceBefore);meta.sourceHashes[row.key]=row.sourceAfter;meta.sourceReview={review:dir+'review.json',executedAgain:false,reason:'Exact setup/cell equality; historical numeric reference retained.'};fs.writeFileSync(path,JSON.stringify(meta,null,2)+'\n');console.log({pass:true,notebooks,executedAgain:false});
