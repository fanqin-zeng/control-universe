const fs=require('node:fs'),ts=require('typescript'),Module=require('node:module'),assert=require('node:assert/strict');
const path='lib/mu-synthesis.ts',m=new Module(require('node:path').resolve(path));m._compile(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,path);
const {dkReadings,dkKStep,dkTrace,dkDefault}=m.exports,cases=[],steps=[];
for(let i=0;i<=100;i++)for(const d of [.25,.5,1,1.5,2])for(const frequency of [0,.25,1,10]){const p={k:i/100,d,frequency};cases.push({p,r:dkReadings(p)});}
for(let i=0;i<=100;i++){const d=.25+1.75*i/100;steps.push({d,k:dkKStep(d)});}
const traces=[.25,.5,1,2].map(d=>({d,rows:dkTrace(d)}));
assert.equal(dkReadings(dkDefault).upper,1.25);assert.equal(dkKStep(.25),0);assert(Math.abs(dkKStep(1)-25/29)<1e-14);
for(const trace of traces)for(let i=1;i<trace.rows.length;i++)assert(trace.rows[i].upper<=trace.rows[i-1].upper+1e-12);
fs.writeFileSync('.agent/semester-03/robust-08/actual-ts.json',JSON.stringify({default:dkReadings(dkDefault),cases,steps,traces},null,2));console.log('PASS actual TS',cases.length,'configurations',steps.length,'K steps',traces.length,'traces');
