const fs=require('node:fs'),ts=require('typescript'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const code=ts.transpileModule(fs.readFileSync('lib/driving-system.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const sandbox={exports:{}};vm.runInNewContext(code,sandbox);
const fn=sandbox.exports.stoppingBudget;
const rows=JSON.parse(cp.execFileSync('python',['.agent/semester-03/driving-01/reference.py'],{encoding:'utf8'}));
for(const row of rows){const got=fn({speed:row.v,delay:row.tau,gap:row.d,deceleration:row.b});for(const k of ['travel','required','reserve'])assert(Math.abs(got[k]-row[k])<1e-9,k);row.ts=got;}
// Every slider combination has bounded plotted values; no copied implementation for this check.
let count=0;for(let v=0;v<=25;v++)for(let delay=0;delay<=20;delay++)for(let b=2;b<=8;b+=0.5){const r=fn({speed:v,delay:delay/20,deceleration:b,gap:50});assert(r.required>=0&&r.required<=200);count++;}
assert.throws(()=>fn({speed:20,delay:0.3,deceleration:0,gap:50}));
fs.writeFileSync('.agent/semester-03/driving-01/numeric.json',JSON.stringify({pass:true,tolerance:1e-9,rows,axisConfigurations:count},null,2));
console.log('PASS real TS vs exact Fraction integration; '+rows.length+' cases; '+count+' plot combinations');
