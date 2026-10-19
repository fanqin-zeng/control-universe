import fs from 'node:fs';import assert from 'node:assert/strict';import {renderedHeadings} from '../../../scripts/rendered-headings.mjs';
const dir='.agent/semester-03/discrete-01/',key='discrete-sampled/discrete-time-freq';
const old=await renderedHeadings(fs.readFileSync(dir+'source-before.mdx','utf8'),key),now=await renderedHeadings(fs.readFileSync('content/'+key+'.mdx','utf8'),key);
assert.deepEqual(now.h2,old.h2);const missing=old.ids.filter(x=>!now.ids.includes(x));assert.deepEqual(missing,[]);
fs.writeFileSync(dir+'headings.json',JSON.stringify({pass:true,old,now,missing},null,2));console.log('PASS all old compiled heading IDs preserved');

