import fs from 'node:fs';
let c=fs.readFileSync('content/catalog.ts','utf8');
const start=c.indexOf('"slug": "robot-data"'),end=c.indexOf('"slug": "imitation-learning"',start);
if(start<0||end<0)throw Error('catalog block missing');
c=c.slice(0,start)+c.slice(start,end).replace('"status": "draft"','"status": "v1.3"')+c.slice(end);fs.writeFileSync('content/catalog.ts',c);
const p='.agent/delivery-tracker.md';let t=fs.readFileSync(p,'utf8');
t=t.replace(/^\| \[ \] 机器人数据 \(robot-data\).*$/m,'| [x] 机器人数据 (robot-data) | RLEARN-01学期3新写；10H2、五题五答、三原始Notebook；严格内核/Pyodide与数据审计见 .agent/semester-03/rlearn-01/acceptance.md |');fs.writeFileSync(p,t);
console.log('RLEARN-01 final metadata candidate; signature requires build and final checks.');
