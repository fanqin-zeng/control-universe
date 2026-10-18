import {test} from'node:test';import assert from'node:assert/strict';import{spawnSync}from'node:child_process';
test('verify rejects invalid explicit ports before contacting a service',()=>{
  for(const port of['0','65536','wrong']){
    const result=spawnSync(process.execPath,['scripts/verify-lesson.mjs','nonlinear/passivity-control'],{encoding:'utf8',env:{...process.env,WIKI_VERIFY_PORT:port}});
    assert.notEqual(result.status,0);assert.match(result.stderr,/WIKI_VERIFY_PORT must be an integer from 1 to 65535/);
  }
});
