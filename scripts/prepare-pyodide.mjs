import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {extractNotebooks} from './lib-mdx.mjs';
import './check-python-support.mjs';
import './prepare-python-expansion.mjs';
const manifest = JSON.parse(readFileSync('scripts/pyodide-assets.json', 'utf8'));
mkdirSync('public/pyodide', {recursive: true});
const queue = [...manifest.files];
await Promise.all(Array.from({length: 4}, async () => {
  while (queue.length) {
    const file = queue.shift(), path = 'public/pyodide/' + file.file;
    let data = existsSync(path) ? readFileSync(path) : null;
    if (!data || createHash('sha256').update(data).digest('hex') !== file.sha256) {
      const response = await fetch(file.url, {signal: AbortSignal.timeout(120000)});
      if (!response.ok) throw Error('Download failed: ' + file.file);
      data = Buffer.from(await response.arrayBuffer());
      if (createHash('sha256').update(data).digest('hex') !== file.sha256) throw Error('SHA256 mismatch: ' + file.file);
      writeFileSync(path, data);
    }
  }
}));
const lessons = ['math/calculus-basics', 'math/complex-numbers'].map(key => ({key, notebooks: extractNotebooks(readFileSync('content/' + key + '.mdx', 'utf8')).map(nb => ({title: nb.title, setup: nb.setup?.value || '', cells: nb.cells.map(c => c.value)}))}));
const metadata = JSON.parse(readFileSync('docs/deployment/pyodide-math-reference-meta.json', 'utf8'));
for (const [key, hash] of Object.entries(metadata.sourceHashes)) {
  if (createHash('sha256').update(readFileSync('content/' + key + '.mdx', 'utf8').replace(/\r\n/g, '\n')).digest('hex') !== hash) throw Error('Math source changed; regenerate and review reference: ' + key);
}
const reference = JSON.parse(readFileSync('docs/deployment/pyodide-math-reference.json', 'utf8'));
const controlTests = JSON.parse(readFileSync('scripts/python-control-probes.json', 'utf8'));
writeFileSync('public/python-trial.json', JSON.stringify({lessons, reference, controlTests}));
console.log(JSON.stringify({version: manifest.version, files: manifest.files.length, bytes: manifest.files.reduce((n,f) => n+f.bytes, 0), mathNotebooks: lessons.reduce((n,l) => n+l.notebooks.length, 0)}));
