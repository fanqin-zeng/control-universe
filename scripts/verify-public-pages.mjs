import {readFileSync, writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {parseCatalog} from './lib-catalog.mjs';
import {lessonRedirects} from '../lib/lesson-compat.mjs';

// No credentials: validate the same public URLs a reader can request.
const base = 'https://fanqing-zeng.github.io/control-universe';
const expected = process.argv[2];
assert.match(expected || '', /^[0-9a-f]{40}$/);
const results = [];
async function read(path) {
  const response = await fetch(base + path, {signal: AbortSignal.timeout(30000)});
  assert.equal(response.status, 200, path);
  const text = await response.text();
  results.push({path, status: response.status, bytes: Buffer.byteLength(text)});
  return text;
}
const release = JSON.parse(await read('/release.json'));
assert.equal(release.sourceCommit, expected);
assert.equal(release.sourceDirty, false);
assert([false, 'browser-math-trial','browser-verified-notebooks'].includes(release.pythonExecution));
assert.equal(release.basePath, '/control-universe');
const home = await read('/');
const catalog = parseCatalog(readFileSync('content/catalog.ts', 'utf8'));
const pythonPolicy = release.pythonExecution === 'browser-verified-notebooks' ? JSON.parse(readFileSync('lib/python-support.json','utf8')) : null;
const queue = catalog.flatMap(ch => ch.lessons.map(lesson => ({ch, lesson})));
await Promise.all(Array.from({length: 4}, async () => {
  while (queue.length) {
    const {ch, lesson} = queue.shift();
    const html = await read('/' + ch.slug + '/' + lesson.slug + '/');
    assert(!html.includes('class="katex-error"'));
    assert(html.includes('/control-universe/katex/katex.min.css'));
    if (lesson.status !== 'empty') assert.equal((html.match(/<h2[ >]/g) || []).length, lesson.subsections.length);
    if (pythonPolicy) {
      const entries=pythonPolicy.lessons[ch.slug+'/'+lesson.slug]?.notebooks || [];
      if(entries.some(n=>n.status==='enabled')) assert(html.includes(pythonPolicy.workerHash));
      assert.equal((html.match(/data-python-mode="browser"/g)||[]).length,entries.filter(n=>n.status==='enabled').length);
      assert.equal((html.match(/data-python-mode="code"/g)||[]).length,entries.filter(n=>n.status==='code').length);
      if(entries.some(n=>n.status==='code')) assert(html.includes('浏览器暂不运行此实验'));
    }
  }
}));
for (const [old, target] of lessonRedirects) {
  const html = await read('/' + old + '/');
  assert(html.includes('/control-universe/' + target + '/'));
  assert(html.includes('location.search+location.hash'));
}
const assets = [...new Set([...home.matchAll(/(?:src|href)="(\/control-universe\/(?:_next|katex)\/[^"?#]+)"/g)].map(m => m[1].slice('/control-universe'.length)))];
for (const asset of assets) await read(asset);
const css = await read('/katex/katex.min.css');
const font = css.match(/url\((?:["'])?(fonts\/[^)"']+\.woff2)/)?.[1];
assert(font, 'KaTeX font URL');
await read('/katex/' + font);
await read('/images/adaptive-control-concept.png');
const missing = await fetch(base + '/nonexistent-release-test/', {signal: AbortSignal.timeout(30000)});
assert.equal(missing.status, 404);
const output = {pass: true, testedAt: new Date().toISOString(), base, release, lessons: catalog.reduce((n,ch) => n+ch.lessons.length, 0), legacyRoutes: lessonRedirects.length, missingStatus: missing.status, results};
writeFileSync(process.argv[3] || 'docs/deployment/first-release-http.json', JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({...output, results: results.length}));
