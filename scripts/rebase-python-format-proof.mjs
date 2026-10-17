/** Preserve executed-code proof for an explicitly verified, newline-only source edit. Never use for code changes. */
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {extractNotebooks} from './lib-mdx.mjs';
import {pythonInventory} from './python-inventory.mjs';
const base=process.argv[2];assert.match(base||'',/^[0-9a-f]{7,40}$/);
const commit=execFileSync('git',['rev-parse',base],{encoding:'utf8'}).trim();execFileSync('git',['merge-base','--is-ancestor',commit,'HEAD']);
const hash=s=>createHash('sha256').update(s).digest('hex');
const payload=s=>extractNotebooks(s).map(n=>({title:n.title,setup:n.setup?.value,cells:n.cells.map(c=>c.value)}));
const canonical=s=>s.replace(/\n[ \t]*(?:>[ \t]*)*/g,'');
const inventory=pythonInventory(),policy=JSON.parse(readFileSync('lib/python-support.json','utf8')),proof=JSON.parse(readFileSync('docs/deployment/python-expansion-local.json','utf8'));
const format=JSON.parse(readFileSync('.agent/semester-03/math-layout/format-results.json','utf8'));
const report={baseCommit:commit,kind:'format-only-proof-transfer',executedAgain:false,changes:[]};
for(const lesson of inventory){
 const p=policy.lessons[lesson.key],r=proof.lessons.find(l=>l.key===lesson.key);assert(p&&r);
 if(p.sourceHash===lesson.sourceHash){assert.equal(r.sourceHash,lesson.sourceHash);continue;}
 const file='content/'+lesson.key+'.mdx',old=execFileSync('git',['show',commit+':'+file],{encoding:'utf8'}).replace(/\r\n/g,'\n'),current=readFileSync(file,'utf8').replace(/\r\n/g,'\n');
 assert.equal(hash(old),p.sourceHash);assert.equal(hash(old),r.sourceHash);
 const f=format.files.find(f=>f.file.replaceAll('\\','/')===file);assert(f);assert.equal(f.beforeHash,hash(old));assert.equal(f.afterHash,hash(current));
 assert.equal(canonical(old),canonical(current),'Non-format content changed: '+file);
 assert.deepEqual(payload(old),payload(current),'Executable notebook changed: '+file);
 const evidence={lesson:lesson.key,fromSourceHash:hash(old),toSourceHash:hash(current),notebookPayloadHash:hash(JSON.stringify(payload(current))),baseCommit:commit,method:'newline-and-quote-continuation-only; exact setup/cell equality'};
 r.executedSourceHash??=r.sourceHash;r.formattingProvenance=[...(r.formattingProvenance||[]),evidence];r.sourceHash=lesson.sourceHash;p.sourceHash=lesson.sourceHash;report.changes.push(evidence);
}
// Negative controls: a formula or executable edit cannot pass the source-equivalence gate.
assert.notEqual(canonical('$$\nx+1\n$$'),canonical('$$\nx+2\n$$'));
assert.notDeepEqual(payload('<JupyterNotebook setupCode={`x=1`} cells={[{code:`print(x)`}]} />'),payload('<JupyterNotebook setupCode={`x=2`} cells={[{code:`print(x)`}]} />'));
const pending=JSON.parse(readFileSync('docs/deployment/python-expansion-pending.json','utf8'));
for(const p of pending){const l=inventory.find(l=>l.key===p.lesson);p.line=l.notebooks.find(n=>n.id===p.id).line;}
proof.provenance=[...(proof.provenance||[]),{kind:report.kind,baseCommit:commit,evidence:'.agent/semester-03/math-layout/python-proof-transfer.json',executedAgain:false}];
writeFileSync('lib/python-support.json',JSON.stringify(policy,null,2)+'\n');
writeFileSync('docs/deployment/python-expansion-local.json',JSON.stringify(proof,null,2)+'\n');
writeFileSync('docs/deployment/python-expansion-pending.json',JSON.stringify(pending,null,2)+'\n');
writeFileSync('.agent/semester-03/math-layout/python-proof-transfer.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({unchangedNotebookLessons:inventory.length,transferred:report.changes.length,executedAgain:false,negativeControls:'passed'}));
