const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript'),Module=require('node:module');
const source=fs.readFileSync('lib/robust-performance.ts','utf8');const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const mod=new Module(require('node:path').resolve('lib/robust-performance.ts'));mod._compile(js,'robust-performance.ts');const {performancePoint,weightEnvelope}=mod.exports;
const cases=[];for(const k of [5,9,10,18,19,25])for(const d of [-1,-.75,0,.45,1])for(const wb of [.5,2,5]){
 const p=performancePoint(k,d,wb);assert(Number.isFinite(p.actual));cases.push({k,d,wb,...p});
}
const envelope=[];for(const wb of [.5,2,5])for(let i=0;i<=200;i++){const w=10**(-3+i*.025);envelope.push({wb,w,value:weightEnvelope(w,wb)});}
fs.writeFileSync('.agent/semester-03/robust-04/actual-ts.json',JSON.stringify({cases,envelope,default:performancePoint(10,-1,2)},null,2));
console.log('PASS actual transpiled TS invoked: '+cases.length+' configurations / '+envelope.length+' weight points');
