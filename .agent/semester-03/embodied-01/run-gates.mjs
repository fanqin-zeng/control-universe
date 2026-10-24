import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const directory='.agent/semester-03/embodied-01';
const env={...process.env,WIKI_VERIFY_PORT:'18113',PYTHONUTF8:'1',JUPYTER_PORT:'18913',GIT_DIR:'D:/Workspace/control-universe/.git',GIT_WORK_TREE:process.cwd()};
const plan=process.argv.includes('--metadata')?[
 ['check-fix','scripts/check-catalog.mjs',['--fix-outline','--fix-tracker-stats']],
 ['check','scripts/check-catalog.mjs',[]],
 ['semester','scripts/check-semester03.mjs',[]],
 ['python-policy','scripts/check-python-support.mjs',[]],
]:process.argv.includes('--build')?[
 ['build','node_modules/next/dist/bin/next',['build']],
]:[
 ['check-fix','scripts/check-catalog.mjs',['--fix-outline','--fix-tracker-stats']],
 ['check','scripts/check-catalog.mjs',[]],
 ['semester','scripts/check-semester03.mjs',[]],
 ['math','scripts/format-display-math.mjs',['--check','--root','content/embodied']],
 ['notebook','scripts/nb-cells.mjs',['verify','embodied/embodied-systems','--port','18913','--require-kernel']],
 ['page','scripts/verify-lesson.mjs',['embodied/embodied-systems']],
 ['glossary','scripts/glossary.mjs',['check']],
 ['types','node_modules/typescript/bin/tsc',['--noEmit']],
];
let failed=false;
for(const [name,file,args] of plan){
 console.log('START '+name);
 const result=spawnSync(process.execPath,[file,...args],{env,encoding:'utf8',maxBuffer:30*1024*1024});
 const output=(result.stdout||'')+(result.stderr||'')+(result.error?'\n'+result.error:'');
 fs.writeFileSync(`${directory}/${name}.log`,`$ node ${file} ${args.join(' ')}\nexit=${result.status}\n${output}`);
 console.log(name+' exit='+result.status+' '+output.split(/\r?\n/).filter(l=>/FAIL|PASS|判定|退出码|通过|Error/.test(l)).slice(-5).join(' | '));
 // The generator reports the pre-fix inconsistencies; the following clean check is the gate.
 if(result.status!==0&&name!=='check-fix')failed=true;
}
process.exitCode=failed?1:0;
