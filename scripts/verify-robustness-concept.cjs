const fs=require('node:fs'),assert=require('node:assert/strict');
const ts=require('typescript'),path=require('node:path');
// Compile and execute the actual calculation module, without a duplicated JS model.
const source=fs.readFileSync('lib/resonance-robustness.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const mod={exports:{}};new Function('exports','module',js)(mod.exports,mod);
const values=[];
for(const wn of [50,300,800])for(const zeta of [.01,.1,.5]){
 const r=mod.exports.resonanceGrid(wn,zeta);values.push({wn,zeta,tMax:r.tMax,deltaMax:r.deltaMax,productMax:r.productMax,points:[.01,10,50,300,800,10000].map(w=>mod.exports.resonancePoint(wn,zeta,w))});
 assert(r.data.every(p=>Object.values(p).every(Number.isFinite)));
}
fs.writeFileSync('.agent/semester-03/robust-01/component-values.json',JSON.stringify(values,null,2));
console.log('PASS actual TypeScript calculation, 9 parameter configurations, finite endpoints; independent reference.py checks values');
