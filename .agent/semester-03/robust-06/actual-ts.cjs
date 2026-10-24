const fs=require('node:fs'),ts=require('typescript'),Module=require('node:module'),assert=require('node:assert/strict');
const p='lib/mixed-sensitivity.ts',m=new Module(require('node:path').resolve(p));m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,p);
const {mixedDefault,mixedReadings,mixedFrequency}=m.exports,cases=[];
for(const a of [5,20,30,60])for(const k of [20,100,200,450,900])for(const rho of [.01,.1,.2])for(const wb of [.5,5,10]){const p={a,k,rho,wb};cases.push({p,readings:mixedReadings(p),frequency:[0,.0001,.5,1,10,100,10000].map(w=>({w,...mixedFrequency(p,w)}))});}
assert(mixedReadings(mixedDefault).stable);fs.writeFileSync('.agent/semester-03/robust-06/actual-ts.json',JSON.stringify({default:mixedReadings(mixedDefault),cases},null,2));console.log('PASS actual TS 180 parameter configurations / 1260 frequency points / 4001 point readings');
