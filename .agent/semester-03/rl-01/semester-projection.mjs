import fs from 'node:fs';
import path from 'node:path';
import {validateSemester03} from '../../../scripts/check-semester03.mjs';
const snapshot=process.argv[2]||'D:/Workspace/control-universe-rank8-rl01';
// Validate projected metadata against real repository files and real master ancestry.
// The runtime copy intentionally has no .git directory.
const result=validateSemester03({plan:fs.readFileSync(path.join(snapshot,'.agent/semester-03-plan.md'),'utf8'),checklist:fs.readFileSync(path.join(snapshot,'.agent/semester-03-checklist.md'),'utf8'),baseline:JSON.parse(fs.readFileSync('.agent/semester-03-baseline.json','utf8')),root:process.cwd()});
console.log(JSON.stringify(result,null,2));
process.exitCode=result.errors.length?1:0;
