const fs=require('node:fs'),cp=require('node:child_process');
const directory='.agent/semester-03/driving-01';
const commands=[
 ['check-catalog.mjs',[],'staged-check.log'],
 ['check-python-support.mjs',[],'staged-python-policy.log'],
 ['format-display-math.mjs',['--check'],'staged-math.log'],
 ['glossary.mjs',['check'],'staged-glossary.log'],
 ['check-semester03.mjs',[],'staged-semester.log'],
 ['verify-lesson.mjs',['autonomous-driving/driving-system'],'staged-verify.log'],
 ['nb-cells.mjs',['verify','autonomous-driving/driving-system','--require-kernel','--port','18914','--out',directory+'/staged-notebooks.json'],'staged-notebooks.log'],
];
const results=[];
for(const [file,args,log]of commands){const run=cp.spawnSync(process.execPath,['scripts/'+file,...args],{encoding:'utf8',maxBuffer:30*1024*1024,env:{...process.env,WIKI_VERIFY_PORT:'18114',GIT_DIR:'D:/Workspace/control-universe/.git'}});fs.writeFileSync(directory+'/'+log,(run.stdout||'')+(run.stderr||''));const result={command:'node scripts/'+file+' '+args.join(' '),exitCode:run.status,error:run.error?String(run.error):null};results.push(result);console.log(JSON.stringify(result));if(run.status!==0)break;}
fs.writeFileSync(directory+'/staged-commands.json',JSON.stringify(results,null,2));
if(results.length!==commands.length||results.some(r=>r.exitCode!==0))process.exitCode=1;
