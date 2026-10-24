const fs=require('node:fs'),ts=require('typescript'),Module=require('node:module'),assert=require('node:assert/strict');
const path='lib/h-infinity-filter.ts',m=new Module(require('node:path').resolve(path));m._compile(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,path);
const {filterReadings,filterFrequency,filterPulseRatio,filterDefault}=m.exports,cases=[];
for(const a of [-2,-1,-.05,0,.5,1])for(const gain of [0,.5,1,4,8])for(const q of [.1,.25,1,2])for(const r of [.1,.25,1,2]){
 const p={a,gain,q,r};cases.push({p,r:filterReadings(p),frequencies:[0,.1,1,10].map(w=>({w,value:filterFrequency(p,w)})),pulses:[.2,2,20].map(T=>({T,value:filterPulseRatio(p,T)}))});
}
const outside={a:-.05,gain:400,q:2,r:.1};cases.push({p:outside,r:filterReadings(outside),frequencies:[],pulses:[]});
assert.equal(filterReadings(filterDefault).hinfGain,4);assert.equal(filterReadings({...filterDefault,a:0}).hinfGain,null);assert.equal(filterReadings({...filterDefault,a:1,gain:.5}).peak,null);
fs.writeFileSync('.agent/semester-03/robust-09/actual-ts.json',JSON.stringify({default:filterReadings(filterDefault),cases},null,2));console.log('PASS actual TS',cases.length,'configurations, four frequencies/three complete-tail pulses, stable/critical/unstable and out-of-display optimum');
