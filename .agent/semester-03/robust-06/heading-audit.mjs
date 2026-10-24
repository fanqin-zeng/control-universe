import {readFileSync,writeFileSync} from 'node:fs';
import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const p='.agent/semester-03/robust-06/';
const old=await renderedHeadings(readFileSync(p+'source-before.mdx.txt','utf8'),'robust/mixed-sensitivity');
const current=await renderedHeadings(readFileSync('content/robust/mixed-sensitivity.mdx','utf8'),'robust/mixed-sensitivity');
writeFileSync(p+'headings-before.json',JSON.stringify(old,null,2));
writeFileSync(p+'headings-after.json',JSON.stringify(current,null,2));
console.log(old.ids.filter(id=>!current.ids.includes(id)));

