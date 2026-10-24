import fs from 'node:fs';import vm from 'node:vm';import ts from 'typescript';
const source=fs.readFileSync('lib/multimodal-observation.ts','utf8');
const box={exports:{}};vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,box);
const cases=[];
for(const age of [0,.05,.1,.2,.25,.4])for(const speed of [-40,-20,0,20,40])for(const rho of [-1,-.5,0,.5,1])for(const vision of [true,false])for(const proprio of [true,false]){
 const p={age,speed,rho,vision,proprio};const r=box.exports.evaluateMultimodal(p);cases.push({p,r});
 if(r.mse!==null&&(r.mse<0||r.mse>272))throw Error('fixed axis exceeded');
}
let rejected=0;for(const p of [{age:-1},{rho:1.1},{speed:NaN}])try{box.exports.evaluateMultimodal({...box.exports.multimodalDefaults,...p});}catch{rejected++;}
if(rejected!==3)throw Error('invalid input accepted');
fs.writeFileSync('.agent/semester-03/embodied-02/ts-results.json',JSON.stringify(cases));
for(const age of [0,.2,.25,.4])console.log(JSON.stringify({age,...box.exports.evaluateMultimodal({...box.exports.multimodalDefaults,age})}));
console.log(`Actual TS: ${cases.length} cases; fixed MSE axis [0,272]; invalid input rejected=${rejected}`);
