const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript');
const source=fs.readFileSync('lib/uncertainty-model.ts','utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const moduleUnderTest={exports:{}};new Function('exports','module',compiled)(moduleUnderTest.exports,moduleUnderTest);
const cases=[];
for(const K of [.8,1,1.2])for(const T of [.8,1,1.3])for(const gain of [.5,1,2,4])for(const w of [.01,.1,1,10,100]){
 const result=moduleUnderTest.exports.uncertaintyPoint(K,T,gain,w);
 assert(Object.values(result).every(Number.isFinite));assert(result.relative<=result.weight+1e-12);
 if(gain===1)assert(Math.abs(result.svInput-result.svOutput)<1e-12);
 cases.push({K,T,gain,...result});
}
const defaultValue=moduleUnderTest.exports.uncertaintyPoint(.8,1.3,2,1);
fs.writeFileSync('.agent/semester-03/robust-02/actual-ts.json',JSON.stringify({cases,defaultValue},null,2));
console.log('PASS actual TypeScript module: '+cases.length+' configurations; default '+JSON.stringify(defaultValue));
