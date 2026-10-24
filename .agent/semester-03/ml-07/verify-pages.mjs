/** Run the unchanged verifier against a Pages preview by adapting only its URL prefix. */
import {createServer,request} from 'node:http';import {spawn} from 'node:child_process';
const upstream=Number(process.env.ML07_PREVIEW_PORT||8232);
const server=createServer((req,res)=>{
 const suffix=req.url.endsWith('/')?req.url:req.url+'/';
 const proxy=request({hostname:'127.0.0.1',port:upstream,path:'/control-universe'+suffix,method:'GET'},r=>{res.writeHead(r.statusCode,r.headers);r.pipe(res);});
 proxy.on('error',e=>{res.writeHead(502);res.end(String(e));});proxy.end();
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;console.log(JSON.stringify({adapterPort:port,upstream,basePath:'/control-universe',htmlRewritten:false}));
try{const code=await new Promise(resolve=>{const child=spawn(process.execPath,['scripts/verify-lesson.mjs','machine-learning/representation-learning'],{stdio:'inherit',env:{...process.env,WIKI_VERIFY_PORT:String(port)}});child.on('exit',resolve);});process.exitCode=code??1;}finally{await new Promise(resolve=>server.close(resolve));}
