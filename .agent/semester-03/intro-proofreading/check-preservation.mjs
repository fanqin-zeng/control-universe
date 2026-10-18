import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {extractNotebooks} from '../../../scripts/lib-mdx.mjs';
const lessons=['math/linear-algebra-basics','math/eigen-decomposition','classic/transfer-function'];
const result=lessons.map(key=>{
const path=`content/${key}.mdx`,before=execFileSync('git',['show',`6a57d07:${path}`],{encoding:'utf8'}),after=readFileSync(path,'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex');
const codeOnly=s=>extractNotebooks(s.replace(/\r\n/g,"\n")).map(n=>({title:n.title,setup:n.setup?{raw:n.setup.raw,value:n.setup.value}:null,cells:n.cells.map(c=>({raw:c.raw,value:c.value}))}));
const beforeNB=JSON.stringify(codeOnly(before)),afterNB=JSON.stringify(codeOnly(after));
const headings=s=>s.replace(/\r\n/g,"\n").match(/^#{1,6} .+$/gm);
if(beforeNB!==afterNB||JSON.stringify(headings(before))!==JSON.stringify(headings(after)))throw Error(`${key}: changed notebook or heading`);
return {key,before:hash(before),after:hash(after),notebooksUnchanged:true,headingsUnchanged:true,notebookHash:hash(afterNB)};
});
writeFileSync('.agent/semester-03/intro-proofreading/preservation.json',JSON.stringify(result,null,2));
console.log('PASS: 3 lessons, all original notebook code and all heading titles unchanged');
