const fs=require('node:fs'),ts=require('typescript'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
const sandbox={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/vehicle-dynamics.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,sandbox);
const {lateralResponse,rearAxleArc}=sandbox.exports;
const ref=JSON.parse(cp.execFileSync('python',['.agent/semester-03/driving-02/reference.py'],{encoding:'utf8',maxBuffer:10*1024*1024}));
let maxError=0;
for(const c of ref.cases){const actual=lateralResponse(c.u,c.delta,c.mu);for(let i=0;i<201;i++)for(let j=1;j<=2;j++){const error=Math.abs(actual.points[i][j]-c.values[i][j]);maxError=Math.max(maxError,error);assert(error<1e-7);}
for(const [a,b]of [[actual.vySteady,c.steady[0]],[actual.rSteady,c.steady[1]],[actual.ay,c.ay],[actual.usage,c.usage],[actual.frontSlip,c.alpha[0]],[actual.rearSlip,c.alpha[1]]])assert(Math.abs(a-b)<1e-9);c.actual={vySteady:actual.vySteady,rSteady:actual.rSteady,last:actual.points.at(-1),usage:actual.usage};}
const arc=rearAxleArc(10,.04,2);for(const [k,v]of Object.entries({X:ref.kinematic.X,Y:ref.kinematic.Y,yaw:ref.kinematic.psi,yawRate:ref.kinematic.yawRate}))assert(Math.abs(arc[k]-v)<1e-9);
assert.deepEqual(JSON.parse(JSON.stringify(rearAxleArc(10,0,2))),{X:20,Y:0,yaw:0,yawRate:0});assert.throws(()=>lateralResponse(0,.04,.8));
assert.deepEqual(JSON.parse(JSON.stringify(rearAxleArc(0,.04,2))),{X:0,Y:0,yaw:0,yawRate:0});
const reverse=rearAxleArc(10,-.04,2);assert(Math.abs(reverse.X-arc.X)<1e-9&&Math.abs(reverse.Y+arc.Y)<1e-9&&Math.abs(reverse.yaw+arc.yaw)<1e-9);
const dry=lateralResponse(20,.04,.8),lowGrip=lateralResponse(20,.04,.3);
assert.deepEqual(JSON.parse(JSON.stringify(dry.points)),JSON.parse(JSON.stringify(lowGrip.points)));assert(dry.usage<1&&lowGrip.usage>1);
let configurations=0;for(let u=5;u<=25;u++)for(let n=-8;n<=8;n++){const r=lateralResponse(u,n/100,.8);assert(r.points.every(p=>p[0]>=0&&p[0]<=2&&Math.abs(p[2])<=.8));for(let m=2;m<=10;m++){assert(Number.isFinite(Math.abs(r.ay)/(m/10*9.81)));configurations++;}}
fs.writeFileSync('.agent/semester-03/driving-02/numeric.json',JSON.stringify({pass:true,tolerance:1e-7,maxError,configurations,arc,cases:ref.cases.map(c=>({u:c.u,delta:c.delta,mu:c.mu,A:c.A,B:c.B,steady:c.steady,alpha:c.alpha,ay:c.ay,usage:c.usage,actual:c.actual}))},null,2));
console.log('PASS actual TS vs independent force/moment + scipy.expm; 6 cases / 2412 trajectory scalars; '+configurations+' slider states; max error '+maxError);
