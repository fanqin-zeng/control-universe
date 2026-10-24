const fs=require('node:fs'),ts=require('typescript'),vm=require('node:vm');
const source=fs.readFileSync('lib/robot-system.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const sandbox={exports:{}};vm.runInNewContext(code,sandbox);
const all=[];
for(let m=1;m<=4;m+=.5)for(let u=-4;u<=4;u+=.5)for(let i=-5;i<=5;i++) {
 const v=i/10,r=sandbox.exports.robotSlide(m,u,v);
 all.push({m,u,v,...JSON.parse(JSON.stringify(r))});
}
fs.writeFileSync('.agent/semester-03/robot-01/component-values.json',JSON.stringify(all));
console.log('Executed real TS robotSlide:',all.length,'configurations,',all.length*101,'samples');
