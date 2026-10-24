import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {execFileSync} from 'node:child_process';
import {extractNotebooks} from '../../../scripts/lib-mdx.mjs';
const dir='.agent/semester-03/app-01/';
const code=ts.transpileModule(readFileSync('lib/buck-converter.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const box={exports:{}};vm.runInNewContext(code,box);
const cases=[];
for(let k=4;k<=16;k++) for(const r of [3,6,30,78,81,120]) for(const l of [.5,1,1.5,2]) {
  const out=box.exports.buckEstimate(k*.05,r,l);
  cases.push({d:k*.05,r,l,out});
}
writeFileSync(dir+'actual-ts.json',JSON.stringify(cases));
const nbs=extractNotebooks(readFileSync('content/applications/power-electronics.mdx','utf8'));
writeFileSync(dir+'original-notebooks.json',JSON.stringify(nbs));
const printed=execFileSync('python',[dir+'reference.py'],{encoding:'utf8'});
process.stdout.write(printed);
