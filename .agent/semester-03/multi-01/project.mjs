// Produce a reviewable HEAD + MULTI-01 snapshot without copying parallel drafts.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const target=process.argv[2];if(!target)throw Error('Absolute projection directory required');
const own=['.agent/semester-03/multi-01','content/multi-agent/multi-agent-overview.mdx','components/wiki/multi-agent-overview-explorer.tsx','lib/multi-agent-overview.ts','public/diagrams/multi-agent/physical-information.svg','docs/discuss-log/semester-03/15-multi-agent/01-multi-agent-overview.md'];
for(const p of own){const dest=path.join(target,p);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.cpSync(p,dest,{recursive:true});}
const read=p=>fs.readFileSync(p,'utf8'),get=p=>read(path.join(target,p)),put=(p,s)=>fs.writeFileSync(path.join(target,p),s);
function row(file,marker){const src=read(file).split(/\r?\n/).find(l=>l.includes(marker));if(!src)throw Error(marker);return src;}
function replaceRow(file,marker){const s=get(file).split(/\r?\n/).map(l=>l.includes(marker)?row(file,marker):l).join('\n');put(file,s);}
for(const [file,marker]of [['.agent/semester-03-checklist.md','| MULTI-01 |'],['.agent/semester-03/zh-lang-edit/PLAN.md','| MULTI-01 |'],['.agent/delivery-tracker.md','multi-agent-overview']])replaceRow(file,marker);
let file='content/catalog.ts',src=read(file),base=get(file);
const token='"slug": "multi-agent-overview"';
const a=src.indexOf(token),b=src.indexOf('\n      },',a),c=base.indexOf(token),d=base.indexOf('\n      },',c);
put(file,base.slice(0,c)+src.slice(a,b)+base.slice(d));
file='lib/wiki-components.ts';base=get(file);if(!base.includes('import { MultiAgentOverviewExplorer }'))base='import { MultiAgentOverviewExplorer } from "@/components/wiki/multi-agent-overview-explorer";\n'+base;if(!/\n\s*MultiAgentOverviewExplorer,/.test(base))base=base.replace('export const wikiComponents: MDXComponents = {','export const wikiComponents: MDXComponents = {\n  MultiAgentOverviewExplorer,');put(file,base);
file='.agent/semester-03-plan.md';base=get(file);const entry=row(file,'| MULTI-01 | IMPL-');if(!base.includes(entry))base=base.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',entry+'\n<!-- S3-ORDER-EXCEPTIONS-END -->');
src=read(file);const start=src.indexOf('### MULTI-01执行回执'),stop=src.indexOf('\n### ',start+4);if(!base.includes('### MULTI-01执行回执'))base+='\n\n'+src.slice(start,stop<0?undefined:stop);put(file,base);
execFileSync(process.execPath,['.agent/semester-03/multi-01/register-browser-proof.mjs'],{cwd:target,stdio:'inherit'});
console.log('Projection created from archive + scoped MULTI-01 paths');
