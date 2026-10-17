import {readFileSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {extractNotebooks} from './lib-mdx.mjs';
const keys = ['math/calculus-basics', 'math/complex-numbers'];
const lessons = keys.map(key => ({key, notebooks: extractNotebooks(readFileSync('content/'+key+'.mdx','utf8')).map(nb => ({setup: nb.setup?.value || '', cells: nb.cells.map(c => c.value)}))}));
const python = `import sys,json,io,contextlib,sympy
reference={}
for lesson in json.load(sys.stdin):
 reference[lesson['key']]=[]
 for nb in lesson['notebooks']:
  scope={};exec(nb['setup'],scope);outputs=[]
  for cell in nb['cells']:
   stream=io.StringIO()
   with contextlib.redirect_stdout(stream):exec(cell,scope)
   outputs.append(stream.getvalue())
  reference[lesson['key']].append(outputs)
print(json.dumps({'reference':reference,'python':sys.version,'sympy':sympy.__version__},ensure_ascii=False))`;
const result = spawnSync('python',['-X','utf8','-c',python],{input:JSON.stringify(lessons),encoding:'utf8'});
if(result.status!==0) throw Error(result.stderr);
const data = JSON.parse(result.stdout);
writeFileSync('docs/deployment/pyodide-math-reference.json',JSON.stringify(data.reference,null,2)+'\n');
writeFileSync('docs/deployment/pyodide-math-reference-meta.json',JSON.stringify({python:data.python,sympy:data.sympy,sourceHashes:Object.fromEntries(keys.map(key => [key,createHash('sha256').update(readFileSync('content/'+key+'.mdx','utf8').replace(/\r\n/g,'\n')).digest('hex')]))},null,2)+'\n');
console.log('Captured native Python reference for both math lessons');
