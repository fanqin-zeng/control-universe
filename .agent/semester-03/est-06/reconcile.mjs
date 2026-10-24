import fs from 'node:fs';import ts from 'typescript';import assert from 'node:assert/strict';import {execFileSync}from'node:child_process';
const dir='.agent/semester-03/est-06/',mod={};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/particle-filter.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(mod);
const rows=[];
for(const noise of [.25,1,4])for(const observation of [1,4])rows.push(mod.particleExperiment('discrete',256,0,noise,observation,7));
for(const count of [64,256,1024])for(const mu of [0,2])for(const noise of [.25,1,4])for(const observation of [1,4])for(const seed of [7,19,43])rows.push(mod.particleExperiment('gaussian',count,mu,noise,observation,seed));
for(const row of rows)for(const points of [row.reference.curve,row.weightedCurve,row.resampledCurve]){let last=-1;for(const [x,cdf]of points){assert(x>=-6&&x<=6);assert(cdf>=-1e-12&&cdf<=1+1e-12&&cdf>=last-1e-12);last=cdf;}}
let rejected=0;for(const action of [()=>mod.normalizeLogWeights([]),()=>mod.normalizeLogWeights([-Infinity,-Infinity]),()=>mod.normalizeLogWeights([NaN,0]),()=>mod.normalizeLogWeights([Infinity,0]),()=>mod.systematicAncestors([.5,.5],.5),()=>mod.systematicAncestors([.2,.2],0),()=>mod.particleExperiment('gaussian',256,0,1,4,0),()=>mod.particleExperiment('gaussian',1,0,1,4,7)]){assert.throws(action);rejected++;}
const other={rejected,zeroWeights:mod.systematicAncestors([0,1],0),boundary:mod.systematicAncestors([.5,.5],0),underflow:mod.normalizeLogWeights([-1000,-1001])};
fs.writeFileSync(dir+'actual-ts.json',JSON.stringify({rows,other}));
const reference=JSON.parse(execFileSync('python',[dir+'reference.py'],{encoding:'utf8',env:{...process.env,PYTHONIOENCODING:'utf-8'}}));
const {renderedHeadings}=await import('../../../scripts/rendered-headings.mjs');const headings=await renderedHeadings(fs.readFileSync('content/estimation/particle-filter.mdx','utf8'),'estimation/particle-filter');assert.equal(headings.h2.length,10);
const defaultResult=rows.find(r=>r.mode==='discrete'&&r.noise===1&&r.observation===4);
const report={pass:true,configurations:rows.length,gaussianConfigurations:108,referenceCdfPoints:26028,discreteConfigurations:6,reference,default:defaultResult,other,headings};
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2));console.log(JSON.stringify({pass:true,configurations:rows.length,reference,default:{before:defaultResult.before,after:defaultResult.after,weights:defaultResult.weights,ancestors:defaultResult.ancestors},other}));
