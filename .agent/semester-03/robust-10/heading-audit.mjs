import {readFileSync,writeFileSync} from 'node:fs';
import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const h=await renderedHeadings(readFileSync('content/robust/delay-robust-control.mdx','utf8'),'robust/delay-robust-control');
writeFileSync('.agent/semester-03/robust-10/headings-after.json',JSON.stringify(h,null,2));console.log('Compiled headings',h.h2.length);
