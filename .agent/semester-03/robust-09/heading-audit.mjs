import {readFileSync,writeFileSync} from 'node:fs';
import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const h=await renderedHeadings(readFileSync('content/robust/h-infinity-filter.mdx','utf8'),'robust/h-infinity-filter');
writeFileSync('.agent/semester-03/robust-09/headings-after.json',JSON.stringify(h,null,2));console.log('Compiled headings',h.h2.length);
