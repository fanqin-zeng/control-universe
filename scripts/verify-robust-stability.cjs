const ts=require('typescript'),fs=require('node:fs'),assert=require('node:assert/strict');
const code=ts.transpileModule(fs.readFileSync('lib/robust-stability.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const mod={exports:{}};new Function('module','exports',code)(mod,mod.exports);
const {robustStabilityPoint:point}=mod.exports,cases=[];
for(const K of [.5,2,4,6,10])for(const b of [.2,.5,Math.sqrt(1.5)-Math.sqrt(.5),.6,1])for(const N of [100,1379,5000,10000]){
 const p=point(K,b,N);for(const key of ['alpha','gm','gmDB','pMin','qMax','zeroUpper'])assert(Number.isFinite(p[key]));
 assert(p.zeroUpper>0&&p.zeroUpper<1);cases.push(p);
}
assert.equal(point(6,.6,5000).quadratic,'strict');assert(Math.abs(point(6,.6,5000).alpha)<1e-12);
fs.writeFileSync('.agent/semester-03/robust-03/actual-ts.json',JSON.stringify({default:point(4,.6,5000),cases},null,2)+'\n');
console.log('PASS actual TypeScript: '+cases.length+' parameter cases, finite values and strict boundary semantics');
