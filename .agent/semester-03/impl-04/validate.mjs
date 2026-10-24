import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const e='.agent/semester-03/impl-04/',read=p=>JSON.parse(fs.readFileSync(e+p,'utf8'));
const source=fs.readFileSync('content/implementation/controller-discretization-practice.mdx','utf8').replace(/\r\n/g,'\n');
const hash=createHash('sha256').update(source).digest('hex'),num=read('reconciliation.json'),ref=read('reference.json'),py=read('pyodide.json');
assert(num.pass);assert.equal(num.sourceHash,hash);assert.equal(py.lessons[0].sourceHash,hash);assert(py.complete);assert(py.lessons[0].notebooks.every(n=>n.status==='passed'&&n.cells.every(c=>c.status==='passed')));
const builds=read('build-results.json');assert.equal(builds.length,2);assert(builds.every(b=>b.exit===0));assert.equal(read('build-origin.json').sourceHash,hash);
const layout=read('narrow-layout.json');assert.equal(layout.width,layout.scroll);assert(layout.canvas>200);assert(layout.table>layout.region);
const pagesLayout=read('pages-narrow-layout.json');assert.equal(pagesLayout.width,pagesLayout.scroll);assert(pagesLayout.canvas>200);assert(pagesLayout.table>pagesLayout.region);
const css=read('css-verification.json');assert(css.pass&&css.configMatchesWorkspace&&css.css.every(c=>c.typographyCompiled));assert(css.articleWidth<css.viewport-100);
for(const name of ['native-dom.json','pages-dom.json']){const dom=read(name);assert.equal(dom.h1.length,1);assert.equal(dom.h2.length,9);assert.equal(dom.katex,0);assert.equal(dom.canvas,1);assert.deepEqual(dom.missing,[]);assert.deepEqual(dom.duplicates,[]);assert(dom.images.every(i=>i.loaded));assert.equal(dom.width,dom.scroll);}
assert.deepEqual(read('pages-errors.json'),[]);
let compared=0;function near(a,b,tol=5.1e-7){assert(Math.abs(a-b)<=tol,`${a} != ${b}`);compared++;}
for(const row of read('native-interactions.json')){
 const expected=ref.cases.find(v=>v.Ts===Number(row.Ts)&&v.F===Number(row.F)&&v.signal===row.signal);assert(expected);
 const metrics=row.metrics.match(/-?\d+(?:\.\d+)?/g).map(Number);['first','fixedFirst','finalFloat','finalFixed','maxError','clipped'].forEach((k,i)=>near(metrics[i],expected[k]));
 for(const [name,pattern] of [['a',/a=(-?[\d.]+)/],['b',/b0=b1=(-?[\d.]+)/],['A',/A=(-?[\d.]+)/],['B',/B=(-?[\d.]+)/],['aq',/aq=(-?[\d.]+)/]])near(Number(row.coeff.match(pattern)[1]),expected[name]);
}
const names={'阶跃':'step','正负脉冲':'pulse','零输入衰减':'decay'};
const rows=source.split('\n').filter(s=>/^\| (阶跃|正负脉冲|零输入衰减) \|/.test(s));assert.equal(rows.length,9);
for(const row of rows){const c=row.split('|').slice(1,-1).map(s=>s.trim()),expected=ref.cases.find(v=>v.Ts===.02&&v.F===Number(c[1])&&v.signal===names[c[0]]);['finalFloat','finalFixed','maxError','clipped'].forEach((k,i)=>near(Number(c[i+2]),expected[k],5.1e-9));}
const timing=source.split('\n').filter(s=>/^\| 0\.(02|1|2) \|/.test(s));assert.equal(timing.length,3);
for(let i=0;i<3;i++){const c=timing[i].split('|').slice(1,-1).map(s=>s.trim());near(Number(c[1]),ref.timing[i].pole,5.1e-9);near(Number(c[2]),ref.timing[i].rho,5.1e-9);}
const outputs=[];
for(const name of ['native-notebook-ui.json','pages-notebook-ui.json']){
 const report=read(name);assert.deepEqual(report.busy,[]);assert.equal(report.outputs.length,3);
 // Compare actual UI streams to the native kernel audit, not only success badges.
 const first=JSON.parse(report.outputs[0].split('\n')[0]);near(first.a,19/21,1e-12);near(first.stateFirst,31/84,1e-12);
 const fixed=JSON.parse(report.outputs[1].split('\n')[0]);assert.equal(fixed.length,9);
 for(let i=0;i<9;i++)for(const key of ['finalFloat','finalFixed','maxError','clipped'])near(fixed[i][key],num.values[1].table[i][key],1e-12);
 const time=JSON.parse(report.outputs[2].split('\n')[0]);for(let i=0;i<3;i++)for(const key of ['pole','rho'])near(time[i][key],ref.timing[i][key],1e-12);
 outputs.push(name);
}
const summary={pass:true,sourceHash:hash,configs:num.configs,tsQuantities:num.tsQuantities,tsError:num.tsError,maxNotebookError:num.maxError,notebooks:3,cells:6,compared,h2:9,nativeAndPagesNotebookUi:true,narrowLayout:pagesLayout,nativeDraftLayout:layout,postcssHash:css.postcssHash,builds};
fs.writeFileSync(e+'validation.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary));
