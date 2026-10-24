const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript'),Module=require('node:module');
const path='lib/h-infinity.ts',js=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const mod=new Module(require('node:path').resolve(path));mod._compile(js,path);const {hInfinityDefault,hInfinityReadings,hInfinityFrequency}=mod.exports;
const cases=[];for(const gain of [1,5,19,20,30])for(const frequency of [9,10,11])for(const numeratorDamping of [.02,.05,.5])for(const denominatorDamping of [.02,.5])for(const lowpass of [0,.1,.2]){
 const p={gain,frequency,numeratorDamping,denominatorDamping,lowpass};const readings=hInfinityReadings(p);const responses=[.1,1,10,45,100,316].map(w=>({w,...hInfinityFrequency(p,w)}));cases.push({p,readings,responses});
}
const defaults=hInfinityReadings(hInfinityDefault);assert(defaults.stable);assert(hInfinityReadings({gain:20,frequency:10,numeratorDamping:.5,denominatorDamping:.02,lowpass:0}).unstable);
fs.writeFileSync('.agent/semester-03/robust-05/actual-ts.json',JSON.stringify({cases,default:defaults},null,2));console.log('PASS actual TS '+cases.length+' parameter cases / '+cases.length*6+' frequency points / 2001-point readings');
