const fs=require('node:fs'),ts=require('typescript'),Module=require('node:module'),assert=require('node:assert/strict');
const path='lib/delay-robust-control.ts',m=new Module(require('node:path').resolve(path));m._compile(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,path);
const {delayDefault,delayReadings,delayFrequency,delayTrace}=m.exports,cases=[],traces=[];
for(const a of [.5,1,2])for(const k of [0,.5,1,2,4])for(const tau of [0,.02,.5,1,1.5,2]){const p={a,k,tau};cases.push({p,r:delayReadings(p),frequency:[0,.1,1,2,8,40].map(w=>({w,...delayFrequency(p,w)}))});}
const tc=delayReadings(delayDefault).exactMargin;
const params=[{a:1,k:2,tau:0},{a:1,k:2,tau:.02},{a:1,k:2,tau:.5},{a:1,k:2,tau:1},{a:1,k:2,tau:tc},{a:1,k:2,tau:1.5},{a:1,k:2,tau:2},{a:1,k:.5,tau:1},{a:1,k:1,tau:2},{a:.5,k:4,tau:.5},{a:2,k:4,tau:1},{a:2,k:0,tau:2}];
for(const p of params){const coarse=delayTrace(p),fine=delayTrace(p,12,.0025);const pick=v=>v.time.map((t,i)=>i%20===0||i===v.time.length-1?{t,x:v.x[i],pade:v.pade[i]}:null).filter(Boolean);traces.push({p,coarse:pick(coarse),fine:pick(fine),coarseStep:coarse.step,fineStep:fine.step});}
assert.equal(delayReadings({...delayDefault,tau:1}).state,'stable');assert.equal(delayReadings({...delayDefault,tau:1.5}).state,'unstable');assert.equal(delayReadings({...delayDefault,tau:tc}).state,'critical');assert.equal(delayReadings({...delayDefault,tau:delayReadings(delayDefault).sgMargin}).certified,false);
fs.writeFileSync('.agent/semester-03/robust-10/actual-ts.json',JSON.stringify({default:delayReadings(delayDefault),cases,traces},null,2));console.log('PASS real TS',cases.length,'analytic configurations and',traces.length,'history/Padé traces with step halving');
