import fs from 'node:fs';import ts from 'typescript';import {spawnSync} from 'node:child_process';
const out='.agent/semester-03/mpc-08';const p=spawnSync(process.execPath,['scripts/nb-cells.mjs','extract','mpc/nonlinear-mpc','--out',out+'/extracted.json'],{stdio:'inherit'});if(p.status!==0)process.exit(p.status??1);
const js=ts.transpileModule(fs.readFileSync('lib/nonlinear-mpc.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText;const m=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const cases=[];for(const theta of [0,.1,.5,1,1.5,2,2.6,2.8])for(const N of [4,8,16])for(const Q of [1,10,20])for(const limit of [1,5,8])for(const iterations of [1,60]){const c={theta,N,Q,limit,iterations};cases.push({c,result:m.solveNmpc(c)});}
fs.writeFileSync(out+'/ts-cases.json',JSON.stringify(cases));const r=spawnSync('python',[out+'/reference.py'],{stdio:'inherit',env:{...process.env,MPLBACKEND:'Agg'}});process.exit(r.status??1);
