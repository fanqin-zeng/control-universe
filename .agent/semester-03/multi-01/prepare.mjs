import fs from 'node:fs';
const key='multi-agent-overview', final=process.argv.includes('--final');
const titles=['从三辆小车出发','对象和信息分开建模','局部反馈怎样连成整体','一致不等于完成任务','通信结构改变结果','从理想协议走向实现','习题','答案'];
let p='content/catalog.ts',s=fs.readFileSync(p,'utf8');
const start=s.indexOf('"slug": "'+key+'"'),end=s.indexOf('\n      },',start);
let section=s.slice(start,end);
section=section.replaceAll('"id":','"slug":');
section=section.replace(/"status": "[^"]+"/,'"status": "'+(final?'v1.3':'draft')+'"');
if(!section.includes('"subsections"'))section=section.replace('"prereq":', '"subsections": '+JSON.stringify(titles.map(title=>({title,slug:title})),null,2).split('\n').join('\n        ')+',\n        "prereq":');
s=s.slice(0,start)+section+s.slice(end);fs.writeFileSync(p,s);
p='lib/wiki-components.ts';s=fs.readFileSync(p,'utf8');
if(!s.includes('import { MultiAgentOverviewExplorer }'))s='import { MultiAgentOverviewExplorer } from "@/components/wiki/multi-agent-overview-explorer";\n'+s;
if(!/\n\s*MultiAgentOverviewExplorer,/.test(s))s=s.replace('export const wikiComponents: MDXComponents = {','export const wikiComponents: MDXComponents = {\n  MultiAgentOverviewExplorer,');
fs.writeFileSync(p,s);
if(final){p='.agent/delivery-tracker.md';s=fs.readFileSync(p,'utf8');s=s.split('\n').map(l=>l.includes('multi-agent-overview')?l.replace('[ ]','[x]'):l).join('\n');fs.writeFileSync(p,s);}
p='.agent/semester-03-checklist.md';s=fs.readFileSync(p,'utf8');s=s.replace(/^\| MULTI-01 \|.*$/m,l=>l.includes('docs/discuss-log/')?l.replace('8299','8499'): '| MULTI-01 | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | docs/discuss-log/semester-03/15-multi-agent/01-multi-agent-overview.md;.agent/semester-03/multi-01/acceptance.md;rank9独立副本，8199/8999/8499 |');fs.writeFileSync(p,s);
p='.agent/semester-03-plan.md';s=fs.readFileSync(p,'utf8');
if(!s.includes('| MULTI-01 | IMPL-')){
 const all=fs.readFileSync('.agent/semester-03-checklist.md','utf8').split('\n');let prior=[],seen=false;
 for(const l of all){if(l.startsWith('| MATH-01 |'))seen=true;if(l.startsWith('| MULTI-01 |'))break;if(seen&&/^\| [A-Z]+-\d+ \|/.test(l)&&!l.includes('| [x] | [x] | [x] | [x] | [x] | [x] |'))prior.push(l.split('|')[1].trim());}
 const entry='| MULTI-01 | '+prior.join(';')+' | 2026-10-24用户明确指定继续MULTI-01，rank9；保留其它会话检查点，仅依赖已交付图论与状态空间 | .agent/semester-03/multi-01/acceptance.md |\n';
 s=s.replace('<!-- S3-ORDER-EXCEPTIONS-END -->',entry+'<!-- S3-ORDER-EXCEPTIONS-END -->');fs.writeFileSync(p,s);
}
console.log('MULTI-01 scoped metadata '+(final?'v1.3':'draft'));
