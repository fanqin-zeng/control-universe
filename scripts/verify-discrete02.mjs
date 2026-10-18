import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash, randomUUID} from 'node:crypto';
import {request} from 'node:http';
import {extractNotebooks} from './lib-mdx.mjs';
import {renderedHeadings} from './rendered-headings.mjs';

const dir = '.agent/semester-03/discrete-02/';
const key = 'discrete-sampled/discrete-time-systems';
const source = fs.readFileSync('content/' + key + '.mdx', 'utf8');
const port = Number(process.env.JUPYTER_PORT || 8891);
function http(path, method, body) {
  return new Promise((resolve, reject) => {
    const data = body ? Buffer.from(JSON.stringify(body)) : null;
    const req = request({hostname:'127.0.0.1', port, path, method,
      headers:data ? {'Content-Type':'application/json', 'Content-Length':data.length} : {}}, res => {
      let raw = ''; res.on('data', s => raw += s);
      res.on('end', () => {try { assert.equal(res.statusCode, 200, raw); resolve(JSON.parse(raw)); } catch (e) { reject(e); }});
    });
    req.on('error', reject); req.setTimeout(120000, () => req.destroy(Error('timeout')));
    if (data) req.write(data); req.end();
  });
}
const independent = JSON.parse(execFileSync('python', [dir + 'reference.py'], {encoding:'utf8'}));
const nbs = extractNotebooks(source);
assert.equal(nbs.length, 3);
assert(nbs.every(nb => nb.cells.length === 1 && nb.parseErrors.length === 0));
const report = {pass:true, sourceHash:createHash('sha256').update(source.replace(/\r\n/g,'\n')).digest('hex'), independent, notebooks:[]};
// Queries inspect variables produced by the ORIGINAL cells; they do not replace those cells.
const queries = [
  'import json\nprint("AUDIT:"+json.dumps({"total":x.tolist(),"initial":natural.tolist(),"forced":forced.tolist()}))',
  'import json\nprint("AUDIT:"+json.dumps({"states":states.tolist()}))',
  'import json\nprint("AUDIT:"+json.dumps({"impulse":h.tolist(),"convolution":x.tolist()}))'
];
const close = (actual, expected) => {
  if (Array.isArray(expected)) { assert.equal(actual.length, expected.length); expected.forEach((v,i) => close(actual[i],v)); }
  else { assert(Number.isFinite(actual)); assert(Math.abs(actual-expected) <= 1e-12, `${actual} != ${expected}`); }
};
for (const [index, nb] of nbs.entries()) {
  const id = 'discrete02-' + randomUUID();
  try {
    await http('/api/notebook','POST',{notebook_id:id,setup_code:''});
    const outputs = [];
    for (const code of [nb.setup.value,...nb.cells.map(c => c.value)]) {
      const out = await http('/api/notebook/'+id+'/execute','POST',{code});
      assert(Array.isArray(out.outputs));
      assert(!out.outputs.some(o => o.type === 'error'), JSON.stringify(out.outputs));
      outputs.push(out.outputs.map(o => o.type === 'image' ? {type:'image',bytes:o.data.length} : o));
    }
    const audit = await http('/api/notebook/'+id+'/execute','POST',{code:queries[index]});
    const text = audit.outputs.filter(o=>o.type==='stream').map(o=>o.text).join('');
    const values = JSON.parse(text.match(/AUDIT:(.+)/)[1]);
    for (const [name, actual] of Object.entries(values)) close(actual, independent[name]);
    report.notebooks.push({title:nb.title, outputs, values});
  } finally { await http('/api/notebook/'+id,'DELETE'); }
}
report.rendered = await renderedHeadings(source,key);
assert.equal(report.rendered.h2.length,8);
assert.equal(new Set(report.rendered.ids).size,report.rendered.ids.length);
fs.writeFileSync(dir+'reconciliation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:true,sourceHash:report.sourceHash,notebooks:3,cells:3,h2:8,independent}));
