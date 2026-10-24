import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const E='.agent/semester-03/robust-08/';
const before=await renderedHeadings(readFileSync(E+'source-before.mdx','utf8'),'robust/mu-synthesis');
const after=await renderedHeadings(readFileSync('content/robust/mu-synthesis.mdx','utf8'),'robust/mu-synthesis');
for(const h of before.headings)assert(after.headings.some(n=>n.level===h.level&&n.id===h.id),'lost '+h.id);
writeFileSync(E+'headings-before.json',JSON.stringify(before,null,2));writeFileSync(E+'headings-after.json',JSON.stringify(after,null,2));console.log('PASS original compiled headings preserved',before.headings.length,'H2',after.h2.length);
