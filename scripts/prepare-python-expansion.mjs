import {writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pythonInventory} from './python-inventory.mjs';
const lessons=pythonInventory();
const workerHash=createHash('sha256').update(readFileSync('public/python-worker.js','utf8').replace(/\r\n/g,'\n')).digest('hex');
writeFileSync('public/python-expansion.json',JSON.stringify({workerHash,lessons}));
console.log(JSON.stringify({lessons:lessons.length,notebooks:lessons.reduce((n,l)=>n+l.notebooks.length,0),cells:lessons.reduce((n,l)=>n+l.notebooks.reduce((m,b)=>m+b.cells.length,0),0)}));
