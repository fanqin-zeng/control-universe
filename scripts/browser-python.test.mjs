import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

test('shared browser worker routes requests, rejects all on stop/timeout, and restarts cleanly', async () => {
  const workers = [], timers = [];
  class FakeWorker {
    constructor(url) {this.url = url; this.messages = []; workers.push(this);}
    postMessage(message) {this.messages.push(message);}
    terminate() {this.terminated = true;}
  }
  const module = {exports: {}};
  const source = ts.transpileModule(readFileSync('lib/browser-python.ts','utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020}}).outputText;
  new Function('require','module','exports','Worker','setTimeout','clearTimeout',source)(() => ({withBasePath: p => '/control-universe'+p}),module,module.exports,FakeWorker,fn => {timers.push(fn); return timers.length;},() => {});
  const api = module.exports;
  const first = api.browserPython('one','setup','print(1)');
  assert.equal(workers[0].url,'/control-universe/python-worker.js');
  workers[0].onmessage({data:{id:workers[0].messages[0].id,outputs:[{type:'text',text:'1'}]}});
  assert.deepEqual(await first,[{type:'text',text:'1'}]);
  const a = api.browserPython('one','','a'), b = api.browserPython('two','','b');
  assert.equal(workers.length,1);
  const rejects = [assert.rejects(a,/已停止/),assert.rejects(b,/已停止/)];
  api.stopBrowserPython(); await Promise.all(rejects); assert(workers[0].terminated);
  const next = api.browserPython('one','','next');
  assert.equal(workers.length,2);
  const timeout = assert.rejects(next,/已停止/); timers.at(-1)(); await timeout;
  assert(workers[1].terminated);
});
