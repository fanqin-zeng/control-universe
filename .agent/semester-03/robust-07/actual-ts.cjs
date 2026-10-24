const fs=require('node:fs'),ts=require('typescript'),Module=require('node:module'),assert=require('node:assert/strict');
const path='lib/mu-analysis.ts',m=new Module(require('node:path').resolve(path));m._compile(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,path);
const {muReadings,muDefault}=m.exports,cases=[];
for(const b of [0,.25,1,2,4])for(const c of [-1,-.125,0,.125,.5,1])for(const d of [.05,.25,1,3])for(const frequency of [0,.25,1,4])for(const structure of ['diagonal','full']){const p={b,c,d,frequency,structure};cases.push({p,r:muReadings(p)});}
assert.equal(muReadings(muDefault).mu,.5);assert.equal(muReadings({...muDefault,structure:'full'}).mu,2);assert.equal(muReadings({...muDefault,c:0}).radius,null);assert.equal(muReadings({...muDefault,c:.5}).certified,false);
fs.writeFileSync('.agent/semester-03/robust-07/actual-ts.json',JSON.stringify({default:muReadings(muDefault),cases},null,2));console.log('PASS real TS 960 parameter/structure configurations, including zeros, signed coupling, both modes and boundary');
