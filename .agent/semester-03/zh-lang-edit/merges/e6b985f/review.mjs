import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {extractNotebooks} from '../../../../../scripts/lib-mdx.mjs';import {renderedHeadings} from '../../../../../scripts/rendered-headings.mjs';
const dir='.agent/semester-03/zh-lang-edit/merges/e6b985f/',start='c134eee1df4e12f4714a27a34ffa339a11865e44';
const paths=['math/calculus-basics','nonlinear/adaptive-control-basics','nonlinear/iss-small-gain','nonlinear/switched-hybrid-systems','nonlinear/bifurcation-chaos'];
const hash=s=>createHash('sha256').update(s).digest('hex'),git=(...a)=>execFileSync('git',a,{encoding:'utf8',maxBuffer:20e6}).replace(/\r\n/g,'\n');
const math=s=>[...s.matchAll(/^\$\$\s*\n([\s\S]*?)^\$\$\s*$/gm)].map(m=>m[1].replace(/\s/g,'').replace(/(?<![\d])\.(\d)/g,'0.$1'));
const inline=s=>[...s.matchAll(/(?<!\$)\$(?!\$)([^$\n]+)\$(?!\$)/g)].map(m=>m[1].replace(/\s/g,'').replace(/(?<![\d])\.(\d)/g,'0.$1'));
const links=s=>[...s.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]),components=s=>[...s.matchAll(/<([A-Z]\w*)\b/g)].map(m=>m[1]);
const rows=[];
for(const key of paths){const path='content/'+key+'.mdx',before=git('show',start+':'+path),after=fs.readFileSync(path,'utf8').replace(/\r\n/g,'\n');const a=extractNotebooks(before),b=extractNotebooks(after);
 const code=ns=>ns.map(n=>({setup:n.setup?.value||'',cells:n.cells.map(c=>c.value)}));assert.deepEqual(code(b),code(a),key+' code');assert.deepEqual(math(after),math(before),key+' display math');assert.deepEqual(links(after),links(before),key+' links');assert.deepEqual(components(after),components(before),key+' components');
 const ia=inline(after.replace('分别对应$\\mathcal{KL}$与$\\mathcal K$','')),ib=inline(before);if(key==='nonlinear/adaptive-control-basics'){const i=ia.indexOf('\\gamma=50,\\sigma=0');assert.deepEqual(ia.slice(i-2,i),['\\gamma','\\sigma']);ia.splice(i-2,2);}assert.deepEqual(ia,ib,key+' inline math (explicit prose labels KL/K and gamma/sigma reviewed)');const A=await renderedHeadings(before,key),B=await renderedHeadings(after,key);assert.deepEqual(B.h2,A.h2);const aliases=[...after.matchAll(/<span id="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(A.ids.filter(id=>!B.ids.includes(id)&&!aliases.includes(id)),[]);assert.equal(new Set(B.ids).size,B.ids.length);
 rows.push({key,path,sourceBefore:hash(before),sourceAfter:hash(after),codeHash:hash(JSON.stringify(code(a))),notebooks:a.length,cells:a.reduce((n,x)=>n+x.cells.length,0),titleChanges:b.flatMap((n,i)=>n.title===a[i].title?[]:[{before:a[i].title,after:n.title}]),h2:B.h2,changed:before!==after});
}
const r={pass:true,branch:'e6b985fceccc266c07a6f58483e746e34d85be0b',start,lessons:rows.length,changedLessons:rows.filter(x=>x.changed).length,rows};fs.writeFileSync(dir+'review.json',JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify({...r,rows:undefined}));
