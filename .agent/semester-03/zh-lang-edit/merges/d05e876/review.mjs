import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {extractNotebooks} from '../../../../../scripts/lib-mdx.mjs';
import {renderedHeadings} from '../../../../../scripts/rendered-headings.mjs';
const dir='.agent/semester-03/zh-lang-edit/merges/d05e876/',target='d05e876dee7a077d71e0aafe8c279378b3a48182',start='69e43d3c79fcb3d6963d0631ec6932cf9130d8be';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:30e6}).replace(/\r\n/g,'\n');
const sha=git('rev-parse',target).trim(),base=git('merge-base',start,target).trim(),files=git('diff','--name-only',base,sha).trim().split('\n');
assert(files.every(p=>/^content\/.+\.mdx$/.test(p)||/^\.agent\/semester-03\/zh-lang-edit\/(PLAN\.md|records\/[^/]+\.md)$/.test(p)));
const hash=s=>createHash('sha256').update(s).digest('hex');
const payload=s=>extractNotebooks(s).map(n=>({title:n.title,setup:n.setup?.value||'',cells:n.cells.map(c=>c.value)}));
const display=s=>[...s.matchAll(/^\$\$\s*\n([\s\S]*?)^\$\$\s*$/gm)].map(m=>m[1].replace(/\s/g,'').replace(/(?<![\d])\.(\d)/g,'0.$1'));
const components=s=>[...s.matchAll(/<([A-Z]\w*)\b/g)].map(m=>m[1]);
const links=s=>[...s.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);
const working=process.argv.includes('--working');const rows=[];
for(const path of files.filter(p=>p.startsWith('content/'))){
 const before=git('show',start+':'+path),after=working?fs.readFileSync(path,'utf8').replace(/\r\n/g,'\n'):git('show',sha+':'+path),a=payload(before),b=payload(after);assert.deepEqual(b,a,path+' Python payload');assert.deepEqual(display(after),display(before),path+' display math');assert.deepEqual(components(after),components(before),path+' components');assert.deepEqual(links(after),links(before),path+' links');
 const ah=await renderedHeadings(before,path.slice(8,-4)),bh=await renderedHeadings(after,path.slice(8,-4));assert.deepEqual(bh.h2,ah.h2,path+' H2');const aliases=[...after.matchAll(/<span id="([^"]+)"/g)].map(m=>m[1]);const missingIds=ah.ids.filter(id=>!bh.ids.includes(id)&&!aliases.includes(id));if(working)assert.deepEqual(missingIds,[],path+' missing old ids');assert.equal(new Set(bh.ids).size,bh.ids.length,path+' duplicate ids');
 rows.push({path,missingIds,sourceBefore:hash(before),sourceAfter:hash(after),pythonPayloadHash:hash(JSON.stringify(a)),notebooks:a.length,cells:a.reduce((n,b)=>n+b.cells.length,0),h2:bh.h2.length,ids:bh.ids.length});
}
const r={pass:rows.every(r=>r.missingIds.length===0),working,sha,base,files:files.length,lessons:rows.length,records:files.filter(p=>p.includes('/records/')).length,notebooks:rows.reduce((n,r)=>n+r.notebooks,0),cells:rows.reduce((n,r)=>n+r.cells,0),rows};fs.writeFileSync(dir+(working?'review.json':'review-branch.json'),JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify({...r,rows:undefined}));
