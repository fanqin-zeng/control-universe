import {readFileSync,writeFileSync} from 'node:fs';
import {walk,scanMdx,extractNotebooks} from './lib-mdx.mjs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const hash=s=>createHash('sha256').update(s).digest('hex');
const stripPrefix=s=>s.replace(/^[ \t]*(?:>[ \t]*)*/,'');
const canonical=s=>s.replace(/\n[ \t]*(?:>[ \t]*)*/g,'');
const notebooks=s=>extractNotebooks(s).map(n=>({title:n.title,setup:n.setup?.value,cells:n.cells.map(c=>c.value)}));
const report={files:[],total:0};
const rootIndex=process.argv.indexOf('--root'),root=rootIndex<0?'content':process.argv[rootIndex+1];
assert(root);if(process.argv.includes('--write'))assert.equal(root,'content','Writes are limited to the course directory');
for(const file of walk(root,p=>p.endsWith('.mdx'))){
 const source=readFileSync(file,'utf8'),eol=source.includes('\r\n')?'\r\n':'\n',lf=source.replace(/\r\n/g,'\n'),skips=scanMdx(lf).skips;
 const active=[...lf.matchAll(/\$\$/g)].filter(m=>!skips.some(s=>m.index>=s.start&&m.index<s.end));
 const offsets=[];for(const m of active){const start=lf.lastIndexOf('\n',m.index-1)+1,end=lf.indexOf('\n',m.index);const line=lf.slice(start,end<0?lf.length:end);if(stripPrefix(line).trim()!=='$$')offsets.push({offset:m.index,line:lf.slice(0,start).split('\n').length,text:line});}
 if(!offsets.length)continue;
 if(!process.argv.includes('--write')){report.files.push({file,count:offsets.length,samples:offsets.slice(0,3)});report.total+=offsets.length;continue;}
 let changed=lf;for(const {offset}of [...offsets].reverse()){
  const before=changed.slice(0,offset),after=changed.slice(offset+2),lineStart=before.lastIndexOf('\n')+1,lineEnd=after.indexOf('\n');
  const prefix=before.slice(lineStart),suffix=after.slice(0,lineEnd<0?after.length:lineEnd),indent=prefix.match(/^[ \t]*(?:>[ \t]*)*/)[0];
  changed=before+(stripPrefix(prefix).trim()?'\n'+indent:'')+'$$'+(suffix.trim()?'\n'+indent:'')+after;
 }
 assert.equal(canonical(changed),canonical(lf),'Only line breaks and continuation prefixes may change');
 assert.deepEqual(notebooks(changed),notebooks(lf),'Notebook payload changed');
 writeFileSync(file,changed.replace(/\n/g,eol));report.files.push({file,tokens:offsets.length,beforeHash:hash(lf),afterHash:hash(changed),notebookHash:hash(JSON.stringify(notebooks(lf)))});report.total+=offsets.length;
}
if(process.argv.includes('--check'))assert.equal(report.files.length,0,'Display math delimiters must occupy their own lines');
else writeFileSync('.agent/semester-03/math-layout/'+(process.argv.includes('--write')?'format-results.json':'inventory.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({files:report.files.length,tokens:report.total}));
