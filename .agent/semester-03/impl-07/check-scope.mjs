import fs from 'node:fs';import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {validateSemester03} from '../../../scripts/check-semester03.mjs';
const root=process.cwd(),snap='D:/Workspace/control-universe-rank1-impl07-validation/';
const receipt=process.argv.includes('--receipt'),git=p=>execFileSync('git',['show','HEAD:'+p],{encoding:'utf8'});
const own=fs.readFileSync('.agent/semester-03-checklist.md','utf8').split(/\r?\n/).find(l=>l.startsWith('| IMPL-07 |'));
const result=validateSemester03({plan:receipt?git('.agent/semester-03-plan.md'):fs.readFileSync(snap+'.agent/semester-03-plan.md','utf8'),checklist:receipt?git('.agent/semester-03-checklist.md').replace(/^\| IMPL-07 \|.*$/m,own):fs.readFileSync(snap+'.agent/semester-03-checklist.md','utf8'),baseline:JSON.parse(fs.readFileSync('.agent/semester-03-baseline.json','utf8')),root,evidence:true});
fs.writeFileSync('.agent/semester-03/impl-07/scoped-semester.json',JSON.stringify(result,null,2)+'\n');assert.deepEqual(result.errors,[]);console.log(JSON.stringify(result));
