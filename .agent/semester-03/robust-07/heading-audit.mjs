import {readFileSync,writeFileSync} from 'node:fs';
import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const h=await renderedHeadings(readFileSync('content/robust/mu-analysis.mdx','utf8'),'robust/mu-analysis');
writeFileSync('.agent/semester-03/robust-07/headings-after.json',JSON.stringify(h,null,2));console.log('Compiled new headings',h.headings.filter(x=>x.level===2).length);
