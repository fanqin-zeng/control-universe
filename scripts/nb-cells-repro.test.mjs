/** 使用明确的假HTTP网关注入回收/重放故障，验证真实CLI的失败传播与清理。 */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {spawn} from 'node:child_process';

test('回收后重放前序cell失败必须上抛，且清理重建内核',async()=>{
  let creations=0,replayed=false;const active=new Set();
  const server=createServer(async(req,res)=>{
    let text='';for await(const chunk of req)text+=chunk;
    const body=text?JSON.parse(text):{};
    let status=200,result={outputs:[]};
    if(req.url==='/health')result={status:'ok'};
    else if(req.url==='/api/notebook'){
      creations++;active.add(body.notebook_id);result={notebook_id:body.notebook_id,status:'ready'};
    }else if(req.method==='DELETE'){
      active.delete(req.url.split('/')[3]);result={status:'ok'};
    }else if(body.code?.includes('print(sequence_value)')&&creations===1){
      active.delete(req.url.split('/')[3]);status=404;result={error:'reaped'};
    }else if(body.code?.includes('sequence_value =')&&creations===2){
      replayed=true;result={outputs:[{type:'error',ename:'ValueError',evalue:'I04_REPLAY_SENTINEL'}]};
    }
    res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(result));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{
    const child=spawn(process.execPath,['scripts/nb-cells.mjs','verify','scripts/fixtures/reproducibility/sequence.mdx','--require-kernel','--port',String(server.address().port)],{stdio:['ignore','pipe','pipe']});
    let output='';child.stdout.on('data',c=>output+=c);child.stderr.on('data',c=>output+=c);
    const timer=setTimeout(()=>child.kill(),15000);
    const code=await new Promise((resolve,reject)=>{child.on('error',reject);child.on('exit',resolve);});clearTimeout(timer);
    assert.equal(code,1);assert.match(output,/I04_REPLAY_SENTINEL/);assert.ok(replayed);assert.equal(creations,2);assert.equal(active.size,0);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
