import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const file='lib/embodied-loop.ts';
const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const box={exports:{}}; vm.runInNewContext(js,box);
const cases=[];
for(let delay=0;delay<=4;delay++) for(let hold=1;hold<=5;hold++) for(const gain of [.5,1,1.5,2,2.5,3]) for(const body of [.5,.75,1,1.25,1.5]){
  const p={delay,hold,gain,body}, r=box.exports.simulateEmbodied(p);
  if(r.x.some(v=>!Number.isFinite(v)||v < -2||v>4)) throw Error('fixed axes fail');
  cases.push({p,...r});
}
fs.writeFileSync('.agent/semester-03/embodied-01/ts-results.json',JSON.stringify(cases));
for(const p of [box.exports.embodiedDefaults,{delay:0,hold:5,gain:2,body:1},{delay:4,hold:1,gain:2,body:1},{delay:0,hold:1,gain:2,body:.5}]){
 const r=box.exports.simulateEmbodied(p); console.log(JSON.stringify({p,final:r.final,error:r.error,peak:r.peak,updates:r.updates,x1:r.x[1],x2:r.x[2],x20:r.x[20],x21:r.x[21]}));
}
console.log('Actual TS implementation: '+cases.length+' configurations; all states inside fixed axes [-2,4].');
