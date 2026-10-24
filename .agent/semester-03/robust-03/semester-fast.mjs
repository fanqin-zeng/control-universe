// Same semester validator and file checks; batch genuine Git object/ancestry reads to avoid hundreds of Windows process launches.
import childProcess from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const original=childProcess.execFileSync;
const text=readFileSync('.agent/semester-03-checklist.md','utf8');
const hashes=[...new Set([...text.matchAll(/commit:([a-f0-9]{7,40})/g)].map(m=>m[1]))];
const objects=original('git',['cat-file','--batch-check'],{input:hashes.map(h=>h+'^{commit}').join('\n')+'\n',encoding:'utf8'}).trim().split('\n');
assert.equal(objects.length,hashes.length);
const resolved=new Map();
for(const [i,line] of objects.entries()){const [sha,type]=line.split(' ');assert.equal(type,'commit',hashes[i]);resolved.set(hashes[i],sha);}
const ancestors=new Set(original('git',['rev-list','master'],{encoding:'utf8'}).trim().split('\n'));
childProcess.execFileSync=function(command,args,options){
 if(command==='git'&&args[0]==='rev-parse'&&args[1]==='--verify'&&args[2]?.endsWith('^{commit}')){assert(resolved.has(args[2].slice(0,-9)));return Buffer.from(resolved.get(args[2].slice(0,-9))+'\n');}
 if(command==='git'&&args[0]==='merge-base'&&args[1]==='--is-ancestor'&&args[3]==='master'){assert(ancestors.has(resolved.get(args[2])),args[2]+' not on master');return Buffer.alloc(0);}
 return original(command,args,options);
};
syncBuiltinESMExports();
process.argv[1]=resolve('scripts/check-semester03.mjs');
console.log('Actual Git batch checks:',hashes.length,'commit references,',ancestors.size,'master ancestors');
await import(pathToFileURL(process.argv[1]).href);
