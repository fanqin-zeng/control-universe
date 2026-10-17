import {readFileSync,writeFileSync} from 'node:fs';
import {compileMDX} from 'next-mdx-remote/rsc';
import {headingRemarkPlugins,headingRehypePlugins} from '../lib/mdx-headings.mjs';
import {walk,scanMdx} from './lib-mdx.mjs';
import assert from 'node:assert/strict';
const results=[];
for(const file of walk('content',p=>p.endsWith('.mdx'))){
 const source=readFileSync(file,'utf8'),skips=scanMdx(source).skips;
 const delimiters=[...source.matchAll(/\$\$/g)].filter(m=>!skips.some(s=>m.index>=s.start&&m.index<s.end)).length;
 assert.equal(delimiters%2,0,file);
 let display=0,errors=0;
 const collect=()=>tree=>{function visit(n){const cls=n.properties?.className||[];if(cls.includes('katex-display'))display++;if(cls.includes('katex-error'))errors++;for(const c of n.children||[])visit(c);}visit(tree);};
 await compileMDX({source,options:{parseFrontmatter:true,mdxOptions:{remarkPlugins:headingRemarkPlugins,rehypePlugins:[...headingRehypePlugins(file.replaceAll('\\','/').replace(/^content\//,'').replace(/\.mdx$/,'')),collect]}}});
 assert.equal(errors,0,file+' has KaTeX errors');assert.equal(display,delimiters/2,file+' lost display math');results.push({file,expected:delimiters/2,rendered:display,errors});
}
writeFileSync('.agent/semester-03/math-layout/rendered.json',JSON.stringify({pass:true,files:results.length,formulas:results.reduce((s,r)=>s+r.rendered,0),results},null,2)+'\n');console.log(JSON.stringify({pass:true,files:results.length,formulas:results.reduce((s,r)=>s+r.rendered,0)}));
