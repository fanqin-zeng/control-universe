import fs from 'node:fs';import assert from 'node:assert/strict';import {validateSemester03} from '../../../scripts/check-semester03.mjs';
const snap='D:/Workspace/control-universe-rank1-impl04-validation/';
const r=validateSemester03({plan:fs.readFileSync(snap+'css-final-plan.md','utf8'),checklist:fs.readFileSync(snap+'css-final-checklist.md','utf8'),baseline:JSON.parse(fs.readFileSync('.agent/semester-03-baseline.json','utf8')),root:process.cwd(),evidence:true});
fs.writeFileSync('.agent/semester-03/impl-04/css-semester.json',JSON.stringify(r,null,2)+'\n');assert.deepEqual(r.errors,[]);console.log(JSON.stringify(r));
